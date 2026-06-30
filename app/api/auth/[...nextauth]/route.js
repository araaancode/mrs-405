// pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import https from "https";
import bcrypt from "bcryptjs";

const sendOtpViaMelipayamak = (phoneNumber) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            to: phoneNumber
        });

        const options = {
            hostname: 'console.melipayamak.com',
            port: 443,
            path: '/api/send/otp/2783a430de89451a8499166485b11b68',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (d) => {
                responseData += d;
            });

            res.on('end', () => {
                try {
                    console.log('Response from Melipayamak:', responseData);

                    const result = JSON.parse(responseData);

                    let otpCode = null;

                    if (result.code) {
                        otpCode = result.code;
                    } else if (result.otp) {
                        otpCode = result.otp;
                    } else if (result.data && result.data.code) {
                        otpCode = result.data.code;
                    } else if (typeof result === 'string') {
                        otpCode = result;
                    } else {
                        otpCode = responseData;
                    }

                    resolve({
                        success: true,
                        code: String(otpCode)
                    });

                } catch (error) {
                    reject(
                        new Error('خطا در پردازش پاسخ: ' + error.message)
                    );
                }
            });
        });

        req.on('error', (error) => {
            reject(
                new Error('خطا در ارسال درخواست: ' + error.message)
            );
        });

        req.write(data);
        req.end();
    });
};

export const authOptions = {

    providers: [


        CredentialsProvider({
            id: "credentials",
            name: "Credentials",

            credentials: {
                identifier: {
                    label: "Email / Username",
                    type: "text"
                },

                password: {
                    label: "Password",
                    type: "password"
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
                            { username: identifier }
                        ]
                    }).select("+password");

                    if (!user) {
                        throw new Error(
                            "کاربری با این ایمیل یا نام کاربری یافت نشد"
                        );
                    }

                    if (!user.is_active) {
                        throw new Error(
                            "حساب کاربری شما غیرفعال است"
                        );
                    }

                    // بررسی وجود پسورد
                    if (!user.password) {
                        throw new Error("رمز عبور کاربر یافت نشد");
                    }

                    // مقایسه رمز عبور
                    const isPasswordValid =
                        await user.comparePassword(password);

                    console.log("Entered Password:", password);
                    console.log("Stored Hash:", user.password);
                    console.log("Password Match:", isPasswordValid);

                    if (!isPasswordValid) {
                        throw new Error("رمز عبور اشتباه است");
                    }

                    user.last_login = new Date();

                    await user.save({
                        validateBeforeSave: false
                    });

                    return {
                        id: user._id.toString(),
                        full_name: user.full_name,
                        role: user.role,
                        role_fa: user.role_fa,
                        is_verified: user.is_verified,
                        phone: user.phone,
                        email: user.email,
                        username: user.username
                    };

                } catch (error) {

                    console.log("AUTH ERROR:", error.message);

                    throw new Error(
                        error.message || "خطا در ورود"
                    );
                }
            }
        }),

       
        CredentialsProvider({

            id: "phone-password",
            name: "Phone Password",

            credentials: {
                phone: {
                    label: "Phone",
                    type: "text"
                },

                password: {
                    label: "Password",
                    type: "password"
                },
            },

            async authorize(credentials) {

                await connectDB();

                try {

                    const { phone, password } = credentials;

                    if (!phone || !password) {
                        throw new Error("اطلاعات ورود کامل نیست");
                    }

                    const user = await User.findOne({
                        phone
                    }).select("+password");

                    if (!user) {
                        throw new Error(
                            "کاربری با این شماره همراه یافت نشد"
                        );
                    }

                    if (!user.is_active) {
                        throw new Error(
                            "حساب کاربری شما غیرفعال است"
                        );
                    }

                    if (!user.password) {
                        throw new Error("رمز عبور کاربر یافت نشد");
                    }

                    const isPasswordValid =
                        await user.comparePassword(password);

                    console.log("Password Match:", isPasswordValid);

                    if (!isPasswordValid) {
                        throw new Error("رمز عبور اشتباه است");
                    }

                    user.last_login = new Date();

                    await user.save({
                        validateBeforeSave: false
                    });

                    return {
                        id: user._id.toString(),
                        full_name: user.full_name,
                        role: user.role,
                        role_fa: user.role_fa,
                        is_verified: user.is_verified,
                        phone: user.phone,
                        email: user.email,
                        username: user.username
                    };

                } catch (error) {

                    console.log("AUTH ERROR:", error.message);

                    throw new Error(
                        error.message || "خطا در ورود"
                    );
                }
            }
        }),

        
        CredentialsProvider({

            id: "phone-otp",
            name: "Phone OTP",

            credentials: {

                phone: {
                    label: "Phone",
                    type: "text"
                },

                otpCode: {
                    label: "OTP Code",
                    type: "text"
                },

                step: {
                    label: "Step",
                    type: "text"
                }
            },

            async authorize(credentials) {

                await connectDB();

                const {
                    phone,
                    otpCode,
                    step
                } = credentials;

                
                if (step === "request") {

                    try {

                        const result =
                            await sendOtpViaMelipayamak(phone);

                        if (!result.success || !result.code) {
                            throw new Error(
                                "ارسال کد با خطا مواجه شد"
                            );
                        }

                        const user =
                            await User.findOne({ phone });

                        if (user) {

                            user.otp_code = result.code;

                            user.otp_expires =
                                new Date(Date.now() + 5 * 60 * 1000);

                            await user.save({
                                validateBeforeSave: false
                            });

                        } else {

                            await User.findOneAndUpdate(
                                { phone },
                                {
                                    phone,
                                    otp_code: result.code,
                                    otp_expires:
                                        new Date(Date.now() + 5 * 60 * 1000),

                                    full_name: "کاربر مهمان",

                                    username: `guest_${Date.now()} `,

                                    email: `guest_${Date.now()} @temp.com`,

                                    password:
                                        await bcrypt.hash(
                                            Math.random()
                                                .toString(36),
                                            10
                                        )
                                },
                                {
                                    upsert: true,
                                    new: true
                                }
                            );
                        }

                        return {
                            id: "otp_sent",
                            phone,
                            message:
                                "کد تایید با موفقیت ارسال شد"
                        };

                    } catch (error) {

                        throw new Error(
                            error.message ||
                            "خطا در ارسال کد تایید"
                        );
                    }
                }

                // مرحله تایید کد
                else if (step === "verify") {

                    const user =
                        await User.findOne({ phone })
                            .select("+otp_code +otp_expires");

                    if (!user) {
                        throw new Error(
                            "کاربری با این شماره یافت نشد"
                        );
                    }

                    if (!user.otp_code || !user.otp_expires) {
                        throw new Error(
                            "کد تاییدی ارسال نشده است"
                        );
                    }

                    if (user.otp_expires < new Date()) {
                        throw new Error(
                            "کد تایید منقضی شده است"
                        );
                    }

                    if (user.otp_code !== otpCode) {
                        throw new Error(
                            "کد تایید اشتباه است"
                        );
                    }

                    user.otp_code = null;
                    user.otp_expires = null;
                    user.last_login = new Date();

                    await user.save({
                        validateBeforeSave: false
                    });

                    return {
                        id: user._id.toString(),
                        full_name: user.full_name,
                        role: user.role,
                        role_fa: user.role_fa,
                        is_verified: user.is_verified,
                        phone: user.phone,
                        email: user.email,
                        username: user.username
                    };
                }

                throw new Error("مرحله نامعتبر");
            }
        })
    ],

    session: {
        strategy: "jwt"
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

            if (token.id) {

                session.user = {
                    id: token.id,
                    full_name: token.full_name,
                    role: token.role,
                    role_fa: token.role_fa,
                    is_verified: token.is_verified,
                    phone: token.phone,
                    email: token.email,
                    username: token.username
                };
            }

            return session;
        }
    },

    pages: {
        signIn: "/auth/user/login",
        error: "/auth/user/login"
    },

    secret:
        process.env.NEXTAUTH_SECRET || "dev_secret_key"
};

const handler = NextAuth(authOptions);

export {
    handler as GET,
    handler as POST
};