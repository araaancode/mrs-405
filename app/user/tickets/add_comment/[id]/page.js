"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function UserTicketDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [ticket, setTicket] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    // تابع کمکی برای تبدیل تاریخ از فرمت MongoDB
    const formatDate = (dateValue) => {
        if (!dateValue) return "—";

        try {
            let date;

            // اگر تاریخ به فرمت MongoDB $date باشد
            if (dateValue && typeof dateValue === 'object' && dateValue.$date) {
                date = new Date(dateValue.$date);
            }
            // اگر timestamp باشد
            else if (dateValue && typeof dateValue === 'object' && dateValue.timestamp) {
                date = new Date(dateValue.timestamp);
            }
            // اگر رشته تاریخ باشد
            else if (typeof dateValue === 'string') {
                date = new Date(dateValue);
            }
            // اگر عدد timestamp باشد
            else if (typeof dateValue === 'number') {
                date = new Date(dateValue);
            }
            // اگر تاریخ معمولی باشد
            else {
                date = new Date(dateValue);
            }

            // بررسی اعتبار تاریخ
            if (isNaN(date.getTime())) {
                return "تاریخ نامعتبر";
            }

            return date.toLocaleDateString("fa-IR");
        } catch (error) {
            console.error("خطا در فرمت تاریخ:", error);
            return "تاریخ نامعتبر";
        }
    };

    const formatDateTime = (dateValue) => {
        if (!dateValue) return "—";

        try {
            let date;

            if (dateValue && typeof dateValue === 'object' && dateValue.$date) {
                date = new Date(dateValue.$date);
            }
            else if (dateValue && typeof dateValue === 'object' && dateValue.timestamp) {
                date = new Date(dateValue.timestamp);
            }
            else if (typeof dateValue === 'string') {
                date = new Date(dateValue);
            }
            else if (typeof dateValue === 'number') {
                date = new Date(dateValue);
            }
            else {
                date = new Date(dateValue);
            }

            if (isNaN(date.getTime())) {
                return "تاریخ نامعتبر";
            }

            return date.toLocaleString("fa-IR");
        } catch (error) {
            console.error("خطا در فرمت تاریخ:", error);
            return "تاریخ نامعتبر";
        }
    };

    const formatTime = (dateValue) => {
        if (!dateValue) return "—";

        try {
            let date;

            if (dateValue && typeof dateValue === 'object' && dateValue.$date) {
                date = new Date(dateValue.$date);
            }
            else if (dateValue && typeof dateValue === 'object' && dateValue.timestamp) {
                date = new Date(dateValue.timestamp);
            }
            else if (typeof dateValue === 'string') {
                date = new Date(dateValue);
            }
            else if (typeof dateValue === 'number') {
                date = new Date(dateValue);
            }
            else {
                date = new Date(dateValue);
            }

            if (isNaN(date.getTime())) {
                return "—";
            }

            return date.toLocaleTimeString("fa-IR", { hour: '2-digit', minute: '2-digit' });
        } catch (error) {
            console.error("خطا در فرمت زمان:", error);
            return "—";
        }
    };

    const fetchTicket = async () => {
        try {
            const res = await axios.get(`/api/user/tickets/${id}`);
            setTicket(res.data);
            // toast.success("جزئیات تیکت با موفقیت بارگذاری شد", {
            //     duration: 2000,
            //     position: "bottom-center",
            //     icon: "",
            //     style: {
            //         background: "#F0FDF4",
            //         color: "#166534",
            //         borderRadius: "12px",
            //         padding: "12px 20px",
            //         fontSize: "14px",
            //         fontWeight: "600",
            //         border: "1px solid #86EFAC",
            //         boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
            //     }
            // });
        } catch (err) {
            console.error("خطا در دریافت جزئیات تیکت", err);
            toast.error("خطا در بارگذاری جزئیات تیکت", {
                duration: 3000,
                position: "bottom-center",
                icon: "❌",
                style: {
                    background: "#FEF2F2",
                    color: "#991B1B",
                    borderRadius: "12px",
                    padding: "12px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "1px solid #FCA5A5",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                }
            });
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

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            await axios.post(`/api/user/tickets/${id}`, {
                text: newMessage,
            });
            setNewMessage("");
            toast.success("پیام با موفقیت ارسال شد", {
                duration: 2000,
                position: "top-right",
                icon: "",
                style: {
                    background: "#fff",
                    color: "#166534",
                    borderRadius: "12px",
                    padding: "12px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "1px solid #86EFAC",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                }
            });
            fetchTicket();
        } catch (err) {
            console.error("خطا در ارسال پیام", err);
            toast.error("خطا در ارسال پیام", {
                duration: 3000,
                position: "bottom-center",
                icon: "❌",
                style: {
                    background: "#FEF2F2",
                    color: "#991B1B",
                    borderRadius: "12px",
                    padding: "12px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "1px solid #FCA5A5",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                }
            });
        } finally {
            setSending(false);
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case "open":
                return { text: "باز", color: "text-green-700", bg: "bg-green-100", border: "border-green-200", icon: "🟢" };
            case "in_progress":
                return { text: "در حال بررسی", color: "text-yellow-700", bg: "bg-yellow-100", border: "border-yellow-200", icon: "🟡" };
            case "closed":
                return { text: "بسته شده", color: "text-gray-700", bg: "bg-gray-100", border: "border-gray-200", icon: "⚫" };
            default:
                return { text: status, color: "text-gray-700", bg: "bg-gray-100", border: "border-gray-200", icon: "📌" };
        }
    };

    const getPriorityInfo = (priority) => {
        switch (priority) {
            case "high":
                return { text: "زیاد", color: "text-red-700", bg: "bg-red-100", border: "border-red-200", icon: "⚠️" };
            case "medium":
                return { text: "متوسط", color: "text-yellow-700", bg: "bg-yellow-100", border: "border-yellow-200", icon: "!!" };
            case "low":
                return { text: "کم", color: "text-green-700", bg: "bg-green-100", border: "border-green-200", icon: "✓" };
            default:
                return { text: priority, color: "text-gray-700", bg: "bg-gray-100", border: "border-gray-200", icon: "📌" };
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                <div className="w-12 h-12 border-4 border-[#D4B06A]/20 border-t-[#D4B06A] rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 text-sm">در حال بارگذاری تیکت...</p>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl">⚠️</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#2C2418] mb-2">تیکت یافت نشد</h3>
                <p className="text-gray-500 text-sm mb-6">تیکت مورد نظر وجود ندارد یا حذف شده است</p>
                <Link href="/user/tickets">
                    <button className="flex items-center gap-2 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm shadow-md transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        بازگشت به لیست تیکت‌ها
                    </button>
                </Link>
            </div>
        );
    }

    const statusInfo = getStatusInfo(ticket.status);
    const priorityInfo = getPriorityInfo(ticket.priority);

    return (
        <div className="ticket-details-page w-full max-w-full overflow-hidden">
            <Toaster />

            {/* هدر صفحه - کاملاً رسپانسیو */}
            <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 rounded-xl flex-shrink-0">
                            <svg className="w-6 h-6 sm:w-7 sm:h-8 text-[#D4B06A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#2C2418]">
                                    جزئیات تیکت
                                </h2>
                                <span className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                                    <span className="text-xs sm:text-sm">{statusInfo.icon}</span>
                                    <span>وضعیت: {statusInfo.text}</span>
                                </span>
                                <span className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium border ${priorityInfo.bg} ${priorityInfo.color} ${priorityInfo.border}`}>
                                    <span className="text-xs sm:text-sm">{priorityInfo.icon}</span>
                                    <span>اولویت: {priorityInfo.text}</span>
                                </span>
                            </div>
                            <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1 break-all">
                                شناسه: {ticket._id?.$oid || ticket._id}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mt-2" />
            </div>

            {/* کارت اصلی تیکت - کاملاً رسپانسیو */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-lg transition-all duration-500 overflow-hidden">

                {/* هدر تیکت */}
                <div className="bg-gradient-to-r from-[#D4B06A]/5 to-[#B8922E]/5 p-4 sm:p-5 border-b border-gray-100">
                    <h1 className="text-lg sm:text-xl font-bold text-[#2C2418] break-words">{ticket.subject}</h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        تاریخ ایجاد: {formatDateTime(ticket.createdAt)}
                    </p>
                </div>

                {/* بخش پیام‌ها - کاملاً رسپانسیو */}
                <div className="p-4 sm:p-5 bg-gradient-to-br from-gray-50/50 to-white min-h-[300px] sm:min-h-[400px] max-h-[400px] sm:max-h-[500px] overflow-y-auto">
                    <div className="space-y-3 sm:space-y-4">
                        {/* توضیحات اولیه تیکت */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col items-start"
                        >
                            <div className="bg-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 max-w-[90%] sm:max-w-[85%]">
                                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                    <span className="text-blue-600 text-xs sm:text-sm font-bold">📝</span>
                                    <span className="text-[10px] sm:text-xs font-bold text-blue-700">توضیحات اولیه:</span>
                                </div>
                                <p className="text-gray-700 text-xs sm:text-sm break-words">{ticket.description}</p>
                            </div>
                        </motion.div>

                        {/* لیست پیام‌های ارسالی و دریافتی */}
                        <AnimatePresence>
                            {ticket.messages?.map((msg, index) => {
                                const isUserMessage = msg.senderId?.$oid === ticket.reporterId?.$oid ||
                                    msg.senderId === ticket.reporterId;
                                const messageText = msg.text || msg.content || "";
                                const messageTime = msg.timestamp || msg.createdAt || msg.updatedAt;

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`flex flex-col ${isUserMessage ? 'items-start' : 'items-end'}`}
                                    >
                                        <div className={`max-w-[90%] sm:max-w-[85%] rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm ${isUserMessage
                                            ? 'bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white'
                                            : 'bg-white border border-gray-200 text-gray-700'
                                            }`}>
                                            <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-4 mb-1.5 sm:mb-2">
                                                <span className="text-[10px] sm:text-xs opacity-80 font-medium">
                                                    {isUserMessage ? 'شما' : 'پشتیبانی'}
                                                </span>
                                                <span className="text-[10px] sm:text-xs opacity-70">
                                                    {formatTime(messageTime)}
                                                </span>
                                            </div>
                                            <p className="text-xs sm:text-sm break-words">{messageText}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {/* اسکرول به انتها */}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* فرم ارسال پیام جدید - کاملاً رسپانسیو */}
                <div className="p-4 sm:p-5 border-t border-gray-100 bg-white">
                    <form onSubmit={handleSendMessage} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <div className="flex-1 relative group">
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-[#D4B06A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="پیام خود را اینجا بنویسید..."
                                className="w-full pr-8 sm:pr-10 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                                       text-[#2C2418] placeholder-gray-400 text-xs sm:text-sm
                                       focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20
                                       transition-all duration-300"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={sending || !newMessage.trim()}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sending ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>در حال ارسال...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    <span>ارسال</span>
                                </div>
                            )}
                        </button>
                    </form>

                    {/* راهنما */}
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-2 sm:mt-3 text-center">
                        پیام شما توسط تیم پشتیبانی بررسی خواهد شد
                    </p>
                </div>
            </div>

            {/* دکمه بازگشت - کاملاً رسپانسیو */}
            <div className="mt-4 sm:mt-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 sm:gap-2 text-gray-500 hover:text-[#D4B06A] transition-colors duration-300"
                >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-xs sm:text-sm">بازگشت به لیست تیکت‌ها</span>
                </button>
            </div>
        </div>
    );
}