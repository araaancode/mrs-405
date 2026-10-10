// app/api/admin/users/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";

/* ============================================================
   Helper — چک دسترسی ادمین
   ============================================================ */
async function requireAdmin() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return {
            error: NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            ),
        };
    }

    if (session.user.role !== "admin") {
        return {
            error: NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            ),
        };
    }

    return { session };
}

/* ============================================================
   GET — دریافت جزئیات کاربر
   ============================================================ */
export async function GET(req, { params }) {
    try {
        await connectDB();

        const auth = await requireAdmin();
        if (auth.error) return auth.error;

        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "شناسه کاربر معتبر نیست" },
                { status: 400 }
            );
        }

        const user = await User.findById(id).select(
            "-password -otp_code -otp_expires"
        );

        if (!user) {
            return NextResponse.json(
                { message: "کاربر یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("[admin user GET] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   PATCH — ویرایش کاربر (برای EditUserModal) یا تغییر وضعیت
   ============================================================ */

/* ------------------------------------------------------------
   اگر بدنه شامل `action` باشد → تغییر وضعیت (approve/deactivate)
   اگر بدنه شامل فیلدهای پروفایل باشد → ویرایش اطلاعات
   ------------------------------------------------------------ */
export async function PATCH(req, { params }) {
    try {
        await connectDB();

        const auth = await requireAdmin();
        if (auth.error) return auth.error;

        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "شناسه کاربر معتبر نیست" },
                { status: 400 }
            );
        }

        // جلوگیری از تغییر حساب خود ادمین
        if (id === auth.session.user.id) {
            return NextResponse.json(
                { message: "نمی‌توانید حساب خودتان را تغییر دهید" },
                { status: 400 }
            );
        }

        const body = await req.json();

        /* ---------- حالت ۱: تغییر وضعیت (approve / deactivate) ---------- */
        if (body.action) {
            const { action, reason } = body;

            if (!["approve", "deactivate"].includes(action)) {
                return NextResponse.json(
                    { message: "اکشن نامعتبر است (approve یا deactivate)" },
                    { status: 400 }
                );
            }

            const user = await User.findById(id);
            if (!user) {
                return NextResponse.json(
                    { message: "کاربر یافت نشد" },
                    { status: 404 }
                );
            }

            if (action === "approve") {
                user.is_active = true;
                user.verified_at = new Date();
                await user.save({ validateBeforeSave: false });

                // 🔔 نوتیفیکیشن (اختیاری — اگر ماژولش موجود است)
                try {
                    const { notify } = await import(
                        "@/lib/notificationService"
                    );
                    await notify({
                        userId: user._id,
                        type: "account_approved",
                        data: {},
                    });
                } catch (err) {
                    console.warn(
                        "[admin user approve] Notification skipped:",
                        err.message
                    );
                }

                return NextResponse.json({
                    success: true,
                    message: "کاربر تأیید شد",
                    user: sanitizeUser(user),
                });
            }

            // deactivate
            user.is_active = false;
            await user.save({ validateBeforeSave: false });

            try {
                const { notify } = await import(
                    "@/lib/notificationService"
                );
                await notify({
                    userId: user._id,
                    type: "account_deactivated",
                    data: { reason: reason?.trim() || "" },
                });
            } catch (err) {
                console.warn(
                    "[admin user deactivate] Notification skipped:",
                    err.message
                );
            }

            return NextResponse.json({
                success: true,
                message: "کاربر غیرفعال شد",
                user: sanitizeUser(user),
            });
        }

        /* ---------- حالت ۲: ویرایش اطلاعات (از EditUserModal) ---------- */
        const {
            password,
            otp_code,
            otp_expires,
            _id,
            __v,
            createdAt,
            updatedAt,
            ...safeData
        } = body;

        // تبدیل birth_date به Date اگر رشته بود
        if (safeData.birth_date && typeof safeData.birth_date === "string") {
            const d = new Date(safeData.birth_date);
            if (!isNaN(d.getTime())) {
                safeData.birth_date = d;
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            safeData,
            { new: true, runValidators: true }
        ).select("-password -otp_code -otp_expires");

        if (!updatedUser) {
            return NextResponse.json(
                { message: "کاربر یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "اطلاعات کاربر با موفقیت بروزرسانی شد",
            user: updatedUser,
        });
    } catch (error) {
        console.error("[admin user PATCH] Error:", error);

        // خطای اعتبارسنجی Mongoose
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(
                (e) => e.message
            );
            return NextResponse.json(
                { message: messages.join(", ") },
                { status: 400 }
            );
        }

        // خطای unique
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return NextResponse.json(
                { message: `این ${field} قبلاً استفاده شده است` },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   DELETE — حذف کاربر
   ============================================================ */
export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const auth = await requireAdmin();
        if (auth.error) return auth.error;

        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "شناسه کاربر معتبر نیست" },
                { status: 400 }
            );
        }

        if (id === auth.session.user.id) {
            return NextResponse.json(
                { message: "نمی‌توانید حساب خودتان را حذف کنید" },
                { status: 400 }
            );
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return NextResponse.json(
                { message: "کاربر یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "کاربر حذف شد",
            deletedId: id,
        });
    } catch (error) {
        console.error("[admin user DELETE] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   Helper — حذف فیلدهای حساس از پاسخ
   ============================================================ */
function sanitizeUser(user) {
    const obj = user.toObject ? user.toObject() : { ...user };
    delete obj.password;
    delete obj.otp_code;
    delete obj.otp_expires;
    return obj;
}