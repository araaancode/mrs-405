// app/api/admin/tickets/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";          // ⬅️ اصلاح اصلی
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";
import User from "@/models/User";                  // ⬅️ برای populate لازم است

export async function GET() {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        // دیباگ — بعد از حل مشکل حذف کن
        console.log("SESSION DEBUG (admin/tickets):", {
            hasSession: !!session,
            hasUser: !!session?.user,
            userId: session?.user?.id,
            role: session?.user?.role,
        });

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

        const tickets = await Ticket.find()
            .populate("reporterId", "full_name email phone role")   // ⬅️
            .populate("assigneeId", "full_name email role")         // ⬅️
            .populate("messages.senderId", "full_name email role")  // ⬅️
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ tickets }, { status: 200 });
    } catch (err) {
        console.error("ADMIN TICKETS ERROR:", err);
        return NextResponse.json(
            { message: "خطا در دریافت اطلاعات تیکت‌ها", details: err.message },
            { status: 500 }
        );
    }
}