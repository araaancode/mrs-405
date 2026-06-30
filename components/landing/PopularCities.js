// components/landing/PopularCities.jsx - Optimized version
'use client'

import { useState, useMemo, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Lazy load all icons
const PiMapPinFill = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiMapPinFill })))
const PiStarFill = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiStarFill })))
const PiBuilding = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiBuilding })))
const PiTree = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiTree })))
const PiMountains = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiMountains })))
const PiDrop = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiDrop })))
const PiCrownSimple = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiCrownSimple })))
const PiFlagBanner = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiFlagBanner })))
const PiArrowLeft = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiArrowLeft })))
const PiSparkle = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiSparkle })))

// Optimized city data with preload hints
const popularCities = [
    {
        id: 1,
        name: "تهران",
        slug: "tehran",
        province: "تهران",
        propertyCount: 1247,
        image: "/images/landing/cities/tehran.png",
        iconName: "PiBuilding",
        description: "پایتخت vibrant ایران",
        rating: 4.8,
        priority: true // First 4 cities have priority
    },
    {
        id: 2,
        name: "اصفهان",
        slug: "isfahan",
        province: "اصفهان",
        propertyCount: 892,
        image: "/images/landing/cities/isfahan.png",
        iconName: "PiCrownSimple",
        description: "نصف جهان",
        rating: 4.9,
        priority: true
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
        priority: true
    },
    {
        id: 4,
        name: "مشهد",
        slug: "mashhad",
        province: "خراسان رضوی",
        propertyCount: 1123,
        image: "/images/landing/cities/mashhad2.jpeg",
        iconName: "PiFlagBanner",
        description: "شهر امام رضا (ع)",
        rating: 4.9,
        priority: true
    },
    {
        id: 5,
        name: "تبریز",
        slug: "tabriz",
        province: "آذربایجان شرقی",
        propertyCount: 634,
        image: "/images/landing/cities/tabriz.jpg",
        iconName: "PiMountains",
        description: "شهر اولین‌ها",
        rating: 4.6,
        priority: false
    },
    {
        id: 6,
        name: "کیش",
        slug: "kish",
        province: "هرمزگان",
        propertyCount: 445,
        image: "/images/landing/cities/kish.png",
        iconName: "PiDrop",
        description: "مروارید خلیج فارس",
        rating: 4.8,
        priority: false
    },
    {
        id: 7,
        name: "رشت",
        slug: "rasht",
        province: "گیلان",
        propertyCount: 523,
        image: "/images/landing/cities/rasht.png",
        iconName: "PiTree",
        description: "شهر باران",
        rating: 4.7,
        priority: false
    },
    {
        id: 8,
        name: "کرمان",
        slug: "kerman",
        province: "کرمان",
        propertyCount: 389,
        image: "/images/landing/cities/kerman.jpeg",
        iconName: "PiMountains",
        description: "کویر و تاریخ",
        rating: 4.5,
        priority: false
    },
]

// Icon mapping for lazy loading
const iconMap = {
    PiBuilding: PiBuilding,
    PiCrownSimple: PiCrownSimple,
    PiStarFill: PiStarFill,
    PiFlagBanner: PiFlagBanner,
    PiMountains: PiMountains,
    PiDrop: PiDrop,
    PiTree: PiTree,
}

// Optimized image component with native img
const CityImage = ({ src, alt, priority }) => (
    <div className="absolute inset-0 w-full h-full">
        <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'low'}
            decoding="async"
        />
    </div>
)

// Individual city card component for better memoization
const CityCard = memo(({ city, index, isHovered, onHover }) => {
    const IconComponent = iconMap[city.iconName]
    const priority = index < 4

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }} // Reduced delay
            viewport={{ once: true, margin: "-50px" }}
            className="group relative"
            onMouseEnter={() => onHover(city.id)}
            onMouseLeave={() => onHover(null)}
        >
            <Link href={`/halls/city/${city.name}`} prefetch={false}> {/* Disable prefetch for faster initial load */}
                <div className="relative h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer will-change-transform">

                    {/* City image */}
                    <CityImage
                        src={city.image}
                        alt={city.name}
                        priority={priority}
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 transition-opacity duration-300 z-10" />

                    {/* Golden halo on hover - simplified */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-[#D4B06A]/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 z-10 ${isHovered ? 'opacity-100' : ''}`} />

                    {/* City info */}
                    <div className={`absolute inset-0 z-20 p-5 flex flex-col justify-end transition-all duration-300 ${isHovered ? 'backdrop-blur-sm bg-black/30' : ''}`}>

                        {/* City name */}
                        <div className="flex items-center gap-2 mb-1">
                            <Suspense fallback={<div className="w-5 h-5 bg-[#D4B06A]/50 rounded" />}>
                                <IconComponent className="w-5 h-5 text-[#D4B06A] drop-shadow-md" />
                            </Suspense>
                            <h3 className="text-xl font-bold text-white drop-shadow-lg">
                                {city.name}
                            </h3>
                        </div>

                        {/* Extra info - shown on hover */}
                        <div className={`overflow-hidden transition-all duration-300 ${isHovered ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                            <p className="text-white/90 text-sm mb-3 drop-shadow-md">
                                {city.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className="text-white/80 text-xs flex items-center gap-1">
                                    <Suspense fallback={<div className="w-3 h-3" />}>
                                        <PiMapPinFill className="w-3 h-3" />
                                    </Suspense>
                                    {city.province}
                                </span>
                                <span className="bg-[#D4B06A]/80 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium">
                                    {city.propertyCount.toLocaleString()} اقامتگاه
                                </span>
                            </div>

                            {/* View button */}
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/30">
                                <span className="text-sm text-white/90">مشاهده همه اقامتگاه‌ها</span>
                                <div className="bg-[#D4B06A] rounded-full p-1.5 transition-all duration-200 hover:bg-[#B8922E] hover:scale-105">
                                    <Suspense fallback={<div className="w-4 h-4" />}>
                                        <PiArrowLeft className="w-4 h-4 text-white" />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
})

CityCard.displayName = 'CityCard'

import { memo } from 'react'

export default function PopularCities() {
    const [hoveredCity, setHoveredCity] = useState(null)

    // Optimized hover handler
    const handleHover = (id) => {
        setHoveredCity(id)
    }

    return (
        <section className="py-16 md:py-20"> {/* Reduced padding on mobile */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header - simplified animations */}
                <div className="text-center mb-10 md:mb-12">
                    <h2 className="text-2xl md:text-4xl font-black text-[#2C2418] mb-3">
                        محبوب‌ترین شهرهای ایران
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mx-auto mb-4" />
                    <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto px-4">
                        اقامتگاه‌های ویژه در بهترین مقاصد گردشگری ایران
                    </p>
                </div>

                {/* Grid Container - optimized grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                    {popularCities.map((city, index) => (
                        <CityCard
                            key={city.id}
                            city={city}
                            index={index}
                            isHovered={hoveredCity === city.id}
                            onHover={handleHover}
                        />
                    ))}
                </div>

                {/* View all cities button - simplified */}
                <div className="text-center mt-10 md:mt-12">
                    <Link
                        href="/cities"
                        prefetch={false}
                        className="group inline-flex items-center gap-2 bg-white border-2 border-[#D4B06A] text-[#D4B06A] px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-xl hover:bg-[#D4B06A] hover:text-white"
                    >
                        <span>مشاهده همه شهرها</span>
                        <Suspense fallback={<div className="w-5 h-5" />}>
                            <PiArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </Suspense>
                    </Link>
                </div>
            </div>
        </section>
    )
}