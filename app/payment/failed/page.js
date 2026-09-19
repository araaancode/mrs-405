// app/payment/failed/page.js
"use client";

import Link from 'next/link';
import { PiWarningCircle, PiArrowLeft, PiRefresh } from 'react-icons/pi';

export default function PaymentFailedPage() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full text-center">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PiWarningCircle className="w-12 h-12 text-red-600" />
                </div>

                <h1 className="text-2xl font-bold text-[#2C2418] mb-2">
                    ❌ پرداخت ناموفق بود
                </h1>

                <p className="text-gray-600 mb-6">
                    متاسفانه پرداخت شما با خطا مواجه شد. لطفاً مجدداً تلاش کنید.
                </p>

                <div className="space-y-3">
                    <Link href="/reservations">
                        <button className="w-full flex items-center justify-center gap-2 bg-[#D4B06A] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                            <PiRefresh className="w-5 h-5" />
                            تلاش مجدد
                        </button>
                    </Link>

                    <Link href="/reservations">
                        <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all">
                            <PiArrowLeft className="w-5 h-5" />
                            بازگشت به رزروها
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}