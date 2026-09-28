// app/not-found.jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    PiHouse,
    PiArrowLeft,
    PiMagnifyingGlass,
    PiHeadset,
    PiCompass,
    PiBuildings,
} from "react-icons/pi";

/* ============================================================
   دکمه‌های اقدام سریع (پیشنهاد صفحات)
   ============================================================ */
const QUICK_LINKS = [
    {
        href: "/halls",
        label: "مشاهده تالارها",
        icon: PiBuildings,
        description: "بهترین تالارهای ایران",
    },
    {
        href: "/user/tickets",
        label: "پشتیبانی",
        icon: PiHeadset,
        description: "در خدمت شما هستیم",
    },
];

/* ============================================================
   صفحه 404
   ============================================================ */
export default function NotFound() {
    return (
        <div className="min-h-screen relative flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10">
            {/* الگوی تزئینی پس‌زمینه */}
            <div
                className="absolute inset-0 pointer-events-none opacity-50"
                style={{
                    backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(198,161,76,0.08) 0%, transparent 45%),
            radial-gradient(circle at 80% 70%, rgba(198,161,76,0.06) 0%, transparent 45%)
          `,
                }}
            />

            {/* محتوای اصلی */}
            <div className="relative max-w-2xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    {/* ==================== آیکون قطبنما ==================== */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, rotate: -20 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        className="relative inline-flex items-center justify-center mb-6"
                    >
                        {/* درخشش پشت */}
                        <div className="absolute w-24 h-24 rounded-full bg-gold-500/15 blur-2xl" />


                    </motion.div>

                    {/* ==================== عدد ۴۰۴ ==================== */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative inline-block mb-3"
                    >
                        <div
                            className="
                text-[110px] sm:text-[140px] md:text-[160px]
                font-black tracking-tighter leading-none
                bg-gradient-to-b from-slate-900 via-slate-800 to-slate-600
                bg-clip-text text-transparent
                select-none
              "
                        >
                            ۴۰۴
                        </div>

                        {/* خط طلایی زیر عدد */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent rounded-full" />
                    </motion.div>

                    {/* ==================== متن ==================== */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-3 mt-6">
                            صفحه‌ای که دنبالش بودید پیدا نشد
                        </h1>

                        <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-8">
                            ممکن است صفحه حذف شده باشد، آدرس تغییر کرده باشد یا موقتاً در دسترس نباشد.
                        </p>
                    </motion.div>

                    {/* ==================== دکمه‌های اصلی ==================== */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
                    >
                        <Link
                            href="/"
                            className="
                group w-full sm:w-auto
                inline-flex items-center justify-center gap-2
                px-6 py-3 rounded-xl
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
                            <PiHouse className="w-4 h-4" />
                            صفحه اصلی
                        </Link>

                        <Link
                            href="/halls"
                            className="
                group w-full sm:w-auto
                inline-flex items-center justify-center gap-2
                px-6 py-3 rounded-xl
                text-sm font-bold
                text-slate-700 bg-white
                border border-slate-200
                hover:bg-gold-50 hover:border-gold-300 hover:text-gold-700
                active:scale-95
                focus:outline-none focus:ring-4 focus:ring-gold-500/15
                transition-all duration-200
              "
                        >
                            <PiMagnifyingGlass className="w-4 h-4" />
                            جستجوی تالار
                        </Link>
                    </motion.div>

                    {/* ==================== پیشنهادها ==================== */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="
              p-4 sm:p-5
              bg-gradient-to-br from-gold-50/60 via-white to-white
              border border-gold-100
              rounded-2xl
              max-w-lg mx-auto
            "
                    >
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center justify-center gap-1.5">
                            <span className="w-6 h-px bg-gold-400" />
                            شاید به دنبال این‌ها بودید
                            <span className="w-6 h-px bg-gold-400" />
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {QUICK_LINKS.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="
                      group flex items-center gap-3
                      p-3 rounded-xl
                      text-right
                      bg-white border border-slate-100
                      hover:border-gold-200 hover:bg-gold-50/40
                      hover:shadow-sm
                      transition-all duration-200
                    "
                                    >
                                        <span
                                            className="
                        w-9 h-9 rounded-lg flex-shrink-0
                        bg-gold-50 text-gold-600
                        flex items-center justify-center
                        group-hover:bg-gradient-to-br group-hover:from-gold-400 group-hover:to-gold-600
                        group-hover:text-white
                        transition-all duration-300
                      "
                                        >
                                            <Icon className="w-4 h-4" />
                                        </span>

                                        <span className="flex-1 min-w-0">
                                            <span className="block text-[13px] font-bold text-slate-800 group-hover:text-gold-700 transition-colors">
                                                {item.label}
                                            </span>
                                            <span className="block text-[11px] text-slate-400 mt-0.5">
                                                {item.description}
                                            </span>
                                        </span>

                                        <PiArrowLeft
                                            className="
                        w-4 h-4 text-slate-300
                        group-hover:text-gold-500 group-hover:-translate-x-0.5
                        transition-all duration-200
                      "
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* ==================== متن پایین ==================== */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="text-[11px] text-slate-400 mt-8"
                    >
                        اگر مشکل ادامه داشت، با{" "}
                        <Link
                            href="/user/tickets/create"
                            className="text-gold-600 hover:text-gold-700 font-medium hover:underline"
                        >
                            تیم پشتیبانی
                        </Link>{" "}
                        تماس بگیرید
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
}