// app/hall_owner/reservations/components/RejectModal.jsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiXCircle, PiX, PiSpinner } from "react-icons/pi";

const QUICK_REASONS = [
    "تالار در این تاریخ رزرو شده است",
    "تعداد مهمانان بیش از ظرفیت است",
    "درخواست کاربر با قوانین تالار همخوانی ندارد",
    "عدم پرداخت پیش‌پرداخت در زمان مقرر",
];

export default function RejectModal({ open, onClose, onReject, loading }) {
    const [reason, setReason] = useState("");
    const [note, setNote] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            setReason("");
            setNote("");
            setError("");
        }
    }, [open]);

    const handleReject = () => {
        if (reason.trim().length < 5) {
            setError("دلیل رد باید حداقل ۵ کاراکتر باشد");
            return;
        }
        onReject({ cancel_reason: reason.trim(), owner_note: note.trim() });
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={loading ? undefined : onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                        dir="rtl"
                    >
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="absolute top-4 left-4 p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40"
                            aria-label="بستن"
                        >
                            <PiX className="w-5 h-5 text-gray-500" />
                        </button>

                        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 bg-red-50 rounded-full">
                            <PiXCircle className="w-8 h-8 text-red-600" />
                        </div>

                        <h3 className="text-lg font-black text-[#2C2418] text-center mb-2">
                            رد رزرو
                        </h3>
                        <p className="text-sm text-gray-500 text-center mb-5">
                            لطفاً دلیل رد را برای اطلاع کاربر وارد کنید.
                        </p>

                        {/* پیشنهادهای سریع */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {QUICK_REASONS.map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setReason(r)}
                                    type="button"
                                    className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${reason === r
                                            ? "bg-red-50 border-red-300 text-red-700 font-bold"
                                            : "bg-white border-gray-200 text-gray-600 hover:border-red-300"
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            دلیل رد <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                if (error) setError("");
                            }}
                            rows={3}
                            maxLength={300}
                            placeholder="دلیل رد را بنویسید..."
                            className={`w-full px-3 py-2.5 bg-gray-50 border-2 rounded-xl text-sm focus:outline-none resize-none ${error ? "border-red-300" : "border-gray-100 focus:border-red-400"
                                }`}
                        />
                        {error && (
                            <p className="text-xs text-red-500 mt-1">{error}</p>
                        )}

                        <label className="block mt-4 mb-2 text-sm font-medium text-gray-700">
                            یادداشت اضافی (اختیاری)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={2}
                            maxLength={500}
                            placeholder="توضیحات بیشتر..."
                            className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-red-400 resize-none"
                        />

                        <div className="flex gap-2 mt-5">
                            <button
                                onClick={handleReject}
                                disabled={loading}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <PiSpinner className="w-4 h-4 animate-spin" />
                                        در حال ارسال...
                                    </>
                                ) : (
                                    <>
                                        <PiXCircle className="w-4 h-4" />
                                        رد کردن رزرو
                                    </>
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-60"
                            >
                                انصراف
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}