export const dynamic = "force-dynamic";

// app/api/user/avatar/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

        await mkdir(UPLOAD_DIR, { recursive: true });

        const ext = EXT_MAP[file.type];
        const filename = `${session.user.id}-${randomUUID()}.${ext}`;
        const filepath = join(UPLOAD_DIR, filename);

        const bytes = await file.arrayBuffer();
        await writeFile(filepath, Buffer.from(bytes));

        const avatarUrl = `/uploads/avatars/${filename}`;

        const currentUser = await User.findById(session.user.id)
            .select("avatar")
            .lean();

        if (currentUser?.avatar?.startsWith("/uploads/avatars/")) {
            const oldPath = join(process.cwd(), "public", currentUser.avatar);
            await unlink(oldPath).catch(() => {});
        }

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

/* ============================================================
   DELETE — حذف آواتار
   ============================================================ */
export async function DELETE(req) {
    console.log("🗑️ [DELETE /api/user/avatar] Request received");

    try {
        await dbConnect();
        console.log("✅ [DELETE] DB connected");

        const session = await getServerSession(authOptions);
        console.log("👤 [DELETE] Session user id:", session?.user?.id);

        if (!session?.user?.id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const currentUser = await User.findById(session.user.id)
            .select("avatar")
            .lean();

        console.log("🖼️ [DELETE] Current avatar:", currentUser?.avatar);

        if (!currentUser) {
            return Response.json(
                { message: "کاربر یافت نشد" },
                { status: 404 }
            );
        }

        // حذف فایل فیزیکی
        if (currentUser?.avatar?.startsWith("/uploads/avatars/")) {
            const filePath = join(process.cwd(), "public", currentUser.avatar);
            console.log("🗂️ [DELETE] Deleting file:", filePath);

            await unlink(filePath).catch((err) => {
                console.warn(
                    "[DELETE] فایل آواتار پیدا نشد:",
                    err.message
                );
            });
        }

        // حذف از دیتابیس
        const user = await User.findByIdAndUpdate(
            session.user.id,
            { $set: { avatar: null } },
            { new: true }
        )
            .select("-password -otp_code -otp_expires")
            .lean();

        console.log("✅ [DELETE] Avatar removed successfully");

        return Response.json({
            message: "آواتار با موفقیت حذف شد",
            avatar: null,
            user,
        });
    } catch (err) {
        console.error("❌ [DELETE /api/user/avatar] error:", err);
        return Response.json(
            { message: "خطا در حذف آواتار" },
            { status: 500 }
        );
    }
}