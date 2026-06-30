"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    PiEnvelopeFill,
    PiLockKeyFill,
    PiArrowLeft,
    PiArrowRight,
    PiEye,
    PiEyeSlash,
    PiDeviceMobileFill,
    PiUserFill,
    PiCheckCircleFill,
    PiWarningCircleFill,
    PiArrowCounterClockwiseFill,
    PiKeyFill,
    PiCellSignalFull
} from "react-icons/pi";
import { GiLaurelCrown } from 'react-icons/gi';

export default function HallOwnerLoginPage() {
    const router = useRouter();

    // حالت‌های اصلی
    const [loginType, setLoginType] = useState("password"); // "password", "phone-password", "phone-otp"
    const [otpStep, setOtpStep] = useState("form"); // "form", "requesting", "verify"

    // فیلدهای عمومی
    const [identifier, setIdentifier] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [otpCode, setOtpCode] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [tempPhoneForOtp, setTempPhoneForOtp] = useState("");

    // تایمر برای ارسال مجدد کد
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // تشخیص نوع ورودی برای نمایش آیکون مناسب
    const getInputIcon = () => {
        if (identifier.includes("@")) {
            return <PiEnvelopeFill className="w-5 h-5 text-[#D4B06A]" />;
        } else if (/^09[0-9]{9}$/.test(identifier)) {
            return <PiDeviceMobileFill className="w-5 h-5 text-[#D4B06A]" />;
        }
        return <PiUserFill className="w-5 h-5 text-[#D4B06A]" />;
    };

    // لاگین با نام کاربری/ایمیل و رمز عبور (تالاردار)
    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signIn("credentials", {
            redirect: false,
            identifier,
            password,
            role: "hall_owner",
        });

        if (res?.error) {
            setError(res.error);
            setLoading(false);
            return;
        }

        router.push("/hall_owner/profile");
    };

    // لاگین با شماره همراه و رمز عبور (تالاردار)
    const handlePhonePasswordLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signIn("phone-password", {
            redirect: false,
            phone,
            password,
            role: "hall_owner",
        });

        if (res?.error) {
            setError(res.error);
            setLoading(false);
            return;
        }

        router.push("/hall_owner/profile");
    };

    // درخواست ارسال کد OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!phone || !/^09[0-9]{9}$/.test(phone)) {
            setError("شماره همراه معتبر وارد کنید (09xxxxxxxxx)");
            setLoading(false);
            return;
        }

        try {
            const res = await signIn("phone-otp", {
                redirect: false,
                phone,
                step: "request",
                role: "hall_owner",
            });

            if (res?.error) {
                setError(res.error);
                setLoading(false);
                return;
            }

            setTempPhoneForOtp(phone);
            setSuccess("کد تایید با موفقیت ارسال شد");
            setOtpStep("verify");
            setResendTimer(60);
            setLoading(false);
        } catch (error) {
            setError("خطا در ارسال کد تایید");
            setLoading(false);
        }
    };

    // تایید کد OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!otpCode || otpCode.length < 4) {
            setError("کد تایید معتبر وارد کنید");
            setLoading(false);
            return;
        }

        const res = await signIn("phone-otp", {
            redirect: false,
            phone: tempPhoneForOtp,
            otpCode,
            step: "verify",
            role: "hall_owner",
        });

        if (res?.error) {
            setError(res.error);
            setLoading(false);
            return;
        }

        router.push("/hall_owner/profile");
    };

    // ارسال مجدد کد
    const handleResendOtp = async () => {
        if (resendTimer > 0) return;

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await signIn("phone-otp", {
                redirect: false,
                phone: tempPhoneForOtp,
                step: "request",
                role: "hall_owner",
            });

            if (res?.error) {
                setError(res.error);
                setLoading(false);
                return;
            }

            setSuccess("کد تایید مجدداً ارسال شد");
            setResendTimer(60);
        } catch (error) {
            setError("خطا در ارسال مجدد کد");
        }
        setLoading(false);
    };

    // بازگشت به مرحله اول
    const handleBackToForm = () => {
        setOtpStep("form");
        setPhone("");
        setOtpCode("");
        setError("");
        setSuccess("");
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-8 sm:py-12 md:py-20 px-4 sm:px-6 lg:px-8 ">
            <div className="max-w-md mx-auto w-full">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-6 sm:mb-8"
                >
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 mt-10 sm:mb-4">
                        <div className="w-8 sm:w-12 md:w-16 h-px bg-gradient-to-r from-transparent via-[#D4B06A] to-transparent" />
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#D4B06A]/20 rounded-full blur-xl" />
                            <GiLaurelCrown className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-[#D4B06A] relative drop-shadow-md" />
                        </div>
                        <div className="w-8 sm:w-12 md:w-16 h-px bg-gradient-to-r from-transparent via-[#D4B06A] to-transparent" />
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2C2418] tracking-tight">
                        ورود <span className="text-[#D4B06A]">تالاردار</span>
                    </h2>
                    <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mx-auto mt-2 sm:mt-3 mb-2 sm:mb-3" />
                    <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
                        {loginType === "password" && "به پنل تالارداران خوش آمدید"}
                        {loginType === "phone-password" && "ورود با شماره همراه و رمز عبور"}
                        {loginType === "phone-otp" && "ورود با شماره همراه و کد تایید"}
                    </p>
                </motion.div>

                {/* انتخاب نوع ورود */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-lg sm:shadow-xl overflow-hidden mb-3 sm:mb-4"
                >
                    <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100">
                        <button
                            onClick={() => {
                                setLoginType("password");
                                setError("");
                                setSuccess("");
                            }}
                            className={`py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${loginType === "password"
                                ? "bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white shadow-md"
                                : "bg-transparent text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                                <span className="hidden xs:inline">ایمیل/نام کاربری</span>
                                <span className="xs:hidden">ایمیل</span>
                            </div>
                        </button>
                        <button
                            onClick={() => {
                                setLoginType("phone-password");
                                setError("");
                                setSuccess("");
                            }}
                            className={`py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${loginType === "phone-password"
                                ? "bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white shadow-md"
                                : "bg-transparent text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                                <span className="hidden xs:inline">همراه و رمز</span>
                                <span className="xs:hidden">همراه+رمز</span>
                            </div>
                        </button>
                        <button
                            onClick={() => {
                                setLoginType("phone-otp");
                                setOtpStep("form");
                                setError("");
                                setSuccess("");
                            }}
                            className={`py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${loginType === "phone-otp"
                                ? "bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white shadow-md"
                                : "bg-transparent text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                                <span className="hidden xs:inline">همراه و کد تایید</span>
                                <span className="xs:hidden">کد تایید</span>
                            </div>
                        </button>
                    </div>
                </motion.div>

                {/* فرم لاگین با ایمیل/نام کاربری و رمز عبور */}
                {loginType === "password" && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-lg sm:shadow-xl overflow-hidden"
                    >
                        <form onSubmit={handlePasswordLogin} className="p-4 sm:p-6 md:p-8">
                            <div className="mb-4 sm:mb-6">
                                <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                                    ایمیل یا نام کاربری
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                        {getInputIcon()}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="example@gmail.com / ali_rezaei"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                        dir="ltr"
                                        className="w-full pr-8 sm:pr-10 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                                             text-[#2C2418] placeholder-gray-400 text-xs sm:text-sm
                                             focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20
                                             transition-all duration-300"
                                    />
                                </div>
                            </div>

                            <div className="mb-4 sm:mb-6">
                                <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                                    رمز عبور
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                        <PiLockKeyFill className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B06A]" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pr-8 sm:pr-10 pl-8 sm:pl-12 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                                             text-[#2C2418] placeholder-gray-400 text-xs sm:text-sm
                                             focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20
                                             transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 text-gray-400 hover:text-[#D4B06A] transition-colors"
                                    >
                                        {showPassword ? <PiEyeSlash className="w-4 h-4 sm:w-5 sm:h-5" /> : <PiEye className="w-4 h-4 sm:w-5 sm:h-5" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-3 sm:mb-5 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
                                    <p className="text-red-600 text-xs sm:text-sm text-center font-medium">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-70"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                {loading ? "در حال ورود..." : "ورود به حساب"}
                            </button>

                            {/* لینک‌های پایین فرم */}
                            <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-100">
                                <div className="text-center">
                                    <p className="text-gray-500 text-xs sm:text-sm">
                                        حساب تالاردار ندارید؟{" "}
                                        <Link
                                            href="/auth/hall_owner/register"
                                            className="inline-flex items-center gap-1 text-[#D4B06A] font-bold hover:text-[#B8922E] transition-all duration-300 hover:gap-2 group"
                                        >
                                            ثبت‌نام تالاردار
                                            <PiArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </p>
                                </div>

                                <div className="text-center mt-2 sm:mt-3">
                                    <Link
                                        href="/"
                                        className="inline-flex items-center gap-1 text-gray-400 hover:text-[#D4B06A] transition-colors text-xs sm:text-sm"
                                    >
                                        <PiArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                                        بازگشت به صفحه اصلی
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* فرم لاگین با شماره همراه و رمز عبور */}
                {loginType === "phone-password" && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-lg sm:shadow-xl overflow-hidden"
                    >
                        <form onSubmit={handlePhonePasswordLogin} className="p-4 sm:p-6 md:p-8">
                            <div className="mb-4 sm:mb-6">
                                <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                                    شماره همراه
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                        <PiDeviceMobileFill className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B06A]" />
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="09123456789"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        dir="ltr"
                                        className="w-full pr-8 sm:pr-10 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                                             text-[#2C2418] placeholder-gray-400 text-xs sm:text-sm
                                             focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20
                                             transition-all duration-300"
                                    />
                                </div>
                            </div>

                            <div className="mb-4 sm:mb-6">
                                <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                                    رمز عبور
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                        <PiLockKeyFill className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B06A]" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pr-8 sm:pr-10 pl-8 sm:pl-12 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                                             text-[#2C2418] placeholder-gray-400 text-xs sm:text-sm
                                             focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20
                                             transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 text-gray-400 hover:text-[#D4B06A] transition-colors"
                                    >
                                        {showPassword ? <PiEyeSlash className="w-4 h-4 sm:w-5 sm:h-5" /> : <PiEye className="w-4 h-4 sm:w-5 sm:h-5" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-3 sm:mb-5 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
                                    <p className="text-red-600 text-xs sm:text-sm text-center font-medium">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-70"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                {loading ? "در حال ورود..." : "ورود به حساب"}
                            </button>

                            {/* لینک‌های پایین فرم */}
                            <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-100">
                                <div className="text-center">
                                    <p className="text-gray-500 text-xs sm:text-sm">
                                        حساب تالاردار ندارید؟{" "}
                                        <Link
                                            href="/auth/hall_owner/register"
                                            className="inline-flex items-center gap-1 text-[#D4B06A] font-bold hover:text-[#B8922E] transition-all duration-300 hover:gap-2 group"
                                        >
                                            ثبت‌نام تالاردار
                                            <PiArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </p>
                                </div>

                                <div className="text-center mt-2 sm:mt-3">
                                    <Link
                                        href="/"
                                        className="inline-flex items-center gap-1 text-gray-400 hover:text-[#D4B06A] transition-colors text-xs sm:text-sm"
                                    >
                                        <PiArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                                        بازگشت به صفحه اصلی
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* فرم لاگین با شماره همراه و کد تایید */}
                {loginType === "phone-otp" && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-lg sm:shadow-xl overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            {otpStep === "form" && (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleRequestOtp}
                                    className="p-4 sm:p-6 md:p-8"
                                >
                                    <div className="mb-4 sm:mb-6">
                                        <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                                            شماره همراه
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                                <PiDeviceMobileFill className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B06A]" />
                                            </div>
                                            <input
                                                type="tel"
                                                placeholder="09123456789"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                required
                                                dir="ltr"
                                                className="w-full pr-8 sm:pr-10 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                                                     text-[#2C2418] placeholder-gray-400 text-xs sm:text-sm
                                                     focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20
                                                     transition-all duration-300"
                                            />
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2">
                                            کد تایید به این شماره ارسال خواهد شد
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="mb-3 sm:mb-5 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
                                            <p className="text-red-600 text-xs sm:text-sm text-center font-medium">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-70"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                        {loading ? "در حال ارسال کد..." : "ارسال کد تایید"}
                                    </button>

                                    {/* لینک‌های پایین فرم */}
                                    <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-100">
                                        <div className="text-center">
                                            <p className="text-gray-500 text-xs sm:text-sm">
                                                حساب تالاردار ندارید؟{" "}
                                                <Link
                                                    href="/auth/hall_owner/register"
                                                    className="inline-flex items-center gap-1 text-[#D4B06A] font-bold hover:text-[#B8922E] transition-all duration-300 hover:gap-2 group"
                                                >
                                                    ثبت‌نام تالاردار
                                                    <PiArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </p>
                                        </div>

                                        <div className="text-center mt-2 sm:mt-3">
                                            <Link
                                                href="/"
                                                className="inline-flex items-center gap-1 text-gray-400 hover:text-[#D4B06A] transition-colors text-xs sm:text-sm"
                                            >
                                                <PiArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                                                بازگشت به صفحه اصلی
                                            </Link>
                                        </div>
                                    </div>
                                </motion.form>
                            )}

                            {otpStep === "verify" && (
                                <motion.form
                                    key="verify"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleVerifyOtp}
                                    className="p-4 sm:p-6 md:p-8"
                                >
                                    <div className="mb-3 sm:mb-4">
                                        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                            <label className="block text-[#2C2418] text-xs sm:text-sm font-bold">
                                                کد تایید
                                            </label>
                                            <button
                                                type="button"
                                                onClick={handleBackToForm}
                                                className="text-[10px] sm:text-xs text-gray-400 hover:text-[#D4B06A] transition-colors flex items-center gap-1"
                                            >
                                                <PiArrowCounterClockwiseFill className="w-3 h-3" />
                                                تغییر شماره
                                            </button>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                                <PiKeyFill className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B06A]" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="کد 4 تا 6 رقمی"
                                                value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value)}
                                                required
                                                dir="ltr"
                                                className="w-full pr-8 sm:pr-10 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                                                     text-[#2C2418] placeholder-gray-400 text-sm sm:text-base text-center tracking-widest
                                                     focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20
                                                     transition-all duration-300"
                                            />
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2 text-center">
                                            کد برای شماره {tempPhoneForOtp} ارسال شد
                                        </p>
                                    </div>

                                    {success && (
                                        <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl">
                                            <p className="text-green-600 text-xs sm:text-sm text-center font-medium flex items-center justify-center gap-2">
                                                <PiCheckCircleFill className="w-4 h-4" />
                                                {success}
                                            </p>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
                                            <p className="text-red-600 text-xs sm:text-sm text-center font-medium flex items-center justify-center gap-2">
                                                <PiWarningCircleFill className="w-4 h-4" />
                                                {error}
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-70"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                        {loading ? "در حال تایید..." : "تایید و ورود"}
                                    </button>

                                    <div className="mt-3 sm:mt-4 text-center">
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            disabled={resendTimer > 0 || loading}
                                            className="text-[10px] sm:text-sm text-gray-500 hover:text-[#D4B06A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {resendTimer > 0
                                                ? `ارسال مجدد کد پس از ${resendTimer} ثانیه`
                                                : "ارسال مجدد کد تایید"
                                            }
                                        </button>
                                    </div>

                                    {/* لینک‌های پایین فرم */}
                                    <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-100">
                                        <div className="text-center">
                                            <p className="text-gray-500 text-xs sm:text-sm">
                                                حساب تالاردار ندارید؟{" "}
                                                <Link
                                                    href="/auth/hall_owner/register"
                                                    className="inline-flex items-center gap-1 text-[#D4B06A] font-bold hover:text-[#B8922E] transition-all duration-300 hover:gap-2 group"
                                                >
                                                    ثبت‌نام تالاردار
                                                    <PiArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </p>
                                        </div>

                                        <div className="text-center mt-2 sm:mt-3">
                                            <Link
                                                href="/"
                                                className="inline-flex items-center gap-1 text-gray-400 hover:text-[#D4B06A] transition-colors text-xs sm:text-sm"
                                            >
                                                <PiArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                                                بازگشت به صفحه اصلی
                                            </Link>
                                        </div>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}