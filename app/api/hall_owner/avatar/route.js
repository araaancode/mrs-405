import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";

/* ============================================================
   تنظیمات
   ============================================================ */
const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "avatars");

const EXT_MAP = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

/* ============================================================
   POST — آپلود آواتار
   ============================================================ */
export async function POST(req) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("avatar");

        /* ---------- اعتبارسنجی ---------- */
        if (!file || typeof file === "string") {
            return Response.json(
                { message: "فایلی ارسال نشده است" },
                { status: 400 }
            );
        }

        if (file.size > MAX_SIZE) {
            return Response.json(
                { message: "حجم فایل نباید بیشتر از ۲ مگابایت باشد" },
                { status: 413 }
            );
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return Response.json(
                { message: "فرمت فایل پشتیبانی نمی‌شود (jpg, png, webp)" },
                { status: 415 }
            );
        }

        /* ---------- ذخیره فایل ---------- */
        await mkdir(UPLOAD_DIR, { recursive: true });

        const ext = EXT_MAP[file.type];
        const filename = `${session.user.id}-${randomUUID()}.${ext}`;
        const filepath = join(UPLOAD_DIR, filename);

        const bytes = await file.arrayBuffer();
        await writeFile(filepath, Buffer.from(bytes));

        const avatarUrl = `/uploads/avatars/${filename}`;

        /* ---------- حذف آواتار قبلی ---------- */
        const currentUser = await User.findById(session.user.id)
            .select("avatar")
            .lean();

        if (currentUser?.avatar?.startsWith("/uploads/avatars/")) {
            const oldPath = join(process.cwd(), "public", currentUser.avatar);
            await unlink(oldPath).catch(() => {});
        }

        /* ---------- ذخیره در دیتابیس ---------- */
        const user = await User.findByIdAndUpdate(
            session.user.id,
            { $set: { avatar: avatarUrl } },
            { new: true, runValidators: true }
        )
            .select("-password -otp_code -otp_expires")
            .lean();

        return Response.json({
            message: "آواتار با موفقیت به‌روزرسانی شد",
            avatar: avatarUrl,
            user,
        });
    } catch (err) {
        console.error("[POST /api/user/avatar]", err);
        return Response.json(
            { message: "خطا در آپلود آواتار" },
            { status: 500 }
        );
    }
}