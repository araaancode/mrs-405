// components/admin/ConfirmStatusModal.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    PiWarningCircle,
    PiCheckCircle,
    PiCircleNotch,
    PiX,
    PiPower,
} from "react-icons/pi";

export default function ConfirmStatusModal({
    isOpen,
    onClose,
    onConfirm,
    user,
    loading,
}) {
    if (!user) return null;

    const willActivate = !user.is_active;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="
                            relative w-full max-w-md
                            bg-white rounded-3xl
                            ring-1 ring-slate-200
                            shadow-2xl shadow-slate-900/20
                            overflow-hidden
                        "
                        dir="rtl"
                    >
                        {/* دکور بالای مودال */}
                        <div
                            className={`
                                h-1.5 w-full
                                ${
                                    willActivate
                                        ? "bg-gradient-to-l from-emerald-400 to-emerald-600"
                                        : "bg-gradient-to-l from-rose-400 to-rose-600"
                                }
                            `}
                        />

                        {/* دکمه بستن */}
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            aria-label="بستن"
                            className="
                                absolute top-4 left-4
                                w-8 h-8 rounded-lg
                                flex items-center justify-center
                                text-slate-400
                                hover:text-slate-700 hover:bg-slate-100
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-all
                            "
                        >
                            <PiX className="w-4 h-4" />
                        </button>

                        <div className="p-6 sm:p-7">
                            {/* آیکون */}
                            <div className="flex justify-center mb-5">
                                <div
                                    className={`
                                        relative w-16 h-16 rounded-2xl
                                        flex items-center justify-center
                                        ring-4
                                        ${
                                            willActivate
                                                ? "bg-emerald-50 ring-emerald-100/60"
                                                : "bg-rose-50 ring-rose-100/60"
                                        }
                                    `}
                                >
                                    <div
                                        className={`
                                            absolute inset-0 rounded-2xl blur-xl
                                            ${
                                                willActivate
                                                    ? "bg-emerald-500/10"
                                                    : "bg-rose-500/10"
                                            }
                                        `}
                                    />
                                    {willActivate ? (
                                        <PiCheckCircle className="relative w-8 h-8 text-emerald-600" />
                                    ) : (
                                        <PiWarningCircle className="relative w-8 h-8 text-rose-600" />
                                    )}
                                </div>
                            </div>

                            {/* عنوان */}
                            <h2 className="text-center text-lg sm:text-xl font-bold text-slate-900 mb-2">
                                {willActivate
                                    ? "فعال‌سازی حساب کاربری"
                                    : "غیرفعال‌سازی حساب کاربری"}
                            </h2>

                            {/* پیام */}
                            <p className="text-center text-sm text-slate-500 leading-relaxed mb-5">
                                {willActivate ? (
                                    <>
                                        با این کار کاربر{" "}
                                        <span className="font-bold text-slate-700">
                                            {user.full_name}
                                        </span>{" "}
                                        می‌تواند دوباره وارد حساب خود شود و
                                        از امکانات استفاده کند.
                                    </>
                                ) : (
                                    <>
                                        با این کار کاربر{" "}
                                        <span className="font-bold text-slate-700">
                                            {user.full_name}
                                        </span>{" "}
                                        نمی‌تواند وارد حساب شود و درخواست‌های
                                        او رد می‌شوند.
                                    </>
                                )}
                            </p>

                            {/* اطلاعات کاربر */}
                            <div className="bg-slate-50 rounded-2xl p-4 mb-5 space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-[12px] text-slate-500">
                                        نام کاربری
                                    </span>
                                    <span
                                        className="text-[12.5px] font-medium text-slate-800 truncate"
                                        dir="ltr"
                                    >
                                        {user.username || "—"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-[12px] text-slate-500">
                                        تلفن
                                    </span>
                                    <span
                                        className="text-[12.5px] font-medium text-slate-800"
                                        dir="ltr"
                                    >
                                        {user.phone || "—"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-[12px] text-slate-500">
                                        وضعیت فعلی
                                    </span>
                                    <span
                                        className={`
                                            inline-flex items-center gap-1.5
                                            px-2 py-0.5 rounded-full
                                            text-[11px] font-bold ring-1
                                            ${
                                                user.is_active
                                                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                                    : "bg-rose-50 text-rose-700 ring-rose-200"
                                            }
                                        `}
                                    >
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full ${
                                                user.is_active
                                                    ? "bg-emerald-500"
                                                    : "bg-rose-500"
                                            }`}
                                        />
                                        {user.is_active
                                            ? "فعال"
                                            : "غیرفعال"}
                                    </span>
                                </div>
                            </div>

                            {/* دکمه‌ها */}
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="
                                        flex-1
                                        inline-flex items-center justify-center
                                        px-4 py-2.5 rounded-xl
                                        text-[13px] font-medium text-slate-700
                                        bg-white border border-slate-200
                                        hover:bg-slate-50 hover:border-slate-300
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        active:scale-95
                                        transition-all duration-200
                                    "
                                >
                                    انصراف
                                </button>
                                <button
                                    type="button"
                                    onClick={onConfirm}
                                    disabled={loading}
                                    className={`
                                        flex-1
                                        inline-flex items-center justify-center gap-2
                                        px-4 py-2.5 rounded-xl
                                        text-[13px] font-bold text-white
                                        shadow-md
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        active:scale-95
                                        transition-all duration-200
                                        ${
                                            willActivate
                                                ? "bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/40"
                                                : "bg-gradient-to-b from-rose-400 to-rose-600 hover:from-rose-500 hover:to-rose-700 shadow-rose-500/25 hover:shadow-lg hover:shadow-rose-500/40"
                                        }
                                    `}
                                >
                                    {loading ? (
                                        <>
                                            <PiCircleNotch className="w-4 h-4 animate-spin" />
                                            در حال انجام...
                                        </>
                                    ) : (
                                        <>
                                            <PiPower className="w-4 h-4" />
                                            {willActivate
                                                ? "فعال کن"
                                                : "غیرفعال کن"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}