// app/(public)/contact/page.js - کاملاً رسپانسیو با رفع مشکل ناپدید شدن عنوان
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    PiPhone,
    PiEnvelope,
    PiMapPin,
    PiHeadphones,
    PiClock,
    PiInstagramLogo,
    PiTelegramLogo,
    PiWhatsappLogo,
    PiTwitterLogo,
    PiLinkedinLogo,
    PiArrowLeft,
    PiCheckCircle,
    PiUser,
    PiBuilding,
    PiNote,
    PiPaperPlaneRight,
    PiChatCircle,
    PiQuestion,
    PiInfo,
    PiCaretLeft
} from 'react-icons/pi'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        type: 'general'
    })

    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsLoading(false)
        setIsSubmitted(true)
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
            type: 'general'
        })

        setTimeout(() => setIsSubmitted(false), 5000)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const contactInfo = [
        {
            id: 1,
            title: 'تلفن پشتیبانی',
            value: '۰۲۱-۱۲۳۴۵۶۷۸',
            description: 'شنبه تا پنجشنبه، ۹ صبح تا ۸ شب',
            icon: PiPhone,
            href: 'tel:02112345678',
            color: 'from-amber-500 to-orange-500'
        },
        {
            id: 2,
            title: 'ایمیل',
            value: 'info@marasemino.ir',
            description: 'پاسخگویی ظرف ۲۴ ساعت',
            icon: PiEnvelope,
            href: 'mailto:info@marasemino.ir',
            color: 'from-emerald-500 to-teal-500'
        },
        {
            id: 3,
            title: 'آدرس',
            value: 'تهران، خیابان ولیعصر، برج سپهر',
            description: 'طبقه ۱۲، واحد ۱۲۴',
            icon: PiMapPin,
            href: 'https://maps.google.com',
            color: 'from-blue-500 to-indigo-500'
        },
        {
            id: 4,
            title: 'پشتیبانی آنلاین',
            value: 'چت آنلاین',
            description: 'پاسخگویی فوری',
            icon: PiChatCircle,
            href: '#',
            color: 'from-purple-500 to-pink-500'
        }
    ]

    const faqs = [
        {
            id: 1,
            question: 'چگونه می‌توانم تالار رزرو کنم؟',
            answer: 'با جستجو در صفحه تالارها، می‌توانید بر اساس تاریخ، ظرفیت و قیمت، تالار مورد نظر خود را پیدا کرده و به صورت آنلاین رزرو کنید.',
        },
        {
            id: 2,
            question: 'آیا امکان لغو رزرو وجود دارد؟',
            answer: 'بله، تا ۴۸ ساعت قبل از مراسم می‌توانید رزرو خود را لغو کنید و وجه پرداختی به کیف پول شما برگردانده می‌شود.',
        },
        {
            id: 3,
            question: 'چگونه می‌توانم خدمات دهنده شوم؟',
            answer: 'از طریق بخش "صاحبان کسب و کار" در فوتر، می‌توانید ثبت‌نام کرده و خدمات خود را ارائه دهید.',
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir="rtl">
            {/* Hero Section - کاملاً رسپانسیو با فاصله مناسب */}
            <div className="relative overflow-hidden pt-8 sm:pt-12 md:pt-16 lg:pt-20">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-48 sm:w-64 h-48 sm:h-64 bg-[#D4B06A] rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-[#D4B06A] rounded-full filter blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
                    <div className="text-center max-w-3xl mx-auto">
                     

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#2C2418] mb-3 mt-8 sm:mb-4">
                            تماس با <span className="text-[#D4B06A]">ما</span>
                        </h1>
                        <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mx-auto mb-4 sm:mb-6" />
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed px-2">
                            ما همیشه آماده شنیدن حرف‌های شما هستیم. با ما در ارتباط باشید
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Info Cards - با فاصله مناسب از هدر */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-8 md:-mt-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {contactInfo.map((info) => {
                        const Icon = info.icon
                        return (
                            <a
                                key={info.id}
                                href={info.href}
                                target={info.href.startsWith('http') ? '_blank' : undefined}
                                rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-5 md:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group shadow-sm"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br from-amber-100 to-amber-50">
                                    <Icon className="text-2xl sm:text-3xl text-[#D4B06A]" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-[#2C2418] mb-1 sm:mb-2">
                                    {info.title}
                                </h3>
                                <p className="text-[#D4B06A] font-medium text-sm sm:text-base mb-1 sm:mb-2">{info.value}</p>
                                <p className="text-xs sm:text-sm text-gray-500">{info.description}</p>
                            </a>
                        )
                    })}
                </div>
            </div>

            {/* Contact Form & Map - کاملاً رسپانسیو */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-6 md:p-8 shadow-sm">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#2C2418] mb-1 sm:mb-2">
                            ارسال پیام
                        </h2>
                        <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mb-3 sm:mb-4" />
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                            سوال، نظر یا پیشنهاد خود را با ما در میان بگذارید
                        </p>

                        {isSubmitted ? (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-6 text-center">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <PiCheckCircle className="text-2xl sm:text-3xl text-emerald-600" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-emerald-800 mb-1 sm:mb-2">
                                    پیام شما با موفقیت ارسال شد
                                </h3>
                                <p className="text-emerald-600 text-xs sm:text-sm">
                                    در اسرع وقت با شما تماس خواهیم گرفت
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                        نام و نام خانوادگی
                                    </label>
                                    <div className="relative">
                                        <PiUser className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-base sm:text-lg text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full h-10 sm:h-12 pr-10 sm:pr-12 pl-3 sm:pl-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-amber-200 focus:ring-1 focus:ring-amber-200 outline-none transition-all duration-200 text-sm sm:text-base"
                                            placeholder="علی محمدی"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                        ایمیل
                                    </label>
                                    <div className="relative">
                                        <PiEnvelope className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-base sm:text-lg text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full h-10 sm:h-12 pr-10 sm:pr-12 pl-3 sm:pl-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-amber-200 focus:ring-1 focus:ring-amber-200 outline-none transition-all duration-200 text-sm sm:text-base"
                                            placeholder="info@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                        شماره موبایل
                                    </label>
                                    <div className="relative">
                                        <PiPhone className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-base sm:text-lg text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full h-10 sm:h-12 pr-10 sm:pr-12 pl-3 sm:pl-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-amber-200 focus:ring-1 focus:ring-amber-200 outline-none transition-all duration-200 text-sm sm:text-base"
                                            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                                        />
                                    </div>
                                </div>

                                {/* Subject Type */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                        موضوع
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-amber-200 focus:ring-1 focus:ring-amber-200 outline-none transition-all duration-200 text-sm sm:text-base"
                                    >
                                        <option value="general">سوال عمومی</option>
                                        <option value="support">پشتیبانی</option>
                                        <option value="business">همکاری تجاری</option>
                                        <option value="suggestion">پیشنهاد</option>
                                        <option value="complaint">شکایت</option>
                                    </select>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                        عنوان پیام
                                    </label>
                                    <div className="relative">
                                        <PiNote className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-base sm:text-lg text-gray-400" />
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full h-10 sm:h-12 pr-10 sm:pr-12 pl-3 sm:pl-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-amber-200 focus:ring-1 focus:ring-amber-200 outline-none transition-all duration-200 text-sm sm:text-base"
                                            placeholder="عنوان پیام خود را وارد کنید"
                                        />
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                        متن پیام
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="4 sm:rows-5"
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-amber-200 focus:ring-1 focus:ring-amber-200 outline-none transition-all duration-200 resize-none text-sm sm:text-base"
                                        placeholder="پیام خود را بنویسید..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-10 sm:h-12 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg text-sm sm:text-base"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>در حال ارسال...</span>
                                        </>
                                    ) : (
                                        <>
                                            <PiPaperPlaneRight className="text-base sm:text-lg" />
                                            <span>ارسال پیام</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Map & Additional Info - کاملاً رسپانسیو */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Map */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-6 shadow-sm">
                            <h3 className="text-base sm:text-lg font-semibold text-[#2C2418] mb-3 sm:mb-4 flex items-center gap-2">
                                <PiMapPin className="text-[#D4B06A]" />
                                موقعیت ما
                            </h3>
                            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.9999999999995!2d51.38999999999999!3d35.689999999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQxJzI0LjAiTiA1McKwMjMnMjQuMCJF!5e0!3m2!1sen!2s!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                            <div className="mt-3 sm:mt-4 flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                                <PiMapPin className="text-[#D4B06A] mt-0.5" />
                                <span>{contactInfo.find(c => c.id === 3).value}، {contactInfo.find(c => c.id === 3).description}</span>
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-6 shadow-sm">
                            <h3 className="text-base sm:text-lg font-semibold text-[#2C2418] mb-3 sm:mb-4 flex items-center gap-2">
                                <PiClock className="text-[#D4B06A]" />
                                ساعات کاری
                            </h3>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs sm:text-sm text-gray-600">شنبه تا چهارشنبه</span>
                                    <span className="text-xs sm:text-sm font-medium text-[#2C2418]">۹:۰۰ - ۲۰:۰۰</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs sm:text-sm text-gray-600">پنجشنبه</span>
                                    <span className="text-xs sm:text-sm font-medium text-[#2C2418]">۹:۰۰ - ۱۸:۰۰</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs sm:text-sm text-gray-600">جمعه</span>
                                    <span className="text-xs sm:text-sm font-medium text-[#D4B06A]">تعطیل</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-6 shadow-sm">
                            <h3 className="text-base sm:text-lg font-semibold text-[#2C2418] mb-3 sm:mb-4 flex items-center gap-2">
                                <PiChatCircle className="text-[#D4B06A]" />
                                ما را دنبال کنید
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <a
                                    href="https://instagram.com/marasemino"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center text-pink-600 hover:from-pink-200 hover:to-pink-100 transition-all duration-200"
                                >
                                    <PiInstagramLogo className="text-xl sm:text-2xl" />
                                </a>
                                <a
                                    href="https://t.me/marasemino"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 hover:from-blue-200 hover:to-blue-100 transition-all duration-200"
                                >
                                    <PiTelegramLogo className="text-xl sm:text-2xl" />
                                </a>
                                <a
                                    href="https://wa.me/989123456789"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center text-green-600 hover:from-green-200 hover:to-green-100 transition-all duration-200"
                                >
                                    <PiWhatsappLogo className="text-xl sm:text-2xl" />
                                </a>
                                <a
                                    href="https://twitter.com/marasemino"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-sky-100 to-sky-50 flex items-center justify-center text-sky-500 hover:from-sky-200 hover:to-sky-100 transition-all duration-200"
                                >
                                    <PiTwitterLogo className="text-xl sm:text-2xl" />
                                </a>
                                <a
                                    href="https://linkedin.com/company/marasemino"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-700 hover:from-blue-200 hover:to-blue-100 transition-all duration-200"
                                >
                                    <PiLinkedinLogo className="text-xl sm:text-2xl" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section - کاملاً رسپانسیو */}
            <div className="bg-[#F5F2ED]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
                    <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2C2418] mb-2 sm:mb-4">
                            سوالات <span className="text-[#D4B06A]">متداول</span>
                        </h2>
                        <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mx-auto mb-3 sm:mb-4" />
                        <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2">
                            پاسخ سوالات پرتکرار شما در مورد مراسمینو
                        </p>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                                        <PiQuestion className="text-amber-600 text-base sm:text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm sm:text-base font-semibold text-[#2C2418] mb-1 sm:mb-2">
                                            {faq.question}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            
        </div>
    )
}