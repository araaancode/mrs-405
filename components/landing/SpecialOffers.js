'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaFire, FaTag, FaClock, FaArrowLeft } from 'react-icons/fa'
import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

export default function SpecialOffers({ halls = [], isLoading = false }) {
    const [imageErrors, setImageErrors] = useState({})

    const handleImageError = (hallId) => {
        setImageErrors(prev => ({ ...prev, [hallId]: true }))
    }

    // محاسبه قیمت با تخفیف
    const getDiscountedPrice = (hall) => {
        if (typeof hall.price !== 'number') return null
        const discountPercent = hall.discount || 20
        return Math.floor(hall.price * (1 - discountPercent / 100))
    }

    // بررسی اعتبار تخفیف
    const hasValidDiscount = (hall) => {
        return (hall.hasDiscount || (hall.discount && hall.discount > 0)) && hall.discount !== undefined
    }

    // بهینه‌سازی با useMemo
    const displayOffers = useMemo(() => {
        const offers = halls.filter(hasValidDiscount).slice(0, 4)
        return offers.length > 0 ? offers : halls.slice(0, 4)
    }, [halls])

    // نمایش حالت لودینگ
    if (isLoading) {
        return (
            <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
                        <p className="text-[#8E8276]">در حال بارگذاری تخفیف‌های ویژه...</p>
                    </div>
                </div>
            </section>
        )
    }

    // نمایش حالت بدون محتوا
    if (!displayOffers.length) {
        return (
            <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <FaFire className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-[#3B2F2F] mb-2">تخفیفی موجود نیست</h3>
                        <p className="text-[#8E8276]">به زودی تخفیف‌های ویژه‌ای برای شما آماده می‌شود</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-16 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-2xl animate-pulse">
                            <FaFire className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                            تخفیفات ویژه
                        </h2>
                        <div className="w-16 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                    </div>
                    <p className="text-[#8E8276] text-base md:text-lg max-w-2xl mx-auto">
                        فرصت‌های استثنایی برای برگزاری مراسم با بهترین قیمت‌ها
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayOffers.map((hall, index) => {
                        const discountedPrice = getDiscountedPrice(hall)
                        const hasImageError = imageErrors[hall._id]
                        const imageUrl = hasImageError
                            ? '/images/placeholder.jpg'
                            : (hall.images?.[0] || '/images/placeholder.jpg')

                        return (
                            <motion.div
                                key={hall._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                            >
                                {/* برچسب تخفیف */}
                                <div className="absolute top-4 right-4 z-10">
                                    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                        <FaTag className="w-3 h-3" />
                                        {hall.discount || 20}% تخفیف
                                    </div>
                                </div>

                                {/* برچسب ویژه */}
                                {index === 0 && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                                            ویژه
                                        </div>
                                    </div>
                                )}

                                {/* تصویر */}
                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                    <img
                                        src={imageUrl}
                                        alt={hall.name}
                                        onError={() => handleImageError(hall._id)}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                {/* محتوا */}
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-[#3B2F2F] mb-2 line-clamp-1 group-hover:text-red-600 transition-colors">
                                        {hall.name}
                                    </h3>

                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-baseline gap-2 flex-wrap">
                                            {discountedPrice ? (
                                                <>
                                                    <span className="text-2xl font-bold text-red-500">
                                                        {discountedPrice.toLocaleString()}
                                                    </span>
                                                    <span className="text-xs text-gray-400 line-through">
                                                        {hall.price.toLocaleString()}
                                                    </span>
                                                    <span className="text-xs text-gray-500">تومان</span>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-500">
                                                    برای استعلام قیمت تماس بگیرید
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
                                            <FaClock className="w-3 h-3" />
                                            <span className="text-xs font-medium">زمان محدود</span>
                                        </div>
                                    </div>

                                    {/* امکانات سریع */}
                                    {hall.capacity && (
                                        <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                                            <span>ظرفیت: {hall.capacity.toLocaleString()} نفر</span>
                                            {hall.location && (
                                                <>
                                                    <span>•</span>
                                                    <span>{hall.location}</span>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    <Link
                                        href={`/halls/${hall._id}`}
                                        className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        aria-label={`مشاهده و استفاده از تخفیف ${hall.name}`}
                                    >
                                        استفاده از تخفیف
                                        <FaArrowLeft className="w-4 h-4 inline-block mr-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                                    </Link>
                                </div>

                                {/* افکت‌های hover */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500/20 rounded-2xl pointer-events-none transition-all duration-300" />
                            </motion.div>
                        )
                    })}
                </div>

                {/* دکمه مشاهده همه */}
                {halls.length > 4 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center mt-12"
                    >
                        <Link
                            href="/halls"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 rounded-xl font-bold shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            مشاهده همه تالارها
                            <FaArrowLeft className="w-4 h-4" />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    )
}

// PropTypes برای مستندسازی بهتر
SpecialOffers.propTypes = {
    halls: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number,
            discount: PropTypes.number,
            hasDiscount: PropTypes.bool,
            images: PropTypes.arrayOf(PropTypes.string),
            capacity: PropTypes.number,
            location: PropTypes.string
        })
    ),
    isLoading: PropTypes.bool
}

SpecialOffers.defaultProps = {
    halls: [],
    isLoading: false
}