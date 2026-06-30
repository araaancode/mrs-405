'use client'

import { useState, useCallback, useMemo, lazy, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

// Lazy load heavy icons
const PiMagnifyingGlass = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiMagnifyingGlass })))
const PiBuilding = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiBuilding })))
const PiMapPinFill = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiMapPinFill })))
const PiCalendarBlank = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiCalendarBlank })))
const PiArrowRight = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiArrowRight })))
const PiSpinner = lazy(() => import('react-icons/pi').then(mod => ({ default: mod.PiSpinner })))

// Lazy load heavy date picker with no SSR
const DatePicker = lazy(() => import('react-multi-date-picker').then(mod => ({ default: mod.default })))

// Static data moved outside component to prevent recreation
const eventTypes = ["تولد", "عروسی", "عزاداری", "تجلیل", "همایش", "جشن", "دیگر"]
const hallTypes = ["سربسته", "روباز", "باغ", "تراس", "سالن سرپوشیده", "دیگر"]

const provinces = [
    "آذربایجان شرقی", "آذربایجان غربی", "اردبیل", "اصفهان", "البرز", "ایلام", "بوشهر",
    "تهران", "چهارمحال و بختیاری", "خراسان جنوبی", "خراسان رضوی", "خراسان شمالی",
    "خوزستان", "زنجان", "سمنان", "سیستان و بلوچستان", "فارس", "قزوین", "قم", "کردستان",
    "کرمان", "کرمانشاه", "کهگیلویه و بویراحمد", "گلستان", "گیلان", "لرستان",
    "مازندران", "مرکزی", "هرمزگان", "همدان", "یزد"
]

export default function AdvancedSearch() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [filters, setFilters] = useState({
        province: '',
        city: '',
        event_type: '',
        hall_type: '',
    })
    const [isMounted, setIsMounted] = useState(false)

    // Mark component as mounted for client-side features
    useState(() => {
        setIsMounted(true)
    }, [])

    // Optimized handler with useCallback
    const handleChange = useCallback((name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }))
    }, [])

    // Optimized search handler
    const handleSearch = useCallback((e) => {
        e.preventDefault()
        setLoading(true)

        const params = new URLSearchParams()

        // Use for...of for better performance
        const entries = Object.entries(filters)
        for (let i = 0; i < entries.length; i++) {
            const [key, value] = entries[i]
            if (value) params.append(key, value)
        }

        // Use replace instead of push for better memory management
        router.replace(`/search?${params.toString()}`)
    }, [filters, router])

    // Memoized select options to prevent recreation
    const provinceOptions = useMemo(() =>
        provinces.map((province) => (
            <option key={province} value={province}>
                {province}
            </option>
        )), []
    )

    const eventTypeOptions = useMemo(() =>
        eventTypes.map((item) => (
            <option key={item} value={item}>
                {item}
            </option>
        )), []
    )

    const hallTypeOptions = useMemo(() =>
        hallTypes.map((item) => (
            <option key={item} value={item}>
                {item}
            </option>
        )), []
    )

    // Icon wrapper component for consistent lazy loading
    const IconWrapper = ({ icon: Icon, className, fallback }) => (
        <Suspense fallback={<div className={className || "w-5 h-5"} />}>
            <Icon className={className} />
        </Suspense>
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }} // Optimize viewport detection
            transition={{ duration: 0.5, ease: "easeOut" }} // Reduced duration
            className="w-full max-w-4xl mx-auto px-4 -mt-24 relative z-20"
        >
            <form
                onSubmit={handleSearch}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
            >
                {/* Header - simplified animation */}
                <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                        <Suspense fallback={<div className="w-5 h-5 bg-gray-200 rounded" />}>
                            <PiBuilding className="w-5 h-5 text-[#D4B06A]" />
                        </Suspense>
                        <span className="font-bold text-gray-800">جستجوی تالار</span>
                    </div>
                </div>

                <div className="p-4 md:p-6"> {/* Reduced padding on mobile */}
                    <div className="flex flex-col md:flex-row gap-3 items-end">
                        {/* Province select */}
                        <div className="relative flex-1 w-full">
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                <Suspense fallback={<div className="w-5 h-5" />}>
                                    <PiMapPinFill className="w-5 h-5 text-[#D4B06A]" />
                                </Suspense>
                            </div>
                            <select
                                value={filters.province}
                                onChange={(e) => handleChange('province', e.target.value)}
                                className="w-full p-3.5 pr-12 border-2 border-gray-200 rounded-xl bg-white text-[#2C2418] focus:border-[#D4B06A] focus:shadow-lg focus:shadow-[#D4B06A]/10 outline-none appearance-none cursor-pointer transition-all duration-200"
                            >
                                <option value="">انتخاب استان</option>
                                {provinceOptions}
                            </select>
                        </div>

                        {/* City input */}
                        <div className="relative flex-1 w-full">
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                <Suspense fallback={<div className="w-5 h-5" />}>
                                    <PiMapPinFill className="w-5 h-5 text-[#D4B06A]" />
                                </Suspense>
                            </div>
                            <input
                                type="text"
                                placeholder="نام شهر"
                                value={filters.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                className="w-full p-3.5 pr-12 border-2 border-gray-200 rounded-xl bg-white text-[#2C2418] placeholder:text-gray-400 focus:border-[#D4B06A] focus:shadow-lg focus:shadow-[#D4B06A]/10 outline-none transition-all duration-200"
                                enterKeyHint="search"
                            />
                        </div>

                        {/* Event type select */}
                        <div className="relative flex-1 w-full">
                            <select
                                value={filters.event_type}
                                onChange={(e) => handleChange('event_type', e.target.value)}
                                className="w-full p-3.5 border-2 border-gray-200 rounded-xl bg-white outline-none focus:border-[#D4B06A] focus:shadow-lg focus:shadow-[#D4B06A]/10 transition-all duration-200 cursor-pointer"
                            >
                                <option value="">نوع مراسم</option>
                                {eventTypeOptions}
                            </select>
                        </div>

                        {/* Hall type select */}
                        <div className="relative flex-1 w-full">
                            <select
                                value={filters.hall_type}
                                onChange={(e) => handleChange('hall_type', e.target.value)}
                                className="w-full p-3.5 border-2 border-gray-200 rounded-xl bg-white outline-none focus:border-[#D4B06A] focus:shadow-lg focus:shadow-[#D4B06A]/10 transition-all duration-200 cursor-pointer"
                            >
                                <option value="">نوع تالار</option>
                                {hallTypeOptions}
                            </select>
                        </div>

                        {/* Search button - removed framer-motion for better performance */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:shadow-xl disabled:opacity-70 min-w-[120px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Suspense fallback={<div className="w-5 h-5 animate-spin border-2 border-white rounded-full" />}>
                                    <PiSpinner className="w-5 h-5 animate-spin" />
                                </Suspense>
                            ) : (
                                <>
                                    <Suspense fallback={<div className="w-5 h-5" />}>
                                        <PiMagnifyingGlass className="w-5 h-5" />
                                    </Suspense>
                                    <span>جستجو</span>
                                    <Suspense fallback={<div className="w-4 h-4" />}>
                                        <PiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                    </Suspense>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </motion.div>
    )
}