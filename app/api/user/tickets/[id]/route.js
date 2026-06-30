import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";

export async function POST(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
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
            return Response.json({ message: "دسترسی غیرمجاز" }, { status: 403 });
        }

        ticket.messages.push({
            senderId: session.user.id,
            text: text,
            is_admin_reply: false
        });

        await ticket.save();

        return Response.json({
            message: "پیام ثبت شد",
            ticket
        });

    } catch (error) {
        console.error(error);
        return Response.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}


// متد GET برای دریافت جزئیات یک تیکت خاص
export async function GET(req, { params }) {
    await connectDB();
    const { id } = params;
    const ticket = await Ticket.findById(id);
    return Response.json(ticket);
}
