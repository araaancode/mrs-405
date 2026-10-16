export const dynamic = "force-dynamic";

// app/api/user/tickets/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";
import User from "@/models/User";
import { notify, notifyMany } from "@/lib/notificationService";

/* ============================================================
   GET — دریافت تیکت‌های کاربر
   ============================================================ */
export async function GET() {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const tickets = await Ticket.find({ reporterId: session.user.id })
            .populate("assigneeId", "full_name email role")
            .sort({ updatedAt: -1 })
            .lean();

        return NextResponse.json({ tickets }, { status: 200 });
    } catch (error) {
        console.error("[user tickets GET] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   POST — ساخت تیکت جدید
   ============================================================ */
export async function POST(req) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { subject, description, priority = "medium" } = await req.json();

        if (!subject?.trim() || !description?.trim()) {
            return NextResponse.json(
                { message: "موضوع و توضیحات الزامی است" },
                { status: 400 }
            );
        }

        // ساخت تیکت
        const ticket = await Ticket.create({
            reporterId: session.user.id,
            subject: subject.trim(),
            description: description.trim(),
            priority,
            status: "open",
            messages: [],
        });

        /* ==================== 🔔 نوتیفیکیشن ==================== */
        try {
            // ۱. نوتیف به کاربر (تأیید ثبت تیکت)
            await notify({
                userId: session.user.id,
                type: "ticket_created",
                data: {
                    subject: ticket.subject,
                    ticketId: ticket._id.toString(),
                },
            });

            // ۲. نوتیف به همه ادمین‌ها (تیکت جدید)
            const admins = await User.find({ role: "admin" })
                .select("_id")
                .lean();

            if (admins.length > 0) {
                // ⚠️ امضای notifyMany در پروژه تو: notifyMany(userIds, payload)
                await notifyMany(
                    admins.map((a) => a._id),
                    {
                        type: "new_ticket",
                        data: {
                            reporterName:
                                session.user.full_name || "کاربری",
                            subject: ticket.subject,
                            ticketId: ticket._id.toString(),
                        },
                    }
                );
            }
        } catch (notifErr) {
            console.error("[user ticket POST] Notify failed:", notifErr);
        }

        return NextResponse.json(
            { success: true, ticket },
            { status: 201 }
        );
    } catch (error) {
        console.error("[user ticket POST] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}