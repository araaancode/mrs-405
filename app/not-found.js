// app/not-found.jsx - صفحه 404 حرفه‌ای و کاملاً رسپانسیو
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaArrowLeft, FaHome, FaSearch, FaRegSadTear } from 'react-icons/fa'
import { GiLaurelCrown } from 'react-icons/gi'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-20">

            {/* محتوای اصلی 404 */}
            <div className="max-w-4xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    {/* لوگو/آیکون تاج */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex items-center justify-center gap-3 sm:gap-4 mt-6 mb-4 sm:mb-6"
                    >
                        <div className="w-8 sm:w-12 md:w-16 h-px bg-gradient-to-r from-transparent via-[#D4B06A] to-transparent" />
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#D4B06A]/20 rounded-full blur-xl" />
                            <GiLaurelCrown className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-[#D4B06A] relative drop-shadow-md" />
                        </div>
                        <div className="w-8 sm:w-12 md:w-16 h-px bg-gradient-to-r from-transparent via-[#D4B06A] to-transparent" />
                    </motion.div>

                    {/* عدد 404 با استایل خاص */}
                    <div className="relative inline-block mb-1 sm:mb-2">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-7xl sm:text-8xl md:text-9xl font-black text-[#2C2418] tracking-tighter leading-none"
                        >
                            ۴۰۴
                        </motion.div>
                        {/* افکت سایه زیر عدد */}
                        <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#D4B06A]/30 to-transparent blur-sm" />
                    </div>

                    {/* خط تزئینی */}
                    <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mx-auto my-4 sm:my-6" />

            

                    {/* عنوان و توضیحات */}
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2C2418] mb-3 sm:mb-4">
                        صفحه‌ای که به دنبال آن بودید پیدا نشد
                    </h1>

                    <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
                        ممکن است صفحه حذف شده باشد، آدرس تغییر کرده باشد یا به طور موقت در دسترس نباشد.
                    </p>

                    {/* دکمه‌های اقدام - کاملاً رسپانسیو */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <Link
                            href="/"
                            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white text-sm sm:text-base font-bold shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <FaHome className="w-4 h-4" />
                            صفحه اصلی
                        </Link>

                        <Link
                            href="/contact"
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 text-sm sm:text-base font-bold hover:border-[#D4B06A] hover:text-[#D4B06A] hover:bg-[#F5F2ED] transition-all duration-300"
                        >
                            تماس با ما
                            <FaArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                    </div>


                 
                </motion.div>
            </div>
        </div>
    )
}