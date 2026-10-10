import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import User from "@/models/User";

/* ============================================================
   Whitelist فیلدهای مجاز برای به‌روزرسانی توسط کاربر
   ============================================================ */
const ALLOWED_FIELDS = [
    "full_name",
    "username",
    "email",
    "phone",
    "national_code",
    "birth_certificate",
    "birth_date",
    "gender",
    "province",
    "city",
    "avatar",
    "documents",
];

function pickAllowedFields(data) {
    const filtered = {};
    for (const key of ALLOWED_FIELDS) {
        if (data[key] !== undefined) filtered[key] = data[key];
    }
    return filtered;
}

/* ============================================================
   GET — دریافت پروفایل
   ============================================================ */
export async function GET() {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(session.user.id)
            .select("-password -otp_code -otp_expires")
            .lean();

        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }

        return Response.json({ user });
    } catch (err) {
        console.error("[GET /api/user/profile]", err);
        return Response.json(
            { message: "Internal server error" },
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
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const updates = pickAllowedFields(body);

        if (Object.keys(updates).length === 0) {
            return Response.json(
                { message: "هیچ فیلد معتبری برای به‌روزرسانی ارسال نشده" },
                { status: 400 }
            );
        }

        /* بررسی یکتا بودن username / email / phone */
        const uniqueFields = ["username", "email", "phone"];
        for (const field of uniqueFields) {
            if (updates[field]) {
                const exists = await User.findOne({
                    [field]: updates[field],
                    _id: { $ne: session.user.id },
                }).lean();
                if (exists) {
                    return Response.json(
                        { message: `${field} قبلاً استفاده شده است` },
                        { status: 409 }
                    );
                }
            }
        }

        const user = await User.findByIdAndUpdate(
            session.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        )
            .select("-password -otp_code -otp_expires")
            .lean();

        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }

        return Response.json({ message: "updated", user });
    } catch (err) {
        /* خطاهای اعتبارسنجی Mongoose */
        if (err.name === "ValidationError") {
            const errors = Object.fromEntries(
                Object.entries(err.errors).map(([k, v]) => [k, v.message])
            );
            return Response.json(
                { message: "خطای اعتبارسنجی", errors },
                { status: 422 }
            );
        }
        /* خطای duplicate key */
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return Response.json(
                { message: `${field} تکراری است` },
                { status: 409 }
            );
        }
        console.error("[PUT /api/user/profile]", err);
        return Response.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}