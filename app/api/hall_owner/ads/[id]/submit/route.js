// app/api/hall_owner/ads/[id]/submit/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Advertisement from "@/models/Advertisement";

export async function PATCH(req, { params }) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "hall_owner") {
            return NextResponse.json(
                { message: "دسترسی غیرمجاز" },
                { status: 403 }
            );
        }

        const { id } = await params;

        const ad = await Advertisement.findOne({
            _id: id,
            owner_id: session.user.id,
        });

        if (!ad) {
            return NextResponse.json(
                { message: "تبلیغ یافت نشد" },
                { status: 404 }
            );
        }

        if (ad.status !== "draft") {
            return NextResponse.json(
                { message: "فقط تبلیغات پیش‌نویس قابل ارسال هستند" },
                { status: 400 }
            );
        }

        if (!ad.images || ad.images.length === 0) {
            return NextResponse.json(
                { message: "حداقل یک تصویر برای تبلیغ لازم است" },
                { status: 400 }
            );
        }

        ad.status = "pending";
        await ad.save();

        return NextResponse.json({
            success: true,
            message: "تبلیغ برای تأیید ارسال شد",
            ad,
        });
    } catch (err) {
        console.error("[hall_owner/ads/[id]/submit] Error:", err);
        return NextResponse.json(
            { message: err.message || "خطای سرور" },
            { status: 500 }
        );
    }
}