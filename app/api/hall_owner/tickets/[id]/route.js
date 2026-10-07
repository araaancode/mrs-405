// app/api/hall_owner/tickets/[id]/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Ticket from "@/models/Ticket";
import { notify, notifyMany } from "@/lib/notificationService";

/* ============================================================
   پیدا کردن ادمین‌ها
   ============================================================ */
async function getAdminIds() {
    const admins = await User.find({ role: "admin" }).select("_id").lean();
    return admins.map((a) => a._id);
}

/* ============================================================
   POST — ارسال پاسخ توسط تالاردار
   ============================================================ */
export async function POST(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(session.user.id);

        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }

        if (user.role !== "hall_owner") {
            return Response.json({ message: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        const { text } = await req.json();

        if (!text || !text.trim()) {
            return Response.json(
                { message: "متن پیام نمی‌تواند خالی باشد" },
                { status: 400 }
            );
        }

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return Response.json({ message: "تیکت یافت نشد" }, { status: 404 });
        }

        if (ticket.reporterId.toString() !== session.user.id) {
            return Response.json(
                { message: "دسترسی غیرمجاز" },
                { status: 403 }
            );
        }

        ticket.messages.push({
            senderId: session.user.id,
            text: text,
            is_admin_reply: false,
        });

        await ticket.save();

        // ==================== 🔔 نوتیفیکیشن ====================
        try {
            // به ادمین مسئول (اگه assign شده باشه)
            if (ticket.assigneeId) {
                await notify({
                    userId: ticket.assigneeId,
                    type: "ticket_reply",
                    data: { subject: ticket.subject },
                });
            } else {
                // به همه ادمین‌ها
                const adminIds = await getAdminIds();
                if (adminIds.length > 0) {
                    await notifyMany(adminIds, {
                        type: "new_ticket_from_user",
                        data: { subject: ticket.subject },
                    });
                }
            }
        } catch (notifErr) {
            console.error("❌ [owner ticket reply] Notification failed:", notifErr);
        }

        return Response.json({
            message: "پیام ثبت شد",
            ticket,
        });
    } catch (error) {
        console.error("❌ [owner ticket POST] Error:", error);
        return Response.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   GET — دریافت جزئیات تیکت
   ============================================================ */
export async function GET(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const ticket = await Ticket.findById(id).populate(
            "reporterId",
            "full_name email phone"
        );

        if (!ticket) {
            return Response.json({ message: "تیکت یافت نشد" }, { status: 404 });
        }

        return Response.json(ticket);
    } catch (error) {
        console.error("❌ [owner ticket GET] Error:", error);
        return Response.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}