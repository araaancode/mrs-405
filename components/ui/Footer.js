// components/ui/Footer.jsx (نسخه حرفه‌ای)
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    FaCrown,
    FaInstagram,
    FaTelegram,
    FaWhatsapp,
    FaLinkedin,
    FaTwitter,
    FaYoutube,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaClock,
    FaArrowUp,
    FaCreditCard,
    FaShieldAlt,
    FaTruck,
    FaHeadset,
    FaRegHeart
} from 'react-icons/fa'
import { GiLaurelCrown } from 'react-icons/gi'
import { useState, useEffect } from 'react'

export default function Footer() {
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const quickLinks = [
        { name: 'تالارها', href: '/halls' },

        { name: 'تخفیف‌های ویژه', href: '/offers' }
    ]

    const quickLinks2 = [
        { name: 'ثبت نام تالاردار', href: '/auth/hall_owner/register' },

    ]

    const customerLinks = [
        { name: 'درباره ما', href: '/about' },
        { name: 'تماس با ما', href: '/contact' },
        // { name: 'سوالات متداول', href: '/faq' },
        // { name: 'قوانین و مقررات', href: '/terms' },
        // { name: 'حریم خصوصی', href: '/privacy' }
    ]

    const blogLinks = [
        { name: 'راهنمای انتخاب تالار', href: '/blog/hall-guide' },
        { name: 'ترندهای عروسی ۱۴۰۴', href: '/blog/wedding-trends' },
        { name: 'برنامه‌ریزی مراسم', href: '/blog/planning' },
        { name: 'دکوراسیون و تزئینات', href: '/blog/decoration' }
    ]

    const socialLinks = [
        { icon: FaInstagram, href: 'https://instagram.com', bgColor: 'bg-gradient-to-tr from-[#D4B06A] to-[#B8922E]' },
        { icon: FaTelegram, href: 'https://telegram.org', bgColor: 'bg-[#D4B06A]' },
        { icon: FaWhatsapp, href: 'https://whatsapp.com', bgColor: 'bg-[#D4B06A]' },
        { icon: FaLinkedin, href: 'https://linkedin.com', bgColor: 'bg-[#D4B06A]' },
        { icon: FaTwitter, href: 'https://twitter.com', bgColor: 'bg-[#D4B06A]' },
        { icon: FaYoutube, href: 'https://youtube.com', bgColor: 'bg-[#D4B06A]' }
    ]

    return (
        <footer className="relative bg-gradient-to-br from-[#1a1412] to-[#0d0a08] text-white mt-24">
            {/* خط تزئینی بالای فوتر */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4B06A] to-transparent" />

            {/* دکمه اسکرول به بالا */}
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 left-8 z-50 w-12 h-12 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
                >
                    <FaArrowUp className="w-5 h-5 text-white group-hover:-translate-y-1 transition-transform" />
                </motion.button>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                {/* بخش اصلی فوتر */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                    {/* بخش اول: لوگو و توضیحات */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center md:text-right"
                    >
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-xl blur-md opacity-50" />
                                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-r from-[#D4B06A] to-[#B8922E] flex items-center justify-center shadow-lg">
                                    <GiLaurelCrown className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white">
                                    مراسمینو
                                </h3>
                                <p className="text-xs text-white/50">برگزارکننده حرفه‌ای مراسم</p>
                            </div>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mb-4">
                            بزرگترین پلتفرم برگزاری مراسم در ایران با بیش از ۱۰,۰۰۰ مراسم موفق و ۱۵۰+ تالار لوکس.
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-white/40 text-xs">
                            <FaRegHeart className="text-[#D4B06A]" />
                            <span>با افتخار در خدمت شما</span>
                        </div>
                    </motion.div>

                    {/* بخش دوم: دسترسی سریع */}
                    {/* <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-center md:text-right"
                    >
                        <h4 className="text-base font-bold mb-5 text-[#D4B06A] relative inline-block">
                            دسترسی سریع
                            <div className="absolute -bottom-2 right-0 w-8 h-0.5 bg-[#D4B06A] rounded-full" />
                        </h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 text-sm hover:text-[#D4B06A] transition-all duration-300 inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#D4B06A] transition-all duration-300 rounded-full" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div> */}

                    {/* بخش سوم: امکانات ویژه (quickLinks2) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-center md:text-right"
                    >
                        <h4 className="text-base font-bold mb-5 text-[#D4B06A] relative inline-block">
                            امکانات ویژه
                            <div className="absolute -bottom-2 right-0 w-8 h-0.5 bg-[#D4B06A] rounded-full" />
                        </h4>
                        <ul className="space-y-2">
                            {quickLinks2.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 text-sm hover:text-[#D4B06A] transition-all duration-300 inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#D4B06A] transition-all duration-300 rounded-full" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* بخش چهارم: خدمات مشتریان */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-center md:text-right"
                    >
                        <h4 className="text-base font-bold mb-5 text-[#D4B06A] relative inline-block">
                            خدمات مشتریان
                            <div className="absolute -bottom-2 right-0 w-8 h-0.5 bg-[#D4B06A] rounded-full" />
                        </h4>
                        <ul className="space-y-2">
                            {customerLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 text-sm hover:text-[#D4B06A] transition-all duration-300 inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#D4B06A] transition-all duration-300 rounded-full" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* بخش پنجم: اطلاعات تماس */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="text-center md:text-right"
                    >
                        <h4 className="text-base font-bold mb-5 text-[#D4B06A] relative inline-block">
                            تماس با ما
                            <div className="absolute -bottom-2 right-0 w-8 h-0.5 bg-[#D4B06A] rounded-full" />
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-center md:justify-start gap-3 text-white/60 text-sm group">
                                <FaMapMarkerAlt className="w-4 h-4 text-[#D4B06A] group-hover:scale-110 transition-transform" />
                                <span>تهران، خیابان ولیعصر، پلاک ۱۲۳</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-3 text-white/60 text-sm group">
                                <FaPhone className="w-4 h-4 text-[#D4B06A] group-hover:scale-110 transition-transform" />
                                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-3 text-white/60 text-sm group">
                                <FaEnvelope className="w-4 h-4 text-[#D4B06A] group-hover:scale-110 transition-transform" />
                                <span>info@marasmino.com</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-3 text-white/60 text-sm group">
                                <FaClock className="w-4 h-4 text-[#D4B06A] group-hover:scale-110 transition-transform" />
                                <span>شنبه تا پنجشنبه: ۹ - ۲۰</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* بخش شبکه‌های اجتماعی */}
                <div className="border-t border-white/10 pt-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="text-center md:text-right"
                        >
                            <h4 className="text-base font-bold mb-4 text-[#D4B06A]">ما را دنبال کنید</h4>
                            <div className="flex justify-center md:justify-start gap-3 flex-wrap">
                                {socialLinks.map((social, index) => {
                                    const Icon = social.icon
                                    return (
                                        <a
                                            key={index}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`w-10 h-10 ${social.bgColor} rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#D4B06A]/20`}
                                        >
                                            <Icon className="w-5 h-5 text-white" />
                                        </a>
                                    )
                                })}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* بخش پایین فوتر */}
                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-right">
                            <p className="text-white/40 text-sm">
                                © ۱۴۰۴ تمامی حقوق برای <span className="text-[#D4B06A] font-medium">مراسمینو</span> محفوظ است
                            </p>
                            <p className="text-white/30 text-xs mt-1">
                                طراحی و توسعه توسط تیم مراسمینو
                            </p>
                        </div>

                        {/* نماد اعتماد */}
                        <div className="flex gap-2">
                            <div className="px-3 py-1.5 bg-white/5 rounded-lg">
                                <span className="text-xs text-white/40">نماد اعتماد</span>
                            </div>
                            <div className="px-3 py-1.5 bg-white/5 rounded-lg">
                                <span className="text-xs text-white/40">اینماد</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}