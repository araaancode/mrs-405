// app/api/halls/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Hall from "@/models/Hall";

/* ============================================================
   فیلدهای موردنیاز — فقط چیزی که در کارت‌ها استفاده می‌کنی
   ============================================================ */
const HALL_LIST_FIELDS = [
    "title",
    "city",
    "province",
    "images",
    "capacity",
    "duration",
    "sans_price",
    "main_price",
    "sans_discount",
    "has_sans",
    "parking_count",
    "hall_type",
    "host_type",
    "event_type",
    "description",
    "createdAt",
].join(" ");

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
        const limit = Math.min(
            50,
            Math.max(1, parseInt(searchParams.get("limit") || "12", 10))
        );
        const skip = (page - 1) * limit;

        /* اجرای موازی: هم‌زمان تالارها و تعداد کل */
        const [halls, total] = await Promise.all([
            Hall.find({})
                .select(HALL_LIST_FIELDS)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Hall.countDocuments({}),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json(
            {
                success: true,
                count: halls.length,
                total,
                page,
                totalPages,
                data: halls,
            },
            {
                status: 200,
                headers: {
                    // کش CDN — ۵ دقیقه تازه، ۱۰ دقیقه stale-while-revalidate
                    "Cache-Control":
                        "public, s-maxage=300, stale-while-revalidate=600",
                },
            }
        );
    } catch (error) {
        console.error("Error fetching halls:", error);

        return NextResponse.json(
            {
                success: false,
                message: "خطا در دریافت لیست تالارها",
            },
            { status: 500 }
        );
    }
}