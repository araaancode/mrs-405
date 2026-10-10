// app/api/upload/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 10;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
];

const EXT_MAP = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf",
};

const UPLOAD_FOLDERS = {
    documents: "uploads/documents",
    avatars: "uploads/avatars",
    halls: "uploads/halls",
    buses: "uploads/buses",
};

export async function POST(request) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await request.formData();

        const files = [
            ...formData.getAll("images"),
            ...formData.getAll("file"),
            ...formData.getAll("documents"),
        ].filter(
            (f) =>
                f &&
                typeof f === "object" &&
                typeof f.size === "number" &&
                f.size > 0
        );

        const uploadType = String(formData.get("type") || "documents");

        if (!files.length) {
            return NextResponse.json(
                { error: "حداقل یک فایل الزامی است" },
                { status: 400 }
            );
        }

        if (files.length > MAX_FILES) {
            return NextResponse.json(
                { error: `حداکثر ${MAX_FILES} فایل مجاز است` },
                { status: 400 }
            );
        }

        const folderKey =
            UPLOAD_FOLDERS[uploadType] || UPLOAD_FOLDERS.documents;
        const uploadDir = join(process.cwd(), "public", folderKey);

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (mkdirErr) {
            console.error("Cannot create upload dir:", mkdirErr);
            return NextResponse.json(
                { error: "خطا در ساخت پوشه‌ی آپلود" },
                { status: 500 }
            );
        }

        const uploadedUrls = [];
        const uploadedFiles = [];

        for (const file of files) {
            if (!ALLOWED_TYPES.includes(file.type)) {
                return NextResponse.json(
                    { error: `نوع فایل ${file.name} مجاز نیست` },
                    { status: 400 }
                );
            }

            if (file.size > MAX_SIZE) {
                return NextResponse.json(
                    { error: `حجم فایل ${file.name} بیش از ۵MB است` },
                    { status: 400 }
                );
            }

            const ext = EXT_MAP[file.type] || "bin";
            const filename = `${session.user.id}-${randomUUID()}.${ext}`;
            const filepath = join(uploadDir, filename);

            const bytes = await file.arrayBuffer();
            await writeFile(filepath, Buffer.from(bytes));

            const url = `/${folderKey}/${filename}`;
            uploadedUrls.push(url);
            uploadedFiles.push({
                url,
                name: file.name,
                size: file.size,
                type: file.type,
                uploaded_at: new Date(),
            });
        }

        if (uploadType === "documents") {
            await User.findByIdAndUpdate(
                session.user.id,
                { $push: { documents: { $each: uploadedFiles } } },
                { new: true, runValidators: true }
            );
        }

        return NextResponse.json({
            success: true,
            message: `${files.length} فایل با موفقیت آپلود شد`,
            urls: uploadedUrls,
            files: uploadedFiles,
        });
    } catch (error) {
        console.error("=== UPLOAD ERROR ===");
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);

        return NextResponse.json(
            { error: error.message || "خطا در آپلود فایل" },
            { status: 500 }
        );
    }
}
