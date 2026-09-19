// app/api/hall_owner/reservations/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";   // ← نام درست
import Hall from "@/models/Hall";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
        }

        await connectDB();

        const ownerHalls = await Hall.find({ hall_owner_id: session.user.id })
            .select("_id title")
            .lean();

        const hallIds = ownerHalls.map((h) => h._id);

        if (hallIds.length === 0) {
            return NextResponse.json({ reservations: [] }, { status: 200 });
        }

        const reservations = await HallReservation.find({ hall_id: { $in: hallIds } })
            .populate("hall_id", "title city province images")
            .populate("user_id", "name phone email")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ reservations }, { status: 200 });
    } catch (err) {
        console.error("❌ GET reservations error:", err);
        return NextResponse.json(
            { error: "خطا در دریافت رزروها", details: err.message },
            { status: 500 }
        );
    }
}