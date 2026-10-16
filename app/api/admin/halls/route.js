export const dynamic = "force-dynamic";

// app/api/admin/halls/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";          // ⬅️ اصلاح اصلی
import connectDB from "@/lib/db";
import Hall from "@/models/Hall";

export async function GET() {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        // دیباگ — بعد از حل مشکل حذف کن
        console.log("SESSION DEBUG (admin/halls):", {
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

        const halls = await Hall.find()
            .populate("hall_owner_id", "full_name email phone")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(
            { halls },
            { status: 200 }
        );

    } catch (err) {
        console.error("ADMIN HALLS ERROR:", err);
        return NextResponse.json(
            { error: "مشکلی پیش آمده", details: err.message },
            { status: 500 }
        );
    }
}