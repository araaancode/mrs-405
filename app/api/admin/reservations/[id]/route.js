// app/api/admin/reservations/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";
import Hall from "@/models/Hall";
import User from "@/models/User";
import { notify } from "@/lib/notificationService";

/* ============================================================
   GET — دریافت جزئیات رزرو
   ============================================================ */
export async function GET(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const admin = await User.findById(session.user.id);
        if (admin?.role !== "admin") {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const reservation = await HallReservation.findById(id)
            .populate("hall_id", "title city province")
            .populate("user_id", "full_name email phone");

        if (!reservation) {
            return NextResponse.json(
                { message: "رزرو یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json(reservation);
    } catch (error) {
        console.error(" [admin reservation GET] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   PATCH — لغو رزرو توسط ادمین
   ============================================================ */
export async function PATCH(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const admin = await User.findById(session.user.id);
        if (admin?.role !== "admin") {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const { cancel_reason } = await req.json();

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

        const hall = await Hall.findById(reservation.hall_id).select(
            "title hall_owner_id"
        );

        reservation.status = "canceled_by_admin";
        reservation.cancel_reason = cancel_reason.trim();
        reservation.reviewed_at = new Date();
        await reservation.save();

        // ==================== 🔔 نوتیفیکیشن ====================
        try {
            // به کاربر
            await notify({
                userId: reservation.user_id,
                type: "reservation_canceled",
                data: {
                    hall_title: hall?.title || "—",
                    reason: cancel_reason.trim(),
                },
            });
            console.log(" [admin cancel reservation] Sent to user");

            // به تالاردار
            if (hall?.hall_owner_id) {
                await notify({
                    userId: hall.hall_owner_id,
                    type: "reservation_canceled",
                    data: {
                        hall_title: hall.title,
                        reason: cancel_reason.trim(),
                    },
                });
                console.log(" [admin cancel reservation] Sent to owner");
            }
        } catch (err) {
            console.error(
                " [admin cancel reservation] Notification failed:",
                err
            );
        }

        return NextResponse.json({
            success: true,
            message: "رزرو با موفقیت لغو شد",
            reservation,
        });
    } catch (error) {
        console.error(" [admin reservation PATCH] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}