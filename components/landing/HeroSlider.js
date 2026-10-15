// components/landing/HeroSlider.jsx
'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import Image from 'next/image'
import {
    PiCaretLeft,
    PiCaretRight,
    PiSparkle,
} from 'react-icons/pi'

const SLIDES = [
    {
        id: 1,
        title: 'مراسم خود را در بهترین تالارها برگزار کنید',
        subtitle: 'منتخب لوکس‌ترین تالارهای ایران با امکانات مدرن',
        bgImage: '/images/landing/hero/new/1.jfif',
        ctaText: 'رزرو تالار',
        ctaLink: '/halls',
        badge: 'ویژه',
    },
    {
        id: 2,
        title: 'تالار رویایی‌تان را پیدا کنید',
        subtitle: 'از سالن‌های کوچک تا باغ‌تالارهای باشکوه',
        bgImage: '/images/landing/hero/new/2.jfif',
        ctaText: 'مشاهده تالارها',
        ctaLink: '/halls',
        badge: 'منتخب',
    },
    {
        id: 3,
        title: 'لحظه‌های خاص را ماندگار کنید',
        subtitle: 'تالارهای مجهز با خدمات کامل و قیمت منصفانه',
        bgImage: '/images/landing/hero/new/3.jfif',
        ctaText: 'شروع رزرو',
        ctaLink: '/halls',
        badge: 'لوکس',
    },
    {
        id: 4,
        title: 'هر مراسمی، در جای خودش',
        subtitle: 'عروسی، تولد، همایش و هر مناسبت دیگری',
        bgImage: '/images/landing/hero/new/4.jfif',
        ctaText: 'جستجوی تالار',
        ctaLink: '/halls',
        badge: 'همه‌کاره',
    },
    {
        id: 5,
        title: 'تجربه‌ای به یادماندنی برای مهمانان‌تان بسازید',
        subtitle: 'تالارهایی با طراحی منحصر به فرد و تیم حرفه‌ای',
        bgImage: '/images/landing/hero/new/5.jfif',
        ctaText: 'مشاهده جزئیات',
        ctaLink: '/halls',
        badge: 'پیشنهاد ویژه',
    },
    {
        id: 6,
        title: 'رزرو آنلاین، سریع و بدون دردسر',
        subtitle: 'در چند دقیقه تالار مورد نظرتان را رزرو کنید',
        bgImage: '/images/landing/hero/new/6.jfif',
        ctaText: 'رزرو سریع',
        ctaLink: '/halls',
        badge: 'آنلاین',
    },
];

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
                motion-reduce:transition-none
                ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
            style={{ zIndex: isActive ? 1 : 0 }}
            aria-hidden={!isActive}
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
                ${isNext
                    ? 'left-2 sm:left-4 md:left-6 lg:left-8'
                    : 'right-2 sm:right-4 md:right-6 lg:right-8'}
                w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14
                rounded-full
                flex items-center justify-center
                bg-white/10 hover:bg-white/20
                backdrop-blur-xl
                -webkit-backdrop-filter: blur(20px)
                text-white
                ring-1 ring-white/30 hover:ring-[#E0C67B]/60
                hover:scale-110 active:scale-95
                motion-reduce:hover:scale-100 motion-reduce:active:scale-100
                cursor-pointer
                transition-all duration-300
                z-30
                touch-manipulation
            `}
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
        >
            <Icon
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
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
            className="w-full px-2 sm:px-4 md:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24"
        >
            <div
                onKeyDown={onKeyDown}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                tabIndex={0}
                className="
                    relative overflow-hidden
                    h-[60svh] min-h-[400px]
                    sm:h-[70svh] sm:min-h-[480px]
                    md:h-[75svh] md:min-h-[540px]
                    lg:h-[80svh] lg:min-h-[600px]
                    rounded-2xl sm:rounded-3xl md:rounded-[2rem]
                    ring-1 ring-white/10
                    touch-pan-y
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
                        px-4 sm:px-6 md:px-8 lg:px-12
                        py-6 sm:py-8 md:py-10
                    "
                    style={{ zIndex: 20 }}
                >
                    <div className="text-center max-w-4xl mx-auto w-full">
                        <div className="space-y-3 sm:space-y-4 md:space-y-5">
                            {/* عنوان */}
                            <h1
                                className="
                                    text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl
                                    font-black text-white
                                    leading-[1.3] sm:leading-tight
                                    tracking-tight
                                "
                                style={{
                                    textShadow:
                                        '0 4px 20px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.5)',
                                }}
                            >
                                {currentSlide.title}
                            </h1>

                            {/* جداکننده */}
                            <div className="flex items-center justify-center gap-2 sm:gap-3">
                                <div className="w-8 sm:w-12 md:w-16 h-[2px] bg-gradient-to-r from-transparent to-[#E0C67B]/80" />
                                <PiSparkle
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E0C67B]"
                                    aria-hidden="true"
                                />
                                <div className="w-8 sm:w-12 md:w-16 h-[2px] bg-gradient-to-l from-transparent to-[#E0C67B]/80" />
                            </div>

                            {/* زیرعنوان */}
                            <p
                                className="
                                    text-xs sm:text-base md:text-lg lg:text-xl
                                    font-bold text-[#E0C67B]
                                    px-2 sm:px-4 leading-relaxed
                                "
                                style={{
                                    textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                                }}
                            >
                                {currentSlide.subtitle}
                            </p>

                            {/* متن کوچک */}
                            <p
                                className="
                                    text-[10px] sm:text-xs md:text-sm
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

                {/* Dot Indicators — نمایش در همه دستگاه‌ها */}
                <div
                    className="absolute bottom-3 sm:bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-30"
                    role="tablist"
                    aria-label="اسلایدها"
                >
                    {SLIDES.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            role="tab"
                            aria-selected={i === currentIndex}
                            aria-label={`اسلاید ${i + 1}`}
                            onClick={() => setCurrentIndex(i)}
                            className={`
                                h-1.5 rounded-full transition-all duration-300
                                ${i === currentIndex
                                    ? 'w-6 sm:w-8 bg-[#E0C67B]'
                                    : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'}
                            `}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}