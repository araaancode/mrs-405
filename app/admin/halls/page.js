"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    PiBuilding,
    PiMapPin,
    PiUsers,
    PiUser,
    PiPhone,
    PiToggleLeft,
    PiToggleRight,
    PiEye,
    PiTrash,
    PiPencilSimple,
    PiWarningCircle,
    PiCaretLeft,
    PiCaretRight,
    PiCaretDoubleLeft,
    PiCaretDoubleRight,
    PiMagnifyingGlass,
    PiX,
    PiCheckCircle,
    PiXCircle
} from "react-icons/pi";
import { PulseLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";

export default function AdminHallsPage() {
    const [halls, setHalls] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // صفحه‌بندی
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // فیلتر وضعیت
    const [statusFilter, setStatusFilter] = useState("all");

    // جستجو
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("all");

    useEffect(() => {
        async function getHalls() {
            try {
                setLoading(true);
                const url = `/api/admin/halls`;
                const res = await axios.get(url, { withCredentials: true });
                setHalls(res.data.halls || []);

                toast.success(`${res.data.halls?.length || 0} تالار با موفقیت بارگذاری شد`, {
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
            } catch (err) {
                setError(err.response?.status || 500);
                toast.error("خطا در دریافت تالارها", {
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

        getHalls();
    }, []);

    // فیلتر کردن تالارها بر اساس وضعیت و جستجو
    const filteredHalls = useMemo(() => {
        let result = statusFilter === "all"
            ? halls
            : halls.filter(hall => {
                if (statusFilter === "active") return hall.is_active === true;
                if (statusFilter === "inactive") return hall.is_active === false;
                return true;
            });

        // اعمال جستجو
        if (searchTerm.trim() !== "") {
            const term = searchTerm.trim().toLowerCase();
            result = result.filter(hall => {
                switch (searchField) {
                    case "title":
                        return hall.title?.toLowerCase().includes(term);
                    case "owner":
                        return hall.hall_owner_name?.toLowerCase().includes(term) ||
                            hall.hall_owner_phone?.includes(term);
                    case "location":
                        return `${hall.province || ''} ${hall.city || ''}`.toLowerCase().includes(term);
                    case "phone":
                        return hall.hall_owner_phone?.includes(term);
                    default:
                        // جستجو در تمام فیلدها
                        return (
                            hall.title?.toLowerCase().includes(term) ||
                            hall.hall_owner_name?.toLowerCase().includes(term) ||
                            hall.hall_owner_phone?.includes(term) ||
                            `${hall.province || ''} ${hall.city || ''}`.toLowerCase().includes(term) ||
                            hall.capacity?.toString().includes(term)
                        );
                }
            });
        }

        return result;
    }, [halls, statusFilter, searchTerm, searchField]);

    // محاسبه تعداد صفحات
    useEffect(() => {
        setTotalPages(Math.ceil(filteredHalls.length / itemsPerPage));
        setCurrentPage(1);
    }, [filteredHalls, itemsPerPage]);

    // دریافت آیتم‌های صفحه جاری
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredHalls.slice(startIndex, endIndex);
    };

    // تغییر صفحه
    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        document.getElementById('halls-table')?.scrollIntoView({ behavior: 'smooth' });
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

    // پاک کردن جستجو
    const clearSearch = () => {
        setSearchTerm("");
        setSearchField("all");
    };

    // دریافت رنگ badge وضعیت
    const getStatusBadgeColor = (isActive) => {
        return isActive
            ? "bg-green-100 text-green-700 border-green-200"
            : "bg-red-100 text-red-700 border-red-200";
    };

    const currentItems = getCurrentPageItems();

    if (loading) {
        return (
            <div className="loading-container">
                <PulseLoader color="#D4B06A" size={15} margin={6} />
                <p>در حال بارگذاری تالارها...</p>
            </div>
        );
    }

    if (error === 401) {
        return (
            <div className="error-container">
                <PiWarningCircle className="error-icon" />
                <p className="error-text">لطفاً وارد حساب شوید.</p>
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
                <p className="error-text">خطا در دریافت اطلاعات (کد: {error})</p>
            </div>
        );
    }

    return (
        <div className="adminHallsPage" id="halls-table">
            <Toaster />

            {/* هدر صفحه */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <PiBuilding className="header-icon-svg" />
                    </div>
                    <div>
                        <h1 className="header-title">مدیریت تالارها</h1>
                        <p className="header-subtitle">مدیریت و بررسی تمام تالارهای ثبت‌شده در سیستم</p>
                    </div>
                </div>
                <div className="header-line" />
            </div>

            {/* فیلتر وضعیت و جستجو */}
            <div className="controls-wrapper">
                <div className="filter-container">
                    <button
                        onClick={() => setStatusFilter("all")}
                        className={`filter-btn ${statusFilter === "all" ? "filter-btn-active" : "filter-btn-inactive"}`}
                    >
                        همه
                    </button>
                    <button
                        onClick={() => setStatusFilter("active")}
                        className={`filter-btn ${statusFilter === "active" ? "filter-btn-active" : "filter-btn-inactive"}`}
                    >
                        <PiCheckCircle className="filter-icon" />
                        فعال
                    </button>
                    <button
                        onClick={() => setStatusFilter("inactive")}
                        className={`filter-btn ${statusFilter === "inactive" ? "filter-btn-active" : "filter-btn-inactive"}`}
                    >
                        <PiXCircle className="filter-icon" />
                        غیرفعال
                    </button>
                </div>

                {/* بخش جستجو */}
                <div className="search-container">
                    <div className="search-box">
                        <PiMagnifyingGlass className="search-icon" />
                        <input
                            type="text"
                            placeholder="جستجو در تالارها..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button onClick={clearSearch} className="search-clear">
                                <PiX className="search-clear-icon" />
                            </button>
                        )}
                    </div>

                    <select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        className="search-field-select"
                    >
                        <option value="all">همه فیلدها</option>
                        <option value="title">نام تالار</option>
                        <option value="owner">مدیر تالار</option>
                        <option value="location">موقعیت</option>
                        <option value="phone">تلفن</option>
                    </select>
                </div>
            </div>

            {filteredHalls.length === 0 ? (
                <div className="empty-state">
                    {searchTerm ? (
                        <>
                            <PiMagnifyingGlass className="empty-icon" />
                            <p className="empty-text">نتیجه‌ای برای جستجوی "{searchTerm}" یافت نشد.</p>
                            <button onClick={clearSearch} className="empty-btn">
                                پاک کردن جستجو
                            </button>
                        </>
                    ) : (
                        <>
                            <PiBuilding className="empty-icon" />
                            <p className="empty-text">هیچ تالاری یافت نشد.</p>
                        </>
                    )}
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
                                {searchTerm && (
                                    <span className="search-result-badge">
                                        {filteredHalls.length} نتیجه
                                    </span>
                                )}
                            </div>

                            <div className="controls-right">
                                نمایش <span className="highlight">{(currentPage - 1) * itemsPerPage + 1}</span>
                                {' تا '}
                                <span className="highlight">
                                    {Math.min(currentPage * itemsPerPage, filteredHalls.length)}
                                </span>
                                {' از '}
                                <span className="highlight">{filteredHalls.length}</span>
                                {' تالار'}
                            </div>
                        </div>

                        {/* جدول - نسخه دسکتاپ */}
                        <div className="table-desktop">
                            <table className="table">
                                <thead>
                                    <tr className="table-header">
                                        <th className="table-th">ردیف</th>
                                        <th className="table-th">نام تالار</th>
                                        <th className="table-th">مدیر تالار</th>
                                        <th className="table-th">تلفن</th>
                                        {/* <th className="table-th">موقعیت</th> */}
                                        {/* <th className="table-th">ظرفیت</th> */}
                                        <th className="table-th">وضعیت</th>
                                        <th className="table-th">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {currentItems.map((hall, index) => (
                                            <motion.tr
                                                key={hall._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3, delay: index * 0.03 }}
                                                className="table-row"
                                            >
                                                <td className="table-td text-gray-500">
                                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                                </td>
                                                <td className="table-td">
                                                    <div className="hall-name">
                                                        {/* <PiBuilding className="hall-icon" /> */}
                                                        <span className="hall-name-text">{hall.title}</span>
                                                    </div>
                                                </td>
                                                <td className="table-td">
                                                    <div className="owner-cell">
                                                        {/* <PiUser className="owner-icon" /> */}
                                                        <span className="owner-text">{hall.hall_owner_name || "—"}</span>
                                                    </div>
                                                </td>
                                                <td className="table-td">
                                                    <div className="phone-cell">
                                                        {/* <PiPhone className="phone-icon" /> */}
                                                        <span className="phone-text">{hall.hall_owner_phone || "—"}</span>
                                                    </div>
                                                </td>
                                                {/* <td className="table-td">
                                                    <div className="location-cell">
                                                        <PiMapPin className="location-icon" />
                                                        <span className="location-text">
                                                            {hall.province && hall.city ? `${hall.province}، ${hall.city}` : "ثبت نشده"}
                                                        </span>
                                                    </div>
                                                </td> */}
                                                {/* <td className="table-td">
                                                    <div className="capacity-cell">
                                                        <PiUsers className="capacity-icon" />
                                                        <span className="capacity-text">{hall.capacity?.toLocaleString() || 0}</span>
                                                    </div>
                                                </td> */}
                                                <td className="table-td">
                                                    <span className={`status-badge ${getStatusBadgeColor(hall.is_active)}`}>
                                                        {/* {hall.is_active ? (
                                                            <PiToggleRight className="status-icon" />
                                                        ) : (
                                                            <PiToggleLeft className="status-icon" />
                                                        )} */}
                                                        {hall.is_active ? "فعال" : "غیرفعال"}
                                                    </span>
                                                </td>
                                                <td className="table-td">
                                                    <div className="actions">
                                                        {/* <button className="action-btn view-btn">
                                                            <PiEye className="action-icon" />
                                                        </button> */}
                                                        <button className="action-btn edit-btn">
                                                            <PiPencilSimple className="action-icon" />
                                                        </button>
                                                        <button className="action-btn delete-btn">
                                                            <PiTrash className="action-icon" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>

                        {/* نمای کارتی - موبایل */}
                        <div className="table-mobile">
                            <AnimatePresence>
                                {currentItems.map((hall, index) => (
                                    <motion.div
                                        key={hall._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="hall-card"
                                    >
                                        <div className="card-header">
                                            <div className="card-hall">
                                                <span className="card-index">#{(currentPage - 1) * itemsPerPage + index + 1}</span>
                                                <h3 className="card-name">{hall.title}</h3>
                                            </div>
                                            <span className={`status-badge ${getStatusBadgeColor(hall.is_active)}`}>
                                                {hall.is_active ? (
                                                    <PiToggleRight className="status-icon" />
                                                ) : (
                                                    <PiToggleLeft className="status-icon" />
                                                )}
                                                {hall.is_active ? "فعال" : "غیرفعال"}
                                            </span>
                                        </div>

                                        <div className="card-body">
                                            <div className="card-item">
                                                <PiUser className="card-icon" />
                                                <span>مدیر: {hall.hall_owner_name || "نامشخص"}</span>
                                            </div>
                                            <div className="card-item">
                                                <PiPhone className="card-icon" />
                                                <span>تلفن: {hall.hall_owner_phone || "نامشخص"}</span>
                                            </div>
                                            <div className="card-item">
                                                <PiMapPin className="card-icon" />
                                                <span>
                                                    {hall.province && hall.city ? `${hall.province}، ${hall.city}` : "موقعیت ثبت نشده"}
                                                </span>
                                            </div>
                                            <div className="card-item">
                                                <PiUsers className="card-icon" />
                                                <span>ظرفیت: {hall.capacity?.toLocaleString() || 0} نفر</span>
                                            </div>
                                        </div>

                                        <div className="card-actions">
                                            <button className="card-action-btn view-btn">
                                                <PiEye className="action-icon" />
                                                مشاهده
                                            </button>
                                            <button className="card-action-btn edit-btn">
                                                <PiPencilSimple className="action-icon" />
                                                ویرایش
                                            </button>
                                            <button className="card-action-btn delete-btn">
                                                <PiTrash className="action-icon" />
                                                حذف
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
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
                                    {getPageNumbers().map((page, index) => (
                                        page === '...' ? (
                                            <span key={index} className="pagination-dots">...</span>
                                        ) : (
                                            <button
                                                key={index}
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
                .adminHallsPage {
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

                /* کنترل‌ها wrapper */
                .controls-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                @media (min-width: 768px) {
                    .controls-wrapper {
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                    }
                }

                /* فیلتر */
                .filter-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                }

                .filter-btn {
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    transition: all 0.3s;
                    border: none;
                    cursor: pointer;
                    font-size: 0.875rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .filter-btn-active {
                    background: linear-gradient(135deg, #D4B06A, #B8922E);
                    color: white;
                    box-shadow: 0 4px 12px rgba(212, 176, 106, 0.3);
                }

                .filter-btn-inactive {
                    background: white;
                    border: 1px solid #d1d5db;
                    color: #6b7280;
                }

                .filter-btn-inactive:hover {
                    background: #f9fafb;
                }

                .filter-icon {
                    width: 1rem;
                    height: 1rem;
                }

                /* بخش جستجو */
                .search-container {
                    display: flex;
                    gap: 0.5rem;
                    flex: 1;
                    min-width: 200px;
                }

                .search-box {
                    flex: 1;
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .search-icon {
                    position: absolute;
                    right: 0.75rem;
                    width: 1.25rem;
                    height: 1.25rem;
                    color: #9ca3af;
                }

                .search-input {
                    width: 100%;
                    padding: 0.5rem 2.5rem 0.5rem 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    outline: none;
                    transition: all 0.3s;
                    background: white;
                }

                .search-input:focus {
                    border-color: #D4B06A;
                    box-shadow: 0 0 0 3px rgba(212, 176, 106, 0.1);
                }

                .search-input::placeholder {
                    color: #9ca3af;
                }

                .search-clear {
                    position: absolute;
                    left: 0.75rem;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s;
                }

                .search-clear:hover {
                    background: #f3f4f6;
                }

                .search-clear-icon {
                    width: 1rem;
                    height: 1rem;
                    color: #6b7280;
                }

                .search-field-select {
                    padding: 0.5rem 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    outline: none;
                    background: white;
                    min-width: 120px;
                    cursor: pointer;
                }

                .search-field-select:focus {
                    border-color: #D4B06A;
                }

                .search-result-badge {
                    background: #D4B06A;
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
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
                    margin-bottom: 1rem;
                }

                .empty-btn {
                    padding: 0.5rem 1.5rem;
                    background: #D4B06A;
                    color: white;
                    border: none;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .empty-btn:hover {
                    background: #B8922E;
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
                    flex-wrap: wrap;
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

                /* جدول دسکتاپ */
                .table-desktop {
                    display: none;
                }

                @media (min-width: 1024px) {
                    .table-desktop {
                        display: block;
                        overflow-x: auto;
                    }
                }

                .table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 800px;
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

                .hall-name {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .hall-icon {
                    width: 1.25rem;
                    height: 1.25rem;
                    color: #D4B06A;
                }

                .hall-name-text {
                    font-weight: 500;
                    color: #1f2937;
                }

                .owner-cell,
                .phone-cell,
                .location-cell,
                .capacity-cell {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: #6b7280;
                }

                .owner-icon,
                .phone-icon,
                .location-icon,
                .capacity-icon {
                    width: 1rem;
                    height: 1rem;
                    color: #D4B06A;
                }

                .owner-text,
                .phone-text,
                .location-text,
                .capacity-text {
                    font-size: 0.875rem;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.25rem 0.5rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border: 1px solid;
                }

                .status-icon {
                    width: 1rem;
                    height: 1rem;
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

                .edit-btn {
                    color: #d97706;
                    background: #fffbeb;
                }

                .edit-btn:hover {
                    background: #fef3c7;
                }

                .delete-btn {
                    color: #dc2626;
                    background: #fef2f2;
                }

                .delete-btn:hover {
                    background: #fee2e2;
                }

                /* نمای کارتی - موبایل و تبلت */
                .table-mobile {
                    display: block;
                }

                @media (min-width: 1024px) {
                    .table-mobile {
                        display: none;
                    }
                }

                .hall-card {
                    padding: 1rem;
                    border-bottom: 1px solid #f3f4f6;
                }

                .hall-card:hover {
                    background: #f9fafb;
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.75rem;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .card-hall {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .card-index {
                    font-size: 0.75rem;
                    color: #9ca3af;
                }

                .card-name {
                    font-weight: 700;
                    color: #1f2937;
                    font-size: 1.125rem;
                    margin: 0;
                }

                .card-body {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-top: 0.5rem;
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
                    flex-shrink: 0;
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

                .card-action-btn.view-btn {
                    color: #2563eb;
                    background: #eff6ff;
                }

                .card-action-btn.view-btn:hover {
                    background: #dbeafe;
                }

                .card-action-btn.edit-btn {
                    color: #d97706;
                    background: #fffbeb;
                }

                .card-action-btn.edit-btn:hover {
                    background: #fef3c7;
                }

                .card-action-btn.delete-btn {
                    color: #dc2626;
                    background: #fef2f2;
                }

                .card-action-btn.delete-btn:hover {
                    background: #fee2e2;
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
                    .adminHallsPage {
                        padding: 0.25rem;
                    }

                    .header-title {
                        font-size: 1.25rem;
                    }

                    .header-subtitle {
                        font-size: 0.75rem;
                    }

                    .filter-container {
                        gap: 0.5rem;
                    }

                    .filter-btn {
                        padding: 0.375rem 0.75rem;
                        font-size: 0.75rem;
                    }

                    .search-container {
                        flex-direction: column;
                    }

                    .search-field-select {
                        width: 100%;
                        min-width: unset;
                    }

                    .table-controls {
                        padding: 0.75rem;
                    }

                    .controls-left,
                    .controls-right {
                        font-size: 0.75rem;
                        flex-wrap: wrap;
                    }

                    .controls-select {
                        padding: 0.125rem 0.5rem;
                        font-size: 0.75rem;
                    }

                    .hall-card {
                        padding: 0.75rem;
                    }

                    .card-name {
                        font-size: 1rem;
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
                @media (min-width: 481px) and (max-width: 1023px) {
                    .adminHallsPage {
                        padding: 0.5rem;
                    }

                    .header-title {
                        font-size: 1.5rem;
                    }

                    .card-action-btn {
                        font-size: 0.75rem;
                    }

                    .search-container {
                        flex-direction: column;
                    }

                    .search-field-select {
                        width: 100%;
                        min-width: unset;
                    }
                }

                /* دسکتاپ بزرگ */
                @media (min-width: 1200px) {
                    .adminHallsPage {
                        padding: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}