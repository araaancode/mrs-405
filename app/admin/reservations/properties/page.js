"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function PropertyReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const base = process.env.NEXT_PUBLIC_BASE_URL || "";
                const url = `/api/admin/reservations/properties`;

                const res = await axios.get(url, { withCredentials: true });
                setReservations(res.data.reservations || []);
            } catch (err) {
                setError(err.response?.status || 500);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) return <p>در حال بارگذاری...</p>;
    if (error === 401) return <p>ابتدا وارد شوید.</p>;
    if (error === 403) return <p>شما دسترسی ادمین ندارید.</p>;
    if (error) return <p>خطا در دریافت داده‌ها (کد {error})</p>;

    return (
        <div style={{ padding: 20 }}>
            <h1>تمام رزروهای ملک (ادمین)</h1>

            {reservations.length === 0 && <p>رزروی ثبت نشده است.</p>}

            {reservations.map((r) => (
                <div
                    key={r._id}
                    style={{
                        background: "#f9f9f9",
                        padding: 20,
                        marginBottom: 25,
                        borderRadius: 10,
                        border: "1px solid #ddd",
                    }}
                >
                    <h2>رزرو ملک</h2>

                    {/* User */}
                    <p><strong>کاربر:</strong> {r.user?.name} ({r.user?.email})</p>

                    {/* Property */}
                    <p><strong>ملک:</strong> {r.property?.title}</p>
                    <p><strong>شهر:</strong> {r.property?.city}</p>
                    <p><strong>آدرس:</strong> {r.property?.address}</p>

                    {r.property?.images?.[0] && (
                        <img
                            src={r.property.images[0]}
                            alt="property"
                            style={{ width: 180, borderRadius: 10, marginTop: 10 }}
                        />
                    )}

                    {/* Owner */}
                    <p>
                        <strong>مالک ملک:</strong> {r.property_owner?.name} ({r.property_owner?.email})
                    </p>

                    {/* Dates */}
                    <p>
                        <strong>شروع:</strong>{" "}
                        {new Date(r.start_date).toLocaleString("fa-IR")}
                    </p>

                    <p>
                        <strong>پایان:</strong>{" "}
                        {new Date(r.end_date).toLocaleString("fa-IR")}
                    </p>

                    <p><strong>مدت رزرو (روز):</strong> {r.duration_days}</p>

                    {/* Sans */}
                    <p><strong>سانس دارد؟</strong> {r.has_sans ? "بله" : "خیر"}</p>
                    <p><strong>سانس:</strong> {r.sans || "-"}</p>

                    {/* Price */}
                    <p><strong>قیمت پایه:</strong> {r.base_price.toLocaleString()} تومان</p>
                    <p><strong>تخفیف:</strong> {r.discount_amount.toLocaleString()} تومان</p>
                    <p><strong>قیمت نهایی:</strong> {r.final_price.toLocaleString()} تومان</p>
                    <p><strong>بیعانه:</strong> {r.deposit_amount.toLocaleString()} تومان</p>

                    {/* Payment */}
                    <p><strong>روش پرداخت:</strong> {r.payment_method}</p>
                    <p><strong>وضعیت پرداخت:</strong> {r.payment_status}</p>
                    <p><strong>شناسه تراکنش:</strong> {r.transaction_id || "-"}</p>

                    {/* Status */}
                    <p><strong>وضعیت رزرو:</strong> {r.status}</p>

                    {r.cancel_reason && (
                        <p><strong>علت لغو:</strong> {r.cancel_reason}</p>
                    )}

                    {/* User Info */}
                    <p><strong>نام مشتری:</strong> {r.full_name}</p>
                    <p><strong>شماره تماس:</strong> {r.phone}</p>

                    {/* Tracking */}
                    <p><strong>IP:</strong> {r.ip_address || "-"}</p>
                    <p><strong>User Agent:</strong> {r.user_agent || "-"}</p>

                    {/* Times */}
                    <p style={{ fontSize: 12, marginTop: 20, opacity: 0.7 }}>
                        ایجاد: {new Date(r.createdAt).toLocaleString("fa-IR")}
                        <br />
                        به‌روز شده: {new Date(r.updatedAt).toLocaleString("fa-IR")}
                    </p>
                </div>
            ))}
        </div>
    );
}
