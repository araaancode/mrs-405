// app/api/ads/[id]/track/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Advertisement from "@/models/Advertisement";
import mongoose from "mongoose";

/* ============================================================
   POST — ثبت بازدید یا کلیک تبلیغ
   body: { type: "view" | "click" }
   ============================================================ */
export async function POST(req, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "شناسه نامعتبر" },
                { status: 400 }
            );
        }

        const body = await req.json().catch(() => ({}));
        const { type } = body;

        if (!["view", "click"].includes(type)) {
            return NextResponse.json(
                { message: "نوع رخداد نامعتبر" },
                { status: 400 }
            );
        }

        const update =
            type === "view"
                ? { $inc: { "stats.views": 1 } }
                : { $inc: { "stats.clicks": 1 } };

        const ad = await Advertisement.findByIdAndUpdate(id, update, {
            new: true,
            select: "stats",
        });

        if (!ad) {
            return NextResponse.json(
                { message: "تبلیغ یافت نشد" },
                { status: 404 }
            );
        }

        // محاسبه CTR
        if (ad.stats.views > 0) {
            const ctr = (ad.stats.clicks / ad.stats.views) * 100;
            await Advertisement.updateOne(
                { _id: id },
                { $set: { "stats.ctr": Number(ctr.toFixed(2)) } }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[ads/track] Error:", err);
        return NextResponse.json(
            { message: err.message || "خطای سرور" },
            { status: 500 }
        );
    }
}s