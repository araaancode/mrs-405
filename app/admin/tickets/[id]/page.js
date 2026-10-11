// app/admin/tickets/[id]/page.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
    PiEnvelopeSimple,
    PiPhone,
    PiTag,
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

function faNum(n) {
    return Number(n || 0).toLocaleString("fa-IR");
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
            icon: PiTicket,
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

/* ============================================================
   StatusBadge / PriorityBadge
   ============================================================ */
function StatusBadge({ status }) {
    const info = getStatusInfo(status);
    const Icon = info.icon;
    return (
        <span
            className={`
                inline-flex items-center gap-1.5
                px-2.5 py-1 rounded-full
                text-[11px] font-bold ring-1
                ${info.bg} ${info.text} ${info.ring}
            `}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${info.dot} animate-pulse`} />
            <Icon className="w-3.5 h-3.5" />
            {info.label}
        </span>
    );
}

function PriorityBadge({ priority }) {
    const info = getPriorityInfo(priority);
    const Icon = info.icon;
    return (
        <span
            className={`
                inline-flex items-center gap-1.5
                px-2.5 py-1 rounded-full
                text-[11px] font-bold ring-1
                ${info.bg} ${info.text} ${info.ring}
            `}
        >
            <Icon className="w-3.5 h-3.5" />
            {info.label}
        </span>
    );
}

/* ============================================================
   MessageBubble — حباب پیام
   ============================================================ */
function MessageBubble({ message, index }) {
    const isAdmin = message.is_admin_reply;
    const sender = message.senderId || {};
    const senderName = sender.full_name || "ناشناس";
    const senderRole =
        sender.role === "hall_owner"
            ? "تالاردار"
            : sender.role === "admin"
            ? "پشتیبانی"
            : "کاربر";

    const text = message.text || message.content || "";
    const time = formatTime(message.timestamp || message.createdAt);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
            className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`
                    max-w-[90%] sm:max-w-[78%]
                    rounded-2xl p-3.5 sm:p-4
                    shadow-sm
                    ${
                        isAdmin
                            ? "bg-gradient-to-br from-gold-400 to-gold-600 text-white rounded-tr-sm"
                            : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm"
                    }
                `}
            >
                {/* هدر */}
                <div
                    className={`
                        flex items-center justify-between gap-3 mb-1.5 flex-wrap
                        ${isAdmin ? "text-white/85" : "text-slate-400"}
                    `}
                >
                    <div className="flex items-center gap-1.5 min-w-0">
                        {isAdmin ? (
                            <PiHeadset className="w-3.5 h-3.5 flex-shrink-0" />
                        ) : (
                            <PiUser className="w-3.5 h-3.5 flex-shrink-0" />
                        )}
                        <span className="text-[11px] font-bold truncate">
                            {isAdmin ? "پشتیبانی" : senderName}
                        </span>
                        {!isAdmin && (
                            <span
                                className={`
                                    text-[9.5px] font-bold px-1.5 py-0.5 rounded-full
                                    ${
                                        senderRole === "تالاردار"
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-slate-100 text-slate-600"
                                    }
                                `}
                            >
                                {senderRole}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] opacity-80 flex-shrink-0">
                        {time}
                    </span>
                </div>

                {/* متن */}
                <p
                    className={`
                        text-[13px] leading-relaxed whitespace-pre-line break-words
                        ${isAdmin ? "text-white" : "text-slate-700"}
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
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100" />
                <div className="space-y-2">
                    <div className="h-6 w-48 bg-slate-100 rounded-lg" />
                    <div className="h-3.5 w-64 bg-slate-100 rounded-md" />
                </div>
            </div>
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
export default function AdminTicketDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [ticket, setTicket] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    /* ============================================================
       Fetch Ticket
       ============================================================ */
    const fetchTicket = async () => {
        try {
            const res = await axios.get(`/api/admin/tickets/${id}`, {
                withCredentials: true,
            });
            setTicket(res.data);
            setNewStatus(res.data.status || "in_progress");
        } catch (err) {
            console.error("خطا در دریافت جزئیات تیکت", err);
            toast.error(
                err.response?.data?.message || "خطا در بارگذاری جزئیات تیکت",
                TOAST_OPTIONS
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTicket();
    }, [id]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [ticket]);

    /* ============================================================
       Send Reply
       ============================================================ */
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const payload = { text: newMessage.trim() };

            if (newStatus && newStatus !== ticket.status) {
                payload.status = newStatus;
            }

            await axios.post(`/api/admin/tickets/${id}`, payload, {
                withCredentials: true,
            });

            setNewMessage("");
            toast.success("پاسخ با موفقیت ثبت شد", TOAST_OPTIONS);

            fetchTicket();
        } catch (err) {
            console.error("خطا در ارسال پاسخ", err);
            toast.error(
                err.response?.data?.message || "خطا در ارسال پاسخ",
                TOAST_OPTIONS
            );
        } finally {
            setSending(false);
        }
    };

    /* ============================================================
       Change Status Only
       ============================================================ */
    const handleChangeStatus = async (status) => {
        try {
            await axios.patch(
                `/api/admin/tickets/${id}`,
                { status },
                { withCredentials: true }
            );
            setTicket((prev) => ({ ...prev, status }));
            setNewStatus(status);
            toast.success("وضعیت تیکت تغییر کرد", TOAST_OPTIONS);
        } catch (err) {
            console.error("خطا در تغییر وضعیت", err);
            toast.error(
                err.response?.data?.message || "خطا در تغییر وضعیت",
                TOAST_OPTIONS
            );
        }
    };

    /* ============================================================
       Loading / Not Found
       ============================================================ */
    if (loading) {
        return (
            <div dir="rtl" className="w-full">
                <TicketSkeleton />
            </div>
        );
    }

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
                    href="/admin/tickets"
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
    const reporter = ticket.reporterId || {};
    const isClosed = ticket.status === "closed";

    return (
        <div dir="rtl" className="w-full">
            {/*
                ⚠️ اگر ToastContainer را در app/admin/layout.js داری،
                این خط را حذف کن تا toastها دو بار نمایش داده نشوند.
            */}
            {/* <ToastContainer {...TOAST_OPTIONS} /> */}

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
                                جزئیات تیکت (ادمین)
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
                                {faNum(ticket.messages?.length || 0)} پیام
                            </span>
                            <span className="text-[10.5px] font-mono text-slate-400">
                                #{ticket._id?.slice(-6).toUpperCase()}
                            </span>
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
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight break-words mb-3">
                        {ticket.subject}
                    </h2>

                    <div className="flex items-center gap-2 flex-wrap text-[11.5px] text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                            <PiUser className="w-3.5 h-3.5 text-gold-500" />
                            <strong className="text-slate-800">
                                {reporter.full_name || "نامعلوم"}
                            </strong>
                        </span>

                        {reporter.email && (
                            <span className="inline-flex items-center gap-1.5">
                                <PiEnvelopeSimple className="w-3.5 h-3.5 text-slate-400" />
                                <span dir="ltr">{reporter.email}</span>
                            </span>
                        )}

                        {reporter.phone && (
                            <span className="inline-flex items-center gap-1.5">
                                <PiPhone className="w-3.5 h-3.5 text-slate-400" />
                                <span dir="ltr">{reporter.phone}</span>
                            </span>
                        )}

                        {reporter.role && (
                            <span
                                className={`
                                    px-2 py-0.5 rounded-full text-[10px] font-bold
                                    ${
                                        reporter.role === "hall_owner"
                                            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                                            : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
                                    }
                                `}
                            >
                                {reporter.role === "hall_owner"
                                    ? "تالاردار"
                                    : "کاربر عادی"}
                            </span>
                        )}
                    </div>
                </div>

                {/* ---------- نوار تغییر وضعیت ---------- */}
                <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-slate-600">
                            <PiTag className="w-3.5 h-3.5 text-gold-500" />
                            تغییر وضعیت:
                        </span>

                        {[
                            {
                                key: "open",
                                label: "باز",
                                cls: "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200",
                            },
                            {
                                key: "in_progress",
                                label: "در حال بررسی",
                                cls: "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200",
                            },
                            {
                                key: "answered",
                                label: "پاسخ داده شده",
                                cls: "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200",
                            },
                            {
                                key: "closed",
                                label: "بسته شده",
                                cls: "hover:bg-slate-100 hover:text-slate-700 hover:border-slate-300",
                            },
                        ].map((s) => {
                            const active = ticket.status === s.key;
                            return (
                                <button
                                    key={s.key}
                                    type="button"
                                    onClick={() => handleChangeStatus(s.key)}
                                    disabled={active}
                                    className={`
                                        inline-flex items-center gap-1
                                        px-2.5 py-1 rounded-lg
                                        text-[11px] font-bold
                                        ring-1 transition-all duration-200
                                        active:scale-95
                                        ${
                                            active
                                                ? "bg-gradient-to-b from-gold-400 to-gold-600 text-white ring-gold-500 shadow-sm shadow-gold-500/30 cursor-default"
                                                : `bg-white border border-slate-200 text-slate-600 ${s.cls}`
                                        }
                                    `}
                                >
                                    {active && (
                                        <PiCheckCircle className="w-3 h-3" />
                                    )}
                                    {s.label}
                                </button>
                            );
                        })}
                    </div>
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
                                    <span className="text-[11px] font-bold">
                                        توضیحات اولیه
                                    </span>
                                </div>
                                <p className="text-[13px] leading-relaxed whitespace-pre-line break-words">
                                    {ticket.description || "بدون توضیحات"}
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
                            {ticket.messages?.map((msg, index) => (
                                <MessageBubble
                                    key={index}
                                    message={msg}
                                    index={index}
                                />
                            ))}
                        </AnimatePresence>

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* ---------- فرم پاسخ ---------- */}
                {!isClosed ? (
                    <div className="p-4 sm:p-5 border-t border-slate-100 bg-white">
                        <form
                            onSubmit={handleSendMessage}
                            className="flex flex-col gap-3"
                        >
                            <div className="flex-1 relative group">
                                <PiChatCircleDots
                                    className="
                                        absolute right-3.5 top-4
                                        w-4 h-4 text-slate-400
                                        group-focus-within:text-gold-500
                                        transition-colors duration-200
                                        pointer-events-none
                                    "
                                />
                                <textarea
                                    value={newMessage}
                                    onChange={(e) =>
                                        setNewMessage(e.target.value)
                                    }
                                    placeholder="پاسخ خود را بنویسید..."
                                    aria-label="متن پاسخ"
                                    rows={3}
                                    className="
                                        w-full pr-11 pl-3.5 py-3
                                        bg-white border border-slate-200
                                        rounded-xl
                                        text-sm text-slate-900
                                        placeholder:text-slate-400
                                        resize-none
                                        hover:border-gold-300
                                        focus:outline-none
                                        focus:border-gold-500
                                        focus:ring-4 focus:ring-gold-500/10
                                        transition-all duration-200
                                    "
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <label className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-slate-600">
                                        <PiTag className="w-3.5 h-3.5 text-gold-500" />
                                        وضعیت پس از ارسال:
                                    </label>
                                    <select
                                        value={newStatus}
                                        onChange={(e) =>
                                            setNewStatus(e.target.value)
                                        }
                                        className="
                                            px-2.5 py-1.5 rounded-lg
                                            bg-white border border-slate-200
                                            text-[11.5px] font-bold text-slate-700
                                            cursor-pointer
                                            hover:border-gold-300
                                            focus:outline-none focus:border-gold-500
                                        "
                                    >
                                        <option value="open">باز</option>
                                        <option value="in_progress">
                                            در حال بررسی
                                        </option>
                                        <option value="answered">
                                            پاسخ داده شده
                                        </option>
                                        <option value="closed">
                                            بسته شده
                                        </option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={sending || !newMessage.trim()}
                                    className="
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
                                        min-w-[140px]
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
                                            ارسال پاسخ
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <p className="text-[11px] text-slate-400 mt-3 text-center">
                            پاسخ شما برای کاربر ارسال می‌شود و به‌عنوان
                            &quot;پشتیبانی&quot; نمایش داده خواهد شد
                        </p>
                    </div>
                ) : (
                    <div className="p-5 border-t border-slate-100 bg-slate-50/60">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 text-[12.5px]">
                                <PiCheckCircle className="w-4 h-4 text-slate-400" />
                                این تیکت بسته شده است
                            </div>

                            <button
                                type="button"
                                onClick={() => handleChangeStatus("in_progress")}
                                className="
                                    inline-flex items-center gap-1.5
                                    px-4 py-2.5 rounded-xl
                                    text-[12.5px] font-bold
                                    text-gold-700 bg-gold-50
                                    ring-1 ring-gold-200
                                    hover:bg-gold-100 hover:ring-gold-300
                                    active:scale-95
                                    transition-all duration-200
                                "
                            >
                                <PiSpinnerGap className="w-3.5 h-3.5" />
                                بازگشایی تیکت
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ==================== دکمه بازگشت ==================== */}
            <div className="mt-5">
                <button
                    type="button"
                    onClick={() => router.push("/admin/tickets")}
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