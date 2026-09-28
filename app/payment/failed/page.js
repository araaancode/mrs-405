// app/payment/failed/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    PiWarningCircleFill,
    PiArrowLeft,
    PiArrowCounterClockwise,
    PiHeadset,
    PiEnvelopeSimple,
    PiChatCircleDots,
    PiCaretDown,
    PiCreditCard,
    PiClock,
    PiWifiHigh,
} from "react-icons/pi";

/* ============================================================
   Common Failure Reasons
   ============================================================ */
const FAILURE_REASONS = [
    {
        id: 1,
        title: "موجودی ناکافی حساب",
        description:
            "مطمئن شوید که موجودی کافی برای این تراکنش دارید و سپس مجدداً تلاش کنید.",
        icon: PiCreditCard,
    },
    {
        id: 2,
        title: "اتمام زمان درگاه پرداخت",
        description:
            "زمان درگاه پرداخت به پایان رسیده است. لطفاً مجدداً تلاش کنید.",
        icon: PiClock,
    },
    {
        id: 3,
        title: "اختلال در اتصال اینترنت",
        description:
            "اتصال اینترنت شما پایدار نیست. با اتصال پایدار مجدداً تلاش کنید.",
        icon: PiWifiHigh,
    },
];

/* ============================================================
   Reason Accordion Item
   ============================================================ */
function ReasonItem({ reason, isOpen, onToggle }) {
    const Icon = reason.icon;

    return (
        <div
            className="
        bg-white rounded-2xl
        ring-1 ring-slate-100
        hover:ring-gold-200/70
        overflow-hidden
        transition-all duration-200
      "
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                className="
          w-full flex items-center justify-between gap-3
          p-4 text-right
          hover:bg-slate-50/60
          transition-colors duration-200
        "
            >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span
                        className="
              w-9 h-9 rounded-xl flex-shrink-0
              bg-gold-50 ring-1 ring-gold-100
              flex items-center justify-center
            "
                    >
                        <Icon className="w-4 h-4 text-gold-600" />
                    </span>
                    <span className="text-[13.5px] font-medium text-slate-800 truncate">
                        {reason.title}
                    </span>
                </div>

                <PiCaretDown
                    className={`
            w-4 h-4 text-slate-400 flex-shrink-0
            transition-transform duration-300
            ${isOpen ? "rotate-180" : ""}
          `}
                />
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <p className="px-4 pb-4 pr-16 text-[12.5px] text-slate-500 leading-relaxed">
                            {reason.description}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ============================================================
   Page
   ============================================================ */
export default function PaymentFailedPage() {
    const [openReason, setOpenReason] = useState(null);

    const toggleReason = (id) => {
        setOpenReason((prev) => (prev === id ? null : id));
    };

    return (
        <div
            dir="rtl"
            className="
        min-h-[80vh] flex items-center justify-center
        px-4 sm:px-6 py-12
        relative overflow-hidden
      "
        >
            {/* الگوی تزئینی پس‌زمینه */}
            <div
                className="absolute inset-0 pointer-events-none opacity-50"
                style={{
                    backgroundImage: `
            radial-gradient(circle at 30% 40%, rgba(244,63,94,0.06) 0%, transparent 45%),
            radial-gradient(circle at 70% 60%, rgba(244,63,94,0.05) 0%, transparent 45%)
          `,
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative max-w-lg w-full"
            >
                {/* ==================== کارت اصلی ==================== */}
                <div
                    className="
            relative
            bg-white
            rounded-3xl
            ring-1 ring-slate-100
            shadow-[0_20px_50px_-20px_rgba(15,23,42,0.15)]
            overflow-hidden
            p-8 sm:p-10
            text-center
          "
                >
                    {/* خط قرمز بالای کارت */}
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />

                    {/* ==================== آیکون خطا ==================== */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            delay: 0.2,
                            duration: 0.5,
                            type: "spring",
                            stiffness: 200,
                        }}
                        className="relative inline-flex items-center justify-center mb-6"
                    >
                        {/* حلقه‌های هشدار */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.3, opacity: 0 }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeOut",
                            }}
                            className="absolute w-24 h-24 rounded-full bg-rose-500/20"
                        />

                        {/* جعبه رز */}
                        <div
                            className="
                relative w-20 h-20 sm:w-24 sm:h-24
                rounded-3xl
                bg-gradient-to-br from-rose-400 to-rose-600
                flex items-center justify-center
                shadow-lg shadow-rose-500/40
                ring-4 ring-rose-100/60
              "
                        >
                            <PiWarningCircleFill className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>
                    </motion.div>

                    {/* ==================== عنوان ==================== */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                    >
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 tracking-tight">
                            پرداخت ناموفق بود
                        </h1>

                        <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                            متأسفانه پرداخت شما با خطا مواجه شد. نگران نباشید — مبلغ کسر شده
                            حداکثر تا ۷۲ ساعت به حساب شما بازگردانده می‌شود.
                        </p>
                    </motion.div>

                    {/* ==================== اطلاعات ==================== */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        className="grid grid-cols-2 gap-3 mb-6"
                    >
                        <div className="p-3 rounded-xl bg-slate-50 ring-1 ring-slate-100 text-center">
                            <PiWarningCircleFill className="w-5 h-5 text-rose-500 mx-auto mb-1.5" />
                            <p className="text-[10.5px] text-slate-500 mb-0.5">وضعیت</p>
                            <p className="text-[12px] font-bold text-rose-600">
                                ناموفق
                            </p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 ring-1 ring-slate-100 text-center">
                            <PiArrowCounterClockwise className="w-5 h-5 text-gold-500 mx-auto mb-1.5" />
                            <p className="text-[10.5px] text-slate-500 mb-0.5">
                                بازگشت وجه
                            </p>
                            <p className="text-[12px] font-bold text-slate-800">
                                تا ۷۲ ساعت
                            </p>
                        </div>
                    </motion.div>

                    {/* ==================== دکمه‌های اقدام ==================== */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="space-y-3"
                    >
                        {/* تلاش مجدد */}
                        <Link
                            href="/user/reservations"
                            className="
                group w-full
                inline-flex items-center justify-center gap-2
                px-6 py-3.5 rounded-xl
                text-sm font-bold text-white
                bg-gradient-to-b from-gold-400 to-gold-600
                hover:from-gold-500 hover:to-gold-700
                shadow-md shadow-gold-500/25
                hover:shadow-lg hover:shadow-gold-500/40
                hover:-translate-y-0.5
                active:scale-95
                focus:outline-none focus:ring-4 focus:ring-gold-500/25
                transition-all duration-300
              "
                        >
                            <PiArrowCounterClockwise className="w-4 h-4 group-hover:rotate-[-360deg] transition-transform duration-500" />
                            تلاش مجدد پرداخت
                        </Link>

                        {/* بازگشت */}
                        <Link
                            href="/user/reservations"
                            className="
                group w-full
                inline-flex items-center justify-center gap-2
                px-6 py-3 rounded-xl
                text-sm font-medium
                text-slate-700 bg-white
                border border-slate-200
                hover:bg-slate-50 hover:border-slate-300
                active:scale-95
                transition-all duration-200
              "
                        >
                            <PiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                            بازگشت به رزروهای من
                        </Link>
                    </motion.div>

                    {/* ==================== پشتیبانی ==================== */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        className="mt-6 pt-6 border-t border-slate-100"
                    >
                        <p className="text-[11.5px] text-slate-400 mb-3">
                            نیاز به کمک دارید؟
                        </p>

                        <div className="flex items-center justify-center gap-2">
                            <Link
                                href="/user/tickets/create"
                                className="
                  inline-flex items-center gap-1.5
                  px-3.5 py-2 rounded-lg
                  text-[11.5px] font-medium
                  text-gold-700 bg-gold-50
                  ring-1 ring-gold-100
                  hover:bg-gold-100 hover:ring-gold-200
                  transition-all duration-200
                "
                            >
                                <PiChatCircleDots className="w-3.5 h-3.5" />
                                چت پشتیبانی
                            </Link>

                            <a
                                href="tel:02112345678"
                                className="
                  inline-flex items-center gap-1.5
                  px-3.5 py-2 rounded-lg
                  text-[11.5px] font-medium
                  text-slate-700 bg-white
                  ring-1 ring-slate-200
                  hover:bg-slate-50 hover:ring-slate-300
                  transition-all duration-200
                "
                            >
                                <PiHeadset className="w-3.5 h-3.5" />
                                تماس تلفنی
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* ==================== دلایل احتمالی ==================== */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    className="mt-6"
                >
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <span className="w-6 h-px bg-gold-400" />
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                            دلایل احتمالی خطا
                        </span>
                        <span className="w-6 h-px bg-gold-400" />
                    </div>

                    <div className="space-y-2">
                        {FAILURE_REASONS.map((reason) => (
                            <ReasonItem
                                key={reason.id}
                                reason={reason}
                                isOpen={openReason === reason.id}
                                onToggle={() => toggleReason(reason.id)}
                            />
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}