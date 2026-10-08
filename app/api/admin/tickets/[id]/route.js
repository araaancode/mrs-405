// app/api/admin/tickets/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";
import User from "@/models/User";
import { notify } from "@/lib/notificationService";

/* ============================================================
   GET — دریافت جزئیات یک تیکت (برای ادمین)
   ============================================================ */
export async function GET(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await User.findById(session.user.id);
        if (user?.role !== "admin") {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const ticket = await Ticket.findById(id)
            .populate("reporterId", "full_name email phone role")
            .populate("assigneeId", "full_name email");

        if (!ticket) {
            return NextResponse.json(
                { message: "تیکت یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json(ticket);
    } catch (error) {
        console.error(" [admin ticket GET] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   POST — ارسال پاسخ توسط ادمین
   ============================================================ */
export async function POST(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await User.findById(session.user.id);
        if (user?.role !== "admin") {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const { text, status: newStatus } = await req.json();

        if (!text || !text.trim()) {
            return NextResponse.json(
                { message: "متن پیام نمی‌تواند خالی باشد" },
                { status: 400 }
            );
        }

        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return NextResponse.json(
                { message: "تیکت یافت نشد" },
                { status: 404 }
            );
        }

        // اضافه کردن پیام
        ticket.messages.push({
            senderId: session.user.id,
            text: text.trim(),
            is_admin_reply: true,
        });

        // اگه ادمین assign نشده، الان assign کن
        if (!ticket.assigneeId) {
            ticket.assigneeId = session.user.id;
        }

        // تغییر وضعیت (اختیاری)
        if (
            newStatus &&
            ["open", "in_progress", "answered", "closed"].includes(newStatus)
        ) {
            ticket.status = newStatus;

            if (newStatus === "closed") {
                ticket.closed_by_admin = true;
            }
        } else if (ticket.status === "open") {
            // اگه ادمین پاسخ داد و وضعیت open بود، به in_progress تغییر بده
            ticket.status = "in_progress";
        }

        await ticket.save();

        // ==================== 🔔 نوتیفیکیشن ====================
        try {
            // به کاربر (صاحب تیکت)
            if (ticket.reporterId) {
                await notify({
                    userId: ticket.reporterId,
                    type: "ticket_reply",
                    data: { subject: ticket.subject },
                });
            }

            // اگه تیکت بسته شد، یه نوتیف جدا هم بفرست
            if (newStatus === "closed") {
                await notify({
                    userId: ticket.reporterId,
                    type: "ticket_closed",
                    data: { subject: ticket.subject },
                });
            }
        } catch (notifErr) {
            console.error(
                " [admin ticket reply] Notification failed:",
                notifErr
            );
        }

        return NextResponse.json({
            success: true,
            message: "پاسخ با موفقیت ثبت شد",
            ticket,
        });
    } catch (error) {
        console.error(" [admin ticket POST] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   PATCH — تغییر وضعیت تیکت (بدون پاسخ)
   ============================================================ */
export async function PATCH(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await User.findById(session.user.id);
        if (user?.role !== "admin") {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await req.json();

        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return NextResponse.json(
                { message: "تیکت یافت نشد" },
                { status: 404 }
            );
        }

        if (body.status) {
            ticket.status = body.status;

            if (body.status === "closed") {
                ticket.closed_by_admin = true;
            }
        }

        if (body.priority) {
            ticket.priority = body.priority;
        }

        if (body.assigneeId) {
            ticket.assigneeId = body.assigneeId;
        }

        await ticket.save();

        // ==================== 🔔 نوتیفیکیشن ====================
        if (body.status === "closed" && ticket.reporterId) {
            try {
                await notify({
                    userId: ticket.reporterId,
                    type: "ticket_closed",
                    data: { subject: ticket.subject },
                });
            } catch (notifErr) {
                console.error(" [admin ticket PATCH] Notif failed:", notifErr);
            }
        }

        return NextResponse.json({
            success: true,
            message: "تیکت بروزرسانی شد",
            ticket,
        });
    } catch (error) {
        console.error(" [admin ticket PATCH] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}