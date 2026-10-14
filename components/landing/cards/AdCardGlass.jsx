// components/landing/cards/AdCardGlass.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
    PiArrowLeft,
    PiStarFill,
    PiSparkleFill,
} from "react-icons/pi";

export default function AdCardGlass({ ad, onClick, width }) {
    const image = ad?.images?.[0] || ad?.image || "/placeholder.jpg";
    const rating = ad?.rating ?? 4.5;
    const originalPrice = ad?.original_price ?? ad?.price ?? 0;
    const finalPrice = ad?.price ?? ad?.final_price ?? 0;
    const discount =
        originalPrice > finalPrice && originalPrice > 0
            ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
            : 0;

    return (
        <Link
            href={ad.target_url || "#"}
            onClick={onClick}
            style={{ flex: `0 0 calc(${width} - 20px)` }}
            className="group relative flex flex-row h-[210px] rounded-2xl overflow-hidden bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:bg-white/[0.07] hover:border-[var(--color-accent)]/40 hover:shadow-gold-lg hover:-translate-y-1 transition-all duration-500"
        >
            {/* Inner gold glow on hover */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-l from-[var(--color-accent)]/[0.08] via-transparent to-transparent pointer-events-none" />

            {/* Image (right side) */}
            <div className="relative shrink-0 w-[42%] bg-[var(--color-accent-900)]/30 overflow-hidden">
                <Image
                    src={image}
                    alt={ad.title || "تبلیغ"}
                    fill
                    sizes="(max-width: 1024px) 45vw, 25vw"
                    className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/40" />

                {/* Discount ring */}
                {discount > 0 && (
                    <div className="absolute top-3 left-3 w-12 h-12 rounded-full flex flex-col items-center justify-center border-2 border-white/90 bg-black/40 backdrop-blur text-white group-hover:scale-110 transition-transform">
                        <span className="text-sm font-extrabold leading-none">
                            {discount}٪
                        </span>
                        <span className="text-[8px] font-bold mt-0.5 opacity-80">
                            تخفیف
                        </span>
                    </div>
                )}
            </div>

            {/* Content (left side) */}
            <div className="flex flex-col flex-1 p-4 min-w-0 text-white">
                {/* Top row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] text-[var(--color-accent-300)] font-bold">
                        <PiSparkleFill className="w-3 h-3" />
                        پیشنهاد ویژه
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-white/60">
                        <PiStarFill className="w-3 h-3 text-[var(--color-accent-300)]" />
                        {Number(rating).toFixed(1)}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-extrabold line-clamp-2 leading-snug group-hover:text-[var(--color-accent-200)] transition-colors">
                    {ad.title}
                </h3>

                {ad.description && (
                    <p className="text-[11px] text-white/50 line-clamp-2 mt-1.5 leading-relaxed">
                        {ad.description}
                    </p>
                )}

                {/* Bottom row */}
                <div className="mt-auto pt-3 flex items-end justify-between gap-3 border-t border-white/10">
                    <div className="flex flex-col">
                        {originalPrice > finalPrice && originalPrice > 0 && (
                            <span className="text-[10px] text-white/40 line-through">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                        <span className="text-base font-extrabold text-[var(--color-accent-300)] leading-none">
                            {formatPrice(finalPrice)}
                            <span className="text-[9px] text-white/40 font-medium mr-1">
                                تومان/شب
                            </span>
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            onClick?.();
                            if (ad.target_url)
                                window.open(ad.target_url, "_blank");
                        }}
                        className="group/cta inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary-dark)] text-xs font-extrabold hover:bg-[var(--color-accent-300)] hover:shadow-glow active:scale-95 transition-all shrink-0"
                    >
                        {ad.cta_text || "رزرو"}
                        <PiArrowLeft className="w-3.5 h-3.5 group-hover/cta:-translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </Link>
    );
}

function formatPrice(n) {
    if (!n && n !== 0) return "-";
    return Number(n).toLocaleString("fa-IR");
}