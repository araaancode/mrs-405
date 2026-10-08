// app/api/user/hall_reservations/[id]/cancel/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";
import Hall from "@/models/Hall";
import User from "@/models/User";
import { notify, notifyMany } from "@/lib/notificationService";

/* ============================================================
   پیدا کردن ادمین‌ها
   ============================================================ */
async function getAdminIds() {
    const admins = await User.find({ role: "admin" }).select("_id").lean();
    return admins.map((a) => a._id);
}

/* ============================================================
   PATCH — لغو رزرو توسط کاربر
   ============================================================ */
export async function PATCH(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "ابتدا وارد سایت شوید" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await req.json().catch(() => ({}));
        const { cancel_reason } = body;

        if (!cancel_reason || cancel_reason.trim().length < 5) {
            return NextResponse.json(
                { message: "دلیل لغو باید حداقل ۵ کاراکتر باشد" },
                { status: 400 }
            );
        }

        const reservation = await HallReservation.findById(id);

        if (!reservation) {
            return NextResponse.json(
                { message: "رزرو یافت نشد" },
                { status: 404 }
            );
        }

        // فقط صاحب رزرو می‌تونه لغو کنه
        if (reservation.user_id.toString() !== session.user.id) {
            return NextResponse.json(
                { message: "دسترسی غیرمجاز" },
                { status: 403 }
            );
        }

        // فقط رزروهای pending و accepted و paid قابل لغو هستن
        const cancellableStatuses = ["pending", "accepted", "paid"];
        if (!cancellableStatuses.includes(reservation.status)) {
            return NextResponse.json(
                {
                    message: `رزرو در وضعیت "${reservation.status}" قابل لغو نیست`,
                },
                { status: 400 }
            );
        }

        // ذخیره اطلاعات قدیمی برای نوتیف
        const previousStatus = reservation.status;
        const hall = await Hall.findById(reservation.hall_id).select(
            "title hall_owner_id"
        );

        // لغو رزرو
        reservation.status = "canceled_by_user";
        reservation.cancel_reason = cancel_reason.trim();
        reservation.reviewed_at = new Date();
        await reservation.save();

        // ==================== 🔔 نوتیفیکیشن ====================
        try {
            // به تالاردار
            if (hall?.hall_owner_id) {
                await notify({
                    userId: hall.hall_owner_id,
                    type: "reservation_canceled_by_user",
                    data: {
                        hall_title: hall.title,
                        reason: cancel_reason.trim(),
                    },
                });
            }

            // به ادمین‌ها
            const adminIds = await getAdminIds();
            if (adminIds.length > 0) {
                await notifyMany(adminIds, {
                    type: "reservation_canceled",
                    data: {
                        hall_title: hall?.title || "—",
                        reason: cancel_reason.trim(),
                    },
                });
            }
        } catch (notifErr) {
            console.error(
                " [cancel reservation] Notification failed:",
                notifErr
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "رزرو با موفقیت لغو شد",
                reservation,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(" [cancel reservation] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطا در لغو رزرو" },
            { status: 500 }
        );
    }
}