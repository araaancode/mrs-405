// app/api/payment/webhook/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";

export async function POST(req) {
    try {
        const body = await req.json();
        const { authority, status, ref_id } = body;

        // تایید امضای وب‌هوک (در صورت نیاز)
        // const signature = req.headers.get('x-zarinpal-signature');
        // if (!verifySignature(signature, body)) {
        //     return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        // }

        await connectDB();

        const reservation = await HallReservation.findOne({
            "payment_info.tracking_code": authority
        });

        if (!reservation) {
            return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
        }

        if (status === 'success') {
            reservation.payment_info.ref_id = ref_id;
            reservation.payment_info.paid_at = new Date();
            reservation.status = 'paid';
            await reservation.save();

            // ارسال ایمیل یا پیامک تایید
            await sendPaymentConfirmation(reservation);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}