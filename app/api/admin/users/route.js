// app/api/admin/users/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";   // ⬅️ اصلاح اصلی
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        // دیباگ — بعد از حل مشکل حذف کن
        console.log("SESSION DEBUG (admin/users):", {
            hasSession: !!session,
            hasUser: !!session?.user,
            userId: session?.user?.id,
            role: session?.user?.role,
        });

        // چک session
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "شما وارد حساب کاربری نشده‌اید" },
                { status: 401 }
            );
        }

        // چک نقش ادمین
        if (session.user.role !== "admin") {
            return NextResponse.json(
                { error: "شما دسترسی لازم را ندارید" },
                { status: 403 }
            );
        }

        // دریافت کاربران — فیلدهای حساس را حذف کن
        const users = await User.find()
            .select("-password -otp_code -otp_expires")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(
            { users },
            { status: 200 }
        );

    } catch (err) {
        console.error("ADMIN USERS ERROR:", err);
        return NextResponse.json(
            { error: "مشکلی پیش آمده", details: err.message },
            { status: 500 }
        );
    }
}