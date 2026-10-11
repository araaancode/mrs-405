// app/api/admin/tickets/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";
import User from "@/models/User";
import mongoose from "mongoose";
import { notify } from "@/lib/notificationService";

/* ============================================================
   Helper — چک دسترسی ادمین
   ============================================================ */
async function requireAdmin() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return {
            error: NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            ),
        };
    }

    if (session.user.role !== "admin") {
        return {
            error: NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            ),
        };
    }

    return { session };
}

/* ============================================================
   GET — دریافت جزئیات یک تیکت
   ============================================================ */
export async function GET(req, { params }) {
    try {
        await connectDB();

        const auth = await requireAdmin();
        if (auth.error) return auth.error;

        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "شناسه تیکت معتبر نیست" },
                { status: 400 }
            );
        }

        const ticket = await Ticket.findById(id)
            .populate("reporterId", "full_name email phone role")
            .populate("assigneeId", "full_name email role")
            .populate("messages.senderId", "full_name email role")
            .lean();

        if (!ticket) {
            return NextResponse.json(
                { message: "تیکت یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("[admin ticket GET] Error:", error);
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

        const auth = await requireAdmin();
        if (auth.error) return auth.error;

        const { id } = params;
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

        /* ---------- اضافه کردن پیام ---------- */
        ticket.messages.push({
            senderId: auth.session.user.id,
            text: text.trim(),
            is_admin_reply: true,
        });

        /* ---------- assign ادمین ---------- */
        if (!ticket.assigneeId) {
            ticket.assigneeId = auth.session.user.id;
        }

        /* ---------- تغییر وضعیت ---------- */
        if (
            newStatus &&
            ["open", "in_progress", "answered", "closed"].includes(newStatus)
        ) {
            ticket.status = newStatus;
            if (newStatus === "closed") {
                ticket.closed_by_admin = true;
            }
        } else if (ticket.status === "open") {
            ticket.status = "in_progress";
        }

        await ticket.save();

        /* ==================== 🔔 نوتیفیکیشن ==================== */
        try {
            if (ticket.reporterId) {
                // پیام به کاربر
                await notify({
                    userId: ticket.reporterId,
                    type: "ticket_reply",
                    data: {
                        subject: ticket.subject,
                        ticketId: ticket._id.toString(),
                    },
                });

                // اگر بسته شد، نوتیف جدا
                if (newStatus === "closed") {
                    await notify({
                        userId: ticket.reporterId,
                        type: "ticket_closed",
                        data: {
                            subject: ticket.subject,
                            ticketId: ticket._id.toString(),
                        },
                    });
                }
            }
        } catch (notifErr) {
            console.error("[admin ticket POST] Notify failed:", notifErr);
        }

        return NextResponse.json({
            success: true,
            message: "پاسخ با موفقیت ثبت شد",
            ticket,
        });
    } catch (error) {
        console.error("[admin ticket POST] Error:", error);
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

        const auth = await requireAdmin();
        if (auth.error) return auth.error;

        const { id } = params;
        const body = await req.json();

        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return NextResponse.json(
                { message: "تیکت یافت نشد" },
                { status: 404 }
            );
        }

        const prevStatus = ticket.status;

        if (body.status) {
            ticket.status = body.status;
            if (body.status === "closed") {
                ticket.closed_by_admin = true;
            }
        }
        if (body.priority) ticket.priority = body.priority;
        if (body.assigneeId) ticket.assigneeId = body.assigneeId;

        await ticket.save();

        /* ==================== 🔔 نوتیفیکیشن ==================== */
        // فقط اگر تازه بسته شد (نه اگر از قبل بسته بود)
        if (
            body.status === "closed" &&
            prevStatus !== "closed" &&
            ticket.reporterId
        ) {
            try {
                await notify({
                    userId: ticket.reporterId,
                    type: "ticket_closed",
                    data: {
                        subject: ticket.subject,
                        ticketId: ticket._id.toString(),
                    },
                });
            } catch (notifErr) {
                console.error("[admin ticket PATCH] Notify failed:", notifErr);
            }
        }

        return NextResponse.json({
            success: true,
            message: "تیکت بروزرسانی شد",
            ticket,
        });
    } catch (error) {
        console.error("[admin ticket PATCH] Error:", error);
        return NextResponse.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}