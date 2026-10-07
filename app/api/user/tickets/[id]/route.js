// app/api/user/tickets/[id]/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";
import User from "@/models/User";
import { notifyTicketReply } from "@/lib/notificationHelpers";
import { notifyMany } from "@/lib/notificationService";

export async function POST(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
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

        // 🔔 نوتیفیکیشن به ادمین مسئول یا همه ادمین‌ها
        if (ticket.assigneeId) {
            // به ادمین مسئول
            await notifyTicketReply({
                ticket,
                toUserId: ticket.assigneeId,
            });
        } else {
            // به همه ادمین‌ها
            const admins = await User.find({ role: "admin" })
                .select("_id")
                .lean();
            const adminIds = admins.map((a) => a._id);

            await notifyMany(adminIds, {
                type: "new_ticket_from_user", // ← تیکت از طرف کاربر
                data: { subject: ticket.subject },
            });
        }

        return Response.json({
            message: "پیام ثبت شد",
            ticket,
        });
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Server Error" }, { status: 500 });
    }
}

export async function GET(req, { params }) {
    await connectDB();
    const { id } = await params;
    const ticket = await Ticket.findById(id);
    return Response.json(ticket);
}