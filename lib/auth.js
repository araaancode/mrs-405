// lib/auth.js
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: {
                    label: "Email / Phone / Username",
                    type: "text",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();

                const { identifier, password } = credentials;

                if (!identifier || !password) {
                    throw new Error("اطلاعات ورود کامل نیست");
                }

                const user = await User.findOne({
                    $or: [
                        { email: identifier },
                        { phone: identifier },
                        { username: identifier },
                    ],
                }).select("+password");

                if (!user) {
                    throw new Error("کاربر یافت نشد");
                }

                //  چک کردن فعال بودن حساب
                if (!user.is_active) {
                    throw new Error("حساب شما غیرفعال است");
                }

                //  چک کردن وجود پسورد
                if (!user.password) {
                    throw new Error("رمز عبور کاربر یافت نشد");
                }

                //  مقایسه پسورد (با متد مدل User)
                const isPasswordValid = await user.comparePassword(password);
                if (!isPasswordValid) {
                    throw new Error("رمز عبور اشتباه است");
                }

                //  بروزرسانی آخرین ورود
                user.last_login = new Date();
                await user.save({ validateBeforeSave: false });

                return {
                    id: user._id.toString(),
                    full_name: user.full_name,
                    role: user.role,
                    role_fa: user.role_fa,
                    is_verified: user.is_verified,
                    phone: user.phone,
                    email: user.email,
                    username: user.username,
                };
            },
        }),
    ],

    session: { strategy: "jwt" },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.full_name = user.full_name;
                token.role = user.role;
                token.role_fa = user.role_fa;
                token.is_verified = user.is_verified;
                token.phone = user.phone;
                token.email = user.email;
                token.username = user.username;
            }
            return token;
        },

        async session({ session, token }) {
            session.user = {
                id: token.id,
                full_name: token.full_name,
                role: token.role,
                role_fa: token.role_fa,
                is_verified: token.is_verified,
                phone: token.phone,
                email: token.email,
                username: token.username,
            };
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET || "dev_secret_key",

    pages: {
        signIn: "/auth/user/login",
        error: "/auth/user/login",
    },
};