"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
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
    PiReceipt,
    PiBank,
    PiArrowRight
} from "react-icons/pi";

export default function ReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const response = await axios.get("/api/user/hall_reservations", {
                    withCredentials: true
                });
                setReservations(response.data.reservations || []);
            } catch (error) {
                console.error("Axios error:", error.response?.data || error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4">
                <PiSpinner className="w-12 h-12 text-[#D4B06A] animate-spin mb-4" />
                <p className="text-gray-500 text-sm">در حال بارگذاری رزروها...</p>
            </div>
        );
    }

    if (reservations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#D4B06A]/10 to-[#B8922E]/10 rounded-full flex items-center justify-center mb-6">
                    <PiCalendarCheck className="w-12 h-12 text-[#D4B06A]" />
                </div>
                <h3 className="text-xl font-bold text-[#2C2418] mb-2">هیچ رزروی یافت نشد</h3>
                <p className="text-gray-500 text-sm">شما هنوز هیچ رزروی انجام نداده‌اید</p>
            </div>
        );
    }

    return (
        <div className="reservations-page max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
            {/* هدر صفحه */}
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 rounded-lg sm:rounded-xl">
                        <PiCalendarCheck className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4B06A]" />
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#2C2418]">
                        رزروهای من
                    </h2>
                </div>
                <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mt-2" />
                <p className="text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3">
                    لیست کامل رزروهای تالارهای شما
                </p>
            </div>

            {/* لیست رزروها */}
            <div className="space-y-4 sm:space-y-6">
                {reservations.map((r, index) => (
                    <ReservationCard
                        key={r._id}
                        data={r}
                        index={index}
                        isExpanded={expandedCard === r._id}
                        onToggle={() => setExpandedCard(expandedCard === r._id ? null : r._id)}
                    />
                ))}
            </div>
        </div>
    );
}

function ReservationCard({ data, index, isExpanded, onToggle }) {
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

    const getStatusIcon = () => {
        switch (status) {
            case "pending":
                return <PiHourglass className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
            case "accepted":
                return <PiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
            case "rejected":
                return <PiXCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
            case "canceled":
                return <PiWarningCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />;
            default:
                return <PiClock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />;
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "accepted":
                return "bg-green-100 text-green-700 border-green-200";
            case "rejected":
                return "bg-red-100 text-red-700 border-red-200";
            case "canceled":
                return "bg-orange-100 text-orange-700 border-orange-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
            {/* هدر کارت - همیشه قابل مشاهده */}
            <div
                className="p-3 sm:p-4 md:p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={onToggle}
            >
                <div className="flex flex-col gap-3 sm:gap-4">
                    {/* ردیف اول: آیکون و عنوان */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#D4B06A]/10 to-[#B8922E]/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                            <PiBuilding className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4B06A]" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-[#2C2418] text-base sm:text-lg truncate">
                                رزرو #{typeof _id === "string" ? _id.slice(-8) : _id}
                            </h3>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium border ${getStatusColor()}`}>
                                    {getStatusIcon()}
                                    {translateStatus(status)}
                                </span>
                                {is_confirmed_by_owner && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                        <PiCheckCircle className="w-3 h-3" />
                                        تایید مالک
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ردیف دوم: اطلاعات قیمت و تاریخ */}
                    <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500">قیمت نهایی</p>
                                <p className="font-bold text-[#D4B06A] text-sm sm:text-lg">{formatMoney(final_price)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500">تاریخ شروع</p>
                                <p className="text-xs sm:text-sm font-medium text-gray-700">{formatDate(start_date)}</p>
                            </div>
                        </div>
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-gray-400 ml-auto sm:ml-0"
                        >
                            <PiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* جزئیات کارت - نمایش با انیمیشن */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-gray-100"
                    >
                        <div className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-gray-50/50 to-white">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                                {/* اطلاعات تالار */}
                                <div className="space-y-2 sm:space-y-3">
                                    <h4 className="font-bold text-[#2C2418] flex items-center gap-2 text-xs sm:text-sm">
                                        <div className="w-1 h-3 sm:h-4 bg-gradient-to-b from-[#D4B06A] to-[#B8922E] rounded-full" />
                                        اطلاعات تالار
                                    </h4>
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <Item
                                            icon={<PiBuilding className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                            label="شناسه تالار"
                                            value={typeof hall_id === "object" ? hall_id._id || "" : hall_id}
                                        />
                                        <Item
                                            icon={<PiCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                            label="تاریخ شروع"
                                            value={formatDate(start_date)}
                                        />
                                        <Item
                                            icon={<PiCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                            label="تاریخ پایان"
                                            value={formatDate(end_date)}
                                        />
                                        <Item
                                            icon={<PiUsers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                            label="تعداد مهمان"
                                            value={`${guests_count} نفر`}
                                        />
                                    </div>
                                </div>

                                {/* اطلاعات مالی */}
                                <div className="space-y-2 sm:space-y-3">
                                    <h4 className="font-bold text-[#2C2418] flex items-center gap-2 text-xs sm:text-sm">
                                        <div className="w-1 h-3 sm:h-4 bg-gradient-to-b from-[#D4B06A] to-[#B8922E] rounded-full" />
                                        اطلاعات مالی
                                    </h4>
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <Item
                                            icon={<PiCurrencyDollar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                            label="قیمت پایه"
                                            value={formatMoney(base_price)}
                                        />
                                        <Item
                                            icon={<PiPercent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                            label="درصد تخفیف"
                                            value={discount ? `${discount}%` : "—"}
                                        />
                                        <Item
                                            icon={<PiTicket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                            label="قیمت نهایی"
                                            value={formatMoney(final_price)}
                                            highlight
                                        />
                                        <Item
                                            icon={<PiBank className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                            label="پیش‌پرداخت"
                                            value={formatMoney(pre_payment)}
                                        />
                                    </div>
                                </div>

                                {/* اطلاعات پرداخت */}
                                <div className="space-y-2 sm:space-y-3">
                                    <h4 className="font-bold text-[#2C2418] flex items-center gap-2 text-xs sm:text-sm">
                                        <div className="w-1 h-3 sm:h-4 bg-gradient-to-b from-[#D4B06A] to-[#B8922E] rounded-full" />
                                        اطلاعات پرداخت
                                    </h4>
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <Item
                                            icon={<PiBarcode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                            label="کد پیگیری"
                                            value={payment_info?.tracking_code || "—"}
                                        />
                                        <Item
                                            icon={<PiIdentificationBadge className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                            label="رسید پرداخت"
                                            value={payment_info?.ref_id || "—"}
                                        />
                                        <Item
                                            icon={<PiCreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                            label="زمان پرداخت"
                                            value={payment_info?.paid_at ? formatDateTime(payment_info.paid_at) : "—"}
                                        />
                                    </div>
                                </div>

                                {/* یادداشت‌ها */}
                                {(user_note || owner_note) && (
                                    <div className="space-y-2 sm:space-y-3 sm:col-span-2 lg:col-span-3">
                                        <h4 className="font-bold text-[#2C2418] flex items-center gap-2 text-xs sm:text-sm">
                                            <div className="w-1 h-3 sm:h-4 bg-gradient-to-b from-[#D4B06A] to-[#B8922E] rounded-full" />
                                            یادداشت‌ها
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            {user_note && (
                                                <div className="bg-blue-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-blue-100">
                                                    <div className="flex items-center gap-1.5 sm:gap-2 text-blue-700 text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2">
                                                        <PiNote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        یادداشت کاربر
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-gray-700 break-words">{user_note}</p>
                                                </div>
                                            )}
                                            {owner_note && (
                                                <div className="bg-purple-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-purple-100">
                                                    <div className="flex items-center gap-1.5 sm:gap-2 text-purple-700 text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2">
                                                        <PiChatText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        یادداشت مالک
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-gray-700 break-words">{owner_note}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* اطلاعات سیستمی */}
                                <div className="space-y-2 sm:space-y-3 sm:col-span-2 lg:col-span-3">
                                    <h4 className="font-bold text-[#2C2418] flex items-center gap-2 text-xs sm:text-sm">
                                        <div className="w-1 h-3 sm:h-4 bg-gradient-to-b from-[#D4B06A] to-[#B8922E] rounded-full" />
                                        اطلاعات سیستمی
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                                        <div className="text-[10px] sm:text-xs text-gray-500">
                                            <span className="font-medium text-gray-700">زمان ایجاد:</span> {formatDateTime(createdAt)}
                                        </div>
                                        <div className="text-[10px] sm:text-xs text-gray-500">
                                            <span className="font-medium text-gray-700">آخرین بروزرسانی:</span> {formatDateTime(updatedAt)}
                                        </div>
                                        {reviewed_at && (
                                            <div className="text-[10px] sm:text-xs text-gray-500">
                                                <span className="font-medium text-gray-700">تاریخ بررسی:</span> {formatDateTime(reviewed_at)}
                                            </div>
                                        )}
                                        {cancel_reason && (
                                            <div className="text-[10px] sm:text-xs text-red-600 col-span-full">
                                                <span className="font-medium">دلیل لغو:</span> {cancel_reason}
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

// کامپوننت نمایش آیتم با آیکون
function Item({ icon, label, value, highlight = false }) {
    return (
        <div className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
                <span className="text-gray-500 text-[10px] sm:text-xs block">{label}</span>
                <span className={`font-medium break-words ${highlight ? 'text-[#D4B06A] text-sm sm:text-base' : 'text-gray-700 text-xs sm:text-sm'}`}>
                    {value}
                </span>
            </div>
        </div>
    );
}

// ترجمه وضعیت رزرو
function translateStatus(status) {
    switch (status) {
        case "pending":
            return "در انتظار تایید";
        case "accepted":
            return "تایید شده";
        case "rejected":
            return "رد شده";
        case "canceled":
            return "لغو شده";
        default:
            return status;
    }
}

// فرمت تاریخ
function formatDate(value) {
    return value ? new Date(value).toLocaleDateString("fa-IR") : "—";
}

function formatDateTime(value) {
    return value ? new Date(value).toLocaleString("fa-IR") : "—";
}

// فرمت پول
function formatMoney(number) {
    return typeof number === "number"
        ? number.toLocaleString("fa-IR") + " تومان"
        : "—";
}