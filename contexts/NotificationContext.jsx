// contexts/NotificationContext.jsx
"use client";

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    useCallback,
} from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";

/* ============================================================
   Toast Options — یک بار در ماژول
   ============================================================ */
const TOAST_OPTIONS = {
    position: "top-center",
    autoClose: 4000,
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

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const { data: session, status } = useSession();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const lastSeenIdRef = useRef(null);
    const pollRef = useRef(null);
    const isFirstLoadRef = useRef(true);

    const fetchNotifications = useCallback(
        async ({ silent = false } = {}) => {
            if (!session?.user?.id) return;
            if (!silent) setLoading(true);
            try {
                const { data } = await axios.get("/api/notifications", {
                    params: { limit: 20 },
                });
                const list = data.notifications || [];

                // 🔔 تشخیص نوتیفیکیشن جدید
                if (!isFirstLoadRef.current && list.length > 0) {
                    const newest = list[0];
                    if (
                        lastSeenIdRef.current &&
                        newest._id !== lastSeenIdRef.current
                    ) {
                        toast.info(newest.title, TOAST_OPTIONS);
                    }
                }

                if (list.length > 0) lastSeenIdRef.current = list[0]._id;
                setNotifications(list);
                setUnreadCount(data.unreadCount || 0);
                isFirstLoadRef.current = false;
            } catch (err) {
                if (err.response?.status !== 401) {
                    console.error("[NotificationContext]", err);
                }
            } finally {
                setLoading(false);
            }
        },
        [session?.user?.id]
    );

    useEffect(() => {
        if (status !== "authenticated") return;
        fetchNotifications();
        pollRef.current = setInterval(
            () => fetchNotifications({ silent: true }),
            30000
        );
        return () => clearInterval(pollRef.current);
    }, [status, fetchNotifications]);

    const markAsRead = useCallback(async (id) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n._id === id ? { ...n, is_read: true, read_at: new Date() } : n
            )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        try {
            const { data } = await axios.patch("/api/notifications", { id });
            setUnreadCount(data.unreadCount ?? 0);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, is_read: true, read_at: new Date() }))
        );
        setUnreadCount(0);
        try {
            await axios.patch("/api/notifications", {});
        } catch (err) {
            console.error(err);
        }
    }, []);

    const deleteNotification = useCallback(
        async (id) => {
            const target = notifications.find((n) => n._id === id);
            setNotifications((prev) => prev.filter((n) => n._id !== id));
            if (target && !target.is_read) {
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
            try {
                const { data } = await axios.delete(
                    `/api/notifications?id=${id}`
                );
                setUnreadCount(data.unreadCount ?? 0);
            } catch (err) {
                console.error(err);
            }
        },
        [notifications]
    );

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                open,
                setOpen,
                fetchNotifications,
                markAsRead,
                markAllAsRead,
                deleteNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error(
            "useNotifications must be used within NotificationProvider"
        );
    }
    return ctx;
}