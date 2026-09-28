// app/user/reservations/page.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import {
    PiCalendarBlank,
    PiWarningCircle,
    PiArrowClockwise,
    PiCalendarX,
    PiPlusCircle,
} from "react-icons/pi";
import { useSession } from "next-auth/react";

import ReservationStats from "@/components/user/reservations/ReservationStats";
import ReservationFilters from "@/components/user/reservations/ReservationFilters";
import ReservationCard from "@/components/user/reservations/ReservationCard";
import ReservationSkeleton from "@/components/user/reservations/ReservationSkeleton";

/* ============================================================
   EmptyState
   ============================================================ */
function EmptyState({ activeFilter, onReset }) {
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
                    <button
                        onClick={onReset}
                        className="
              inline-flex items-center gap-2
              px-5 py-2.5 rounded-xl
              text-sm font-medium
              text-slate-700 bg-white
              border border-slate-200
              hover:bg-slate-50 hover:border-slate-300
              transition-all duration-200
            "
                    >
                        <PiArrowClockwise className="w-4 h-4" />
                        پاک کردن فیلترها
                    </button>
                )}

                <Link
                    href="/halls"
                    className="
            inline-flex items-center gap-2
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
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="
        relative overflow-hidden
        bg-white rounded-3xl
        ring-1 ring-rose-100
        shadow-[0_8px_32px_rgba(244,63,94,0.06)]
        p-8 sm:p-12
        text-center
      "
        >
            <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    backgroundImage: `radial-gradient(circle at 50% 0%, rgba(244,63,94,0.06) 0%, transparent 50%)`,
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

            <button
                onClick={onRetry}
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
                <PiArrowClockwise className="w-4 h-4" />
                تلاش مجدد
            </button>
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
            toast.error("خطا در دریافت رزروها");
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

        // فیلتر بر اساس وضعیت
        if (filter !== "all") {
            if (filter === "confirmed") {
                list = list.filter(
                    (r) => r.status === "confirmed" || r.status === "approved"
                );
            } else {
                list = list.filter((r) => r.status === filter);
            }
        }

        // جستجو در نام تالار و شهر
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            list = list.filter((r) => {
                const title = (r.hall_id?.title || r.hall_title || "").toLowerCase();
                const city = (r.hall_id?.city || r.hall_city || "").toLowerCase();
                return title.includes(q) || city.includes(q);
            });
        }

        // مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
        list.sort((a, b) => {
            const da = new Date(a.createdAt || a.start_date);
            const db = new Date(b.createdAt || b.start_date);
            return db - da;
        });

        return list;
    }, [reservations, filter, searchQuery]);

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

                    <Link
                        href="/halls"
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
                        رزرو جدید
                    </Link>
                </div>
            </motion.div>

            {/* ==================== آمار ==================== */}
            {!error && reservations.length > 0 && (
                <ReservationStats stats={stats} activeFilter={filter} onFilterChange={setFilter} />
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
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        {filtered.map((reservation, index) => (
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
        </div>
    );
}