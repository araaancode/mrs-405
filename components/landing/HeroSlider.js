// components/landing/HeroSlider.jsx
"use client";

import {
    useState,
    useEffect,
    useCallback,
    useRef,
    lazy,
    Suspense,
} from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ============================================================
   Lazy Load Icons
   ============================================================ */
const PiCaretLeft = lazy(() =>
    import("react-icons/pi").then((mod) => ({ default: mod.PiCaretLeft }))
);
const PiCaretRight = lazy(() =>
    import("react-icons/pi").then((mod) => ({ default: mod.PiCaretRight }))
);
const PiCrownSimpleFill = lazy(() =>
    import("react-icons/pi").then((mod) => ({
        default: mod.PiCrownSimpleFill,
    }))
);
const PiArrowLeft = lazy(() =>
    import("react-icons/pi").then((mod) => ({ default: mod.PiArrowLeft }))
);

/* ============================================================
   Slides Data
   ============================================================ */
const slides = [
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

/* ============================================================
   HeroSlider
   ============================================================ */
export default function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const autoPlayTimerRef = useRef(null);
    const resetTimerRef = useRef(null);

    /* -------- Mount -------- */
    useEffect(() => {
        setIsMounted(true);
        return () => {
            if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
            if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        };
    }, []);

    /* -------- Auto Play -------- */
    useEffect(() => {
        if (!isAutoPlaying || !isMounted) return;

        autoPlayTimerRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 6000);

        return () => {
            if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
        };
    }, [isAutoPlaying, isMounted]);

    /* -------- Pause helper -------- */
    const pauseAutoPlay = useCallback(() => {
        setIsAutoPlaying(false);
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        resetTimerRef.current = setTimeout(() => setIsAutoPlaying(true), 10000);
    }, []);

    /* -------- Navigation -------- */
    const goToSlide = useCallback(
        (index) => {
            setCurrentIndex(index);
            pauseAutoPlay();
        },
        [pauseAutoPlay]
    );

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
        pauseAutoPlay();
    }, [pauseAutoPlay]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
        pauseAutoPlay();
    }, [pauseAutoPlay]);

    /* -------- Preload next image -------- */
    useEffect(() => {
        const nextIndex = (currentIndex + 1) % slides.length;
        const img = new Image();
        img.src = slides[nextIndex].bgImage;
    }, [currentIndex]);

    /* -------- Current slide -------- */
    const currentSlide = slides[currentIndex];

    /* ============================================================
       Render
       ============================================================ */
    return (
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28">
            <div
                className="
          relative overflow-hidden
          h-[80vh] min-h-[520px]
          sm:h-[85vh] sm:min-h-[560px]
          md:h-[85vh] md:min-h-[620px]
          lg:h-[88vh]
          rounded-2xl sm:rounded-3xl
          shadow-2xl shadow-slate-900/20
        "
            >
                {/* ==================== Slides (Backgrounds) ==================== */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        {/* تصویر */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={currentSlide.bgImage}
                            alt={currentSlide.title}
                            className="w-full h-full object-cover"
                            loading={currentIndex === 0 ? "eager" : "lazy"}
                            fetchPriority={currentIndex === 0 ? "high" : "low"}
                            decoding="async"
                        />

                        {/* گرادیانت‌ها */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/50 to-slate-900/30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent" />

                        {/* الگوی نقطه‌ای */}
                        <div
                            className="absolute inset-0 opacity-[0.08]"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 2px 2px, white 1px, transparent 1px)",
                                backgroundSize: "40px 40px",
                            }}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* ==================== Content ==================== */}
                {isMounted && (
                    <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 md:px-8">
                        <div className="text-center max-w-4xl mx-auto w-full">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -24 }}
                                    transition={{ duration: 0.5, delay: 0.15 }}
                                    className="space-y-5 sm:space-y-6"
                                >
                                    {/* آیکون تاج */}
                                    <div className="flex justify-center">
                                        <div
                                            className="
                        relative w-14 h-14 sm:w-16 sm:h-16
                        rounded-2xl
                        bg-gradient-to-br from-gold-400 to-gold-600
                        flex items-center justify-center
                        shadow-lg shadow-gold-500/40
                        ring-4 ring-white/10
                      "
                                        >
                                            <div className="absolute inset-0 rounded-2xl bg-gold-500/20 blur-xl" />
                                            <Suspense
                                                fallback={
                                                    <div className="w-7 h-7 bg-white/20 rounded-full" />
                                                }
                                            >
                                                <PiCrownSimpleFill className="relative w-7 h-7 sm:w-8 sm:h-8 text-white" />
                                            </Suspense>
                                        </div>
                                    </div>

                                    {/* عنوان */}
                                    <h1
                                        className="
                      text-[26px] sm:text-3xl md:text-5xl lg:text-6xl
                      font-black text-white leading-[1.25] sm:leading-tight
                      px-2
                      tracking-tight
                    "
                                    >
                                        {currentSlide.title}
                                    </h1>

                                    {/* زیرعنوان */}
                                    <p
                                        className="
                      text-base sm:text-lg md:text-xl lg:text-2xl
                      font-medium
                      bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300
                      bg-clip-text text-transparent
                      px-4
                      leading-relaxed
                    "
                                    >
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
                                            className="
                        group
                        inline-flex items-center justify-center gap-2
                        px-6 sm:px-7
                        py-3 sm:py-3.5
                        rounded-xl
                        text-sm sm:text-base font-bold text-white
                        bg-gradient-to-b from-gold-400 to-gold-600
                        hover:from-gold-500 hover:to-gold-700
                        shadow-lg shadow-gold-500/30
                        hover:shadow-xl hover:shadow-gold-500/50
                        ring-1 ring-white/10
                        hover:-translate-y-0.5
                        active:scale-95
                        focus:outline-none focus:ring-4 focus:ring-gold-500/40
                        transition-all duration-300
                      "
                                        >
                                            <span>{currentSlide.ctaText}</span>
                                            <Suspense fallback={<span className="w-4 h-4" />}>
                                                <PiArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                                            </Suspense>
                                        </Link>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* ==================== Navigation Buttons ==================== */}
                {isMounted && (
                    <>
                        {/* دکمه راست (قبلی) */}
                        <button
                            type="button"
                            onClick={prevSlide}
                            aria-label="اسلاید قبلی"
                            className="
                absolute right-3 sm:right-5 md:right-6
                top-1/2 -translate-y-1/2 z-20
                w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12
                rounded-full
                flex items-center justify-center
                bg-white/15 hover:bg-gold-500
                backdrop-blur-md
                text-white
                ring-1 ring-white/30 hover:ring-gold-500
                shadow-lg shadow-black/20 hover:shadow-gold-500/40
                hover:scale-110 active:scale-95
                cursor-pointer
                transition-all duration-200
              "
                        >
                            <Suspense fallback={<div className="w-5 h-5" />}>
                                <PiCaretRight
                                    className="w-5 h-5 sm:w-6 sm:h-6"
                                    strokeWidth={2.5}
                                />
                            </Suspense>
                        </button>

                        {/* دکمه چپ (بعدی) */}
                        <button
                            type="button"
                            onClick={nextSlide}
                            aria-label="اسلاید بعدی"
                            className="
                absolute left-3 sm:left-5 md:left-6
                top-1/2 -translate-y-1/2 z-20
                w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12
                rounded-full
                flex items-center justify-center
                bg-white/15 hover:bg-gold-500
                backdrop-blur-md
                text-white
                ring-1 ring-white/30 hover:ring-gold-500
                shadow-lg shadow-black/20 hover:shadow-gold-500/40
                hover:scale-110 active:scale-95
                cursor-pointer
                transition-all duration-200
              "
                        >
                            <Suspense fallback={<div className="w-5 h-5" />}>
                                <PiCaretLeft
                                    className="w-5 h-5 sm:w-6 sm:h-6"
                                    strokeWidth={2.5}
                                />
                            </Suspense>
                        </button>
                    </>
                )}

                {/* ==================== Dots ==================== */}
                <div className="absolute bottom-5 sm:bottom-6 md:bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5">
                    {slides.map((_, index) => {
                        const isActive = currentIndex === index;
                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => goToSlide(index)}
                                aria-label={`رفتن به اسلاید ${index + 1}`}
                                aria-current={isActive ? "true" : "false"}
                                className={`
                  cursor-pointer rounded-full
                  transition-all duration-300
                  ${isActive
                                        ? "w-8 sm:w-10 h-2 sm:h-2.5 bg-gradient-to-r from-gold-400 to-gold-600 shadow-lg shadow-gold-500/40"
                                        : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50 hover:bg-white/90 hover:scale-125"
                                    }
                `}
                            />
                        );
                    })}
                </div>

                {/* ==================== Progress Bar ==================== */}
                {isMounted && (
                    <motion.div
                        key={`progress-${currentIndex}-${isAutoPlaying}`}
                        className="
              absolute bottom-0 right-0 left-0
              h-1
              bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600
            "
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isAutoPlaying ? 1 : 0 }}
                        transition={{
                            duration: isAutoPlaying ? 6 : 0.3,
                            ease: "linear",
                        }}
                        style={{ transformOrigin: "right" }}
                    />
                )}


            </div>
        </div>
    );
}