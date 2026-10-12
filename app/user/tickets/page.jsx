"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
    PiTicket,
    PiPlusCircle,
    PiCalendarBlank,
    PiEye,
    PiWarningCircle,
    PiClock,
    PiCheckCircle,
    PiChatCircleDots,
    PiHourglass,
    PiMagnifyingGlass,
    PiCaretRight,
    PiCaretLeft,
    PiCaretDoubleRight,
    PiCaretDoubleLeft,
} from "react-icons/pi";

/* ============================================================
   Toast Options — یک بار در ماژول
   ============================================================ */
const TOAST_OPTIONS = {
    position: "top-center",
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    rtl: true,
    theme: "light",
    style: {
        fontFamily: "'IranianSans', system-ui, sans-serif",
        direction: "rtl",
        textAlign: "right",
        borderRadius: "14px",
        padding: "14px 18px",
        minHeight: "56px",
        fontSize: "13.5px",
        fontWeight: 500,
        background: "#ffffff",
        color: "#1e293b",
    },
};

/* ============================================================
   گزینه‌های تعداد در صفحه
   ============================================================ */
const PER_PAGE_OPTIONS = [5, 10, 20, 50];

/* ============================================================
   تبدیل عدد به فارسی
   ============================================================ */
const toFa = (n) => Number(n).toLocaleString("fa-IR");

/* ============================================================
   فیلترها
   ============================================================ */
const FILTERS = [
    { key: "all", label: "همه" },
    { key: "open", label: "باز" },
    { key: "in_progress", label: "در حال بررسی" },
    { key: "answered", label: "پاسخ داده شده" },
    { key: "closed", label: "بسته شده" },
];

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
        answered: {
            label: "پاسخ داده شده",
            icon: PiChatCircleDots,
            bg: "bg-blue-50",
            text: "text-blue-700",
            ring: "ring-blue-200",
            dot: "bg-blue-500",
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

function getPriorityInfo(priority) {
    const map = {
        high: {
            label: "زیاد",
            icon: PiWarningCircle,
            bg: "bg-rose-50",
            text: "text-rose-700",
            ring: "ring-rose-200",
        },
        critical: {
            label: "بحرانی",
            icon: PiWarningCircle,
            bg: "bg-rose-100",
            text: "text-rose-800",
            ring: "ring-rose-300",
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

function StatusBadge({ status }) {
    const info = getStatusInfo(status);
    const Icon = info.icon;
    const cls = [
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ring-1",
        info.bg,
        info.text,
        info.ring,
    ].join(" ");
    return (
        <span className={cls}>
            <span
                className={[
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    info.dot,
                ].join(" ")}
            />
            <Icon className="w-3.5 h-3.5" />
            {info.label}
        </span>
    );
}

function PriorityBadge({ priority }) {
    const info = getPriorityInfo(priority);
    const Icon = info.icon;
    const cls = [
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ring-1",
        info.bg,
        info.text,
        info.ring,
    ].join(" ");
    return (
        <span className={cls}>
            <Icon className="w-3.5 h-3.5" />
            {info.label}
        </span>
    );
}

function TicketSkeleton() {
    return (
        <div className="w-full space-y-5 animate-pulse">
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-7 w-48 bg-slate-100 rounded-lg" />
                    <div className="h-3.5 w-64 bg-slate-100 rounded-md" />
                </div>
                <div className="h-10 w-32 bg-slate-100 rounded-xl" />
            </div>
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
   Empty State (با پشتیبانی از فیلتر فعال)
   ============================================================ */
function EmptyState({ activeFilter, onReset }) {
    const wrapper = [
        "relative overflow-hidden",
        "bg-white rounded-3xl",
        "ring-1 ring-slate-100",
        "shadow-[0_8px_32px_rgba(198,161,76,0.06)]",
        "p-8 sm:p-12 text-center",
    ].join(" ");

    const resetBtn = [
        "inline-flex items-center gap-2",
        "px-5 py-2.5 rounded-xl text-sm font-medium",
        "text-slate-700 bg-white",
        "border border-slate-200",
        "hover:bg-slate-50 hover:border-slate-300",
        "transition-all duration-200",
    ].join(" ");

    const ctaBtn = [
        "inline-flex items-center gap-2",
        "px-6 py-3 rounded-xl text-sm font-bold text-white",
        "bg-gradient-to-b from-gold-400 to-gold-600",
        "hover:from-gold-500 hover:to-gold-700",
        "shadow-md shadow-gold-500/25",
        "hover:shadow-lg hover:shadow-gold-500/40",
        "hover:-translate-y-0.5",
        "transition-all duration-300",
    ].join(" ");

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={wrapper}
        >
            <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 50% 0%, rgba(198,161,76,0.08) 0%, transparent 50%)",
                }}
            />
            <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-gold-50 to-gold-100/60 flex items-center justify-center ring-1 ring-gold-100">
                <div className="absolute inset-0 rounded-3xl bg-gold-500/5 blur-xl" />
                <PiTicket className="relative w-10 h-10 text-gold-500" />
            </div>
            <h3 className="relative text-lg sm:text-xl font-bold text-slate-900 mb-2">
                {activeFilter
                    ? "تیکتی با این فیلتر یافت نشد"
                    : "هنوز تیکتی ثبت نکرده‌اید"}
            </h3>
            <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-7">
                {activeFilter
                    ? "می‌توانید فیلتر را تغییر دهید یا همه را پاک کنید."
                    : "اگر سوال، مشکل یا درخواستی دارید، می‌توانید با تیم پشتیبانی در ارتباط باشید."}
            </p>
            <div className="relative flex flex-wrap items-center justify-center gap-3">
                {activeFilter && (
                    <button onClick={onReset} className={resetBtn}>
                        پاک کردن فیلترها
                    </button>
                )}
                <Link href="/user/tickets/create" className={ctaBtn}>
                    <PiPlusCircle className="w-4 h-4" />
                    ایجاد تیکت جدید
                </Link>
            </div>
        </motion.div>
    );
}

/* ============================================================
   Ticket Card
   ============================================================ */
function TicketCard({ ticket, index }) {
    const cardCls = [
        "group bg-white rounded-2xl",
        "ring-1 ring-slate-100 hover:ring-gold-200/70",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        "hover:shadow-[0_12px_32px_-12px_rgba(198,161,76,0.18)]",
        "transition-all duration-300 overflow-hidden",
    ].join(" ");

    const linkCls = [
        "inline-flex items-center justify-center gap-1.5",
        "px-4 py-2 rounded-lg text-[11.5px] font-bold text-white",
        "bg-gradient-to-b from-gold-400 to-gold-600",
        "hover:from-gold-500 hover:to-gold-700",
        "shadow-sm shadow-gold-500/25",
        "hover:shadow-md hover:shadow-gold-500/40",
        "transition-all duration-200 group/btn",
    ].join(" ");

    return (
        <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
            className={cardCls}
        >
            <div className="p-5">
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

                <h3 className="text-base sm:text-[17px] font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-gold-700 transition-colors">
                    {ticket.subject}
                </h3>

                <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2 mb-4">
                    {ticket.description || "بدون توضیحات"}
                </p>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="text-[10.5px] text-slate-400">
                        <span>شناسه: </span>
                        <span className="font-mono font-bold text-slate-600">
                            #{ticket._id?.slice(-6).toUpperCase()}
                        </span>
                    </div>

                    <Link
                        href={`/user/tickets/add_comment/${ticket._id}`}
                        className={linkCls}
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
   Pagination Component
   ============================================================ */
function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    perPage,
    onPerPageChange,
    totalItems,
    startIndex,
    endIndex,
}) {
    const pageNumbers = useMemo(() => {
        const pages = [];
        const maxVisible = 5;
        const half = Math.floor(maxVisible / 2);

        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        pages.push(1);

        let start = Math.max(2, currentPage - half);
        let end = Math.min(totalPages - 1, currentPage + half);

        if (currentPage <= half + 1) {
            start = 2;
            end = maxVisible;
        }
        if (currentPage >= totalPages - half) {
            start = totalPages - maxVisible + 1;
            end = totalPages - 1;
        }

        if (start > 2) pages.push("start-ellipsis");
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push("end-ellipsis");

        pages.push(totalPages);
        return pages;
    }, [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    const baseBtn = [
        "inline-flex items-center justify-center",
        "min-w-[34px] h-9 px-2.5 rounded-lg",
        "text-[12px] font-bold",
        "transition-all duration-200",
        "active:scale-95",
    ].join(" ");

    const navBtn = [
        baseBtn,
        "text-slate-500 bg-white border border-slate-200",
        "hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        "disabled:hover:bg-white disabled:hover:border-slate-200 disabled:hover:text-slate-500",
    ].join(" ");

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-white rounded-2xl ring-1 ring-slate-100 p-3 sm:p-4"
        >
            {/* اطلاعات بازه */}
            <div className="text-[11.5px] sm:text-[12px] text-slate-500 order-2 sm:order-1">
                نمایش{" "}
                <span className="font-bold text-slate-700">{toFa(startIndex)}</span>{" "}
                تا{" "}
                <span className="font-bold text-slate-700">{toFa(endIndex)}</span>{" "}
                از{" "}
                <span className="font-bold text-slate-700">{toFa(totalItems)}</span>{" "}
                تیکت
            </div>

            {/* دکمه‌های صفحه */}
            <div className="flex items-center gap-1 order-1 sm:order-2">
                <button
                    type="button"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    aria-label="اولین صفحه"
                    className={navBtn}
                >
                    <PiCaretDoubleRight className="w-3.5 h-3.5" />
                </button>

                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="صفحه قبلی"
                    className={navBtn}
                >
                    <PiCaretRight className="w-3.5 h-3.5" />
                </button>

                <div className="hidden sm:flex items-center gap-1 mx-1">
                    {pageNumbers.map((p, idx) => {
                        if (typeof p === "string") {
                            return (
                                <span
                                    key={`${p}-${idx}`}
                                    className="inline-flex items-center justify-center min-w-[34px] h-9 text-slate-400 text-[12px] font-bold"
                                >
                                    …
                                </span>
                            );
                        }
                        const active = p === currentPage;
                        return (
                            <button
                                key={p}
                                type="button"
                                onClick={() => onPageChange(p)}
                                aria-label={`صفحه ${p}`}
                                aria-current={active ? "page" : undefined}
                                className={[
                                    baseBtn,
                                    active
                                        ? "text-white bg-gradient-to-b from-gold-400 to-gold-600 shadow-md shadow-gold-500/25"
                                        : "text-slate-600 bg-white border border-slate-200 hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50",
                                ].join(" ")}
                            >
                                {toFa(p)}
                            </button>
                        );
                    })}
                </div>

                {/* نمایش موبایل */}
                <div className="sm:hidden inline-flex items-center gap-1 px-3 h-9 rounded-lg bg-gold-50 text-gold-700 text-[12px] font-bold ring-1 ring-gold-200">
                    {toFa(currentPage)} / {toFa(totalPages)}
                </div>

                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="صفحه بعدی"
                    className={navBtn}
                >
                    <PiCaretLeft className="w-3.5 h-3.5" />
                </button>

                <button
                    type="button"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="آخرین صفحه"
                    className={navBtn}
                >
                    <PiCaretDoubleLeft className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* تعداد در صفحه */}
            <div className="flex items-center gap-2 order-3">
                <label
                    htmlFor="tickets-per-page"
                    className="text-[11.5px] text-slate-500 whitespace-nowrap"
                >
                    تعداد در صفحه:
                </label>
                <select
                    id="tickets-per-page"
                    value={perPage}
                    onChange={(e) => onPerPageChange(Number(e.target.value))}
                    className="h-9 pr-2 pl-7 rounded-lg text-[12px] font-bold text-slate-700 bg-white border border-slate-200 hover:border-gold-300 focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 transition-all duration-200 cursor-pointer"
                >
                    {PER_PAGE_OPTIONS.map((n) => (
                        <option key={n} value={n}>
                            {toFa(n)}
                        </option>
                    ))}
                </select>
            </div>
        </motion.div>
    );
}

/* ============================================================
   Main Page
   ============================================================ */
export default function UserTicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const listTopRef = useRef(null);

    /* ============================================================
       Fetch
       ============================================================ */
    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/user/tickets", {
                withCredentials: true,
            });

            const data = res?.data;
            let list = [];

            if (Array.isArray(data)) {
                list = data;
            } else if (Array.isArray(data?.tickets)) {
                list = data.tickets;
            } else if (Array.isArray(data?.data)) {
                list = data.data;
            }

            setTickets(list);
        } catch (err) {
            console.error("خطا در دریافت تیکت‌ها", err);
            setTickets([]);
            toast.error("خطا در بارگذاری تیکت‌ها", TOAST_OPTIONS);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    /* ============================================================
       فیلتر و جستجو
       ============================================================ */
    const filtered = useMemo(() => {
        let list = [...tickets];

        if (filter !== "all") {
            list = list.filter((t) => t.status === filter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            list = list.filter((t) => {
                const subject = (t.subject || "").toLowerCase();
                const desc = (t.description || "").toLowerCase();
                return subject.includes(q) || desc.includes(q);
            });
        }

        // مرتب‌سازی: جدیدترین اول
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return list;
    }, [tickets, filter, searchQuery]);

    /* ============================================================
       شمارش هر فیلتر
       ============================================================ */
    const counts = useMemo(
        () => ({
            all: tickets.length,
            open: tickets.filter((t) => t.status === "open").length,
            in_progress: tickets.filter((t) => t.status === "in_progress")
                .length,
            answered: tickets.filter((t) => t.status === "answered").length,
            closed: tickets.filter((t) => t.status === "closed").length,
        }),
        [tickets]
    );

    /* ============================================================
       محاسبات Pagination
       ============================================================ */
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, totalItems);

    const paginated = useMemo(
        () => filtered.slice(startIndex, endIndex),
        [filtered, startIndex, endIndex]
    );

    /* ============================================================
       Effects: Reset / Fix page
       ============================================================ */
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchQuery, perPage]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    /* ============================================================
       Page change with smooth scroll
       ============================================================ */
    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        if (listTopRef.current) {
            const yOffset = -80;
            const y =
                listTopRef.current.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    }, []);

    /* ============================================================
       Loading
       ============================================================ */
    if (loading) {
        return (
            <div dir="rtl" className="w-full">
                <TicketSkeleton />
            </div>
        );
    }

    /* ============================================================
       Render
       ============================================================ */
    const createBtnCls = [
        "inline-flex items-center gap-2",
        "px-4 py-2.5 rounded-xl text-xs font-semibold text-white",
        "bg-gradient-to-b from-gold-400 to-gold-600",
        "hover:from-gold-500 hover:to-gold-700",
        "shadow-md shadow-gold-500/25",
        "hover:shadow-lg hover:shadow-gold-500/40",
        "hover:-translate-y-0.5",
        "transition-all duration-300",
    ].join(" ");

    const hasTickets = Array.isArray(tickets) && tickets.length > 0;

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

                    <Link href="/user/tickets/create" className={createBtnCls}>
                        <PiPlusCircle className="w-4 h-4" />
                        تیکت جدید
                    </Link>
                </div>
            </motion.div>

            {/* ==================== Filters + Search ==================== */}
            {hasTickets && (
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
                                    className={[
                                        "flex-shrink-0 inline-flex items-center gap-1.5",
                                        "px-3.5 py-2 rounded-xl text-[12px] font-bold",
                                        "transition-all duration-200",
                                        active
                                            ? "text-white bg-gradient-to-b from-gold-400 to-gold-600 shadow-md shadow-gold-500/25"
                                            : "text-slate-600 bg-white border border-slate-200 hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50",
                                    ].join(" ")}
                                >
                                    <span>{f.label}</span>
                                    {count > 0 && (
                                        <span
                                            className={[
                                                "px-1.5 rounded-full text-[10px]",
                                                active
                                                    ? "bg-white/25 text-white"
                                                    : "bg-slate-100 text-slate-600",
                                            ].join(" ")}
                                        >
                                            {toFa(count)}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative group">
                        <PiMagnifyingGlass className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-gold-500 transition-colors pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="جستجو در موضوع یا توضیحات تیکت‌ها..."
                            className="w-full pr-11 pl-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-900 placeholder:text-slate-400 hover:border-gold-300 focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 transition-all duration-200"
                        />
                    </div>
                </motion.div>
            )}

            {/* ==================== Content ==================== */}
            <div ref={listTopRef} />
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
                        key={`list-${safeCurrentPage}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        {paginated.map((ticket, index) => (
                            <TicketCard
                                key={ticket._id}
                                ticket={ticket}
                                index={index}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ==================== Pagination ==================== */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={safeCurrentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    perPage={perPage}
                    onPerPageChange={setPerPage}
                    totalItems={totalItems}
                    startIndex={startIndex + 1}
                    endIndex={endIndex}
                />
            )}
        </div>
    );
}