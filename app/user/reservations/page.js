// app/user/reservations/page.jsx
"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import {
    PiCalendarBlank,
    PiWarningCircle,
    PiArrowClockwise,
    PiCalendarX,
    PiPlusCircle,
    PiCaretRight,
    PiCaretLeft,
    PiCaretDoubleRight,
    PiCaretDoubleLeft,
} from "react-icons/pi";
import { useSession } from "next-auth/react";

import ReservationStats from "@/components/user/reservations/ReservationStats";
import ReservationFilters from "@/components/user/reservations/ReservationFilters";
import ReservationCard from "@/components/user/reservations/ReservationCard";
import ReservationSkeleton from "@/components/user/reservations/ReservationSkeleton";

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
   EmptyState
   ============================================================ */
function EmptyState({ activeFilter, onReset }) {
    const wrapperClass = [
        "relative overflow-hidden",
        "bg-white rounded-3xl",
        "ring-1 ring-slate-100",
        "shadow-[0_8px_32px_rgba(198,161,76,0.06)]",
        "p-8 sm:p-12",
        "text-center",
    ].join(" ");

    const resetBtnClass = [
        "inline-flex items-center gap-2",
        "px-5 py-2.5 rounded-xl",
        "text-sm font-medium",
        "text-slate-700 bg-white",
        "border border-slate-200",
        "hover:bg-slate-50 hover:border-slate-300",
        "transition-all duration-200",
    ].join(" ");

    const ctaClass = [
        "inline-flex items-center gap-2",
        "px-6 py-3 rounded-xl",
        "text-sm font-bold text-white",
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
            className={wrapperClass}
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
                <PiCalendarX className="relative w-10 h-10 text-gold-500" />
            </div>

            <h3 className="relative text-lg sm:text-xl font-bold text-slate-900 mb-2">
                {activeFilter
                    ? "رزروی با این فیلتر یافت نشد"
                    : "هنوز رزروی ثبت نکرده‌اید"}
            </h3>
            <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-7">
                {activeFilter
                    ? "می‌توانید فیلترها را تغییر دهید یا همه را پاک کنید."
                    : "با مشاهده تالارها می‌توانید اولین رزرو خود را ثبت کنید."}
            </p>

            <div className="relative flex flex-wrap items-center justify-center gap-3">
                {activeFilter && (
                    <button onClick={onReset} className={resetBtnClass}>
                        <PiArrowClockwise className="w-4 h-4" />
                        پاک کردن فیلترها
                    </button>
                )}

                <Link href="/halls" className={ctaClass}>
                    <PiPlusCircle className="w-4 h-4" />
                    مشاهده تالارها
                </Link>
            </div>
        </motion.div>
    );
}

/* ============================================================
   ErrorState
   ============================================================ */
function ErrorState({ message, onRetry }) {
    const wrapperClass = [
        "relative overflow-hidden",
        "bg-white rounded-3xl",
        "ring-1 ring-rose-100",
        "shadow-[0_8px_32px_rgba(244,63,94,0.06)]",
        "p-8 sm:p-12",
        "text-center",
    ].join(" ");

    const retryBtnClass = [
        "relative inline-flex items-center gap-2",
        "px-6 py-3 rounded-xl",
        "text-sm font-bold text-white",
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
            className={wrapperClass}
        >
            <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 50% 0%, rgba(244,63,94,0.06) 0%, transparent 50%)",
                }}
            />

            <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-rose-50 to-rose-100/60 flex items-center justify-center ring-1 ring-rose-100">
                <div className="absolute inset-0 rounded-3xl bg-rose-500/5 blur-xl" />
                <PiWarningCircle className="relative w-10 h-10 text-rose-500" />
            </div>

            <h3 className="relative text-lg sm:text-xl font-bold text-slate-900 mb-2">
                خطا در بارگذاری
            </h3>
            <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-7">
                {message ||
                    "متأسفانه در دریافت اطلاعات رزروها مشکلی پیش آمد. لطفاً دوباره تلاش کنید."}
            </p>

            <button onClick={onRetry} className={retryBtnClass}>
                <PiArrowClockwise className="w-4 h-4" />
                تلاش مجدد
            </button>
        </motion.div>
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
                رزرو
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
                    htmlFor="per-page-select"
                    className="text-[11.5px] text-slate-500 whitespace-nowrap"
                >
                    تعداد در صفحه:
                </label>
                <select
                    id="per-page-select"
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
   Page
   ============================================================ */
export default function ReservationsPage() {
    const { data: session, status } = useSession();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    /* ========== Pagination State ========== */
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    /* ========== Refs ========== */
    const listTopRef = useRef(null);

    /* ============================================================
       بارگذاری رزروها
       ============================================================ */
    const fetchReservations = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get("/api/user/hall_reservations");
            setReservations(res.data.reservations || res.data || []);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "خطا در دریافت اطلاعات");
            toast.error("خطا در دریافت رزروها", TOAST_OPTIONS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchReservations();
        } else if (status === "unauthenticated") {
            setLoading(false);
        }
    }, [status]);

    /* ============================================================
       آمار
       ============================================================ */
    const stats = useMemo(() => {
        const total = reservations.length;
        const pending = reservations.filter(
            (r) => r.status === "pending"
        ).length;
        const confirmed = reservations.filter(
            (r) => r.status === "confirmed" || r.status === "approved"
        ).length;
        const cancelled = reservations.filter(
            (r) => r.status === "cancelled" || r.status === "rejected"
        ).length;

        return { total, pending, confirmed, cancelled };
    }, [reservations]);

    /* ============================================================
       فیلتر و جستجو
       ============================================================ */
    const filtered = useMemo(() => {
        let list = [...reservations];

        if (filter !== "all") {
            if (filter === "confirmed") {
                list = list.filter(
                    (r) => r.status === "confirmed" || r.status === "approved"
                );
            } else {
                list = list.filter((r) => r.status === filter);
            }
        }

        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            list = list.filter((r) => {
                const title = (r.hall_id?.title || r.hall_title || "").toLowerCase();
                const city = (r.hall_id?.city || r.hall_city || "").toLowerCase();
                return title.includes(q) || city.includes(q);
            });
        }

        list.sort((a, b) => {
            const da = new Date(a.createdAt || a.start_date);
            const db = new Date(b.createdAt || b.start_date);
            return db - da;
        });

        return list;
    }, [reservations, filter, searchQuery]);

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

    /* ========== ریست صفحه هنگام تغییر فیلتر/جستجو/perPage ========== */
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchQuery, perPage]);

    /* ========== اصلاح صفحه اگر از محدوده خارج شد ========== */
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    /* ========== هندل تغییر صفحه با اسکرول ========== */
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
       Loading / Unauthenticated
       ============================================================ */
    if (status === "loading" || loading) {
        return <ReservationSkeleton />;
    }

    if (!session) {
        return (
            <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto bg-gold-50 rounded-2xl ring-1 ring-gold-100 flex items-center justify-center mb-4">
                    <PiCalendarBlank className="w-8 h-8 text-gold-500" />
                </div>
                <p className="text-slate-700 font-medium">دسترسی محدود</p>
                <p className="text-slate-500 text-sm mt-1">
                    برای مشاهده رزروها وارد شوید
                </p>
            </div>
        );
    }

    /* ============================================================
       Render
       ============================================================ */
    const newReservationBtn = [
        "inline-flex items-center gap-2",
        "px-4 py-2.5 rounded-xl",
        "text-xs font-semibold text-white",
        "bg-gradient-to-b from-gold-400 to-gold-600",
        "hover:from-gold-500 hover:to-gold-700",
        "shadow-md shadow-gold-500/25",
        "hover:shadow-lg hover:shadow-gold-500/40",
        "hover:-translate-y-0.5",
        "transition-all duration-300",
    ].join(" ");

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
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                            رزروهای من
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            مشاهده و مدیریت تمام رزروهای ثبت‌شده شما
                        </p>
                    </div>

                    <Link href="/halls" className={newReservationBtn}>
                        <PiPlusCircle className="w-4 h-4" />
                        رزرو جدید
                    </Link>
                </div>
            </motion.div>

            {/* ==================== آمار ==================== */}
            {!error && reservations.length > 0 && (
                <ReservationStats
                    stats={stats}
                    activeFilter={filter}
                    onFilterChange={setFilter}
                />
            )}

            {/* ==================== فیلتر و جستجو ==================== */}
            {!error && reservations.length > 0 && (
                <ReservationFilters
                    filter={filter}
                    onFilterChange={setFilter}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    total={filtered.length}
                />
            )}

            {/* ==================== محتوا ==================== */}
            <div ref={listTopRef} />
            <AnimatePresence mode="wait">
                {/* خطا */}
                {error && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <ErrorState message={error} onRetry={fetchReservations} />
                    </motion.div>
                )}

                {/* خالی */}
                {!error && filtered.length === 0 && (
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
                )}

                {/* لیست رزروها */}
                {!error && filtered.length > 0 && (
                    <motion.div
                        key={`list-${safeCurrentPage}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        {paginated.map((reservation, index) => (
                            <ReservationCard
                                key={reservation._id}
                                reservation={reservation}
                                index={index}
                                onUpdate={fetchReservations}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ==================== Pagination ==================== */}
            {!error && totalPages > 1 && (
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