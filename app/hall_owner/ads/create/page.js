// app/hall_owner/ads/create/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import {
    PiMegaphone,
    PiArrowRight,
    PiFloppyDisk,
    PiUploadSimple,
    PiX,
    PiSpinnerGap,
} from "react-icons/pi";

import { PersianDatePicker } from "@/components/ui/PersianDatePicker";

const TOAST_OPTIONS = {
    position: "top-left", autoClose: 3500, rtl: true, theme: "light",
    style: { fontFamily: "'IranianSans', system-ui, sans-serif", direction: "rtl", textAlign: "right", borderRadius: "14px", padding: "14px 18px", fontSize: "13.5px", background: "#ffffff", color: "#1e293b" },
};

const AD_TYPES = [
    { value: "banner", label: "بنر (بالای صفحه)" },
    { value: "sidebar", label: "سایدبار" },
    { value: "popup", label: "پاپ‌آپ" },
    { value: "featured", label: "تالار ویژه" },
    { value: "home_slider", label: "اسلایدر صفحه اصلی" },
];

const PLACEMENTS = [
    { value: "all", label: "همه جا" },
    { value: "home", label: "صفحه اصلی" },
    { value: "halls", label: "لیست تالارها" },
    { value: "hall_detail", label: "صفحه تالار" },
    { value: "user_panel", label: "پنل کاربر" },
];

export default function CreateAdPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [halls, setHalls] = useState([]);

    const [form, setForm] = useState({
        title: "",
        description: "",
        images: [],
        ad_type: "banner",
        placement: "all",
        target_url: "",
        cta_text: "مشاهده",
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        budget: 0,
        daily_budget: 0,
        hall_id: "",
    });

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get("/api/hall_owner/halls");
                setHalls(res.data.halls || []);
            } catch (e) { console.error(e); }
        })();
    }, []);

    const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const handleDateChange = (field, dateObject) => {
        if (!dateObject) { setForm((prev) => ({ ...prev, [field]: null })); return; }
        const gregorian = dateObject.toDate();
        setForm((prev) => ({ ...prev, [field]: gregorian }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        if (form.images.length + files.length > 5) {
            toast.error("حداکثر ۵ تصویر مجاز است", TOAST_OPTIONS);
            return;
        }
        const base64Images = await Promise.all(files.map((file) => new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
        })));
        setForm((prev) => ({ ...prev, images: [...prev.images, ...base64Images] }));
    };

    const removeImage = (index) => setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.start_date && form.end_date && new Date(form.end_date) <= new Date(form.start_date)) {
            toast.error("تاریخ پایان باید بعد از تاریخ شروع باشد", TOAST_OPTIONS);
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                ...form,
                start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
                end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
            };
            const res = await axios.post("/api/hall_owner/ads", payload);
            toast.success("تبلیغ ایجاد شد", TOAST_OPTIONS);
            setTimeout(() => router.push(`/hall_owner/ads/${res.data.ad._id}`), 800);
        } catch (err) {
            toast.error(err.response?.data?.message || "خطا در ایجاد تبلیغ", TOAST_OPTIONS);
        } finally {
            setSubmitting(false);
        }
    };

    const inputCls = "w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-900 placeholder:text-slate-400 hover:border-gold-300 focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 transition-all";
    const labelCls = "block text-[12.5px] font-bold text-slate-700 mb-1.5";

    return (
        <div dir="rtl" className="w-full max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25">
                        <PiMegaphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">ثبت تبلیغ جدید</h1>
                        <p className="text-xs text-slate-500 mt-0.5">تبلیغ خود را برای تأیید ادمین ارسال کنید</p>
                    </div>
                </div>
                <Link href="/hall_owner/ads" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium text-slate-600 bg-white border border-slate-200 hover:bg-gold-50 hover:border-gold-300 hover:text-gold-700 transition-all">
                    <PiArrowRight className="w-3.5 h-3.5" /> بازگشت
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 space-y-4">
                    <h2 className="text-[14px] font-bold text-slate-900 mb-3">اطلاعات اصلی</h2>
                    <div>
                        <label className={labelCls}>عنوان تبلیغ *</label>
                        <input type="text" required value={form.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="مثلاً: تخفیف ویژه تابستانه" className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>توضیحات *</label>
                        <textarea required rows={4} value={form.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="توضیحات کامل تبلیغ..." className={inputCls + " resize-none"} />
                    </div>
                    <div>
                        <label className={labelCls}>تالار مرتبط (اختیاری)</label>
                        <select value={form.hall_id} onChange={(e) => handleChange("hall_id", e.target.value)} className={inputCls}>
                            <option value="">بدون تالار خاص (تبلیغ عمومی)</option>
                            {halls.map((h) => <option key={h._id} value={h._id}>{h.title} — {h.city}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-5">
                    <h2 className="text-[14px] font-bold text-slate-900 mb-3">تصاویر (حداکثر ۵ عدد)</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
                        {form.images.map((img, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden ring-1 ring-slate-200 group">
                                <img src={img} alt={`تصویر ${i + 1}`} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PiX className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {form.images.length < 5 && (
                            <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-gold-400 hover:bg-gold-50/30 flex flex-col items-center justify-center cursor-pointer transition-all">
                                <PiUploadSimple className="w-6 h-6 text-slate-400 mb-1" />
                                <span className="text-[10px] text-slate-500">افزودن</span>
                                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                            </label>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 space-y-4">
                    <h2 className="text-[14px] font-bold text-slate-900 mb-3">نوع و مکان نمایش</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>نوع تبلیغ *</label>
                            <select value={form.ad_type} onChange={(e) => handleChange("ad_type", e.target.value)} className={inputCls}>
                                {AD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>مکان نمایش</label>
                            <select value={form.placement} onChange={(e) => handleChange("placement", e.target.value)} className={inputCls}>
                                {PLACEMENTS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>لینک مقصد</label>
                            <input type="text" value={form.target_url} onChange={(e) => handleChange("target_url", e.target.value)} placeholder="https://example.com یا /halls/..." className={inputCls} dir="ltr" />
                        </div>
                        <div>
                            <label className={labelCls}>متن دکمه</label>
                            <input type="text" value={form.cta_text} onChange={(e) => handleChange("cta_text", e.target.value)} placeholder="مشاهده" className={inputCls} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 space-y-4">
                    <h2 className="text-[14px] font-bold text-slate-900 mb-3">زمان‌بندی و بودجه</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <PersianDatePicker label="تاریخ شروع" required value={form.start_date} onChange={(date) => handleDateChange("start_date", date)} minDate={new Date()} placeholder="انتخاب تاریخ شروع" />
                        <PersianDatePicker label="تاریخ پایان" required value={form.end_date} onChange={(date) => handleDateChange("end_date", date)} minDate={form.start_date || new Date()} placeholder="انتخاب تاریخ پایان" />
                        <div>
                            <label className={labelCls}>بودجه کل (تومان) *</label>
                            <input type="number" required min={0} value={form.budget} onChange={(e) => handleChange("budget", Number(e.target.value))} placeholder="0" className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>بودجه روزانه (اختیاری)</label>
                            <input type="number" min={0} value={form.daily_budget} onChange={(e) => handleChange("daily_budget", Number(e.target.value))} placeholder="0" className={inputCls} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <Link href="/hall_owner/ads" className="px-5 py-2.5 rounded-xl text-[12.5px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all">انصراف</Link>
                    <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[12.5px] font-bold text-white bg-gradient-to-b from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 shadow-md shadow-gold-500/25 disabled:opacity-50 transition-all">
                        {submitting ? (<><PiSpinnerGap className="w-4 h-4 animate-spin" /> در حال ذخیره...</>) : (<><PiFloppyDisk className="w-4 h-4" /> ذخیره پیش‌نویس</>)}
                    </button>
                </div>
            </form>
        </div>
    );
}