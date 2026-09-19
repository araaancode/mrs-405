import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// فرض بر اینکه تابع کمکی زرین‌پال در این مسیر است
import { requestPayment } from "@/lib/zarinpal";

export async function POST(req) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "احراز هویت نشدید" }, { status: 401 });

        const { reservationId } = await req.json();

        // پیدا کردن رزرو
        const reservation = await HallReservation.findById(reservationId);
        if (!reservation) return NextResponse.json({ message: "رزرو یافت نشد" }, { status: 404 });

        // بررسی اینکه کاربر مالک رزرو باشد
        if (reservation.user_id.toString() !== session.user.id) {
            return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 403 });
        }

        // درخواست پرداخت به زرین‌پال (با استفاده از pre_payment)
        const { authority, gatewayUrl } = await requestPayment({
            amount: reservation.pre_payment, // دقت: به تومان باشد
            description: `پیش‌پرداخت رزرو تالار - کد ${reservationId}`,
        });

        // ذخیره authority در دیتابیس برای تایید در مرحله بعد
        reservation.payment_info.tracking_code = authority;
        await reservation.save();

        return NextResponse.json({ url: gatewayUrl });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
