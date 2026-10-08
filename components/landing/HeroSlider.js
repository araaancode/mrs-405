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
} from "react-icons/pi";

/* ============================================================
   Slides Data
   ============================================================ */
const SLIDES = [
    {
        id: 1,
        title: "مراسم خود را خاص برگزار کنید",
        subtitle: "بهترین تالارهای لوکس با امکانات مدرن",
        bgImage: "/images/landing/halls/hero1.png",
        ctaText: "رزرو تالار",
        ctaLink: "/halls",
    },
    {
        id: 2,
        title: "سفر گروهی با اتوبوس‌های لوکس",
        subtitle: "ناوگان مدرن با رانندگان حرفه‌ای",
        bgImage: "/images/landing/halls/hero2.png",
        ctaText: "رزرو اتوبوس",
        ctaLink: "/buses",
    },
    {
        id: 3,
        title: "طعم واقعی غذاهای خانگی",
        subtitle: "مواد اولیه تازه و ارگانیک",
        bgImage: "/images/landing/halls/hero3.png",
        ctaText: "سفارش غذا",
        ctaLink: "/foods",
    },
    {
        id: 4,
        title: "اقامت در لوکس‌ترین ویلاها",
        subtitle: "تجربه‌ای به‌یادماندنی از اقامت",
        bgImage: "/images/landing/halls/hero4.png",
        ctaText: "اجاره ویلا",
        ctaLink: "/properties",
    },
];

const SLIDES_COUNT = SLIDES.length;
const AUTO_PLAY_MS = 6000;
const RESUME_MS = 10000;

/* ============================================================
   Dot — memoized
   ============================================================ */
const Dot = memo(function Dot({ index, isActive, onSelect }) {
    const handleClick = useCallback(() => onSelect(index), [onSelect, index]);
    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={`رفتن به اسلاید ${index + 1}`}
            aria-current={isActive ? "true" : "false"}
            className={`cursor-pointer rounded-full transition-all duration-300 ${
                isActive
                    ? "w-8 sm:w-10 h-2 sm:h-2.5 bg-gradient-to-r from-gold-400 to-gold-600 shadow-lg shadow-gold-500/40"
                    : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50 hover:bg-white/90 hover:scale-125"
            }`}
        />
    );
});

/* ============================================================
   HeroSlider
   ============================================================ */
export default function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const autoPlayTimerRef = useRef(null);
    const resumeTimerRef = useRef(null);
    const currentIndexRef = useRef(0);

    /* برای دکمه‌های ناوبری: از مقدار به‌روز استفاده کنیم */
    currentIndexRef.current = currentIndex;

    /* ============================================================
       Auto Play — یک تایمر با cleanup تمیز
       ============================================================ */
    useEffect(() => {
        autoPlayTimerRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % SLIDES_COUNT);
        }, AUTO_PLAY_MS);

        return () => {
            if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
        };
    }, []);

    /* ============================================================
       Pause + Resume
       ============================================================ */
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

    /* ============================================================
       Navigation
       ============================================================ */
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

    /* ============================================================
       Render
       ============================================================ */
    return (
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28">
            <div className="relative overflow-hidden h-[80vh] min-h-[520px] sm:h-[85vh] sm:min-h-[560px] md:h-[85vh] md:min-h-[620px] lg:h-[88vh] rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-900/20">
                {/* ==================== Slides — همه رندر، فقط opacity تغییر ==================== */}
                <div className="absolute inset-0">
                    {SLIDES.map((slide, i) => {
                        const isActive = i === currentIndex;
                        const isFirst = i === 0;
                        return (
                            <div
                                key={slide.id}
                                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                                    isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                                }`}
                                aria-hidden={!isActive}
                            >
                                <Image
                                    src={slide.bgImage}
                                    alt={slide.title}
                                    fill
                                    sizes="100vw"
                                    quality={80}
                                    priority={isFirst}
                                    loading={isFirst ? "eager" : "lazy"}
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/50 to-slate-900/30" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent" />
                            </div>
                        );
                    })}

                    {/* الگوی نقطه‌ای — یک بار در والد */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-[0.08] pointer-events-none z-20"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 2px 2px, white 1px, transparent 1px)",
                            backgroundSize: "40px 40px",
                        }}
                    />
                </div>

                {/* ==================== Content ==================== */}
                <div className="relative z-30 h-full flex items-center justify-center px-4 sm:px-6 md:px-8">
                    <div className="text-center max-w-4xl mx-auto w-full">
                        <div
                            key={currentIndex}
                            className="space-y-5 sm:space-y-6 animate-[heroFadeIn_500ms_ease-out]"
                        >
                            {/* آیکون تاج */}
                            <div className="flex justify-center">
                                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/40 ring-4 ring-white/10">
                                    <PiCrownSimpleFill className="relative w-7 h-7 sm:w-8 sm:h-8 text-white" />
                                </div>
                            </div>

                            {/* عنوان */}
                            <h1 className="text-[26px] sm:text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.25] sm:leading-tight px-2 tracking-tight">
                                {currentSlide.title}
                            </h1>

                            {/* زیرعنوان */}
                            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent px-4 leading-relaxed">
                                {currentSlide.subtitle}
                            </p>

                            {/* متن کوچک */}
                            <p className="text-xs sm:text-sm md:text-base text-slate-300/80 max-w-xl mx-auto px-4">
                                بیش از ۱۰٬۰۰۰ مراسم موفق با رزرو تالار
                            </p>

                            {/* دکمه CTA */}
                            <div className="pt-3 sm:pt-4 flex justify-center">
                                <Link
                                    href={currentSlide.ctaLink}
                                    prefetch={false}
                                    className="group inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold text-white bg-gradient-to-b from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 shadow-lg shadow-gold-500/30 hover:shadow-xl hover:shadow-gold-500/50 ring-1 ring-white/10 hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gold-500/40 transition-all duration-300"
                                >
                                    <span>{currentSlide.ctaText}</span>
                                    <PiArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================== Navigation Buttons ==================== */}
                <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="اسلاید قبلی"
                    className="absolute right-3 sm:right-5 md:right-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white/15 hover:bg-gold-500 backdrop-blur-md text-white ring-1 ring-white/30 hover:ring-gold-500 shadow-lg shadow-black/20 hover:shadow-gold-500/40 hover:scale-110 active:scale-95 cursor-pointer transition-all duration-200"
                >
                    <PiCaretRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                </button>

                <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="اسلاید بعدی"
                    className="absolute left-3 sm:left-5 md:left-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white/15 hover:bg-gold-500 backdrop-blur-md text-white ring-1 ring-white/30 hover:ring-gold-500 shadow-lg shadow-black/20 hover:shadow-gold-500/40 hover:scale-110 active:scale-95 cursor-pointer transition-all duration-200"
                >
                    <PiCaretLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                </button>

                {/* ==================== Dots ==================== */}
                <div className="absolute bottom-5 sm:bottom-6 md:bottom-7 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 sm:gap-2.5">
                    {SLIDES.map((_, index) => (
                        <Dot
                            key={index}
                            index={index}
                            isActive={currentIndex === index}
                            onSelect={goToSlide}
                        />
                    ))}
                </div>

                {/* ==================== Progress Bar (CSS animation) ==================== */}
                <div
                    key={`progress-${currentIndex}`}
                    className="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 z-40 origin-right animate-[heroProgress_6000ms_linear]"
                />
            </div>

            {/* کیفریم‌های محلی — یک بار در کل صفحه */}
            <style jsx>{`
                @keyframes heroFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(24px);
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