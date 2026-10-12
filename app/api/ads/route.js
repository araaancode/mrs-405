// app/api/ads/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Advertisement from "@/models/Advertisement";
import Hall from "@/models/Hall"; // ← مهم: ثبت مدل Hall در Mongoose برای populate

/* ============================================================
   GET — تبلیغات فعال برای نمایش در سایت (عمومی)
   ============================================================ */
export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type"); // banner | sidebar | popup | featured | home_slider
        const placement = searchParams.get("placement"); // home | halls | ...
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        const now = new Date();

        // فقط تبلیغات فعال در بازه‌ی زمانی
        const query = {
            status: "active",
            is_active: true,
            start_date: { $lte: now },
            end_date: { $gte: now },
        };

        if (type) query.ad_type = type;
        if (placement) {
            query.$or = [{ placement }, { placement: "all" }];
        }

        const ads = await Advertisement.find(query)
            .populate("hall_id", "title city province images")
            .sort({ createdAt: -1 })
            .limit(limit)
            .select(
                "title description images ad_type placement target_url cta_text hall_id stats"
            )
            .lean();

        return NextResponse.json({
            success: true,
            ads,
            count: ads.length,
        });
    } catch (err) {
        console.error("[ads] Error:", err);
        return NextResponse.json(
            { success: false, message: err.message || "خطای سرور" },
            { status: 500 }
        );
    }
}