// app/payment/success/page.jsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    PiCheckCircleFill,
    PiReceipt,
    PiArrowLeft,
    PiBuildings,
} from "react-icons/pi";

function SuccessContent() {
    const searchParams = useSearchParams();
    const refId = searchParams.get("ref");
    const reservationId = searchParams.get("reservation");

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FDFCF9] via-[#FAF8F2] to-[#F7F3E8] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(198,161,76,0.2)] overflow-hidden"
            >
                <div className="h-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600" />

                <div className="p-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                    >
                        <PiCheckCircleFill className="w-12 h-12 text-white" />
                    </motion.div>

                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        پرداخت موفق 
                    </h1>
                    <p className="text-slate-500 text-sm mb-6">
                        پرداخت شما با موفقیت انجام شد
                    </p>

                    <div className="bg-emerald-50/50 rounded-2xl p-4 mb-6 border border-emerald-100 text-right space-y-2">
                        {refId && (
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[12px] text-slate-500 inline-flex items-center gap-1">
                                    <PiReceipt className="w-3.5 h-3.5" />
                                    کد پیگیری:
                                </span>
                                <span className="font-mono text-[13px] font-bold text-emerald-700">
                                    {refId}
                                </span>
                            </div>
                        )}
                        {reservationId && (
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[12px] text-slate-500">
                                    شناسه رزرو:
                                </span>
                                <span className="font-mono text-[11px] text-slate-700">
                                    #{reservationId.slice(-8).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Link
                            href="/user/reservations"
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-b from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 shadow-md shadow-gold-500/25 hover:shadow-lg hover:shadow-gold-500/40 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <PiArrowLeft className="w-4 h-4" />
                            مشاهده رزروهای من
                        </Link>

                        <Link
                            href="/halls"
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-gold-50 hover:border-gold-300 hover:text-gold-700 transition-all duration-200"
                        >
                            <PiBuildings className="w-4 h-4" />
                            مشاهده تالارها
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-4 border-gold-500 border-t-transparent animate-spin" />
                </div>
            }
        >
            <SuccessContent />
        </Suspense>
    );
}