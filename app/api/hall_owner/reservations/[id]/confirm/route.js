// app/api/hall_owner/reservations/[id]/confirm/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";
import Hall from "@/models/Hall";
import { notifyReservationAccepted } from "@/lib/notificationHelpers";

export async function PATCH(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "احراز هویت نشده" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await req.json().catch(() => ({}));
        const ownerNote = body?.owner_note || "";

        await connectDB();

        const reservation = await HallReservation.findById(id).populate(
            "hall_id",
            "hall_owner_id title"
        );

        if (!reservation) {
            return NextResponse.json(
                { error: "رزرو یافت نشد" },
                { status: 404 }
            );
        }

        if (
            String(reservation.hall_id?.hall_owner_id) !==
            String(session.user.id)
        ) {
            return NextResponse.json(
                { error: "دسترسی غیرمجاز" },
                { status: 403 }
            );
        }

        if (reservation.status !== "pending") {
            return NextResponse.json(
                {
                    error: `این رزرو در وضعیت "${reservation.status}" است و قابل تایید نیست`,
                },
                { status: 400 }
            );
        }

        reservation.status = "accepted";
        reservation.is_confirmed_by_owner = true;
        reservation.reviewed_at = new Date();
        if (ownerNote) reservation.owner_note = ownerNote;
        await reservation.save();

        // ==================== 🔔 نوتیفیکیشن ====================
        try {
            // گرفتن hall کامل (نه فقط populate شده)
            const hall = await Hall.findById(reservation.hall_id._id);

            await notifyReservationAccepted({
                reservation,
                hall,
            });

            console.log(" [confirm] Notification sent");
        } catch (notifErr) {
            console.error(" [confirm] Notification failed:", notifErr);
        }

        return NextResponse.json(
            { message: "رزرو با موفقیت تایید شد", reservation },
            { status: 200 }
        );
    } catch (err) {
        console.error(" Confirm error:", err);
        return NextResponse.json(
            { error: "خطا در تایید رزرو", details: err.message },
            { status: 500 }
        );
    }
}