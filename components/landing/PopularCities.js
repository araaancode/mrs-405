// components/landing/PopularCities.jsx
"use client";

import { useState, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    PiMapPinFill,
    PiStarFill,
    PiBuildingsFill,
    PiCrownSimpleFill,
    PiFlagBannerFill,
    PiMountainsFill,
    PiDropFill,
    PiTreeFill,
    PiArrowLeft,
} from "react-icons/pi";

/* ============================================================
   Cities Data
   ============================================================ */
const POPULAR_CITIES = [
    {
        id: 1,
        name: "تهران",
        slug: "tehran",
        province: "تهران",
        propertyCount: 1247,
        image: "/images/landing/cities/tehran.png",
        iconName: "PiBuildingsFill",
        description: "پایتخت پرجنب‌وجوش ایران",
        rating: 4.8,
    },
    {
        id: 2,
        name: "اصفهان",
        slug: "isfahan",
        province: "اصفهان",
        propertyCount: 892,
        image: "/images/landing/cities/isfahan.png",
        iconName: "PiCrownSimpleFill",
        description: "نصف جهان",
        rating: 4.9,
    },
    {
        id: 3,
        name: "شیراز",
        slug: "shiraz",
        province: "فارس",
        propertyCount: 756,
        image: "/images/landing/cities/shiraz.jpeg",
        iconName: "PiStarFill",
        description: "شهر شعر و گل",
        rating: 4.7,
    },
    {
        id: 4,
        name: "مشهد",
        slug: "mashhad",
        province: "خراسان رضوی",
        propertyCount: 1123,
        image: "/images/landing/cities/mashhad2.jpeg",
        iconName: "PiFlagBannerFill",
        description: "شهر امام رضا (ع)",
        rating: 4.9,
    },
    {
        id: 5,
        name: "تبریز",
        slug: "tabriz",
        province: "آذربایجان شرقی",
        propertyCount: 634,
        image: "/images/landing/cities/tabriz.jpg",
        iconName: "PiMountainsFill",
        description: "شهر اولین‌ها",
        rating: 4.6,
    },
    {
        id: 6,
        name: "کیش",
        slug: "kish",
        province: "هرمزگان",
        propertyCount: 445,
        image: "/images/landing/cities/kish.png",
        iconName: "PiDropFill",
        description: "مروارید خلیج فارس",
        rating: 4.8,
    },
    {
        id: 7,
        name: "رشت",
        slug: "rasht",
        province: "گیلان",
        propertyCount: 523,
        image: "/images/landing/cities/rasht.png",
        iconName: "PiTreeFill",
        description: "شهر باران",
        rating: 4.7,
    },
    {
        id: 8,
        name: "کرمان",
        slug: "kerman",
        province: "کرمان",
        propertyCount: 389,
        image: "/images/landing/cities/kerman.jpeg",
        iconName: "PiMountainsFill",
        description: "کویر و تاریخ",
        rating: 4.5,
    },
];

/* ============================================================
   Icon Map
   ============================================================ */
const ICON_MAP = {
    PiBuildingsFill,
    PiCrownSimpleFill,
    PiStarFill,
    PiFlagBannerFill,
    PiMountainsFill,
    PiDropFill,
    PiTreeFill,
};

/* ============================================================
   Formatters — یک بار در ماژول
   ============================================================ */
const faNumFormatter = new Intl.NumberFormat("fa-IR");
const faNum = (n) => faNumFormatter.format(Number(n) || 0);

/* ============================================================
   CityCard — memoized، isHovered داخلی
   ============================================================ */
const CityCard = memo(function CityCard({ city, index }) {
    const [isHovered, setIsHovered] = useState(false);

    const IconComponent = ICON_MAP[city.iconName];
    const priority = index < 4;

    const handleEnter = useCallback(() => setIsHovered(true), []);
    const handleLeave = useCallback(() => setIsHovered(false), []);

    return (
        <div
            className="group relative"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            <Link href={`/halls/city/${city.slug}`} prefetch={false}>
                <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden ring-1 ring-slate-100 shadow-md hover:shadow-xl hover:shadow-slate-900/20 transition-shadow duration-300 cursor-pointer">
                    {/* تصویر */}
                    <Image
                        src={city.image}
                        alt={city.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        quality={75}
                        priority={priority}
                        loading={priority ? "eager" : "lazy"}
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* گرادیانت تیره */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-900/10" />

                    {/* درخشش طلایی */}
                    <div
                        className={`absolute inset-0 z-10 bg-gradient-to-t from-gold-500/30 via-transparent to-transparent transition-opacity duration-300 ${
                            isHovered ? "opacity-100" : "opacity-0"
                        }`}
                    />

                    {/* اطلاعات */}
                    <div
                        className={`absolute inset-0 z-20 p-5 flex flex-col justify-end transition-colors duration-300 ${
                            isHovered ? "bg-slate-950/30" : ""
                        }`}
                    >
                        {/* نام + آیکون */}
                        <div className="flex items-center gap-2 mb-1">
                            {IconComponent && (
                                <IconComponent className="w-5 h-5 text-gold-400 drop-shadow-md" />
                            )}
                            <h3 className="text-xl font-bold text-white drop-shadow-lg">
                                {city.name}
                            </h3>
                        </div>

                        {/* امتیاز */}
                        <div className="flex items-center gap-1.5 mb-1">
                            <PiStarFill className="w-3.5 h-3.5 text-amber-400 drop-shadow" />
                            <span className="text-white/90 text-[12px] font-medium">
                                {faNum(city.rating)}
                            </span>
                        </div>

                        {/* اطلاعات در hover */}
                        <div
                            className={`overflow-hidden transition-[max-height,opacity,margin] duration-300 ${
                                isHovered
                                    ? "max-h-40 opacity-100 mt-2"
                                    : "max-h-0 opacity-0"
                            }`}
                        >
                            <p className="text-white/90 text-[13px] mb-3 drop-shadow-md leading-relaxed">
                                {city.description}
                            </p>

                            <div className="flex items-center justify-between mb-3">
                                <span className="text-white/80 text-[11px] flex items-center gap-1">
                                    <PiMapPinFill className="w-3 h-3" />
                                    {city.province}
                                </span>

                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-500/90 text-white text-[11px] font-bold">
                                    {faNum(city.propertyCount)} تالار
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-white/20">
                                <span className="text-[12.5px] text-white/90 font-medium">
                                    مشاهده تالارها
                                </span>
                                <div className="w-8 h-8 rounded-full bg-gold-500 hover:bg-gold-600 flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-110">
                                    <PiArrowLeft
                                        className="w-4 h-4 text-white"
                                        strokeWidth={2.5}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
});

/* ============================================================
   PopularCities
   ============================================================ */
export default function PopularCities() {
    return (
        <section className="py-12 sm:py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                        محبوب‌ترین{" "}
                        <span className="bg-gradient-to-l from-gold-500 to-gold-700 bg-clip-text text-transparent">
                            شهرهای ایران
                        </span>
                    </h2>

                    <div className="w-20 h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mx-auto mb-4" />

                    <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto px-4 leading-relaxed">
                        تالارهای ویژه در بهترین مقاصد برگزاری مراسم ایران
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                    {POPULAR_CITIES.map((city, index) => (
                        <CityCard key={city.id} city={city} index={index} />
                    ))}
                </div>

                {/* View All */}
                <div className="text-center mt-10 sm:mt-12">
                    <Link
                        href="/halls"
                        prefetch={false}
                        className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl text-sm font-bold text-gold-700 bg-white border-2 border-gold-400 hover:bg-gradient-to-b hover:from-gold-400 hover:to-gold-600 hover:text-white hover:border-transparent shadow-md hover:shadow-lg hover:shadow-gold-500/30 hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gold-500/20 transition-all duration-300"
                    >
                        <span>مشاهده همه تالارها</span>
                        <PiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>
            </div>
        </section>
    );
}