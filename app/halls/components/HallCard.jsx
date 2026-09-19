// app/halls/components/HallCard.jsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { PiMapPin, PiUsers, PiStar, PiSquaresFour } from "react-icons/pi";

export default function HallCard({ hall, index = 0, viewMode = "grid" }) {
    const isList = viewMode === "list";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.35 }}
            layout
        >
            <Link href={`/halls/${hall._id}`} className="block h-full">
                <div
                    className={`bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all overflow-hidden group border border-transparent hover:border-[#D4B06A]/30 ${isList ? "flex flex-col sm:flex-row" : ""
                        }`}
                >
                    {/* تصویر */}
                    <div
                        className={`relative bg-gray-100 overflow-hidden ${isList ? "sm:w-72 h-52 sm:h-auto flex-shrink-0" : "h-52"
                            }`}
                    >
                        <Image
                            src={hall.images?.[0] || "/placeholder.jpg"}
                            alt={hall.title || "تالار"}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                        />
                        {/* گرادیان */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                        {/* برچسب ظرفیت */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg">
                            <PiUsers className="w-3.5 h-3.5" />
                            {hall.capacity?.toLocaleString("fa-IR")} نفر
                        </div>

                        {/* نوع تالار */}
                        {hall.hall_type && (
                            <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#D4B06A] text-white text-xs rounded-lg font-bold">
                                {hall.hall_type}
                            </div>
                        )}
                    </div>

                    {/* محتوا */}
                    <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-bold text-[#2C2418] text-lg mb-2 line-clamp-1 group-hover:text-[#D4B06A] transition-colors">
                            {hall.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                            <PiMapPin className="w-4 h-4 text-[#D4B06A] flex-shrink-0" />
                            <span className="line-clamp-1">
                                {hall.province}، {hall.city}
                            </span>
                        </div>

                        {hall.description && (
                            <p className="text-gray-500 text-sm line-clamp-2 mb-3 leading-6">
                                {hall.description}
                            </p>
                        )}

                        {/* ویژگی‌های سریع */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {hall.has_sans && (
                                <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">
                                    سانس
                                </span>
                            )}
                            {hall.parking_count && (
                                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                                    پارکینگ {hall.parking_count}
                                </span>
                            )}
                            {hall.hall_measure && (
                                <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md flex items-center gap-1">
                                    <PiSquaresFour className="w-3 h-3" />
                                    {hall.hall_measure} م²
                                </span>
                            )}
                        </div>

                        {/* فوتر */}
                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="font-bold text-[#D4B06A]">
                                {hall.sans_price
                                    ? `${hall.sans_price.toLocaleString("fa-IR")} تومان`
                                    : "تماس بگیرید"}
                            </span>
                            <span className="text-[#D4B06A] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                جزئیات ←
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}