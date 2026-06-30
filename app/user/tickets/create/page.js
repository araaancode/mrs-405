"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function UserCreateTicketPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        subject: "",
        description: "",
        priority: "medium"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.subject || !form.description) {
            toast.error("لطفاً موضوع و توضیحات تیکت را وارد کنید");
        }

        if (form.subject.length < 5) {
            toast.error("موضوع تیکت باید حداقل ۵ کاراکتر باشد");
        }

        if (form.description.length < 10) {
            toast.error("توضیحات تیکت باید حداقل ۱۰ کاراکتر باشد");
        }

        try {
            setLoading(true);

            await axios.post("/api/user/tickets", {
                subject: form.subject,
                description: form.description,
                priority: form.priority
            });

            router.push("/user/tickets");

        } catch (err) {
            toast.error(err.response?.data?.message || "خطا در ایجاد تیکت");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-ticket-page px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
            {/* هدر صفحه */}
            <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 rounded-xl flex-shrink-0">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#D4B06A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#2C2418]">
                                ایجاد تیکت جدید
                            </h2>
                            <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">
                                تیکت پشتیبانی خود را ثبت کنید، کارشناسان ما در اسرع وقت پاسخگو خواهند بود
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mt-2" />
            </div>

            {/* فرم ایجاد تیکت */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-full sm:max-w-2xl lg:max-w-3xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">

                    {/* موضوع تیکت */}
                    <div>
                        <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                            موضوع تیکت
                            <span className="text-red-500 mr-1">*</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-[#D4B06A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                placeholder="مثلاً: مشکل در ثبت تالار"
                                className="w-full pr-8 sm:pr-10 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                                       text-[#2C2418] placeholder-gray-400 text-xs sm:text-sm
                                       focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20
                                       transition-all duration-300"
                                required
                                minLength={5}
                                maxLength={100}
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-1 mt-1">
                            <p className="text-xs text-gray-400">
                                حداقل ۵ و حداکثر ۱۰۰ کاراکتر
                            </p>
                            <p className="text-xs text-gray-400">
                                {form.subject.length}/100
                            </p>
                        </div>
                    </div>

                    {/* اولویت */}
                    <div>
                        <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                            سطح اولویت
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, priority: "low" })}
                                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm
                                    transition-all duration-300 border-2
                                    ${form.priority === "low"
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                                    }`}
                            >
                                <span>✓</span>
                                <span>کم</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setForm({ ...form, priority: "medium" })}
                                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm
                                    transition-all duration-300 border-2
                                    ${form.priority === "medium"
                                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                                    }`}
                            >
                                <span>!!</span>
                                <span>متوسط</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setForm({ ...form, priority: "high" })}
                                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm
                                    transition-all duration-300 border-2
                                    ${form.priority === "high"
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                                    }`}
                            >
                                <span>⚠️</span>
                                <span>زیاد</span>
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5 sm:mt-2">
                            {form.priority === "high" && "⚠️ تیکت‌های با اولویت بالا سریع‌تر بررسی می‌شوند"}
                            {form.priority === "medium" && "ℹ️ اولویت متوسط برای مشکلات معمولی"}
                            {form.priority === "low" && "✓ اولویت کم برای سوالات و پیشنهادات"}
                        </p>
                    </div>

                    {/* توضیحات */}
                    <div>
                        <label className="block text-[#2C2418] text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                            توضیحات کامل
                            <span className="text-red-500 mr-1">*</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute top-2.5 sm:top-3 right-2 sm:right-3 pointer-events-none">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-[#D4B06A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="w-full pr-8 sm:pr-10 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                                       text-[#2C2418] placeholder-gray-400 text-xs sm:text-sm
                                       focus:outline-none focus:border-[#D4B06A] focus:ring-2 focus:ring-[#D4B06A]/20
                                       transition-all duration-300 resize-none"
                                placeholder="مشکل خود را کامل توضیح دهید..."
                                rows="5 sm:rows-6"
                                required
                                minLength={10}
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-1 mt-1">
                            <p className="text-xs text-gray-400">
                                حداقل ۱۰ کاراکتر
                            </p>
                            <p className="text-xs text-gray-400">
                                {form.description.length} کاراکتر
                            </p>
                        </div>
                    </div>

                    {/* نمایش خطا */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-xl"
                        >
                            <span className="text-red-500 text-base sm:text-lg flex-shrink-0">⚠️</span>
                            <p className="text-red-600 text-xs sm:text-sm font-medium">
                                {error}
                            </p>
                        </motion.div>
                    )}

                    {/* دکمه‌های اقدام */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-3 sm:pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-70 w-full sm:w-auto"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    در حال ارسال...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    ثبت تیکت
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-medium text-xs sm:text-sm border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 w-full sm:w-auto"
                        >
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            بازگشت
                        </button>
                    </div>

                    {/* راهنمای تکمیل تیکت */}
                    <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <div className="flex items-start gap-2.5 sm:gap-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 text-base sm:text-lg">✓</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-blue-800 text-xs sm:text-sm mb-0.5 sm:mb-1">
                                    نکات مهم در ثبت تیکت
                                </h4>
                                <ul className="text-xs text-blue-700 space-y-0.5 sm:space-y-1">
                                    <li className="break-words">• موضوع تیکت را دقیق و مختصر انتخاب کنید</li>
                                    <li className="break-words">• توضیحات کامل و واضح بنویسید</li>
                                    <li className="break-words">• در صورت نیاز، تصاویر یا مستندات ضمیمه کنید</li>
                                    <li className="break-words">• پاسخ تیکت در بخش "همه تیکت‌ها" قابل مشاهده است</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </form>
            </motion.div>
        </div>
    );
}