// app/hall_owner/ads/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import {
    PiArrowRight,
    PiPaperPlaneTilt,
    PiFloppyDisk,
    PiSpinnerGap,
    PiWarningCircle,
    PiCheckCircle,
    PiClock,
    PiEye,
    PiCursorClick,
} from "react-icons/pi";

const TOAST_OPTIONS = {
    position: "top-left", autoClose: 3500, rtl: true, theme: "light",
    style: { fontFamily: "'IranianSans', system-ui, sans-serif", direction: "rtl", textAlign: "right", borderRadius: "14px", padding: "14px 18px", fontSize: "13.5px", background: "#ffffff", color: "#1e293b" },
};

const faNum = (n) => Number(n || 0).toLocaleString("fa-IR");

export default function AdDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await axios.get(`/api/hall_owner/ads/${id}`);
                setAd(res.data.ad);
            } catch (e) {
                toast.error(e.response?.data?.message || "خطا در دریافت اطلاعات", TOAST_OPTIONS);
                router.push("/hall_owner/ads");
            } finally {
                setLoading(false);
            }
        })();
    }, [id, router]);

    const handleSubmitForReview = async () => {
        setSubmitting(true);
        const toastId = toast.loading("در حال ارسال برای تأیید...");
        try {
            const res = await axios.patch(`/api/hall_owner/ads/${id}/submit`);
            setAd(res.data.ad);
            toast.update(toastId, { render: "تبلیغ برای تأیید ارسال شد", type: "success", isLoading: false, autoClose: 4000 });
        } catch (e) {
            toast.update(toastId, { render: e.response?.data?.message || "خطا در ارسال", type: "error", isLoading: false, autoClose: 5000 });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div dir="rtl" className="w-full max-w-4xl mx-auto">
                <div className="animate-pulse space-y-5">
                    <div className="h-8 w-48 bg-slate-100 rounded-lg" />
                    <div className="h-64 bg-slate-100 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (!ad) return null;

    const canEdit = ["draft", "rejected"].includes(ad.status);
    const canSubmit = ad.status === "draft" && ad.images?.length > 0;
    const ctr = ad.stats?.views > 0 ? ((ad.stats.clicks / ad.stats.views) * 100).toFixed(1) : "0.0";

    return (
        <div dir="rtl" className="w-full max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                    <Link href="/hall_owner/ads" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-gold-700 hover:border-gold-300 transition-all">
                        <PiArrowRight className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">{ad.title}</h1>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">#{ad._id?.slice(-8).toUpperCase()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {canSubmit && (
                        <button onClick={handleSubmitForReview} disabled={submitting} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-bold text-white bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 shadow-md shadow-emerald-500/25 disabled:opacity-50 transition-all">
                            {submitting ? <PiSpinnerGap className="w-4 h-4 animate-spin" /> : <PiPaperPlaneTilt className="w-4 h-4" />}
                            ارسال برای تأیید
                        </button>
                    )}
                    {canEdit && (
                        <Link href={`/hall_owner/ads/${ad._id}/edit`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-bold text-gold-700 bg-gold-50 ring-1 ring-gold-100 hover:bg-gold-500 hover:text-white transition-all">
                            <PiFloppyDisk className="w-4 h-4" /> ویرایش
                        </Link>
                    )}
                </div>
            </div>

            {ad.status === "rejected" && ad.rejection_reason && (
                <div className="mb-5 p-4 bg-rose-50 rounded-2xl ring-1 ring-rose-100 flex items-start gap-3">
                    <PiWarningCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[13px] font-bold text-rose-800 mb-1">این تبلیغ رد شده است</p>
                        <p className="text-[12px] text-rose-700 leading-relaxed">{ad.rejection_reason}</p>
                    </div>
                </div>
            )}

            {ad.status === "pending" && (
                <div className="mb-5 p-4 bg-amber-50 rounded-2xl ring-1 ring-amber-100 flex items-start gap-3">
                    <PiClock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[13px] font-bold text-amber-800 mb-1">در انتظار تأیید ادمین</p>
                        <p className="text-[12px] text-amber-700 leading-relaxed">تبلیغ شما برای بررسی ارسال شده است.</p>
                    </div>
                </div>
            )}

            {ad.status === "active" && (
                <div className="mb-5 p-4 bg-emerald-50 rounded-2xl ring-1 ring-emerald-100 flex items-start gap-3">
                    <PiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[13px] font-bold text-emerald-800 mb-1">تبلیغ در حال نمایش است</p>
                        <p className="text-[12px] text-emerald-700 leading-relaxed">
                            از {new Date(ad.start_date).toLocaleDateString("fa-IR")} تا {new Date(ad.end_date).toLocaleDateString("fa-IR")}
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-4">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1"><PiEye className="w-3.5 h-3.5" /> بازدید</div>
                    <p className="text-[18px] font-bold text-slate-900">{faNum(ad.stats?.views || 0)}</p>
                </div>
                <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-4">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1"><PiCursorClick className="w-3.5 h-3.5" /> کلیک</div>
                    <p className="text-[18px] font-bold text-slate-900">{faNum(ad.stats?.clicks || 0)}</p>
                </div>
                <div className="bg-gold-50 rounded-2xl ring-1 ring-gold-100 p-4">
                    <div className="flex items-center gap-2 text-[11px] text-gold-700 mb-1">CTR</div>
                    <p className="text-[18px] font-bold text-gold-800">{ctr}٪</p>
                </div>
            </div>

            {ad.images?.length > 0 && (
                <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 mb-5">
                    <h2 className="text-[13px] font-bold text-slate-900 mb-3">تصاویر</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {ad.images.map((img, i) => (
                            <div key={i} className="relative aspect-video rounded-xl overflow-hidden ring-1 ring-slate-200">
                                <img src={img} alt={`تصویر ${i + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 space-y-4">
                <h2 className="text-[13px] font-bold text-slate-900">اطلاعات تبلیغ</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12.5px]">
                    <div>
                        <span className="text-slate-500">توضیحات:</span>
                        <p className="text-slate-800 mt-1 leading-relaxed">{ad.description}</p>
                    </div>
                    <div>
                        <span className="text-slate-500">نوع:</span>
                        <p className="text-slate-800 mt-1 font-bold">{ad.ad_type}</p>
                    </div>
                    <div>
                        <span className="text-slate-500">بودجه:</span>
                        <p className="text-slate-800 mt-1 font-bold">{faNum(ad.budget)} تومان</p>
                    </div>
                    <div>
                        <span className="text-slate-500">لینک مقصد:</span>
                        <p className="text-slate-800 mt-1 font-mono text-[11px]" dir="ltr">{ad.target_url || "—"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}