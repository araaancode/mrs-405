'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaPhone, FaWhatsapp, FaArrowLeft, FaRegClock, FaCheckCircle } from 'react-icons/fa'

export default function CTASection() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#D4B06A] to-[#C39243] p-12 text-center"
                >
                    {/* افکت پس‌زمینه */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2070')] bg-cover bg-center mix-blend-overlay opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />

                    {/* دایره‌های تزئینی */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full filter blur-3xl" />

                    <div className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="flex justify-center mb-6">
                                <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                                    <FaRegClock className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                                آماده برای یک مراسم بی‌نظیر؟
                            </h3>
                            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                                همین حالا با ما تماس بگیرید و از مشاوره رایگان و تخفیف‌های ویژه بهره‌مند شوید
                            </p>

                            {/* لیست مزایا */}
                            <div className="flex flex-wrap justify-center gap-6 mb-10">
                                <div className="flex items-center gap-2 text-white">
                                    <FaCheckCircle className="w-5 h-5" />
                                    <span>مشاوره رایگان</span>
                                </div>
                                <div className="flex items-center gap-2 text-white">
                                    <FaCheckCircle className="w-5 h-5" />
                                    <span>بهترین قیمت‌ها</span>
                                </div>
                                <div className="flex items-center gap-2 text-white">
                                    <FaCheckCircle className="w-5 h-5" />
                                    <span>پشتیبانی ۲۴ ساعته</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/contact">
                                    <button className="btn bg-white text-[#D9A14B] px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all group">
                                        <FaPhone className="w-5 h-5 inline-block ml-2 group-hover:animate-pulse" />
                                        تماس بگیرید
                                        <FaArrowLeft className="w-5 h-5 inline-block mr-2 group-hover:-translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                                <a href="https://wa.me/989123456789" target="_blank" rel="noopener noreferrer">
                                    <button className="btn bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all group">
                                        <FaWhatsapp className="w-5 h-5 inline-block ml-2" />
                                        واتساپ
                                    </button>
                                </a>
                            </div>

                            <p className="text-white/70 text-sm mt-8">
                                * مشاوره رایگان فقط تا پایان هفته جاری
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}