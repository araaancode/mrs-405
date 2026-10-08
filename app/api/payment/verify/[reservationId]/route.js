// app/api/payment/verify/[reservationId]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";
import Hall from "@/models/Hall";
import Transaction from "@/models/Transaction";
import { verifyPayment } from "@/lib/zarinpalService";
import {
    notifyPaymentSuccess,
    notifyPaymentFailed,
} from "@/lib/notificationHelpers";

export async function GET(req, { params }) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    try {
        await connectDB();

        const { reservationId } = await params;
        const { searchParams } = new URL(req.url);
        const authority = searchParams.get("Authority");
        const status = searchParams.get("Status");

        console.log("🔍 [payment verify] params:", {
            reservationId,
            authority,
            status,
        });

        if (!authority) {
            return NextResponse.redirect(
                `${baseUrl}/payment/failed?reason=no_authority`
            );
        }

        const reservation = await HallReservation.findById(reservationId);
        if (!reservation) {
            return NextResponse.redirect(
                `${baseUrl}/payment/failed?reason=not_found`
            );
        }

        // کاربر لغو کرده
        if (status === "NOK") {
            await notifyPaymentFailed({
                userId: reservation.user_id,
                reason: "لغو توسط کاربر",
            });

            return NextResponse.redirect(
                `${baseUrl}/payment/failed?reason=canceled&reservation=${reservationId}`
            );
        }

        const amount = Math.round(reservation.pre_payment);

        const verifyResult = await verifyPayment({
            amount,
            authority,
        });

        if (!verifyResult.success) {
            await notifyPaymentFailed({
                userId: reservation.user_id,
                reason: verifyResult.error || "خطا در تأیید پرداخت",
            });

            return NextResponse.redirect(
                `${baseUrl}/payment/failed?reason=verify_failed&reservation=${reservationId}`
            );
        }

        // موفق
        console.log(" [payment verify] Success! RefID:", verifyResult.refId);

        reservation.status = "paid";
        reservation.payment_info = {
            ...reservation.payment_info,
            ref_id: verifyResult.refId,
            tracking_code: verifyResult.cardPan || reservation.payment_info?.tracking_code,
            paid_at: new Date(),
            payment_method: "zarinpal",
            payment_data: {
                card_pan: verifyResult.cardPan,
                fee: verifyResult.fee,
            },
        };
        await reservation.save();

        // ثبت تراکنش
        try {
            await Transaction.findOneAndUpdate(
                { authority },
                {
                    reservation_id: reservation._id,
                    user_id: reservation.user_id,
                    amount,
                    status: "paid",
                    ref_id: verifyResult.refId,
                    paid_at: new Date(),
                    payment_method: "zarinpal",
                },
                { upsert: true, new: true }
            );
        } catch (txErr) {
            console.error("⚠️ [payment verify] Transaction error:", txErr);
        }

        // نوتیف
        try {
            const hall = await Hall.findById(reservation.hall_id);
            await notifyPaymentSuccess({
                reservation,
                hall,
                amount,
                refId: verifyResult.refId,
            });
        } catch (notifErr) {
            console.error(" [payment verify] Notif failed:", notifErr);
        }

        return NextResponse.redirect(
            `${baseUrl}/payment/success?ref=${verifyResult.refId}&reservation=${reservationId}`
        );
    } catch (error) {
        console.error(" [payment verify] Error:", error);
        return NextResponse.redirect(
            `${baseUrl}/payment/failed?reason=server_error`
        );
    }
}