// app/hall_owner/reservations/page.jsx
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  PiCalendarBlank,
  PiMagnifyingGlass,
  PiArrowClockwise,
  PiCalendarX,
  PiX,
} from "react-icons/pi";

import ReservationCard from "./components/ReservationCard";
import FilterTabs from "./components/FilterTabs";
import ConfirmModal from "./components/ConfirmModal";
import RejectModal from "./components/RejectModal";
import { notify } from "@/lib/toast";

/* ============================================================
   SkeletonCard
   ============================================================ */
function ReservationSkeleton() {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 space-y-3 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="h-6 w-24 bg-slate-100 rounded-full" />
        <div className="h-4 w-32 bg-slate-100 rounded-md" />
      </div>
      <div className="h-5 w-2/3 bg-slate-100 rounded-lg" />
      <div className="h-3.5 w-1/3 bg-slate-100 rounded-md" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-slate-100 rounded-lg" />
        ))}
      </div>
      <div className="h-9 bg-slate-100 rounded-lg mt-4" />
    </div>
  );
}

/* ============================================================
   EmptyState
   ============================================================ */
function EmptyState({ filtered, onReset }) {
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
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, rgba(198,161,76,0.08) 0%, transparent 50%)`,
        }}
      />

      <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-gold-50 to-gold-100/60 flex items-center justify-center ring-1 ring-gold-100">
        <div className="absolute inset-0 rounded-3xl bg-gold-500/5 blur-xl" />
        <PiCalendarX className="relative w-10 h-10 text-gold-500" />
      </div>

      <h3 className="relative text-lg sm:text-xl font-bold text-slate-900 mb-2">
        {filtered ? "رزروی با این فیلتر یافت نشد" : "هنوز رزروی ندارید"}
      </h3>
      <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-7">
        {filtered
          ? "می‌توانید فیلتر یا جستجو را تغییر دهید."
          : "رزروهای تالار شما در اینجا نمایش داده می‌شوند."}
      </p>

      {filtered && (
        <button
          type="button"
          onClick={onReset}
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
          پاک کردن فیلترها
        </button>
      )}
    </motion.div>
  );
}

/* ============================================================
   Page
   ============================================================ */
export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const [confirmTarget, setConfirmTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  /* ============================================================
     Load Reservations
     ============================================================ */
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
      notify.error(err.response?.data?.error || "خطا در دریافت رزروها");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  /* ============================================================
     Counts
     ============================================================ */
  const counts = useMemo(() => {
    return reservations.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      },
      { pending: 0, accepted: 0, rejected: 0, canceled: 0 }
    );
  }, [reservations]);

  /* ============================================================
     Filter + Search
     ============================================================ */
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

  /* ============================================================
     Reset
     ============================================================ */
  const resetFilters = () => {
    setActiveTab("all");
    setSearch("");
  };

  /* ============================================================
     Confirm
     ============================================================ */
  const handleConfirm = async ({ owner_note }) => {
    if (!confirmTarget) return;
    const id = confirmTarget._id;
    setActionLoading(id);

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

    const toastId = toast.loading("در حال تایید رزرو...");

    try {
      await axios.patch(
        `/api/hall_owner/reservations/${id}/confirm`,
        { owner_note },
        { withCredentials: true }
      );

      toast.update(toastId, {
        render: "رزرو با موفقیت تایید شد",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });

      setConfirmTarget(null);
    } catch (err) {
      setReservations(previous);
      toast.update(toastId, {
        render: err.response?.data?.error || "خطا در تایید رزرو",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
    } finally {
      setActionLoading(null);
    }
  };

  /* ============================================================
     Reject
     ============================================================ */
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

    const toastId = toast.loading("در حال رد رزرو...");

    try {
      await axios.patch(
        `/api/hall_owner/reservations/${id}/reject`,
        { cancel_reason, owner_note },
        { withCredentials: true }
      );

      toast.update(toastId, {
        render: "رزرو رد شد",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });

      setRejectTarget(null);
    } catch (err) {
      setReservations(previous);
      toast.update(toastId, {
        render: err.response?.data?.error || "خطا در رد رزرو",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
    } finally {
      setActionLoading(null);
    }
  };

  /* ============================================================
     Loading
     ============================================================ */
  if (loading) {
    return (
      <div dir="rtl" className="w-full space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-3.5 w-32 bg-slate-100 rounded-md animate-pulse" />
          </div>
          <div className="h-10 w-28 bg-slate-100 rounded-xl animate-pulse" />
        </div>
        <div className="h-11 bg-slate-100 rounded-xl animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-9 w-24 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <ReservationSkeleton key={i} />
        ))}
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
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25 flex-shrink-0">
              <PiCalendarBlank className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                رزروهای من
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {reservations.length.toLocaleString("fa-IR")} رزرو ثبت‌شده
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadReservations(true)}
            disabled={refreshing}
            className="
              inline-flex items-center gap-2
              px-4 py-2.5 rounded-xl
              text-[12.5px] font-medium
              text-slate-700 bg-white
              border border-slate-200
              hover:bg-gold-50 hover:border-gold-300 hover:text-gold-700
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            "
          >
            <PiArrowClockwise
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            بروزرسانی
          </button>
        </div>
      </motion.div>

      {/* ==================== Search ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="relative mb-4"
      >
        <PiMagnifyingGlass className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو در شماره رزرو، نام تالار، یادداشت‌ها..."
          aria-label="جستجو در رزروها"
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
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
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
      </motion.div>

      {/* ==================== Filter Tabs ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="mb-5"
      >
        <FilterTabs
          active={activeTab}
          onChange={setActiveTab}
          counts={counts}
        />
      </motion.div>

      {/* ==================== Content ==================== */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState
              filtered={
                reservations.length > 0 && (activeTab !== "all" || search)
              }
              onReset={resetFilters}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filtered.map((r) => (
              <ReservationCard
                key={r._id}
                data={r}
                onConfirm={(res) => setConfirmTarget(res)}
                onReject={(res) => setRejectTarget(res)}
                actionLoading={actionLoading}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== Modals ==================== */}
      <ConfirmModal
        open={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={handleConfirm}
        loading={actionLoading === confirmTarget?._id}
        reservationId={confirmTarget?._id}
      />

      <RejectModal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onReject={handleReject}
        loading={actionLoading === rejectTarget?._id}
      />
    </div>
  );
}