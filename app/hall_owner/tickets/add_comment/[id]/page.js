// app/hall_owner/tickets/add_comment/[id]/page.jsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  PiTicket,
  PiArrowLeft,
  PiPaperPlaneTilt,
  PiClock,
  PiCheckCircle,
  PiWarningCircle,
  PiCalendarBlank,
  PiChatCircleDots,
  PiUser,
  PiHeadset,
  PiSpinnerGap,
  PiNote,
  PiXCircle,
  PiCopySimple,
  PiCheck,
} from "react-icons/pi";
import { notify } from "@/lib/toast";

/* ============================================================
   Helpers — فرمت تاریخ
   ============================================================ */
function parseDate(value) {
  if (!value) return null;
  try {
    let date;
    if (value && typeof value === "object" && value.$date) {
      date = new Date(value.$date);
    } else if (value && typeof value === "object" && value.timestamp) {
      date = new Date(value.timestamp);
    } else {
      date = new Date(value);
    }
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

function formatDateTime(value) {
  const d = parseDate(value);
  return d ? d.toLocaleString("fa-IR") : "—";
}

function formatTime(value) {
  const d = parseDate(value);
  return d
    ? d.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
    : "—";
}

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
   MessageBubble
   ============================================================ */
function MessageBubble({ isUser, text, time, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      className={`flex ${isUser ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`
          max-w-[90%] sm:max-w-[78%]
          rounded-2xl p-3.5 sm:p-4
          shadow-sm
          ${
            isUser
              ? "bg-gradient-to-br from-gold-400 to-gold-600 text-white rounded-tr-sm"
              : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm"
          }
        `}
      >
        {/* هدر */}
        <div
          className={`
            flex items-center justify-between gap-3 mb-1.5
            ${isUser ? "text-white/85" : "text-slate-400"}
          `}
        >
          <div className="flex items-center gap-1.5">
            {isUser ? (
              <>
                <PiUser className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">شما</span>
              </>
            ) : (
              <>
                <PiHeadset className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">پشتیبانی</span>
              </>
            )}
          </div>
          <span className="text-[10px] opacity-80">{time}</span>
        </div>

        {/* متن */}
        <p
          className={`
            text-[13px] leading-relaxed whitespace-pre-line break-words
            ${isUser ? "text-white" : "text-slate-700"}
          `}
        >
          {text}
        </p>
      </div>
    </motion.div>
  );
}

/* ============================================================
   Loading Skeleton
   ============================================================ */
function TicketSkeleton() {
  return (
    <div dir="rtl" className="w-full animate-pulse space-y-5">
      {/* هدر */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100" />
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-100 rounded-lg" />
          <div className="h-3.5 w-64 bg-slate-100 rounded-md" />
        </div>
      </div>

      {/* کارت */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 space-y-4">
        <div className="h-6 w-2/3 bg-slate-100 rounded-lg" />
        <div className="h-32 bg-slate-100 rounded-xl" />
        <div className="space-y-2">
          <div className="h-14 bg-slate-100 rounded-xl" />
          <div className="h-14 bg-slate-100 rounded-xl mr-auto w-2/3" />
        </div>
        <div className="h-11 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

/* ============================================================
   Page
   ============================================================ */
export default function HallOwnerTicketDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef(null);

  /* ============================================================
     Fetch Ticket
     ============================================================ */
  const fetchTicket = useCallback(async () => {
    try {
      const res = await axios.get(`/api/hall_owner/tickets/${id}`);
      setTicket(res.data);
    } catch (err) {
      console.error("خطا در دریافت جزئیات تیکت", err);
      notify.error("خطا در بارگذاری جزئیات تیکت");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ticket]);

  /* ============================================================
     Copy Ticket ID
     ============================================================ */
  const ticketId = ticket?._id?.$oid || ticket?._id || "";

  const handleCopyId = async () => {
    if (!ticketId) return;
    try {
      await navigator.clipboard.writeText(ticketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silent */
    }
  };

  /* ============================================================
     Send Message
     ============================================================ */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const toastId = toast.loading("در حال ارسال پیام...");

    try {
      await axios.post(`/api/hall_owner/tickets/${id}`, {
        text: newMessage,
      });

      setNewMessage("");
      toast.update(toastId, {
        render: "پیام با موفقیت ارسال شد",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });

      fetchTicket();
    } catch (err) {
      toast.update(toastId, {
        render: err.response?.data?.message || "خطا در ارسال پیام",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
    } finally {
      setSending(false);
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
     Not Found
     ============================================================ */
  if (!ticket) {
    return (
      <div dir="rtl" className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-rose-50 to-rose-100/60 flex items-center justify-center ring-1 ring-rose-100">
          <PiWarningCircle className="w-10 h-10 text-rose-500" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
          تیکت یافت نشد
        </h3>
        <p className="text-slate-500 text-sm mb-6">
          تیکت مورد نظر وجود ندارد یا حذف شده است
        </p>
        <Link
          href="/hall_owner/tickets"
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
          <PiArrowLeft className="w-4 h-4" />
          بازگشت به لیست تیکت‌ها
        </Link>
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
        <div className="flex items-start gap-3 flex-wrap">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25 flex-shrink-0">
            <PiTicket className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                جزئیات تیکت
              </h1>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <PiCalendarBlank className="w-3.5 h-3.5 text-gold-500" />
                {formatDateTime(ticket.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <PiChatCircleDots className="w-3.5 h-3.5 text-gold-500" />
                {(ticket.messages?.length || 0).toLocaleString("fa-IR")} پیام
              </span>

              {/* شناسه با کپی */}
              <button
                type="button"
                onClick={handleCopyId}
                aria-label="کپی شناسه تیکت"
                className="
                  inline-flex items-center gap-1.5
                  px-2 py-1 rounded-md
                  text-[10.5px] text-slate-400
                  hover:text-gold-600 hover:bg-gold-50
                  active:scale-95
                  transition-all
                  font-mono
                "
              >
                {copied ? (
                  <>
                    <PiCheck className="w-3 h-3" strokeWidth={3} />
                    کپی شد
                  </>
                ) : (
                  <>
                    <PiCopySimple className="w-3 h-3" />
                    #{ticketId.slice(-8).toUpperCase()}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ==================== کارت تیکت ==================== */}
      <div
        className="
          bg-white rounded-2xl
          ring-1 ring-slate-100
          shadow-[0_1px_2px_rgba(15,23,42,0.04)]
          overflow-hidden
        "
      >
        {/* ---------- هدر تیکت ---------- */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-l from-gold-50/40 via-white to-white">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight break-words">
            {ticket.subject}
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 inline-flex items-center gap-1.5">
            <PiCalendarBlank className="w-3.5 h-3.5" />
            تاریخ ایجاد: {formatDateTime(ticket.createdAt)}
          </p>
        </div>

        {/* ---------- بخش پیام‌ها ---------- */}
        <div
          className="
            p-4 sm:p-5
            bg-gradient-to-br from-slate-50/60 to-white
            min-h-[300px] sm:min-h-[420px]
            max-h-[500px] sm:max-h-[600px]
            overflow-y-auto
            scrollbar-thin
          "
        >
          <div className="space-y-4">
            {/* توضیحات اولیه */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-start"
            >
              <div className="max-w-[90%] sm:max-w-[78%] rounded-2xl rounded-tr-sm p-3.5 sm:p-4 bg-slate-100 border border-slate-200 text-slate-700 shadow-sm">
                <div className="flex items-center gap-1.5 mb-1.5 text-slate-500">
                  <PiNote className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">توضیحات اولیه</span>
                </div>
                <p className="text-[13px] leading-relaxed whitespace-pre-line break-words">
                  {ticket.description}
                </p>
              </div>
            </motion.div>

            {/* جداکننده */}
            {ticket.messages?.length > 0 && (
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[10px] text-slate-400 font-medium">
                  گفتگو
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
            )}

            {/* پیام‌ها */}
            <AnimatePresence>
              {ticket.messages?.map((msg, index) => {
                const isUserMessage =
                  msg.senderId?.$oid === ticket.reporterId?.$oid ||
                  msg.senderId === ticket.reporterId;
                const messageText = msg.text || msg.content || "";
                const messageTime = formatTime(
                  msg.timestamp || msg.createdAt || msg.updatedAt
                );

                return (
                  <MessageBubble
                    key={index}
                    isUser={isUserMessage}
                    text={messageText}
                    time={messageTime}
                    index={index}
                  />
                );
              })}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ---------- فرم ارسال پیام ---------- */}
        {ticket.status !== "closed" ? (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-white">
            <form
              onSubmit={handleSendMessage}
              className="flex flex-col sm:flex-row gap-2.5"
            >
              <div className="flex-1 relative group">
                <PiChatCircleDots
                  className="
                    absolute right-3.5 top-1/2 -translate-y-1/2
                    w-4 h-4 text-slate-400
                    group-focus-within:text-gold-500
                    transition-colors duration-200
                    pointer-events-none
                  "
                />
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="پیام خود را بنویسید..."
                  aria-label="متن پیام"
                  className="
                    w-full pr-11 pl-3.5 py-3
                    bg-white border border-slate-200
                    rounded-xl
                    text-sm text-slate-900
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
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="
                  w-full sm:w-auto
                  inline-flex items-center justify-center gap-2
                  px-5 py-3 rounded-xl
                  text-sm font-bold text-white
                  bg-gradient-to-b from-gold-400 to-gold-600
                  hover:from-gold-500 hover:to-gold-700
                  shadow-md shadow-gold-500/25
                  hover:shadow-lg hover:shadow-gold-500/40
                  hover:-translate-y-0.5
                  focus:outline-none focus:ring-4 focus:ring-gold-500/25
                  disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:hover:translate-y-0
                  active:scale-95
                  transition-all duration-200
                  min-w-[120px]
                "
              >
                {sending ? (
                  <>
                    <PiSpinnerGap className="w-4 h-4 animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <PiPaperPlaneTilt className="w-4 h-4" />
                    ارسال
                  </>
                )}
              </button>
            </form>

            <p className="text-[11px] text-slate-400 mt-3 text-center">
              پیام شما توسط تیم پشتیبانی بررسی خواهد شد
            </p>
          </div>
        ) : (
          <div className="p-5 border-t border-slate-100 bg-slate-50/60 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 text-[12.5px]">
              <PiCheckCircle className="w-4 h-4 text-slate-400" />
              این تیکت بسته شده است و امکان ارسال پیام جدید وجود ندارد
            </div>
          </div>
        )}
      </div>

      {/* ==================== دکمه بازگشت ==================== */}
      <div className="mt-5">
        <button
          type="button"
          onClick={() => router.back()}
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
          <PiArrowLeft className="w-4 h-4" />
          بازگشت به لیست تیکت‌ها
        </button>
      </div>
    </div>
  );
}