// components/landing/cards/AdCardOverlay.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
    PiArrowLeft,
    PiStarFill,
    PiMapPin,
    PiClock,
    PiSealCheckFill,
} from "react-icons/pi";

export default function AdCardOverlay({ ad, onClick, width }) {
    const image = ad?.images?.[0] || ad?.image || "/placeholder.jpg";
    const rating = ad?.rating ?? 4.5;
    const reviews = ad?.reviews_count ?? 0;
    const finalPrice = ad?.price ?? 0;
    const originalPrice = ad?.original_price ?? finalPrice;
    const city = ad?.hall_id?.city || ad?.city || "";
    const province = ad?.hall_id?.province || ad?.province || "";
    const sponsor = ad?.sponsor || ad?.hall_id?.title || "";
    const discount =
        originalPrice > finalPrice && originalPrice > 0
            ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
            : 0;
    const expiresIn = ad?.expires_in_days ?? null;

    return (
        <Link
            href={ad.target_url || "#"}
            onClick={onClick}
            style={{ flex: `0 0 calc(${width} - 20px)` }}
            className="group relative block h-[240px] rounded-2xl overflow-hidden ring-1 ring-[var(--color-accent-200)]/40 hover:ring-[var(--color-accent)] hover:shadow-gold-lg hover:-translate-y-1 transition-all duration-500"
        >
            {/* Background image */}
            <Image
                src={image}
                alt={ad.title || "تبلیغ"}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-[900ms] group-hover:scale-110"
            />

            {/* Dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            {/* Top-right: Ad ribbon */}
            <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-md gradient-gold text-[var(--color-primary-dark)] text-[10px] font-extrabold shadow-gold-sm">
                تبلیغ
            </div>

            {/* Top-left: Discount */}
            {discount > 0 && (
                <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--color-error)] text-white text-[10px] font-extrabold shadow-lg">
                    {discount}٪ تخفیف
                </div>
            )}

            {/* Bottom content */}
            <div className="absolute bottom-0 right-0 left-0 p-4 text-white">
                {/* Sponsor + Rating row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                    {sponsor && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[var(--color-accent-200)] font-bold">
                            <PiSealCheckFill className="w-3 h-3" />
                            {sponsor}
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] text-white/90">
                        <PiStarFill className="w-3 h-3 text-[var(--color-accent-300)]" />
                        {Number(rating).toFixed(1)}
                        <span className="text-white/60">({reviews})</span>
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-extrabold line-clamp-2 leading-snug drop-shadow-md mb-2">
                    {ad.title}
                </h3>

                {/* Location + urgency chips */}
                <div className="flex items-center gap-1.5 flex-wrap mb-3">
                    {(province || city) && (
                        <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px]">
                            <PiMapPin className="w-3 h-3 text-[var(--color-accent-300)]" />
                            {[province, city].filter(Boolean).join("، ")}
                        </span>
                    )}
                    {expiresIn && (
                        <span className="inline-flex items-center gap-1 bg-[var(--color-error)]/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] text-[var(--color-accent-100)] font-bold">
                            <PiClock className="w-3 h-3" />
                            فقط تا {expiresIn} روز
                        </span>
                    )}
                </div>

                {/* Divider */}
                <div className="h-px bg-white/20 mb-3" />

                {/* Price + CTA */}
                <div className="flex items-end justify-between gap-3">
                    <div className="flex flex-col">
                        {originalPrice > finalPrice && (
                            <span className="text-[10px] text-white/50 line-through">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-extrabold text-[var(--color-accent-300)] leading-none">
                                {formatPrice(finalPrice)}
                            </span>
                            <span className="text-[9px] text-white/60">
                                تومان/شب
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            onClick?.();
                            if (ad.target_url)
                                window.open(ad.target_url, "_blank");
                        }}
                        className="group/cta inline-flex items-center gap-1.5 h-9 px-4 rounded-xl gradient-gold text-[var(--color-primary-dark)] text-xs font-extrabold shadow-gold-md hover:shadow-glow active:scale-95 transition-all shrink-0"
                    >
                        {ad.cta_text || "همین حالا رزرو کن"}
                        <PiArrowLeft className="w-3.5 h-3.5 group-hover/cta:-translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Gold bottom line on hover */}
            <span className="absolute bottom-0 right-0 left-0 h-0.5 gradient-gold scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500" />
        </Link>
    );
}

function formatPrice(n) {
    if (!n && n !== 0) return "-";
    return Number(n).toLocaleString("fa-IR");
}