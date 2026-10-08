// app/api/hall_owner/tickets/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Ticket from "@/models/Ticket";
import { notify } from "@/lib/notificationService";
import { notifyMany } from "@/lib/notificationService";

/* ============================================================
   پیدا کردن ادمین‌ها
   ============================================================ */
async function getAdminIds() {
    const admins = await User.find({ role: "admin" }).select("_id").lean();
    return admins.map((a) => a._id);
}

/* ============================================================
   POST — ایجاد تیکت جدید توسط تالاردار
   ============================================================ */
export async function POST(req) {
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

        const body = await req.json();

        const ticket = await Ticket.create({
            subject: body.subject,
            description: body.description,
            priority: body.priority || "medium",
            reporterId: user._id,
        });

        // ==================== 🔔 نوتیفیکیشن ====================
        try {
            // 1. به خود تالاردار (تأییدیه)
            await notify({
                userId: user._id,
                type: "ticket_created",
                data: { subject: ticket.subject },
            });

            // 2. به ادمین‌ها
            const adminIds = await getAdminIds();
            if (adminIds.length > 0) {
                await notifyMany(adminIds, {
                    type: "new_ticket_from_user",
                    data: { subject: ticket.subject },
                });
            }
        } catch (notifErr) {
            console.error(" [owner tickets] Notification failed:", notifErr);
        }

        return Response.json(ticket, { status: 201 });
    } catch (error) {
        console.error(" [owner tickets POST] Error:", error);
        return Response.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   GET — لیست تیکت‌های تالاردار
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

        if (user.role !== "hall_owner") {
            return Response.json({ message: "Forbidden" }, { status: 403 });
        }

        const tickets = await Ticket.find({ reporterId: user._id }).sort({
            createdAt: -1,
        });

        return Response.json(tickets);
    } catch (error) {
        console.error(" [owner tickets GET] Error:", error);
        return Response.json(
            { message: error.message || "خطای سرور" },
            { status: 500 }
        );
    }
}