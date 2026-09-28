"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
    PiTicket,
    PiPlusCircle,
    PiCalendarBlank,
    PiEye,
    PiWarningCircle,
    PiClock,
    PiCheckCircle,
    PiXCircle,
    PiArrowClockwise,
    PiChatCircleDots,
    PiSpinnerGap,
    PiHourglass
} from "react-icons/pi";


/* ============================================================
   Status Config
   ============================================================ */
function getStatusInfo(status) {
    const map = {
        open: {
            label: "باز",
            icon: PiClock,
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            ring: "ring-emerald-200",
            dot: "bg-emerald-500",
        },
        in_progress: {
            label: "در حال بررسی",
            icon: PiHourglass,
            bg: "bg-amber-50",
            text: "text-amber-700",
            ring: "ring-amber-200",
            dot: "bg-amber-500",
        },
        closed: {
            label: "بسته شده",
            icon: PiCheckCircle,
            bg: "bg-slate-50",
            text: "text-slate-600",
            ring: "ring-slate-200",
            dot: "bg-slate-500",
        },
    };

    // Fallback برای PiHourglass
    if (status === "in_progress") {
        map.in_progress.icon = PiClock;
    }

    return (
        map[status] || {
            label: status || "نامشخص",
            icon: PiClock,
            bg: "bg-slate-50",
            text: "text-slate-600",
            ring: "ring-slate-200",
            dot: "bg-slate-500",
        }
    );
}

/* ============================================================
   Priority Config
   ============================================================ */
function getPriorityInfo(priority) {
    const map = {
        high: {
            label: "زیاد",
            icon: PiWarningCircle,
            bg: "bg-rose-50",
            text: "text-rose-700",
            ring: "ring-rose-200",
        },
        medium: {
            label: "متوسط",
            icon: PiWarningCircle,
            bg: "bg-amber-50",
            text: "text-amber-700",
            ring: "ring-amber-200",
        },
        low: {
            label: "کم",
            icon: PiCheckCircle,
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            ring: "ring-emerald-200",
        },
    };
    return (
        map[priority] || {
            label: priority || "نامشخص",
            icon: PiWarningCircle,
            bg: "bg-slate-50",
            text: "text-slate-600",
            ring: "ring-slate-200",
        }
    );
}

/* ============================================================
   StatusBadge
   ============================================================ */
function StatusBadge({ status }) {
    const info = getStatusInfo(status);
    const Icon = info.icon;
    return (
        <span
            className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1 rounded-full
        text-[11px] font-bold
        ring-1
        ${info.bg} ${info.text} ${info.ring}
      `}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${info.dot} animate-pulse`} />
            <Icon className="w-3.5 h-3.5" />
            {info.label}
        </span>
    );
}

/* ============================================================
   PriorityBadge
   ============================================================ */
function PriorityBadge({ priority }) {
    const info = getPriorityInfo(priority);
    const Icon = info.icon;
    return (
        <span
            className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1 rounded-full
        text-[11px] font-bold
        ring-1
        ${info.bg} ${info.text} ${info.ring}
      `}
        >
            <Icon className="w-3.5 h-3.5" />
            {info.label}
        </span>
    );
}

/* ============================================================
   TicketSkeleton
   ============================================================ */
function TicketSkeleton() {
    return (
        <div className="w-full space-y-5 animate-pulse">
            {/* هدر */}
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-7 w-48 bg-slate-100 rounded-lg" />
                    <div className="h-3.5 w-64 bg-slate-100 rounded-md" />
                </div>
                <div className="h-10 w-32 bg-slate-100 rounded-xl" />
            </div>

            {/* کارت‌ها */}
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 space-y-3"
                >
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-20 bg-slate-100 rounded-full" />
                        <div className="h-6 w-24 bg-slate-100 rounded-full" />
                    </div>
                    <div className="h-5 w-2/3 bg-slate-100 rounded-lg" />
                    <div className="h-3 w-full bg-slate-100 rounded-md" />
                    <div className="h-3 w-5/6 bg-slate-100 rounded-md" />
                    <div className="flex justify-end pt-2">
                        <div className="h-9 w-32 bg-slate-100 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ============================================================
   EmptyState
   ============================================================ */
function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="
        relative overflow-hidden
        bg-white rounded-3xl
        ring-1 ring-slate-100
        shadow-[0_8px_32px_rgba(198,161,76,0.06)]
        p-8 sm:p-12
        text-center
      "
        >
            <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    backgroundImage: `radial-gradient(circle at 50% 0%, rgba(198,161,76,0.08) 0%, transparent 50%)`,
                }}
            />

            <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-gold-50 to-gold-100/60 flex items-center justify-center ring-1 ring-gold-100">
                <div className="absolute inset-0 rounded-3xl bg-gold-500/5 blur-xl" />
                <PiTicket className="relative w-10 h-10 text-gold-500" />
            </div>

            <h3 className="relative text-lg sm:text-xl font-bold text-slate-900 mb-2">
                هنوز تیکتی ثبت نکرده‌اید
            </h3>
            <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-7">
                اگر سوال، مشکل یا درخواستی دارید، می‌توانید با تیم پشتیبانی در ارتباط
                باشید.
            </p>

            <Link
                href="/user/tickets/create"
                className="
          relative inline-flex items-center gap-2
          px-6 py-3 rounded-xl
          text-sm font-bold text-white
          bg-gradient-to-b from-gold-400 to-gold-600
          hover:from-gold-500 hover:to-gold-700
          shadow-md shadow-gold-500/25
          hover:shadow-lg hover:shadow-gold-500/40
          hover:-translate-y-0.5
          transition-all duration-300
        "
            >
                <PiPlusCircle className="w-4 h-4" />
                ایجاد تیکت جدید
            </Link>
        </motion.div>
    );
}

/* ============================================================
   TicketCard
   ============================================================ */
function TicketCard({ ticket, index }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            className="
        group bg-white rounded-2xl
        ring-1 ring-slate-100 hover:ring-gold-200/70
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        hover:shadow-[0_12px_32px_-12px_rgba(198,161,76,0.18)]
        transition-all duration-400
        overflow-hidden
      "
        >
            <div className="p-5">
                {/* ردیف بالا: badges + تاریخ */}
                <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
                        <PiCalendarBlank className="w-3.5 h-3.5" />
                        {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                    </div>
                </div>

                {/* موضوع */}
                <h3 className="text-base sm:text-[17px] font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-gold-700 transition-colors">
                    {ticket.subject}
                </h3>

                {/* توضیحات */}
                <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2 mb-4">
                    {ticket.description || "بدون توضیحات"}
                </p>

                {/* اکشن‌ها */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="text-[10.5px] text-slate-400">
                        <span>شناسه: </span>
                        <span className="font-mono font-bold text-slate-600">
                            #{ticket._id?.slice(-6).toUpperCase()}
                        </span>
                    </div>

                    <Link
                        href={`/user/tickets/add_comment/${ticket._id}`}
                        className="
              inline-flex items-center justify-center gap-1.5
              px-4 py-2 rounded-lg
              text-[11.5px] font-bold text-white
              bg-gradient-to-b from-gold-400 to-gold-600
              hover:from-gold-500 hover:to-gold-700
              shadow-sm shadow-gold-500/25
              hover:shadow-md hover:shadow-gold-500/40
              transition-all duration-200
              group/btn
            "
                    >
                        <PiChatCircleDots className="w-3.5 h-3.5" />
                        مشاهده و پاسخ
                        <PiEye className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}

/* ============================================================
   Page
   ============================================================ */
export default function UserTicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/user/tickets", {
                withCredentials: true,
            });
            setTickets(res.data || []);
        } catch (err) {
            console.error("خطا در دریافت تیکت‌ها", err);
            toast.error("خطا در بارگذاری تیکت‌ها", {
                duration: 3000,
                position: "bottom-center",
                style: {
                    background: "#FEF2F2",
                    color: "#991B1B",
                    borderRadius: "12px",
                    padding: "12px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "1px solid #FCA5A5",
                },
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    /* ---------- Loading ---------- */
    if (loading) {
        return (
            <div dir="rtl" className="w-full">
                <TicketSkeleton />
            </div>
        );
    }

    /* ---------- Render ---------- */
    return (
        <div dir="rtl" className="w-full">
            <Toaster />

            {/* ==================== Header ==================== */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mb-6"
            >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25 flex-shrink-0">
                            <PiTicket className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                                تیکت‌های پشتیبانی
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                مشاهده و مدیریت تیکت‌های شما
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/user/tickets/create"
                        className="
              inline-flex items-center gap-2
              px-4 py-2.5 rounded-xl
              text-xs font-semibold text-white
              bg-gradient-to-b from-gold-400 to-gold-600
              hover:from-gold-500 hover:to-gold-700
              shadow-md shadow-gold-500/25
              hover:shadow-lg hover:shadow-gold-500/40
              hover:-translate-y-0.5
              transition-all duration-300
            "
                    >
                        <PiPlusCircle className="w-4 h-4" />
                        تیکت جدید
                    </Link>
                </div>
            </motion.div>

            {/* ==================== محتوا ==================== */}
            <AnimatePresence mode="wait">
                {tickets.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <EmptyState />
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        {tickets.map((ticket, index) => (
                            <TicketCard
                                key={ticket._id}
                                ticket={ticket}
                                index={index}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}