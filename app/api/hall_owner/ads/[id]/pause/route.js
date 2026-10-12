// app/api/hall_owner/ads/[id]/pause/route.js
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
        const { action } = await req.json();

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

        if (action === "pause") {
            if (ad.status !== "active") {
                return NextResponse.json(
                    { message: "فقط تبلیغات فعال قابل توقف هستند" },
                    { status: 400 }
                );
            }
            ad.status = "paused";
            ad.is_active = false;
        } else if (action === "resume") {
            if (ad.status !== "paused") {
                return NextResponse.json(
                    { message: "فقط تبلیغات متوقف قابل فعال‌سازی هستند" },
                    { status: 400 }
                );
            }
            if (ad.end_date < new Date()) {
                return NextResponse.json(
                    { message: "این تبلیغ منقضی شده است" },
                    { status: 400 }
                );
            }
            ad.status = "active";
            ad.is_active = true;
        } else {
            return NextResponse.json(
                { message: "عملیات نامعتبر" },
                { status: 400 }
            );
        }

        await ad.save();

        return NextResponse.json({
            success: true,
            ad,
            message: action === "pause" ? "تبلیغ متوقف شد" : "تبلیغ فعال شد",
        });
    } catch (err) {
        console.error("[hall_owner/ads/pause] Error:", err);
        return NextResponse.json(
            { message: err.message || "خطای سرور" },
            { status: 500 }
        );
    }
}