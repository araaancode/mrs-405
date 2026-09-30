// app/admin/reservations/halls/page.jsx
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  PiBuildings,
  PiUser,
  PiEnvelopeSimple,
  PiCalendarBlank,
  PiClock,
  PiUsersThree,
  PiCurrencyCircleDollar,
  PiPercent,
  PiCheckCircle,
  PiWarningCircle,
  PiXCircle,
  PiEye,
  PiTrash,
  PiCaretLeft,
  PiCaretRight,
  PiCaretDoubleLeft,
  PiCaretDoubleRight,
  PiMagnifyingGlass,
  PiX,
  PiHourglass,
} from "react-icons/pi";
import { notify } from "@/lib/toast";

/* ============================================================
   Constants
   ============================================================ */
const STATUS_CONFIG = {
  pending: {
    label: "در انتظار",
    icon: PiHourglass,
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    dot: "bg-amber-500",
  },
  confirmed: {
    label: "تایید شده",
    icon: PiCheckCircle,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    dot: "bg-emerald-500",
  },
  canceled: {
    label: "لغو شده",
    icon: PiXCircle,
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-200",
    dot: "bg-rose-500",
  },
  completed: {
    label: "تکمیل شده",
    icon: PiCheckCircle,
    bg: "bg-slate-50",
    text: "text-slate-600",
    ring: "ring-slate-200",
    dot: "bg-slate-500",
  },
};

const SEARCH_FIELDS = [
  { value: "all", label: "همه فیلدها" },
  { value: "hall", label: "نام تالار" },
  { value: "user", label: "نام کاربر" },
  { value: "email", label: "ایمیل" },
];

/* ============================================================
   Helpers
   ============================================================ */
function getStatusConfig(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.pending;
}

function faNum(n) {
  return Number(n || 0).toLocaleString("fa-IR");
}

function formatPrice(price) {
  if (!price) return "—";
  return faNum(price) + " تومان";
}

function formatDate(date) {
  if (!date) return "—";
  try {
    const d = new Date(date);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("fa-IR");
  } catch {
    return "—";
  }
}

/* ============================================================
   StatusBadge
   ============================================================ */
function StatusBadge({ status }) {
  const config = getStatusConfig(status);
  const Icon = config.icon;
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1 rounded-full
        text-[11px] font-bold ring-1
        ${config.bg} ${config.text} ${config.ring}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

/* ============================================================
   ReservationsSkeleton
   ============================================================ */
function ReservationsSkeleton() {
  return (
    <div className="w-full space-y-5 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl" />
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-100 rounded-lg" />
          <div className="h-3.5 w-72 bg-slate-100 rounded-md" />
        </div>
      </div>
      <div className="h-11 w-full bg-slate-100 rounded-xl" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 bg-slate-100 rounded-xl" />
        ))}
      </div>
      <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-slate-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   EmptyState
   ============================================================ */
function EmptyState({ hasSearch, onClear }) {
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
      <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-gold-50 to-gold-100/60 flex items-center justify-center ring-1 ring-gold-100">
        <div className="absolute inset-0 rounded-3xl bg-gold-500/5 blur-xl" />
        <PiBuildings className="relative w-10 h-10 text-gold-500" />
      </div>

      <h3 className="relative text-lg sm:text-xl font-bold text-slate-900 mb-2">
        {hasSearch ? "نتیجه‌ای یافت نشد" : "هنوز رزروی ثبت نشده"}
      </h3>
      <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-7">
        {hasSearch
          ? "می‌توانید جستجو را تغییر دهید یا پاک کنید."
          : "رزروهای تالار در اینجا نمایش داده می‌شوند."}
      </p>

      {hasSearch && (
        <button
          type="button"
          onClick={onClear}
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
          <PiX className="w-4 h-4" />
          پاک کردن جستجو
        </button>
      )}
    </motion.div>
  );
}

/* ============================================================
   Pagination
   ============================================================ */
function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      start = 2;
      end = 4;
    }
    if (currentPage >= totalPages - 2) {
      start = totalPages - 3;
      end = totalPages - 1;
    }

    if (start > 2) pages.push("start-ellipsis");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("end-ellipsis");

    pages.push(totalPages);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const NavButton = ({ onClick, disabled, icon: Icon, label }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="
        w-10 h-10 rounded-xl
        flex items-center justify-center
        bg-white border border-slate-200 text-slate-600
        hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50/40
        disabled:opacity-40 disabled:cursor-not-allowed
        disabled:hover:bg-white disabled:hover:border-slate-200
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-gold-500/15
        transition-all duration-200
      "
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  const PageButton = ({ page, active }) => (
    <button
      type="button"
      onClick={() => onChange(page)}
      aria-current={active ? "page" : undefined}
      className={`
        min-w-[40px] h-10 px-3 rounded-xl
        flex items-center justify-center
        text-[13px] font-bold
        transition-all duration-200
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-gold-500/15
        ${
          active
            ? "bg-gradient-to-b from-gold-400 to-gold-600 text-white shadow-md shadow-gold-500/25"
            : "bg-white border border-slate-200 text-slate-600 hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50/40"
        }
      `}
    >
      {page.toLocaleString("fa-IR")}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-5 flex flex-col items-center gap-3"
    >
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
        <NavButton
          onClick={() => onChange(1)}
          disabled={currentPage === 1}
          icon={PiCaretDoubleRight}
          label="صفحه اول"
        />
        <NavButton
          onClick={() => onChange(currentPage - 1)}
          disabled={currentPage === 1}
          icon={PiCaretRight}
          label="صفحه قبلی"
        />
        <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />
        {pageNumbers.map((p) => {
          if (typeof p === "string")
            return (
              <span
                key={p}
                className="w-10 h-10 flex items-center justify-center text-slate-400 select-none"
              >
                …
              </span>
            );
          return <PageButton key={p} page={p} active={p === currentPage} />;
        })}
        <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />
        <NavButton
          onClick={() => onChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          icon={PiCaretLeft}
          label="صفحه بعدی"
        />
        <NavButton
          onClick={() => onChange(totalPages)}
          disabled={currentPage === totalPages}
          icon={PiCaretDoubleLeft}
          label="صفحه آخر"
        />
      </div>
      <p className="text-[11px] text-slate-400">
        صفحه{" "}
        <span className="font-bold text-slate-600">
          {currentPage.toLocaleString("fa-IR")}
        </span>{" "}
        از{" "}
        <span className="font-bold text-slate-600">
          {totalPages.toLocaleString("fa-IR")}
        </span>
      </p>
    </motion.div>
  );
}

/* ============================================================
   ReservationCard — موبایل
   ============================================================ */
function ReservationCard({ reservation, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="
        group bg-white rounded-2xl
        ring-1 ring-slate-100 hover:ring-gold-200/70
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        hover:shadow-[0_12px_32px_-12px_rgba(198,161,76,0.18)]
        p-4
        transition-all duration-300
      "
    >
      {/* هدر */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-mono text-slate-400">
            #{faNum(index)}
          </span>
          <h3 className="text-[15px] font-bold text-slate-900 truncate mt-0.5">
            {reservation.hall_id?.title || "نامشخص"}
          </h3>
        </div>
        <StatusBadge status={reservation.status} />
      </div>

      {/* اطلاعات */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2 text-[12.5px] text-slate-600">
          <PiUser className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
          <span className="truncate">
            {reservation.user_id?.name || "کاربر نامشخص"}
          </span>
        </div>

        {reservation.user_id?.email && (
          <div className="flex items-center gap-2 text-[12.5px] text-slate-600">
            <PiEnvelopeSimple className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
            <span className="truncate" dir="ltr">
              {reservation.user_id.email}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-[12.5px] text-slate-600">
          <PiCalendarBlank className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
          <span>
            {formatDate(reservation.start_date)} تا{" "}
            {formatDate(reservation.end_date)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[12.5px] text-slate-600">
          <PiUsersThree className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
          <span>{faNum(reservation.guests_count)} نفر</span>
        </div>

        <div className="flex items-center gap-2 text-[12.5px] text-slate-800 font-bold">
          <PiCurrencyCircleDollar className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
          <span>{formatPrice(reservation.final_price)}</span>
        </div>

        {reservation.discount > 0 && (
          <div className="flex items-center gap-2 text-[11.5px] text-emerald-600">
            <PiPercent className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{faNum(reservation.discount)}٪ تخفیف</span>
          </div>
        )}
      </div>

      {/* اکشن‌ها */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
        <Link
          href={`/admin/reservations/halls/${reservation._id}`}
          className="
            inline-flex items-center justify-center gap-1.5
            px-3 py-2 rounded-lg
            text-[11.5px] font-bold
            text-slate-600 bg-white
            ring-1 ring-slate-200
            hover:bg-gold-50 hover:ring-gold-200 hover:text-gold-700
            active:scale-95
            transition-all duration-200
          "
        >
          <PiEye className="w-3.5 h-3.5" />
          مشاهده
        </Link>
        <button
          type="button"
          onClick={() => notify.warning("حذف رزرو به‌زودی")}
          className="
            inline-flex items-center justify-center gap-1.5
            px-3 py-2 rounded-lg
            text-[11.5px] font-bold
            text-rose-600 bg-rose-50
            ring-1 ring-rose-100
            hover:bg-rose-500 hover:text-white hover:ring-rose-500
            active:scale-95
            transition-all duration-200
          "
        >
          <PiTrash className="w-3.5 h-3.5" />
          حذف
        </button>
      </div>
    </motion.div>
  );
}

/* ============================================================
   ReservationRow — دسکتاپ
   ============================================================ */
function ReservationRow({ reservation, index, currentPage, itemsPerPage }) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, delay: index * 0.02 }}
      className="border-b border-slate-100 last:border-0 hover:bg-gold-50/30 transition-colors"
    >
      <td className="px-4 py-3.5 text-[12.5px] text-slate-400 font-mono">
        #{(currentPage - 1) * itemsPerPage + index + 1}
      </td>

      <td className="px-4 py-3.5 min-w-0">
        <p className="text-[13.5px] font-bold text-slate-800 truncate">
          {reservation.hall_id?.title || "نامشخص"}
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
          <PiUser className="w-3 h-3 text-gold-500 flex-shrink-0" />
          <span className="truncate">
            {reservation.user_id?.name || "کاربر نامشخص"}
          </span>
        </div>
        {reservation.user_id?.email && (
          <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400 mt-0.5">
            <PiEnvelopeSimple className="w-3 h-3 flex-shrink-0" />
            <span className="truncate" dir="ltr">
              {reservation.user_id.email}
            </span>
          </div>
        )}
      </td>

      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5 text-[12.5px] text-slate-600">
          <PiCalendarBlank className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
          <span>{formatDate(reservation.start_date)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11.5px] text-slate-400 mt-0.5">
          <PiClock className="w-3 h-3 flex-shrink-0" />
          <span>تا {formatDate(reservation.end_date)}</span>
        </div>
        {reservation.duration_days && (
          <p className="text-[10.5px] text-slate-400 mt-0.5">
            {faNum(reservation.duration_days)} روز
          </p>
        )}
      </td>

      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5 text-[12.5px] text-slate-600">
          <PiUsersThree className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
          <span>{faNum(reservation.guests_count)} نفر</span>
        </div>
      </td>

      <td className="px-4 py-3.5">
        <p className="text-[13px] font-bold text-slate-800">
          {formatPrice(reservation.final_price)}
        </p>
        {reservation.discount > 0 && (
          <p className="text-[11px] text-emerald-600 mt-0.5 inline-flex items-center gap-1">
            <PiPercent className="w-3 h-3" />
            {faNum(reservation.discount)}٪ تخفیف
          </p>
        )}
        {reservation.pre_payment > 0 && (
          <p className="text-[10.5px] text-slate-400 mt-0.5">
            پیش‌پرداخت: {formatPrice(reservation.pre_payment)}
          </p>
        )}
      </td>

      <td className="px-4 py-3.5">
        <StatusBadge status={reservation.status} />
        {reservation.is_confirmed_by_owner && (
          <p className="text-[10.5px] text-emerald-600 mt-1 inline-flex items-center gap-1">
            <PiCheckCircle className="w-3 h-3" />
            تایید مالک
          </p>
        )}
      </td>

      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <Link
            href={`/admin/reservations/halls/${reservation._id}`}
            aria-label="مشاهده"
            className="
              w-8 h-8 rounded-lg flex items-center justify-center
              text-slate-500 bg-white ring-1 ring-slate-200
              hover:bg-gold-50 hover:ring-gold-200 hover:text-gold-700
              active:scale-95
              transition-all duration-200
            "
          >
            <PiEye className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => notify.warning("حذف رزرو به‌زودی")}
            aria-label="حذف"
            className="
              w-8 h-8 rounded-lg flex items-center justify-center
              text-rose-600 bg-rose-50 ring-1 ring-rose-100
              hover:bg-rose-500 hover:text-white hover:ring-rose-500
              active:scale-95
              transition-all duration-200
            "
          >
            <PiTrash className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

/* ============================================================
   Page
   ============================================================ */
export default function AdminHallReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");

  /* ============================================================
     Load Reservations
     ============================================================ */
  const loadReservations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/reservations/halls", {
        withCredentials: true,
      });
      setReservations(res.data.reservations || []);
    } catch (err) {
      console.error("Error:", err);
      const status = err.response?.status || 500;
      setError(status);

      if (status === 401) notify.error("لطفاً وارد حساب شوید");
      else if (status === 403) notify.error("شما دسترسی لازم را ندارید");
      else notify.error("خطا در دریافت رزروها");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  /* ============================================================
     Counts
     ============================================================ */
  const counts = useMemo(() => {
    return reservations.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      },
      { pending: 0, confirmed: 0, canceled: 0, completed: 0 }
    );
  }, [reservations]);

  /* ============================================================
     Filter + Search
     ============================================================ */
  const filteredReservations = useMemo(() => {
    let result = [...reservations];

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((r) => {
        switch (searchField) {
          case "hall":
            return r.hall_id?.title?.toLowerCase().includes(term);
          case "user":
            return r.user_id?.name?.toLowerCase().includes(term);
          case "email":
            return r.user_id?.email?.toLowerCase().includes(term);
          default:
            return (
              r.hall_id?.title?.toLowerCase().includes(term) ||
              r.user_id?.name?.toLowerCase().includes(term) ||
              r.user_id?.email?.toLowerCase().includes(term)
            );
        }
      });
    }

    return result;
  }, [reservations, statusFilter, searchTerm, searchField]);

  /* ============================================================
     Pagination
     ============================================================ */
  const totalPages =
    Math.ceil(filteredReservations.length / itemsPerPage) || 1;

  const paginatedReservations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReservations.slice(start, start + itemsPerPage);
  }, [filteredReservations, currentPage, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm, searchField, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchField("all");
  };

  /* ============================================================
     Loading
     ============================================================ */
  if (loading) {
    return (
      <div dir="rtl" className="w-full">
        <ReservationsSkeleton />
      </div>
    );
  }

  /* ============================================================
     Error
     ============================================================ */
  if (error) {
    const message =
      error === 401
        ? "لطفاً وارد حساب شوید"
        : error === 403
        ? "شما دسترسی لازم را ندارید"
        : "خطا در دریافت اطلاعات";

    return (
      <div dir="rtl" className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-rose-50 to-rose-100/60 flex items-center justify-center ring-1 ring-rose-100">
          <PiWarningCircle className="w-10 h-10 text-rose-500" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
          {message}
        </h3>
        <p className="text-slate-500 text-sm mb-6">
          کد خطا: {error.toString()}
        </p>
        <button
          onClick={loadReservations}
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
          تلاش مجدد
        </button>
      </div>
    );
  }

  /* ============================================================
     Render
     ============================================================ */
  const statusButtons = [
    { key: "all", label: "همه" },
    { key: "pending", label: "در انتظار", count: counts.pending },
    { key: "confirmed", label: "تایید شده", count: counts.confirmed },
    { key: "canceled", label: "لغو شده", count: counts.canceled },
    { key: "completed", label: "تکمیل شده", count: counts.completed },
  ];

  return (
    <div dir="rtl" className="w-full">
      {/* ==================== Header ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25 flex-shrink-0">
            <PiBuildings className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                رزروهای تالار
              </h1>
              {reservations.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-[28px] h-[24px] px-2 rounded-full bg-gold-50 text-gold-700 text-[11px] font-bold ring-1 ring-gold-100">
                  {faNum(reservations.length)}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              مدیریت و بررسی تمام رزروهای تالارها
            </p>
          </div>
        </div>
      </motion.div>

      {/* ==================== Filters & Search ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="mb-5 space-y-4"
      >
        <div className="flex flex-wrap gap-2">
          {statusButtons.map((btn) => {
            const isActive = statusFilter === btn.key;
            return (
              <button
                key={btn.key}
                type="button"
                onClick={() => setStatusFilter(btn.key)}
                aria-pressed={isActive}
                className={`
                  inline-flex items-center gap-1.5
                  px-3.5 py-2 rounded-xl
                  text-[12.5px] font-medium
                  transition-all duration-200
                  active:scale-95
                  ${
                    isActive
                      ? "bg-gradient-to-b from-gold-400 to-gold-600 text-white shadow-md shadow-gold-500/25"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50/40"
                  }
                `}
              >
                {btn.label}
                {typeof btn.count === "number" && btn.count > 0 && (
                  <span
                    className={`
                      text-[10px] font-bold px-1.5 py-0.5 rounded-full
                      ${
                        isActive
                          ? "bg-white/25 text-white"
                          : "bg-slate-100 text-slate-600"
                      }
                    `}
                  >
                    {faNum(btn.count)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <PiMagnifyingGlass className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در رزروها..."
              aria-label="جستجو"
              className="
                w-full pr-11 pl-10 py-2.5
                bg-white border border-slate-200 rounded-xl
                text-sm text-slate-900
                placeholder:text-slate-400
                hover:border-gold-300
                focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10
                transition-all duration-200
              "
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="پاک کردن جستجو"
                className="
                  absolute left-3 top-1/2 -translate-y-1/2
                  w-6 h-6 rounded-full
                  flex items-center justify-center
                  text-slate-400 hover:text-gold-600 hover:bg-gold-50
                  active:scale-90 transition-all
                "
              >
                <PiX className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            )}
          </div>

          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="
              px-3.5 py-2.5 rounded-xl
              bg-white border border-slate-200
              text-[12.5px] text-slate-700
              cursor-pointer
              hover:border-gold-300
              focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10
              transition-all duration-200
            "
          >
            {SEARCH_FIELDS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* ==================== Content ==================== */}
      {filteredReservations.length === 0 ? (
        <EmptyState
          hasSearch={searchTerm.trim().length > 0}
          onClear={clearSearch}
        />
      ) : (
        <>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-[12.5px] text-slate-600">
              <span>نمایش</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="
                  px-2 py-1 rounded-lg
                  bg-white border border-slate-200
                  text-[12.5px] text-slate-700
                  cursor-pointer
                  hover:border-gold-300
                  focus:outline-none focus:border-gold-500
                "
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n.toLocaleString("fa-IR")}
                  </option>
                ))}
              </select>
              <span>ردیف</span>

              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-50 text-gold-700 text-[11px] font-bold ring-1 ring-gold-100">
                  {faNum(filteredReservations.length)} نتیجه
                </span>
              )}
            </div>

            <p className="text-[12.5px] text-slate-500">
              نمایش{" "}
              <span className="font-bold text-slate-700">
                {faNum((currentPage - 1) * itemsPerPage + 1)}
              </span>{" "}
              تا{" "}
              <span className="font-bold text-slate-700">
                {faNum(
                  Math.min(
                    currentPage * itemsPerPage,
                    filteredReservations.length
                  )
                )}
              </span>{" "}
              از{" "}
              <span className="font-bold text-slate-700">
                {faNum(filteredReservations.length)}
              </span>{" "}
              رزرو
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-2xl ring-1 ring-slate-100 shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-slate-50/60 border-b border-slate-100">
                  <tr>
                    {[
                      "ردیف",
                      "تالار / کاربر",
                      "تاریخ رزرو",
                      "مهمان‌ها",
                      "قیمت",
                      "وضعیت",
                      "عملیات",
                    ].map((title) => (
                      <th
                        key={title}
                        className="text-right px-4 py-3.5 text-[12px] font-bold text-slate-600 whitespace-nowrap"
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paginatedReservations.map((reservation, index) => (
                      <ReservationRow
                        key={reservation._id}
                        reservation={reservation}
                        index={index}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            <AnimatePresence>
              {paginatedReservations.map((reservation, index) => (
                <ReservationCard
                  key={reservation._id}
                  reservation={reservation}
                  index={(currentPage - 1) * itemsPerPage + index + 1}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}