"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { PiCalendar, PiUsers, PiCurrencyDollar, PiClock, PiCheckCircle, PiXCircle, PiHourglass, PiCreditCard, PiNote, PiBuilding } from "react-icons/pi";
import { PulseLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";

export default function ReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const response = await axios.get("/api/hall_owner/reservations", {
                    withCredentials: true
                });

                setReservations(response.data.reservations || []);

                if (response.data.reservations?.length > 0) {
                    toast.success(`${response.data.reservations.length} رزرو با موفقیت بارگذاری شد`, {
                        duration: 2000,
                        position: "bottom-center",
                        icon: "",
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

            } catch (error) {
                console.error("Axios error:", error.response?.data || error);
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

        load();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <PulseLoader color="#D4B06A" size={15} margin={6} />
                <p>در حال بارگذاری رزروها...</p>
            </div>
        );
    }

    if (reservations.length === 0) {
        return (
            <div className="empty-state">
                <PiCalendar className="empty-icon" />
                <p className="empty-title">شما هیچ رزروی ندارید</p>
                <p className="empty-description">رزروهای تالار شما در اینجا نمایش داده می‌شوند</p>
            </div>
        );
    }

    return (
        <div className="reservations-page">
            <Toaster />

            <div className="header">
                <h2>رزروهای من</h2>
                <span className="badge">
                    {reservations.length} رزرو
                </span>
            </div>

            <div className="reservations-list">
                {reservations.map((r) => (
                    <ReservationCard key={r._id} data={r} />
                ))}
            </div>

            <style jsx>{`
                .reservations-page {
                    direction: rtl;
                    padding: 1rem;
                    max-width: 100%;
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    min-height: 400px;
                    direction: rtl;
                    gap: 20px;
                }

                .loading-container p {
                    font-size: 16px;
                    color: #6b7280;
                    margin-top: 8px;
                }

                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    background: #f9fafb;
                    border-radius: 16px;
                    border: 1px solid #e5e7eb;
                    direction: rtl;
                }

                .empty-icon {
                    font-size: 48px;
                    color: #d1d5db;
                    margin-bottom: 16px;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                }

                .empty-title {
                    font-size: 16px;
                    color: #6b7280;
                    margin-bottom: 8px;
                }

                .empty-description {
                    font-size: 14px;
                    color: #9ca3af;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .header h2 {
                    font-size: 22px;
                    font-weight: bold;
                    color: #1f2937;
                }

                .badge {
                    background: #f3f4f6;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 14px;
                    color: #4b5563;
                }

                .reservations-list {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                @media (max-width: 768px) {
                    .reservations-page {
                        padding: 0.75rem;
                    }

                    .header h2 {
                        font-size: 20px;
                    }

                    .reservations-list {
                        gap: 18px;
                    }

                    .empty-state {
                        padding: 40px 15px;
                    }

                    .empty-icon {
                        font-size: 36px;
                    }

                    .empty-title {
                        font-size: 14px;
                    }

                    .empty-description {
                        font-size: 12px;
                    }
                }

                @media (max-width: 480px) {
                    .reservations-page {
                        padding: 0.5rem;
                    }

                    .header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                        margin-bottom: 20px;
                    }

                    .header h2 {
                        font-size: 18px;
                    }

                    .badge {
                        font-size: 12px;
                        padding: 4px 10px;
                    }

                    .reservations-list {
                        gap: 16px;
                    }

                    .loading-container p {
                        font-size: 14px;
                    }
                }
            `}</style>
        </div>
    );
}

function ReservationCard({ data }) {
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

    const getStatusIcon = (status) => {
        switch (status) {
            case "pending": return <PiHourglass className="status-icon" />;
            case "accepted": return <PiCheckCircle className="status-icon" />;
            case "rejected": return <PiXCircle className="status-icon" />;
            case "canceled": return <PiXCircle className="status-icon" />;
            default: return <PiClock className="status-icon" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "#f59e0b";
            case "accepted": return "#10b981";
            case "rejected": return "#ef4444";
            case "canceled": return "#6b7280";
            default: return "#6b7280";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "pending": return "در انتظار تایید";
            case "accepted": return "تایید شده";
            case "rejected": return "رد شده";
            case "canceled": return "لغو شده";
            default: return status;
        }
    };

    const getStatusBg = (status) => {
        switch (status) {
            case "pending": return "#fef3c7";
            case "accepted": return "#d1fae5";
            case "rejected": return "#fee2e2";
            case "canceled": return "#f3f4f6";
            default: return "#f3f4f6";
        }
    };

    return (
        <div className="reservation-card">
            {/* هدر کارت */}
            <div className="card-header">
                <div className="card-title">
                    <PiBuilding className="hall-icon" />
                    <div>
                        <div className="reservation-id-label">شماره رزرو</div>
                        <div className="reservation-id">
                            #{typeof _id === "string" ? _id.slice(-8) : _id}
                        </div>
                    </div>
                </div>

                <div
                    className="status-badge"
                    style={{
                        background: getStatusBg(status),
                        color: getStatusColor(status)
                    }}
                >
                    {getStatusIcon(status)}
                    <span>{getStatusText(status)}</span>
                </div>
            </div>

            {/* بدنه کارت */}
            <div className="card-body">
                <div className="info-grid">
                    {/* اطلاعات تالار */}
                    <div className="info-section">
                        <h4 className="section-title">اطلاعات تالار</h4>
                        <Item
                            icon={<PiBuilding />}
                            label="شناسه تالار"
                            value={typeof hall_id === "object" ? hall_id.title || hall_id._id : hall_id}
                        />
                    </div>

                    {/* اطلاعات زمان */}
                    <div className="info-section">
                        <h4 className="section-title">زمان رزرو</h4>
                        <Item icon={<PiCalendar />} label="تاریخ شروع" value={formatDate(start_date)} />
                        <Item icon={<PiCalendar />} label="تاریخ پایان" value={formatDate(end_date)} />
                        <Item icon={<PiUsers />} label="تعداد مهمان" value={`${guests_count} نفر`} />
                    </div>

                    {/* اطلاعات مالی */}
                    <div className="info-section">
                        <h4 className="section-title">اطلاعات مالی</h4>
                        <Item icon={<PiCurrencyDollar />} label="قیمت پایه" value={formatMoney(base_price)} />
                        <Item icon={<PiCurrencyDollar />} label="تخفیف" value={discount ? `${discount}%` : "—"} />
                        <Item icon={<PiCurrencyDollar />} label="قیمت نهایی" value={formatMoney(final_price)} />
                        <Item icon={<PiCurrencyDollar />} label="پیش‌پرداخت" value={formatMoney(pre_payment)} />
                    </div>

                    {/* وضعیت */}
                    <div className="info-section">
                        <h4 className="section-title">وضعیت</h4>
                        <Item
                            label="تایید مالک"
                            value={is_confirmed_by_owner ? "بله ✓" : "خیر ✗"}
                            valueColor={is_confirmed_by_owner ? "#10b981" : "#ef4444"}
                        />
                        {reviewed_at && <Item label="تاریخ بررسی" value={formatDateTime(reviewed_at)} />}
                        {cancel_reason && <Item label="دلیل لغو" value={cancel_reason} />}
                    </div>
                </div>

                {/* یادداشت‌ها */}
                {(user_note || owner_note) && (
                    <div className="notes-section">
                        <h4 className="notes-title">
                            <PiNote />
                            یادداشت‌ها
                        </h4>
                        {user_note && <Item label="یادداشت کاربر" value={user_note} />}
                        {owner_note && <Item label="یادداشت مالک" value={owner_note} />}
                    </div>
                )}

                {/* اطلاعات پرداخت */}
                {payment_info && (
                    <div className="payment-section">
                        <h4 className="payment-title">
                            <PiCreditCard />
                            اطلاعات پرداخت
                        </h4>
                        <div className="payment-grid">
                            <Item label="کد پیگیری" value={payment_info?.tracking_code || "—"} />
                            <Item label="رسید پرداخت" value={payment_info?.ref_id || "—"} />
                            <Item label="زمان پرداخت" value={payment_info?.paid_at ? formatDateTime(payment_info.paid_at) : "—"} />
                        </div>
                    </div>
                )}

                {/* تاریخ ایجاد و بروزرسانی */}
                <div className="timestamps">
                    <span>📅 ایجاد: {formatDateTime(createdAt)}</span>
                    <span>🔄 بروزرسانی: {formatDateTime(updatedAt)}</span>
                </div>
            </div>

            <style jsx>{`
                .reservation-card {
                    background: white;
                    border-radius: 20px;
                    border: 1px solid #f0f0f0;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .reservation-card:hover {
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                    transform: translateY(-2px);
                }

                .card-header {
                    padding: 20px 24px;
                    background: linear-gradient(135deg, #f8f9fa, #ffffff);
                    border-bottom: 1px solid #f0f0f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .card-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .hall-icon {
                    font-size: 24px;
                    color: #D4B06A;
                }

                .reservation-id-label {
                    font-size: 14px;
                    color: #6b7280;
                }

                .reservation-id {
                    font-size: 18px;
                    font-weight: bold;
                    color: #1f2937;
                }

                .status-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 14px;
                    border-radius: 30px;
                    font-weight: bold;
                    font-size: 14px;
                }

                .status-icon {
                    font-size: 20px;
                }

                .card-body {
                    padding: 20px 24px;
                }

                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                }

                .info-section {
                    background: #f9fafb;
                    padding: 16px;
                    border-radius: 16px;
                }

                .section-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #D4B06A;
                    margin-bottom: 12px;
                }

                .notes-section {
                    margin-top: 20px;
                    padding: 16px;
                    background: #fefce8;
                    border-radius: 16px;
                    border: 1px solid #fef08a;
                }

                .notes-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #854d0e;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .payment-section {
                    margin-top: 20px;
                    padding: 16px;
                    background: #eff6ff;
                    border-radius: 16px;
                    border: 1px solid #bfdbfe;
                }

                .payment-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #1e40af;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .payment-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 12px;
                }

                .timestamps {
                    margin-top: 20px;
                    padding-top: 16px;
                    border-top: 1px solid #f0f0f0;
                    display: flex;
                    gap: 20px;
                    font-size: 12px;
                    color: #9ca3af;
                    flex-wrap: wrap;
                }

                @media (max-width: 768px) {
                    .card-header {
                        padding: 16px 18px;
                    }

                    .card-body {
                        padding: 16px 18px;
                    }

                    .info-grid {
                        grid-template-columns: 1fr;
                        gap: 14px;
                    }

                    .reservation-id {
                        font-size: 16px;
                    }

                    .status-badge {
                        font-size: 12px;
                        padding: 4px 12px;
                    }

                    .payment-grid {
                        grid-template-columns: 1fr;
                    }

                    .timestamps {
                        flex-direction: column;
                        gap: 8px;
                    }
                }

                @media (max-width: 480px) {
                    .card-header {
                        padding: 14px;
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .card-body {
                        padding: 14px;
                    }

                    .info-section {
                        padding: 12px;
                    }

                    .reservation-id {
                        font-size: 14px;
                    }

                    .reservation-id-label {
                        font-size: 12px;
                    }

                    .section-title {
                        font-size: 13px;
                    }

                    .status-badge {
                        font-size: 11px;
                        padding: 4px 10px;
                    }

                    .status-icon {
                        font-size: 16px;
                    }

                    .notes-section,
                    .payment-section {
                        padding: 12px;
                    }

                    .timestamps {
                        font-size: 10px;
                    }
                }
            `}</style>
        </div>
    );
}

// کامپوننت نمایش آیتم با آیکون
function Item({ label, value, icon, valueColor }) {
    return (
        <div className="item-container">
            {icon && <span className="item-icon">{icon}</span>}
            <strong className="item-label">{label}:</strong>
            <span className="item-value" style={{ color: valueColor || "#1f2937" }}>
                {value !== undefined && value !== null && value !== "" ? value : "—"}
            </span>

            <style jsx>{`
                .item-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 0;
                    font-size: 14px;
                    flex-wrap: wrap;
                }

                .item-icon {
                    color: #9ca3af;
                    font-size: 14px;
                }

                .item-label {
                    color: #4b5563;
                    min-width: 100px;
                }

                .item-value {
                    color: #1f2937;
                    word-break: break-word;
                }

                @media (max-width: 480px) {
                    .item-container {
                        font-size: 12px;
                        gap: 4px;
                    }

                    .item-label {
                        min-width: 80px;
                    }
                }
            `}</style>
        </div>
    );
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
    return typeof number === "number" && !isNaN(number)
        ? number.toLocaleString("fa-IR") + " تومان"
        : "—";
}