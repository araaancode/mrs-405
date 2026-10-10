// components/landing/HeroSlider.jsx
"use client";

import {
    useState,
    useEffect,
    useCallback,
    useRef,
    memo,
} from "react";
import Link from "next/link";
import Image from "next/image";
import {
    PiCaretLeft,
    PiCaretRight,
    PiCrownSimpleFill,
    PiArrowLeft,
    PiSparkle,
} from "react-icons/pi";

/* ============================================================
   Slides Data — فقط تالار
   ============================================================ */
const SLIDES = [
    {
        id: 1,
        title: "مراسم خود را در بهترین تالارها برگزار کنید",
        subtitle: "منتخب لوکس‌ترین تالارهای ایران با امکانات مدرن",
        bgImage: "/images/landing/hero/hero1.png",
        ctaText: "رزرو تالار",
        ctaLink: "/halls",
        badge: "ویژه",
    },
    {
        id: 2,
        title: "تالار رویایی‌تان را پیدا کنید",
        subtitle: "از سالن‌های کوچک تا باغ‌تالارهای باشکوه",
        bgImage: "/images/landing/hero/hero2.png",
        ctaText: "مشاهده تالارها",
        ctaLink: "/halls",
        badge: "منتخب",
    },
    {
        id: 3,
        title: "لحظه‌های خاص را ماندگار کنید",
        subtitle: "تالارهای مجهز با خدمات کامل و قیمت منصفانه",
        bgImage: "/images/landing/hero/hero3.png",
        ctaText: "شروع رزرو",
        ctaLink: "/halls",
        badge: "لوکس",
    },
    {
        id: 4,
        title: "هر مراسمی، در جای خودش",
        subtitle: "عروسی، تولد، همایش و هر مناسبت دیگری",
        bgImage: "/images/landing/hero/hero4.png",
        ctaText: "جستجوی تالار",
        ctaLink: "/halls",
        badge: "همه‌کاره",
    },
];

const SLIDES_COUNT = SLIDES.length;
const AUTO_PLAY_MS = 6000;
const RESUME_MS = 10000;

/* ============================================================
   Dot
   ============================================================ */
const Dot = memo(function Dot({ index, isActive, onSelect }) {
    const handleClick = useCallback(() => onSelect(index), [onSelect, index]);
    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={`رفتن به اسلاید ${index + 1}`}
            aria-current={isActive ? "true" : "false"}
            className={`group relative cursor-pointer transition-all duration-500 ease-out ${
                isActive
                    ? "w-12 sm:w-14 h-2.5 rounded-full overflow-hidden bg-white/20 ring-1 ring-white/30"
                    : "w-2.5 h-2.5 rounded-full bg-white/50 hover:bg-white hover:scale-125 ring-1 ring-white/20"
            }`}
        >
            {isActive && (
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 shadow-[0_0_20px_rgba(198,161,76,0.6)]" />
            )}
        </button>
    );
});

/* ============================================================
   HeroSlider
   ============================================================ */
export default function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const autoPlayTimerRef = useRef(null);
    const resumeTimerRef = useRef(null);

    useEffect(() => {
        autoPlayTimerRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % SLIDES_COUNT);
        }, AUTO_PLAY_MS);

        return () => {
            if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
        };
    }, []);

    const pauseAndResume = useCallback(() => {
        if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);

        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = setTimeout(() => {
            if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
            autoPlayTimerRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % SLIDES_COUNT);
            }, AUTO_PLAY_MS);
        }, RESUME_MS);
    }, []);

    useEffect(() => {
        return () => {
            if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
            if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        };
    }, []);

    const goToSlide = useCallback(
        (index) => {
            setCurrentIndex(index);
            pauseAndResume();
        },
        [pauseAndResume]
    );

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % SLIDES_COUNT);
        pauseAndResume();
    }, [pauseAndResume]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + SLIDES_COUNT) % SLIDES_COUNT);
        pauseAndResume();
    }, [pauseAndResume]);

    const currentSlide = SLIDES[currentIndex];

    return (
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28">
            <div
                className="relative overflow-hidden h-[80vh] min-h-[520px] sm:h-[85vh] sm:min-h-[560px] md:h-[85vh] md:min-h-[620px] lg:h-[88vh] rounded-3xl sm:rounded-[2rem] shadow-[0_30px_80px_-20px_rgba(15,23,42,0.6)] ring-1 ring-white/10"
                style={{ position: "relative" }}
            >
                {/* ==================== Slides ==================== */}
                {SLIDES.map((slide, i) => {
                    const isActive = i === currentIndex;
                    const isFirst = i === 0;
                    return (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-all duration-1000 ease-out ${
                                isActive
                                    ? "opacity-100 scale-100 z-0"
                                    : "opacity-0 scale-105 z-0 pointer-events-none"
                            }`}
                            aria-hidden={!isActive}
                            style={{
                                position: "absolute",
                                inset: 0,
                            }}
                        >
                            <Image
                                src={slide.bgImage}
                                alt={slide.title}
                                width={1920}
                                height={1080}
                                sizes="100vw"
                                quality={85}
                                priority={isFirst}
                                loading={isFirst ? "eager" : "lazy"}
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{
                                    filter: "brightness(1.05) contrast(1.05)",
                                }}
                            />

                            {/*  گرادیانت‌های متعادل — کمی روشن‌تر */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 via-40% to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-l from-slate-950/45 via-slate-950/10 to-transparent" />
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background:
                                        "radial-gradient(ellipse at center, transparent 0%, rgba(2,6,23,0.2) 60%, rgba(2,6,23,0.55) 100%)",
                                }}
                            />
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background:
                                        "linear-gradient(to bottom, rgba(2,6,23,0.3) 0%, transparent 22%, transparent 78%, rgba(2,6,23,0.55) 100%)",
                                }}
                            />
                        </div>
                    );
                })}

                {/* الگوی نقطه‌ای */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.04] pointer-events-none z-[3]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 2px 2px, white 1.2px, transparent 1.2px)",
                        backgroundSize: "48px 48px",
                    }}
                />

                {/* گرادیانت طلایی ملایم پایین */}
                <div
                    aria-hidden="true"
                    className="absolute bottom-0 right-0 left-0 h-40 bg-gradient-to-t from-gold-500/10 to-transparent pointer-events-none z-[3]"
                />

                {/* ==================== Content ==================== */}
                <div className="relative z-[4] h-full flex items-center justify-center px-4 sm:px-6 md:px-8">
                    <div className="text-center max-w-4xl mx-auto w-full">
                        <div
                            key={currentIndex}
                            className="space-y-6 sm:space-y-7 animate-[heroFadeIn_700ms_ease-out]"
                        >
                            {/* Badge */}
                            <div className="flex justify-center">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20 shadow-lg">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                                    <span className="text-[11px] sm:text-xs font-bold text-white/95 tracking-wider">
                                        {currentSlide.badge}
                                    </span>
                                </div>
                            </div>

                            {/* آیکون تاج */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-3xl bg-gold-500/40 blur-2xl" />
                                    <div className="absolute inset-0 rounded-2xl bg-gold-400/30 blur-xl" />
                                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-gold-300 via-gold-500 to-gold-700 flex items-center justify-center shadow-[0_10px_40px_-8px_rgba(198,161,76,0.6)] ring-4 ring-white/20">
                                        <PiCrownSimpleFill className="relative w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-md" />
                                    </div>
                                </div>
                            </div>

                            {/* عنوان */}
                            <h1 className="text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.2] sm:leading-tight px-2 tracking-tight [text-shadow:0_4px_20px_rgba(0,0,0,0.7),0_2px_4px_rgba(0,0,0,0.5)]">
                                {currentSlide.title}
                            </h1>

                            {/* جداکننده */}
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-12 sm:w-16 h-[2px] bg-gradient-to-r from-transparent to-gold-400/80" />
                                <PiSparkle className="w-4 h-4 text-gold-400" />
                                <div className="w-12 sm:w-16 h-[2px] bg-gradient-to-l from-transparent to-gold-400/80" />
                            </div>

                            {/* زیرعنوان */}
                            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gold-200 via-gold-300 to-gold-200 bg-clip-text text-transparent px-4 leading-relaxed [filter:drop-shadow(0_2px_10px_rgba(0,0,0,0.7))]">
                                {currentSlide.subtitle}
                            </p>

                            {/* متن کوچک */}
                            <p className="text-xs sm:text-sm md:text-base text-white/80 max-w-xl mx-auto px-4 [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
                                بیش از ۱۰٬۰۰۰ مراسم موفق با رزرو تالار
                            </p>

                            {/* دکمه CTA */}
                            <div className="pt-4 sm:pt-5 flex justify-center">
                                <Link
                                    href={currentSlide.ctaLink}
                                    prefetch
                                    className="group relative inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-bold text-slate-900 bg-gradient-to-b from-gold-300 via-gold-400 to-gold-600 hover:from-gold-200 hover:via-gold-300 hover:to-gold-500 shadow-[0_10px_40px_-8px_rgba(198,161,76,0.6)] hover:shadow-[0_20px_60px_-10px_rgba(198,161,76,0.8)] ring-1 ring-white/40 hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gold-500/50 transition-all duration-300 overflow-hidden"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <span className="relative">{currentSlide.ctaText}</span>
                                    <PiArrowLeft className="relative w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================== Navigation Buttons — z پایین‌تر ==================== */}
                <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="اسلاید قبلی"
                    className="group absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-[5] w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white ring-1 ring-white/30 hover:ring-gold-400/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(198,161,76,0.4)] hover:scale-110 active:scale-95 cursor-pointer transition-all duration-300"
                >
                    <PiCaretRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" strokeWidth={2.5} />
                </button>

                <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="اسلاید بعدی"
                    className="group absolute left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-[5] w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white ring-1 ring-white/30 hover:ring-gold-400/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(198,161,76,0.4)] hover:scale-110 active:scale-95 cursor-pointer transition-all duration-300"
                >
                    <PiCaretLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" strokeWidth={2.5} />
                </button>

                {/* ==================== Dots + شمارنده در یک ردیف ==================== */}
                <div className="absolute bottom-6 sm:bottom-7 md:bottom-8 left-1/2 -translate-x-1/2 z-[5] flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        {SLIDES.map((_, index) => (
                            <Dot
                                key={index}
                                index={index}
                                isActive={currentIndex === index}
                                onSelect={goToSlide}
                            />
                        ))}
                    </div>
                </div>

                {/* ==================== Progress Bar ==================== */}
                <div
                    key={`progress-${currentIndex}`}
                    className="absolute bottom-0 right-0 left-0 h-[3px] z-[5] origin-right animate-[heroProgress_6000ms_linear]"
                >
                    <div className="h-full bg-gradient-to-r from-gold-300 via-gold-500 to-gold-600 shadow-[0_0_20px_rgba(198,161,76,0.8)]" />
                </div>
            </div>

            <style jsx>{`
                @keyframes heroFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes heroProgress {
                    from {
                        transform: scaleX(0);
                    }
                    to {
                        transform: scaleX(1);
                    }
                }
            `}</style>
        </div>
    );
}