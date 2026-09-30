// app/hall_owner/halls/page.jsx
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  PiPencilSimple,
  PiTrash,
  PiMapPin,
  PiUsersThree,
  PiRuler,
  PiBuildings,
  PiPlusCircle,
  PiSpinnerGap,
  PiWarningCircle,
  PiSparkle,
  PiImage,
  PiCarProfile,
  PiCaretLeft,
  PiCaretRight,
  PiCaretDoubleLeft,
  PiCaretDoubleRight,
  PiCalendarBlank,
} from "react-icons/pi";
import { notify } from "@/lib/toast";

/* ============================================================
   Constants
   ============================================================ */
const PER_PAGE = 6;

/* ============================================================
   Helpers
   ============================================================ */
function normalizeImageUrl(url, fallback = "/images/placeholder-hall.jpg") {
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
    return trimmed;
  if (trimmed.startsWith("data:")) return trimmed;
  if (trimmed.startsWith("./")) return "/" + trimmed.slice(2);
  if (!trimmed.startsWith("/")) return "/" + trimmed;
  return trimmed;
}

const faNum = (n) => Number(n || 0).toLocaleString("fa-IR");

/* ============================================================
   HallRowSkeleton
   ============================================================ */
function HallRowSkeleton() {
  return (
    <div
      className="
        bg-white rounded-2xl
        ring-1 ring-slate-100
        overflow-hidden
        animate-pulse
        flex flex-col md:flex-row
      "
    >
      <div className="w-full md:w-64 lg:w-72 h-48 md:h-auto bg-slate-100 flex-shrink-0" />
      <div className="flex-1 p-5 space-y-3">
        <div className="h-6 w-2/3 bg-slate-100 rounded-lg" />
        <div className="h-3.5 w-1/3 bg-slate-100 rounded-md" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-24 bg-slate-100 rounded-lg" />
          <div className="h-6 w-20 bg-slate-100 rounded-lg" />
          <div className="h-6 w-16 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-md mt-3" />
        <div className="h-3 w-5/6 bg-slate-100 rounded-md" />
        <div className="flex gap-2 pt-4 border-t border-slate-100 mt-4">
          <div className="h-9 w-24 bg-slate-100 rounded-lg" />
          <div className="h-9 w-24 bg-slate-100 rounded-lg" />
        </div>
      </div>
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
        <PiBuildings className="relative w-10 h-10 text-gold-500" />
      </div>

      <h3 className="relative text-lg sm:text-xl font-bold text-slate-900 mb-2">
        هنوز تالاری ثبت نکرده‌اید
      </h3>
      <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-7">
        برای شروع، اولین تالار خود را ایجاد کنید و کسب‌وکارتان را آغاز کنید
      </p>

      <Link
        href="/hall_owner/halls/create"
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
        ایجاد تالار جدید
      </Link>
    </motion.div>
  );
}

/* ============================================================
   HallRow — کارت تک‌سطری
   ============================================================ */
function HallRow({ hall, index, onDelete, isDeleting }) {
  const coverImage = (Array.isArray(hall.images) && hall.images[0]) || null;
  const imageUrl = coverImage ? normalizeImageUrl(coverImage) : null;
  const updateUrl = `/hall_owner/halls/update_hall/${hall._id}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      className="
        group bg-white rounded-2xl
        ring-1 ring-slate-100 hover:ring-gold-200/70
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        hover:shadow-[0_12px_32px_-12px_rgba(198,161,76,0.18)]
        transition-all duration-300
        overflow-hidden
        flex flex-col md:flex-row
      "
    >
      {/* ==================== تصویر ==================== */}
      <Link
        href={updateUrl}
        className="
          relative w-full md:w-64 lg:w-72
          h-48 md:h-auto flex-shrink-0
          overflow-hidden bg-slate-100
          block
        "
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={hall.title}
            className="
              absolute inset-0 w-full h-full object-cover
              transition-transform duration-700
              group-hover:scale-105
            "
            loading={index < 3 ? "eager" : "lazy"}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/placeholder-hall.jpg";
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
            <PiImage className="w-10 h-10 mb-2" />
            <span className="text-[11px]">بدون تصویر</span>
          </div>
        )}

        {/* گرادیانت */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* نشان سانس */}
        {hall.has_sans && (
          <div className="absolute top-3 right-3">
            <span
              className="
                inline-flex items-center gap-1
                px-2.5 py-1 rounded-full
                bg-gradient-to-l from-gold-400 to-gold-600
                text-white text-[10px] font-bold
                shadow-lg shadow-gold-500/40
              "
            >
              <PiSparkle className="w-3 h-3" />
              دارای سانس
            </span>
          </div>
        )}
      </Link>

      {/* ==================== محتوا ==================== */}
      <div className="flex-1 p-5 min-w-0 flex flex-col">
        {/* ردیف بالا: عنوان + موقعیت */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <Link href={updateUrl}>
              <h3 className="text-base sm:text-[17px] font-bold text-slate-900 group-hover:text-gold-700 transition-colors line-clamp-1">
                {hall.title}
              </h3>
            </Link>

            <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500 mt-1.5">
              <PiMapPin className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
              <span className="line-clamp-1">
                {hall.city} — {hall.province}
              </span>
            </div>
          </div>
        </div>

        {/* آمار به‌صورت چیپ */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span
            className="
              inline-flex items-center gap-1.5
              px-2.5 py-1 rounded-lg
              bg-slate-50 text-slate-600
              text-[11px] font-medium
              ring-1 ring-slate-100
            "
          >
            <PiUsersThree className="w-3.5 h-3.5 text-gold-500" />
            ظرفیت: {faNum(hall.capacity)} نفر
          </span>

          <span
            className="
              inline-flex items-center gap-1.5
              px-2.5 py-1 rounded-lg
              bg-slate-50 text-slate-600
              text-[11px] font-medium
              ring-1 ring-slate-100
            "
          >
            <PiRuler className="w-3.5 h-3.5 text-gold-500" />
            متراژ: {faNum(hall.hall_measure)} متر
          </span>

          {hall.hall_type && (
            <span
              className="
                inline-flex items-center gap-1.5
                px-2.5 py-1 rounded-lg
                bg-slate-50 text-slate-600
                text-[11px] font-medium
                ring-1 ring-slate-100
              "
            >
              <PiBuildings className="w-3.5 h-3.5 text-gold-500" />
              {hall.hall_type}
            </span>
          )}

          {hall.parking_count && (
            <span
              className="
                inline-flex items-center gap-1.5
                px-2.5 py-1 rounded-lg
                bg-slate-50 text-slate-600
                text-[11px] font-medium
                ring-1 ring-slate-100
              "
            >
              <PiCarProfile className="w-3.5 h-3.5 text-gold-500" />
              پارکینگ: {hall.parking_count === "نامحدود" ? "نامحدود" : faNum(hall.parking_count)}
            </span>
          )}
        </div>

        {/* توضیحات */}
        {hall.description && (
          <p className="text-[12.5px] text-slate-500 leading-relaxed line-clamp-2 mb-3">
            {hall.description}
          </p>
        )}

        {/* ==================== پایین: اکشن‌ها ==================== */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          {/* شناسه */}
          <div className="text-[10.5px] text-slate-400">
            <span>شناسه: </span>
            <span className="font-mono font-bold text-slate-600">
              #{hall._id?.slice(-6).toUpperCase()}
            </span>
          </div>

          {/* دکمه‌ها */}
          <div className="flex items-center gap-2">
            <Link
              href={updateUrl}
              className="
                group/btn inline-flex items-center justify-center gap-1.5
                px-4 py-2 rounded-lg
                text-[11.5px] font-bold
                text-gold-700 bg-gold-50
                ring-1 ring-gold-100
                hover:bg-gold-500 hover:text-white hover:ring-gold-500
                hover:shadow-md hover:shadow-gold-500/30
                active:scale-95
                transition-all duration-200
              "
            >
              <PiPencilSimple className="w-3.5 h-3.5" />
              ویرایش
            </Link>

            <button
              type="button"
              onClick={() => onDelete(hall._id)}
              disabled={isDeleting}
              className="
                inline-flex items-center justify-center gap-1.5
                px-4 py-2 rounded-lg
                text-[11.5px] font-bold
                text-rose-600 bg-rose-50
                ring-1 ring-rose-100
                hover:bg-rose-500 hover:text-white hover:ring-rose-500
                hover:shadow-md hover:shadow-rose-500/30
                active:scale-95
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-200
              "
            >
              {isDeleting ? (
                <>
                  <PiSpinnerGap className="w-3.5 h-3.5 animate-spin" />
                  در حال حذف...
                </>
              ) : (
                <>
                  <PiTrash className="w-3.5 h-3.5" />
                  حذف
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ============================================================
   Pagination
   ============================================================ */
function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  /* ساخت لیست صفحات با ellipsis */
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

  /* دکمه ناوبری */
  const NavButton = ({ onClick, disabled, icon: Icon, label }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="
        w-10 h-10 rounded-xl
        flex items-center justify-center
        bg-white border border-slate-200
        text-slate-600
        hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50/40
        disabled:opacity-40 disabled:cursor-not-allowed
        disabled:hover:bg-white disabled:hover:border-slate-200 disabled:hover:text-slate-600
        focus:outline-none focus:ring-4 focus:ring-gold-500/15
        active:scale-95
        transition-all duration-200
      "
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  /* دکمه شماره */
  const PageButton = ({ page, active }) => (
    <button
      type="button"
      onClick={() => onChange(page)}
      aria-label={`رفتن به صفحه ${page}`}
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

  const Ellipsis = () => (
    <span className="w-10 h-10 flex items-center justify-center text-slate-400 select-none">
      …
    </span>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-8 flex flex-col items-center gap-3"
    >
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
        {/* ابتدا */}
        <NavButton
          onClick={() => onChange(1)}
          disabled={currentPage === 1}
          icon={PiCaretDoubleRight}
          label="صفحه اول"
        />

        {/* قبلی */}
        <NavButton
          onClick={() => onChange(currentPage - 1)}
          disabled={currentPage === 1}
          icon={PiCaretRight}
          label="صفحه قبلی"
        />

        <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

        {pageNumbers.map((p) => {
          if (typeof p === "string") return <Ellipsis key={p} />;
          return <PageButton key={p} page={p} active={p === currentPage} />;
        })}

        <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

        {/* بعدی */}
        <NavButton
          onClick={() => onChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          icon={PiCaretLeft}
          label="صفحه بعدی"
        />

        {/* انتها */}
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
   ConfirmDialog
   ============================================================ */
function ConfirmDialog({ isOpen, hallTitle, onConfirm, onCancel, isDeleting }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
            fixed inset-0 z-50
            bg-slate-950/60 backdrop-blur-sm
            flex items-center justify-center
            p-4
          "
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="
              bg-white rounded-2xl
              ring-1 ring-slate-100
              shadow-2xl
              p-6 w-full max-w-sm
              text-center
            "
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/60 flex items-center justify-center ring-1 ring-rose-100">
              <PiWarningCircle className="w-7 h-7 text-rose-500" />
            </div>

            <h3 className="text-[16px] font-bold text-slate-900 mb-2">
              حذف تالار
            </h3>
            <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
              آیا از حذف تالار{" "}
              <span className="font-bold text-slate-800">
                «{hallTitle}»
              </span>{" "}
              مطمئن هستید؟ این عملیات قابل بازگشت نیست.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={isDeleting}
                className="
                  inline-flex items-center justify-center gap-1.5
                  px-4 py-2.5 rounded-xl
                  text-[12.5px] font-medium
                  text-slate-700 bg-white
                  border border-slate-200
                  hover:bg-slate-50 hover:border-slate-300
                  active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                "
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="
                  inline-flex items-center justify-center gap-1.5
                  px-4 py-2.5 rounded-xl
                  text-[12.5px] font-bold text-white
                  bg-gradient-to-b from-rose-400 to-rose-600
                  hover:from-rose-500 hover:to-rose-700
                  shadow-md shadow-rose-500/25
                  hover:shadow-lg hover:shadow-rose-500/40
                  active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                "
              >
                {isDeleting ? (
                  <>
                    <PiSpinnerGap className="w-3.5 h-3.5 animate-spin" />
                    در حال حذف...
                  </>
                ) : (
                  <>
                    <PiTrash className="w-3.5 h-3.5" />
                    حذف کن
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   Page
   ============================================================ */
export default function HallsPage() {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmHall, setConfirmHall] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  /* ============================================================
     Fetch Halls
     ============================================================ */
  const getHalls = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/hall_owner/halls");
      if (data.success) {
        setHalls(data.halls);
      }
    } catch (error) {
      console.error(error);
      notify.error("خطا در دریافت تالارها");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getHalls();
  }, [getHalls]);

  /* ============================================================
     Pagination Logic
     ============================================================ */
  const totalPages = Math.ceil(halls.length / PER_PAGE) || 1;

  const paginatedHalls = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return halls.slice(start, start + PER_PAGE);
  }, [halls, currentPage]);

  /* اگر تعداد صفحات تغییر کرد و صفحه فعلی معتبر نبود → ریست */
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  /* با حذف آخرین تالار صفحه، برگرد به صفحه قبل */
  useEffect(() => {
    if (
      paginatedHalls.length === 0 &&
      currentPage > 1 &&
      halls.length > 0
    ) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [paginatedHalls.length, currentPage, halls.length]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* ============================================================
     Delete Hall
     ============================================================ */
  const openConfirm = (id) => {
    const hall = halls.find((h) => h._id === id);
    if (hall) setConfirmHall(hall);
  };

  const closeConfirm = () => {
    if (deletingId) return;
    setConfirmHall(null);
  };

  const handleConfirmDelete = async () => {
    if (!confirmHall) return;

    const id = confirmHall._id;
    setDeletingId(id);

    const toastId = toast.loading("در حال حذف تالار...");

    try {
      const response = await axios.delete(`/api/hall_owner/halls/${id}`);
      if (response.status === 200) {
        setHalls((prev) => prev.filter((h) => h._id !== id));
        toast.update(toastId, {
          render: "تالار با موفقیت حذف شد",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        setConfirmHall(null);
      }
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "خطا در حذف تالار",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
    } finally {
      setDeletingId(null);
    }
  };

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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25 flex-shrink-0">
              <PiBuildings className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  تالارهای من
                </h1>
                {halls.length > 0 && (
                  <span
                    className="
                      inline-flex items-center justify-center
                      min-w-[28px] h-[24px] px-2
                      rounded-full
                      bg-gold-50 text-gold-700
                      text-[11px] font-bold
                      ring-1 ring-gold-100
                    "
                  >
                    {halls.length.toLocaleString("fa-IR")}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                مدیریت و ویرایش تالارهای ثبت‌شده
              </p>
            </div>
          </div>

          <Link
            href="/hall_owner/halls/create"
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
            ایجاد تالار
          </Link>
        </div>
      </motion.div>

      {/* ==================== Content ==================== */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <HallRowSkeleton key={i} />
          ))}
        </div>
      ) : halls.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {paginatedHalls.map((hall, index) => (
                <HallRow
                  key={hall._id}
                  hall={hall}
                  index={index}
                  onDelete={openConfirm}
                  isDeleting={deletingId === hall._id}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* ==================== Pagination ==================== */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </>
      )}

      {/* ==================== Confirm Dialog ==================== */}
      <ConfirmDialog
        isOpen={!!confirmHall}
        hallTitle={confirmHall?.title}
        onConfirm={handleConfirmDelete}
        onCancel={closeConfirm}
        isDeleting={!!deletingId}
      />
    </div>
  );
}