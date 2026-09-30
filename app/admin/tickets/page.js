// app/admin/tickets/page.jsx
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  PiTicket,
  PiWarningCircle,
  PiClock,
  PiSpinnerGap,
  PiCheckCircle,
  PiXCircle,
  PiUser,
  PiHeadset,
  PiCalendarBlank,
  PiChatCircleDots,
  PiEnvelopeSimple,
  PiCaretLeft,
  PiCaretRight,
  PiCaretDoubleLeft,
  PiCaretDoubleRight,
  PiMagnifyingGlass,
  PiX,
  PiEye,
  PiUsersThree,
} from "react-icons/pi";
import { notify } from "@/lib/toast";

/* ============================================================
   Constants
   ============================================================ */
const STATUS_CONFIG = {
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
  pending: {
    label: "در انتظار",
    icon: PiClock,
    bg: "bg-gold-50",
    text: "text-gold-700",
    ring: "ring-gold-200",
    dot: "bg-gold-500",
  },
};

const PRIORITY_CONFIG = {
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

const SEARCH_FIELDS = [
  { value: "all", label: "همه فیلدها" },
  { value: "subject", label: "موضوع" },
  { value: "description", label: "توضیحات" },
  { value: "reporter", label: "ایجادکننده" },
];

/* ============================================================
   Helpers
   ============================================================ */
function getStatusConfig(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.open;
}

function getPriorityConfig(priority) {
  return PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
}

function faNum(n) {
  return Number(n || 0).toLocaleString("fa-IR");
}

function formatDateTime(value) {
  if (!value) return "—";
  try {
    const d = new Date(value);
    return isNaN(d.getTime()) ? "—" : d.toLocaleString("fa-IR");
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
   PriorityBadge
   ============================================================ */
function PriorityBadge({ priority }) {
  const config = getPriorityConfig(priority);
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
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

/* ============================================================
   TicketsSkeleton
   ============================================================ */
function TicketsSkeleton() {
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
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 space-y-3"
        >
          <div className="h-6 w-24 bg-slate-100 rounded-full" />
          <div className="h-5 w-2/3 bg-slate-100 rounded-lg" />
          <div className="h-3 w-full bg-slate-100 rounded-md" />
          <div className="h-3 w-5/6 bg-slate-100 rounded-md" />
        </div>
      ))}
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
        <PiTicket className="relative w-10 h-10 text-gold-500" />
      </div>

      <h3 className="relative text-lg sm:text-xl font-bold text-slate-900 mb-2">
        {hasSearch ? "نتیجه‌ای یافت نشد" : "هنوز تیکتی ثبت نشده"}
      </h3>
      <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-7">
        {hasSearch
          ? "می‌توانید جستجو را تغییر دهید یا پاک کنید."
          : "تیکت‌های کاربران و تالارداران در اینجا نمایش داده می‌شوند."}
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
   MessageItem
   ============================================================ */
function MessageItem({ message, index }) {
  const isAdmin = message.is_admin_reply;
  const senderName = message.senderId?.name || "ناشناس";
  const senderEmail = message.senderId?.email || "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className={`
        rounded-xl p-3.5
        ring-1
        ${
          isAdmin
            ? "bg-gold-50/60 ring-gold-100"
            : "bg-slate-50 ring-slate-100"
        }
      `}
    >
      {/* هدر */}
      <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`
              w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
              ${
                isAdmin
                  ? "bg-gold-100 text-gold-700"
                  : "bg-slate-100 text-slate-600"
              }
            `}
          >
            {isAdmin ? (
              <PiHeadset className="w-3.5 h-3.5" />
            ) : (
              <PiUser className="w-3.5 h-3.5" />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-[12.5px] font-bold text-slate-800 truncate">
              {senderName}
            </p>
            <p className="text-[10.5px] text-slate-400 truncate" dir="ltr">
              {senderEmail}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`
              text-[10px] font-bold px-2 py-0.5 rounded-full
              ${
                isAdmin
                  ? "bg-gold-100 text-gold-700"
                  : "bg-slate-100 text-slate-600"
              }
            `}
          >
            {isAdmin ? "پاسخ ادمین" : "پیام کاربر"}
          </span>
          <span className="text-[10.5px] text-slate-400">
            {formatDateTime(message.timestamp)}
          </span>
        </div>
      </div>

      {/* متن */}
      <p className="text-[12.5px] text-slate-700 leading-relaxed whitespace-pre-line break-words">
        {message.text}
      </p>
    </motion.div>
  );
}

/* ============================================================
   TicketCard
   ============================================================ */
function TicketCard({ ticket, index }) {
  const [expanded, setExpanded] = useState(false);

  const reporterName = ticket.reporterId?.name || "نامعلوم";
  const reporterEmail = ticket.reporterId?.email || "—";
  const assigneeName = ticket.assigneeId?.name || "تعیین نشده";

  const messageCount = ticket.messages?.length || 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="
        group bg-white rounded-2xl
        ring-1 ring-slate-100 hover:ring-gold-200/70
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        hover:shadow-[0_12px_32px_-12px_rgba(198,161,76,0.18)]
        transition-all duration-300
        overflow-hidden
      "
    >
      <div className="p-5">
        {/* ردیف بالا: badges */}
        <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            {messageCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 text-[10.5px] font-bold ring-1 ring-slate-100">
                <PiChatCircleDots className="w-3 h-3" />
                {faNum(messageCount)}
              </span>
            )}
            {ticket.has_new_reply && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-500 text-white text-[10.5px] font-bold">
                پاسخ جدید
              </span>
            )}
          </div>
          <span className="text-[10.5px] text-slate-400 font-mono">
            #{ticket._id?.slice(-6).toUpperCase()}
          </span>
        </div>

        {/* موضوع */}
        <h3 className="text-[15px] sm:text-[16px] font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-gold-700 transition-colors">
          {ticket.subject}
        </h3>

        {/* توضیحات */}
        <p className="text-[12.5px] text-slate-600 leading-relaxed line-clamp-2 mb-4">
          {ticket.description || "بدون توضیحات"}
        </p>

        {/* اطلاعات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-[11.5px] text-slate-600">
            <PiUser className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
            <span className="truncate">
              ایجادکننده: <strong className="text-slate-800">{reporterName}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11.5px] text-slate-600">
            <PiHeadset className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
            <span className="truncate">
              مسئول: <strong className="text-slate-800">{assigneeName}</strong>
            </span>
          </div>
        </div>

        {/* اکشن‌ها */}
        <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-100 flex-wrap">
          <div className="text-[10.5px] text-slate-400">
            <PiCalendarBlank className="inline w-3 h-3 ml-1" />
            {formatDateTime(ticket.createdAt)}
          </div>

          <div className="flex items-center gap-2">
            {messageCount > 0 && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="
                  inline-flex items-center gap-1.5
                  px-3 py-2 rounded-lg
                  text-[11.5px] font-medium
                  text-slate-600 bg-white
                  ring-1 ring-slate-200
                  hover:bg-slate-50 hover:ring-slate-300 hover:text-slate-800
                  active:scale-95
                  transition-all duration-200
                "
              >
                <PiChatCircleDots className="w-3.5 h-3.5" />
                {expanded ? "بستن پیام‌ها" : `مشاهده ${faNum(messageCount)} پیام`}
              </button>
            )}

            <Link
              href={`/admin/tickets/${ticket._id}`}
              className="
                inline-flex items-center gap-1.5
                px-3.5 py-2 rounded-lg
                text-[11.5px] font-bold text-white
                bg-gradient-to-b from-gold-400 to-gold-600
                hover:from-gold-500 hover:to-gold-700
                shadow-sm shadow-gold-500/25
                hover:shadow-md hover:shadow-gold-500/40
                active:scale-95
                transition-all duration-200
              "
            >
              <PiEye className="w-3.5 h-3.5" />
              مشاهده تیکت
            </Link>
          </div>
        </div>

        {/* پیام‌ها */}
        <AnimatePresence initial={false}>
          {expanded && messageCount > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
                {ticket.messages.map((msg, i) => (
                  <MessageItem key={i} message={msg} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

/* ============================================================
   Page
   ============================================================ */
export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");

  /* ============================================================
     Load Tickets
     ============================================================ */
  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/tickets", {
        withCredentials: true,
      });
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error("Error:", err);
      const status = err.response?.status || 500;
      setError(status);

      if (status === 401) notify.error("لطفاً وارد حساب شوید");
      else if (status === 403) notify.error("شما دسترسی لازم را ندارید");
      else notify.error("خطا در دریافت تیکت‌ها");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  /* ============================================================
     Filter + Search
     ============================================================ */
  const filteredTickets = useMemo(() => {
    let result = [...tickets];

    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }
    if (priorityFilter !== "all") {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((ticket) => {
        switch (searchField) {
          case "subject":
            return ticket.subject?.toLowerCase().includes(term);
          case "description":
            return ticket.description?.toLowerCase().includes(term);
          case "reporter":
            return (
              ticket.reporterId?.name?.toLowerCase().includes(term) ||
              ticket.reporterId?.email?.toLowerCase().includes(term)
            );
          default:
            return (
              ticket.subject?.toLowerCase().includes(term) ||
              ticket.description?.toLowerCase().includes(term) ||
              ticket.reporterId?.name?.toLowerCase().includes(term) ||
              ticket.reporterId?.email?.toLowerCase().includes(term)
            );
        }
      });
    }

    return result;
  }, [tickets, statusFilter, priorityFilter, searchTerm, searchField]);

  /* ============================================================
     Counts
     ============================================================ */
  const counts = useMemo(() => {
    return tickets.reduce(
      (acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      },
      { open: 0, in_progress: 0, closed: 0, pending: 0 }
    );
  }, [tickets]);

  /* ============================================================
     Pagination
     ============================================================ */
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;

  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(start, start + itemsPerPage);
  }, [filteredTickets, currentPage, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, priorityFilter, searchTerm, searchField, itemsPerPage]);

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
        <TicketsSkeleton />
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
          onClick={loadTickets}
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
    { key: "open", label: "باز", count: counts.open },
    { key: "in_progress", label: "در حال بررسی", count: counts.in_progress },
    { key: "closed", label: "بسته شده", count: counts.closed },
    { key: "pending", label: "در انتظار", count: counts.pending },
  ];

  const priorityButtons = [
    { key: "all", label: "همه" },
    { key: "high", label: "زیاد" },
    { key: "critical", label: "بحرانی" },
    { key: "medium", label: "متوسط" },
    { key: "low", label: "کم" },
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
            <PiTicket className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                تیکت‌های پشتیبانی
              </h1>
              {tickets.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-[28px] h-[24px] px-2 rounded-full bg-gold-50 text-gold-700 text-[11px] font-bold ring-1 ring-gold-100">
                  {faNum(tickets.length)}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              مشاهده و مدیریت تمام تیکت‌های کاربران و تالارداران
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
        {/* Status Tabs */}
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

        {/* Priority Tabs */}
        <div className="flex flex-wrap gap-2">
          {priorityButtons.map((btn) => {
            const isActive = priorityFilter === btn.key;
            return (
              <button
                key={btn.key}
                type="button"
                onClick={() => setPriorityFilter(btn.key)}
                aria-pressed={isActive}
                className={`
                  px-3 py-1.5 rounded-lg
                  text-[11.5px] font-medium
                  transition-all duration-200
                  active:scale-95
                  ${
                    isActive
                      ? "bg-gradient-to-b from-gold-400 to-gold-600 text-white shadow-sm shadow-gold-500/25"
                      : "bg-white border border-slate-200 text-slate-500 hover:border-gold-300 hover:text-gold-700"
                  }
                `}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <PiMagnifyingGlass className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در تیکت‌ها..."
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
      {filteredTickets.length === 0 ? (
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
                  {faNum(filteredTickets.length)} نتیجه
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
                  Math.min(currentPage * itemsPerPage, filteredTickets.length)
                )}
              </span>{" "}
              از{" "}
              <span className="font-bold text-slate-700">
                {faNum(filteredTickets.length)}
              </span>{" "}
              تیکت
            </p>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {paginatedTickets.map((ticket, index) => (
                <TicketCard key={ticket._id} ticket={ticket} index={index} />
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