// components/landing/cards/AdCardNumber.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
    PiArrowLeft,
    PiStarFill,
    PiSealCheckFill,
} from "react-icons/pi";

export default function AdCardNumber({ ad, onClick, width, index = 0 }) {
    const image = ad?.images?.[0] || ad?.image || "/placeholder.jpg";
    const rating = ad?.rating ?? 4.5;
    const finalPrice = ad?.price ?? 0;
    const originalPrice = ad?.original_price ?? finalPrice;
    const sponsor = ad?.sponsor || ad?.hall_id?.title || "";
    const discount =
        originalPrice > finalPrice && originalPrice > 0
            ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
            : 0;

    return (
        <Link
            href={ad.target_url || "#"}
            onClick={onClick}
            style={{ flex: `0 0 calc(${width} - 20px)` }}
            className="group relative flex flex-row h-[220px] bg-white rounded-2xl overflow-hidden ring-1 ring-[var(--color-accent-100)] hover:ring-[var(--color-accent)] hover:shadow-gold-lg hover:-translate-y-1 transition-all duration-500"
        >
            {/* Gold Top Bar */}
            <span className="absolute top-0 right-0 left-0 h-1 gradient-gold z-10" />

            {/* Image (right) */}
            <div className="relative shrink-0 w-[40%] bg-[var(--color-accent-50)] overflow-hidden">
                <Image
                    src={image}
                    alt={ad.title || "تبلیغ"}
                    fill
                    sizes="40vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />

                {/* Discount */}
                {discount > 0 && (
                    <div className="absolute top-3 left-3 flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-error)] text-white shadow-lg ring-4 ring-white/90 group-hover:scale-110 transition-transform">
                        <span className="text-sm font-extrabold leading-none">
                            {discount}٪
                        </span>
                    </div>
                )}
            </div>

            {/* Content (left) */}
            <div className="flex flex-col flex-1 p-4 min-w-0">
                {/* Huge number background */}
                <span className="absolute right-[42%] top-1/2 -translate-y-1/2 text-[120px] font-black text-[var(--color-accent-50)] leading-none select-none pointer-events-none z-0">
                    {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative z-10 flex flex-col flex-1 min-w-0">
                    {/* Top: sponsor + rating */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                        {sponsor ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-[var(--color-accent-700)] font-bold">
                                <PiSealCheckFill className="w-3 h-3" />
                                <span className="line-clamp-1 max-w-[100px]">
                                    {sponsor}
                                </span>
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-[var(--color-accent-700)] font-bold">
                                <PiStarFill className="w-3 h-3 text-[var(--color-accent)]" />
                                {Number(rating).toFixed(1)}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
                            <PiStarFill className="w-3 h-3 text-[var(--color-accent)]" />
                            {Number(rating).toFixed(1)}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-extrabold text-[var(--color-primary)] line-clamp-2 leading-snug group-hover:text-[var(--color-accent-700)] transition-colors">
                        {ad.title}
                    </h3>

                    {ad.description && (
                        <p className="text-[11px] text-[var(--color-text-muted)] line-clamp-2 mt-1.5 leading-relaxed">
                            {ad.description}
                        </p>
                    )}

                    {/* Bottom */}
                    <div className="mt-auto pt-3 border-t border-dashed border-[var(--color-accent-200)] flex items-end justify-between gap-3">
                        <div className="flex flex-col">
                            {originalPrice > finalPrice && (
                                <span className="text-[10px] text-[var(--color-text-muted)] line-through">
                                    {formatPrice(originalPrice)}
                                </span>
                            )}
                            <span className="text-lg font-extrabold text-[var(--color-accent-700)] leading-none">
                                {formatPrice(finalPrice)}
                                <span className="text-[9px] text-[var(--color-text-muted)] font-medium mr-1">
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
                            className="group/cta btn btn-primary !h-9 !py-0 !px-3 !rounded-lg !text-xs overflow-hidden shrink-0 relative"
                        >
                            <span className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                            <span className="relative inline-flex items-center gap-1.5">
                                رزرو
                                <PiArrowLeft className="w-3.5 h-3.5 group-hover/cta:-translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function formatPrice(n) {
    if (!n && n !== 0) return "-";
    return Number(n).toLocaleString("fa-IR");
}