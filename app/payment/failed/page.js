// app/payment/failed/page.jsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    PiXCircleFill,
    PiArrowLeft,
    PiArrowClockwise,
    PiWarningCircle,
} from "react-icons/pi";

const REASON_MESSAGES = {
    no_authority: "اطلاعات پرداخت ناقص است",
    not_found: "رزرو مورد نظر یافت نشد",
    canceled: "پرداخت توسط شما لغو شد",
    verify_failed: "تأیید پرداخت با خطا مواجه شد",
    server_error: "خطای سرور رخ داد",
};

function FailedContent() {
    const searchParams = useSearchParams();
    const reason = searchParams.get("reason");
    const reservationId = searchParams.get("reservation");

    const message = REASON_MESSAGES[reason] || "پرداخت شما با خطا مواجه شد";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FDFCF9] via-[#FAF8F2] to-[#F7F3E8] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(244,63,94,0.2)] overflow-hidden"
            >
                <div className="h-2 bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600" />

                <div className="p-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/30"
                    >
                        <PiXCircleFill className="w-12 h-12 text-white" />
                    </motion.div>

                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        پرداخت ناموفق
                    </h1>
                    <p className="text-slate-500 text-sm mb-6">{message}</p>

                    <div className="bg-rose-50/50 rounded-2xl p-4 mb-6 border border-rose-100 text-right space-y-2">
                        <div className="flex items-start gap-2 text-[12px] text-slate-600">
                            <PiWarningCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                            <span>
                                در صورت کسر وجه از حساب شما، مبلغ طی ۷۲ ساعت آینده بازگردانده خواهد شد.
                            </span>
                        </div>
                        {reservationId && (
                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-rose-100">
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
                            <PiArrowClockwise className="w-4 h-4" />
                            تلاش مجدد
                        </Link>

                        <Link
                            href="/"
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                        >
                            <PiArrowLeft className="w-4 h-4" />
                            بازگشت به صفحه اصلی
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function PaymentFailedPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-4 border-rose-500 border-t-transparent animate-spin" />
                </div>
            }
        >
            <FailedContent />
        </Suspense>
    );
}