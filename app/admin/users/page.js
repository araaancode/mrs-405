"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    PiUsers,
    PiMapPin,
    PiEnvelope,
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
    PiIdentificationCard,
    PiCalendar,
    PiGenderIntersex,
    PiShieldCheck,
    PiUserCircle,
    PiMagnifyingGlass,
    PiX
} from "react-icons/pi";
import { PulseLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";

// ====== توابع کمکی خارج از کامپوننت (بهترین عملکرد) ======

// دریافت متن نقش به فارسی
const getRolePersian = (role) => {
    const roles = {
        admin: "مدیر",
        hall_owner: "تالاردار",
        user: "کاربر عادی"
    };
    return roles[role] || role;
};

// دریافت رنگ badge نقش
const getRoleBadgeColor = (role) => {
    const colors = {
        admin: "bg-purple-100 text-purple-700",
        hall_owner: "bg-blue-100 text-blue-700",
        user: "bg-green-100 text-green-700"
    };
    return colors[role] || "bg-gray-100 text-gray-700";
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // صفحه‌بندی
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // فیلتر نقش کاربر
    const [roleFilter, setRoleFilter] = useState("all");

    // جستجو
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("all");

    useEffect(() => {
        async function getUsers() {
            try {
                setLoading(true);
                const url = `/api/admin/users`;
                const res = await axios.get(url, { withCredentials: true });
                setUsers(res.data.users || []);

                toast.success(`${res.data.users?.length || 0} کاربر با موفقیت بارگذاری شد`, {
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
                toast.error("خطا در دریافت کاربران", {
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

        getUsers();
    }, []);

    // فیلتر کردن کاربران بر اساس نقش و جستجو
    const filteredUsers = useMemo(() => {
        let result = roleFilter === "all"
            ? users
            : users.filter(user => user.role === roleFilter);

        // اعمال جستجو
        if (searchTerm.trim() !== "") {
            const term = searchTerm.trim().toLowerCase();
            result = result.filter(user => {
                switch (searchField) {
                    case "name":
                        return user.full_name?.toLowerCase().includes(term) ||
                            user.username?.toLowerCase().includes(term);
                    case "email":
                        return user.email?.toLowerCase().includes(term);
                    case "phone":
                        return user.phone?.includes(term);
                    case "role":
                        return getRolePersian(user.role)?.includes(term) ||
                            user.role?.toLowerCase().includes(term);
                    case "location":
                        return `${user.province || ''} ${user.city || ''}`.toLowerCase().includes(term);
                    default:
                        // جستجو در تمام فیلدها
                        return (
                            user.full_name?.toLowerCase().includes(term) ||
                            user.username?.toLowerCase().includes(term) ||
                            user.email?.toLowerCase().includes(term) ||
                            user.phone?.includes(term) ||
                            getRolePersian(user.role)?.includes(term) ||
                            `${user.province || ''} ${user.city || ''}`.toLowerCase().includes(term) ||
                            user.national_code?.includes(term)
                        );
                }
            });
        }

        return result;
    }, [users, roleFilter, searchTerm, searchField]);

    // محاسبه تعداد صفحات
    useEffect(() => {
        setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));
        setCurrentPage(1);
    }, [filteredUsers, itemsPerPage]);

    // دریافت آیتم‌های صفحه جاری
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredUsers.slice(startIndex, endIndex);
    };

    // تغییر صفحه
    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        document.getElementById('users-table')?.scrollIntoView({ behavior: 'smooth' });
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

    const currentItems = getCurrentPageItems();

    if (loading) {
        return (
            <div className="loading-container">
                <PulseLoader color="#D4B06A" size={15} margin={6} />
                <p>در حال بارگذاری کاربران...</p>
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
        <div className="adminUsersPage" id="users-table">
            <Toaster />

            {/* هدر صفحه */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <PiUsers className="header-icon-svg" />
                    </div>
                    <div>
                        <h1 className="header-title">مدیریت کاربران</h1>
                        <p className="header-subtitle">مدیریت و بررسی تمام کاربران ثبت‌شده در سیستم</p>
                    </div>
                </div>
                <div className="header-line" />
            </div>

            {/* فیلتر نقش و جستجو */}
            <div className="controls-wrapper">
                <div className="filter-container">
                    <button
                        onClick={() => setRoleFilter("all")}
                        className={`filter-btn ${roleFilter === "all" ? "filter-btn-active" : "filter-btn-inactive"}`}
                    >
                        همه
                    </button>
                    <button
                        onClick={() => setRoleFilter("admin")}
                        className={`filter-btn ${roleFilter === "admin" ? "filter-btn-active" : "filter-btn-inactive"}`}
                    >
                        مدیران
                    </button>
                    <button
                        onClick={() => setRoleFilter("hall_owner")}
                        className={`filter-btn ${roleFilter === "hall_owner" ? "filter-btn-active" : "filter-btn-inactive"}`}
                    >
                        تالارداران
                    </button>
                    <button
                        onClick={() => setRoleFilter("user")}
                        className={`filter-btn ${roleFilter === "user" ? "filter-btn-active" : "filter-btn-inactive"}`}
                    >
                        کاربران عادی
                    </button>
                </div>

                {/* بخش جستجو */}
                <div className="search-container">
                    <div className="search-box">
                        {/* <PiMagnifyingGlass className="search-icon" /> */}
                        <input
                            type="text"
                            placeholder="جستجو در کاربران..."
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
                        <option value="name">نام و نام کاربری</option>
                        <option value="email">ایمیل</option>
                        <option value="phone">تلفن</option>
                        <option value="role">نقش</option>
                        <option value="location">موقعیت</option>
                    </select>
                </div>
            </div>

            {filteredUsers.length === 0 ? (
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
                            <PiUsers className="empty-icon" />
                            <p className="empty-text">هیچ کاربری یافت نشد.</p>
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
                                        {filteredUsers.length} نتیجه
                                    </span>
                                )}
                            </div>

                            <div className="controls-right">
                                نمایش <span className="highlight">{(currentPage - 1) * itemsPerPage + 1}</span>
                                {' تا '}
                                <span className="highlight">
                                    {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
                                </span>
                                {' از '}
                                <span className="highlight">{filteredUsers.length}</span>
                                {' کاربر'}
                            </div>
                        </div>

                        {/* جدول - نسخه دسکتاپ */}
                        <div className="table-desktop">
                            <table className="table">
                                <thead>
                                    <tr className="table-header">
                                        <th className="table-th">ردیف</th>
                                        <th className="table-th">نام و نام خانوادگی</th>
                                        <th className="table-th">تلفن</th>
                                        <th className="table-th">نقش</th>
                                        <th className="table-th">وضعیت</th>
                                        <th className="table-th">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {currentItems.map((user, index) => (
                                            <motion.tr
                                                key={user._id}
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
                                                    <div className="user-name">
                                                        <span className="user-name-text">{user.full_name}</span>
                                                    </div>
                                                </td>
                                                <td className="table-td">
                                                    <div className="phone-cell">
                                                        <span className="phone-text">{user.phone}</span>
                                                    </div>
                                                </td>
                                                <td className="table-td">
                                                    <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                                                        {getRolePersian(user.role)}
                                                    </span>
                                                </td>
                                                <td className="table-td">
                                                    <span className={`status-badge ${user.is_active ? "status-active" : "status-inactive"}`}>
                                                        {user.is_active ? "فعال" : "غیرفعال"}
                                                    </span>
                                                </td>
                                                <td className="table-td">
                                                    <div className="actions">

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
                                {currentItems.map((user, index) => (
                                    <motion.div
                                        key={user._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="user-card"
                                    >
                                        <div className="card-header">
                                            <div className="card-user">
                                                <span className="card-index">#{(currentPage - 1) * itemsPerPage + index + 1}</span>
                                                <h3 className="card-name">{user.full_name}</h3>
                                                <p className="card-username">@{user.username}</p>
                                            </div>
                                            <div className="card-statuses">
                                                <span className={`status-badge ${user.is_active ? "status-active" : "status-inactive"}`}>
                                                    {user.is_active ? (
                                                        <PiToggleRight className="status-icon" />
                                                    ) : (
                                                        <PiToggleLeft className="status-icon" />
                                                    )}
                                                    {user.is_active ? "فعال" : "غیرفعال"}
                                                </span>
                                                <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                                                    <PiShieldCheck className="badge-icon" />
                                                    {getRolePersian(user.role)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="card-body">
                                            <div className="card-item">
                                                <PiEnvelope className="card-icon" />
                                                <span>{user.email}</span>
                                            </div>
                                            <div className="card-item">
                                                <PiPhone className="card-icon" />
                                                <span>{user.phone}</span>
                                            </div>
                                            {user.province && user.city && (
                                                <div className="card-item">
                                                    <PiMapPin className="card-icon" />
                                                    <span>{user.province}، {user.city}</span>
                                                </div>
                                            )}
                                            {user.national_code && (
                                                <div className="card-item">
                                                    <PiIdentificationCard className="card-icon" />
                                                    <span>کد ملی: {user.national_code}</span>
                                                </div>
                                            )}
                                            {user.birth_date && (
                                                <div className="card-item">
                                                    <PiCalendar className="card-icon" />
                                                    <span>تاریخ تولد: {new Date(user.birth_date).toLocaleDateString('fa-IR')}</span>
                                                </div>
                                            )}
                                            {user.gender && (
                                                <div className="card-item">
                                                    <PiGenderIntersex className="card-icon" />
                                                    <span>جنسیت: {user.gender === 'male' ? 'مرد' : user.gender === 'female' ? 'زن' : 'سایر'}</span>
                                                </div>
                                            )}
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
                .adminUsersPage {
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

                @media (min-width: 768px) {
                    .table-desktop {
                        display: block;
                        overflow-x: auto;
                    }
                }

                .table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 600px;
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

                .user-name {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .user-name-text {
                    font-weight: 500;
                    color: #1f2937;
                }

                .phone-cell {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: #6b7280;
                }

                .phone-text {
                    font-size: 0.875rem;
                }

                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.25rem 0.5rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                .badge-icon {
                    width: 0.75rem;
                    height: 0.75rem;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.25rem 0.5rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                .status-active {
                    background: #d1fae5;
                    color: #065f46;
                }

                .status-inactive {
                    background: #fee2e2;
                    color: #991b1b;
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

                /* نمای کارتی - موبایل */
                .table-mobile {
                    display: block;
                }

                @media (min-width: 768px) {
                    .table-mobile {
                        display: none;
                    }
                }

                .user-card {
                    padding: 1rem;
                    border-bottom: 1px solid #f3f4f6;
                }

                .user-card:hover {
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

                .card-user {
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

                .card-username {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin: 0;
                }

                .card-statuses {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 0.5rem;
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
                    .adminUsersPage {
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

                    .user-card {
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
                @media (min-width: 481px) and (max-width: 768px) {
                    .adminUsersPage {
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
                    .adminUsersPage {
                        padding: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}