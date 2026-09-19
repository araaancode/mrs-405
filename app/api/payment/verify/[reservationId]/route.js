// app/api/admin/payment/verify/[reservationId]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";
import { verifyPayment } from "@/lib/zarinpal";

export async function POST(req, { params }) {
    try {
        const session = await getServerSession();
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { reservationId } = params;
        await connectDB();

        const reservation = await HallReservation.findById(reservationId);
        if (!reservation) {
            return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
        }

        // بررسی مجدد پرداخت
        const result = await verifyPayment(
            reservation.pre_payment,
            reservation.payment_info.tracking_code
        );

        if (result.success) {
            reservation.payment_info.ref_id = result.refId;
            reservation.payment_info.paid_at = new Date();
            reservation.status = 'paid';
            await reservation.save();

            return NextResponse.json({
                success: true,
                message: "Payment verified successfully"
            });
        }

        return NextResponse.json({
            success: false,
            message: result.message
        }, { status: 400 });

    } catch (error) {
        console.error("Admin verify error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}