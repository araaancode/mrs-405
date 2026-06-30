"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HallOwnerTicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = async () => {
        try {
            const res = await axios.get("/api/hall_owner/tickets", {
                withCredentials: true
            });
            setTickets(res.data);
        } catch (err) {
            console.error("خطا در دریافت تیکت‌ها", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

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
                <p className="text-gray-500 text-sm">در حال بارگذاری تیکت‌ها...</p>
            </div>
        );
    }

    return (
        <div className="tickets-page">
            {/* هدر صفحه */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 rounded-xl">
                            <svg className="w-8 h-8 text-[#D4B06A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-[#2C2418]">
                                تیکت‌های پشتیبانی (سالن)
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                لیست تمام تیکت‌های ثبت شده توسط شما
                            </p>
                        </div>
                    </div>

                    {/* در صورت نیاز به دکمه تیکت جدید برای صاحب سالن، می‌توانید این لینک را فعال کنید */}
                    {/* <Link href="/hall_owner/tickets/create">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            تیکت جدید
                        </motion.button>
                    </Link> */}
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mt-2" />
            </div>

            {/* لیست تیکت‌ها */}
            {tickets.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-[#D4B06A]/10 to-[#B8922E]/10 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-[#D4B06A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#2C2418] mb-2">هیچ تیکتی ثبت نشده است</h3>
                    <p className="text-gray-500 text-sm mb-6">هیچ تیکت پشتیبانی برای نمایش وجود ندارد</p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {tickets.map((ticket, index) => {
                        const statusInfo = getStatusInfo(ticket.status);
                        const priorityInfo = getPriorityInfo(ticket.priority);

                        return (
                            <motion.div
                                key={ticket._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-5">
                                    {/* هدر کارت */}
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                                                    <span>{statusInfo.icon}</span>
                                                    <span>{statusInfo.text}</span>
                                                </span>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${priorityInfo.bg} ${priorityInfo.color} ${priorityInfo.border}`}>
                                                    <span>{priorityInfo.icon}</span>
                                                    <span>اولویت: {priorityInfo.text}</span>
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-[#2C2418] text-lg">
                                                {ticket.subject}
                                            </h3>
                                        </div>

                                        <div className="text-sm text-gray-500 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{new Date(ticket.createdAt).toLocaleDateString("fa-IR")}</span>
                                        </div>
                                    </div>

                                    {/* توضیحات */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {ticket.description}
                                    </p>

                                    {/* دکمه مشاهده جزئیات */}
                                    <div className="flex justify-end">
                                        <Link href={`/hall_owner/tickets/add_comment/${ticket._id}`}>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="flex items-center gap-2 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white px-4 py-2 rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                مشاهده جزئیات تیکت
                                            </motion.button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}