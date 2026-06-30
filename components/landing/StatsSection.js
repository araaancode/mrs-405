'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { FaBuilding, FaCalendarCheck, FaUsers, FaHeadset } from 'react-icons/fa'

const Counter = ({ target, suffix = '' }) => {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    useEffect(() => {
        if (isInView) {
            let start = 0
            const duration = 2000
            const increment = target / (duration / 16)

            const timer = setInterval(() => {
                start += increment
                if (start >= target) {
                    setCount(target)
                    clearInterval(timer)
                } else {
                    setCount(Math.floor(start))
                }
            }, 16)

            return () => clearInterval(timer)
        }
    }, [isInView, target])

    return (
        <span ref={ref}>
            {count.toLocaleString()}{suffix}
        </span>
    )
}

export default function StatsSection() {
    const stats = [
        {
            icon: FaBuilding,
            value: 150,
            suffix: '+',
            label: 'تالار لوکس',
            color: 'from-[#D4B06A] to-[#C39243]'
        },
        {
            icon: FaCalendarCheck,
            value: 500,
            suffix: '+',
            label: 'مراسم موفق',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: FaUsers,
            value: 10000,
            suffix: '+',
            label: 'مشتری راضی',
            color: 'from-orange-500 to-red-500'
        },
        {
            icon: FaHeadset,
            value: 24,
            suffix: '/۷',
            label: 'پشتیبانی',
            color: 'from-[#6E5B4C] to-[#3B2F2F]'
        }
    ]

    return (
        <section className="py-16 bg-gradient-to-r from-[#3B2F2F] to-[#6E5B4C] rounded-3xl mx-4 overflow-hidden relative">
            {/* افکت پس‌زمینه */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full filter blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D9A14B] rounded-full filter blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                        آمار مراسمینو
                    </h2>
                    <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto">
                        افتخار می‌کنیم که میزبان بهترین مراسم‌های شما هستیم
                    </p>
                    <div className="divider-gold w-24 mx-auto mt-6" />
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center group"
                            >
                                <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                    <Icon className="w-10 h-10 text-white" />
                                </div>
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                    <Counter target={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-white/70 text-sm md:text-base">
                                    {stat.label}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}