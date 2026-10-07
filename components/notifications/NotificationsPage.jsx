// components/notifications/NotificationsPage.jsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    PiBell,
    PiBellRinging,
    PiCheckCircle,
    PiTrash,
    PiArrowClockwise,
    PiSpinnerGap,
    PiCalendarPlus,
    PiCalendarCheck,
    PiCalendarX,
    PiCreditCard,
    PiXCircle,
    PiInfo,
    PiGift,
    PiChatCircleDots,
    PiStorefront,
    PiUserPlus,
    PiTicket,
    PiMagnifyingGlass,
    PiArrowRight,
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
        ticket_created: PiTicket,
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

/* ============================================================
   برچسب نوع
   ============================================================ */
function getTypeLabel(type) {
    const map = {
        reservation_created: "رزرو",
        reservation_accepted: "رزرو",
        reservation_rejected: "رزرو",
        reservation_canceled: "رزرو",
        reservation_paid: "رزرو",
        payment_success: "پرداخت",
        payment_failed: "پرداخت",
        ticket_created: "تیکت",
        ticket_reply: "تیکت",
        ticket_closed: "تیکت",
        new_reservation: "رزرو",
        reservation_canceled_by_user: "رزرو",
        payment_received: "پرداخت",
        new_ticket_from_user: "تیکت",
        new_hall_request: "تالار",
        new_owner_registration: "کاربر",
        new_ticket: "تیکت",
        user_report: "گزارش",
        system: "سیستم",
        promotion: "پیشنهاد",
    };
    return map[type] || "سیستم";
}

/* ============================================================
   زمان نسبی
   ============================================================ */
function timeAgo(date) {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    const w = Math.floor(d / 7);
    const mo = Math.floor(d / 30);

    if (mo > 0) return `${mo} ماه پیش`;
    if (w > 0) return `${w} هفته پیش`;
    if (d > 0) return `${d} روز پیش`;
    if (h > 0) return `${h} ساعت پیش`;
    if (m > 0) return `${m} دقیقه پیش`;
    return "لحظاتی پیش";
}

/* ============================================================
   فیلترها
   ============================================================ */
const FILTERS = [
    { key: "all", label: "همه" },
    { key: "unread", label: "خوانده‌نشده" },
    { key: "reservation", label: "رزروها" },
    { key: "payment", label: "پرداخت‌ها" },
    { key: "ticket", label: "تیکت‌ها" },
    { key: "system", label: "سیستمی" },
];

/* ============================================================
   Skeleton
   ============================================================ */
function NotificationsSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-8 w-48 bg-slate-100 rounded-lg" />
            {[1, 2, 3, 4, 5].map((i) => (
                <div
                    key={i}
                    className="bg-white rounded-2xl ring-1 ring-slate-100 p-4 flex gap-3"
                >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 bg-slate-100 rounded" />
                        <div className="h-3 w-full bg-slate-100 rounded" />
                        <div className="h-3 w-1/4 bg-slate-100 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ============================================================
   Empty State
   ============================================================ */
function EmptyState({ activeFilter, onReset }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative overflow-hidden bg-white rounded-3xl ring-1 ring-slate-100 shadow-[0_8px_32px_rgba(198,161,76,0.06)] p-8 sm:p-12 text-center"
        >
            <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    backgroundImage: `radial-gradient(circle at 50% 0%, rgba(198,161,76,0.08) 0%, transparent 50%)`,
                }}
            />

            <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-gold-50 to-gold-100/60 flex items-center justify-center ring-1 ring-gold-100">
                <div className="absolute inset-0 rounded-3xl bg-gold-500/5 blur-xl" />
                <PiBell className="relative w-10 h-10 text-gold-500" />
            </div>

            <h3 className="relative text-lg sm:text-xl font-bold text-slate-900 mb-2">
                {activeFilter ? "اعلانی با این فیلتر یافت نشد" : "هنوز اعلانی ندارید"}
            </h3>
            <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-7">
                {activeFilter
                    ? "می‌توانید فیلتر را تغییر دهید یا همه را پاک کنید."
                    : "به‌محض ثبت رزرو، پرداخت یا تیکت، اعلان‌های شما اینجا نمایش داده می‌شوند."}
            </p>

            {activeFilter && (
                <button
                    onClick={onReset}
                    className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                >
                    <PiArrowClockwise className="w-4 h-4" />
                    پاک کردن فیلترها
                </button>
            )}
        </motion.div>
    );
}

/* ============================================================
   Notification Card
   ============================================================ */
function NotificationCard({ notification, index, onRead, onDelete }) {
    const Icon = getIcon(notification.type);
    const color = getColor(notification.priority, notification.is_read);
    const typeLabel = getTypeLabel(notification.type);

    return (
        <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
            className={`
                group relative bg-white rounded-2xl
                ring-1 transition-all duration-300
                overflow-hidden
                ${
                    !notification.is_read
                        ? "ring-gold-200/80 bg-gradient-to-l from-gold-50/40 to-white shadow-[0_4px_20px_rgba(198,161,76,0.08)]"
                        : "ring-slate-100 hover:ring-slate-200"
                }
            `}
        >
            {/* نوار عمودی طلایی */}
            {!notification.is_read && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold-400 to-gold-600" />
            )}

            <div className="p-4 sm:p-5 flex gap-3 sm:gap-4">
                {/* آیکون */}
                <div
                    className={`
                        w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex-shrink-0
                        flex items-center justify-center ring-1
                        ${color.bg} ${color.text} ${color.ring}
                    `}
                >
                    <Icon className="w-5 h-5" />
                </div>

                {/* محتوا */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3
                                className={`
                                    text-[13.5px] sm:text-sm leading-snug
                                    ${
                                        !notification.is_read
                                            ? "font-bold text-slate-900"
                                            : "font-medium text-slate-700"
                                    }
                                `}
                            >
                                {notification.title}
                            </h3>

                            {!notification.is_read && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gold-100 text-gold-700 text-[10px] font-bold">
                                    <span className="w-1 h-1 rounded-full bg-gold-500 animate-pulse" />
                                    جدید
                                </span>
                            )}
                        </div>

                        {/* دکمه حذف */}
                        <button
                            type="button"
                            onClick={() => onDelete(notification._id)}
                            aria-label="حذف"
                            className="
                                flex-shrink-0 w-7 h-7 rounded-lg
                                flex items-center justify-center
                                text-slate-300
                                hover:text-rose-500 hover:bg-rose-50
                                opacity-0 group-hover:opacity-100
                                transition-all
                            "
                        >
                            <PiTrash className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <p className="text-[12.5px] sm:text-[13px] text-slate-600 leading-relaxed mb-2 break-words">
                        {notification.message}
                    </p>

                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                            <span
                                className={`
                                    px-2 py-0.5 rounded-full
                                    text-[10px] font-bold ring-1
                                    ${color.bg} ${color.text} ${color.ring}
                                `}
                            >
                                {typeLabel}
                            </span>
                            <span className="text-[10.5px] text-slate-400">
                                {timeAgo(notification.createdAt)}
                            </span>
                        </div>

                        {!notification.is_read && (
                            <button
                                type="button"
                                onClick={() => onRead(notification._id)}
                                className="
                                    inline-flex items-center gap-1
                                    text-[11px] font-bold
                                    text-gold-700 hover:text-gold-800
                                    px-2 py-1 rounded-lg
                                    hover:bg-gold-50
                                    transition-colors
                                "
                            >
                                <PiCheckCircle className="w-3.5 h-3.5" />
                                خواندن
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

/* ============================================================
   Main Component (قابل استفاده در همه نقش‌ها)
   ============================================================ */
export default function NotificationsPage({ backHref = "/", backLabel = "بازگشت" }) {
    const {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    } = useNotifications();

    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    /* ========== فیلتر و جستجو ========== */
    const filtered = useMemo(() => {
        let list = [...notifications];

        if (filter === "unread") {
            list = list.filter((n) => !n.is_read);
        } else if (filter === "reservation") {
            list = list.filter((n) => n.type.startsWith("reservation"));
        } else if (filter === "payment") {
            list = list.filter((n) => n.type.startsWith("payment"));
        } else if (filter === "ticket") {
            list = list.filter(
                (n) =>
                    n.type.startsWith("ticket") ||
                    n.type === "new_ticket_from_user"
            );
        } else if (filter === "system") {
            list = list.filter((n) =>
                ["system", "promotion", "reminder", "user_report"].includes(n.type)
            );
        }

        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            list = list.filter(
                (n) =>
                    n.title?.toLowerCase().includes(q) ||
                    n.message?.toLowerCase().includes(q)
            );
        }

        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return list;
    }, [notifications, filter, searchQuery]);

    /* ========== شمارش هر فیلتر ========== */
    const counts = useMemo(
        () => ({
            all: notifications.length,
            unread: notifications.filter((n) => !n.is_read).length,
            reservation: notifications.filter((n) =>
                n.type.startsWith("reservation")
            ).length,
            payment: notifications.filter((n) => n.type.startsWith("payment"))
                .length,
            ticket: notifications.filter(
                (n) =>
                    n.type.startsWith("ticket") ||
                    n.type === "new_ticket_from_user"
            ).length,
            system: notifications.filter((n) =>
                ["system", "promotion", "reminder", "user_report"].includes(n.type)
            ).length,
        }),
        [notifications]
    );

    /* ========== رفرش دستی ========== */
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
        setRefreshing(false);
        toast.success("اعلان‌ها به‌روز شدند", {
            icon: "🔄",
            duration: 2000,
        });
    };

    /* ========== حذف همه ========== */
    const handleDeleteAll = async () => {
        if (!confirm("آیا از حذف همه اعلان‌ها مطمئن هستید؟")) return;
        try {
            const axios = (await import("axios")).default;
            await axios.delete("/api/notifications?all=true");
            await fetchNotifications();
            toast.success("همه اعلان‌ها حذف شدند");
        } catch (err) {
            toast.error("خطا در حذف اعلان‌ها");
        }
    };

    /* ========== Loading ========== */
    if (loading && notifications.length === 0) {
        return (
            <div dir="rtl" className="w-full">
                <NotificationsSkeleton />
            </div>
        );
    }

    /* ========== Render ========== */
    return (
        <div dir="rtl" className="w-full">
            {/* ==================== Header ==================== */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mb-6"
            >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25 flex-shrink-0">
                            {unreadCount > 0 ? (
                                <PiBellRinging className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            ) : (
                                <PiBell className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            )}
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                                    {unreadCount > 99
                                        ? "99+"
                                        : unreadCount.toLocaleString("fa-IR")}
                                </span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                                اعلان‌های من
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                همه اعلان‌های شما در یک نگاه
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* رفرش */}
                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="
                                inline-flex items-center gap-1.5
                                px-3 py-2 rounded-xl
                                text-[12px] font-medium
                                text-slate-600 bg-white
                                border border-slate-200
                                hover:bg-gold-50 hover:border-gold-300 hover:text-gold-700
                                disabled:opacity-50 disabled:cursor-not-allowed
                                active:scale-95
                                transition-all duration-200
                            "
                        >
                            <PiArrowClockwise
                                className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
                            />
                            <span className="hidden sm:inline">به‌روزرسانی</span>
                        </button>

                        {/* خواندن همه */}
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllAsRead}
                                className="
                                    inline-flex items-center gap-1.5
                                    px-3 py-2 rounded-xl
                                    text-[12px] font-bold text-white
                                    bg-gradient-to-b from-gold-400 to-gold-600
                                    hover:from-gold-500 hover:to-gold-700
                                    shadow-md shadow-gold-500/25
                                    hover:shadow-lg hover:shadow-gold-500/40
                                    hover:-translate-y-0.5
                                    active:scale-95
                                    transition-all duration-200
                                "
                            >
                                <PiCheckCircle className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">خواندن همه</span>
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ==================== Filters ==================== */}
            {notifications.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                    className="mb-5 space-y-3"
                >
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                        {FILTERS.map((f) => {
                            const active = filter === f.key;
                            const count = counts[f.key] || 0;
                            return (
                                <button
                                    key={f.key}
                                    type="button"
                                    onClick={() => setFilter(f.key)}
                                    className={`
                                        flex-shrink-0 inline-flex items-center gap-1.5
                                        px-3.5 py-2 rounded-xl
                                        text-[12px] font-bold
                                        transition-all duration-200
                                        ${
                                            active
                                                ? "text-white bg-gradient-to-b from-gold-400 to-gold-600 shadow-md shadow-gold-500/25"
                                                : "text-slate-600 bg-white border border-slate-200 hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50"
                                        }
                                    `}
                                >
                                    <span>{f.label}</span>
                                    {count > 0 && (
                                        <span
                                            className={`
                                                px-1.5 rounded-full text-[10px]
                                                ${
                                                    active
                                                        ? "bg-white/25 text-white"
                                                        : "bg-slate-100 text-slate-600"
                                                }
                                            `}
                                        >
                                            {count.toLocaleString("fa-IR")}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 group">
                            <PiMagnifyingGlass className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-gold-500 transition-colors pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="جستجو در اعلان‌ها..."
                                className="
                                    w-full pr-11 pl-3.5 py-2.5
                                    bg-white border border-slate-200
                                    rounded-xl
                                    text-[13px] text-slate-900
                                    placeholder:text-slate-400
                                    hover:border-gold-300
                                    focus:outline-none
                                    focus:border-gold-500
                                    focus:ring-4 focus:ring-gold-500/10
                                    transition-all duration-200
                                "
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleDeleteAll}
                            className="
                                flex-shrink-0 inline-flex items-center gap-1.5
                                px-3 py-2.5 rounded-xl
                                text-[12px] font-medium
                                text-slate-500 bg-white
                                border border-slate-200
                                hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200
                                active:scale-95
                                transition-all duration-200
                            "
                            title="حذف همه اعلان‌ها"
                        >
                            <PiTrash className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">حذف همه</span>
                        </button>
                    </div>
                </motion.div>
            )}

            {/* ==================== Content ==================== */}
            <AnimatePresence mode="wait">
                {filtered.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <EmptyState
                            activeFilter={filter !== "all" || searchQuery}
                            onReset={() => {
                                setFilter("all");
                                setSearchQuery("");
                            }}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                    >
                        {filtered.map((notification, index) => (
                            <NotificationCard
                                key={notification._id}
                                notification={notification}
                                index={index}
                                onRead={markAsRead}
                                onDelete={deleteNotification}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ==================== Footer Link ==================== */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="mt-8"
            >
                <Link
                    href={backHref}
                    className="
                        inline-flex items-center gap-2
                        px-4 py-2.5 rounded-xl
                        text-[12.5px] font-medium
                        text-slate-600 bg-white
                        border border-slate-200
                        hover:bg-gold-50 hover:border-gold-300 hover:text-gold-700
                        active:scale-95
                        transition-all duration-200
                    "
                >
                    <PiArrowRight className="w-4 h-4" />
                    {backLabel}
                </Link>
            </motion.div>
        </div>
    );
}