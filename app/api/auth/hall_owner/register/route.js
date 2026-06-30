import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {

    try {

        await connectDB();

        const {
            full_name,
            username,
            email,
            phone,
            password
        } = await req.json();

        // بررسی کامل بودن اطلاعات
        if (
            !full_name ||
            !username ||
            !email ||
            !phone ||
            !password
        ) {
            return Response.json(
                {
                    message: "تمام فیلدها الزامی هستند"
                },
                {
                    status: 400
                }
            );
        }

        // بررسی تکراری نبودن اطلاعات
        const exists = await User.findOne({
            $or: [
                { email },
                { phone },
                { username }
            ]
        });

        if (exists) {

            return Response.json(
                {
                    message:
                        "کاربری با این مشخصات قبلاً ثبت شده است"
                },
                {
                    status: 400
                }
            );
        }

        // ساخت کاربر جدید
        // پسورد را HASH نکن
        // چون مدل User خودش داخل pre-save هش می‌کند
        const user = await User.create({

            full_name,

            username,

            email,

            phone,

            password,

            role: "hall_owner",

            is_verified: false
        });

        return Response.json(
            {
                success: true,

                message:
                    "ثبت‌نام با موفقیت انجام شد",

                user: {
                    id: user._id,
                    full_name: user.full_name,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                }
            },
            {
                status: 201
            }
        );

    } catch (error) {

        console.log("REGISTER ERROR:", error);

        return Response.json(
            {
                success: false,

                message:
                    error.message || "خطا در ثبت‌نام"
            },
            {
                status: 500
            }
        );
    }
}