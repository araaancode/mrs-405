'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    FaMapMarkerAlt,
    FaUsers,
    FaStar,
    FaArrowLeft,
    FaBuilding,
    FaHeart,
    FaRegHeart,
    FaElevator,
    FaCar,
    FaTree,
    FaCoffee,
    FaWineBottle,
    FaRestroom,
    FaMicrophone,
    FaSnowflake,
    FaFire,
    FaShieldAlt,
} from 'react-icons/fa';
import { GiKnifeFork } from 'react-icons/gi';
import { MdLocalParking } from 'react-icons/md';

/* ============================================================
   Constants — بیرون از کامپوننت
   ============================================================ */
const FEATURE_ICONS = {
    آسانسور: FaElevator,
    پارکینگ: FaCar,
    نمازخانه: FaRestroom,
    'حیاط بزرگ': FaTree,
    'آب نما': FaSnowflake,
    'پارکینگ رایگان': MdLocalParking,
    'سیستم صوتی': FaMicrophone,
    نورپردازی: FaSnowflake,
    'آشپزخانه مجهز': GiKnifeFork,
    'طراحی لوکس': FaWineBottle,
    'سالن VIP': FaCoffee,
    'خدمات کترینگ': GiKnifeFork,
    'فضای سبز': FaTree,
    آلاچیق: FaTree,
    'سیستم گرمایشی': FaFire,
    'سیستم سرمایشی': FaSnowflake,
    امنیت: FaShieldAlt,
};

const faNumFormatter = new Intl.NumberFormat('fa-IR');
const faNum = (n) => faNumFormatter.format(Number(n) || 0);

const PLACEHOLDER = '/images/placeholder.jpg';

const isRemote = (url) =>
    typeof url === 'string' && /^https?:\/\//i.test(url);

/* ============================================================
   FeatureChip — memoized
   ============================================================ */
const FeatureChip = memo(function FeatureChip({ feature }) {
    const Icon = FEATURE_ICONS[feature] || FaSnowflake;
    return (
        <div className="flex items-center gap-1.5 bg-[#FDF8F0] px-3 py-1.5 rounded-xl border border-[#F0E4D0] transition-all hover:border-[#D4B06A] hover:bg-[#FFFBF5]">
            <Icon className="w-3.5 h-3.5 text-[#C39243]" />
            <span className="text-xs text-[#6B4F2E] font-medium">{feature}</span>
        </div>
    );
});

/* ============================================================
   HallCard — memoized + next/image
   ============================================================ */
const HallCard = memo(function HallCard({ hall, isLiked, onLike, priority = false }) {
    const [imgError, setImgError] = useState(false);

    /* تصویر — یک بار محاسبه */
    const imageSrc = useMemo(() => {
        if (imgError) return PLACEHOLDER;
        const first = hall.images?.[0];
        return first || PLACEHOLDER;
    }, [hall.images, imgError]);

    const remote = isRemote(imageSrc);

    /* محاسبه‌های قیمت — یک بار */
    const priceInfo = useMemo(() => {
        const hasPrice = typeof hall.price === 'number';
        if (!hasPrice) return { display: 'تماس بگیرید', original: null, discounted: false };

        const original = hall.price;
        const hasDiscount = hall.discount && hall.discount > 0;
        const final = hasDiscount
            ? Math.floor(original * (1 - hall.discount / 100))
            : original;

        return {
            display: faNum(final),
            original: hasDiscount ? faNum(original) : null,
            discounted: !!hasDiscount,
        };
    }, [hall.price, hall.discount]);

    /* برش توضیحات امن (بدون برش وسط کلمه) */
    const shortDescription = useMemo(() => {
        const text = hall.description;
        if (!text) return 'سالنی لوکس و مجهز با دکوراسیون مدرن و خدمات عالی';
        if (text.length <= 85) return text;
        const truncated = text.slice(0, 85);
        const lastSpace = truncated.lastIndexOf(' ');
        return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...';
    }, [hall.description]);

    /* features — یک بار برش */
    const visibleFeatures = useMemo(
        () => (Array.isArray(hall.features) ? hall.features.slice(0, 4) : []),
        [hall.features]
    );
    const extraFeaturesCount = hall.features?.length > 4
        ? hall.features.length - 4
        : 0;

    /* handler پایدار */
    const handleLike = useCallback(() => onLike?.(hall._id), [onLike, hall._id]);

    return (
        <div className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-400 overflow-hidden [will-change:transform] hover:-translate-y-2">
            {/* ==================== تصویر ==================== */}
            <div className="relative h-72 overflow-hidden bg-[#E8DCC8]">
                <Image
                    src={imageSrc}
                    alt={hall.name || 'تالار'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={75}
                    priority={priority}
                    loading={priority ? 'eager' : 'lazy'}
                    unoptimized={!remote}
                    onError={() => setImgError(true)}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Like */}
                <button
                    onClick={handleLike}
                    className="absolute top-5 left-5 z-10 p-2.5 bg-white/15 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label={isLiked ? 'حذف از علاقه‌مندی' : 'افزودن به علاقه‌مندی'}
                >
                    {isLiked ? (
                        <FaHeart className="w-5 h-5 text-red-500 drop-shadow-sm" />
                    ) : (
                        <FaRegHeart className="w-5 h-5 text-white drop-shadow-sm" />
                    )}
                </button>

                {/* Badge ویژه */}
                {hall.isSpecial && (
                    <div className="absolute top-5 right-5 z-10">
                        <div className="bg-gradient-to-r from-[#D4B06A] to-[#C39243] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md tracking-wide">
                            ویژه
                        </div>
                    </div>
                )}

                {/* عنوان و لوکیشن */}
                <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="text-xl font-bold text-white mb-1.5 drop-shadow-md">
                        {hall.name}
                    </h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                        <FaMapMarkerAlt className="w-3.5 h-3.5" />
                        <span>{hall.location}</span>
                    </div>
                </div>
            </div>

            {/* ==================== محتوا ==================== */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2 bg-[#FDF8F0] px-3.5 py-2 rounded-2xl border border-[#F0E4D0]">
                        <FaStar className="w-4 h-4 text-[#D4B06A]" />
                        <span className="text-sm font-semibold text-[#4A3520]">
                            {hall.rating || 4.8}
                        </span>
                        <span className="text-xs text-[#8B7355]">
                            ({hall.reviews || 124} نظر)
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#FDF8F0] px-3.5 py-2 rounded-2xl border border-[#F0E4D0]">
                        <FaUsers className="w-4 h-4 text-[#C39243]" />
                        <span className="text-sm font-medium text-[#4A3520]">
                            تا {faNum(hall.capacity)} نفر
                        </span>
                    </div>
                </div>

                {visibleFeatures.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                        {visibleFeatures.map((feature, idx) => (
                            <FeatureChip key={`${feature}-${idx}`} feature={feature} />
                        ))}
                        {extraFeaturesCount > 0 && (
                            <div className="flex items-center bg-[#FDF8F0] px-3 py-1.5 rounded-xl border border-[#F0E4D0]">
                                <span className="text-xs text-[#8B7355] font-medium">
                                    +{extraFeaturesCount} بیشتر
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <p className="text-[#6B5B4B] text-sm leading-relaxed line-clamp-2 mb-5">
                    {shortDescription}
                </p>

                {/* قیمت و CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-[#F0E4D0]">
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                            <span
                                className={`text-2xl font-bold ${
                                    priceInfo.discounted ? 'text-[#C0392B]' : 'text-[#C39243]'
                                }`}
                            >
                                {priceInfo.display}
                            </span>
                            {priceInfo.display !== 'تماس بگیرید' && (
                                <span className="text-xs text-[#8B7355]">تومان</span>
                            )}
                        </div>
                        {priceInfo.original && (
                            <span className="text-xs text-[#A08B70] line-through">
                                {priceInfo.original} تومان
                            </span>
                        )}
                    </div>

                    <Link
                        href={`/halls/${hall._id}`}
                        prefetch={false}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#D4B06A] to-[#C39243] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:opacity-90 transition-all duration-300 active:scale-95"
                    >
                        مشاهده جزئیات
                    </Link>
                </div>
            </div>
        </div>
    );
});

/* ============================================================
   HallsSection
   ============================================================ */
export default function HallsSection({ halls = [], onLike, likedHalls = new Set() }) {
    const handleLike = useCallback((id) => onLike?.(id), [onLike]);

    return (
        <section className="py-20 bg-gradient-to-br from-[#FFF8F0] to-[#FDF5E6]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-20 h-px bg-gradient-to-r from-transparent to-[#D4B06A]" />
                        <div className="bg-gradient-to-br from-[#D4B06A] to-[#C39243] p-3 rounded-2xl shadow-lg">
                            <FaBuilding className="w-7 h-7 text-white" />
                        </div>
                        <div className="w-20 h-px bg-gradient-to-l from-transparent to-[#D4B06A]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#4A3520] mb-3 tracking-tight">
                        تالارهای لوکس
                    </h2>
                    <p className="text-[#8B7355] text-base md:text-lg max-w-2xl mx-auto">
                        منتخب برترین تالارهای کشور با امکانات لوکس و خدمات اختصاصی
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {halls.map((hall, index) => (
                        <HallCard
                            key={hall._id}
                            hall={hall}
                            isLiked={likedHalls.has(hall._id)}
                            onLike={handleLike}
                            priority={index < 3}
                        />
                    ))}
                </div>

                {/* View All */}
                <div className="text-center mt-14">
                    <Link
                        href="/halls"
                        prefetch={false}
                        className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#D4B06A] text-[#C39243] rounded-2xl font-bold hover:bg-[#D4B06A] hover:text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group"
                    >
                        مشاهده تمام تالارها
                        <FaArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}