// components/admin/DeleteUserModal.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    PiTrash,
    PiWarning,
    PiCircleNotch,
    PiX,
} from "react-icons/pi";

export default function DeleteUserModal({
    isOpen,
    onClose,
    onConfirm,
    user,
    loading,
}) {
    if (!user) return null;

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
                        {/* دکور بالا */}
                        <div className="h-1.5 w-full bg-gradient-to-l from-rose-400 to-rose-600" />

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
                                <div className="relative w-16 h-16 rounded-2xl bg-rose-50 ring-4 ring-rose-100/60 flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-2xl bg-rose-500/10 blur-xl" />
                                    <PiWarning className="relative w-8 h-8 text-rose-600" />
                                </div>
                            </div>

                            {/* عنوان */}
                            <h2 className="text-center text-lg sm:text-xl font-bold text-slate-900 mb-2">
                                حذف حساب کاربری
                            </h2>

                            <p className="text-center text-sm text-slate-500 leading-relaxed mb-5">
                                آیا از حذف کاربر{" "}
                                <span className="font-bold text-slate-700">
                                    {user.full_name}
                                </span>{" "}
                                مطمئن هستید؟ این عملیات غیرقابل بازگشت است.
                            </p>

                            {/* اطلاعات کاربر */}
                            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 mb-5 space-y-2">
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
                                        ایمیل
                                    </span>
                                    <span
                                        className="text-[12.5px] font-medium text-slate-800 truncate"
                                        dir="ltr"
                                    >
                                        {user.email || "—"}
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
                            </div>

                            {/* هشدار */}
                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100 mb-5">
                                <PiWarning className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                <p className="text-[11.5px] text-amber-800 leading-relaxed">
                                    تمام داده‌های این کاربر از جمله رزروها،
                                    تیکت‌ها و مدارک به‌طور کامل حذف خواهند شد.
                                </p>
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
                                        transition-all
                                    "
                                >
                                    انصراف
                                </button>
                                <button
                                    type="button"
                                    onClick={onConfirm}
                                    disabled={loading}
                                    className="
                                        flex-1
                                        inline-flex items-center justify-center gap-2
                                        px-4 py-2.5 rounded-xl
                                        text-[13px] font-bold text-white
                                        bg-gradient-to-b from-rose-400 to-rose-600
                                        hover:from-rose-500 hover:to-rose-700
                                        shadow-md shadow-rose-500/25
                                        hover:shadow-lg hover:shadow-rose-500/40
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        active:scale-95
                                        transition-all
                                    "
                                >
                                    {loading ? (
                                        <>
                                            <PiCircleNotch className="w-4 h-4 animate-spin" />
                                            در حال حذف...
                                        </>
                                    ) : (
                                        <>
                                            <PiTrash className="w-4 h-4" />
                                            حذف کن
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