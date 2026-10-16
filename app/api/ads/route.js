export const dynamic = "force-dynamic";

// app/api/ads/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Advertisement from "@/models/Advertisement";
import Hall from "@/models/Hall"; // ← مهم: برای populate باید مدل ثبت شود

/* ============================================================
   GET — تبلیغات فعال برای نمایش در سایت (عمومی)
   
   Query params:
   - placement: home | halls | hall_detail | user_panel | all
   - type: banner | sidebar | popup | featured | home_slider
   - limit: حداکثر تعداد (پیش‌فرض 12، سقف 100)
   - page: شماره صفحه (پیش‌فرض 1)
   ============================================================ */
export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const placement = searchParams.get("placement");
        const type = searchParams.get("type");
        const limit = Math.min(
            parseInt(searchParams.get("limit") || "12", 10),
            100
        );
        const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
        const skip = (page - 1) * limit;

        const now = new Date();

        /* ---------- ساخت کوئری ---------- */
        const query = {
            status: "active",
            is_active: true,
            start_date: { $lte: now },
            end_date: { $gte: now },
        };

        if (placement) {
            query.$or = [{ placement }, { placement: "all" }];
        }
        if (type) query.ad_type = type;

        /* ---------- دریافت داده با pagination ---------- */
        const [ads, total] = await Promise.all([
            Advertisement.find(query)
                .populate("hall_id", "title city province images phone")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select(
                    "title description images ad_type placement target_url cta_text hall_id stats start_date end_date"
                )
                .lean(),
            Advertisement.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            ads,
            count: ads.length,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error("[ads/GET] Error:", err);
        return NextResponse.json(
            { success: false, message: err.message || "خطای سرور" },
            { status: 500 }
        );
    }
}