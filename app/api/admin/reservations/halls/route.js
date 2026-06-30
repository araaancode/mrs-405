import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";

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

        const reservations = await HallReservation.find()
            .populate("user_id", "name email")
            .populate("hall_id", "title capacity address")
            .sort({ createdAt: -1 });

        return Response.json({ reservations }, { status: 200 });
    } catch (err) {
        console.error("HallReservation fetch error:", err);
        return Response.json(
            { message: "خطا در دریافت اطلاعات رزروها" },
            { status: 500 }
        );
    }
}
