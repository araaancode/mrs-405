// components/user/reservations/ReservationCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    PiCalendarBlank,
    PiUsersThree,
    PiMapPin,
    PiClock,
    PiCheckCircle,
    PiXCircle,
    PiHourglass,
    PiEye,
    PiPhone,
    PiArrowLeft,
    PiNote,
    PiCurrencyCircleDollar,
} from "react-icons/pi";

const faNum = (n) => Number(n || 0).toLocaleString("fa-IR");

/* ============================================================
   نرمال‌سازی URL تصویر
   ============================================================ */
function normalizeImageUrl(url, fallback = "/images/placeholder-hall.jpg") {
    if (!url || typeof url !== "string") return fallback;
    const trimmed = url.trim();
    if (!trimmed) return fallback;
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
        return trimmed;
    if (trimmed.startsWith("data:")) return trimmed;
    if (trimmed.startsWith("./")) return "/" + trimmed.slice(2);
    if (!trimmed.startsWith("/")) return "/" + trimmed;
    return trimmed;
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
    const map = {
        pending: {
            label: "در انتظار تأیید",
            icon: PiHourglass,
            bg: "bg-amber-50",
            text: "text-amber-700",
            ring: "ring-amber-200",
            dot: "bg-amber-500",
        },
        approved: {
            label: "تأیید شده",
            icon: PiCheckCircle,
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            ring: "ring-emerald-200",
            dot: "bg-emerald-500",
        },
        confirmed: {
            label: "تأیید شده",
            icon: PiCheckCircle,
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            ring: "ring-emerald-200",
            dot: "bg-emerald-500",
        },
        cancelled: {
            label: "لغو شده",
            icon: PiXCircle,
            bg: "bg-rose-50",
            text: "text-rose-700",
            ring: "ring-rose-200",
            dot: "bg-rose-500",
        },
        rejected: {
            label: "رد شده",
            icon: PiXCircle,
            bg: "bg-rose-50",
            text: "text-rose-700",
            ring: "ring-rose-200",
            dot: "bg-rose-500",
        },
        completed: {
            label: "انجام شده",
            icon: PiCheckCircle,
            bg: "bg-slate-50",
            text: "text-slate-700",
            ring: "ring-slate-200",
            dot: "bg-slate-500",
        },
    };

    const info = map[status] || map.pending;
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
export default function ReservationCard({ reservation, index = 0 }) {
    const hall = reservation.hall_id || {};
    const title = hall.title || reservation.hall_title || "تالار";
    const city = hall.city || reservation.hall_city || "—";
    const province = hall.province || reservation.hall_province || "";
    const hallUrl = `/halls/${hall._id || reservation.hall_id || ""}`;

    /* تصویر تالار */
    const rawImage =
        (Array.isArray(hall.images) && hall.images[0]) ||
        hall.image ||
        reservation.hall_image;
    const imageUrl = normalizeImageUrl(rawImage);

    /* قیمت */
    const price = Number(
        reservation.total_price || reservation.price || hall.sans_price || 0
    );

    /* تاریخ‌ها */
    const startDate = formatDate(reservation.start_date);
    const endDate = formatDate(reservation.end_date);
    const createdDate = formatDate(reservation.createdAt);

    /* شماره رزرو (کوتاه) */
    const reservationNumber =
        reservation._id?.slice(-8).toUpperCase() || "—";

    /* وضعیت */
    const isActiveStatus =
        reservation.status === "pending" ||
        reservation.status === "approved" ||
        reservation.status === "confirmed";

    return (
        <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            className="
        group bg-white rounded-2xl
        ring-1 ring-slate-100 hover:ring-gold-200/70
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        hover:shadow-[0_12px_32px_-12px_rgba(198,161,76,0.18)]
        transition-all duration-400
        overflow-hidden
        flex flex-col md:flex-row
      "
        >
            {/* ==================== تصویر تالار ==================== */}
            <Link
                href={hallUrl}
                className="
          relative w-full md:w-56 lg:w-64
          h-44 md:h-auto flex-shrink-0
          overflow-hidden bg-slate-100
        "
            >
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 256px"
                    className="
            object-cover
            transition-transform duration-700
            group-hover:scale-105
          "
                />

                {/* گرادیانت */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden" />

                {/* وضعیت روی تصویر موبایل */}
                <div className="absolute top-3 right-3 md:hidden">
                    <StatusBadge status={reservation.status} />
                </div>
            </Link>

            {/* ==================== اطلاعات ==================== */}
            <div className="flex-1 p-4 sm:p-5 min-w-0 flex flex-col">
                {/* ردیف بالا: عنوان + وضعیت */}
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                        <Link href={hallUrl}>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-gold-700 transition-colors line-clamp-1">
                                {title}
                            </h3>
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <PiMapPin className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                            <span className="line-clamp-1">
                                {city}
                                {province && ` — ${province}`}
                            </span>
                        </div>
                    </div>

                    {/* وضعیت دسکتاپ */}
                    <div className="hidden md:block flex-shrink-0">
                        <StatusBadge status={reservation.status} />
                    </div>
                </div>

                {/* اطلاعات رزرو */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 my-3">
                    {/* تاریخ شروع */}
                    <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-0.5">
                            <PiCalendarBlank className="w-3 h-3" />
                            شروع
                        </div>
                        <p className="text-[12px] font-bold text-slate-800">
                            {startDate}
                        </p>
                    </div>

                    {/* تاریخ پایان */}
                    <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-0.5">
                            <PiCalendarBlank className="w-3 h-3" />
                            پایان
                        </div>
                        <p className="text-[12px] font-bold text-slate-800">
                            {endDate}
                        </p>
                    </div>

                    {/* تعداد مهمان */}
                    {reservation.guests_count && (
                        <div className="bg-slate-50 rounded-lg px-3 py-2">
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-0.5">
                                <PiUsersThree className="w-3 h-3" />
                                مهمان
                            </div>
                            <p className="text-[12px] font-bold text-slate-800">
                                {faNum(reservation.guests_count)} نفر
                            </p>
                        </div>
                    )}

                    {/* قیمت */}
                    {price > 0 && (
                        <div className="bg-gold-50 rounded-lg px-3 py-2 ring-1 ring-gold-100">
                            <div className="flex items-center gap-1 text-[10px] text-gold-700 mb-0.5">
                                <PiCurrencyCircleDollar className="w-3 h-3" />
                                مبلغ کل
                            </div>
                            <p className="text-[12px] font-bold text-gold-800">
                                {faNum(price)}
                                <span className="text-[9px] text-gold-600 mr-0.5">
                                    تومان
                                </span>
                            </p>
                        </div>
                    )}
                </div>

                {/* یادداشت */}
                {reservation.user_note && (
                    <div className="mb-3 p-2.5 bg-slate-50 rounded-lg flex items-start gap-2">
                        <PiNote className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                        <p className="text-[11.5px] text-slate-600 line-clamp-2 leading-relaxed">
                            {reservation.user_note}
                        </p>
                    </div>
                )}

                {/* ردیف پایین: شماره رزرو + اکشن‌ها */}
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                    <div className="text-[10.5px] text-slate-400">
                        <span>شماره رزرو: </span>
                        <span className="font-mono font-bold text-slate-600">
                            #{reservationNumber}
                        </span>
                        <span className="mx-1.5 text-slate-300">•</span>
                        <span>ثبت: {createdDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {hall.hall_phone && isActiveStatus && (
                            <a
                                href={`tel:${hall.hall_phone}`}
                                aria-label="تماس با تالار"
                                className="
                  inline-flex items-center justify-center gap-1.5
                  px-3 py-2 rounded-lg
                  text-[11px] font-medium
                  text-slate-600 bg-white
                  ring-1 ring-slate-200
                  hover:bg-slate-50 hover:ring-slate-300 hover:text-slate-800
                  transition-all duration-200
                "
                            >
                                <PiPhone className="w-3.5 h-3.5" />
                                تماس
                            </a>
                        )}

                        <Link
                            href={hallUrl}
                            className="
                inline-flex items-center justify-center gap-1.5
                px-3.5 py-2 rounded-lg
                text-[11px] font-bold text-white
                bg-gradient-to-b from-gold-400 to-gold-600
                hover:from-gold-500 hover:to-gold-700
                shadow-sm shadow-gold-500/25
                hover:shadow-md hover:shadow-gold-500/40
                transition-all duration-200
                group/btn
              "
                        >
                            <PiEye className="w-3.5 h-3.5" />
                            مشاهده تالار
                            <PiArrowLeft className="w-3 h-3 group-hover/btn:-translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}