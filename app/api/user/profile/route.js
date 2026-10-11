// app/api/user/profile/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isDev = process.env.NODE_ENV !== "production";
const log = (...args) => {
    if (isDev) console.log(...args);
};

/* ============================================================
   GET — دریافت پروفایل کاربر
   ============================================================ */
export async function GET(req) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);

        log("=== /api/user/profile GET ===", {
            hasSession: !!session,
            userId: session?.user?.id,
            role: session?.user?.role,
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "لطفاً وارد حساب کاربری شوید" },
                { status: 401 }
            );
        }

        const user = await User.findById(session.user.id).select(
            "-password -otp_code -otp_expires"
        );

        if (!user) {
            return NextResponse.json(
                { message: "کاربر یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error("GET /api/user/profile error:", error);
        return NextResponse.json(
            { message: "خطا در دریافت اطلاعات" },
            { status: 500 }
        );
    }
}

/* ============================================================
   PUT — به‌روزرسانی پروفایل
   ============================================================ */
export async function PUT(req) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "لطفاً وارد حساب کاربری شوید" },
                { status: 401 }
            );
        }

        const data = await req.json();

        /* ---------- فیلدهای ممنوع ---------- */
        const forbiddenFields = [
            "_id",
            "__v",
            "password",
            "role",
            "createdAt",
            "updatedAt",
            "otp_code",
            "otp_expires",
            "is_active",
            "verified_at",
            "last_login",
        ];

        /* ---------- فیلدهای قابل null/خالی ---------- */
        const nullableFields = [
            "documents",
            "avatar",
            "birth_certificate",
            "national_code",
            "province",
            "city",
            "gender",
            "birth_date",
        ];

        const cleanData = {};

        for (const [key, value] of Object.entries(data)) {
            if (forbiddenFields.includes(key)) continue;

            // فیلدهای nullable — هر مقداری حتی خالی
            if (nullableFields.includes(key)) {
                if (key === "birth_date" && value) {
                    const d = new Date(value);
                    if (!isNaN(d.getTime())) cleanData[key] = d;
                } else {
                    cleanData[key] = value === "" ? null : value;
                }
                continue;
            }

            // بقیه فیلدها — خالی را نادیده بگیر
            if (value === "" || value === null || value === undefined) continue;
            cleanData[key] = value;
        }

        const user = await User.findByIdAndUpdate(
            session.user.id,
            cleanData,
            {
                returnDocument: "after",
                runValidators: true,
            }
        ).select("-password -otp_code -otp_expires");

        if (!user) {
            return NextResponse.json(
                { message: "کاربر یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "پروفایل با موفقیت به‌روزرسانی شد",
            user,
        });
    } catch (error) {
        console.error("PUT /api/user/profile error:", error);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(
                (e) => e.message
            );
            return NextResponse.json(
                { message: messages.join(" | ") },
                { status: 400 }
            );
        }

        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const fieldMap = {
                email: "ایمیل",
                username: "نام کاربری",
                phone: "شماره همراه",
                national_code: "کد ملی",
            };
            return NextResponse.json(
                {
                    message: `${fieldMap[field] || field} قبلاً استفاده شده است`,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: error.message || "خطا در به‌روزرسانی" },
            { status: 500 }
        );
    }
}