// components/landing/PopularCities.jsx
"use client";

import { memo, useState } from "react";
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
    PiSunFill,
    PiLeafFill,
    PiSparkleFill,
    PiFlowerLotusFill,
    PiCastleTurretFill,
    PiCloudFill,
    PiSnowflakeFill,
    PiAnchorFill,
    PiFireFill,
    PiCompassFill,
    PiArrowLeft,
} from "react-icons/pi";

import Carousel from "../../components/landing/Carousel";

/* ============================================================
   Cities Data
   ============================================================ */
const POPULAR_CITIES = [
    { id: 1,  name: "تهران",      slug: "tehran",    propertyCount: 1247, image: "/images/landing/cities/tehran.png",    iconName: "PiBuildingsFill",    rating: 4.8 },
    { id: 2,  name: "اصفهان",     slug: "isfahan",   propertyCount: 892,  image: "/images/landing/cities/isfahan.png",   iconName: "PiCrownSimpleFill",  rating: 4.9 },
    { id: 3,  name: "شیراز",      slug: "shiraz",    propertyCount: 756,  image: "/images/landing/cities/shiraz.jpg",   iconName: "PiStarFill",         rating: 4.7 },
    { id: 4,  name: "مشهد",       slug: "mashhad",   propertyCount: 1123, image: "/images/landing/cities/mashhad.jpg", iconName: "PiFlagBannerFill",   rating: 4.9 },
    { id: 5,  name: "تبریز",      slug: "tabriz",    propertyCount: 634,  image: "/images/landing/cities/tabriz.jpg",    iconName: "PiMountainsFill",    rating: 4.6 },
    { id: 6,  name: "کیش",        slug: "kish",      propertyCount: 445,  image: "/images/landing/cities/kish.png",      iconName: "PiDropFill",         rating: 4.8 },
    { id: 7,  name: "رشت",        slug: "rasht",     propertyCount: 523,  image: "/images/landing/cities/rasht.png",     iconName: "PiTreeFill",         rating: 4.7 },
    { id: 8,  name: "کرمان",      slug: "kerman",    propertyCount: 389,  image: "/images/landing/cities/kerman.jpg",   iconName: "PiMountainsFill",    rating: 4.5 },
    { id: 9,  name: "کاشان",      slug: "kashan",    propertyCount: 356,  image: "/images/landing/cities/kashan.png",    iconName: "PiFlowerLotusFill",  rating: 4.8 },
    { id: 10, name: "رامسر",      slug: "ramsar",    propertyCount: 234,  image: "/images/landing/cities/ramsar.png",    iconName: "PiDropFill",         rating: 4.8 },
    { id: 11, name: "بندر انزلی", slug: "anzali",    propertyCount: 201,  image: "/images/landing/cities/anzali.png",    iconName: "PiAnchorFill",       rating: 4.6 },
    { id: 12, name: "قشم",        slug: "qeshm",     propertyCount: 312,  image: "/images/landing/cities/gheshm.png",    iconName: "PiAnchorFill",       rating: 4.7 },
    { id: 13, name: "اهواز",      slug: "ahvaz",     propertyCount: 356,  image: "/images/landing/cities/ahvaz.png",     iconName: "PiFireFill",         rating: 4.4 },
    { id: 14, name: "بابل",       slug: "babol",     propertyCount: 287,  image: "/images/landing/cities/babol.png",     iconName: "PiTreeFill",         rating: 4.6 },
    { id: 15, name: "چالوس",      slug: "chalus",    propertyCount: 234,  image: "/images/landing/cities/chalos.png",    iconName: "PiCloudFill",        rating: 4.7 },
    { id: 16, name: "کرج",        slug: "karaj",     propertyCount: 543,  image: "/images/landing/cities/karaj.png",     iconName: "PiBuildingsFill",    rating: 4.4 },
    { id: 17, name: "سوادکوه",    slug: "savadkoh",  propertyCount: 156,  image: "/images/landing/cities/savadkoh.png",  iconName: "PiMountainsFill",    rating: 4.9 },
];

/* ============================================================
   Icon Map
   ============================================================ */
const ICON_MAP = {
    PiBuildingsFill, PiCrownSimpleFill, PiStarFill, PiFlagBannerFill,
    PiMountainsFill, PiDropFill, PiTreeFill, PiSunFill, PiLeafFill,
    PiSparkleFill, PiFlowerLotusFill, PiCastleTurretFill, PiCloudFill,
    PiSnowflakeFill, PiAnchorFill, PiFireFill, PiCompassFill,
};

/* ============================================================
   Formatters
   ============================================================ */
const faNumFormatter = new Intl.NumberFormat("fa-IR");
const faNum = (n) => faNumFormatter.format(Number(n) || 0);

/* ============================================================
   CityCard — بهینه‌شده برای موبایل
   ============================================================ */
const CityCard = memo(function CityCard({ city, index }) {
    const IconComponent = ICON_MAP[city.iconName];
    const isPriority = index < 4;
    const [imgError, setImgError] = useState(false);

    return (
        <Link
            href={`/halls/city/${city.slug}`}
            aria-label={`مشاهده ${faNum(city.propertyCount)} تالار در ${city.name}`}
            className="
                group relative block
                w-full h-full
                rounded-2xl
                overflow-hidden
                shadow-md hover:shadow-2xl
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40
                transition-all duration-300
                cursor-pointer
                motion-reduce:transition-none
            "
        >
            {/* تصویر پس‌زمینه */}
            {!imgError ? (
                <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    sizes="
                        (max-width: 479px) 200px,
                        (max-width: 639px) 200px,
                        (max-width: 767px) 200px,
                        (max-width: 1023px) 220px,
                        (max-width: 1279px) 240px,
                        260px
                    "
                    quality={75}
                    priority={isPriority}
                    loading={isPriority ? "eager" : "lazy"}
                    onError={() => setImgError(true)}
                    className="
                        object-cover
                        transition-transform duration-700 ease-out
                        group-hover:scale-105
                        motion-reduce:transition-none motion-reduce:group-hover:scale-100
                    "
                />
            ) : (
                <div
                    className="absolute inset-0 bg-gradient-to-br from-[#C6A14C] via-[#A8853A] to-[#85672C]"
                    aria-hidden="true"
                >
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2) 0%, transparent 40%)",
                        }}
                        aria-hidden="true"
                    />
                </div>
            )}

            {/* گرادیانت تیره — قوی‌تر در موبایل */}
            <div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                aria-hidden="true"
            />

            {/* بج امتیاز — بالا راست */}
            <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 inline-flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1">
                <PiStarFill
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E0C67B]"
                    aria-hidden="true"
                />
                <span className="text-[11px] sm:text-xs font-bold text-white">
                    {faNum(city.rating)}
                </span>
            </div>

            {/* محتوا */}
            <div className="absolute bottom-0 right-0 left-0 p-3 sm:p-3.5 flex flex-col justify-end text-white">
                {/* نام شهر + آیکون */}
                <div className="flex items-center gap-1.5 mb-1">
                    {IconComponent && (
                        <IconComponent
                            className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#C6A14C] drop-shadow-md shrink-0"
                            aria-hidden="true"
                        />
                    )}
                    <h3 className="text-sm sm:text-base text-white font-extrabold drop-shadow-md truncate">
                        {city.name}
                    </h3>
                </div>

                {/* تعداد تالار */}
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-white/90">
                    <PiMapPinFill
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-[#C6A14C]"
                        aria-hidden="true"
                    />
                    <span className="truncate font-medium">
                        {faNum(city.propertyCount)} تالار
                    </span>
                </div>
            </div>

            {/* Overlay hover — فقط دسکتاپ */}
            <div
                className="
                    hidden sm:flex
                    absolute inset-0 bg-black/0 group-hover:bg-black/20
                    items-center justify-center
                    opacity-0 group-hover:opacity-100
                    transition-all duration-300
                    motion-reduce:transition-none
                "
                aria-hidden="true"
            >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-[#2A1F1F] text-xs font-bold shadow-lg">
                    مشاهده تالارها
                    <PiArrowLeft className="w-3.5 h-3.5" />
                </span>
            </div>
        </Link>
    );
});

/* ============================================================
   PopularCities — بهینه‌شده برای موبایل
   ============================================================ */
export default function PopularCities() {
    return (
        <section
            aria-labelledby="popular-cities-heading"
            className="py-8 sm:py-10 md:py-14"
        >
            <Carousel
                ariaLabel="popular-cities"
                eyebrow="مقاصد محبوب"
                title="محبوب‌ترین شهرهای ایران"
                subtitle="تالارهای ویژه در بهترین مقاصد برگزاری مراسم ایران"
                slideClassName="city-slide shrink-0 snap-start"
                gapClassName="gap-3 sm:gap-3.5 md:gap-4"
                containerClassName="max-w-7xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8"
                trackPaddingClassName="px-4 sm:px-4 md:px-6 lg:px-8"
                headerAction={
                    <Link
                        href="/halls"
                        prefetch={false}
                        className="
                            hidden md:inline-flex items-center gap-1.5
                            h-10 px-4 rounded-2xl
                            bg-white text-slate-700
                            text-xs font-bold
                            shadow-[0_2px_8px_-2px_rgba(15,23,42,0.1)]
                            hover:bg-[#C6A14C] hover:text-white
                            hover:shadow-[0_8px_20px_-4px_rgba(198,161,76,0.35)]
                            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40
                            transition-all duration-300
                        "
                    >
                        <span>مشاهده همه</span>
                        <PiArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                }
            >
                {POPULAR_CITIES.map((city, index) => (
                    <CityCard key={city.id} city={city} index={index} />
                ))}
            </Carousel>

            {/* ==================== دکمه موبایل: مشاهده همه ==================== */}
            <div className="flex justify-center mt-5 md:hidden px-4">
                <Link
                    href="/halls"
                    prefetch={false}
                    className="
                        inline-flex items-center gap-1.5
                        h-11 px-5 rounded-xl
                        bg-white text-slate-700
                        text-xs font-bold
                        ring-1 ring-slate-200
                        shadow-[0_2px_8px_-2px_rgba(15,23,42,0.1)]
                        hover:bg-[#C6A14C] hover:text-white hover:ring-[#C6A14C]
                        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40
                        transition-all duration-300
                        w-full max-w-xs justify-center
                    "
                >
                    <span>مشاهده همه شهرها</span>
                    <PiArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
            </div>
        </section>
    );
}