// app/halls/page.js
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PiBuildings,
  PiWarningCircle,
  PiArrowClockwise,
  PiCaretLeft,
  PiCaretRight,
  PiCaretDoubleLeft,
  PiCaretDoubleRight,
} from "react-icons/pi";
import { useHalls } from "./hooks/useHalls";
import { useHallFilters } from "./hooks/useHallFilters";
import { useFilterStore } from "./store/filterStore";
import SearchBar from "./components/SearchBar";
import FilterSidebar from "./components/FilterSidebar";
import ActiveFiltersBar from "./components/ActiveFiltersBar";
import SortDropdown from "./components/SortDropdown";
import HallCard from "./components/HallCard";
import SkeletonCard from "./components/SkeletonCard";

const PER_PAGE = 9;

/* ============================================================
   EmptyState
   ============================================================ */
function EmptyState({ activeCount, onReset }) {
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
        تالاری یافت نشد
      </h3>
      <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-7">
        با فیلترهای انتخابی تالایی پیدا نشد. می‌توانید فیلترها را تغییر دهید یا
        همه را پاک کنید.
      </p>

      {activeCount > 0 && (
        <button
          onClick={onReset}
          className="
            relative inline-flex items-center gap-2
            px-6 py-3 rounded-xl
            text-sm font-bold text-white
            bg-gradient-to-b from-gold-400 to-gold-600
            hover:from-gold-500 hover:to-gold-700
            shadow-md shadow-gold-500/25
            hover:shadow-lg hover:shadow-gold-500/40
            hover:-translate-y-0.5
            focus:outline-none focus:ring-4 focus:ring-gold-500/25
            transition-all duration-300
          "
        >
          <PiArrowClockwise className="w-4 h-4" />
          پاک کردن فیلترها
        </button>
      )}

      <p className="relative text-[11px] text-slate-400 mt-5">
        یا فیلترها را تغییر دهید تا نتایج بیشتری ببینید
      </p>
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
        خطا در بارگذاری اطلاعات
      </h3>
      <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-7">
        {message ||
          "متأسفانه در دریافت اطلاعات مشکلی پیش آمد. لطفاً دوباره تلاش کنید."}
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
          focus:outline-none focus:ring-4 focus:ring-gold-500/25
          transition-all duration-300
        "
      >
        <PiArrowClockwise className="w-4 h-4" />
        تلاش مجدد
      </button>

      <p className="relative text-[11px] text-slate-400 mt-5">
        اگر مشکل ادامه داشت، با پشتیبانی تماس بگیرید
      </p>
    </motion.div>
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

    // همیشه صفحه اول و آخر
    pages.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    // تنظیم بازه برای دیدن همیشه ۳ عدد میانی
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

  /* ============================================================
     دکمه‌ی ناوبری (کامپوننت داخلی)
     ============================================================ */
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
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 disabled:hover:text-slate-600
        focus:outline-none focus:ring-4 focus:ring-gold-500/15
        active:scale-95
        transition-all duration-200
      "
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  /* ============================================================
     دکمه‌ی شماره صفحه
     ============================================================ */
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
        ${active
          ? "bg-gradient-to-b from-gold-400 to-gold-600 text-white shadow-md shadow-gold-500/25 hover:shadow-lg hover:shadow-gold-500/40"
          : "bg-white border border-slate-200 text-slate-600 hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50/40"
        }
      `}
    >
      {page.toLocaleString("fa-IR")}
    </button>
  );

  /* ============================================================
     Ellipsis
     ============================================================ */
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
      className="mt-8 sm:mt-10 flex flex-col items-center gap-3"
    >
      {/* کانتینر دکمه‌ها */}
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

        {/* جداکننده */}
        <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

        {/* شماره‌ها */}
        {pageNumbers.map((p) => {
          if (typeof p === "string") {
            return <Ellipsis key={p} />;
          }
          return (
            <PageButton key={p} page={p} active={p === currentPage} />
          );
        })}

        {/* جداکننده */}
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

      {/* متن زیر */}
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
   Page
   ============================================================ */
export default function HallsPage() {
  const { halls, loading, error, refresh } = useHalls();
  const { filters, sort, viewMode, getActiveFilterCount, resetFilters } =
    useFilterStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useHallFilters(halls, filters, sort);
  const activeCount = getActiveFilterCount();

  /* ============================================================
     Pagination logic
     ============================================================ */
  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;

  const paginatedHalls = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, currentPage]);

  /* اگر تعداد صفحات تغییر کرد و صفحه فعلی معتبر نبود → ریست */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  /* با تغییر فیلترها → برگرد به صفحه اول */
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sort]);

  /* با تغییر صفحه → اسکرول به بالا */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFCF9] via-[#FAF8F2] to-[#F7F3E8] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* ==================== هدر ==================== */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-50 border border-gold-100 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-[11px] font-medium text-gold-700">
              {loading
                ? "در حال بارگذاری..."
                : `${filtered.length.toLocaleString("fa-IR")} تالار فعال`}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">
            تالارهای{" "}
            <span className="bg-gradient-to-l from-gold-500 to-gold-700 bg-clip-text text-transparent">
              مراسم
            </span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            بهترین تالارهای عروسی، همایش و مراسم را با فیلترهای دقیق پیدا کنید
          </p>
        </motion.header>

        {/* ==================== جستجو ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mb-6"
        >
          <SearchBar
            onOpenFilters={() => setDrawerOpen(true)}
            activeFilterCount={activeCount}
          />
        </motion.div>

        {/* ==================== بدنه ==================== */}
        <div className="flex gap-5 lg:gap-7">
          {/* سایدبار فیلتر */}
          <FilterSidebar
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          />

          {/* محتوا */}
          <main className="flex-1 min-w-0">
            {/* نوار بالای نتایج */}
            <div className="flex items-center justify-between gap-4 mb-4 sm:mb-5 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">
                  {loading ? (
                    <span className="inline-flex items-center gap-2 text-slate-500">
                      <svg
                        className="w-3.5 h-3.5 animate-spin text-gold-500"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      در حال بارگذاری
                    </span>
                  ) : (
                    <>
                      <span className="text-slate-900 font-bold text-base">
                        {filtered.length.toLocaleString("fa-IR")}
                      </span>{" "}
                      <span className="text-slate-500">نتیجه</span>
                      {totalPages > 1 && (
                        <span className="text-slate-400 text-xs mr-2">
                          — صفحه {currentPage.toLocaleString("fa-IR")} از{" "}
                          {totalPages.toLocaleString("fa-IR")}
                        </span>
                      )}
                    </>
                  )}
                </span>
              </div>

              <SortDropdown />
            </div>

            {/* فیلترهای فعال */}
            <ActiveFiltersBar />

            {/* ==================== حالت خطا ==================== */}
            {error && !loading && (
              <ErrorState
                message={error?.response?.data?.message}
                onRetry={refresh}
              />
            )}

            {/* ==================== لودینگ ==================== */}
            {loading && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6"
                    : "space-y-4"
                }
              >
                {Array.from({
                  length: viewMode === "grid" ? 6 : 3,
                }).map((_, i) => (
                  <SkeletonCard key={i} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* ==================== خالی ==================== */}
            {!loading && !error && filtered.length === 0 && (
              <EmptyState activeCount={activeCount} onReset={resetFilters} />
            )}

            {/* ==================== نتایج ==================== */}
            {!loading && !error && filtered.length > 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6"
                      : "space-y-4"
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {paginatedHalls.map((hall, i) => (
                      <HallCard
                        key={hall._id}
                        hall={hall}
                        index={i}
                        viewMode={viewMode}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* ==================== صفحه‌بندی ==================== */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onChange={handlePageChange}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}