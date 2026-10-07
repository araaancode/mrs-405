// components/notifications/NotificationBell.jsx
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    PiBell,
    PiBellRinging,
    PiCheckCircle,
    PiTrash,
    PiCalendarCheck,
    PiCalendarX,
    PiCalendarPlus,
    PiCreditCard,
    PiXCircle,
    PiInfo,
    PiGift,
    PiChatCircleDots,
    PiSpinnerGap,
    PiStorefront,
    PiUserPlus,
    PiTicket,
} from "react-icons/pi";
import { useNotifications } from "@/contexts/NotificationContext";

/* ============================================================
   آیکون بر اساس نوع نوتیفیکیشن
   ============================================================ */
function getIcon(type) {
    const map = {
        // کاربر
        reservation_created: PiCalendarPlus,
        reservation_accepted: PiCalendarCheck,
        reservation_rejected: PiCalendarX,
        reservation_canceled: PiCalendarX,
        payment_success: PiCreditCard,
        payment_failed: PiXCircle,
        ticket_reply: PiChatCircleDots,
        ticket_closed: PiCheckCircle,

        // تالاردار
        new_reservation: PiCalendarPlus,
        reservation_canceled_by_user: PiCalendarX,
        payment_received: PiCreditCard,
        new_ticket_from_user: PiChatCircleDots,

        // ادمین
        new_hall_request: PiStorefront,
        new_owner_registration: PiUserPlus,
        new_ticket: PiTicket,
        user_report: PiInfo,

        // عمومی
        system: PiInfo,
        promotion: PiGift,
    };
    return map[type] || PiBell;
}

/* ============================================================
   رنگ بر اساس priority
   ============================================================ */
function getColor(priority, isRead) {
    if (isRead)
        return {
            bg: "bg-slate-100",
            text: "text-slate-500",
            ring: "ring-slate-200",
        };

    const map = {
        low: {
            bg: "bg-emerald-50",
            text: "text-emerald-600",
            ring: "ring-emerald-200",
        },
        medium: {
            bg: "bg-gold-50",
            text: "text-gold-600",
            ring: "ring-gold-200",
        },
        high: {
            bg: "bg-amber-50",
            text: "text-amber-600",
            ring: "ring-amber-200",
        },
        critical: {
            bg: "bg-rose-50",
            text: "text-rose-600",
            ring: "ring-rose-200",
        },
    };
    return map[priority] || map.medium;
}

function timeAgo(date) {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (d > 0) return `${d} روز پیش`;
    if (h > 0) return `${h} ساعت پیش`;
    if (m > 0) return `${m} دقیقه پیش`;
    return "لحظاتی پیش";
}

/* ============================================================
   Bell
   ============================================================ */
export default function NotificationBell() {
    const {
        notifications,
        unreadCount,
        loading,
        open,
        setOpen,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    } = useNotifications();

    const wrapperRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onClick = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target))
                setOpen(false);
        };
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [open, setOpen]);

    return (
        <div ref={wrapperRef} className="relative">
            {/* دکمه زنگ */}
            <button
                type="button"
                aria-label="اعلان‌ها"
                onClick={() => setOpen((p) => !p)}
                className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur border border-slate-200/80 hover:border-gold-300 hover:bg-gold-50/60 text-slate-600 hover:text-gold-700 transition-all active:scale-95"
            >
                {unreadCount > 0 ? (
                    <PiBellRinging className="w-5 h-5" />
                ) : (
                    <PiBell className="w-5 h-5" />
                )}

                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-md shadow-rose-500/30"
                        >
                            {unreadCount > 99
                                ? "99+"
                                : unreadCount.toLocaleString("fa-IR")}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-[340px] sm:w-[380px] max-w-[calc(100vw-1.5rem)] bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.15)] overflow-hidden z-50"
                        dir="rtl"
                    >
                        {/* هدر */}
                        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-100 bg-gradient-to-l from-gold-50/40 to-white">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-800">
                                    اعلان‌ها
                                </span>
                                {unreadCount > 0 && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold ring-1 ring-rose-200">
                                        {unreadCount.toLocaleString("fa-IR")} جدید
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    onClick={markAllAsRead}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-700 hover:text-gold-800 px-2 py-1 rounded-lg hover:bg-gold-50 transition-colors"
                                >
                                    <PiCheckCircle className="w-3.5 h-3.5" />
                                    خواندن همه
                                </button>
                            )}
                        </div>

                        {/* لیست */}
                        <div className="max-h-[420px] overflow-y-auto">
                            {loading && notifications.length === 0 ? (
                                <div className="py-12 flex flex-col items-center gap-2 text-slate-400">
                                    <PiSpinnerGap className="w-6 h-6 animate-spin" />
                                    <span className="text-xs">در حال بارگذاری...</span>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-50 flex items-center justify-center ring-1 ring-slate-100">
                                        <PiBell className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-600">
                                        اعلان جدیدی ندارید
                                    </p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-slate-100/80">
                                    {notifications.map((n) => {
                                        const Icon = getIcon(n.type);
                                        const c = getColor(n.priority, n.is_read);
                                        return (
                                            <li key={n._id}>
                                                <div
                                                    className={`group relative flex gap-3 px-4 py-3 transition-colors ${
                                                        !n.is_read
                                                            ? "bg-gold-50/30 hover:bg-gold-50/60"
                                                            : "hover:bg-slate-50/60"
                                                    }`}
                                                >
                                                    {!n.is_read && (
                                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gold-500" />
                                                    )}
                                                    <div
                                                        className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center ring-1 ${c.bg} ${c.text} ${c.ring}`}
                                                    >
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            !n.is_read && markAsRead(n._id)
                                                        }
                                                        className="flex-1 text-right min-w-0"
                                                    >
                                                        <p
                                                            className={`text-[12.5px] leading-snug ${
                                                                !n.is_read
                                                                    ? "font-bold text-slate-800"
                                                                    : "font-medium text-slate-600"
                                                            }`}
                                                        >
                                                            {n.title}
                                                        </p>
                                                        <p className="text-[11.5px] text-slate-500 leading-relaxed mt-0.5 line-clamp-2">
                                                            {n.message}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 mt-1">
                                                            {timeAgo(n.createdAt)}
                                                        </p>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteNotification(n._id)
                                                        }
                                                        aria-label="حذف"
                                                        className="self-start w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <PiTrash className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>

                        {/* فوتر */}
                        {notifications.length > 0 && (
                            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60">
                                <Link
                                    href="/user/notifications"
                                    onClick={() => setOpen(false)}
                                    className="block text-center text-[11.5px] font-bold text-gold-700 hover:text-gold-800 transition-colors"
                                >
                                    مشاهده همه اعلان‌ها
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}