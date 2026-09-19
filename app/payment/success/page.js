// app/payment/success/page.js
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PiCheckCircle, PiArrowLeft } from 'react-icons/pi';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const refId = searchParams.get('ref');
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    window.location.href = '/reservations';
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PiCheckCircle className="w-12 h-12 text-green-600" />
                </div>

                <h1 className="text-2xl font-bold text-[#2C2418] mb-2">
                    ✅ پرداخت با موفقیت انجام شد
                </h1>

                <p className="text-gray-600 mb-4">
                    کد پیگیری: <span className="font-bold text-[#D4B06A]">{refId || '—'}</span>
                </p>

                <p className="text-gray-500 text-sm mb-6">
                    تا {countdown} ثانیه دیگر به صفحه رزروها منتقل می‌شوید
                </p>

                <Link href="/reservations">
                    <button className="flex items-center gap-2 mx-auto bg-[#D4B06A] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                        <PiArrowLeft className="w-5 h-5" />
                        مشاهده رزروها
                    </button>
                </Link>
            </div>
        </div>
    );
}