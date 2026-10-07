// app/api/hall_owner/profile/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import User from "@/models/User";

/* ============================================================
   GET — دریافت پروفایل
   ============================================================ */
export async function GET() {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(session.user.id);
        if (!user) {
            return Response.json(
                { message: "کاربر یافت نشد" },
                { status: 404 }
            );
        }

        return Response.json({ user });
    } catch (error) {
        console.error("GET /api/hall_owner/profile error:", error);
        return Response.json(
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
        if (!session) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        /*  پاکسازی مقادیر خالی و فیلدهای غیرمجاز */
        const cleanData = {};
        const forbiddenFields = [
            "_id",
            "__v",
            "password",
            "role",
            "createdAt",
            "updatedAt",
        ];

        for (const [key, value] of Object.entries(data)) {
            if (forbiddenFields.includes(key)) continue;
            if (value === "" || value === null || value === undefined) continue;
            cleanData[key] = value;
        }

        /*  استفاده از returnDocument به‌جای new */
        const user = await User.findByIdAndUpdate(
            session.user.id,
            cleanData,
            {
                returnDocument: "after", //  جایگزین new: true
                runValidators: true,
            }
        );

        if (!user) {
            return Response.json(
                { message: "کاربر یافت نشد" },
                { status: 404 }
            );
        }

        return Response.json({
            message: "پروفایل با موفقیت به‌روزرسانی شد",
            user,
        });
    } catch (error) {
        console.error("PUT /api/hall_owner/profile error:", error);

        /*  مدیریت خطاهای Validation */
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return Response.json(
                { message: messages.join(" | ") },
                { status: 400 }
            );
        }

        if (error.code === 11000) {
            // Duplicate key error (ایمیل، نام کاربری، شماره تلفن تکراری)
            const field = Object.keys(error.keyPattern)[0];
            const fieldMap = {
                email: "ایمیل",
                username: "نام کاربری",
                phone: "شماره همراه",
                national_code: "کد ملی",
            };
            return Response.json(
                { message: `${fieldMap[field] || field} قبلاً استفاده شده است` },
                { status: 400 }
            );
        }

        return Response.json(
            { message: error.message || "خطا در به‌روزرسانی" },
            { status: 500 }
        );
    }
}