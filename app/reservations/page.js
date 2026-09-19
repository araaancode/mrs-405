// app/reservations/page.js
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
    PiCalendarCheck,
    PiBuilding,
    PiCalendar,
    PiUsers,
    PiCurrencyDollar,
    PiPercent,
    PiTicket,
    PiCheckCircle,
    PiXCircle,
    PiClock,
    PiHourglass,
    PiWarningCircle,
    PiNote,
    PiChatText,
    PiCreditCard,
    PiBarcode,
    PiIdentificationBadge,
    PiSpinner,
    PiBank,
    PiArrowDown
} from "react-icons/pi";

// ==========================================
// کامپوننت اصلی
// ==========================================
export default function ReservationsPage() {
    // State ها
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCard, setExpandedCard] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);

    // بررسی وضعیت پرداخت
    useEffect(() => {
        if (typeof window === "undefined") return;

        const searchParams = new URLSearchParams(window.location.search);
        const payment = searchParams.get("payment");
        const ref = searchParams.get("ref");

        if (payment) {
            switch (payment) {
                case "success":
                    toast.success(`✓ پرداخت موفق! کد: ${ref || "—"}`);
                    break;
                case "canceled":
                    toast.error("پرداخت لغو شد");
                    break;
                case "failed":
                    toast.error("پرداخت ناموفق");
                    break;
                case "error":
                    toast.error("خطا در پرداخت");
                    break;
                case "duplicate":
                    toast.info("قبلاً تایید شده");
                    break;
            }

            window.history.replaceState({}, "", "/reservations");
        }
    }, []);

    // بارگذاری رزروها
    useEffect(() => {
        async function loadReservations() {
            try {
                setLoading(true);
                const response = await axios.get(
                    "/api/user/hall_reservations",
                    { withCredentials: true }
                );
                setReservations(response.data.reservations || []);
            } catch (error) {
                console.error("Error:", error);
                toast.error("خطا در دریافت رزروها");
            } finally {
                setLoading(false);
            }
        }
        loadReservations();
    }, []);

    // پرداخت
    const handlePayment = async (reservationId) => {
        try {
            setPaymentLoading(reservationId);

            const response = await fetch("/api/payment/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reservationId }),
                credentials: "include"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "خطا در پرداخت");
            }

            if (data.redirectUrl) {
                sessionStorage.setItem("paymentAuthority", data.authority);
                sessionStorage.setItem("paymentReservationId", reservationId);
                window.location.href = data.redirectUrl;
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error(error.message || "خطا در شروع پرداخت");
        } finally {
            setPaymentLoading(null);
        }
    };

    // لودینگ
    if (loading) {
        return (
            <>
                <Toaster position="top-right" />
                <div className="flex flex-col items-center justify-center py-20">
                    <PiSpinner className="w-12 h-12 text-[#D4B06A] animate-spin mb-4" />
                    <p className="text-gray-500 text-sm">در حال بارگذاری...</p>
                </div>
            </>
        );
    }

    // خالی
    if (reservations.length === 0) {
        return (
            <>
                <Toaster position="top-right" />
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#D4B06A]/10 to-[#B8922E]/10 rounded-full flex items-center justify-center mb-6">
                        <PiCalendarCheck className="w-12 h-12 text-[#D4B06A]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2C2418] mb-2">
                        هیچ رزروی یافت نشد
                    </h3>
                    <p className="text-gray-500 text-sm">
                        شما هنوز رزروی انجام نداده‌اید
                    </p>
                </div>
            </>
        );
    }

    // رندر اصلی
    return (
        <>
            <Toaster position="top-right" />
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* هدر */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 rounded-xl">
                            <PiCalendarCheck className="w-8 h-8 text-[#D4B06A]" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-[#2C2418]">
                            رزروهای من
                        </h2>
                    </div>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mt-2" />
                </div>

                {/* لیست */}
                <div className="space-y-6">
                    {reservations.map((reservation, index) => (
                        <ReservationCard
                            key={reservation._id}
                            data={reservation}
                            index={index}
                            isExpanded={expandedCard === reservation._id}
                            onToggle={() =>
                                setExpandedCard(
                                    expandedCard === reservation._id
                                        ? null
                                        : reservation._id
                                )
                            }
                            onPayment={handlePayment}
                            paymentLoading={paymentLoading}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

// ==========================================
// کارت رزرو
// ==========================================
function ReservationCard({
    data,
    index,
    isExpanded,
    onToggle,
    onPayment,
    paymentLoading
}) {
    const {
        _id,
        hall_id,
        start_date,
        end_date,
        guests_count,
        base_price,
        discount,
        final_price,
        pre_payment,
        status,
        user_note,
        owner_note,
        reviewed_at,
        is_confirmed_by_owner,
        cancel_reason,
        payment_info,
        createdAt,
        updatedAt
    } = data;

    const getStatusColor = () => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "accepted":
                return "bg-green-100 text-green-700 border-green-200";
            case "rejected":
                return "bg-red-100 text-red-700 border-red-200";
            case "canceled_by_user":
            case "canceled_by_owner":
                return "bg-orange-100 text-orange-700 border-orange-200";
            case "paid":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "completed":
                return "bg-purple-100 text-purple-700 border-purple-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case "pending":
                return <PiHourglass className="w-4 h-4" />;
            case "accepted":
            case "paid":
            case "completed":
                return <PiCheckCircle className="w-4 h-4" />;
            case "rejected":
                return <PiXCircle className="w-4 h-4" />;
            case "canceled_by_user":
            case "canceled_by_owner":
                return <PiWarningCircle className="w-4 h-4" />;
            default:
                return <PiClock className="w-4 h-4" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all overflow-hidden"
        >
            <div
                className="p-4 cursor-pointer hover:bg-gray-50/50 transition"
                onClick={onToggle}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#D4B06A]/10 to-[#B8922E]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <PiBuilding className="w-6 h-6 text-[#D4B06A]" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-[#2C2418] text-lg truncate">
                                رزرو #
                                {typeof _id === "string" ? _id.slice(-8) : _id}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor()}`}
                                >
                                    {getStatusIcon()}
                                    {translateStatus(status)}
                                </span>
                                {is_confirmed_by_owner && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                        <PiCheckCircle className="w-3 h-3" />
                                        تایید مالک
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-6">
                            <div>
                                <p className="text-xs text-gray-500">قیمت نهایی</p>
                                <p className="font-bold text-[#D4B06A] text-lg">
                                    {formatMoney(final_price)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">پیش‌پرداخت</p>
                                <p className="font-bold text-blue-600 text-lg">
                                    {formatMoney(pre_payment)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">تاریخ شروع</p>
                                <p className="text-sm font-medium text-gray-700">
                                    {formatDate(start_date)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {status === "pending" && pre_payment > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPayment?.(_id);
                                    }}
                                    disabled={paymentLoading === _id}
                                    className="px-4 py-2 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-70"
                                >
                                    {paymentLoading === _id ? (
                                        <>
                                            <PiSpinner className="w-4 h-4 animate-spin" />
                                            در حال...
                                        </>
                                    ) : (
                                        <>
                                            <PiCreditCard className="w-4 h-4" />
                                            پرداخت
                                        </>
                                    )}
                                </button>
                            )}
                            {status === "paid" && (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold flex items-center gap-1">
                                    <PiCheckCircle className="w-4 h-4" />
                                    پرداخت شده
                                </span>
                            )}
                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                className="text-gray-400"
                            >
                                <PiArrowDown className="w-5 h-5" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-gray-100"
                    >
                        <div className="p-4 bg-gradient-to-br from-gray-50/50 to-white">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* اطلاعات تالار */}
                                <div className="space-y-3">
                                    <h4 className="font-bold text-[#2C2418] flex items-center gap-2 text-sm">
                                        <div className="w-1 h-4 bg-gradient-to-b from-[#D4B06A] to-[#B8922E] rounded-full" />
                                        اطلاعات تالار
                                    </h4>
                                    <div className="space-y-2">
                                        <Item
                                            icon={<PiBuilding className="w-4 h-4" />}
                                            label="شناسه تالار"
                                            value={
                                                typeof hall_id === "object"
                                                    ? hall_id._id || ""
                                                    : hall_id
                                            }
                                        />
                                        <Item
                                            icon={<PiCalendar className="w-4 h-4" />}
                                            label="تاریخ شروع"
                                            value={formatDate(start_date)}
                                        />
                                        <Item
                                            icon={<PiCalendar className="w-4 h-4" />}
                                            label="تاریخ پایان"
                                            value={formatDate(end_date)}
                                        />
                                        <Item
                                            icon={<PiUsers className="w-4 h-4" />}
                                            label="تعداد مهمان"
                                            value={`${guests_count} نفر`}
                                        />
                                    </div>
                                </div>

                                {/* اطلاعات مالی */}
                                <div className="space-y-3">
                                    <h4 className="font-bold text-[#2C2418] flex items-center gap-2 text-sm">
                                        <div className="w-1 h-4 bg-gradient-to-b from-[#D4B06A] to-[#B8922E] rounded-full" />
                                        اطلاعات مالی
                                    </h4>
                                    <div className="space-y-2">
                                        <Item
                                            icon={<PiCurrencyDollar className="w-4 h-4" />}
                                            label="قیمت پایه"
                                            value={formatMoney(base_price)}
                                        />
                                        <Item
                                            icon={<PiPercent className="w-4 h-4" />}
                                            label="درصد تخفیف"
                                            value={discount ? `${discount}%` : "—"}
                                        />
                                        <Item
                                            icon={<PiTicket className="w-4 h-4" />}
                                            label="قیمت نهایی"
                                            value={formatMoney(final_price)}
                                            highlight
                                        />
                                        <Item
                                            icon={<PiBank className="w-4 h-4" />}
                                            label="پیش‌پرداخت"
                                            value={formatMoney(pre_payment)}
                                        />
                                    </div>
                                </div>

                                {/* اطلاعات پرداخت */}
                                <div className="space-y-3">
                                    <h4 className="font-bold text-[#2C2418] flex items-center gap-2 text-sm">
                                        <div className="w-1 h-4 bg-gradient-to-b from-[#D4B06A] to-[#B8922E] rounded-full" />
                                        اطلاعات پرداخت
                                    </h4>
                                    <div className="space-y-2">
                                        <Item
                                            icon={<PiBarcode className="w-4 h-4" />}
                                            label="کد پیگیری"
                                            value={payment_info?.tracking_code || "—"}
                                        />
                                        <Item
                                            icon={<PiIdentificationBadge className="w-4 h-4" />}
                                            label="رسید پرداخت"
                                            value={payment_info?.ref_id || "—"}
                                        />
                                        <Item
                                            icon={<PiCreditCard className="w-4 h-4" />}
                                            label="زمان پرداخت"
                                            value={
                                                payment_info?.paid_at
                                                    ? formatDateTime(payment_info.paid_at)
                                                    : "—"
                                            }
                                        />
                                    </div>
                                </div>

                                {/* یادداشت‌ها */}
                                {(user_note || owner_note) && (
                                    <div className="space-y-3 sm:col-span-2 lg:col-span-3">
                                        <h4 className="font-bold text-[#2C2418] flex items-center gap-2 text-sm">
                                            <div className="w-1 h-4 bg-gradient-to-b from-[#D4B06A] to-[#B8922E] rounded-full" />
                                            یادداشت‌ها
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {user_note && (
                                                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                                    <div className="flex items-center gap-2 text-blue-700 text-xs font-medium mb-2">
                                                        <PiNote className="w-4 h-4" />
                                                        یادداشت کاربر
                                                    </div>
                                                    <p className="text-sm text-gray-700">
                                                        {user_note}
                                                    </p>
                                                </div>
                                            )}
                                            {owner_note && (
                                                <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                                                    <div className="flex items-center gap-2 text-purple-700 text-xs font-medium mb-2">
                                                        <PiChatText className="w-4 h-4" />
                                                        یادداشت مالک
                                                    </div>
                                                    <p className="text-sm text-gray-700">
                                                        {owner_note}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* اطلاعات سیستمی */}
                                <div className="space-y-3 sm:col-span-2 lg:col-span-3">
                                    <h4 className="font-bold text-[#2C2418] flex items-center gap-2 text-sm">
                                        <div className="w-1 h-4 bg-gradient-to-b from-[#D4B06A] to-[#B8922E] rounded-full" />
                                        اطلاعات سیستمی
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="text-xs text-gray-500">
                                            <span className="font-medium text-gray-700">
                                                زمان ایجاد:
                                            </span>{" "}
                                            {formatDateTime(createdAt)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            <span className="font-medium text-gray-700">
                                                آخرین بروزرسانی:
                                            </span>{" "}
                                            {formatDateTime(updatedAt)}
                                        </div>
                                        {reviewed_at && (
                                            <div className="text-xs text-gray-500">
                                                <span className="font-medium text-gray-700">
                                                    تاریخ بررسی:
                                                </span>{" "}
                                                {formatDateTime(reviewed_at)}
                                            </div>
                                        )}
                                        {cancel_reason && (
                                            <div className="text-xs text-red-600 col-span-full">
                                                <span className="font-medium">
                                                    دلیل لغو:
                                                </span>{" "}
                                                {cancel_reason}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ==========================================
// کامپوننت آیتم
// ==========================================
function Item({ icon, label, value, highlight = false }) {
    return (
        <div className="flex items-start gap-2 text-sm">
            <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
                <span className="text-gray-500 text-xs block">{label}</span>
                <span
                    className={`font-medium break-words ${highlight
                            ? "text-[#D4B06A] text-base"
                            : "text-gray-700 text-sm"
                        }`}
                >
                    {value}
                </span>
            </div>
        </div>
    );
}

// ==========================================
// توابع کمکی
// ==========================================
function translateStatus(status) {
    switch (status) {
        case "pending":
            return "در انتظار تایید";
        case "accepted":
            return "تایید شده";
        case "rejected":
            return "رد شده";
        case "canceled_by_user":
            return "لغو توسط کاربر";
        case "canceled_by_owner":
            return "لغو توسط مالک";
        case "completed":
            return "تکمیل شده";
        case "paid":
            return "پرداخت شده";
        default:
            return status;
    }
}

function formatDate(value) {
    if (!value) return "—";
    try {
        const date = new Date(value);
        if (isNaN(date.getTime())) return "—";
        return date.toLocaleDateString("fa-IR");
    } catch {
        return "—";
    }
}

function formatDateTime(value) {
    if (!value) return "—";
    try {
        const date = new Date(value);
        if (isNaN(date.getTime())) return "—";
        return date.toLocaleString("fa-IR");
    } catch {
        return "—";
    }
}

function formatMoney(number) {
    return typeof number === "number"
        ? number.toLocaleString("fa-IR") + " تومان"
        : "—";
}