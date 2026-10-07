// app/api/payment/verify/[reservationId]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";
import Hall from "@/models/Hall";
import Transaction from "@/models/Transaction";
import { verifyPayment } from "@/lib/zarinpal";
import {
    notifyPaymentSuccess,
    notifyPaymentFailed,
} from "@/lib/notificationHelpers";

export async function POST(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { reservationId } = await params;

        const reservation = await HallReservation.findById(reservationId);
        if (!reservation) {
            return NextResponse.json(
                { error: "Reservation not found" },
                { status: 404 }
            );
        }

        // بررسی مجدد پرداخت
        const result = await verifyPayment(
            reservation.pre_payment,
            reservation.payment_info.tracking_code
        );

        if (result.success) {
            reservation.payment_info.ref_id = result.refId;
            reservation.payment_info.paid_at = new Date();
            reservation.status = "paid";
            await reservation.save();

            // ذخیره تراکنش
            await Transaction.findOneAndUpdate(
                { authority: reservation.payment_info.tracking_code },
                {
                    status: "paid",
                    ref_id: result.refId,
                    paid_at: new Date(),
                }
            );

            // 🔔 نوتیفیکیشن پرداخت موفق به کاربر + تالاردار
            const hall = await Hall.findById(reservation.hall_id);
            await notifyPaymentSuccess({
                reservation,
                hall,
                amount: reservation.pre_payment,
                refId: result.refId,
            });

            return NextResponse.json({
                success: true,
                message: "Payment verified successfully",
            });
        }

        // ❌ پرداخت ناموفق
        await notifyPaymentFailed({
            userId: reservation.user_id,
            reason: result.message || "خطا در تأیید پرداخت",
        });

        return NextResponse.json(
            {
                success: false,
                message: result.message,
            },
            { status: 400 }
        );
    } catch (error) {
        console.error("Verify error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}