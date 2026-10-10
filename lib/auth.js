// lib/auth.js
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import https from "https";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/* ============================================================
   چک امنیتی NEXTAUTH_SECRET
   ============================================================ */
if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_SECRET) {
    throw new Error(
        "NEXTAUTH_SECRET در environment تنظیم نشده است. این یک خطر امنیتی جدی است."
    );
}

const isDev = process.env.NODE_ENV !== "production";
const log = (...args) => {
    if (isDev) console.log(...args);
};

/* ============================================================
   ارسال OTP با ملی‌پیامک
   ============================================================ */
const sendOtpViaMelipayamak = (phoneNumber) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ to: phoneNumber });

        const options = {
            hostname: "console.melipayamak.com",
            port: 443,
            path: "/api/send/otp/2783a430de89451a8499166485b11b68",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": data.length,
            },
        };

        const req = https.request(options, (res) => {
            let responseData = "";

            res.on("data", (d) => {
                responseData += d;
            });

            res.on("end", () => {
                try {
                    log("Response from Melipayamak:", responseData);

                    const result = JSON.parse(responseData);

                    let otpCode = null;

                    if (result.code) {
                        otpCode = result.code;
                    } else if (result.otp) {
                        otpCode = result.otp;
                    } else if (result.data && result.data.code) {
                        otpCode = result.data.code;
                    } else if (typeof result === "string") {
                        otpCode = result;
                    } else {
                        otpCode = responseData;
                    }

                    if (!otpCode) {
                        return reject(
                            new Error("کد OTP از پاسخ سرویس پیامک استخراج نشد")
                        );
                    }

                    resolve({
                        success: true,
                        code: String(otpCode),
                    });
                } catch (error) {
                    reject(new Error("خطا در پردازش پاسخ: " + error.message));
                }
            });
        });

        req.on("error", (error) => {
            reject(new Error("خطا در ارسال درخواست: " + error.message));
        });

        req.write(data);
        req.end();
    });
};

/* ============================================================
   authOptions
   ============================================================ */
export const authOptions = {
    providers: [
        /* ---------- ۱. Credentials: ایمیل / نام کاربری ---------- */
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: {
                    label: "Email / Username",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
            async authorize(credentials) {
                await connectDB();

                try {
                    const { identifier, password } = credentials;

                    if (!identifier || !password) {
                        throw new Error("اطلاعات ورود کامل نیست");
                    }

                    const user = await User.findOne({
                        $or: [
                            { email: identifier },
                            { username: identifier },
                        ],
                    }).select("+password");

                    if (!user) {
                        throw new Error(
                            "کاربری با این ایمیل یا نام کاربری یافت نشد"
                        );
                    }

                    if (!user.is_active) {
                        throw new Error("حساب کاربری شما غیرفعال است");
                    }

                    if (!user.password) {
                        throw new Error("رمز عبور کاربر یافت نشد");
                    }

                    const isPasswordValid = await user.comparePassword(
                        password
                    );

                    if (!isPasswordValid) {
                        throw new Error("رمز عبور اشتباه است");
                    }

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
                } catch (error) {
                    log("AUTH ERROR (credentials):", error.message);
                    throw new Error(error.message || "خطا در ورود");
                }
            },
        }),

        /* ---------- ۲. Phone + Password ---------- */
        CredentialsProvider({
            id: "phone-password",
            name: "Phone Password",
            credentials: {
                phone: { label: "Phone", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();

                try {
                    const { phone, password } = credentials;

                    if (!phone || !password) {
                        throw new Error("اطلاعات ورود کامل نیست");
                    }

                    const user = await User.findOne({ phone }).select(
                        "+password"
                    );

                    if (!user) {
                        throw new Error(
                            "کاربری با این شماره همراه یافت نشد"
                        );
                    }

                    if (!user.is_active) {
                        throw new Error("حساب کاربری شما غیرفعال است");
                    }

                    if (!user.password) {
                        throw new Error("رمز عبور کاربر یافت نشد");
                    }

                    const isPasswordValid = await user.comparePassword(
                        password
                    );

                    if (!isPasswordValid) {
                        throw new Error("رمز عبور اشتباه است");
                    }

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
                } catch (error) {
                    log("AUTH ERROR (phone-password):", error.message);
                    throw new Error(error.message || "خطا در ورود");
                }
            },
        }),

        /* ---------- ۳. Phone OTP ---------- */
        CredentialsProvider({
            id: "phone-otp",
            name: "Phone OTP",
            credentials: {
                phone: { label: "Phone", type: "text" },
                otpCode: { label: "OTP Code", type: "text" },
                step: { label: "Step", type: "text" },
            },
            async authorize(credentials) {
                await connectDB();

                const { phone, otpCode, step } = credentials;

                /* ----- مرحله درخواست کد ----- */
                if (step === "request") {
                    try {
                        const result = await sendOtpViaMelipayamak(phone);

                        if (!result.success || !result.code) {
                            throw new Error("ارسال کد با خطا مواجه شد");
                        }

                        const otpExpires = new Date(
                            Date.now() + 5 * 60 * 1000
                        );

                        const existingUser = await User.findOne({ phone });

                        if (existingUser) {
                            existingUser.otp_code = result.code;
                            existingUser.otp_expires = otpExpires;
                            await existingUser.save({
                                validateBeforeSave: false,
                            });
                        } else {
                            // ساخت کاربر مهمان با مقادیر یونیک
                            const uid = crypto.randomUUID().slice(0, 8);
                            const randomPassword = await bcrypt.hash(
                                crypto.randomBytes(16).toString("hex"),
                                10
                            );

                            await User.create({
                                phone,
                                full_name: "کاربر مهمان",
                                username: `guest_${uid}`,
                                email: `guest_${uid}@temp.local`,
                                password: randomPassword,
                                otp_code: result.code,
                                otp_expires: otpExpires,
                            });
                        }

                        return {
                            id: "otp_sent",
                            phone,
                            message: "کد تایید با موفقیت ارسال شد",
                        };
                    } catch (error) {
                        log("OTP REQUEST ERROR:", error.message);
                        throw new Error(
                            error.message || "خطا در ارسال کد تایید"
                        );
                    }
                }

                /* ----- مرحله تایید کد ----- */
                else if (step === "verify") {
                    const user = await User.findOne({ phone }).select(
                        "+otp_code +otp_expires"
                    );

                    if (!user) {
                        throw new Error("کاربری با این شماره یافت نشد");
                    }

                    if (!user.otp_code || !user.otp_expires) {
                        throw new Error("کد تاییدی ارسال نشده است");
                    }

                    if (user.otp_expires < new Date()) {
                        throw new Error("کد تایید منقضی شده است");
                    }

                    if (user.otp_code !== otpCode) {
                        throw new Error("کد تایید اشتباه است");
                    }

                    user.otp_code = null;
                    user.otp_expires = null;
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
                }

                throw new Error("مرحله نامعتبر");
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user && user.id !== "otp_sent") {
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
            if (token?.id) {
                session.user = {
                    ...session.user, // ← merge به‌جای بازنویسی کامل
                    id: token.id,
                    full_name: token.full_name,
                    role: token.role,
                    role_fa: token.role_fa,
                    is_verified: token.is_verified,
                    phone: token.phone,
                    email: token.email,
                    username: token.username,
                };
            }
            return session;
        },
    },

    pages: {
        signIn: "/auth/user/login",
        error: "/auth/user/login",
    },

    secret: process.env.NEXTAUTH_SECRET,
};