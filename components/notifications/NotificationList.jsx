// components/notifications/NotificationList.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PiCheck, PiCheckCircle, PiWarning, PiClock, PiInfo, PiX } from "react-icons/pi";

const typeIcons = {
    reservation_created: <PiInfo className="w-5 h-5 text-blue-500" />,
    reservation_accepted: <PiCheckCircle className="w-5 h-5 text-green-500" />,
    reservation_rejected: <PiX className="w-5 h-5 text-red-500" />,
    reservation_canceled: <PiWarning className="w-5 h-5 text-orange-500" />,
    payment_success: <PiCheckCircle className="w-5 h-5 text-green-500" />,
    payment_failed: <PiX className="w-5 h-5 text-red-500" />,
    reminder: <PiClock className="w-5 h-5 text-yellow-500" />,
    system: <PiInfo className="w-5 h-5 text-blue-500" />,
    promotion: <PiInfo className="w-5 h-5 text-purple-500" />
};

export default function NotificationList({ onClose, onUnreadChange }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const response = await fetch("/api/notifications/my?limit=20");
                if (!response.ok) throw new Error("Failed");
                const data = await response.json();
                if (data.success) {
                    setNotifications(data.notifications || []);
                    onUnreadChange?.(data.unreadCount || 0);
                }
            } catch (error) {
                console.error("Error loading notifications:", error);
            } finally {
                setLoading(false);
            }
        };
        loadNotifications();
    }, [onUnreadChange]);

    const markAsRead = async (id) => {
        try {
            await fetch("/api/notifications/mark-read", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId: id })
            });

            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, is_read: true } : n)
            );

            const unreadCount = notifications.filter(n => !n.is_read && n._id !== id).length;
            onUnreadChange?.(unreadCount);
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const getTimeAgo = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) return `${days} روز پیش`;
        if (hours > 0) return `${hours} ساعت پیش`;
        if (minutes > 0) return `${minutes} دقیقه پیش`;
        return "لحظاتی پیش";
    };

    if (loading) {
        return (
            <div className="p-6 text-center">
                <div className="w-8 h-8 border-2 border-[#D4B06A] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-500 text-sm mt-2">در حال بارگذاری...</p>
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <PiCheck className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">هیچ اعلانی وجود ندارد</p>
            </div>
        );
    }

    return (
        <div className="max-h-[400px] overflow-y-auto">
            <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                    <motion.div
                        key={notification._id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 hover:bg-gray-50 transition ${!notification.is_read ? "bg-blue-50/30" : ""
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                                {typeIcons[notification.type] || <PiInfo className="w-5 h-5 text-gray-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className="text-sm font-semibold text-[#2C2418]">
                                        {notification.title}
                                    </h4>
                                    {!notification.is_read && (
                                        <button
                                            onClick={() => markAsRead(notification._id)}
                                            className="flex-shrink-0 text-xs text-[#D4B06A] hover:underline"
                                        >
                                            خواندم
                                        </button>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {notification.message}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-xs text-gray-400">
                                        {getTimeAgo(notification.createdAt)}
                                    </span>
                                    {notification.data?.link && (
                                        <Link
                                            href={notification.data.link}
                                            onClick={() => {
                                                if (!notification.is_read) {
                                                    markAsRead(notification._id);
                                                }
                                                onClose?.();
                                            }}
                                            className="text-xs text-[#D4B06A] hover:underline"
                                        >
                                            مشاهده
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}