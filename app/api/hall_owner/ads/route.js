export const dynamic = "force-dynamic";

// app/api/hall_owner/ads/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Advertisement from "@/models/Advertisement";
import Hall from "@/models/Hall"; // ← مهم

/* ============================================================
   GET — لیست تبلیغات تالاردار
   ============================================================ */
export async function GET() {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "hall_owner") {
            return NextResponse.json(
                { message: "دسترسی غیرمجاز" },
                { status: 403 }
            );
        }

        const ads = await Advertisement.find({
            owner_id: session.user.id,
        })
            .populate("hall_id", "title city province images")
            .sort({ createdAt: -1 })
            .lean();

        const stats = {
            total: ads.length,
            draft: ads.filter((a) => a.status === "draft").length,
            pending: ads.filter((a) => a.status === "pending").length,
            active: ads.filter((a) => a.status === "active").length,
            paused: ads.filter((a) => a.status === "paused").length,
            rejected: ads.filter((a) => a.status === "rejected").length,
            expired: ads.filter((a) => a.status === "expired").length,
            total_views: ads.reduce((sum, a) => sum + (a.stats?.views || 0), 0),
            total_clicks: ads.reduce((sum, a) => sum + (a.stats?.clicks || 0), 0),
            total_budget: ads.reduce((sum, a) => sum + (a.budget || 0), 0),
        };

        return NextResponse.json({ success: true, ads, stats });
    } catch (err) {
        console.error("[hall_owner/ads GET] Error:", err);
        return NextResponse.json(
            { message: err.message || "خطای سرور" },
            { status: 500 }
        );
    }
}

/* ============================================================
   POST — ایجاد تبلیغ جدید
   ============================================================ */
export async function POST(req) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "hall_owner") {
            return NextResponse.json(
                { message: "دسترسی غیرمجاز" },
                { status: 403 }
            );
        }

        const body = await req.json();

        const {
            title,
            description,
            images,
            ad_type,
            placement,
            target_url,
            cta_text,
            start_date,
            end_date,
            budget,
            daily_budget,
            hall_id,
        } = body;

        if (!title || !description || !ad_type || !start_date || !end_date || !budget) {
            return NextResponse.json(
                { message: "فیلدهای الزامی را پر کنید" },
                { status: 400 }
            );
        }

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (endDate <= startDate) {
            return NextResponse.json(
                { message: "تاریخ پایان باید بعد از تاریخ شروع باشد" },
                { status: 400 }
            );
        }

        if (hall_id) {
            const hall = await Hall.findOne({
                _id: hall_id,
                hall_owner_id: session.user.id,
            });
            if (!hall) {
                return NextResponse.json(
                    { message: "تالار معتبر نیست" },
                    { status: 400 }
                );
            }
        }

        const ad = await Advertisement.create({
            owner_id: session.user.id,
            hall_id: hall_id || null,
            title: title.trim(),
            description: description.trim(),
            images: images || [],
            ad_type,
            placement: placement || "all",
            target_url: target_url?.trim() || "",
            cta_text: cta_text?.trim() || "مشاهده",
            start_date: startDate,
            end_date: endDate,
            budget,
            daily_budget: daily_budget || 0,
            status: "draft",
        });

        return NextResponse.json({
            success: true,
            ad,
            message: "تبلیغ با موفقیت ایجاد شد",
        });
    } catch (err) {
        console.error("[hall_owner/ads POST] Error:", err);
        return NextResponse.json(
            { message: err.message || "خطای سرور" },
            { status: 500 }
        );
    }
}