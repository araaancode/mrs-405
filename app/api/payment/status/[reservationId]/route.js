// app/api/payment/status/[reservationId]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";
import { getServerSession } from "next-auth";

export async function GET(req, { params }) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { reservationId } = params;
        await connectDB();

        const reservation = await HallReservation.findById(reservationId)
            .select('status payment_info');

        if (!reservation) {
            return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
        }

        // بررسی مالکیت
        if (reservation.user_id.toString() !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({
            status: reservation.status,
            payment_info: reservation.payment_info
        });

    } catch (error) {
        console.error("Payment status error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}