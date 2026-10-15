// components/landing/HeroSlider.jsx
'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    PiCaretLeft,
    PiCaretRight,
    PiCrownSimpleFill,
    PiArrowLeft,
    PiSparkle,
} from 'react-icons/pi'

const SLIDES = [
    {
        id: 1,
        title: 'مراسم خود را در بهترین تالارها برگزار کنید',
        subtitle: 'منتخب لوکس‌ترین تالارهای ایران با امکانات مدرن',
        bgImage: '/images/landing/hero/hero5.jfif',
        ctaText: 'رزرو تالار',
        ctaLink: '/halls',
        badge: 'ویژه',
    },
    {
        id: 2,
        title: 'تالار رویایی‌تان را پیدا کنید',
        subtitle: 'از سالن‌های کوچک تا باغ‌تالارهای باشکوه',
        bgImage: '/images/landing/hero/hero6.jfif',
        ctaText: 'مشاهده تالارها',
        ctaLink: '/halls',
        badge: 'منتخب',
    },
    {
        id: 3,
        title: 'لحظه‌های خاص را ماندگار کنید',
        subtitle: 'تالارهای مجهز با خدمات کامل و قیمت منصفانه',
        bgImage: '/images/landing/hero/hero7.jfif',
        ctaText: 'شروع رزرو',
        ctaLink: '/halls',
        badge: 'لوکس',
    },
    {
        id: 4,
        title: 'هر مراسمی، در جای خودش',
        subtitle: 'عروسی، تولد، همایش و هر مناسبت دیگری',
        bgImage: '/images/landing/hero/hero8.jfif',
        ctaText: 'جستجوی تالار',
        ctaLink: '/halls',
        badge: 'همه‌کاره',
    },
]

const SLIDES_COUNT = SLIDES.length
const AUTO_PLAY_MS = 6000

/* ============================================================
   Slide
   ============================================================ */
const Slide = memo(function Slide({ slide, isActive, priority }) {
    return (
        <div
            className={`
                absolute inset-0
                transition-opacity duration-[1200ms]
                ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
            style={{ zIndex: isActive ? 1 : 0 }}
        >
            <Image
                src={slide.bgImage}
                alt={slide.title}
                fill
                sizes="100vw"
                quality={85}
                priority={priority}
                loading={priority ? 'eager' : 'lazy'}
                className="object-cover"
            />

            {/* گرادیان‌ها */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-l from-slate-950/50 via-slate-950/10 to-transparent" />
        </div>
    )
})

/* ============================================================
   NavButton
   ============================================================ */
const NavButton = memo(function NavButton({ direction, onClick }) {
    const isNext = direction === 'next'
    const Icon = isNext ? PiCaretLeft : PiCaretRight

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={isNext ? 'اسلاید بعدی' : 'اسلاید قبلی'}
            className={`
                group absolute top-1/2 -translate-y-1/2
                ${isNext ? 'left-4 sm:left-6 md:left-8' : 'right-4 sm:right-6 md:right-8'}
                w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14
                rounded-full
                flex items-center justify-center
                bg-white/10 hover:bg-white/20
                backdrop-blur-xl
                text-white
                ring-1 ring-white/30 hover:ring-[#E0C67B]/60
                hover:scale-110 active:scale-95
                cursor-pointer
                transition-all duration-300
                z-30
            `}
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
        >
            <Icon
                className="w-5 h-5 sm:w-6 sm:h-6"
                strokeWidth={2.5}
                aria-hidden="true"
            />
        </button>
    )
})

/* ============================================================
   HeroSlider
   ============================================================ */
export default function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    const currentSlide = SLIDES[currentIndex]

    useEffect(() => {
        if (isPaused) return
        const id = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % SLIDES_COUNT)
        }, AUTO_PLAY_MS)
        return () => clearInterval(id)
    }, [isPaused])

    const nextSlide = useCallback(
        () => setCurrentIndex((prev) => (prev + 1) % SLIDES_COUNT),
        []
    )
    const prevSlide = useCallback(
        () => setCurrentIndex((prev) => (prev - 1 + SLIDES_COUNT) % SLIDES_COUNT),
        []
    )

    const onKeyDown = useCallback(
        (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault()
                nextSlide()
            } else if (e.key === 'ArrowRight') {
                e.preventDefault()
                prevSlide()
            }
        },
        [nextSlide, prevSlide]
    )

    return (
        <section
            aria-label="اسلایدر اصلی"
            className="w-full px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28"
        >
            <div
                onKeyDown={onKeyDown}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                tabIndex={0}
                className="
                    relative overflow-hidden
                    h-[70vh] min-h-[460px]
                    sm:h-[75vh] sm:min-h-[500px]
                    md:h-[78vh] md:min-h-[560px]
                    lg:h-[82vh]
                    rounded-3xl sm:rounded-[2rem]
                    ring-1 ring-white/10
                "
                style={{ boxShadow: '0 30px 80px -20px rgba(15,23,42,0.6)' }}
            >
                {/* Slides */}
                {SLIDES.map((slide, i) => (
                    <Slide
                        key={slide.id}
                        slide={slide}
                        isActive={i === currentIndex}
                        priority={i === 0}
                    />
                ))}

                {/* Content */}
                <div
                    className="
                        absolute inset-0
                        flex items-center justify-center
                        px-6 sm:px-8 md:px-12
                        pt-8 sm:pt-12
                    "
                    style={{ zIndex: 20 }}
                >
                    <div className="text-center max-w-4xl mx-auto w-full">
                        <div className="space-y-4 sm:space-y-5">
                            {/* بج */}
                            {currentSlide.badge && (
                                <div className="flex justify-center">
                                    <span
                                        className="
                                            inline-flex items-center gap-1.5
                                            px-4 py-1.5 rounded-full
                                            text-[11px] sm:text-xs font-bold text-white
                                        "
                                        style={{
                                            background: 'rgba(255,255,255,0.12)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            backdropFilter: 'blur(8px)',
                                        }}
                                    >
                                        <PiSparkle
                                            className="w-3 h-3 text-[#E0C67B]"
                                            aria-hidden="true"
                                        />
                                        {currentSlide.badge}
                                    </span>
                                </div>
                            )}

                            {/* آیکن تاج */}
                            <div className="flex justify-center">
                                <div
                                    className="
                                        relative
                                        w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20
                                        rounded-2xl
                                        flex items-center justify-center
                                        ring-4 ring-white/20
                                    "
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #E0C67B 0%, #C6A14C 50%, #85672C 100%)',
                                        boxShadow:
                                            '0 10px 40px -8px rgba(198,161,76,0.6)',
                                    }}
                                >
                                    <PiCrownSimpleFill
                                        className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white"
                                        aria-hidden="true"
                                    />
                                </div>
                            </div>

                            {/* عنوان */}
                            <h1
                                className="
                                    text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
                                    font-black text-white
                                    leading-[1.25] sm:leading-tight
                                    px-2 tracking-tight
                                "
                                style={{
                                    textShadow:
                                        '0 4px 20px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.5)',
                                }}
                            >
                                {currentSlide.title}
                            </h1>

                            {/* جداکننده */}
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-12 sm:w-16 h-[2px] bg-gradient-to-r from-transparent to-[#E0C67B]/80" />
                                <PiSparkle
                                    className="w-4 h-4 text-[#E0C67B]"
                                    aria-hidden="true"
                                />
                                <div className="w-12 sm:w-16 h-[2px] bg-gradient-to-l from-transparent to-[#E0C67B]/80" />
                            </div>

                            {/* زیرعنوان */}
                            <p
                                className="
                                    text-sm sm:text-base md:text-lg lg:text-xl
                                    font-bold text-[#E0C67B]
                                    px-4 leading-relaxed
                                "
                                style={{
                                    textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                                }}
                            >
                                {currentSlide.subtitle}
                            </p>

                            {/* CTA */}
                            <div className="flex justify-center pt-1">
                                <Link
                                    href={currentSlide.ctaLink}
                                    prefetch={false}
                                    className="
                                        group inline-flex items-center gap-2
                                        px-6 sm:px-8 py-3 sm:py-3.5
                                        rounded-2xl
                                        text-[#2A1F1F] text-sm sm:text-base font-extrabold
                                        hover:-translate-y-0.5
                                        active:scale-[0.97]
                                        transition-all duration-300
                                    "
                                    style={{
                                        background:
                                            'linear-gradient(180deg, #E0C67B 0%, #C6A14C 50%, #A8853A 100%)',
                                        boxShadow:
                                            '0 10px 30px -6px rgba(198,161,76,0.6)',
                                    }}
                                >
                                    <span>{currentSlide.ctaText}</span>
                                    <PiArrowLeft
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                    />
                                </Link>
                            </div>

                            {/* متن کوچک */}
                            <p
                                className="
                                    text-[11px] sm:text-xs md:text-sm
                                    text-white/75
                                    max-w-xl mx-auto px-4
                                "
                                style={{
                                    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                                }}
                            >
                                بیش از ۱۰٬۰۰۰ مراسم موفق با رزرو تالار
                            </p>
                        </div>
                    </div>
                </div>

                {/* Nav Buttons */}
                <NavButton direction="prev" onClick={prevSlide} />
                <NavButton direction="next" onClick={nextSlide} />
            </div>
        </section>
    )
}