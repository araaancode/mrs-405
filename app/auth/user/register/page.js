"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    PiUserFill,
    PiIdentificationCard,
    PiEnvelopeFill,
    PiDeviceMobileFill,
    PiLockKeyFill,
    PiArrowRight,
    PiEye,
    PiEyeSlash,
    PiCheckCircle,
    PiXCircle,
    PiArrowLeft
} from "react-icons/pi";
import { GiLaurelCrown } from 'react-icons/gi';

export default function UserRegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        full_name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        letter: false,
        number: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (name === "password" || name === "confirmPassword") {
            const newPassword = name === "password" ? value : form.password;
            const newConfirm = name === "confirmPassword" ? value : form.confirmPassword;
            setPasswordMatch(newPassword === newConfirm && newConfirm !== "");

            if (name === "password") {
                setPasswordStrength({
                    length: value.length >= 8,
                    letter: /[a-zA-Z]/.test(value),
                    number: /[0-9]/.test(value),
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("رمز عبور و تکرار آن مطابقت ندارند");
            return;
        }

        if (!passwordStrength.length || !passwordStrength.letter || !passwordStrength.number) {
            setError("رمز عبور باید حداقل ۸ کاراکتر و شامل حروف و اعداد باشد");
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...submitData } = form;
            await axios.post("/api/auth/user/register", submitData);
            router.push("/auth/user/login");
        } catch (err) {
            setError(err.response?.data?.message || "خطا در ثبت‌نام");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-8 sm:py-12 md:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto w-full">

                {/* هدر با لوگو */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-6 sm:mb-8"
                >
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 mb-3 sm:mb-4 sm:mt-10">
                        <div className="w-8 sm:w-12 md:w-16 h-px bg-gradient-to-r from-transparent via-[#D4B06A] to-transparent" />
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#D4B06A]/20 rounded-full blur-xl" />
                            <GiLaurelCrown className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-[#D4B06A] relative drop-shadow-md" />
                        </div>
                        <div className="w-8 sm:w-12 md:w-16 h-px bg-gradient-to-r from-transparent via-[#D4B06A] to-transparent" />
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2C2418] tracking-tight">
                        ثبت‌نام کاربر
                    </h2>
                    <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mx-auto mt-2 sm:mt-3 mb-2 sm:mb-3" />
                    <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
                        لطفاً اطلاعات خود را برای ایجاد حساب کاربر وارد کنید
                    </p>
                </motion.div>

                {/* کارت ثبت‌نام - کاملاً رسپانسیو */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8">
                        {/* دو ستون برای فیلدها - رسپانسیو */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                            {/* فیلد نام و نام خانوادگی */}
                            <div className="mb-3 sm:mb-4 md:mb-0">
                                <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                                    نام و نام خانوادگی
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                        <PiIdentificationCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B06A] group-focus-within:text-[#B8922E] transition-colors duration-300" />
                                    </div>
                                    <input
                                        type="text"
                                        name="full_name"
                                        placeholder="علی رضایی"
                                        value={form.full_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full pr-8 sm:pr-10 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                                             text-[#2C2418] placeholder-gray-400 text-xs sm:text-sm
                                             focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20
                                             transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* فیلد نام کاربری */}
                            <div className="mb-3 sm:mb-4 md:mb-0">
                                <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                                    نام کاربری
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                        <PiUserFill className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B06A] group-focus-within:text-[#B8922E] transition-colors duration-300" />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="ali_rezaei"
                                        value={form.username}
                                        onChange={handleChange}
                                        required
                                        dir="ltr"
                                        className="w-full pr-8 sm:pr-10 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                                             text-[#2C2418] placeholder-gray-400 text-xs sm:text-sm
                                             focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20
                                             transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* فیلد ایمیل */}
                            <div className="mb-3 sm:mb-4 md:mb-0">
                                <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                                    ایمیل
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                        <PiEnvelopeFill className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B06A] group-focus-within:text-[#B8922E] transition-colors duration-300" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="example@gmail.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        dir="ltr"
                                        className="w-full pr-8 sm:pr-10 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                                             text-[#2C2418] placeholder-gray-400 text-xs sm:text-sm
                                             focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20
                                             transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* فیلد شماره موبایل */}
                            <div className="mb-3 sm:mb-4 md:mb-0">
                                <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                                    شماره موبایل
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                        <PiDeviceMobileFill className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B06A] group-focus-within:text-[#B8922E] transition-colors duration-300" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="09123456789"
                                        value={form.phone}
                                        onChange={handleChange}
                                        required
                                        dir="ltr"
                                        className="w-full pr-8 sm:pr-10 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                                             text-[#2C2418] placeholder-gray-400 text-xs sm:text-sm
                                             focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20
                                             transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* فیلد رمز عبور */}
                            <div className="mb-3 sm:mb-4 md:mb-0">
                                <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                                    رمز عبور
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                        <PiLockKeyFill className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B06A] group-focus-within:text-[#B8922E] transition-colors duration-300" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full pr-8 sm:pr-10 pl-8 sm:pl-12 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                                             text-[#2C2418] placeholder-gray-400 text-xs sm:text-sm
                                             focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20
                                             transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 text-gray-400 hover:text-[#D4B06A] transition-colors duration-300 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <PiEyeSlash className="w-4 h-4 sm:w-5 sm:h-5" />
                                        ) : (
                                            <PiEye className="w-4 h-4 sm:w-5 sm:h-5" />
                                        )}
                                    </button>
                                </div>

                                {/* نشانگر قدرت رمز عبور */}
                                {form.password && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-1.5 sm:mt-2 space-y-1"
                                    >
                                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                                            {passwordStrength.length ? (
                                                <PiCheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                                            ) : (
                                                <PiXCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                                            )}
                                            <span className={passwordStrength.length ? "text-green-600" : "text-gray-500"}>
                                                حداقل ۸ کاراکتر
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                                            {passwordStrength.letter ? (
                                                <PiCheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                                            ) : (
                                                <PiXCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                                            )}
                                            <span className={passwordStrength.letter ? "text-green-600" : "text-gray-500"}>
                                                شامل حروف انگلیسی
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                                            {passwordStrength.number ? (
                                                <PiCheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                                            ) : (
                                                <PiXCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                                            )}
                                            <span className={passwordStrength.number ? "text-green-600" : "text-gray-500"}>
                                                شامل اعداد
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* فیلد تکرار رمز عبور */}
                            <div className="mb-3 sm:mb-4 md:mb-0">
                                <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                                    تکرار رمز عبور
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                        <PiLockKeyFill className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B06A] group-focus-within:text-[#B8922E] transition-colors duration-300" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className={`w-full pr-8 sm:pr-10 pl-8 sm:pl-12 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 rounded-xl 
                                             text-[#2C2418] placeholder-gray-400 text-xs sm:text-sm
                                             focus:outline-none focus:ring-2 transition-all duration-300
                                             ${!passwordMatch && form.confirmPassword ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-[#D4B06A] focus:ring-[#D4B06A]/20"}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 text-gray-400 hover:text-[#D4B06A] transition-colors duration-300 focus:outline-none"
                                    >
                                        {showConfirmPassword ? (
                                            <PiEyeSlash className="w-4 h-4 sm:w-5 sm:h-5" />
                                        ) : (
                                            <PiEye className="w-4 h-4 sm:w-5 sm:h-5" />
                                        )}
                                    </button>
                                </div>

                                {/* خطای عدم تطابق رمز عبور */}
                                {!passwordMatch && form.confirmPassword && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1"
                                    >
                                        <PiXCircle className="w-3 h-3" />
                                        رمز عبور و تکرار آن مطابقت ندارند
                                    </motion.p>
                                )}
                            </div>
                        </div>

                        {/* پیام خطا - عرض کامل */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 sm:mt-5 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl"
                            >
                                <p className="text-red-600 text-xs sm:text-sm text-center font-medium">
                                    {error}
                                </p>
                            </motion.div>
                        )}

                        {/* دکمه ثبت‌نام - عرض کامل */}
                        <motion.button
                            type="submit"
                            disabled={loading || (!passwordMatch && form.confirmPassword !== "")}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative w-full mt-5 sm:mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    در حال ثبت‌نام...
                                </>
                            ) : (
                                <>
                                    ثبت‌نام
                                    <PiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>

                        {/* لینک ورود */}
                        <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 text-center border-t border-gray-100">
                            <p className="text-gray-500 text-xs sm:text-sm">
                                قبلاً حساب کاربر دارید؟{" "}
                                <Link
                                    href="/auth/user/login"
                                    className="inline-flex items-center gap-1 text-[#D4B06A] font-bold hover:text-[#B8922E] transition-all duration-300 hover:gap-2 group"
                                >
                                    ورود به حساب
                                    <PiArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </p>
                        </div>

                        {/* لینک بازگشت به صفحه اصلی */}
                        <div className="mt-3 sm:mt-4 text-center">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1 text-gray-400 hover:text-[#D4B06A] transition-colors text-[10px] sm:text-xs"
                            >
                                <PiArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                                بازگشت به صفحه اصلی
                            </Link>
                        </div>
                    </form>
                </motion.div>

            </div>
        </div>
    );
}