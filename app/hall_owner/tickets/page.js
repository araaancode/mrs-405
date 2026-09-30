// app/hall_owner/tickets/page.jsx
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  PiTicket,
  PiPlusCircle,
  PiCalendarBlank,
  PiEye,
  PiChatCircleDots,
  PiWarningCircle,
  PiClock,
  PiCheckCircle,
  PiSpinnerGap,
  PiMagnifyingGlass,
  PiX,
  PiCaretLeft,
  PiCaretRight,
  PiCaretDoubleLeft,
  PiCaretDoubleRight,
} from "react-icons/pi";
import { notify } from "@/lib/toast";

/* ============================================================
   Constants
   ============================================================ */
const PER_PAGE = 6;

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
      icon: PiSpinnerGap,
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
  return (
    map[status] || {
      label: status || "نامشخص",
      icon: PiTicket,
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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-6 w-64 bg-slate-100 rounded-lg" />
            <div className="h-3.5 w-72 bg-slate-100 rounded-md" />
          </div>
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
   EmptyState
   ============================================================ */
function EmptyState({ filtered, onReset }) {
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
        {filtered ? "تیکتی با این فیلتر یافت نشد" : "هنوز تیکتی ثبت نکرده‌اید"}
      </h3>
      <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-7">
        {filtered
          ? "می‌توانید فیلترها را تغییر دهید یا همه را پاک کنید."
          : "برای ارتباط با تیم پشتیبانی، تیکت جدید ثبت کنید."}
      </p>

      <div className="relative flex flex-wrap items-center justify-center gap-3">
        {filtered && (
          <button
            type="button"
            onClick={onReset}
            className="
              inline-flex items-center gap-2
              px-5 py-2.5 rounded-xl
              text-sm font-medium text-slate-700
              bg-white border border-slate-200
              hover:bg-slate-50 hover:border-slate-300
              active:scale-95
              transition-all duration-200
            "
          >
            <PiX className="w-4 h-4" />
            پاک کردن فیلترها
          </button>
        )}

        <Link
          href="/hall_owner/tickets/create"
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
          ایجاد تیکت جدید
        </Link>
      </div>
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
            href={`/hall_owner/tickets/add_comment/${ticket._id}`}
            className="
              inline-flex items-center justify-center gap-1.5
              px-4 py-2 rounded-lg
              text-[11.5px] font-bold text-white
              bg-gradient-to-b from-gold-400 to-gold-600
              hover:from-gold-500 hover:to-gold-700
              shadow-sm shadow-gold-500/25
              hover:shadow-md hover:shadow-gold-500/40
              active:scale-95
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
   Page
   ============================================================ */
export default function HallOwnerTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* ============================================================
     Fetch Tickets
     ============================================================ */
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/hall_owner/tickets", {
        withCredentials: true,
      });
      setTickets(res.data || []);
    } catch (err) {
      console.error("خطا در دریافت تیکت‌ها", err);
      notify.error("خطا در بارگذاری تیکت‌ها");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  /* ============================================================
     Filtered List
     ============================================================ */
  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return tickets;
    const q = searchQuery.trim().toLowerCase();
    return tickets.filter(
      (t) =>
        t.subject?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
    );
  }, [tickets, searchQuery]);

  /* ============================================================
     Pagination Logic
     ============================================================ */
  const totalPages = Math.ceil(filteredTickets.length / PER_PAGE) || 1;

  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredTickets.slice(start, start + PER_PAGE);
  }, [filteredTickets, currentPage]);

  /* اگر تعداد صفحات تغییر کرد و صفحه فعلی معتبر نبود → ریست */
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  /* با تغییر جستجو → برگرد به صفحه اول */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  تیکت‌های پشتیبانی
                </h1>
                {tickets.length > 0 && (
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
                    {tickets.length.toLocaleString("fa-IR")}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                مشاهده و مدیریت تیکت‌های ثبت‌شده تالار
              </p>
            </div>
          </div>

          <Link
            href="/hall_owner/tickets/create"
            className="
              inline-flex items-center gap-2
              px-4 py-2.5 rounded-xl
              text-xs font-semibold text-white
              bg-gradient-to-b from-gold-400 to-gold-600
              hover:from-gold-500 hover:to-gold-700
              shadow-md shadow-gold-500/25
              hover:shadow-lg hover:shadow-gold-500/40
              hover:-translate-y-0.5
              active:scale-95
              transition-all duration-300
            "
          >
            <PiPlusCircle className="w-4 h-4" />
            تیکت جدید
          </Link>
        </div>
      </motion.div>

      {/* ==================== Search Bar ==================== */}
      {tickets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="relative mb-5"
        >
          <PiMagnifyingGlass className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در موضوع یا توضیحات تیکت..."
            aria-label="جستجو در تیکت‌ها"
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
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
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
        </motion.div>
      )}

      {/* ==================== Content ==================== */}
      <AnimatePresence mode="wait">
        {filteredTickets.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState
              filtered={searchQuery.trim().length > 0}
              onReset={() => setSearchQuery("")}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {paginatedTickets.map((ticket, index) => (
                  <TicketCard
                    key={ticket._id}
                    ticket={ticket}
                    index={index}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}