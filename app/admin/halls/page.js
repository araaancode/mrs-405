// app/admin/halls/page.jsx
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  PiBuildings,
  PiMapPin,
  PiUsersThree,
  PiUser,
  PiPhone,
  PiEye,
  PiTrash,
  PiPencilSimple,
  PiWarningCircle,
  PiCaretLeft,
  PiCaretRight,
  PiCaretDoubleLeft,
  PiCaretDoubleRight,
  PiMagnifyingGlass,
  PiX,
  PiCheckCircle,
  PiXCircle,
  PiBuildingsFill,
  PiCrownSimpleFill,
  PiProhibit,
} from "react-icons/pi";
import { notify } from "@/lib/toast";

/* ============================================================
   Helpers
   ============================================================ */
function faNum(n) {
  return Number(n || 0).toLocaleString("fa-IR");
}

/* ============================================================
   StatusBadge
   ============================================================ */
function StatusBadge({ active }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1 rounded-full
        text-[11px] font-bold ring-1
        ${
          active
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : "bg-rose-50 text-rose-700 ring-rose-200"
        }
      `}
    >
      <span
        className={`
          w-1.5 h-1.5 rounded-full animate-pulse
          ${active ? "bg-emerald-500" : "bg-rose-500"}
        `}
      />
      {active ? "فعال" : "غیرفعال"}
    </span>
  );
}

/* ============================================================
   HallsSkeleton
   ============================================================ */
function HallsSkeleton() {
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-slate-100 rounded-xl" />
        ))}
      </div>
      <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 bg-slate-100 rounded-xl" />
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
        {hasSearch ? "نتیجه‌ای یافت نشد" : "هنوز تالاری ثبت نشده"}
      </h3>
      <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-7">
        {hasSearch
          ? "می‌توانید جستجو را تغییر دهید یا پاک کنید."
          : "تالارهای جدید در اینجا نمایش داده می‌شوند."}
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
   HallCard — موبایل
   ============================================================ */
function HallCard({ hall, index }) {
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
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-mono text-slate-400">
              #{faNum(index)}
            </span>
          </div>
          <h3 className="text-[15px] font-bold text-slate-900 truncate flex items-center gap-1.5">
            <PiBuildingsFill className="w-4 h-4 text-gold-500 flex-shrink-0" />
            {hall.title || "بدون نام"}
          </h3>
        </div>
        <StatusBadge active={hall.is_active} />
      </div>

      {/* اطلاعات */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        {hall.hall_owner_name && (
          <div className="flex items-center gap-2 text-[12.5px] text-slate-600">
            <PiUser className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
            <span className="truncate">{hall.hall_owner_name}</span>
          </div>
        )}
        {hall.hall_owner_phone && (
          <div className="flex items-center gap-2 text-[12.5px] text-slate-600">
            <PiPhone className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
            <span dir="ltr">{hall.hall_owner_phone}</span>
          </div>
        )}
        {(hall.province || hall.city) && (
          <div className="flex items-center gap-2 text-[12.5px] text-slate-600">
            <PiMapPin className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
            <span className="truncate">
              {[hall.province, hall.city].filter(Boolean).join(" — ")}
            </span>
          </div>
        )}
        {hall.capacity && (
          <div className="flex items-center gap-2 text-[12.5px] text-slate-600">
            <PiUsersThree className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
            <span>ظرفیت: {faNum(hall.capacity)} نفر</span>
          </div>
        )}
      </div>

      {/* اکشن‌ها */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
        <Link
          href={`/admin/halls/${hall._id}/edit`}
          className="
            inline-flex items-center justify-center gap-1.5
            px-3 py-2 rounded-lg
            text-[11.5px] font-bold
            text-gold-700 bg-gold-50
            ring-1 ring-gold-100
            hover:bg-gold-100 hover:ring-gold-200
            active:scale-95
            transition-all duration-200
          "
        >
          <PiPencilSimple className="w-3.5 h-3.5" />
          ویرایش
        </Link>
        <button
          type="button"
          onClick={() => notify.warning("حذف تالار به‌زودی")}
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
   HallRow — دسکتاپ
   ============================================================ */
function HallRow({ hall, index, currentPage, itemsPerPage }) {
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
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2 min-w-0">
          <PiBuildingsFill className="w-4 h-4 text-gold-500 flex-shrink-0" />
          <p className="text-[13.5px] font-bold text-slate-800 truncate">
            {hall.title || "بدون نام"}
          </p>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2 text-[12.5px] text-slate-600">
          <PiUser className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
          <span className="truncate">{hall.hall_owner_name || "—"}</span>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2 text-[12.5px] text-slate-600">
          <PiPhone className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
          <span dir="ltr">{hall.hall_owner_phone || "—"}</span>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <StatusBadge active={hall.is_active} />
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <Link
            href={`/admin/halls/${hall._id}/edit`}
            aria-label="ویرایش"
            className="
              w-8 h-8 rounded-lg flex items-center justify-center
              text-gold-700 bg-gold-50 ring-1 ring-gold-100
              hover:bg-gold-100 hover:ring-gold-200
              active:scale-95
              transition-all duration-200
            "
          >
            <PiPencilSimple className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => notify.warning("حذف تالار به‌زودی")}
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
export default function AdminHallsPage() {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");

  /* ============================================================
     Load Halls
     ============================================================ */
  const loadHalls = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/halls", {
        withCredentials: true,
      });
      setHalls(res.data.halls || []);
    } catch (err) {
      console.error("Error:", err);
      const status = err.response?.status || 500;
      setError(status);

      if (status === 401) notify.error("لطفاً وارد حساب شوید");
      else if (status === 403) notify.error("شما دسترسی لازم را ندارید");
      else notify.error("خطا در دریافت تالارها");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHalls();
  }, [loadHalls]);

  /* ============================================================
     Filter + Search
     ============================================================ */
  const filteredHalls = useMemo(() => {
    let result =
      statusFilter === "all"
        ? halls
        : halls.filter((hall) => {
            if (statusFilter === "active") return hall.is_active === true;
            if (statusFilter === "inactive") return hall.is_active === false;
            return true;
          });

    if (searchTerm.trim() !== "") {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((hall) => {
        switch (searchField) {
          case "title":
            return hall.title?.toLowerCase().includes(term);
          case "owner":
            return (
              hall.hall_owner_name?.toLowerCase().includes(term) ||
              hall.hall_owner_phone?.includes(term)
            );
          case "location":
            return `${hall.province || ""} ${hall.city || ""}`
              .toLowerCase()
              .includes(term);
          case "phone":
            return hall.hall_owner_phone?.includes(term);
          default:
            return (
              hall.title?.toLowerCase().includes(term) ||
              hall.hall_owner_name?.toLowerCase().includes(term) ||
              hall.hall_owner_phone?.includes(term) ||
              `${hall.province || ""} ${hall.city || ""}`
                .toLowerCase()
                .includes(term) ||
              hall.capacity?.toString().includes(term)
            );
        }
      });
    }

    return result;
  }, [halls, statusFilter, searchTerm, searchField]);

  /* ============================================================
     Pagination
     ============================================================ */
  const totalPages = Math.ceil(filteredHalls.length / itemsPerPage) || 1;

  const paginatedHalls = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredHalls.slice(start, start + itemsPerPage);
  }, [filteredHalls, currentPage, itemsPerPage]);

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
        <HallsSkeleton />
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
          onClick={loadHalls}
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
    { key: "active", label: "فعال", icon: PiCheckCircle },
    { key: "inactive", label: "غیرفعال", icon: PiXCircle },
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
                مدیریت تالارها
              </h1>
              {halls.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-[28px] h-[24px] px-2 rounded-full bg-gold-50 text-gold-700 text-[11px] font-bold ring-1 ring-gold-100">
                  {faNum(halls.length)}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              مدیریت و بررسی تمام تالارهای ثبت‌شده در سیستم
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
            const Icon = btn.icon;
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
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {btn.label}
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
              placeholder="جستجو در تالارها..."
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
            <option value="all">همه فیلدها</option>
            <option value="title">نام تالار</option>
            <option value="owner">مدیر تالار</option>
            <option value="location">موقعیت</option>
            <option value="phone">تلفن</option>
          </select>
        </div>
      </motion.div>

      {/* ==================== Content ==================== */}
      {filteredHalls.length === 0 ? (
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
                  {faNum(filteredHalls.length)} نتیجه
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
                  Math.min(currentPage * itemsPerPage, filteredHalls.length)
                )}
              </span>{" "}
              از{" "}
              <span className="font-bold text-slate-700">
                {faNum(filteredHalls.length)}
              </span>{" "}
              تالار
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl ring-1 ring-slate-100 shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-slate-50/60 border-b border-slate-100">
                  <tr>
                    <th className="text-right px-4 py-3.5 text-[12px] font-bold text-slate-600 whitespace-nowrap">
                      ردیف
                    </th>
                    <th className="text-right px-4 py-3.5 text-[12px] font-bold text-slate-600 whitespace-nowrap">
                      نام تالار
                    </th>
                    <th className="text-right px-4 py-3.5 text-[12px] font-bold text-slate-600 whitespace-nowrap">
                      مدیر تالار
                    </th>
                    <th className="text-right px-4 py-3.5 text-[12px] font-bold text-slate-600 whitespace-nowrap">
                      تلفن
                    </th>
                    <th className="text-right px-4 py-3.5 text-[12px] font-bold text-slate-600 whitespace-nowrap">
                      وضعیت
                    </th>
                    <th className="text-right px-4 py-3.5 text-[12px] font-bold text-slate-600 whitespace-nowrap">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paginatedHalls.map((hall, index) => (
                      <HallRow
                        key={hall._id}
                        hall={hall}
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
          <div className="md:hidden space-y-3">
            <AnimatePresence>
              {paginatedHalls.map((hall, index) => (
                <HallCard
                  key={hall._id}
                  hall={hall}
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