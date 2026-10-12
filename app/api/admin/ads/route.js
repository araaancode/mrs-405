// app/api/admin/ads/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Advertisement from "@/models/Advertisement";
import Hall from "@/models/Hall"; // ← مهم

/* ============================================================
   GET — لیست همه تبلیغات + آمار (ادمین)
   ============================================================ */
export async function GET(req) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "admin") {
            return NextResponse.json(
                { message: "دسترسی غیرمجاز" },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        const query = {};
        if (status && status !== "all") {
            query.status = status;
        }

        const ads = await Advertisement.find(query)
            .populate("owner_id", "full_name email phone")
            .populate("hall_id", "title city province images")
            .sort({ createdAt: -1 })
            .lean();

        const allAds = await Advertisement.find({}).lean();

        const stats = {
            total: allAds.length,
            draft: allAds.filter((a) => a.status === "draft").length,
            pending: allAds.filter((a) => a.status === "pending").length,
            active: allAds.filter((a) => a.status === "active").length,
            paused: allAds.filter((a) => a.status === "paused").length,
            rejected: allAds.filter((a) => a.status === "rejected").length,
            expired: allAds.filter((a) => a.status === "expired").length,
            total_views: allAds.reduce(
                (sum, a) => sum + (a.stats?.views || 0),
                0
            ),
            total_clicks: allAds.reduce(
                (sum, a) => sum + (a.stats?.clicks || 0),
                0
            ),
            total_revenue: allAds
                .filter((a) => a.payment_status === "paid")
                .reduce((sum, a) => sum + (a.budget || 0), 0),
        };

        return NextResponse.json({ success: true, ads, stats });
    } catch (err) {
        console.error("[admin/ads GET] Error:", err);
        return NextResponse.json(
            { message: err.message || "خطای سرور" },
            { status: 500 }
        );
    }
}