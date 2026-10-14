// components/landing/PopularCities.jsx
"use client";

import { memo } from "react";
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
   Cities Data — ۲۴ شهر محبوب ایران
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
        name: "یزد",
        slug: "yazd",
        province: "یزد",
        propertyCount: 412,
        image: "/images/landing/cities/yazd.jpg",
        iconName: "PiSunFill",
        description: "شهر بادگیرها",
        rating: 4.7,
    },
    {
        id: 10,
        name: "همدان",
        slug: "hamedan",
        province: "همدان",
        propertyCount: 298,
        image: "/images/landing/cities/hamedan.jpg",
        iconName: "PiLeafFill",
        description: "پایتخت تاریخ و تمدن",
        rating: 4.5,
    },
    {
        id: 11,
        name: "کاشان",
        slug: "kashan",
        province: "اصفهان",
        propertyCount: 356,
        image: "/images/landing/cities/kashan.jpg",
        iconName: "PiFlowerLotusFill",
        description: "شهر گل و گلاب",
        rating: 4.8,
    },
    {
        id: 12,
        name: "ماسال",
        slug: "masal",
        province: "گیلان",
        propertyCount: 187,
        image: "/images/landing/cities/masal.jpg",
        iconName: "PiTreeFill",
        description: "بهشت گمشده گیلان",
        rating: 4.9,
    },
    {
        id: 13,
        name: "رامسر",
        slug: "ramsar",
        province: "مازندران",
        propertyCount: 234,
        image: "/images/landing/cities/ramsar.jpg",
        iconName: "PiDropFill",
        description: "عروس شهرهای ایران",
        rating: 4.8,
    },
    {
        id: 14,
        name: "بندر انزلی",
        slug: "anzali",
        province: "گیلان",
        propertyCount: 201,
        image: "/images/landing/cities/anzali.jpg",
        iconName: "PiAnchorFill",
        description: "شهر تالاب‌ها",
        rating: 4.6,
    },
    {
        id: 15,
        name: "نوشهر",
        slug: "nowshahr",
        province: "مازندران",
        propertyCount: 176,
        image: "/images/landing/cities/nowshahr.jpg",
        iconName: "PiCloudFill",
        description: "شهر جنگل و دریا",
        rating: 4.7,
    },
    {
        id: 16,
        name: "اردبیل",
        slug: "ardabil",
        province: "اردبیل",
        propertyCount: 245,
        image: "/images/landing/cities/ardabil.jpg",
        iconName: "PiCastleTurretFill",
        description: "سرزمین سرسبز",
        rating: 4.6,
    },
    /* ---------- ۸ شهر جدید ---------- */
    {
        id: 17,
        name: "قشم",
        slug: "qeshm",
        province: "هرمزگان",
        propertyCount: 312,
        image: "/images/landing/cities/qeshm.jpg",
        iconName: "PiAnchorFill",
        description: "بزرگ‌ترین جزیره خلیج فارس",
        rating: 4.7,
    },
    {
        id: 18,
        name: "چابهار",
        slug: "chabahar",
        province: "سیستان و بلوچستان",
        propertyCount: 143,
        image: "/images/landing/cities/chabahar.jpg",
        iconName: "PiCompassFill",
        description: "بهشت سواحل مکران",
        rating: 4.6,
    },
    {
        id: 19,
        name: "ساری",
        slug: "sari",
        province: "مازندران",
        propertyCount: 267,
        image: "/images/landing/cities/sari.jpg",
        iconName: "PiTreeFill",
        description: "مرکز مازندران",
        rating: 4.5,
    },
    {
        id: 20,
        name: "گرگان",
        slug: "gorgan",
        province: "گلستان",
        propertyCount: 234,
        image: "/images/landing/cities/gorgan.jpg",
        iconName: "PiTreeFill",
        description: "شهر جنگل‌های هیرکانی",
        rating: 4.6,
    },
    {
        id: 21,
        name: "اهواز",
        slug: "ahvaz",
        province: "خوزستان",
        propertyCount: 356,
        image: "/images/landing/cities/ahvaz.jpg",
        iconName: "PiFireFill",
        description: "شهر کارون",
        rating: 4.4,
    },
    {
        id: 22,
        name: "بوشهر",
        slug: "bushehr",
        province: "بوشهر",
        propertyCount: 189,
        image: "/images/landing/cities/bushehr.jpg",
        iconName: "PiAnchorFill",
        description: "بندر تاریخی خلیج فارس",
        rating: 4.5,
    },
    {
        id: 23,
        name: "زنجان",
        slug: "zanjan",
        province: "زنجان",
        propertyCount: 178,
        image: "/images/landing/cities/zanjan.jpg",
        iconName: "PiSnowflakeFill",
        description: "شهر چاقو و ملیله",
        rating: 4.5,
    },
    {
        id: 24,
        name: "سنندج",
        slug: "sanandaj",
        province: "کردستان",
        propertyCount: 165,
        image: "/images/landing/cities/sanandaj.jpg",
        iconName: "PiMountainsFill",
        description: "شهر موسیقی و فرهنگ",
        rating: 4.6,
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
   CityCard — استایل جاباما (نسبت ۱:۱.۲)
   ============================================================ */
const CityCard = memo(function CityCard({ city, index }) {
    const IconComponent = ICON_MAP[city.iconName];
    const isPriority = index < 4;

    return (
        <Link
            href={`/halls/city/${city.slug}`}
            aria-label={`مشاهده ${faNum(city.propertyCount)} تالار در ${city.name}`}
            className="group relative block h-full w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40 transition-all duration-300 cursor-pointer"
        >
            {/* تصویر پس‌زمینه */}
            <Image
                src={city.image}
                alt={city.name}
                fill
                sizes="(max-width: 480px) 150px, (max-width: 640px) 160px, (max-width: 768px) 170px, (max-width: 1024px) 180px, (max-width: 1280px) 190px, 200px"
                quality={85}
                priority={isPriority}
                loading={isPriority ? "eager" : "lazy"}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

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