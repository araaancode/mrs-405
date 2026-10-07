// app/api/payment/request/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";
import User from "@/models/User";
import { createPayment } from "@/lib/zarinpalService";

export async function POST(req) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "ابتدا وارد سایت شوید" },
                { status: 401 }
            );
        }

        const { reservationId } = await req.json();

        if (!reservationId) {
            return NextResponse.json(
                { message: "شناسه رزرو الزامی است" },
                { status: 400 }
            );
        }

        const reservation = await HallReservation.findById(reservationId);
        if (!reservation) {
            return NextResponse.json(
                { message: "رزرو یافت نشد" },
                { status: 404 }
            );
        }

        if (reservation.user_id.toString() !== session.user.id) {
            return NextResponse.json(
                { message: "دسترسی غیرمجاز" },
                { status: 403 }
            );
        }

        if (reservation.status !== "accepted") {
            return NextResponse.json(
                {
                    message: `رزرو در وضعیت "${reservation.status}" قابل پرداخت نیست`,
                },
                { status: 400 }
            );
        }

        if (reservation.payment_info?.ref_id) {
            return NextResponse.json(
                { message: "این رزرو قبلاً پرداخت شده است" },
                { status: 400 }
            );
        }

        const user = await User.findById(session.user.id);

        const amount = Math.round(reservation.pre_payment);

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { message: "مبلغ پرداخت نامعتبر است" },
                { status: 400 }
            );
        }

        const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/verify/${reservationId}`;

        const result = await createPayment({
            amount,
            callbackUrl,
            mobile: user?.phone,
            email: user?.email,
            description: `پرداخت رزرو - ${reservationId.toString().slice(-8)}`,
            orderId: reservationId.toString(),
        });

        if (!result.success) {
            return NextResponse.json(
                { message: result.error || "خطا در ایجاد تراکنش" },
                { status: 500 }
            );
        }

        reservation.payment_info = {
            ...reservation.payment_info,
            tracking_code: result.authority,
        };
        await reservation.save();

        return NextResponse.json({
            success: true,
            url: result.link,
            authority: result.authority,
            amount,
        });
    } catch (error) {
        console.error("❌ [payment request] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}