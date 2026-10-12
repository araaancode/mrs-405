"use client";

// components/landing/LandingAds.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import {
    PiArrowLeft,
    PiArrowRight,
    PiMapPin,
    PiSpeakerHigh,
} from "react-icons/pi";

/* ============================================================
   Skeleton — هنگام بارگذاری اولیه
   ============================================================ */
function AdsSkeleton() {
    return (
        <section className="w-full bg-slate-950 py-10 sm:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-7 w-40 bg-slate-800 rounded-lg mb-8 animate-pulse" />
                <div className="h-[320px] sm:h-[400px] lg:h-[440px] bg-slate-900 rounded-3xl animate-pulse" />
            </div>
        </section>
    );
}

/* ============================================================
   Empty — اگر تبلیغی نبود، هیچی رندر نکن
   ============================================================ */
function AdsEmpty() {
    return null;
}

/* ============================================================
   اسلاید تکی
   ============================================================ */
function AdSlide({ ad, onTrack }) {
    const hasImage = ad.images?.length > 0;

    const handleClick = useCallback(() => {
        onTrack?.(ad._id, "click");
    }, [ad._id, onTrack]);

    const content = (
        <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[440px] overflow-hidden rounded-3xl">
            {/* Background */}
            {hasImage ? (
                <Image
                    src={ad.images[0]}
                    alt={ad.title || "تبلیغ"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    priority={false}
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/30 via-slate-900 to-slate-950" />
            )}

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-transparent" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-5 sm:p-8 lg:p-12">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/90 text-slate-950 text-[11px] sm:text-xs font-bold backdrop-blur-sm">
                        <PiSpeakerHigh className="w-3.5 h-3.5" />
                        تبلیغ ویژه
                    </span>

                    {ad.hall_id?.city && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] sm:text-xs font-medium backdrop-blur-sm ring-1 ring-white/20">
                            <PiMapPin className="w-3.5 h-3.5" />
                            {ad.hall_id.city}
                            {ad.hall_id.province && `، ${ad.hall_id.province}`}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-white text-xl sm:text-2xl lg:text-4xl font-bold leading-tight mb-2 sm:mb-3 max-w-3xl">
                    {ad.title}
                </h3>

                {/* Description */}
                {ad.description && (
                    <p className="text-white/75 text-sm sm:text-base max-w-2xl line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-5 leading-relaxed">
                        {ad.description}
                    </p>
                )}

                {/* CTA */}
                {ad.target_url && (
                    <div>
                        <span className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-sm sm:text-base transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 hover:gap-3">
                            {ad.cta_text || "مشاهده"}
                            <PiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </span>
                    </div>
                )}
            </div>
        </div>
    );

    if (ad.target_url) {
        const isExternal = /^https?:\/\//.test(ad.target_url);
        return isExternal ? (
            <a
                href={ad.target_url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={handleClick}
                className="block group cursor-pointer"
            >
                {content}
            </a>
        ) : (
            <Link
                href={ad.target_url}
                onClick={handleClick}
                className="block group cursor-pointer"
            >
                {content}
            </Link>
        );
    }

    return <div className="group">{content}</div>;
}

/* ============================================================
   کامپوننت اصلی اسلایدر
   ============================================================ */
export default function LandingAds({
    placement = "home",
    adType = "home_slider",
    limit = 8,
    autoPlayDelay = 5000,
}) {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);

    /* ---------- Embla (بدون plugin autoplay) ---------- */
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        direction: "rtl",
        slidesToScroll: 1,
    });

    /* ---------- Fetch تبلیغات ---------- */
    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const params = new URLSearchParams({
                    placement,
                    type: adType,
                    limit: String(limit),
                });
                const res = await fetch(`/api/ads?${params.toString()}`, {
                    headers: { Accept: "application/json" },
                });
                if (!res.ok) throw new Error("fetch failed");
                const data = await res.json();
                if (!cancelled) {
                    setAds(Array.isArray(data?.ads) ? data.ads : []);
                }
            } catch {
                if (!cancelled) setAds([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [placement, adType, limit]);

    /* ---------- ثبت بازدید اسلاید فعال ---------- */
    useEffect(() => {
        const ad = ads[selectedIndex];
        if (!ad?._id) return;

        fetch(`/api/ads/${ad._id}/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "view" }),
            keepalive: true,
        }).catch(() => {});
    }, [ads, selectedIndex]);

    /* ---------- Embla events ---------- */
    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    /* ---------- Autoplay دستی (بدون پکیج اضافه) ---------- */
    const isHoveringRef = useRef(false);

    useEffect(() => {
        if (!emblaApi || ads.length <= 1) return;

        const timer = setInterval(() => {
            if (!isHoveringRef.current) {
                emblaApi.scrollNext();
            }
        }, autoPlayDelay);

        return () => clearInterval(timer);
    }, [emblaApi, ads.length, autoPlayDelay]);

    /* ---------- Nav ---------- */
    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((i) => emblaApi?.scrollTo(i), [emblaApi]);

    /* ---------- ثبت کلیک ---------- */
    const handleTrack = useCallback((id, type) => {
        fetch(`/api/ads/${id}/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type }),
            keepalive: true,
        }).catch(() => {});
    }, []);

    /* ---------- Render ---------- */
    if (loading) return <AdsSkeleton />;
    if (!ads.length) return <AdsEmpty />;

    const hasMultiple = ads.length > 1;

    return (
        <section className="w-full bg-slate-950 py-10 sm:py-14 relative overflow-hidden">
            {/* Glow پس‌زمینه */}
            <div className="pointer-events-none absolute -top-32 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-5 sm:mb-8">
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold-500" />
                        </span>
                        <h2 className="text-white text-lg sm:text-xl lg:text-2xl font-bold">
                            پیشنهادهای ویژه
                        </h2>
                    </div>

                    {/* Nav buttons */}
                    {hasMultiple && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={scrollPrev}
                                aria-label="قبلی"
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/10 ring-1 ring-white/15 hover:ring-gold-500/50 text-white flex items-center justify-center transition-all duration-300 active:scale-95"
                            >
                                <PiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={scrollNext}
                                aria-label="بعدی"
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/10 ring-1 ring-white/15 hover:ring-gold-500/50 text-white flex items-center justify-center transition-all duration-300 active:scale-95"
                            >
                                <PiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Carousel */}
                <div className="relative">
                    <div
                        ref={emblaRef}
                        className="overflow-hidden rounded-3xl"
                        onMouseEnter={() => {
                            isHoveringRef.current = true;
                        }}
                        onMouseLeave={() => {
                            isHoveringRef.current = false;
                        }}
                    >
                        <div className="flex">
                            {ads.map((ad, i) => (
                                <div
                                    key={ad._id || i}
                                    className="flex-[0_0_100%] min-w-0"
                                >
                                    <AdSlide ad={ad} onTrack={handleTrack} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots */}
                    {hasMultiple && (
                        <div className="flex items-center justify-center gap-2 mt-5">
                            {ads.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => scrollTo(i)}
                                    aria-label={`رفتن به اسلاید ${i + 1}`}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        i === selectedIndex
                                            ? "w-8 bg-gold-500"
                                            : "w-1.5 bg-white/25 hover:bg-white/50"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}