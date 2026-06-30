// components/landing/HeroSlider.jsx - Optimized version without next/image issues
'use client'

import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Lazy load heavy icons
const IoArrowBackOutline = lazy(() => import('react-icons/io5').then(mod => ({ default: mod.IoArrowBackOutline })))
const IoArrowForwardOutline = lazy(() => import('react-icons/io5').then(mod => ({ default: mod.IoArrowForwardOutline })))
const GiLaurelCrown = lazy(() => import('react-icons/gi').then(mod => ({ default: mod.GiLaurelCrown })))

// Slides data
const slides = [
    {
        id: 1,
        title: 'مراسم خود را خاص برگزار کنید',
        subtitle: 'بهترین تالارهای لوکس با امکانات مدرن',
        bgImage: '/images/landing/halls/1.jpg',
        ctaText: 'رزرو تالار',
        ctaLink: '/halls'
    },
    {
        id: 2,
        title: 'سفر گروهی با اتوبوس‌های لوکس',
        subtitle: 'ناوگان مدرن با رانندگان حرفه‌ای',
        bgImage: '/images/landing/halls/2.jpg',
        ctaText: 'رزرو اتوبوس',
        ctaLink: '/buses'
    },
    {
        id: 3,
        title: 'طعم واقعی غذاهای خانگی',
        subtitle: 'مواد اولیه تازه و ارگانیک',
        bgImage: '/images/landing/halls/3.jpg',
        ctaText: 'سفارش غذا',
        ctaLink: '/foods'
    },
    {
        id: 4,
        title: 'اقامت در لوکس‌ترین ویلاها',
        subtitle: 'تجربه‌ای به‌یادماندنی از اقامت',
        bgImage: '/images/landing/halls/5.jpg',
        ctaText: 'اجاره ویلا',
        ctaLink: '/properties'
    }
]

export default function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const [isMounted, setIsMounted] = useState(false)
    const autoPlayTimerRef = useRef(null)
    const resetTimerRef = useRef(null)

    // Mark component as mounted
    useEffect(() => {
        setIsMounted(true)
        return () => {
            if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
            if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
        }
    }, [])

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || !isMounted) return

        autoPlayTimerRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length)
        }, 6000)

        return () => {
            if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
        }
    }, [isAutoPlaying, isMounted])

    // Navigation functions
    const goToSlide = useCallback((index) => {
        setCurrentIndex(index)
        setIsAutoPlaying(false)

        if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
        resetTimerRef.current = setTimeout(() => {
            setIsAutoPlaying(true)
        }, 10000)
    }, [])

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length)
        setIsAutoPlaying(false)

        if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
        resetTimerRef.current = setTimeout(() => {
            setIsAutoPlaying(true)
        }, 10000)
    }, [])

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
        setIsAutoPlaying(false)

        if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
        resetTimerRef.current = setTimeout(() => {
            setIsAutoPlaying(true)
        }, 10000)
    }, [])

    // Preload next image
    useEffect(() => {
        const nextIndex = (currentIndex + 1) % slides.length
        const nextImage = slides[nextIndex].bgImage
        const img = new Image()
        img.src = nextImage
    }, [currentIndex])

    // Optimized image component using native img
    const SlideImage = ({ src, alt, isActive }) => (
        <div className="absolute inset-0">
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                loading={isActive ? 'eager' : 'lazy'}
                fetchPriority={isActive ? 'high' : 'low'}
                decoding="async"
                style={{ willChange: 'transform' }}
            />
        </div>
    )

    return (
        <div className="w-full px-4 md:px-6 lg:px-8 pt-24 md:pt-28">
            <div className="relative h-[85vh] min-h-[550px] md:h-[80vh] md:min-h-[650px] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl">

                {/* Slides */}
                <AnimatePresence mode="wait">
                    {slides.map((slide, index) => (
                        index === currentIndex && (
                            <motion.div
                                key={slide.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="absolute inset-0"
                            >
                                <SlideImage
                                    src={slide.bgImage}
                                    alt={slide.title}
                                    isActive={index === currentIndex}
                                />

                                {/* Gradients overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                {/* Decorative pattern */}
                                <div
                                    className="absolute inset-0 opacity-10"
                                    style={{
                                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)',
                                        backgroundSize: '40px 40px'
                                    }}
                                />
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>

                {/* Content */}
                {isMounted && (
                    <div className="relative z-10 h-full flex items-center justify-center px-4">
                        <div className="text-center max-w-4xl mx-auto">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                    className="space-y-6"
                                >
                                    {/* Crown icon */}
                                    <div className="flex justify-center">
                                        <div className="bg-white/20 backdrop-blur-md rounded-full p-4 shadow-xl">
                                            <Suspense fallback={<div className="w-12 h-12 bg-white/20 rounded-full" />}>
                                                <GiLaurelCrown className="w-12 h-12 text-[#D4B06A]" />
                                            </Suspense>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight px-2">
                                        {slides[currentIndex].title}
                                        <span className="block mt-2 md:mt-3 text-transparent bg-clip-text bg-gradient-to-r from-[#D4B06A] to-[#F5D89C]">
                                            {slides[currentIndex].subtitle}
                                        </span>
                                    </h1>

                                    {/* Description */}
                                    <p className="text-base md:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto px-4">
                                        بیش از ۱۰,۰۰۰ مراسم موفق با مراسمینو
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Navigation buttons */}
                {isMounted && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-200 shadow-lg cursor-pointer"
                            aria-label="Previous slide"
                        >
                            <Suspense fallback={<div className="w-5 h-5 md:w-6 md:h-6" />}>
                                <IoArrowForwardOutline className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </Suspense>
                        </button>

                        <button
                            onClick={nextSlide}
                            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-200 shadow-lg cursor-pointer"
                            aria-label="Next slide"
                        >
                            <Suspense fallback={<div className="w-5 h-5 md:w-6 md:h-6" />}>
                                <IoArrowBackOutline className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </Suspense>
                        </button>
                    </>
                )}

                {/* Slider dots */}
                <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-200 rounded-full cursor-pointer ${currentIndex === index
                                ? 'w-8 md:w-10 h-2 md:h-2.5 bg-gradient-to-r from-[#D4B06A] to-[#F5D89C] shadow-lg'
                                : 'w-2 h-2 md:w-2.5 md:h-2.5 bg-white/50 hover:bg-white/80'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Progress bar */}
                {isMounted && (
                    <motion.div
                        key={currentIndex}
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4B06A] to-[#F5D89C] origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 6, ease: 'linear' }}
                        style={{ transformOrigin: 'left' }}
                    />
                )}
            </div>
        </div>
    )
}