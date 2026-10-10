// app/api/user/profile/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ============================================================
   GET — دریافت پروفایل کاربر
   ============================================================ */
export async function GET(req) {
    try {
        await dbConnect();

        /* لاگ‌های تشخیصی — بعداً می‌توانید حذف کنید */
        console.log("=== /api/user/profile GET ===");
        console.log("Cookie header:", req.headers.get("cookie"));
        console.log("NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET);

        const session = await getServerSession(authOptions);
        console.log("Session:", JSON.stringify(session, null, 2));

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await User.findById(session.user.id);
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
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const data = await req.json();

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

            if (nullableFields.includes(key)) {
                cleanData[key] = value;
                continue;
            }

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
        );

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
            const messages = Object.values(error.errors).map((e) => e.message);
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