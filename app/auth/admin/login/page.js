"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { PulseLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import {
    PiEnvelopeFill,
    PiLockKeyFill,
    PiArrowLeft,
    PiArrowRight,
    PiEye,
    PiEyeSlash,
    PiDeviceMobileFill,
    PiUserFill
} from "react-icons/pi";
import { GiLaurelCrown } from 'react-icons/gi';

export default function AdminLoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                identifier,
                password,
            });

            if (res?.error) {
                setError(res.error);
                toast.error(res.error, {
                    duration: 3000,
                    position: "top-right",
                    icon: "❌",
                    style: {
                        background: "#FEF2F2",
                        color: "#991B1B",
                        borderRadius: "12px",
                        padding: "12px 20px",
                        fontSize: "14px",
                        fontWeight: "600",
                        border: "1px solid #FCA5A5",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                    }
                });
                setLoading(false);
                return;
            }

            toast.success(" به پنل مدیریت خوش آمدید!", {
                duration: 3000,
                position: "top-right",
                icon: "",
                style: {
                    background: "#F0FDF4",
                    color: "#166534",
                    borderRadius: "12px",
                    padding: "16px 24px",
                    fontSize: "16px",
                    fontWeight: "700",
                    border: "2px solid #86EFAC",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                }
            });

            setTimeout(() => {
                router.push("/admin/profile");
            }, 1500);

        } catch (err) {
            const msg = "خطا در ارتباط با سرور";
            setError(msg);
            toast.error(msg, {
                duration: 3000,
                position: "top-right",
                icon: "❌",
                style: {
                    background: "#FEF2F2",
                    color: "#991B1B",
                    borderRadius: "12px",
                    padding: "12px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "1px solid #FCA5A5",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                }
            });
            setLoading(false);
        }
    };

    // تشخیص نوع ورودی برای نمایش آیکون مناسب
    const getInputIcon = () => {
        if (identifier.includes("@")) {
            return <PiEnvelopeFill className="w-5 h-5 text-[#D4B06A] group-focus-within:text-[#B8922E] transition-colors duration-300" />;
        } else if (/^09[0-9]{9}$/.test(identifier)) {
            return <PiDeviceMobileFill className="w-5 h-5 text-[#D4B06A] group-focus-within:text-[#B8922E] transition-colors duration-300" />;
        }
        return <PiUserFill className="w-5 h-5 text-[#D4B06A] group-focus-within:text-[#B8922E] transition-colors duration-300" />;
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-8 sm:py-12 md:py-20 px-4 sm:px-6 lg:px-8 ">
            <Toaster />
            <div className="max-w-md mx-auto w-full">

                {/* Decorative crown divider - کاملاً رسپانسیو */}
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
                        ورود <span className="text-[#D4B06A]">مدیر سایت</span>
                    </h2>
                    <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mx-auto mt-2 sm:mt-3 mb-2 sm:mb-3" />
                    <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
                        به پنل مدیریت خوش آمدید
                    </p>
                </motion.div>

                {/* Login Card - کاملاً رسپانسیو */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                    <form onSubmit={handleLogin} className="p-4 sm:p-6 md:p-8">
                        {/* Identifier Field (Email/Phone/Username) */}
                        <div className="mb-4 sm:mb-6">
                            <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                                ایمیل / شماره موبایل / نام مدیر سایت
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                    {getInputIcon()}
                                </div>
                                <input
                                    type="text"
                                    placeholder="example@gmail.com / 09123456789 / admin_name"
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

                        {/* Password Field */}
                        <div className="mb-4 sm:mb-6">
                            <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                                رمز عبور
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                    <PiLockKeyFill className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B06A] group-focus-within:text-[#B8922E] transition-colors duration-300" />
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
                                    className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 text-gray-400 hover:text-[#D4B06A] transition-colors duration-300 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <PiEyeSlash className="w-4 h-4 sm:w-5 sm:h-5" />
                                    ) : (
                                        <PiEye className="w-4 h-4 sm:w-5 sm:h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="mb-3 sm:mb-5 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl"
                            >
                                <p className="text-red-600 text-xs sm:text-sm text-center font-medium">
                                    {error}
                                </p>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            {loading ? (
                                <>
                                    <PulseLoader color="#ffffff" size={8} margin={4} />
                                    <span>در حال ورود...</span>
                                </>
                            ) : (
                                <>
                                    ورود به پنل مدیریت
                                    <PiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>

                        {/* لینک بازگشت به صفحه اصلی */}
                        <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 text-center border-t border-gray-100">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1 text-gray-400 hover:text-[#D4B06A] transition-colors text-xs sm:text-sm"
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