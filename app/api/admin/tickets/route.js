import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return Response.json(
                { message: "کاربر وارد نشده است" },
                { status: 401 }
            );
        }

        if (session.user.role !== "admin") {
            return Response.json(
                { message: "دسترسی غیرمجاز" },
                { status: 403 }
            );
        }

        await connectDB();

        const tickets = await Ticket.find()
            .populate("reporterId", "name email")
            .populate("assigneeId", "name email")
            .populate("messages.senderId", "name email")
            .sort({ createdAt: -1 });

        return Response.json({ tickets }, { status: 200 });
    } catch (err) {
        console.error("Ticket fetch error:", err);
        return Response.json(
            { message: "خطا در دریافت اطلاعات تیکت‌ها" },
            { status: 500 }
        );
    }
}
