"use client";

import Image from "next/image";
import { useEffect, useState, useMemo, memo } from "react";

/* ============================================================
   Formatters — یک بار در سطح ماژول ساخته می‌شوند
   ============================================================ */
const faDateFormatter = new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "short",
    timeStyle: "short",
});

const faNumberFormatter = new Intl.NumberFormat("fa-IR");

const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "-" : faDateFormatter.format(d);
};

const formatNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? faNumberFormatter.format(n) : "۰";
};

/* ============================================================
   Status maps
   ============================================================ */
const PAYMENT_STATUS_LABEL = {
    paid: "پرداخت شده",
    pending: "در انتظار",
    failed: "ناموفق",
    unpaid: "پرداخت نشده",
    refunded: "بازگشت داده شده",
};

const RESERVATION_STATUS_LABEL = {
    pending: "در انتظار",
    confirmed: "تایید شده",
    cancelled: "لغو شده",
    completed: "انجام شده",
};

/* ============================================================
   Styles — یک بار تعریف، چند بار استفاده
   ============================================================ */
const PAGE_STYLE = { padding: 20 };

const CARD_STYLE = {
    background: "#f9f9f9",
    padding: 20,
    marginBottom: 25,
    borderRadius: 10,
    border: "1px solid #ddd",
    contentVisibility: "auto",
    containIntrinsicSize: "600px",
};

const IMG_STYLE = {
    width: 180,
    height: 120,
    borderRadius: 10,
    marginTop: 10,
    objectFit: "cover",
};

const META_STYLE = {
    fontSize: 12,
    marginTop: 20,
    opacity: 0.7,
};

/* ============================================================
   Error messages
   ============================================================ */
const ERROR_MESSAGES = {
    401: "ابتدا وارد شوید.",
    403: "شما دسترسی ادمین ندارید.",
    500: "خطا در دریافت داده‌ها (کد 500)",
};

/* ============================================================
   ReservationCard — memoized
   ============================================================ */
const ReservationCard = memo(function ReservationCard({ r }) {
    return (
        <div style={CARD_STYLE}>
            <h2>رزرو ملک</h2>

            <p>
                <strong>کاربر:</strong> {r.user?.name} ({r.user?.email})
            </p>

            <p>
                <strong>ملک:</strong> {r.property?.title}
            </p>
            <p>
                <strong>شهر:</strong> {r.property?.city}
            </p>
            <p>
                <strong>آدرس:</strong> {r.property?.address}
            </p>

            {r.property?.images?.[0] && (
                <Image
                    src={r.property.images[0]}
                    alt={r.property?.title || "property"}
                    width={180}
                    height={120}
                    sizes="180px"
                    quality={75}
                    loading="lazy"
                    placeholder="empty"
                    style={IMG_STYLE}
                />
            )}

            <p>
                <strong>مالک ملک:</strong> {r.property_owner?.name} (
                {r.property_owner?.email})
            </p>

            <p>
                <strong>شروع:</strong> {formatDate(r.start_date)}
            </p>
            <p>
                <strong>پایان:</strong> {formatDate(r.end_date)}
            </p>

            <p>
                <strong>مدت رزرو (روز):</strong>{" "}
                {formatNumber(r.duration_days)}
            </p>

            <p>
                <strong>سانس دارد؟</strong> {r.has_sans ? "بله" : "خیر"}
            </p>
            <p>
                <strong>سانس:</strong> {r.sans || "-"}
            </p>

            <p>
                <strong>قیمت پایه:</strong> {formatNumber(r.base_price)} تومان
            </p>
            <p>
                <strong>تخفیف:</strong> {formatNumber(r.discount_amount)} تومان
            </p>
            <p>
                <strong>قیمت نهایی:</strong> {formatNumber(r.final_price)} تومان
            </p>
            <p>
                <strong>بیعانه:</strong> {formatNumber(r.deposit_amount)} تومان
            </p>

            <p>
                <strong>روش پرداخت:</strong> {r.payment_method}
            </p>
            <p>
                <strong>وضعیت پرداخت:</strong>{" "}
                {PAYMENT_STATUS_LABEL[r.payment_status] ?? r.payment_status}
            </p>
            <p>
                <strong>شناسه تراکنش:</strong> {r.transaction_id || "-"}
            </p>

            <p>
                <strong>وضعیت رزرو:</strong>{" "}
                {RESERVATION_STATUS_LABEL[r.status] ?? r.status}
            </p>

            {r.cancel_reason && (
                <p>
                    <strong>علت لغو:</strong> {r.cancel_reason}
                </p>
            )}

            <p>
                <strong>نام مشتری:</strong> {r.full_name}
            </p>
            <p>
                <strong>شماره تماس:</strong> {r.phone}
            </p>

            <p>
                <strong>IP:</strong> {r.ip_address || "-"}
            </p>
            <p>
                <strong>User Agent:</strong> {r.user_agent || "-"}
            </p>

            <p style={META_STYLE}>
                ایجاد: {formatDate(r.createdAt)}
                <br />
                به‌روز شده: {formatDate(r.updatedAt)}
            </p>
        </div>
    );
});

/* ============================================================
   Main Page
   ============================================================ */
export default function PropertyReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        async function loadData() {
            try {
                const res = await fetch("/api/admin/reservations/properties", {
                    credentials: "include",
                    signal: controller.signal,
                    headers: { Accept: "application/json" },
                });

                if (!res.ok) {
                    setError(res.status);
                    return;
                }

                const data = await res.json();
                setReservations(
                    Array.isArray(data?.reservations) ? data.reservations : []
                );
            } catch (err) {
                if (err.name === "AbortError") return;
                setError(500);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        loadData();

        return () => controller.abort();
    }, []);

    /* رندر کارت‌ها فقط وقتی reservations تغییر کند */
    const cards = useMemo(
        () =>
            reservations.map((r) => (
                <ReservationCard key={r._id} r={r} />
            )),
        [reservations]
    );

    if (loading) return <p>در حال بارگذاری...</p>;

    if (error) {
        return (
            <p>
                {ERROR_MESSAGES[error] ||
                    `خطا در دریافت داده‌ها (کد ${error})`}
            </p>
        );
    }

    if (reservations.length === 0) {
        return (
            <div style={PAGE_STYLE}>
                <h1>تمام رزروهای ملک (ادمین)</h1>
                <p>رزروی ثبت نشده است.</p>
            </div>
        );
    }

    return (
        <div style={PAGE_STYLE}>
            <h1>تمام رزروهای ملک (ادمین)</h1>
            {cards}
        </div>
    );
}