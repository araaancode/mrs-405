export const dynamic = "force-dynamic";

// app/api/admin/reservations/halls/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";
import Hall from "@/models/Hall";       // ⬅️ اضافه کن — حتی اگر مستقیم استفاده نکنی
import User from "@/models/User";       // ⬅️ اضافه کن — حتی اگر مستقیم استفاده نکنی

export async function GET() {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "شما وارد حساب کاربری نشده‌اید" },
                { status: 401 }
            );
        }

        if (session.user.role !== "admin") {
            return NextResponse.json(
                { message: "شما دسترسی لازم را ندارید" },
                { status: 403 }
            );
        }

        const reservations = await HallReservation.find()
            .populate("user_id", "full_name email phone")
            .populate("hall_id", "title capacity address province city hall_owner_id")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ reservations }, { status: 200 });
    } catch (err) {
        console.error("ADMIN HALL RESERVATIONS ERROR:", err);
        return NextResponse.json(
            { message: "خطا در دریافت اطلاعات رزروها", details: err.message },
            { status: 500 }
        );
    }
}