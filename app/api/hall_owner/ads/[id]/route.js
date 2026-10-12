// app/api/hall_owner/ads/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Advertisement from "@/models/Advertisement";
import mongoose from "mongoose";

/* ============================================================
   GET — جزئیات یک تبلیغ
   ============================================================ */
export async function GET(req, { params }) {
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "شناسه نامعتبر است" },
                { status: 400 }
            );
        }

        const ad = await Advertisement.findOne({
            _id: id,
            owner_id: session.user.id,
        }).populate("hall_id", "title city province images");

        if (!ad) {
            return NextResponse.json(
                { message: "تبلیغ یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, ad });
    } catch (err) {
        console.error("[hall_owner/ads/[id] GET] Error:", err);
        return NextResponse.json(
            { message: err.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   PUT — ویرایش تبلیغ
   ============================================================ */
export async function PUT(req, { params }) {
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
        const body = await req.json();

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

        // فقط تبلیغات draft یا rejected قابل ویرایش هستند
        if (!["draft", "rejected"].includes(ad.status)) {
            return NextResponse.json(
                { message: "فقط تبلیغات پیش‌نویس یا رد‌شده قابل ویرایش هستند" },
                { status: 400 }
            );
        }

        // به‌روزرسانی فیلدها
        Object.assign(ad, {
            title: body.title ?? ad.title,
            description: body.description ?? ad.description,
            images: body.images ?? ad.images,
            ad_type: body.ad_type ?? ad.ad_type,
            placement: body.placement ?? ad.placement,
            target_url: body.target_url ?? ad.target_url,
            cta_text: body.cta_text ?? ad.cta_text,
            start_date: body.start_date ? new Date(body.start_date) : ad.start_date,
            end_date: body.end_date ? new Date(body.end_date) : ad.end_date,
            budget: body.budget ?? ad.budget,
            daily_budget: body.daily_budget ?? ad.daily_budget,
            hall_id: body.hall_id ?? ad.hall_id,
        });

        // اگر rejected بود، به draft برگردد
        if (ad.status === "rejected") {
            ad.status = "draft";
            ad.rejection_reason = "";
        }

        await ad.save();

        return NextResponse.json({
            success: true,
            ad,
            message: "تبلیغ با موفقیت ویرایش شد",
        });
    } catch (err) {
        console.error("[hall_owner/ads/[id] PUT] Error:", err);
        return NextResponse.json(
            { message: err.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   DELETE — حذف تبلیغ
   ============================================================ */
export async function DELETE(req, { params }) {
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

        const ad = await Advertisement.findOneAndDelete({
            _id: id,
            owner_id: session.user.id,
        });

        if (!ad) {
            return NextResponse.json(
                { message: "تبلیغ یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "تبلیغ با موفقیت حذف شد",
        });
    } catch (err) {
        console.error("[hall_owner/ads/[id] DELETE] Error:", err);
        return NextResponse.json(
            { message: err.message || "خطای سرور" },
            { status: 500 }
        );
    }
}