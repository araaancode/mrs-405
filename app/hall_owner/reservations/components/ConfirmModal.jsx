// app/hall_owner/reservations/components/ConfirmModal.jsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiCheckCircle, PiX, PiSpinner } from "react-icons/pi";

export default function ConfirmModal({ open, onClose, onConfirm, reservationId, loading }) {
    const [note, setNote] = useState("");

    const handleConfirm = () => {
        onConfirm({ owner_note: note.trim() });
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

                        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 bg-emerald-50 rounded-full">
                            <PiCheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>

                        <h3 className="text-lg font-black text-[#2C2418] text-center mb-2">
                            تایید رزرو
                        </h3>
                        <p className="text-sm text-gray-500 text-center mb-5">
                            آیا از تایید این رزرو مطمئن هستید؟ پس از تایید، رزرو در وضعیت
                            «تایید شده» قرار می‌گیرد و به کاربر اطلاع داده می‌شود.
                        </p>

                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            یادداشت مالک (اختیاری)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            maxLength={500}
                            placeholder="مثلاً: لطفاً ۱ ساعت قبل از مراسم حضور داشته باشید..."
                            className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#D4B06A] resize-none"
                        />

                        <div className="flex gap-2 mt-5">
                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <PiSpinner className="w-4 h-4 animate-spin" />
                                        در حال تایید...
                                    </>
                                ) : (
                                    <>
                                        <PiCheckCircle className="w-4 h-4" />
                                        بله، تایید کن
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