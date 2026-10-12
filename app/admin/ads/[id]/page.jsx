// app/admin/ads/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
    PiArrowRight,
    PiCheckCircle,
    PiXCircle,
    PiUser,
    PiBuilding,
    PiCurrencyCircleDollar,
    PiCalendarBlank,
    PiEye,
    PiCursorClick,
    PiChartLine,
    PiWarningCircle,
    PiTrash,
    PiSpinnerGap,
} from "react-icons/pi";

const TOAST_OPTIONS = {
    position: "top-left",
    autoClose: 3500,
    rtl: true,
    theme: "light",
    style: {
        fontFamily: "'IranianSans', system-ui, sans-serif",
        direction: "rtl",
        textAlign: "right",
        borderRadius: "14px",
        padding: "14px 18px",
        fontSize: "13.5px",
        background: "#ffffff",
        color: "#1e293b",
    },
};

const faNum = (n) => Number(n || 0).toLocaleString("fa-IR");

export default function AdminAdDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await axios.get(`/api/admin/ads/${id}`);
                setAd(res.data.ad);
            } catch (e) {
                toast.error(e.response?.data?.message || "خطا در دریافت اطلاعات", TOAST_OPTIONS);
                router.push("/admin/ads");
            } finally {
                setLoading(false);
            }
        })();
    }, [id, router]);

    const handleApprove = async () => {
        setActionLoading(true);
        const toastId = toast.loading("در حال تأیید...");
        try {
            const res = await axios.patch(`/api/admin/ads/${id}/approve`);
            setAd(res.data.ad);
            toast.update(toastId, {
                render: "تبلیغ تأیید شد",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
        } catch (e) {
            toast.update(toastId, {
                render: e.response?.data?.message || "خطا در تأیید",
                type: "error",
                isLoading: false,
                autoClose: 5000,
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectReason || rejectReason.trim().length < 5) {
            toast.error("دلیل رد باید حداقل ۵ کاراکتر باشد", TOAST_OPTIONS);
            return;
        }

        setActionLoading(true);
        const toastId = toast.loading("در حال رد...");
        try {
            const res = await axios.patch(`/api/admin/ads/${id}/reject`, {
                reason: rejectReason,
            });
            setAd(res.data.ad);
            toast.update(toastId, {
                render: "تبلیغ رد شد",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
            setShowRejectModal(false);
            setRejectReason("");
        } catch (e) {
            toast.update(toastId, {
                render: e.response?.data?.message || "خطا در رد",
                type: "error",
                isLoading: false,
                autoClose: 5000,
            });
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div dir="rtl" className="w-full">
                <div className="animate-pulse space-y-5">
                    <div className="h-8 w-48 bg-slate-100 rounded-lg" />
                    <div className="h-64 bg-slate-100 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (!ad) return null;

    const ctr = ad.stats?.views > 0
        ? ((ad.stats.clicks / ad.stats.views) * 100).toFixed(1)
        : "0.0";

    const canReview = ad.status === "pending";

    return (
        <div dir="rtl" className="w-full max-w-4xl mx-auto">
            {/* ==================== Header ==================== */}
            <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/ads"
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-gold-700 hover:border-gold-300 transition-all"
                    >
                        <PiArrowRight className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">
                            بررسی تبلیغ
                        </h1>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            #{ad._id?.slice(-8).toUpperCase()}
                        </p>
                    </div>
                </div>

                {canReview && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowRejectModal(true)}
                            disabled={actionLoading}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-bold text-rose-600 bg-rose-50 ring-1 ring-rose-100 hover:bg-rose-500 hover:text-white hover:ring-rose-500 disabled:opacity-50 active:scale-95 transition-all"
                        >
                            <PiXCircle className="w-4 h-4" />
                            رد کردن
                        </button>
                        <button
                            onClick={handleApprove}
                            disabled={actionLoading}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-bold text-white bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 shadow-md shadow-emerald-500/25 disabled:opacity-50 active:scale-95 transition-all"
                        >
                            {actionLoading ? (
                                <PiSpinnerGap className="w-4 h-4 animate-spin" />
                            ) : (
                                <PiCheckCircle className="w-4 h-4" />
                            )}
                            تأیید تبلیغ
                        </button>
                    </div>
                )}
            </div>

            {/* ==================== Status ==================== */}
            {ad.status === "rejected" && ad.rejection_reason && (
                <div className="mb-5 p-4 bg-rose-50 rounded-2xl ring-1 ring-rose-100 flex items-start gap-3">
                    <PiWarningCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[13px] font-bold text-rose-800 mb-1">
                            این تبلیغ رد شده است
                        </p>
                        <p className="text-[12px] text-rose-700 leading-relaxed">
                            {ad.rejection_reason}
                        </p>
                    </div>
                </div>
            )}

            {/* ==================== Images ==================== */}
            {ad.images?.length > 0 && (
                <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 mb-5">
                    <h2 className="text-[13px] font-bold text-slate-900 mb-3">
                        تصاویر تبلیغ
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {ad.images.map((img, i) => (
                            <div
                                key={i}
                                className="relative aspect-video rounded-xl overflow-hidden ring-1 ring-slate-200"
                            >
                                <Image
                                    src={img}
                                    alt={`تصویر ${i + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ==================== Info ==================== */}
            <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 mb-5 space-y-4">
                <h2 className="text-[13px] font-bold text-slate-900">
                    اطلاعات تبلیغ
                </h2>

                <div>
                    <p className="text-[11px] text-slate-500 mb-1">عنوان</p>
                    <p className="text-[15px] font-bold text-slate-900">
                        {ad.title}
                    </p>
                </div>

                <div>
                    <p className="text-[11px] text-slate-500 mb-1">توضیحات</p>
                    <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-line">
                        {ad.description}
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                    <div>
                        <p className="text-[10.5px] text-slate-500 mb-1">نوع</p>
                        <p className="text-[12.5px] font-bold text-slate-800">
                            {ad.ad_type}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10.5px] text-slate-500 mb-1">مکان</p>
                        <p className="text-[12.5px] font-bold text-slate-800">
                            {ad.placement}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10.5px] text-slate-500 mb-1">CTA</p>
                        <p className="text-[12.5px] font-bold text-slate-800">
                            {ad.cta_text}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10.5px] text-slate-500 mb-1">لینک</p>
                        <p
                            className="text-[11px] text-gold-700 font-mono truncate"
                            dir="ltr"
                        >
                            {ad.target_url || "—"}
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================== Owner ==================== */}
            <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 mb-5">
                <h2 className="text-[13px] font-bold text-slate-900 mb-3">
                    مالک تبلیغ
                </h2>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <PiUser className="w-6 h-6 text-slate-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-bold text-slate-900">
                            {ad.owner_id?.full_name || "نامشخص"}
                        </p>
                        <p className="text-[11.5px] text-slate-500" dir="ltr">
                            {ad.owner_id?.email}
                        </p>
                        <p className="text-[11.5px] text-slate-500" dir="ltr">
                            {ad.owner_id?.phone}
                        </p>
                    </div>
                </div>

                {ad.hall_id && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gold-50 flex items-center justify-center flex-shrink-0">
                            <PiBuilding className="w-5 h-5 text-gold-500" />
                        </div>
                        <div>
                            <p className="text-[10.5px] text-slate-500">تالار مرتبط</p>
                            <p className="text-[12.5px] font-bold text-slate-800">
                                {ad.hall_id.title} — {ad.hall_id.city}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* ==================== Stats ==================== */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-4">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                        <PiEye className="w-3.5 h-3.5" />
                        بازدید
                    </div>
                    <p className="text-[18px] font-bold text-slate-900">
                        {faNum(ad.stats?.views || 0)}
                    </p>
                </div>
                <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-4">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                        <PiCursorClick className="w-3.5 h-3.5" />
                        کلیک
                    </div>
                    <p className="text-[18px] font-bold text-slate-900">
                        {faNum(ad.stats?.clicks || 0)}
                    </p>
                </div>
                <div className="bg-gold-50 rounded-2xl ring-1 ring-gold-100 p-4">
                    <div className="flex items-center gap-2 text-[11px] text-gold-700 mb-1">
                        <PiChartLine className="w-3.5 h-3.5" />
                        CTR
                    </div>
                    <p className="text-[18px] font-bold text-gold-800">
                        {ctr}٪
                    </p>
                </div>
            </div>

            {/* ==================== Budget & Dates ==================== */}
            <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-5">
                <h2 className="text-[13px] font-bold text-slate-900 mb-3">
                    بودجه و زمان‌بندی
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                        <p className="text-[10.5px] text-slate-500 mb-1">بودجه کل</p>
                        <p className="text-[13px] font-bold text-slate-900">
                            {faNum(ad.budget)} <span className="text-[10px] text-slate-500">تومان</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-[10.5px] text-slate-500 mb-1">بودجه روزانه</p>
                        <p className="text-[13px] font-bold text-slate-900">
                            {faNum(ad.daily_budget)} <span className="text-[10px] text-slate-500">تومان</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-[10.5px] text-slate-500 mb-1">تاریخ شروع</p>
                        <p className="text-[12.5px] font-bold text-slate-800">
                            {new Date(ad.start_date).toLocaleDateString("fa-IR")}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10.5px] text-slate-500 mb-1">تاریخ پایان</p>
                        <p className="text-[12.5px] font-bold text-slate-800">
                            {new Date(ad.end_date).toLocaleDateString("fa-IR")}
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================== Reject Modal ==================== */}
            <AnimatePresence>
                {showRejectModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => !actionLoading && setShowRejectModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 12 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 12 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl ring-1 ring-slate-100 shadow-2xl p-6 w-full max-w-md"
                        >
                            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/60 flex items-center justify-center ring-1 ring-rose-100">
                                <PiXCircle className="w-7 h-7 text-rose-500" />
                            </div>
                            <h3 className="text-[16px] font-bold text-slate-900 mb-2 text-center">
                                رد تبلیغ
                            </h3>
                            <p className="text-[12.5px] text-slate-500 leading-relaxed mb-4 text-center">
                                لطفاً دلیل رد این تبلیغ را وارد کنید.
                            </p>

                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                rows={4}
                                placeholder="دلیل رد (حداقل ۵ کاراکتر)..."
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-900 placeholder:text-slate-400 hover:border-rose-300 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all resize-none mb-4"
                                autoFocus
                            />

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setRejectReason("");
                                    }}
                                    disabled={actionLoading}
                                    className="px-4 py-2.5 rounded-xl text-[12.5px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all"
                                >
                                    انصراف
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={actionLoading}
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[12.5px] font-bold text-white bg-gradient-to-b from-rose-400 to-rose-600 hover:from-rose-500 hover:to-rose-700 shadow-md shadow-rose-500/25 disabled:opacity-50 transition-all"
                                >
                                    {actionLoading ? (
                                        <>
                                            <PiSpinnerGap className="w-3.5 h-3.5 animate-spin" />
                                            در حال رد...
                                        </>
                                    ) : (
                                        <>
                                            <PiXCircle className="w-3.5 h-3.5" />
                                            رد کن
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}