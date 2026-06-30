"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    PiBus,
    PiUser,
    PiEnvelope,
    PiMapPin,
    PiCalendar,
    PiClock,
    PiChair,
    PiCurrencyDollar,
    PiCreditCard,
    PiCheckCircle,
    PiWarningCircle,
    PiHourglass,
    PiXCircle,
    PiEye,
    PiTrash,
    PiCaretLeft,
    PiCaretRight,
    PiCaretDoubleLeft,
    PiCaretDoubleRight,
    PiTicket
} from "react-icons/pi";

export default function AdminBusReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // صفحه‌بندی
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        async function fetchReservations() {
            try {
                setLoading(true);
                const url = `/api/admin/reservations/buses`;
                const res = await axios.get(url, { withCredentials: true });
                setReservations(res.data.reservations || []);
            } catch (err) {
                setError(err.response?.status || 500);
            } finally {
                setLoading(false);
            }
        }
        fetchReservations();
    }, []);

    // محاسبه تعداد صفحات
    useEffect(() => {
        setTotalPages(Math.ceil(reservations.length / itemsPerPage));
        setCurrentPage(1);
    }, [reservations, itemsPerPage]);

    // دریافت آیتم‌های صفحه جاری
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return reservations.slice(startIndex, endIndex);
    };

    // تغییر صفحه
    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        document.getElementById('bus-reservations-table')?.scrollIntoView({ behavior: 'smooth' });
    };

    // تولید شماره صفحات
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const currentItems = getCurrentPageItems();

    // وضعیت رزرو با رنگ و آیکون
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return { color: 'bg-yellow-100 text-yellow-700', icon: <PiHourglass className="w-3 h-3" />, text: 'در انتظار' };
            case 'confirmed':
                return { color: 'bg-green-100 text-green-700', icon: <PiCheckCircle className="w-3 h-3" />, text: 'تایید شده' };
            case 'canceled':
                return { color: 'bg-red-100 text-red-700', icon: <PiXCircle className="w-3 h-3" />, text: 'لغو شده' };
            case 'completed':
                return { color: 'bg-blue-100 text-blue-700', icon: <PiCheckCircle className="w-3 h-3" />, text: 'تکمیل شده' };
            default:
                return { color: 'bg-gray-100 text-gray-700', icon: <PiWarningCircle className="w-3 h-3" />, text: status };
        }
    };

    // فرمت قیمت
    const formatPrice = (price) => {
        return price?.toLocaleString() + " تومان";
    };

    // فرمت تاریخ
    const formatDate = (date) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("fa-IR");
    };

    // فرمت ساعت
    const formatDateTime = (date) => {
        if (!date) return "—";
        return new Date(date).toLocaleString("fa-IR");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-[#D4B06A] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600">در حال بارگذاری رزروها...</p>
                </div>
            </div>
        );
    }

    if (error === 401) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <PiWarningCircle className="w-20 h-20 text-red-400" />
                <p className="text-xl text-gray-700">ابتدا وارد شوید.</p>
            </div>
        );
    }

    if (error === 403) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <PiWarningCircle className="w-20 h-20 text-orange-400" />
                <p className="text-xl text-gray-700">دسترسی لازم را ندارید.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <PiWarningCircle className="w-20 h-20 text-red-500" />
                <p className="text-xl text-gray-700">خطا در دریافت داده‌ها (کد {error})</p>
            </div>
        );
    }

    return (
        <div className="adminBusReservationsPage" id="bus-reservations-table">
            {/* هدر صفحه */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gradient-to-r from-[#D4B06A] to-[#B8922E] p-2 rounded-xl">
                        <PiBus className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">
                        رزروهای اتوبوس
                    </h1>
                </div>
                <p className="text-gray-500 mr-12">
                    مدیریت و بررسی تمام رزروهای اتوبوس
                </p>
            </div>

            {reservations.length === 0 ? (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-12 text-center border border-gray-200">
                    <PiBus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">هیچ رزروی وجود ندارد.</p>
                </div>
            ) : (
                <>
                    {/* کنترل‌های صفحه‌بندی بالا */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden mb-4">
                        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">نمایش:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#D4B06A]"
                                >
                                    <option value={5}>۵</option>
                                    <option value={10}>۱۰</option>
                                    <option value={20}>۲۰</option>
                                    <option value={50}>۵۰</option>
                                </select>
                                <span className="text-sm text-gray-600">ردیف</span>
                            </div>

                            <div className="text-sm text-gray-600">
                                نمایش <span className="font-bold text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</span>
                                {' تا '}
                                <span className="font-bold text-gray-800">
                                    {Math.min(currentPage * itemsPerPage, reservations.length)}
                                </span>
                                {' از '}
                                <span className="font-bold text-gray-800">{reservations.length}</span>
                                {' رزرو'}
                            </div>
                        </div>

                        {/* جدول - نسخه دسکتاپ */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full min-w-[1000px]">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                        <th className="text-right p-4 font-bold text-gray-700">ردیف</th>
                                        <th className="text-right p-4 font-bold text-gray-700">کاربر</th>
                                        <th className="text-right p-4 font-bold text-gray-700">مسیر</th>
                                        <th className="text-right p-4 font-bold text-gray-700">زمان حرکت</th>
                                        <th className="text-right p-4 font-bold text-gray-700">صندلی</th>
                                        <th className="text-right p-4 font-bold text-gray-700">قیمت</th>
                                        <th className="text-right p-4 font-bold text-gray-700">وضعیت</th>
                                        <th className="text-right p-4 font-bold text-gray-700">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((reservation, index) => {
                                        const statusBadge = getStatusBadge(reservation.status);
                                        return (
                                            <motion.tr
                                                key={reservation._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.03 }}
                                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="p-4 text-gray-500">
                                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1 text-gray-800">
                                                            <PiUser className="w-4 h-4 text-[#D4B06A]" />
                                                            <span className="font-medium">{reservation.user_id?.name || "نامشخص"}</span>
                                                        </div>
                                                        {reservation.user_id?.email && (
                                                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                                                                <PiEnvelope className="w-3 h-3" />
                                                                <span>{reservation.user_id.email}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                                                            <PiMapPin className="w-4 h-4 text-[#D4B06A]" />
                                                            <span>{reservation.bus_id?.origin || "نامشخص"}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                                                            <PiMapPin className="w-4 h-4 text-red-500" />
                                                            <span>{reservation.bus_id?.destination || "نامشخص"}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                                                        <PiClock className="w-4 h-4 text-[#D4B06A]" />
                                                        <span>{formatDateTime(reservation.bus_id?.departure_time)}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <PiChair className="w-4 h-4 text-[#D4B06A]" />
                                                        <span>{reservation.seats?.toLocaleString()} عدد</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-1 text-gray-800 font-bold">
                                                        <PiCurrencyDollar className="w-4 h-4 text-green-600" />
                                                        <span>{formatPrice(reservation.total_price)}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${statusBadge.color}`}>
                                                        {statusBadge.icon}
                                                        {statusBadge.text}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                            <PiEye className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                            <PiTrash className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* جدول با ستون‌های کمتر - تبلت */}
                        <div className="hidden md:block lg:hidden overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                        <th className="text-right p-4 font-bold text-gray-700">ردیف</th>
                                        <th className="text-right p-4 font-bold text-gray-700">کاربر / مسیر</th>
                                        <th className="text-right p-4 font-bold text-gray-700">زمان حرکت</th>
                                        <th className="text-right p-4 font-bold text-gray-700">قیمت</th>
                                        <th className="text-right p-4 font-bold text-gray-700">وضعیت</th>
                                        <th className="text-right p-4 font-bold text-gray-700">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((reservation, index) => {
                                        const statusBadge = getStatusBadge(reservation.status);
                                        return (
                                            <motion.tr
                                                key={reservation._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="p-4 text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                <td className="p-4">
                                                    <div className="font-medium text-gray-800">{reservation.user_id?.name || "نامشخص"}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{reservation.bus_id?.origin} → {reservation.bus_id?.destination}</div>
                                                </td>
                                                <td className="p-4 text-gray-600 text-sm">{formatDateTime(reservation.bus_id?.departure_time)}</td>
                                                <td className="p-4 text-gray-800 font-medium">{formatPrice(reservation.total_price)}</td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${statusBadge.color}`}>
                                                        {statusBadge.icon}
                                                        {statusBadge.text}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                            <PiEye className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* نمای کارتی - موبایل */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {currentItems.map((reservation, index) => {
                                const statusBadge = getStatusBadge(reservation.status);
                                return (
                                    <motion.div
                                        key={reservation._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <span className="text-xs text-gray-400">#{(currentPage - 1) * itemsPerPage + index + 1}</span>
                                                <h3 className="font-bold text-gray-800 text-base mt-1">{reservation.user_id?.name || "نامشخص"}</h3>
                                            </div>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${statusBadge.color}`}>
                                                {statusBadge.icon}
                                                {statusBadge.text}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <PiMapPin className="w-4 h-4 text-[#D4B06A]" />
                                                <span>{reservation.bus_id?.origin} → {reservation.bus_id?.destination}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-600">
                                                <PiClock className="w-4 h-4 text-[#D4B06A]" />
                                                <span>{formatDateTime(reservation.bus_id?.departure_time)}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-600">
                                                <PiChair className="w-4 h-4 text-[#D4B06A]" />
                                                <span>{reservation.seats?.toLocaleString()} صندلی</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-800 font-bold">
                                                <PiCurrencyDollar className="w-4 h-4 text-green-600" />
                                                <span>{formatPrice(reservation.total_price)}</span>
                                            </div>

                                            {reservation.payment_id && (
                                                <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                    <PiCreditCard className="w-3 h-3" />
                                                    <span>پرداخت: {reservation.payment_id}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                                            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg text-sm">
                                                <PiEye className="w-4 h-4" />
                                                مشاهده
                                            </button>
                                            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg text-sm">
                                                <PiTicket className="w-4 h-4" />
                                                جزئیات
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* صفحه‌بندی پایین */}
                        <div className="bg-gray-50 px-4 py-4 border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-sm text-gray-600">
                                    صفحه {currentPage} از {totalPages}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => goToPage(1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <PiCaretDoubleRight className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <PiCaretRight className="w-5 h-5" />
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {getPageNumbers().map((page, idx) => (
                                            page === '...' ? (
                                                <span key={idx} className="px-3 py-1 text-gray-500">...</span>
                                            ) : (
                                                <button
                                                    key={idx}
                                                    onClick={() => goToPage(page)}
                                                    className={`min-w-[40px] h-10 rounded-lg font-medium transition-all ${currentPage === page
                                                        ? "bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white shadow-md"
                                                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <PiCaretLeft className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={() => goToPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <PiCaretDoubleLeft className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style jsx>{`
        .adminBusReservationsPage {
          direction: rtl;
        }
      `}</style>
        </div>
    );
}