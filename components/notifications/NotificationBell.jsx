// components/notifications/NotificationBell.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiBell, PiBellRinging, PiX } from "react-icons/pi";
import NotificationList from "./NotificationList";

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await fetch("/api/notifications/my?limit=1&unreadOnly=true");
                if (!response.ok) throw new Error("Failed");
                const data = await response.json();
                setUnreadCount(data.unreadCount || 0);
            } catch (error) {
                // اگر کاربر لاگین نکرده، خطا را نادیده بگیر
                setUnreadCount(0);
            } finally {
                setLoading(false);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="اعلان‌ها"
            >
                {unreadCount > 0 ? (
                    <PiBellRinging className="w-6 h-6 text-[#D4B06A]" />
                ) : (
                    <PiBell className="w-6 h-6 text-gray-600" />
                )}
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute left-0 mt-2 w-96 max-w-[calc(100vw-2rem)] z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-[#2C2418]">اعلان‌ها</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded-full transition"
                            >
                                <PiX className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                        <NotificationList
                            onClose={() => setIsOpen(false)}
                            onUnreadChange={(count) => setUnreadCount(count)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}