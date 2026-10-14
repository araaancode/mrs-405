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

    const updateScrollState = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        const max = scrollWidth - clientWidth;
        const normalized = isRTL ? Math.abs(scrollLeft) : scrollLeft;
        setCanScrollPrev(normalized > 4);
        setCanScrollNext(normalized < max - 4);
    }, [isRTL]);

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

    const scrollByPage = useCallback((dir) => {
        const el = trackRef.current;
        if (!el) return;
        const amount = el.clientWidth - 80;
        el.scrollBy({
            left: dir === "next" ? -amount : amount,
            behavior: "smooth",
        });
    }, []);

    const handlePrev = useCallback(
        () => scrollByPage(isRTL ? "next" : "prev"),
        [isRTL, scrollByPage]
    );
    const handleNext = useCallback(
        () => scrollByPage(isRTL ? "prev" : "next"),
        [isRTL, scrollByPage]
    );

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "ArrowRight") {
                e.preventDefault();
                isRTL ? handlePrev() : handleNext();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                isRTL ? handleNext() : handlePrev();
            }
        },
        [handleNext, handlePrev, isRTL]
    );

    const PrevButton = (
        <button
            type="button"
            onClick={handlePrev}
            disabled={isRTL ? !canScrollNext : !canScrollPrev}
            aria-label="اسلاید قبلی"
            className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold-500/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
            <PiCaretRightBold aria-hidden="true" className="w-3.5 h-3.5" />
        </button>
    );

    const NextButton = (
        <button
            type="button"
            onClick={handleNext}
            disabled={isRTL ? !canScrollPrev : !canScrollNext}
            aria-label="اسلاید بعدی"
            className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold-500/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
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
                    <header className="flex items-start justify-between gap-4 mb-5 sm:mb-6">
                        <div className="min-w-0">
                            {eyebrow && (
                                <span className="inline-block mb-1.5 text-[11px] sm:text-xs font-bold tracking-wider text-gold-700">
                                    {eyebrow}
                                </span>
                            )}
                            {title && (
                                <h2
                                    id={`${ariaLabel}-heading`}
                                    className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-snug"
                                >
                                    {title}
                                </h2>
                            )}
                            {subtitle && (
                                <p className="mt-1.5 text-slate-500 text-xs sm:text-sm max-w-2xl leading-relaxed">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            {headerAction}
                            <div className="flex items-center gap-2">
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
                className={`flex ${gapClassName} ${trackPaddingClassName} overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide focus-visible:outline-none`}
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
            </div>
        </div>
    );
}