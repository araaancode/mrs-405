'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
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

const featureIcons = {
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

export default function HallsSection({ halls = [], onLike, likedHalls = new Set() }) {
    return (
        <section className="py-20 bg-gradient-to-br from-[#FFF8F0] to-[#FDF5E6]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
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
                </motion.div>

                {/* Halls Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {halls.map((hall, index) => (
                        <motion.div
                            key={hall._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            whileHover={{ y: -8 }}
                            className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-400 overflow-hidden"
                        >
                            {/* Image Container */}
                            <div className="relative h-72 overflow-hidden bg-[#E8DCC8]">
                                <img
                                    src={hall.images?.[0] || '/images/placeholder.jpg'}
                                    alt={hall.name}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.src = '/images/placeholder.jpg';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                {/* Like Button */}
                                <button
                                    onClick={() => onLike?.(hall._id)}
                                    className="absolute top-5 left-5 z-10 p-2.5 bg-white/15 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 active:scale-95"
                                    aria-label="like"
                                >
                                    {likedHalls.has(hall._id) ? (
                                        <FaHeart className="w-5 h-5 text-red-500 drop-shadow-sm" />
                                    ) : (
                                        <FaRegHeart className="w-5 h-5 text-white drop-shadow-sm" />
                                    )}
                                </button>

                                {/* Special Badge */}
                                {hall.isSpecial && (
                                    <div className="absolute top-5 right-5 z-10">
                                        <div className="bg-gradient-to-r from-[#D4B06A] to-[#C39243] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md tracking-wide">
                                            ویژه
                                        </div>
                                    </div>
                                )}

                                {/* Title & Location Overlay */}
                                <div className="absolute bottom-5 left-5 right-5">
                                    <h3 className="text-xl font-bold text-white mb-1.5 drop-shadow-md">{hall.name}</h3>
                                    <div className="flex items-center gap-2 text-white/90 text-sm">
                                        <FaMapMarkerAlt className="w-3.5 h-3.5" />
                                        <span>{hall.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-6">
                                {/* Rating & Capacity Row */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-2 bg-[#FDF8F0] px-3.5 py-2 rounded-2xl border border-[#F0E4D0]">
                                        <FaStar className="w-4 h-4 text-[#D4B06A]" />
                                        <span className="text-sm font-semibold text-[#4A3520]">{hall.rating || 4.8}</span>
                                        <span className="text-xs text-[#8B7355]">({hall.reviews || 124} نظر)</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#FDF8F0] px-3.5 py-2 rounded-2xl border border-[#F0E4D0]">
                                        <FaUsers className="w-4 h-4 text-[#C39243]" />
                                        <span className="text-sm font-medium text-[#4A3520]">تا {hall.capacity} نفر</span>
                                    </div>
                                </div>

                                {/* Features Grid */}
                                {hall.features && hall.features.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {hall.features.slice(0, 4).map((feature, idx) => {
                                            const Icon = featureIcons[feature] || FaSnowflake;
                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-1.5 bg-[#FDF8F0] px-3 py-1.5 rounded-xl border border-[#F0E4D0] transition-all hover:border-[#D4B06A] hover:bg-[#FFFBF5]"
                                                >
                                                    <Icon className="w-3.5 h-3.5 text-[#C39243]" />
                                                    <span className="text-xs text-[#6B4F2E] font-medium">{feature}</span>
                                                </div>
                                            );
                                        })}
                                        {hall.features.length > 4 && (
                                            <div className="flex items-center bg-[#FDF8F0] px-3 py-1.5 rounded-xl border border-[#F0E4D0]">
                                                <span className="text-xs text-[#8B7355] font-medium">
                                                    +{hall.features.length - 4} بیشتر
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Description */}
                                <p className="text-[#6B5B4B] text-sm leading-relaxed line-clamp-2 mb-5">
                                    {hall.description?.slice(0, 85) ||
                                        'سالنی لوکس و مجهز با دکوراسیون مدرن و خدمات عالی'}
                                    {hall.description?.length > 85 ? '...' : ''}
                                </p>

                                {/* Price & CTA */}
                                <div className="flex items-center justify-between pt-4 border-t border-[#F0E4D0]">
                                    <div className="flex flex-col">
                                        {hall.discount ? (
                                            <>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-bold text-[#C0392B]">
                                                        {Math.floor(hall.price * (1 - hall.discount / 100)).toLocaleString()}
                                                    </span>
                                                    <span className="text-xs text-[#8B7355]">تومان</span>
                                                </div>
                                                <span className="text-xs text-[#A08B70] line-through">
                                                    {hall.price.toLocaleString()} تومان
                                                </span>
                                            </>
                                        ) : (
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-bold text-[#C39243]">
                                                    {typeof hall.price === 'number' ? hall.price.toLocaleString() : 'تماس بگیرید'}
                                                </span>
                                                <span className="text-xs text-[#8B7355]">تومان</span>
                                            </div>
                                        )}
                                    </div>
                                    <Link
                                        href={`/halls/${hall._id}`}
                                        className="px-5 py-2.5 bg-gradient-to-r from-[#D4B06A] to-[#C39243] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:opacity-90 transition-all duration-300 active:scale-95"
                                    >
                                        مشاهده جزئیات
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-14"
                >
                    <Link
                        href="/halls"
                        className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#D4B06A] text-[#C39243] rounded-2xl font-bold hover:bg-[#D4B06A] hover:text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group"
                    >
                        مشاهده تمام تالارها
                        <FaArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}