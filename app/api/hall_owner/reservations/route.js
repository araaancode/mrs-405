
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";
import Hall from "@/models/Hall";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";



export async function GET() {
    try {
        await connectDB();

        // دریافت سشن
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const reservations = await HallReservation.find()
            .populate({
                path: "hall_id",
                populate: {
                    path: "hall_owner_id",
                    match: { role: "hall_owner" }
                }
            });

        reservations.map((rsv) => {

        })

        return NextResponse.json({
            message: "لیست همه رزروها",
            reservations
        });

    } catch (err) {
        return NextResponse.json(
            { message: err.message || "خطای داخلی سرور" },
            { status: 500 }
        );
    }
}
