// app/api/payment/initiate/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";
import { requestPayment } from "@/lib/zarinpal";
import { getServerSession } from "next-auth";

export async function POST(req) {
    try {
        // احراز هویت کاربر
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: "لطفاً ابتدا وارد شوید" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { reservationId } = body;

        if (!reservationId) {
            return NextResponse.json(
                { success: false, error: "شناسه رزرو الزامی است" },
                { status: 400 }
            );
        }

        await connectDB();

        // پیدا کردن رزرو با اطلاعات کامل
        const reservation = await HallReservation.findById(reservationId)
            .populate('user_id', 'email phone full_name')
            .populate('hall_id', 'title');

        if (!reservation) {
            return NextResponse.json(
                { success: false, error: "رزرو مورد نظر یافت نشد" },
                { status: 404 }
            );
        }

        // بررسی مالکیت رزرو
        if (reservation.user_id._id.toString() !== session.user.id) {
            return NextResponse.json(
                { success: false, error: "شما دسترسی به این رزرو ندارید" },
                { status: 403 }
            );
        }

        // بررسی وضعیت رزرو
        if (reservation.status === 'paid') {
            return NextResponse.json(
                { success: false, error: "این رزرو قبلاً پرداخت شده است" },
                { status: 400 }
            );
        }

        // بررسی وجود مبلغ برای پرداخت
        if (!reservation.pre_payment || reservation.pre_payment <= 0) {
            return NextResponse.json(
                { success: false, error: "مبلغ پرداخت معتبر نیست" },
                { status: 400 }
            );
        }

        // مبلغ قابل پرداخت (پیش‌پرداخت)
        const amount = reservation.pre_payment;

        // توضیحات پرداخت
        const description = `پرداخت پیش‌پرداخت رزرو تالار ${reservation.hall_id.title} - کد رزرو: ${reservation._id.toString().slice(-6)}`;

        // درخواست پرداخت به درگاه
        const paymentResult = await requestPayment({
            amount: amount,
            description: description,
            email: reservation.user_id.email,
            mobile: reservation.user_id.phone,
            orderId: reservation._id.toString()
        });

        if (!paymentResult.success) {
            return NextResponse.json(
                { success: false, error: paymentResult.message },
                { status: 400 }
            );
        }

        // ذخیره Authority در رزرو
        await HallReservation.findByIdAndUpdate(reservationId, {
            $set: {
                "payment_info.tracking_code": paymentResult.authority,
                "payment_info.payment_method": "zarinpal",
                "payment_info.payment_gateway": "zarinpal",
                "payment_info.payment_data": {
                    requested_at: new Date(),
                    amount: amount,
                    description: description
                }
            }
        });

        return NextResponse.json({
            success: true,
            redirectUrl: paymentResult.gatewayUrl,
            authority: paymentResult.authority
        });

    } catch (error) {
        console.error(' Payment initiation error:', error);
        return NextResponse.json(
            { success: false, error: "خطا در شروع پرداخت" },
            { status: 500 }
        );
    }
}