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
   Cities Data — فقط شهرهایی که تصویرشان موجود است
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
    {
        id: 9,
        name: "کاشان",
        slug: "kashan",
        province: "اصفهان",
        propertyCount: 356,
        image: "/images/landing/cities/kashan.png",
        iconName: "PiFlowerLotusFill",
        description: "شهر گل و گلاب",
        rating: 4.8,
    },
    {
        id: 10,
        name: "رامسر",
        slug: "ramsar",
        province: "مازندران",
        propertyCount: 234,
        image: "/images/landing/cities/ramsar.png",
        iconName: "PiDropFill",
        description: "عروس شهرهای ایران",
        rating: 4.8,
    },
    {
        id: 11,
        name: "بندر انزلی",
        slug: "anzali",
        province: "گیلان",
        propertyCount: 201,
        image: "/images/landing/cities/anzali.png",
        iconName: "PiAnchorFill",
        description: "شهر تالاب‌ها",
        rating: 4.6,
    },
    {
        id: 12,
        name: "قشم",
        slug: "qeshm",
        province: "هرمزگان",
        propertyCount: 312,
        image: "/images/landing/cities/gheshm.png",
        iconName: "PiAnchorFill",
        description: "بزرگ‌ترین جزیره خلیج فارس",
        rating: 4.7,
    },
    {
        id: 13,
        name: "اهواز",
        slug: "ahvaz",
        province: "خوزستان",
        propertyCount: 356,
        image: "/images/landing/cities/ahvaz.png",
        iconName: "PiFireFill",
        description: "شهر کارون",
        rating: 4.4,
    },
    {
        id: 14,
        name: "بابل",
        slug: "babol",
        province: "مازندران",
        propertyCount: 287,
        image: "/images/landing/cities/babol.png",
        iconName: "PiTreeFill",
        description: "شهر بهارنارنج",
        rating: 4.6,
    },
    {
        id: 15,
        name: "چالوس",
        slug: "chalus",
        province: "مازندران",
        propertyCount: 234,
        image: "/images/landing/cities/chalos.png",
        iconName: "PiCloudFill",
        description: "شهر جنگل و دریا",
        rating: 4.7,
    },
    {
        id: 16,
        name: "کرج",
        slug: "karaj",
        province: "البرز",
        propertyCount: 543,
        image: "/images/landing/cities/karaj.png",
        iconName: "PiBuildingsFill",
        description: "کلان‌شهر البرز",
        rating: 4.4,
    },
    {
        id: 17,
        name: "سوادکوه",
        slug: "savadkoh",
        province: "مازندران",
        propertyCount: 156,
        image: "/images/landing/cities/savadkoh.png",
        iconName: "PiMountainsFill",
        description: "بهشت طبیعت‌گردی",
        rating: 4.9,
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
};

/* ============================================================
   Formatters
   ============================================================ */
const faNumFormatter = new Intl.NumberFormat("fa-IR");
const faNum = (n) => faNumFormatter.format(Number(n) || 0);

/* ============================================================
   CityCard — با fallback گرادیان طلایی در صورت خطای تصویر
   ============================================================ */
const CityCard = memo(function CityCard({ city, index }) {
    const IconComponent = ICON_MAP[city.iconName];
    const isPriority = index < 4;
    const [imgError, setImgError] = useState(false);

    return (
        <Link
            href={`/halls/city/${city.slug}`}
            aria-label={`مشاهده ${faNum(city.propertyCount)} تالار در ${city.name}`}
            className="group relative block h-full w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40 transition-all duration-300 cursor-pointer"
        >
            {/* تصویر پس‌زمینه — با fallback */}
            {!imgError ? (
                <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    sizes="(max-width: 480px) 150px, (max-width: 640px) 160px, (max-width: 768px) 170px, (max-width: 1024px) 180px, (max-width: 1280px) 190px, 200px"
                    quality={85}
                    priority={isPriority}
                    loading={isPriority ? "eager" : "lazy"}
                    onError={() => setImgError(true)}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
            ) : (
                /* Fallback: پس‌زمینه گرادیان طلایی */
                <div
                    className="absolute inset-0 bg-gradient-to-br from-[#C6A14C] via-[#A8853A] to-[#85672C]"
                    aria-hidden="true"
                >
                    {/* الگوی تزئینی */}
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

            {/* گرادیانت تیره */}
            <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
                aria-hidden="true"
            />

            {/* محتوا */}
            <div className="absolute bottom-0 right-0 left-0 p-3 flex flex-col justify-end text-white">
                {/* ردیف بالایی: امتیاز */}
                <div className="flex items-center gap-1 mb-1">
                    <PiStarFill
                        className="w-3 h-3 text-[#C6A14C] shrink-0"
                        aria-hidden="true"
                    />
                    <span className="text-[11px] font-bold text-white/95">
                        {faNum(city.rating)}
                    </span>
                </div>

                {/* نام شهر + آیکون */}
                <div className="flex items-center gap-1.5 mb-1">
                    {IconComponent && (
                        <IconComponent
                            className="w-4 h-4 text-[#C6A14C] drop-shadow-md shrink-0"
                            aria-hidden="true"
                        />
                    )}
                    <h3 className="text-sm sm:text-base font-bold drop-shadow-md truncate">
                        {city.name}
                    </h3>
                </div>

                {/* تعداد تالار */}
                <div className="flex items-center gap-1 text-[11px] text-white/85">
                    <PiMapPinFill
                        className="w-3 h-3 shrink-0"
                        aria-hidden="true"
                    />
                    <span className="truncate">
                        {faNum(city.propertyCount)} تالار
                    </span>
                </div>
            </div>
        </Link>
    );
});

/* ============================================================
   PopularCities
   ============================================================ */
export default function PopularCities() {
    return (
        <section
            aria-labelledby="popular-cities-heading"
            className="py-10 md:py-14"
        >
            <Carousel
                ariaLabel="popular-cities"
                eyebrow="مقاصد محبوب"
                title="محبوب‌ترین شهرهای ایران"
                subtitle="تالارهای ویژه در بهترین مقاصد برگزاری مراسم ایران"
                slideClassName="city-slide shrink-0 snap-start"
                gapClassName="gap-3 sm:gap-4"
                containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                trackPaddingClassName="px-4 sm:px-6 lg:px-8"
                headerAction={
                    <Link
                        href="/halls"
                        prefetch={false}
                        className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#A8853A] hover:text-[#85672C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A14C]/40 rounded px-2 py-1 transition-colors"
                    >
                        <span>مشاهده همه</span>
                        <PiArrowLeft aria-hidden="true" className="w-3.5 h-3.5" />
                    </Link>
                }
            >
                {POPULAR_CITIES.map((city, index) => (
                    <CityCard key={city.id} city={city} index={index} />
                ))}
            </Carousel>
        </section>
    );
}