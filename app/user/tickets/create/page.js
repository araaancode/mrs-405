"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
    PiTicket,
    PiChatCircleDots,
    PiPencilSimpleLine,
    PiPaperPlaneTilt,
    PiSpinnerGap,
    PiArrowLeft,
    PiCheckCircle,
    PiWarningCircle,
    PiInfo,
    PiLightbulb,
    PiUser,
} from "react-icons/pi";

/* ============================================================
   Priority Config
   ============================================================ */
const PRIORITIES = [
    {
        value: "low",
        label: "کم",
        icon: PiCheckCircle,
        activeBg: "bg-emerald-50",
        activeBorder: "border-emerald-400",
        activeText: "text-emerald-700",
        hoverBorder: "hover:border-emerald-200",
        desc: "برای سوالات و پیشنهادات",
    },
    {
        value: "medium",
        label: "متوسط",
        icon: PiWarningCircle,
        activeBg: "bg-amber-50",
        activeBorder: "border-amber-400",
        activeText: "text-amber-700",
        hoverBorder: "hover:border-amber-200",
        desc: "برای مشکلات معمولی",
    },
    {
        value: "high",
        label: "زیاد",
        icon: PiWarningCircle,
        activeBg: "bg-rose-50",
        activeBorder: "border-rose-400",
        activeText: "text-rose-700",
        hoverBorder: "hover:border-rose-200",
        desc: "بررسی سریع‌تر",
    },
];

/* ============================================================
   Page
   ============================================================ */
export default function UserCreateTicketPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        subject: "",
        description: "",
        priority: "medium",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    /* ============================================================
       تغییرات فرم
       ============================================================ */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    /* ============================================================
       اعتبارسنجی
       ============================================================ */
    const validate = () => {
        const e = {};

        if (!form.subject.trim()) {
            e.subject = "موضوع تیکت الزامی است";
        } else if (form.subject.trim().length < 5) {
            e.subject = "موضوع باید حداقل ۵ کاراکتر باشد";
        } else if (form.subject.length > 100) {
            e.subject = "موضوع نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد";
        }

        if (!form.description.trim()) {
            e.description = "توضیحات تیکت الزامی است";
        } else if (form.description.trim().length < 10) {
            e.description = "توضیحات باید حداقل ۱۰ کاراکتر باشد";
        } else if (form.description.length > 2000) {
            e.description = "توضیحات نمی‌تواند بیشتر از ۲۰۰۰ کاراکتر باشد";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    /* ============================================================
       Submit
       ============================================================ */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ FIX: به‌جای toast های پراکنده، اعتبارسنجی متمرکز
        if (!validate()) {
            toast.error("لطفاً خطاهای فرم را برطرف کنید");
            return;
        }

        try {
            setLoading(true);

            await axios.post("/api/user/tickets", {
                subject: form.subject.trim(),
                description: form.description.trim(),
                priority: form.priority,
            });

            toast.success("تیکت شما با موفقیت ثبت شد", {
                duration: 2500,
                position: "top-center",
                iconTheme: { primary: "#C6A14C", secondary: "#ffffff" },
            });

            setTimeout(() => router.push("/user/tickets"), 800);
        } catch (err) {
            toast.error(err.response?.data?.message || "خطا در ایجاد تیکت");
        } finally {
            setLoading(false);
        }
    };

    /* ============================================================
       Render
       ============================================================ */
    return (
        <div dir="rtl" className="w-full">
            <Toaster />

            {/* ==================== Header ==================== */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mb-6"
            >
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25 flex-shrink-0">
                        <PiTicket className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                            ایجاد تیکت جدید
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            تیکت خود را ثبت کنید، کارشناسان ما در اسرع وقت پاسخگو خواهند بود
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* ==================== فرم ==================== */}
            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="max-w-3xl space-y-6"
            >
                {/* ============ موضوع ============ */}
                <div>
                    <label
                        htmlFor="subject"
                        className="block text-[13px] font-medium text-slate-700 mb-1.5"
                    >
                        موضوع تیکت <span className="text-rose-500">*</span>
                    </label>

                    <div className="relative group">
                        <PiChatCircleDots
                            className="
                absolute right-3.5 top-1/2 -translate-y-1/2
                w-4 h-4 pointer-events-none
                text-slate-400
                group-focus-within:text-gold-500
                transition-colors duration-200
              "
                        />
                        <input
                            id="subject"
                            type="text"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            placeholder="مثلاً: مشکل در ثبت رزرو"
                            maxLength={100}
                            aria-invalid={!!errors.subject}
                            aria-describedby={errors.subject ? "subject-error" : undefined}
                            className={`
                w-full pr-11 pl-3.5 py-2.5
                bg-white border rounded-xl
                text-sm text-slate-900
                placeholder:text-slate-400
                focus:outline-none focus:ring-4
                transition-all duration-200
                ${errors.subject
                                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                                    : "border-slate-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-500/10"
                                }
              `}
                        />
                    </div>

                    {/* راهنما / شمارنده / خطا */}
                    <div className="flex items-center justify-between gap-2 mt-1.5">
                        {errors.subject ? (
                            <p
                                id="subject-error"
                                className="text-[11px] text-rose-600 flex items-center gap-1"
                            >
                                <PiWarningCircle className="w-3.5 h-3.5" />
                                {errors.subject}
                            </p>
                        ) : (
                            <p className="text-[11px] text-slate-400">
                                حداقل ۵ و حداکثر ۱۰۰ کاراکتر
                            </p>
                        )}
                        <span
                            className={`
                text-[10.5px] font-mono
                ${form.subject.length > 90
                                    ? "text-rose-500"
                                    : "text-slate-400"
                                }
              `}
                        >
                            {form.subject.length}/100
                        </span>
                    </div>
                </div>

                {/* ============ اولویت ============ */}
                <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                        سطح اولویت
                    </label>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {PRIORITIES.map((p) => {
                            const Icon = p.icon;
                            const isActive = form.priority === p.value;

                            return (
                                <button
                                    key={p.value}
                                    type="button"
                                    onClick={() =>
                                        setForm((prev) => ({ ...prev, priority: p.value }))
                                    }
                                    aria-pressed={isActive}
                                    className={`
                    relative flex flex-col items-center justify-center gap-1.5
                    px-3 py-3 sm:py-4 rounded-xl
                    border-2 transition-all duration-200
                    ${isActive
                                            ? `${p.activeBg} ${p.activeBorder} ${p.activeText} shadow-sm`
                                            : `bg-white border-slate-200 text-slate-600 ${p.hoverBorder} hover:bg-slate-50`
                                        }
                  `}
                                >
                                    <Icon
                                        className={`w-4 h-4 ${isActive ? "" : "text-slate-400"}`}
                                    />
                                    <span className="text-[12px] font-bold">{p.label}</span>

                                    {isActive && (
                                        <motion.span
                                            layoutId="priorityIndicator"
                                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white shadow-md ring-1 ring-current flex items-center justify-center"
                                        >
                                            <PiCheckCircle className="w-3 h-3" />
                                        </motion.span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* توضیح اولویت فعال */}
                    <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                        <PiInfo className="w-3.5 h-3.5" />
                        {PRIORITIES.find((p) => p.value === form.priority)?.desc}
                    </p>
                </div>

                {/* ============ توضیحات ============ */}
                <div>
                    <label
                        htmlFor="description"
                        className="block text-[13px] font-medium text-slate-700 mb-1.5"
                    >
                        توضیحات کامل <span className="text-rose-500">*</span>
                    </label>

                    <div className="relative group">
                        <PiPencilSimpleLine
                            className="
                absolute right-3.5 top-3
                w-4 h-4 pointer-events-none
                text-slate-400
                group-focus-within:text-gold-500
                transition-colors duration-200
              "
                        />
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="مشکل یا سوال خود را کامل و واضح توضیح دهید..."
                            rows={6}
                            maxLength={2000}
                            aria-invalid={!!errors.description}
                            aria-describedby={
                                errors.description ? "description-error" : undefined
                            }
                            className={`
                w-full pr-11 pl-3.5 py-3
                bg-white border rounded-xl
                text-sm text-slate-900
                placeholder:text-slate-400
                resize-none
                focus:outline-none focus:ring-4
                transition-all duration-200
                ${errors.description
                                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                                    : "border-slate-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-500/10"
                                }
              `}
                        />
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-1.5">
                        {errors.description ? (
                            <p
                                id="description-error"
                                className="text-[11px] text-rose-600 flex items-center gap-1"
                            >
                                <PiWarningCircle className="w-3.5 h-3.5" />
                                {errors.description}
                            </p>
                        ) : (
                            <p className="text-[11px] text-slate-400">
                                هرچه دقیق‌تر بنویسید، پاسخ سریع‌تر خواهد بود
                            </p>
                        )}
                        <span
                            className={`
                text-[10.5px] font-mono
                ${form.description.length > 1800
                                    ? "text-rose-500"
                                    : "text-slate-400"
                                }
              `}
                        >
                            {form.description.length}/2000
                        </span>
                    </div>
                </div>

                {/* ============ Action Bar ============ */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        disabled={loading}
                        className="
              inline-flex items-center justify-center gap-2
              px-5 py-2.5 rounded-xl
              text-[13px] font-medium
              text-slate-700 bg-white
              border border-slate-200
              hover:bg-gold-50 hover:border-gold-300 hover:text-gold-700
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            "
                    >
                        <PiArrowLeft className="w-4 h-4" />
                        بازگشت
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
              flex-1 sm:flex-none sm:min-w-[180px]
              inline-flex items-center justify-center gap-2
              px-6 py-3 rounded-xl
              text-sm font-bold text-white
              bg-gradient-to-b from-gold-400 to-gold-600
              hover:from-gold-500 hover:to-gold-700
              shadow-md shadow-gold-500/25
              hover:shadow-lg hover:shadow-gold-500/40
              hover:-translate-y-0.5
              focus:outline-none focus:ring-4 focus:ring-gold-500/25
              disabled:opacity-60 disabled:cursor-not-allowed
              disabled:hover:translate-y-0 disabled:hover:shadow-md
              active:scale-95
              transition-all duration-200
            "
                    >
                        {loading ? (
                            <>
                                <PiSpinnerGap className="w-4 h-4 animate-spin" />
                                در حال ارسال...
                            </>
                        ) : (
                            <>
                                <PiPaperPlaneTilt className="w-4 h-4" />
                                ثبت تیکت
                            </>
                        )}
                    </button>
                </div>
            </motion.form>

            {/* ==================== راهنمای کناری ==================== */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="
          mt-8 max-w-3xl
          p-5 rounded-2xl
          bg-gradient-to-br from-gold-50/60 via-white to-white
          border border-gold-100
        "
            >
                <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gold-100 flex items-center justify-center flex-shrink-0">
                        <PiLightbulb className="w-4 h-4 text-gold-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-bold text-slate-800 mb-2">
                            نکات مهم برای ثبت تیکت مؤثر
                        </h4>

                        <ul className="space-y-1.5 text-[12px] text-slate-600">
                            <li className="flex items-start gap-2">
                                <PiCheckCircle
                                    className="w-3.5 h-3.5 text-gold-500 mt-0.5 flex-shrink-0"
                                    strokeWidth={3}
                                />
                                موضوع تیکت را دقیق و مختصر انتخاب کنید
                            </li>
                            <li className="flex items-start gap-2">
                                <PiCheckCircle
                                    className="w-3.5 h-3.5 text-gold-500 mt-0.5 flex-shrink-0"
                                    strokeWidth={3}
                                />
                                مراحل بروز مشکل را گام‌به‌گام توضیح دهید
                            </li>
                            <li className="flex items-start gap-2">
                                <PiCheckCircle
                                    className="w-3.5 h-3.5 text-gold-500 mt-0.5 flex-shrink-0"
                                    strokeWidth={3}
                                />
                                پیام‌های قبلی تیکت را در بخش "همه تیکت‌ها" پیگیری کنید
                            </li>
                            <li className="flex items-start gap-2">
                                <PiCheckCircle
                                    className="w-3.5 h-3.5 text-gold-500 mt-0.5 flex-shrink-0"
                                    strokeWidth={3}
                                />
                                برای مشکلات فوری، اولویت «زیاد» را انتخاب کنید
                            </li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}