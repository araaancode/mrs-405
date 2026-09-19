// app/hall_owner/reservations/page.js
"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { PiCalendar, PiMagnifyingGlass, PiArrowClockwise } from "react-icons/pi";
import { PulseLoader } from "react-spinners";

import ReservationCard from "./components/ReservationCard";
import FilterTabs from "./components/FilterTabs";
import ConfirmModal from "./components/ConfirmModal";
import RejectModal from "./components/RejectModal";

export default function ReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");

    // Modal state
    const [confirmTarget, setConfirmTarget] = useState(null); // reservation
    const [rejectTarget, setRejectTarget] = useState(null);   // reservation
    const [actionLoading, setActionLoading] = useState(null); // id در حال پردازش

    // ==========================================
    // دریافت داده‌ها
    // ==========================================
    const loadReservations = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            else setRefreshing(true);

            const { data } = await axios.get("/api/hall_owner/reservations", {
                withCredentials: true,
            });

            setReservations(data.reservations || []);
        } catch (err) {
            console.error("Load error:", err);
            toast.error(
                err.response?.data?.error || "خطا در دریافت رزروها"
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadReservations();
    }, [loadReservations]);

    // ==========================================
    // شمارش وضعیت‌ها
    // ==========================================
    const counts = useMemo(() => {
        return reservations.reduce(
            (acc, r) => {
                acc[r.status] = (acc[r.status] || 0) + 1;
                return acc;
            },
            { pending: 0, accepted: 0, rejected: 0, canceled: 0 }
        );
    }, [reservations]);

    // ==========================================
    // فیلتر + جستجو
    // ==========================================
    const filtered = useMemo(() => {
        let result = [...reservations];

        if (activeTab !== "all") {
            result = result.filter((r) => r.status === activeTab);
        }

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter((r) => {
                const hallTitle =
                    typeof r.hall_id === "object" ? r.hall_id?.title : "";
                const shortId = typeof r._id === "string" ? r._id.slice(-8) : "";
                return (
                    shortId.includes(q) ||
                    hallTitle?.toLowerCase().includes(q) ||
                    r.user_note?.toLowerCase().includes(q) ||
                    r.cancel_reason?.toLowerCase().includes(q)
                );
            });
        }

        return result;
    }, [reservations, activeTab, search]);

    // ==========================================
    // تایید رزرو
    // ==========================================
    const handleConfirm = async ({ owner_note }) => {
        if (!confirmTarget) return;
        const id = confirmTarget._id;
        setActionLoading(id);

        // Optimistic update
        const previous = reservations;
        setReservations((prev) =>
            prev.map((r) =>
                r._id === id
                    ? {
                        ...r,
                        status: "accepted",
                        is_confirmed_by_owner: true,
                        reviewed_at: new Date().toISOString(),
                        owner_note: owner_note || r.owner_note,
                    }
                    : r
            )
        );

        try {
            await axios.patch(
                `/api/hall_owner/reservations/${id}/confirm`,
                { owner_note },
                { withCredentials: true }
            );

            toast.success("رزرو با موفقیت تایید شد", {
                duration: 2500,
                position: "bottom-center",
                style: {
                    background: "#F0FDF4",
                    color: "#166534",
                    borderRadius: "12px",
                    padding: "12px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "1px solid #86EFAC",
                },
            });

            setConfirmTarget(null);
        } catch (err) {
            // Rollback
            setReservations(previous);
            toast.error(
                err.response?.data?.error || "خطا در تایید رزرو",
                { duration: 3000, position: "bottom-center" }
            );
        } finally {
            setActionLoading(null);
        }
    };

    // ==========================================
    // رد رزرو
    // ==========================================
    const handleReject = async ({ cancel_reason, owner_note }) => {
        if (!rejectTarget) return;
        const id = rejectTarget._id;
        setActionLoading(id);

        const previous = reservations;
        setReservations((prev) =>
            prev.map((r) =>
                r._id === id
                    ? {
                        ...r,
                        status: "rejected",
                        is_confirmed_by_owner: false,
                        reviewed_at: new Date().toISOString(),
                        cancel_reason,
                        owner_note: owner_note || r.owner_note,
                    }
                    : r
            )
        );

        try {
            await axios.patch(
                `/api/hall_owner/reservations/${id}/reject`,
                { cancel_reason, owner_note },
                { withCredentials: true }
            );

            toast.success("رزرو رد شد", {
                duration: 2500,
                position: "bottom-center",
                style: {
                    background: "#FEF2F2",
                    color: "#991B1B",
                    borderRadius: "12px",
                    padding: "12px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "1px solid #FCA5A5",
                },
            });

            setRejectTarget(null);
        } catch (err) {
            setReservations(previous);
            toast.error(
                err.response?.data?.error || "خطا در رد رزرو",
                { duration: 3000, position: "bottom-center" }
            );
        } finally {
            setActionLoading(null);
        }
    };

    // ==========================================
    // Loading
    // ==========================================
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-5" dir="rtl">
                <PulseLoader color="#D4B06A" size={15} margin={6} />
                <p className="text-sm text-gray-500">در حال بارگذاری رزروها...</p>
            </div>
        );
    }

    return (
        <div dir="rtl" className="max-w-full">
            <Toaster />

            {/* هدر */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#2C2418]">
                        رزروهای من
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {reservations.length.toLocaleString("fa-IR")} رزرو ثبت شده
                    </p>
                </div>

                <button
                    onClick={() => loadReservations(true)}
                    disabled={refreshing}
                    className="px-4 py-2.5 bg-white border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-700 hover:border-[#D4B06A] transition-colors flex items-center gap-2 disabled:opacity-60"
                >
                    <PiArrowClockwise className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                    بروزرسانی
                </button>
            </div>

            {/* جستجو */}
            <div className="relative mb-4">
                <PiMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جستجو در شماره رزرو، نام تالار، یادداشت‌ها..."
                    className="w-full pr-12 pl-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#D4B06A] text-sm"
                />
            </div>

            {/* تب‌های فیلتر */}
            <div className="mb-5">
                <FilterTabs active={activeTab} onChange={setActiveTab} counts={counts} />
            </div>

            {/* لیست */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
                    <PiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-base text-gray-600 font-bold mb-1">
                        {reservations.length === 0
                            ? "هنوز رزروی ندارید"
                            : "رزروی با این فیلتر یافت نشد"}
                    </p>
                    <p className="text-sm text-gray-400">
                        {reservations.length === 0
                            ? "رزروهای تالار شما در اینجا نمایش داده می‌شوند"
                            : "فیلتر یا جستجو را تغییر دهید"}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((r) => (
                        <ReservationCard
                            key={r._id}
                            data={r}
                            onConfirm={(res) => setConfirmTarget(res)}
                            onReject={(res) => setRejectTarget(res)}
                            actionLoading={actionLoading}
                        />
                    ))}
                </div>
            )}

            {/* Modal تایید */}
            <ConfirmModal
                open={!!confirmTarget}
                onClose={() => setConfirmTarget(null)}
                onConfirm={handleConfirm}
                loading={actionLoading === confirmTarget?._id}
                reservationId={confirmTarget?._id}
            />

            {/* Modal رد */}
            <RejectModal
                open={!!rejectTarget}
                onClose={() => setRejectTarget(null)}
                onReject={handleReject}
                loading={actionLoading === rejectTarget?._id}
            />
        </div>
    );
}