// app/api/admin/halls/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Hall from "@/models/Hall";
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
   Helper — ارسال نوتیف (با try/catch و dynamic import)
   ============================================================ */
async function sendNotify(payload) {
    try {
        const { notify } = await import("@/lib/notificationService");
        await notify(payload);
    } catch (err) {
        console.warn("[notify skipped]:", err.message);
    }
}

/* ============================================================
   GET — دریافت جزئیات تالار
   ============================================================ */
export async function GET(req, { params }) {
    try {
        await connectDB();

        const auth = await requireAdmin();
        if (auth.error) return auth.error;

        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "شناسه تالار معتبر نیست" },
                { status: 400 }
            );
        }

        const hall = await Hall.findById(id).populate(
            "hall_owner_id",
            "full_name email phone"
        );

        if (!hall) {
            return NextResponse.json(
                { message: "تالار یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json(hall);
    } catch (error) {
        console.error("[admin hall GET] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   PATCH — دو حالت:
   ۱. اگر body.action باشد → تغییر وضعیت (approve/reject)
   ۲. در غیر این صورت → ویرایش اطلاعات تالار
   ============================================================ */
export async function PATCH(req, { params }) {
    try {
        await connectDB();

        const auth = await requireAdmin();
        if (auth.error) return auth.error;

        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "شناسه تالار معتبر نیست" },
                { status: 400 }
            );
        }

        const body = await req.json();

        /* ---------- حالت ۱: تغییر وضعیت ---------- */
        if (body.action) {
            const { action, reason } = body;

            if (!["approve", "reject"].includes(action)) {
                return NextResponse.json(
                    { message: "اکشن نامعتبر است (approve یا reject)" },
                    { status: 400 }
                );
            }

            const hall = await Hall.findById(id);
            if (!hall) {
                return NextResponse.json(
                    { message: "تالار یافت نشد" },
                    { status: 404 }
                );
            }

            if (action === "approve") {
                hall.is_active = true;
                await hall.save({ validateBeforeSave: false });

                await sendNotify({
                    userId: hall.hall_owner_id,
                    type: "hall_approved",
                    data: { hall_title: hall.title },
                });

                return NextResponse.json({
                    success: true,
                    message: "تالار با موفقیت تأیید شد",
                    hall: sanitizeHall(hall),
                });
            }

            // reject
            if (!reason || reason.trim().length < 5) {
                return NextResponse.json(
                    { message: "دلیل رد باید حداقل ۵ کاراکتر باشد" },
                    { status: 400 }
                );
            }

            hall.is_active = false;
            await hall.save({ validateBeforeSave: false });

            await sendNotify({
                userId: hall.hall_owner_id,
                type: "hall_rejected",
                data: { hall_title: hall.title, reason: reason.trim() },
            });

            return NextResponse.json({
                success: true,
                message: "تالار رد شد",
                hall: sanitizeHall(hall),
            });
        }

        /* ---------- حالت ۲: ویرایش اطلاعات ---------- */
        const {
            _id,
            __v,
            createdAt,
            updatedAt,
            hall_owner_id, // ⬅️ اجازه تغییر مالک را نمی‌دهیم
            ...safeData
        } = body;

        const updatedHall = await Hall.findByIdAndUpdate(
            id,
            safeData,
            { new: true, runValidators: true }
        ).populate("hall_owner_id", "full_name email phone");

        if (!updatedHall) {
            return NextResponse.json(
                { message: "تالار یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "اطلاعات تالار با موفقیت بروزرسانی شد",
            hall: updatedHall,
        });
    } catch (error) {
        console.error("[admin hall PATCH] Error:", error);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(
                (e) => e.message
            );
            return NextResponse.json(
                { message: messages.join(", ") },
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
   DELETE — حذف تالار
   ============================================================ */
export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const auth = await requireAdmin();
        if (auth.error) return auth.error;

        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "شناسه تالار معتبر نیست" },
                { status: 400 }
            );
        }

        const hall = await Hall.findByIdAndDelete(id);

        if (!hall) {
            return NextResponse.json(
                { message: "تالار یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "تالار حذف شد",
            deletedId: id,
        });
    } catch (error) {
        console.error("[admin hall DELETE] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   Helper — حذف فیلدهای حساس
   ============================================================ */
function sanitizeHall(hall) {
    const obj = hall.toObject ? hall.toObject() : { ...hall };
    delete obj.__v;
    return obj;
}