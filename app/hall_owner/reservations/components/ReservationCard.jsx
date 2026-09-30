// app/hall_owner/reservations/components/ReservationCard.jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  PiCalendarBlank,
  PiUsersThree,
  PiMapPin,
  PiCheckCircle,
  PiXCircle,
  PiClock,
  PiProhibit,
  PiNote,
  PiCurrencyCircleDollar,
  PiPhone,
  PiUser,
  PiBuildings,
} from "react-icons/pi";

const faNum = (n) => Number(n || 0).toLocaleString("fa-IR");

/* ============================================================
   Status Config
   ============================================================ */
function getStatusInfo(status) {
  const map = {
    pending: {
      label: "در انتظار تایید",
      icon: PiClock,
      bg: "bg-amber-50",
      text: "text-amber-700",
      ring: "ring-amber-200",
      dot: "bg-amber-500",
    },
    accepted: {
      label: "تایید شده",
      icon: PiCheckCircle,
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "ring-emerald-200",
      dot: "bg-emerald-500",
    },
    rejected: {
      label: "رد شده",
      icon: PiXCircle,
      bg: "bg-rose-50",
      text: "text-rose-700",
      ring: "ring-rose-200",
      dot: "bg-rose-500",
    },
    canceled: {
      label: "لغو شده",
      icon: PiProhibit,
      bg: "bg-slate-50",
      text: "text-slate-600",
      ring: "ring-slate-200",
      dot: "bg-slate-500",
    },
  };
  return (
    map[status] || {
      label: status || "نامشخص",
      icon: PiClock,
      bg: "bg-slate-50",
      text: "text-slate-600",
      ring: "ring-slate-200",
      dot: "bg-slate-500",
    }
  );
}

/* ============================================================
   فرمت تاریخ
   ============================================================ */
function formatDate(value) {
  if (!value) return "—";
  try {
    let date;
    if (typeof value === "object" && value.$date) {
      date = new Date(value.$date);
    } else {
      date = new Date(value);
    }
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("fa-IR");
  } catch {
    return "—";
  }
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
   ReservationCard
   ============================================================ */
export default function ReservationCard({
  data,
  onConfirm,
  onReject,
  actionLoading,
}) {
  const hallTitle =
    typeof data.hall_id === "object" ? data.hall_id?.title : "تالار";
  const hallCity =
    typeof data.hall_id === "object" ? data.hall_id?.city : "";
  const hallProvince =
    typeof data.hall_id === "object" ? data.hall_id?.province : "";
  const hallPhone =
    typeof data.hall_id === "object" ? data.hall_id?.hall_phone : "";

  const isPending = data.status === "pending";
  const isLoading = actionLoading === data._id;

  const startDate = formatDate(data.start_date);
  const endDate = formatDate(data.end_date);
  const createdDate = formatDate(data.createdAt);
  const shortId = typeof data._id === "string" ? data._id.slice(-6).toUpperCase() : "—";

  const guestsCount = Number(data.guests_count || 0);
  const totalPrice = Number(data.total_price || 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        group bg-white rounded-2xl
        ring-1 ring-slate-100 hover:ring-gold-200/70
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        hover:shadow-[0_12px_32px_-12px_rgba(198,161,76,0.18)]
        transition-all duration-400
        overflow-hidden
      "
    >
      <div className="p-5">
        {/* ==================== ردیف بالا: وضعیت + شناسه ==================== */}
        <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={data.status} />
            <span className="text-[10.5px] text-slate-400">
              ثبت: {createdDate}
            </span>
          </div>

          <div className="text-[10.5px] text-slate-400">
            شناسه:{" "}
            <span className="font-mono font-bold text-slate-600">
              #{shortId}
            </span>
          </div>
        </div>

        {/* ==================== عنوان تالار + موقعیت ==================== */}
        <h3 className="text-[15px] font-bold text-slate-900 mb-2 line-clamp-1">
          {hallTitle}
        </h3>

        {(hallCity || hallProvince) && (
          <div className="flex items-center gap-1.5 text-[12px] text-slate-500 mb-3">
            <PiMapPin className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
            <span className="line-clamp-1">
              {[hallCity, hallProvince].filter(Boolean).join(" — ")}
            </span>
          </div>
        )}

        {/* ==================== اطلاعات رزرو ==================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          <div className="bg-slate-50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-0.5">
              <PiCalendarBlank className="w-3 h-3" />
              شروع
            </div>
            <p className="text-[12px] font-bold text-slate-800">
              {startDate}
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-0.5">
              <PiCalendarBlank className="w-3 h-3" />
              پایان
            </div>
            <p className="text-[12px] font-bold text-slate-800">
              {endDate}
            </p>
          </div>

          {guestsCount > 0 && (
            <div className="bg-slate-50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-0.5">
                <PiUsersThree className="w-3 h-3" />
                مهمان
              </div>
              <p className="text-[12px] font-bold text-slate-800">
                {faNum(guestsCount)} نفر
              </p>
            </div>
          )}

          {totalPrice > 0 && (
            <div className="bg-gold-50 rounded-lg px-3 py-2 ring-1 ring-gold-100">
              <div className="flex items-center gap-1 text-[10px] text-gold-700 mb-0.5">
                <PiCurrencyCircleDollar className="w-3 h-3" />
                مبلغ کل
              </div>
              <p className="text-[12px] font-bold text-gold-800">
                {faNum(totalPrice)}
                <span className="text-[9px] text-gold-600 mr-0.5">تومان</span>
              </p>
            </div>
          )}
        </div>

        {/* ==================== یادداشت کاربر ==================== */}
        {data.user_note && (
          <div className="mb-3 p-2.5 bg-slate-50 rounded-lg flex items-start gap-2">
            <PiNote className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11.5px] text-slate-600 line-clamp-2 leading-relaxed">
              {data.user_note}
            </p>
          </div>
        )}

        {/* ==================== یادداشت مالک ==================== */}
        {data.owner_note && (
          <div className="mb-3 p-2.5 bg-gold-50/60 rounded-lg flex items-start gap-2 ring-1 ring-gold-100">
            <PiNote className="w-3.5 h-3.5 text-gold-500 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-gold-700 mb-0.5">
                یادداشت شما
              </p>
              <p className="text-[11.5px] text-slate-600 line-clamp-2 leading-relaxed">
                {data.owner_note}
              </p>
            </div>
          </div>
        )}

        {/* ==================== دلیل رد ==================== */}
        {data.cancel_reason && data.status === "rejected" && (
          <div className="mb-3 p-2.5 bg-rose-50 rounded-lg flex items-start gap-2 ring-1 ring-rose-100">
            <PiXCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-rose-700 mb-0.5">
                دلیل رد
              </p>
              <p className="text-[11.5px] text-slate-600 line-clamp-2 leading-relaxed">
                {data.cancel_reason}
              </p>
            </div>
          </div>
        )}

        {/* ==================== اطلاعات کاربر ==================== */}
        {(data.user_id?.full_name ||
          data.user_id?.phone ||
          hallPhone) && (
          <div className="mb-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              {data.user_id?.full_name && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 text-[11px] font-medium ring-1 ring-slate-100">
                  <PiUser className="w-3.5 h-3.5 text-gold-500" />
                  {data.user_id.full_name}
                </span>
              )}
              {data.user_id?.phone && (
                <a
                  href={`tel:${data.user_id.phone}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 text-[11px] font-medium ring-1 ring-slate-100 hover:bg-gold-50 hover:ring-gold-200 hover:text-gold-700 transition-all"
                >
                  <PiPhone className="w-3.5 h-3.5 text-gold-500" />
                  <span dir="ltr">{data.user_id.phone}</span>
                </a>
              )}
              {hallPhone && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 text-[11px] font-medium ring-1 ring-slate-100">
                  <PiBuildings className="w-3.5 h-3.5 text-gold-500" />
                  تالار: <span dir="ltr">{hallPhone}</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* ==================== دکمه‌های اقدام (فقط pending) ==================== */}
        {isPending && (
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onConfirm(data)}
              disabled={isLoading}
              className="
                group/btn inline-flex items-center justify-center gap-1.5
                px-4 py-2.5 rounded-xl
                text-[12.5px] font-bold text-white
                bg-gradient-to-b from-emerald-400 to-emerald-600
                hover:from-emerald-500 hover:to-emerald-700
                shadow-md shadow-emerald-500/25
                hover:shadow-lg hover:shadow-emerald-500/40
                hover:-translate-y-0.5
                active:scale-95
                focus:outline-none focus:ring-4 focus:ring-emerald-500/25
                disabled:opacity-60 disabled:cursor-not-allowed
                disabled:hover:translate-y-0
                transition-all duration-200
              "
            >
              <PiCheckCircle className="w-4 h-4" />
              تایید رزرو
            </button>

            <button
              type="button"
              onClick={() => onReject(data)}
              disabled={isLoading}
              className="
                group/btn inline-flex items-center justify-center gap-1.5
                px-4 py-2.5 rounded-xl
                text-[12.5px] font-bold
                text-rose-600 bg-rose-50
                ring-1 ring-rose-100
                hover:bg-rose-500 hover:text-white hover:ring-rose-500
                hover:shadow-md hover:shadow-rose-500/30
                hover:-translate-y-0.5
                active:scale-95
                focus:outline-none focus:ring-4 focus:ring-rose-500/25
                disabled:opacity-60 disabled:cursor-not-allowed
                disabled:hover:translate-y-0
                transition-all duration-200
              "
            >
              <PiXCircle className="w-4 h-4" />
              رد رزرو
            </button>
          </div>
        )}
      </div>
    </motion.article>
  );
}