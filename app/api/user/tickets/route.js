// app/api/user/tickets/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Ticket from "@/models/Ticket";
import { notifyNewTicket } from "@/lib/notificationHelpers";

/* ============================================================
   POST — ایجاد تیکت جدید
   ============================================================ */
export async function POST(req) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            console.log("❌ [tickets] No session");
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(session.user.id);

        if (!user) {
            console.log("❌ [tickets] User not found");
            return Response.json({ message: "User not found" }, { status: 404 });
        }

        console.log("🔍 [tickets] User role:", user.role);

        if (user.role !== "user") {
            console.log("❌ [tickets] Forbidden - role is not user");
            return Response.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();

        console.log("🔍 [tickets] Creating ticket with:", {
            subject: body.subject,
            priority: body.priority,
        });

        const ticket = await Ticket.create({
            subject: body.subject,
            description: body.description,
            priority: body.priority || "medium",
            reporterId: user._id,
        });

        console.log(" [tickets] Ticket created:", ticket._id);

        // 🔔 نوتیفیکیشن به ادمین‌ها
        try {
            await notifyNewTicket({ ticket });
            console.log(" [tickets] Notification sent to admins");
        } catch (notifErr) {
            console.error("❌ [tickets] Notification failed:", notifErr);
        }

        return Response.json(ticket, { status: 201 });
    } catch (error) {
        console.error("❌ [tickets POST] Error:", error);
        return Response.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   GET — لیست تیکت‌های کاربر
   ============================================================ */
export async function GET() {
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

        if (user.role !== "user") {
            return Response.json({ message: "Forbidden" }, { status: 403 });
        }

        const tickets = await Ticket.find({ reporterId: user._id }).sort({
            createdAt: -1,
        });

        return Response.json(tickets);
    } catch (error) {
        console.error("❌ [tickets GET] Error:", error);
        return Response.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}