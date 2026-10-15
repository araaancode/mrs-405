// app/(public)/contact/page.js
'use client'

import { useState, useRef, useEffect, useCallback, memo } from 'react'
import {
    PiPhone,
    PiEnvelope,
    PiMapPin,
    PiChatCircle,
    PiClock,
    PiInstagramLogo,
    PiTelegramLogo,
    PiWhatsappLogo,
    PiTwitterLogo,
    PiLinkedinLogo,
    PiCheckCircle,
    PiUser,
    PiNote,
    PiPaperPlaneRight,
    PiQuestion,
    PiSpinnerGap,
} from 'react-icons/pi'

/* ============================================================
   Theme Constants
   ============================================================ */
const GOLD_GRADIENT = 'linear-gradient(135deg, #E0C67B 0%, #C6A14C 50%, #A8853A 100%)'
const GOLD_GRADIENT_BTN = 'linear-gradient(180deg, #D3B263 0%, #C6A14C 50%, #A8853A 100%)'
const GOLD_GRADIENT_TEXT = 'linear-gradient(90deg, #C6A14C 0%, #85672C 100%)'

/* ============================================================
   Data
   ============================================================ */
const CONTACT_INFO = [
    {
        id: 1,
        title: 'تلفن پشتیبانی',
        value: '۰۲۱-۱۲۳۴۵۶۷۸',
        description: 'شنبه تا پنجشنبه، ۹ صبح تا ۸ شب',
        icon: PiPhone,
        href: 'tel:+982112345678',
        external: false,
    },
    {
        id: 2,
        title: 'ایمیل',
        value: 'info@marasemino.ir',
        description: 'پاسخگویی ظرف ۲۴ ساعت',
        icon: PiEnvelope,
        href: 'mailto:info@marasemino.ir',
        external: false,
    },
    {
        id: 3,
        title: 'آدرس',
        value: 'تهران، خیابان ولیعصر، برج سپهر',
        description: 'طبقه ۱۲، واحد ۱۲۴',
        icon: PiMapPin,
        href: 'https://maps.google.com',
        external: true,
    },
    {
        id: 4,
        title: 'پشتیبانی آنلاین',
        value: 'چت آنلاین',
        description: 'پاسخگویی فوری',
        icon: PiChatCircle,
        href: null, // ← دکمه، نه لینک
        external: false,
    },
]

const FAQS = [
    {
        id: 1,
        question: 'چگونه می‌توانم تالار رزرو کنم؟',
        answer:
            'با جستجو در صفحه تالارها، می‌توانید بر اساس تاریخ، ظرفیت و قیمت، تالار مورد نظر خود را پیدا کرده و به صورت آنلاین رزرو کنید.',
    },
    {
        id: 2,
        question: 'آیا امکان لغو رزرو وجود دارد؟',
        answer:
            'بله، تا ۴۸ ساعت قبل از مراسم می‌توانید رزرو خود را لغو کنید و وجه پرداختی به کیف پول شما برگردانده می‌شود.',
    },
    {
        id: 3,
        question: 'چگونه می‌توانم خدمات‌دهنده شوم؟',
        answer:
            'از طریق بخش «صاحبان کسب و کار» در فوتر، می‌توانید ثبت‌نام کرده و خدمات خود را ارائه دهید.',
    },
]

const SOCIALS = [
    {
        href: 'https://instagram.com/marasemino',
        label: 'اینستاگرام',
        icon: PiInstagramLogo,
        bg: 'bg-gradient-to-br from-pink-100 to-pink-50',
        text: 'text-pink-600',
        hover: 'hover:from-pink-200 hover:to-pink-100',
    },
    {
        href: 'https://t.me/marasemino',
        label: 'تلگرام',
        icon: PiTelegramLogo,
        bg: 'bg-gradient-to-br from-sky-100 to-sky-50',
        text: 'text-sky-600',
        hover: 'hover:from-sky-200 hover:to-sky-100',
    },
    {
        href: 'https://wa.me/989123456789',
        label: 'واتساپ',
        icon: PiWhatsappLogo,
        bg: 'bg-gradient-to-br from-emerald-100 to-emerald-50',
        text: 'text-emerald-600',
        hover: 'hover:from-emerald-200 hover:to-emerald-100',
    },
    {
        href: 'https://twitter.com/marasemino',
        label: 'توییتر',
        icon: PiTwitterLogo,
        bg: 'bg-gradient-to-br from-slate-100 to-slate-50',
        text: 'text-slate-700',
        hover: 'hover:from-slate-200 hover:to-slate-100',
    },
    {
        href: 'https://linkedin.com/company/marasemino',
        label: 'لینکدین',
        icon: PiLinkedinLogo,
        bg: 'bg-gradient-to-br from-blue-100 to-blue-50',
        text: 'text-blue-700',
        hover: 'hover:from-blue-200 hover:to-blue-100',
    },
]

const WORKING_HOURS = [
    { day: 'شنبه تا چهارشنبه', hours: '۹:۰۰ - ۲۰:۰۰', closed: false },
    { day: 'پنجشنبه', hours: '۹:۰۰ - ۱۸:۰۰', closed: false },
    { day: 'جمعه', hours: 'تعطیل', closed: true },
]

const SUBJECT_OPTIONS = [
    { value: 'general', label: 'سوال عمومی' },
    { value: 'support', label: 'پشتیبانی' },
    { value: 'business', label: 'همکاری تجاری' },
    { value: 'suggestion', label: 'پیشنهاد' },
    { value: 'complaint', label: 'شکایت' },
]

const INITIAL_FORM = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general',
}

/* ============================================================
   SectionTitle
   ============================================================ */
const SectionTitle = memo(function SectionTitle({ title, highlight, description }) {
    return (
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 sm:mb-4 tracking-tight">
                {title}{' '}
                {highlight && (
                    <span
                        className="bg-clip-text text-transparent"
                        style={{ backgroundImage: GOLD_GRADIENT_TEXT }}
                    >
                        {highlight}
                    </span>
                )}
            </h2>
            <div
                className="w-16 sm:w-20 h-1 rounded-full mx-auto mb-3 sm:mb-4"
                style={{ backgroundImage: GOLD_GRADIENT }}
                aria-hidden="true"
            />
            {description && (
                <p className="text-sm sm:text-base md:text-lg text-slate-600 px-2">
                    {description}
                </p>
            )}
        </div>
    )
})

/* ============================================================
   ContactInfoCard
   ============================================================ */
const ContactInfoCard = memo(function ContactInfoCard({ info }) {
    const Icon = info.icon
    const isLink = Boolean(info.href)

    const inner = (
        <>
            <div
                className="
                    w-12 h-12 sm:w-14 sm:h-14
                    rounded-xl
                    flex items-center justify-center
                    mb-3 sm:mb-4
                    transition-transform duration-300
                    group-hover:scale-110
                "
                style={{ backgroundImage: GOLD_GRADIENT }}
            >
                <Icon className="text-xl sm:text-2xl text-white" aria-hidden="true" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1 sm:mb-2">
                {info.title}
            </h3>
            <p className="font-bold text-sm sm:text-base mb-1 sm:mb-2 text-[#A8853A]">
                {info.value}
            </p>
            <p className="text-xs sm:text-sm text-slate-500">{info.description}</p>
        </>
    )

    const className = `
        group bg-white rounded-2xl
        shadow-[0_2px_16px_-4px_rgba(15,23,42,0.08)]
        hover:shadow-[0_20px_40px_-12px_rgba(198,161,76,0.3)]
        p-4 sm:p-5 md:p-6
        transition-[transform,box-shadow] duration-300
        hover:-translate-y-1
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40
        motion-reduce:transition-none motion-reduce:hover:translate-y-0
        block
    `

    if (isLink) {
        return (
            <a
                href={info.href}
                target={info.external ? '_blank' : undefined}
                rel={info.external ? 'noopener noreferrer' : undefined}
                className={className}
            >
                {inner}
            </a>
        )
    }

    return (
        <button type="button" className={`${className} text-right w-full`}>
            {inner}
        </button>
    )
})

/* ============================================================
   FormField — با icon و error state
   ============================================================ */
const FormField = memo(function FormField({
    id,
    name,
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    icon: Icon,
    required = false,
    error,
    autoComplete,
    inputMode,
    as = 'input',
}) {
    const baseClass = `
        w-full
        rounded-xl
        border bg-slate-50/50
        focus:bg-white
        outline-none
        text-sm sm:text-base
        transition-all duration-200
        ${
            error
                ? 'border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/40'
                : 'border-slate-200 focus:border-[#C6A14C] focus:ring-4 focus:ring-[#C6A14C]/15'
        }
    `

    return (
        <div>
            <label
                htmlFor={id}
                className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2"
            >
                {label}
                {required && <span className="text-rose-500 mr-1">*</span>}
            </label>

            <div className="relative">
                {Icon && (
                    <Icon
                        className={`
                            absolute right-3 sm:right-4 top-1/2 -translate-y-1/2
                            text-base sm:text-lg pointer-events-none
                            ${error ? 'text-rose-400' : 'text-slate-400'}
                        `}
                        aria-hidden="true"
                    />
                )}

                {as === 'textarea' ? (
                    <textarea
                        id={id}
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        rows={5}
                        required={required}
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? `${id}-error` : undefined}
                        className={`${baseClass} h-32 px-3 sm:px-4 py-2.5 sm:py-3 resize-none`}
                    />
                ) : (
                    <input
                        id={id}
                        name={name}
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={required}
                        autoComplete={autoComplete}
                        inputMode={inputMode}
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? `${id}-error` : undefined}
                        className={`${baseClass} h-10 sm:h-12 ${
                            Icon ? 'pr-10 sm:pr-12' : ''
                        } px-3 sm:px-4`}
                    />
                )}
            </div>

            {error && (
                <p
                    id={`${id}-error`}
                    className="text-xs text-rose-500 mt-1.5"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    )
})

/* ============================================================
   ContactForm
   ============================================================ */
function ContactForm() {
    const [formData, setFormData] = useState(INITIAL_FORM)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const timeoutRef = useRef(null)

    // cleanup timeout
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    const handleChange = useCallback((e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // پاک کردن error وقتی کاربر تایپ می‌کند
        setErrors((prev) => {
            if (!prev[name]) return prev
            const next = { ...prev }
            delete next[name]
            return next
        })
    }, [])

    const validate = useCallback(() => {
        const errs = {}
        if (!formData.name.trim() || formData.name.trim().length < 3) {
            errs.name = 'نام باید حداقل ۳ کاراکتر باشد'
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errs.email = 'ایمیل معتبر وارد کنید'
        }
        if (!formData.phone.trim() || !/^0?9\d{9}$/.test(formData.phone.replace(/[^\d]/g, ''))) {
            errs.phone = 'شماره موبایل معتبر وارد کنید'
        }
        if (!formData.subject.trim()) {
            errs.subject = 'عنوان پیام الزامی است'
        }
        if (!formData.message.trim() || formData.message.trim().length < 10) {
            errs.message = 'متن پیام باید حداقل ۱۰ کاراکتر باشد'
        }
        return errs
    }, [formData])

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault()

            const validationErrors = validate()
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors)
                return
            }

            setErrors({})
            setIsLoading(true)

            try {
                // 🔔 اینجا API واقعی را صدا بزن
                // await fetch('/api/contact', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(formData),
                // })

                // شبیه‌سازی
                await new Promise((resolve) => setTimeout(resolve, 1500))

                setIsSubmitted(true)
                setFormData(INITIAL_FORM)

                timeoutRef.current = setTimeout(() => setIsSubmitted(false), 5000)
            } catch (err) {
                console.error('[ContactForm]', err)
                setErrors({ form: 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.' })
            } finally {
                setIsLoading(false)
            }
        },
        [formData, validate]
    )

    if (isSubmitted) {
        return (
            <div
                className="
                    bg-emerald-50 border border-emerald-200
                    rounded-2xl sm:rounded-3xl
                    p-6 sm:p-8
                    text-center
                "
                role="status"
                aria-live="polite"
            >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <PiCheckCircle
                        className="text-2xl sm:text-3xl text-emerald-600"
                        aria-hidden="true"
                    />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-emerald-800 mb-1 sm:mb-2">
                    پیام شما با موفقیت ارسال شد
                </h3>
                <p className="text-emerald-600 text-xs sm:text-sm">
                    در اسرع وقت با شما تماس خواهیم گرفت
                </p>
            </div>
        )
    }

    return (
        <div
            className="
                bg-white rounded-2xl sm:rounded-3xl
                shadow-[0_2px_16px_-4px_rgba(15,23,42,0.08)]
                p-5 sm:p-6 md:p-8
            "
        >
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">
                ارسال پیام
            </h2>
            <div
                className="w-12 sm:w-16 h-1 rounded-full mb-3 sm:mb-4"
                style={{ backgroundImage: GOLD_GRADIENT }}
                aria-hidden="true"
            />
            <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                سوال، نظر یا پیشنهاد خود را با ما در میان بگذارید
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
                <FormField
                    id="name"
                    name="name"
                    label="نام و نام خانوادگی"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="علی محمدی"
                    icon={PiUser}
                    autoComplete="name"
                    required
                    error={errors.name}
                />

                <FormField
                    id="email"
                    name="email"
                    type="email"
                    label="ایمیل"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="info@example.com"
                    icon={PiEnvelope}
                    autoComplete="email"
                    inputMode="email"
                    required
                    error={errors.email}
                />

                <FormField
                    id="phone"
                    name="phone"
                    type="tel"
                    label="شماره موبایل"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    icon={PiPhone}
                    autoComplete="tel"
                    inputMode="tel"
                    required
                    error={errors.phone}
                />

                {/* Subject Type */}
                <div>
                    <label
                        htmlFor="type"
                        className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2"
                    >
                        موضوع
                    </label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="
                            w-full h-10 sm:h-12
                            px-3 sm:px-4 rounded-xl
                            border border-slate-200 bg-slate-50/50
                            focus:bg-white focus:border-[#C6A14C] focus:ring-4 focus:ring-[#C6A14C]/15
                            outline-none transition-all duration-200
                            text-sm sm:text-base cursor-pointer
                        "
                    >
                        {SUBJECT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <FormField
                    id="subject"
                    name="subject"
                    label="عنوان پیام"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="عنوان پیام خود را وارد کنید"
                    icon={PiNote}
                    required
                    error={errors.subject}
                />

                <FormField
                    id="message"
                    name="message"
                    as="textarea"
                    label="متن پیام"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="پیام خود را بنویسید..."
                    required
                    error={errors.message}
                />

                {errors.form && (
                    <div
                        className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm"
                        role="alert"
                    >
                        {errors.form}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    aria-busy={isLoading}
                    className="
                        w-full h-11 sm:h-12
                        rounded-xl
                        text-white font-bold
                        text-sm sm:text-base
                        flex items-center justify-center gap-2
                        transition-all duration-200
                        hover:-translate-y-0.5
                        hover:shadow-[0_10px_30px_-6px_rgba(198,161,76,0.5)]
                        active:scale-[0.98]
                        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40
                        disabled:opacity-60 disabled:cursor-not-allowed
                        disabled:hover:translate-y-0 disabled:hover:shadow-none
                        motion-reduce:transition-none
                    "
                    style={{
                        backgroundImage: GOLD_GRADIENT_BTN,
                        boxShadow: '0 8px 20px -6px rgba(198,161,76,0.4)',
                    }}
                >
                    {isLoading ? (
                        <>
                            <PiSpinnerGap
                                className="w-4 h-4 sm:w-5 sm:h-5 animate-spin"
                                aria-hidden="true"
                            />
                            <span>در حال ارسال...</span>
                        </>
                    ) : (
                        <>
                            <PiPaperPlaneRight
                                className="text-base sm:text-lg"
                                aria-hidden="true"
                            />
                            <span>ارسال پیام</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}

/* ============================================================
   MapCard
   ============================================================ */
const MapCard = memo(function MapCard() {
    const addressInfo = CONTACT_INFO.find((c) => c.id === 3)

    return (
        <div
            className="
                bg-white rounded-2xl sm:rounded-3xl
                shadow-[0_2px_16px_-4px_rgba(15,23,42,0.08)]
                p-4 sm:p-6
            "
        >
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                <PiMapPin
                    className="text-[#C6A14C]"
                    aria-hidden="true"
                />
                موقعیت ما
            </h3>

            <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden">
                <iframe
                    title="نقشه موقعیت دفتر مرکزی"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.9999999999995!2d51.38999999999999!3d35.689999999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQxJzI0LjAiTiA1McKwMjMnMjQuMCJF!5e0!3m2!1sen!2s!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                />
            </div>

            <div className="mt-3 sm:mt-4 flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600">
                <PiMapPin
                    className="text-[#C6A14C] mt-0.5 shrink-0"
                    aria-hidden="true"
                />
                <span>
                    {addressInfo.value}، {addressInfo.description}
                </span>
            </div>
        </div>
    )
})

/* ============================================================
   WorkingHoursCard
   ============================================================ */
const WorkingHoursCard = memo(function WorkingHoursCard() {
    return (
        <div
            className="
                bg-white rounded-2xl sm:rounded-3xl
                shadow-[0_2px_16px_-4px_rgba(15,23,42,0.08)]
                p-4 sm:p-6
            "
        >
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                <PiClock className="text-[#C6A14C]" aria-hidden="true" />
                ساعات کاری
            </h3>

            <ul className="space-y-2 sm:space-y-3">
                {WORKING_HOURS.map((item) => (
                    <li
                        key={item.day}
                        className="flex items-center justify-between"
                    >
                        <span className="text-xs sm:text-sm text-slate-600">
                            {item.day}
                        </span>
                        <span
                            className={`text-xs sm:text-sm font-bold ${
                                item.closed ? 'text-rose-500' : 'text-slate-900'
                            }`}
                        >
                            {item.hours}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
})

/* ============================================================
   SocialCard
   ============================================================ */
const SocialCard = memo(function SocialCard() {
    return (
        <div
            className="
                bg-white rounded-2xl sm:rounded-3xl
                shadow-[0_2px_16px_-4px_rgba(15,23,42,0.08)]
                p-4 sm:p-6
            "
        >
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                <PiChatCircle className="text-[#C6A14C]" aria-hidden="true" />
                ما را دنبال کنید
            </h3>

            <ul className="flex flex-wrap items-center gap-2 sm:gap-3">
                {SOCIALS.map((social) => {
                    const Icon = social.icon
                    return (
                        <li key={social.label}>
                            <a
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                title={social.label}
                                className={`
                                    w-10 h-10 sm:w-12 sm:h-12
                                    rounded-xl
                                    flex items-center justify-center
                                    ${social.bg} ${social.text} ${social.hover}
                                    transition-all duration-200
                                    hover:scale-110 active:scale-95
                                    focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/30
                                    motion-reduce:transition-none
                                `}
                            >
                                <Icon
                                    className="text-xl sm:text-2xl"
                                    aria-hidden="true"
                                />
                            </a>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
})

/* ============================================================
   FAQItem
   ============================================================ */
const FAQItem = memo(function FAQItem({ faq }) {
    return (
        <div
            className="
                bg-white rounded-2xl
                shadow-[0_2px_16px_-4px_rgba(15,23,42,0.08)]
                hover:shadow-[0_12px_28px_-8px_rgba(198,161,76,0.2)]
                p-4 sm:p-6
                transition-shadow duration-300
                motion-reduce:transition-none
            "
        >
            <div className="flex items-start gap-3 sm:gap-4">
                <div
                    className="
                        w-8 h-8 sm:w-10 sm:h-10
                        rounded-xl
                        flex items-center justify-center
                        shrink-0
                    "
                    style={{ backgroundImage: GOLD_GRADIENT }}
                >
                    <PiQuestion
                        className="text-white text-base sm:text-lg"
                        aria-hidden="true"
                    />
                </div>
                <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 sm:mb-2">
                        {faq.question}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {faq.answer}
                    </p>
                </div>
            </div>
        </div>
    )
})

/* ============================================================
   Page
   ============================================================ */
export default function ContactPage() {
    return (
        <div dir="rtl" className="min-h-screen bg-gradient-to-b from-[#FDFCF9] to-white">
            {/* ==================== Hero ==================== */}
            <section className="relative overflow-hidden pt-8 sm:pt-12 md:pt-16 lg:pt-20">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-60 pointer-events-none"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 15% 20%, rgba(198,161,76,0.12) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(198,161,76,0.10) 0%, transparent 45%)',
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tight">
                            تماس با{' '}
                            <span
                                className="bg-clip-text text-transparent"
                                style={{ backgroundImage: GOLD_GRADIENT_TEXT }}
                            >
                                ما
                            </span>
                        </h1>
                        <div
                            className="w-16 sm:w-20 h-1 rounded-full mx-auto mb-4 sm:mb-6"
                            style={{ backgroundImage: GOLD_GRADIENT }}
                            aria-hidden="true"
                        />
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 leading-relaxed px-2">
                            ما همیشه آماده شنیدن حرف‌های شما هستیم. با ما در ارتباط
                            باشید
                        </p>
                    </div>
                </div>
            </section>

            {/* ==================== Contact Info ==================== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-8 md:-mt-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {CONTACT_INFO.map((info) => (
                        <ContactInfoCard key={info.id} info={info} />
                    ))}
                </div>
            </section>

            {/* ==================== Form + Sidebar ==================== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                    <ContactForm />

                    <div className="space-y-4 sm:space-y-6">
                        <MapCard />
                        <WorkingHoursCard />
                        <SocialCard />
                    </div>
                </div>
            </section>

            {/* ==================== FAQ ==================== */}
            <section className="bg-[#F5F2ED]" aria-labelledby="faq-heading">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
                    <div id="faq-heading">
                        <SectionTitle
                            title="سوالات"
                            highlight="متداول"
                            description="پاسخ سوالات پرتکرار شما در مورد مراسمینو"
                        />
                    </div>

                    <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
                        {FAQS.map((faq) => (
                            <FAQItem key={faq.id} faq={faq} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}