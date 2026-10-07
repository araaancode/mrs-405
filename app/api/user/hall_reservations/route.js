// app/api/user/hall_reservations/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";
import Hall from "@/models/Hall";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { notifyReservationCreated } from "@/lib/notificationHelpers";

export async function POST(req) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session) {
            return Response.json(
                { message: "ابتدا باید وارد سایت شوید!" },
                { status: 401 }
            );
        }

        const user = session.user;

        if (!user) {
            return NextResponse.json(
                { message: "برای رزرو ابتدا وارد حساب شوید" },
                { status: 401 }
            );
        }

        const { hall_id, start_date, end_date, guests_count, user_note } =
            await req.json();

        if (!hall_id || !start_date || !end_date || !guests_count) {
            return NextResponse.json(
                { message: "تمام فیلدهای ضروری را وارد کنید" },
                { status: 400 }
            );
        }

        const hall = await Hall.findById(hall_id);
        if (!hall || !hall.is_active) {
            return NextResponse.json(
                { message: "تالار معتبر نیست یا فعال نیست" },
                { status: 404 }
            );
        }

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (endDate <= startDate) {
            return NextResponse.json(
                { message: "تاریخ پایان باید بعد از شروع باشد" },
                { status: 400 }
            );
        }

        if (startDate < new Date()) {
            return NextResponse.json(
                { message: "تاریخ شروع باید در آینده باشد" },
                { status: 400 }
            );
        }

        if (guests_count > hall.capacity) {
            return NextResponse.json(
                { message: "تعداد مهمان بیش از ظرفیت تالار است" },
                { status: 400 }
            );
        }

        const hasConflict = await HallReservation.findOne({
            hall_id,
            $or: [
                {
                    start_date: { $lte: endDate },
                    end_date: { $gte: startDate },
                },
            ],
            status: { $in: ["pending", "accepted"] },
        });

        if (hasConflict) {
            return NextResponse.json(
                { message: "این بازه زمانی قبلاً رزرو شده است" },
                { status: 400 }
            );
        }

        const base_price = hall.sans_price || 0;
        const discount = hall.sans_discount || 0;
        const final_price = base_price - (base_price * discount) / 100;
        const pre_payment = final_price * 0.3;

        const reservation = await HallReservation.create({
            user_id: user.id,
            hall_id: hall._id,
            start_date: startDate,
            end_date: endDate,
            guests_count,
            base_price,
            discount,
            final_price,
            pre_payment,
            status: "pending",
            user_note: user_note || "",
            owner_note: "",
            reviewed_at: null,
            is_confirmed_by_owner: false,
            cancel_reason: "",
            payment_info: {
                ref_id: "",
                tracking_code: "",
                paid_at: null,
            },
        });

        // 🔔 نوتیفیکیشن به کاربر + تالاردار + ادمین‌ها
        await notifyReservationCreated({
            reservation,
            hall,
            user: { _id: user.id },
        });

        return NextResponse.json({
            message: "رزرو ثبت شد و در انتظار تایید مالک است",
            reservation,
        });
    } catch (err) {
        return NextResponse.json(
            { message: err.message || "خطای داخلی سرور" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const reservations = await HallReservation.find({
            user_id: session.user.id,
        })
            .populate("hall_id", "title capacity is_active images")
            .sort({ createdAt: -1 });

        return NextResponse.json({
            message: "لیست رزروهای شما",
            reservations,
        });
    } catch (err) {
        return NextResponse.json(
            { message: err.message || "خطای داخلی سرور" },
            { status: 500 }
        );
    }
}