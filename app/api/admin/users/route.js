// app/api/admin/users/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

/* ============================================================
   GET /api/admin/users
   دریافت لیست کاربران با فیلتر، جستجو و صفحه‌بندی
   ============================================================ */
export async function GET(req) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        // چک session
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "شما وارد حساب کاربری نشده‌اید" },
                { status: 401 }
            );
        }

        // چک نقش ادمین
        if (session.user.role !== "admin") {
            return NextResponse.json(
                { error: "شما دسترسی لازم را ندارید" },
                { status: 403 }
            );
        }

        /* ------------------------------------------------------------
           خواندن query parameters
           ------------------------------------------------------------ */
        const { searchParams } = new URL(req.url);

        const role = searchParams.get("role") || "all";
        const search = searchParams.get("search") || "";
        const searchField = searchParams.get("searchField") || "all";
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const sort = searchParams.get("sort") || "-createdAt"; // پیش‌فرض: جدیدترین اول

        /* ------------------------------------------------------------
           ساخت query
           ------------------------------------------------------------ */
        const conditions = [];

        // فیلتر نقش
        if (role !== "all") {
            conditions.push({ role });
        }

        // جستجو
        if (search.trim()) {
            const term = search.trim();
            const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const rx = { $regex: escaped, $options: "i" };

            let searchCondition;

            switch (searchField) {
                case "name":
                    searchCondition = {
                        $or: [
                            { full_name: rx },
                            { username: rx },
                        ],
                    };
                    break;
                case "email":
                    searchCondition = { email: rx };
                    break;
                case "phone":
                    searchCondition = { phone: rx };
                    break;
                case "role":
                    searchCondition = { role: rx };
                    break;
                case "location":
                    searchCondition = {
                        $or: [
                            { province: rx },
                            { city: rx },
                        ],
                    };
                    break;
                default: // "all"
                    searchCondition = {
                        $or: [
                            { full_name: rx },
                            { username: rx },
                            { email: rx },
                            { phone: rx },
                            { province: rx },
                            { city: rx },
                            { national_code: rx },
                        ],
                    };
            }

            conditions.push(searchCondition);
        }

        const query = conditions.length > 0 ? { $and: conditions } : {};

        /* ------------------------------------------------------------
           محاسبه تعداد کل برای صفحه‌بندی
           ------------------------------------------------------------ */
        const total = await User.countDocuments(query);

        /* ------------------------------------------------------------
           اجرای query با صفحه‌بندی
           ------------------------------------------------------------ */
        const skip = (page - 1) * limit;

        const users = await User.find(query)
            .select("-password -otp_code -otp_expires")
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        /* ------------------------------------------------------------
           پاسخ نهایی
           ------------------------------------------------------------ */
        return NextResponse.json(
            {
                success: true,
                users,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page * limit < total,
                    hasPrevPage: page > 1,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("[GET /api/admin/users] error:", err);
        return NextResponse.json(
            { error: "مشکلی پیش آمده", details: err.message },
            { status: 500 }
        );
    }
}