"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function HallOwnerTicketDetailsPage() {
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
            const res = await axios.get(`/api/hall_owner/tickets/${id}`);
            setTicket(res.data);
        } catch (err) {
            console.error("خطا در دریافت جزئیات تیکت", err);
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
            await axios.post(`/api/hall_owner/tickets/${id}`, {
                text: newMessage,
            });
            setNewMessage("");
            fetchTicket();
        } catch (err) {
            alert("خطا در ارسال پیام");
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
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-[#D4B06A]/20 border-t-[#D4B06A] rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 text-sm">در حال بارگذاری تیکت...</p>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-[#2C2418] mb-2">تیکت یافت نشد</h3>
                <p className="text-gray-500 text-sm mb-6">تیکت مورد نظر وجود ندارد یا حذف شده است</p>
                <Link href="/hall_owner/tickets">
                    <button className="flex items-center gap-2 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-xl transition-all duration-300">
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
        <div className="ticket-details-page">

            {/* هدر صفحه */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 rounded-xl">
                        <svg className="w-8 h-8 text-[#D4B06A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-2xl md:text-3xl font-black text-[#2C2418]">
                                جزئیات تیکت
                            </h2>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                                <span>{statusInfo.icon}</span>
                                <span>وضعیت: {statusInfo.text}</span>
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium border ${priorityInfo.bg} ${priorityInfo.color} ${priorityInfo.border}`}>
                                <span>{priorityInfo.icon}</span>
                                <span>اولویت: {priorityInfo.text}</span>
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                            شناسه: {ticket._id?.$oid || ticket._id}
                        </p>
                    </div>
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mt-2" />
            </div>

            {/* کارت اصلی تیکت */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">

                {/* هدر تیکت */}
                <div className="bg-gradient-to-r from-[#D4B06A]/5 to-[#B8922E]/5 p-5 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-[#2C2418]">{ticket.subject}</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        تاریخ ایجاد: {formatDateTime(ticket.createdAt)}
                    </p>
                </div>

                {/* بخش پیام‌ها */}
                <div className="p-5 bg-gradient-to-br from-gray-50/50 to-white min-h-[400px] max-h-[500px] overflow-y-auto">
                    <div className="space-y-4">
                        {/* توضیحات اولیه تیکت */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col items-start"
                        >
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 max-w-[85%]">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-blue-600 text-sm font-bold">📝</span>
                                    <span className="text-xs font-bold text-blue-700">توضیحات اولیه:</span>
                                </div>
                                <p className="text-gray-700 text-sm">{ticket.description}</p>
                            </div>
                        </motion.div>

                        {/* لیست پیام‌های ارسالی و دریافتی */}
                        <AnimatePresence>
                            {ticket.messages?.map((msg, index) => {
                                const isUserMessage = msg.senderId === ticket.reporterId;
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
                                        <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${isUserMessage
                                            ? 'bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white'
                                            : 'bg-white border border-gray-200 text-gray-700'
                                            }`}>
                                            <div className="flex items-center justify-between gap-4 mb-2">
                                                <span className="text-xs opacity-80 font-medium">
                                                    {isUserMessage ? 'شما' : 'پشتیبانی'}
                                                </span>
                                                <span className="text-xs opacity-70">
                                                    {formatTime(messageTime)}
                                                </span>
                                            </div>
                                            <p className="text-sm">{messageText}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {/* اسکرول به انتها */}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* فرم ارسال پیام جدید */}
                <div className="p-5 border-t border-gray-100 bg-white">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                        <div className="flex-1 relative group">
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#D4B06A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="پیام خود را اینجا بنویسید..."
                                className="w-full pr-10 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                                       text-[#2C2418] placeholder-gray-400 text-sm
                                       focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20
                                       transition-all duration-300"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={sending || !newMessage.trim()}
                            className="bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sending ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>در حال ارسال...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    <span>ارسال</span>
                                </div>
                            )}
                        </button>
                    </form>

                    {/* راهنما */}
                    <p className="text-xs text-gray-400 mt-3 text-center">
                        پیام شما توسط تیم پشتیبانی بررسی خواهد شد
                    </p>
                </div>
            </div>

            {/* دکمه بازگشت */}
            <div className="mt-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#D4B06A] transition-colors duration-300"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-sm">بازگشت به لیست تیکت‌ها</span>
                </button>
            </div>
        </div>
    );
}