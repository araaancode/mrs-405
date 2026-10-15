// components/ui/Carousel.jsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PiCaretRightBold, PiCaretLeftBold } from "react-icons/pi";

export default function Carousel({
    children,
    title,
    subtitle,
    eyebrow,
    ariaLabel = "اسلایدر",
    slideClassName = "shrink-0 snap-start",
    gapClassName = "gap-3 sm:gap-4",
    headerAction,
    containerClassName = "max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8",
    trackPaddingClassName = "px-3 sm:px-4 md:px-6 lg:px-8",
}) {
    const trackRef = useRef(null);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);
    const items = Array.isArray(children) ? children : [children];

    const [isRTL, setIsRTL] = useState(true);
    useEffect(() => {
        if (typeof document !== "undefined") {
            setIsRTL(getComputedStyle(document.documentElement).direction === "rtl");
        }
    }, []);

    /* ============================================================
       تشخیص وضعیت اسکرول — با abs برای RTL
       ============================================================ */
    const updateScrollState = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        const max = scrollWidth - clientWidth;
        // در RTL، scrollLeft از 0 به منفی می‌رود (Chrome/Firefox)
        const normalized = Math.abs(scrollLeft);
        setCanScrollPrev(normalized > 4);
        setCanScrollNext(normalized < max - 4);
    }, []);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        updateScrollState();
        el.addEventListener("scroll", updateScrollState, { passive: true });
        window.addEventListener("resize", updateScrollState);
        return () => {
            el.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, [updateScrollState]);

    /* ============================================================
       اسکرول صفحه‌ای — اصلاح‌شده برای RTL
       در RTL: "بعدی" یعنی scrollLeft منفی‌تر → left: -amount
       ============================================================ */
    const scrollByPage = useCallback((dir) => {
        const el = trackRef.current;
        if (!el) return;
        const amount = el.clientWidth - 80;
        el.scrollBy({
            left: dir === "next" ? -amount : amount,
            behavior: "smooth",
        });
    }, []);

    const handlePrev = useCallback(() => scrollByPage("prev"), [scrollByPage]);
    const handleNext = useCallback(() => scrollByPage("next"), [scrollByPage]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "ArrowRight") {
                e.preventDefault();
                handlePrev();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                handleNext();
            }
        },
        [handleNext, handlePrev]
    );

    /* ============================================================
       دکمه‌ها — بدون منطق پیچیده isRTL روی disabled
       ============================================================ */
    const PrevButton = (
        <button
            type="button"
            onClick={handlePrev}
            disabled={!canScrollPrev}
            aria-label="اسلاید قبلی"
            className="
                inline-flex items-center justify-center
                w-9 h-9 sm:w-10 sm:h-10 rounded-xl
                bg-white text-slate-700
                border border-slate-200 shadow-sm
                hover:bg-slate-50 hover:border-slate-300
                active:scale-95
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/30
                transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed
                shrink-0
                cursor-pointer
            "
        >
            <PiCaretRightBold aria-hidden="true" className="w-3.5 h-3.5" />
        </button>
    );

    const NextButton = (
        <button
            type="button"
            onClick={handleNext}
            disabled={!canScrollNext}
            aria-label="اسلاید بعدی"
            className="
                inline-flex items-center justify-center
                w-9 h-9 sm:w-10 sm:h-10 rounded-xl
                bg-white text-slate-700
                border border-slate-200 shadow-sm
                hover:bg-slate-50 hover:border-slate-300
                active:scale-95
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/30
                transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed
                shrink-0
                cursor-pointer
            "
        >
            <PiCaretLeftBold aria-hidden="true" className="w-3.5 h-3.5" />
        </button>
    );

    return (
        <div
            role="region"
            aria-roledescription="carousel"
            aria-label={ariaLabel}
            className="relative"
        >
            {(title || subtitle) && (
                <div className={containerClassName}>
                    <header className="flex items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 flex-wrap">
                        <div className="min-w-0 flex-1">
                            {eyebrow && (
                                <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                                    <span
                                        className="w-5 sm:w-6 h-1 rounded-full bg-gradient-to-l from-[#C6A14C] to-[#A8853A]"
                                        aria-hidden="true"
                                    />
                                    <span className="text-[10px] sm:text-[11px] font-bold text-[#A8853A] tracking-wide">
                                        {eyebrow}
                                    </span>
                                </div>
                            )}
                            {title && (
                                <h2
                                    id={`${ariaLabel}-heading`}
                                    className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-snug"
                                >
                                    {title}
                                </h2>
                            )}
                            {subtitle && (
                                <p className="mt-1 text-slate-500 text-xs md:text-sm max-w-2xl leading-relaxed">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            {headerAction}
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                {PrevButton}
                                {NextButton}
                            </div>
                        </div>
                    </header>
                </div>
            )}

            <div
                ref={trackRef}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                className={`
                    flex ${gapClassName} ${trackPaddingClassName}
                    overflow-x-auto scroll-smooth snap-x snap-mandatory
                    scrollbar-hide
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-[#C6A14C]/40
                    rounded-2xl
                `}
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    scrollPaddingInline: "1rem",
                }}
            >
                {items.map((child, i) => (
                    <div
                        key={i}
                        className={slideClassName}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${i + 1} از ${items.length}`}
                    >
                        {child}
                    </div>
                ))}

                {/* Spacer انتهایی برای اسکرول راحت آخرین کارت */}
                <div className="flex-shrink-0 w-2" aria-hidden="true" />
            </div>
        </div>
    );
}