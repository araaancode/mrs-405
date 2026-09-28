// app/payment/success/page.js
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    PiCheckCircleFill,
    PiArrowLeft,
    PiCopySimple,
    PiCheck,
    PiCalendarBlank,
    PiSparkle,
} from "react-icons/pi";

/* ============================================================
   Content (داخل Suspense)
   ============================================================ */
function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const refId = searchParams.get("ref");

    const [countdown, setCountdown] = useState(5);
    const [copied, setCopied] = useState(false);

    /* -------- Countdown + Redirect -------- */
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push("/user/reservations");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    /* -------- Copy refId -------- */
    const handleCopy = async () => {
        if (!refId) return;
        try {
            await navigator.clipboard.writeText(refId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* silent */
        }
    };

    /* ============================================================
       Render
       ============================================================ */
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
            radial-gradient(circle at 30% 40%, rgba(198,161,76,0.08) 0%, transparent 45%),
            radial-gradient(circle at 70% 60%, rgba(198,161,76,0.06) 0%, transparent 45%)
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
                    {/* خط طلایی بالا */}
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

                    {/* ==================== آیکون موفقیت ==================== */}
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
                        {/* حلقه‌های تزئینی */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 0 }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeOut",
                            }}
                            className="absolute w-24 h-24 rounded-full bg-gold-500/20"
                        />
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.4, opacity: 0 }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 0.5,
                                ease: "easeOut",
                            }}
                            className="absolute w-24 h-24 rounded-full bg-gold-500/10"
                        />

                        {/* جعبه طلایی */}
                        <div
                            className="
                relative w-20 h-20 sm:w-24 sm:h-24
                rounded-3xl
                bg-gradient-to-br from-gold-400 to-gold-600
                flex items-center justify-center
                shadow-lg shadow-gold-500/40
                ring-4 ring-gold-100/60
              "
                        >
                            <PiCheckCircleFill className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>
                    </motion.div>

                    {/* ==================== عنوان ==================== */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                    >
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 tracking-tight">
                            پرداخت با موفقیت انجام شد
                        </h1>

                        <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                            رزرو شما با موفقیت ثبت شد. جزئیات از طریق پیامک برای شما ارسال
                            خواهد شد.
                        </p>
                    </motion.div>

                    {/* ==================== کد پیگیری ==================== */}
                    {refId && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                            className="
                flex items-center justify-between gap-3
                p-3 sm:p-4
                bg-gradient-to-l from-gold-50/60 via-white to-white
                border border-gold-100
                rounded-2xl
                mb-6
                text-right
              "
                        >
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] text-slate-500 mb-0.5 font-medium">
                                    کد پیگیری
                                </p>
                                <p className="font-mono font-bold text-slate-900 text-sm sm:text-base truncate">
                                    {refId}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleCopy}
                                aria-label="کپی کد پیگیری"
                                className="
                  group relative flex-shrink-0
                  w-10 h-10 rounded-xl
                  flex items-center justify-center
                  bg-white border border-gold-200
                  text-gold-600
                  hover:bg-gold-500 hover:text-white hover:border-gold-500
                  active:scale-95
                  transition-all duration-200
                "
                            >
                                {copied ? (
                                    <PiCheck className="w-4 h-4" strokeWidth={3} />
                                ) : (
                                    <PiCopySimple className="w-4 h-4" />
                                )}
                            </button>
                        </motion.div>
                    )}

                    {/* ==================== اطلاعات اضافه ==================== */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="grid grid-cols-2 gap-3 mb-6"
                    >
                        <div className="p-3 rounded-xl bg-slate-50 ring-1 ring-slate-100 text-center">
                            <PiCalendarBlank className="w-5 h-5 text-gold-500 mx-auto mb-1.5" />
                            <p className="text-[10.5px] text-slate-500 mb-0.5">
                                وضعیت
                            </p>
                            <p className="text-[12px] font-bold text-emerald-600">
                                پرداخت شده
                            </p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 ring-1 ring-slate-100 text-center">
                            <PiSparkle className="w-5 h-5 text-gold-500 mx-auto mb-1.5" />
                            <p className="text-[10.5px] text-slate-500 mb-0.5">
                                مرحله بعد
                            </p>
                            <p className="text-[12px] font-bold text-slate-800">
                                تایید مالک
                            </p>
                        </div>
                    </motion.div>

                    {/* ==================== شمارنده + دکمه ==================== */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        className="space-y-4"
                    >
                        {/* نوار پیشرفت معکوس */}
                        <div className="relative">
                            <p className="text-[11.5px] text-slate-400 mb-2">
                                انتقال خودکار پس از{" "}
                                <span className="font-bold text-slate-700">
                                    {countdown.toLocaleString("fa-IR")}
                                </span>{" "}
                                ثانیه
                            </p>

                            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    key={countdown}
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 1, ease: "linear" }}
                                    className="h-full bg-gradient-to-l from-gold-400 to-gold-600 rounded-full"
                                />
                            </div>
                        </div>

                        {/* دکمه اصلی */}
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
                            <PiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                            مشاهده رزروها
                        </Link>

                        {/* لینک ثانویه */}
                        <Link
                            href="/halls"
                            className="
                inline-flex items-center justify-center gap-1
                text-[12px] text-slate-400 hover:text-gold-600
                transition-colors duration-200
              "
                        >
                            بازگشت به صفحه تالارها
                        </Link>
                    </motion.div>
                </div>

                {/* ==================== متن پایین ==================== */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                    className="text-center text-[11px] text-slate-400 mt-5"
                >
                    در صورت بروز مشکل، با{" "}
                    <Link
                        href="/user/tickets/create"
                        className="text-gold-600 hover:text-gold-700 hover:underline font-medium"
                    >
                        تیم پشتیبانی
                    </Link>{" "}
                    تماس بگیرید
                </motion.p>
            </motion.div>
        </div>
    );
}

/* ============================================================
   Page (با Suspense)
   ============================================================ */
export default function PaymentSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[80vh] flex items-center justify-center px-4">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-slate-100 animate-pulse" />
                        <div className="h-4 w-48 bg-slate-100 rounded-lg mx-auto animate-pulse" />
                    </div>
                </div>
            }
        >
            <PaymentSuccessContent />
        </Suspense>
    );
}