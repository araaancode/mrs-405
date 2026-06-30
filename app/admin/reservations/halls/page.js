"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    PiBuilding,
    PiUser,
    PiEnvelope,
    PiCalendar,
    PiClock,
    PiUsers,
    PiCurrencyDollar,
    PiPercent,
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
import { PulseLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";

export default function AdminHallReservationsPage() {
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
                const url = `/api/admin/reservations/halls`;
                const res = await axios.get(url, { withCredentials: true });
                setReservations(res.data.reservations || []);

                if (res.data.reservations?.length > 0) {
                    toast.success(`${res.data.reservations.length} رزرو با موفقیت بارگذاری شد`, {
                        duration: 2000,
                        position: "bottom-center",
                        icon: "✅",
                        style: {
                            background: "#F0FDF4",
                            color: "#166534",
                            borderRadius: "12px",
                            padding: "12px 20px",
                            fontSize: "14px",
                            fontWeight: "600",
                            border: "1px solid #86EFAC",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                        }
                    });
                }
            } catch (err) {
                setError(err.response?.status || 500);
                toast.error("خطا در دریافت رزروها", {
                    duration: 3000,
                    position: "bottom-center",
                    icon: "❌",
                    style: {
                        background: "#FEF2F2",
                        color: "#991B1B",
                        borderRadius: "12px",
                        padding: "12px 20px",
                        fontSize: "14px",
                        fontWeight: "600",
                        border: "1px solid #FCA5A5",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                    }
                });
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
        document.getElementById('reservations-table')?.scrollIntoView({ behavior: 'smooth' });
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

    if (loading) {
        return (
            <div className="loading-container">
                <PulseLoader color="#D4B06A" size={15} margin={6} />
                <p>در حال بارگذاری رزروها...</p>
            </div>
        );
    }

    if (error === 401) {
        return (
            <div className="error-container">
                <PiWarningCircle className="error-icon" />
                <p className="error-text">لطفاً وارد شوید.</p>
            </div>
        );
    }

    if (error === 403) {
        return (
            <div className="error-container">
                <PiWarningCircle className="error-icon warning" />
                <p className="error-text">شما دسترسی لازم را ندارید.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <PiWarningCircle className="error-icon error" />
                <p className="error-text">خطا در دریافت رزروها (کد: {error})</p>
            </div>
        );
    }

    return (
        <div className="adminHallReservationsPage" id="reservations-table">
            <Toaster />

            {/* هدر صفحه */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <PiBuilding className="header-icon-svg" />
                    </div>
                    <div>
                        <h1 className="header-title">رزروهای تالار</h1>
                        <p className="header-subtitle">مدیریت و بررسی تمام رزروهای تالار</p>
                    </div>
                </div>
                <div className="header-line" />
            </div>

            {reservations.length === 0 ? (
                <div className="empty-state">
                    <PiBuilding className="empty-icon" />
                    <p className="empty-text">هیچ رزروی وجود ندارد.</p>
                </div>
            ) : (
                <>
                    {/* کنترل‌های صفحه‌بندی بالا */}
                    <div className="table-container">
                        <div className="table-controls">
                            <div className="controls-left">
                                <span className="controls-label">نمایش:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                    className="controls-select"
                                >
                                    <option value={5}>۵</option>
                                    <option value={10}>۱۰</option>
                                    <option value={20}>۲۰</option>
                                    <option value={50}>۵۰</option>
                                </select>
                                <span className="controls-label">ردیف</span>
                            </div>

                            <div className="controls-right">
                                نمایش <span className="highlight">{(currentPage - 1) * itemsPerPage + 1}</span>
                                {' تا '}
                                <span className="highlight">
                                    {Math.min(currentPage * itemsPerPage, reservations.length)}
                                </span>
                                {' از '}
                                <span className="highlight">{reservations.length}</span>
                                {' رزرو'}
                            </div>
                        </div>

                        {/* جدول - نسخه دسکتاپ */}
                        <div className="table-desktop">
                            <table className="table">
                                <thead>
                                    <tr className="table-header">
                                        <th className="table-th">ردیف</th>
                                        <th className="table-th">تالار / کاربر</th>
                                        <th className="table-th">تاریخ رزرو</th>
                                        <th className="table-th">مهمان‌ها</th>
                                        <th className="table-th">قیمت</th>
                                        <th className="table-th">وضعیت</th>
                                        <th className="table-th">عملیات</th>
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
                                                className="table-row"
                                            >
                                                <td className="table-td text-gray-500">
                                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                                </td>
                                                <td className="table-td">
                                                    <div className="hall-name">{reservation.hall_id?.title || "نامشخص"}</div>
                                                    <div className="user-info">
                                                        <PiUser className="user-icon" />
                                                        <span>{reservation.user_id?.name || "نامشخص"}</span>
                                                    </div>
                                                    {reservation.user_id?.email && (
                                                        <div className="user-email">
                                                            <PiEnvelope className="email-icon" />
                                                            <span>{reservation.user_id.email}</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="table-td">
                                                    <div className="date-info">
                                                        <div className="date-row">
                                                            <PiCalendar className="date-icon" />
                                                            <span>{formatDate(reservation.start_date)}</span>
                                                        </div>
                                                        <div className="date-row">
                                                            <PiClock className="clock-icon" />
                                                            <span>تا {formatDate(reservation.end_date)}</span>
                                                        </div>
                                                        <div className="date-duration">
                                                            {reservation.duration_days} روز
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="table-td">
                                                    <div className="guests-info">
                                                        <PiUsers className="guests-icon" />
                                                        <span>{reservation.guests_count?.toLocaleString()} نفر</span>
                                                    </div>
                                                </td>
                                                <td className="table-td">
                                                    <div className="price-info">
                                                        <div className="price-amount">
                                                            <PiCurrencyDollar className="price-icon" />
                                                            <span>{formatPrice(reservation.final_price)}</span>
                                                        </div>
                                                        {reservation.discount > 0 && (
                                                            <div className="price-discount">
                                                                <PiPercent className="discount-icon" />
                                                                <span>{reservation.discount}% تخفیف</span>
                                                            </div>
                                                        )}
                                                        <div className="price-pre">
                                                            پیش‌پرداخت: {formatPrice(reservation.pre_payment)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="table-td">
                                                    <div className="status-info">
                                                        <span className={`status-badge ${statusBadge.color}`}>
                                                            {statusBadge.icon}
                                                            {statusBadge.text}
                                                        </span>
                                                        {reservation.is_confirmed_by_owner && (
                                                            <span className="confirmed-by-owner">
                                                                تایید شده توسط مالک
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="table-td">
                                                    <div className="actions">
                                                        <button className="action-btn view-btn">
                                                            <PiEye className="action-icon" />
                                                        </button>
                                                        <button className="action-btn delete-btn">
                                                            <PiTrash className="action-icon" />
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
                        <div className="table-tablet">
                            <table className="table">
                                <thead>
                                    <tr className="table-header">
                                        <th className="table-th">ردیف</th>
                                        <th className="table-th">تالار / کاربر</th>
                                        <th className="table-th">تاریخ</th>
                                        <th className="table-th">قیمت</th>
                                        <th className="table-th">وضعیت</th>
                                        <th className="table-th">عملیات</th>
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
                                                className="table-row"
                                            >
                                                <td className="table-td text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                <td className="table-td">
                                                    <div className="hall-name">{reservation.hall_id?.title || "نامشخص"}</div>
                                                    <div className="user-name-small">{reservation.user_id?.name || "نامشخص"}</div>
                                                </td>
                                                <td className="table-td text-gray-600">{formatDate(reservation.start_date)}</td>
                                                <td className="table-td text-gray-800 font-medium">{formatPrice(reservation.final_price)}</td>
                                                <td className="table-td">
                                                    <span className={`status-badge ${statusBadge.color}`}>
                                                        {statusBadge.icon}
                                                        {statusBadge.text}
                                                    </span>
                                                </td>
                                                <td className="table-td">
                                                    <div className="actions">
                                                        <button className="action-btn view-btn">
                                                            <PiEye className="action-icon" />
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
                        <div className="table-mobile">
                            {currentItems.map((reservation, index) => {
                                const statusBadge = getStatusBadge(reservation.status);
                                return (
                                    <motion.div
                                        key={reservation._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="reservation-card"
                                    >
                                        <div className="card-header">
                                            <div>
                                                <span className="card-index">#{(currentPage - 1) * itemsPerPage + index + 1}</span>
                                                <h3 className="card-title">{reservation.hall_id?.title || "نامشخص"}</h3>
                                            </div>
                                            <span className={`status-badge ${statusBadge.color}`}>
                                                {statusBadge.icon}
                                                {statusBadge.text}
                                            </span>
                                        </div>

                                        <div className="card-body">
                                            <div className="card-item">
                                                <PiUser className="card-icon" />
                                                <span>{reservation.user_id?.name || "نامشخص"}</span>
                                            </div>

                                            <div className="card-item">
                                                <PiCalendar className="card-icon" />
                                                <span>{formatDate(reservation.start_date)} - {formatDate(reservation.end_date)}</span>
                                            </div>

                                            <div className="card-item">
                                                <PiUsers className="card-icon" />
                                                <span>{reservation.guests_count?.toLocaleString()} نفر</span>
                                            </div>

                                            <div className="card-price">
                                                <PiCurrencyDollar className="price-icon" />
                                                <span>{formatPrice(reservation.final_price)}</span>
                                            </div>

                                            {reservation.discount > 0 && (
                                                <div className="card-discount">
                                                    <PiPercent className="discount-icon" />
                                                    <span>{reservation.discount}% تخفیف</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="card-actions">
                                            <button className="card-action-btn view-btn">
                                                <PiEye className="action-icon" />
                                                مشاهده
                                            </button>
                                            <button className="card-action-btn ticket-btn">
                                                <PiTicket className="action-icon" />
                                                جزئیات
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* صفحه‌بندی پایین */}
                        <div className="pagination-container">
                            <div className="pagination-info">
                                صفحه {currentPage} از {totalPages}
                            </div>

                            <div className="pagination-controls">
                                <button
                                    onClick={() => goToPage(1)}
                                    disabled={currentPage === 1}
                                    className="pagination-btn"
                                >
                                    <PiCaretDoubleRight className="pagination-icon" />
                                </button>

                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="pagination-btn"
                                >
                                    <PiCaretRight className="pagination-icon" />
                                </button>

                                <div className="pagination-numbers">
                                    {getPageNumbers().map((page, idx) => (
                                        page === '...' ? (
                                            <span key={idx} className="pagination-dots">...</span>
                                        ) : (
                                            <button
                                                key={idx}
                                                onClick={() => goToPage(page)}
                                                className={`pagination-number ${currentPage === page ? "pagination-number-active" : "pagination-number-inactive"}`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ))}
                                </div>

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="pagination-btn"
                                >
                                    <PiCaretLeft className="pagination-icon" />
                                </button>

                                <button
                                    onClick={() => goToPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="pagination-btn"
                                >
                                    <PiCaretDoubleLeft className="pagination-icon" />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style jsx>{`
                .adminHallReservationsPage {
                    direction: rtl;
                    padding: 0.5rem;
                    max-width: 100%;
                }

                /* لودر */
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    min-height: 400px;
                    gap: 20px;
                }

                .loading-container p {
                    font-size: 16px;
                    color: #6b7280;
                }

                /* خطا */
                .error-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                    gap: 16px;
                }

                .error-icon {
                    width: 80px;
                    height: 80px;
                    color: #f87171;
                }

                .error-icon.warning {
                    color: #fb923c;
                }

                .error-icon.error {
                    color: #ef4444;
                }

                .error-text {
                    font-size: 1.25rem;
                    color: #6b7280;
                }

                /* هدر */
                .page-header {
                    margin-bottom: 2rem;
                }

                .header-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.5rem;
                }

                .header-icon {
                    background: linear-gradient(135deg, #D4B06A, #B8922E);
                    padding: 0.5rem;
                    border-radius: 0.75rem;
                    flex-shrink: 0;
                }

                .header-icon-svg {
                    width: 1.5rem;
                    height: 1.5rem;
                    color: white;
                }

                .header-title {
                    font-size: 1.5rem;
                    font-weight: 900;
                    color: #1f2937;
                }

                .header-subtitle {
                    color: #6b7280;
                    font-size: 0.875rem;
                }

                .header-line {
                    width: 5rem;
                    height: 0.25rem;
                    background: linear-gradient(90deg, #D4B06A, #B8922E);
                    border-radius: 9999px;
                    margin-top: 0.5rem;
                }

                /* حالت خالی */
                .empty-state {
                    background: linear-gradient(135deg, #f9fafb, #f3f4f6);
                    border-radius: 1rem;
                    padding: 3rem 2rem;
                    text-align: center;
                    border: 1px solid #e5e7eb;
                }

                .empty-icon {
                    width: 4rem;
                    height: 4rem;
                    color: #9ca3af;
                    margin: 0 auto 1rem;
                }

                .empty-text {
                    color: #6b7280;
                    font-size: 1.125rem;
                }

                /* جدول */
                .table-container {
                    background: white;
                    border-radius: 1rem;
                    border: 1px solid #f3f4f6;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
                    overflow: hidden;
                }

                .table-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    padding: 1rem;
                    border-bottom: 1px solid #f3f4f6;
                }

                @media (min-width: 640px) {
                    .table-controls {
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                    }
                }

                .controls-left,
                .controls-right {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .controls-label {
                    font-size: 0.875rem;
                    color: #6b7280;
                }

                .controls-select {
                    padding: 0.25rem 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    outline: none;
                    background: white;
                }

                .controls-select:focus {
                    border-color: #D4B06A;
                }

                .controls-right {
                    font-size: 0.875rem;
                    color: #6b7280;
                }

                .highlight {
                    font-weight: 700;
                    color: #1f2937;
                }

                /* جدول */
                .table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 700px;
                }

                .table-desktop {
                    display: none;
                }

                @media (min-width: 1024px) {
                    .table-desktop {
                        display: block;
                        overflow-x: auto;
                    }
                    .table {
                        min-width: 1100px;
                    }
                }

                .table-tablet {
                    display: none;
                }

                @media (min-width: 768px) and (max-width: 1023px) {
                    .table-tablet {
                        display: block;
                        overflow-x: auto;
                    }
                    .table {
                        min-width: 700px;
                    }
                }

                .table-mobile {
                    display: block;
                }

                @media (min-width: 768px) {
                    .table-mobile {
                        display: none;
                    }
                }

                .table-header {
                    background: linear-gradient(135deg, #f9fafb, #f3f4f6);
                    border-bottom: 1px solid #e5e7eb;
                }

                .table-th {
                    text-align: right;
                    padding: 1rem;
                    font-weight: 700;
                    color: #4b5563;
                    font-size: 0.875rem;
                    white-space: nowrap;
                }

                .table-row {
                    border-bottom: 1px solid #f3f4f6;
                    transition: background 0.2s;
                }

                .table-row:hover {
                    background: #f9fafb;
                }

                .table-td {
                    padding: 1rem;
                    font-size: 0.875rem;
                    vertical-align: middle;
                }

                /* سلول‌ها */
                .hall-name {
                    font-weight: 500;
                    color: #1f2937;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: #6b7280;
                    font-size: 0.75rem;
                    margin-top: 0.25rem;
                }

                .user-icon {
                    width: 0.75rem;
                    height: 0.75rem;
                    color: #D4B06A;
                }

                .user-email {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: #9ca3af;
                    font-size: 0.75rem;
                }

                .email-icon {
                    width: 0.75rem;
                    height: 0.75rem;
                }

                .user-name-small {
                    font-size: 0.75rem;
                    color: #6b7280;
                    margin-top: 0.25rem;
                }

                .date-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .date-row {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: #6b7280;
                    font-size: 0.875rem;
                }

                .date-icon,
                .clock-icon {
                    width: 1rem;
                    height: 1rem;
                    color: #D4B06A;
                }

                .date-duration {
                    font-size: 0.75rem;
                    color: #9ca3af;
                }

                .guests-info {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: #6b7280;
                }

                .guests-icon {
                    width: 1rem;
                    height: 1rem;
                    color: #D4B06A;
                }

                .price-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .price-amount {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: #1f2937;
                    font-weight: 700;
                    font-size: 0.875rem;
                }

                .price-icon {
                    width: 1rem;
                    height: 1rem;
                    color: #10b981;
                }

                .price-discount {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: #10b981;
                    font-size: 0.75rem;
                }

                .discount-icon {
                    width: 0.75rem;
                    height: 0.75rem;
                }

                .price-pre {
                    font-size: 0.75rem;
                    color: #9ca3af;
                }

                .status-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.25rem 0.5rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    width: fit-content;
                }

                .bg-yellow-100 {
                    background: #fef3c7;
                    color: #92400e;
                }
                .bg-green-100 {
                    background: #d1fae5;
                    color: #065f46;
                }
                .bg-red-100 {
                    background: #fee2e2;
                    color: #991b1b;
                }
                .bg-blue-100 {
                    background: #dbeafe;
                    color: #1e40af;
                }
                .bg-gray-100 {
                    background: #f3f4f6;
                    color: #4b5563;
                }

                .confirmed-by-owner {
                    font-size: 0.75rem;
                    color: #10b981;
                }

                .actions {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .action-btn {
                    padding: 0.5rem;
                    border: none;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .action-icon {
                    width: 1.25rem;
                    height: 1.25rem;
                }

                .view-btn {
                    color: #2563eb;
                    background: #eff6ff;
                }

                .view-btn:hover {
                    background: #dbeafe;
                }

                .delete-btn {
                    color: #dc2626;
                    background: #fef2f2;
                }

                .delete-btn:hover {
                    background: #fee2e2;
                }

                .ticket-btn {
                    color: #7c3aed;
                    background: #f5f3ff;
                }

                .ticket-btn:hover {
                    background: #ede9fe;
                }

                /* کارت موبایل */
                .reservation-card {
                    padding: 1rem;
                    border-bottom: 1px solid #f3f4f6;
                }

                .reservation-card:hover {
                    background: #f9fafb;
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.75rem;
                }

                .card-index {
                    font-size: 0.75rem;
                    color: #9ca3af;
                }

                .card-title {
                    font-weight: 700;
                    color: #1f2937;
                    font-size: 1rem;
                    margin: 0.25rem 0 0;
                }

                .card-body {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .card-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: #6b7280;
                }

                .card-icon {
                    width: 1rem;
                    height: 1rem;
                    color: #D4B06A;
                }

                .card-price {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #1f2937;
                    font-weight: 700;
                    font-size: 0.875rem;
                }

                .card-discount {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #10b981;
                    font-size: 0.75rem;
                }

                .card-actions {
                    display: flex;
                    gap: 0.75rem;
                    margin-top: 1rem;
                    padding-top: 0.75rem;
                    border-top: 1px solid #f3f4f6;
                }

                .card-action-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.5rem;
                    border: none;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                /* صفحه‌بندی */
                .pagination-container {
                    background: #f9fafb;
                    padding: 1rem;
                    border-top: 1px solid #f3f4f6;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    align-items: center;
                }

                @media (min-width: 640px) {
                    .pagination-container {
                        flex-direction: row;
                        justify-content: space-between;
                    }
                }

                .pagination-info {
                    font-size: 0.875rem;
                    color: #6b7280;
                }

                .pagination-controls {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .pagination-btn {
                    padding: 0.5rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .pagination-btn:hover:not(:disabled) {
                    background: #f9fafb;
                }

                .pagination-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .pagination-icon {
                    width: 1.25rem;
                    height: 1.25rem;
                }

                .pagination-numbers {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                .pagination-dots {
                    padding: 0 0.5rem;
                    color: #9ca3af;
                }

                .pagination-number {
                    min-width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .pagination-number-active {
                    background: linear-gradient(135deg, #D4B06A, #B8922E);
                    color: white;
                    box-shadow: 0 4px 12px rgba(212, 176, 106, 0.3);
                }

                .pagination-number-inactive {
                    background: white;
                    border: 1px solid #d1d5db;
                    color: #6b7280;
                }

                .pagination-number-inactive:hover {
                    background: #f9fafb;
                }

                /* ریسپانسیو - موبایل کوچک */
                @media (max-width: 480px) {
                    .adminHallReservationsPage {
                        padding: 0.25rem;
                    }

                    .header-title {
                        font-size: 1.25rem;
                    }

                    .header-subtitle {
                        font-size: 0.75rem;
                    }

                    .table-controls {
                        padding: 0.75rem;
                    }

                    .controls-left,
                    .controls-right {
                        font-size: 0.75rem;
                    }

                    .controls-select {
                        padding: 0.125rem 0.5rem;
                        font-size: 0.75rem;
                    }

                    .reservation-card {
                        padding: 0.75rem;
                    }

                    .card-title {
                        font-size: 0.875rem;
                    }

                    .card-item {
                        font-size: 0.75rem;
                    }

                    .card-action-btn {
                        font-size: 0.75rem;
                        padding: 0.375rem;
                    }

                    .pagination-number {
                        min-width: 2rem;
                        height: 2rem;
                        font-size: 0.75rem;
                    }

                    .pagination-btn {
                        padding: 0.375rem;
                    }

                    .pagination-icon {
                        width: 1rem;
                        height: 1rem;
                    }
                }

                /* تبلت */
                @media (min-width: 481px) and (max-width: 768px) {
                    .adminHallReservationsPage {
                        padding: 0.5rem;
                    }

                    .header-title {
                        font-size: 1.5rem;
                    }

                    .card-action-btn {
                        font-size: 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
}