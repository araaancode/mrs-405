// app/api/hall_owner/reservations/[id]/reject/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import HallReservation from "@/models/HallReservation";   // ← اصلاح شد

export async function PATCH(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
        }

        const { id } = params;
        const body = await req.json().catch(() => ({}));
        const { cancel_reason, owner_note } = body;

        if (!cancel_reason || cancel_reason.trim().length < 5) {
            return NextResponse.json(
                { error: "دلیل رد باید حداقل ۵ کاراکتر باشد" },
                { status: 400 }
            );
        }

        await connectDB();

        const reservation = await HallReservation.findById(id).populate(
            "hall_id",
            "hall_owner_id"
        );
        if (!reservation) {
            return NextResponse.json({ error: "رزرو یافت نشد" }, { status: 404 });
        }

        if (String(reservation.hall_id?.hall_owner_id) !== String(session.user.id)) {
            return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
        }

        if (reservation.status !== "pending") {
            return NextResponse.json(
                { error: `این رزرو در وضعیت "${reservation.status}" است و قابل رد نیست` },
                { status: 400 }
            );
        }

        reservation.status = "rejected";
        reservation.is_confirmed_by_owner = false;
        reservation.reviewed_at = new Date();
        reservation.cancel_reason = cancel_reason.trim();
        if (owner_note) reservation.owner_note = owner_note;
        await reservation.save();

        return NextResponse.json(
            { message: "رزرو رد شد", reservation },
            { status: 200 }
        );
    } catch (err) {
        console.error("❌ Reject error:", err);
        return NextResponse.json(
            { error: "خطا در رد رزرو", details: err.message },
            { status: 500 }
        );
    }
}