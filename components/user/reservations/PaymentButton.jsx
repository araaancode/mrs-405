// components/user/reservations/PaymentButton.jsx
"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { PiCreditCard, PiSpinnerGap } from "react-icons/pi";

/* ============================================================
   Toast Options — یک بار در ماژول
   ============================================================ */
const TOAST_OPTIONS = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    rtl: true,
    theme: "light",
    style: {
        fontFamily: "'IranianSans', system-ui, sans-serif",
        direction: "rtl",
        textAlign: "right",
        borderRadius: "14px",
        padding: "14px 18px",
        minHeight: "56px",
        fontSize: "13.5px",
        fontWeight: 500,
        background: "#ffffff",
        color: "#1e293b",
    },
};

const faNum = (n) => Number(n || 0).toLocaleString("fa-IR");

/* ============================================================
   PaymentButton
   ============================================================ */
export default function PaymentButton({ reservation, onSuccess }) {
    const [loading, setLoading] = useState(false);

    // فقط رزروهای accepted قابل پرداخت هستن
    if (reservation.status !== "accepted") return null;

    // اگه قبلاً پرداخت شده
    if (reservation.payment_info?.ref_id) return null;

    // محاسبه مبلغ پیش‌پرداخت
    const amount = Math.round(
        reservation.pre_payment || reservation.final_price || 0
    );

    if (!amount || amount <= 0) return null;

    const handlePayment = async () => {
        setLoading(true);
        try {
            const res = await axios.post("/api/payment/request", {
                reservationId: reservation._id,
            });

            if (res.data.success && res.data.url) {
                toast.success(
                    "در حال انتقال به درگاه پرداخت...",
                    TOAST_OPTIONS
                );

                // انتقال به درگاه زرین‌پال
                setTimeout(() => {
                    window.location.href = res.data.url;
                }, 500);
            } else {
                toast.error(
                    res.data.message || "خطا در ایجاد تراکنش",
                    TOAST_OPTIONS
                );
                setLoading(false);
            }
        } catch (err) {
            console.error("Payment error:", err);
            toast.error(
                err.response?.data?.message || "خطا در ارتباط با سرور",
                TOAST_OPTIONS
            );
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handlePayment}
            disabled={loading}
            className="
                inline-flex items-center justify-center gap-1.5
                px-3.5 py-2 rounded-lg
                text-[11px] font-bold text-white
                bg-gradient-to-b from-emerald-400 to-emerald-600
                hover:from-emerald-500 hover:to-emerald-700
                shadow-sm shadow-emerald-500/25
                hover:shadow-md hover:shadow-emerald-500/40
                focus:outline-none focus:ring-4 focus:ring-emerald-500/20
                disabled:opacity-50 disabled:cursor-not-allowed
                active:scale-95
                transition-all duration-200
            "
        >
            {loading ? (
                <>
                    <PiSpinnerGap className="w-3.5 h-3.5 animate-spin" />
                    در حال انتقال...
                </>
            ) : (
                <>
                    <PiCreditCard className="w-3.5 h-3.5" />
                    پرداخت {faNum(amount)} تومان
                </>
            )}
        </button>
    );
}