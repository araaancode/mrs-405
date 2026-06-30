// components/ui/Header.jsx - نسخه حرفه‌ای و بهینه شده
'use client'

import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

//  بارگذاری تنبل (lazy loading) کتابخانه‌های سنگین
const motion = {
    div: lazy(() => import('framer-motion').then(mod => ({ default: mod.motion.div }))),
    button: lazy(() => import('framer-motion').then(mod => ({ default: mod.motion.button })))
}
const AnimatePresence = lazy(() => import('framer-motion').then(mod => ({ default: mod.AnimatePresence })))

//  آیکون‌ها فقط زمانی که نیاز شوند لود می‌شوند
const Icons = {
    GiLaurelCrown: lazy(() => import('react-icons/gi').then(mod => ({ default: mod.GiLaurelCrown }))),
    MdSearch: lazy(() => import('react-icons/md').then(mod => ({ default: mod.MdSearch }))),
    HiOutlineUser: lazy(() => import('react-icons/hi').then(mod => ({ default: mod.HiOutlineUser }))),
    HiOutlineMenu: lazy(() => import('react-icons/hi').then(mod => ({ default: mod.HiOutlineMenu }))),
    HiOutlineX: lazy(() => import('react-icons/hi').then(mod => ({ default: mod.HiOutlineX }))),
    IoChevronDownOutline: lazy(() => import('react-icons/io5').then(mod => ({ default: mod.IoChevronDownOutline }))),
    IoHeartOutline: lazy(() => import('react-icons/io5').then(mod => ({ default: mod.IoHeartOutline }))),
    IoLogOutOutline: lazy(() => import('react-icons/io5').then(mod => ({ default: mod.IoLogOutOutline }))),
    IoPersonOutline: lazy(() => import('react-icons/io5').then(mod => ({ default: mod.IoPersonOutline }))),
    GiPartyPopper: lazy(() => import('react-icons/gi').then(mod => ({ default: mod.GiPartyPopper }))),
    IoBusOutline: lazy(() => import('react-icons/io5').then(mod => ({ default: mod.IoBusOutline }))),
    IoHomeOutline: lazy(() => import('react-icons/io5').then(mod => ({ default: mod.IoHomeOutline }))),
    MdRestaurantMenu: lazy(() => import('react-icons/md').then(mod => ({ default: mod.MdRestaurantMenu }))),
    FaWhatsapp: lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaWhatsapp }))),
    FaPhone: lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaPhone }))),
    FaInstagram: lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaInstagram }))),
    FaTelegram: lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaTelegram })))
}

//  منوها با useMemo برای جلوگیری از بازسازی مجدد
const menuItems = [
    { name: 'صفحه اصلی', href: '/', isActive: true },
    {
        name: 'خدمات ما',
        href: '#',
        dropdown: [
            { name: 'تالارها', href: '/halls', icon: 'GiPartyPopper' },
            { name: 'کیترینگ', href: '/catering', icon: 'MdRestaurantMenu' },
            { name: 'خدمات تشریفات', href: '/ceremony', icon: 'GiLaurelCrown' },
        ]
    },
    // { name: 'تخفیف‌های ویژه', href: '/discounts' },
    { name: 'درباره ما', href: '/about' },
    { name: 'تماس با ما', href: '/contact' },
]

//  آیکون‌های اجتماعی
const socialIcons = [
    { icon: 'FaWhatsapp', href: 'https://wa.me/...', label: 'واتساپ' },
    { icon: 'FaInstagram', href: 'https://instagram.com/...', label: 'اینستاگرام' },
    { icon: 'FaTelegram', href: 'https://t.me/...', label: 'تلگرام' },
]

export default function Header() {
    const { data: session, status } = useSession()
    const isLoading = status === 'loading'
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    //  فقط بعد از mount شدن در کلاینت، انیمیشن‌ها فعال شوند
    useEffect(() => {
        setMounted(true)
    }, [])

    //  بهینه‌سازی event listener ها با passive: true و throttle
    useEffect(() => {
        let ticking = false
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 50)
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    //  استفاده از useCallback برای توابع
    const handleResize = useCallback(() => {
        if (window.innerWidth > 768) setIsMobileMenuOpen(false)
    }, [])

    useEffect(() => {
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [handleResize])

    //  بهینه‌سازی کلیک خارج
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
                setIsUserMenuOpen(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [isUserMenuOpen])

    const handleLogout = useCallback(() => {
        signOut({ callbackUrl: '/' })
    }, [])

    //  رندر مشروط برای جلوگیری از پردازش اضافی
    const renderAuthButton = useMemo(() => {
        if (isLoading) {
            return (
                <div className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100">
                    <div className="w-4 h-4 border-2 border-[#D4B06A] border-t-transparent rounded-full animate-spin" />
                </div>
            )
        }

        if (session) {
            return (
                <div className="relative user-menu-container">
                    {mounted ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 border border-[#D4B06A]/30 hover:border-[#D4B06A]/60 transition-all"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4B06A] to-[#B8922E] flex items-center justify-center text-white font-bold text-sm">
                                {session.user.full_name?.charAt(0) || 'U'}
                            </div>
                            <div className="text-right hidden lg:block">
                                <p className="text-xs text-gray-500">خوش آمدید</p>
                                <p className="text-sm font-bold text-[#2C2418]">{session.user.full_name}</p>
                            </div>
                            <Suspense fallback={<div className="w-4 h-4" />}>
                                <Icons.IoChevronDownOutline className={`w-4 h-4 text-[#D4B06A] transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                            </Suspense>
                        </motion.button>
                    ) : (
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 border border-[#D4B06A]/30">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4B06A] to-[#B8922E]" />
                        </button>
                    )}

                    {isUserMenuOpen && mounted && (
                        <Suspense fallback={<div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl p-4" />}>
                            <AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-[#D4B06A]/20 overflow-hidden z-50"
                                >
                                    <div className="p-4 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4B06A] to-[#B8922E] flex items-center justify-center text-white font-bold text-lg">
                                                {session.user.full_name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#2C2418]">{session.user.full_name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {session.user.role_fa || 'کاربر عادی'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-2">
                                        <Link href="/user/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F2ED] transition-colors">
                                            <Suspense fallback={<div className="w-5 h-5" />}>
                                                <Icons.IoPersonOutline className="w-5 h-5 text-[#D4B06A]" />
                                            </Suspense>
                                            <span className="text-sm">پنل کاربری</span>
                                        </Link>
                                        <Link href="/user/reservations" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F2ED] transition-colors">
                                            <Suspense fallback={<div className="w-5 h-5" />}>
                                                <Icons.GiPartyPopper className="w-5 h-5 text-[#D4B06A]" />
                                            </Suspense>
                                            <span className="text-sm">رزروهای من</span>
                                        </Link>
                                        <Link href="/user/favorites" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F2ED] transition-colors">
                                            <Suspense fallback={<div className="w-5 h-5" />}>
                                                <Icons.IoHeartOutline className="w-5 h-5 text-[#D4B06A]" />
                                            </Suspense>
                                            <span className="text-sm">علاقه‌مندی‌ها</span>
                                        </Link>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-right">
                                            <Suspense fallback={<div className="w-5 h-5" />}>
                                                <Icons.IoLogOutOutline className="w-5 h-5 text-red-500" />
                                            </Suspense>
                                            <span className="text-sm text-red-600">خروج از حساب</span>
                                        </button>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </Suspense>
                    )}
                </div>
            )
        }

        return (
            <Link href="/auth/user/login">
                {mounted ? (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white shadow-md hover:shadow-xl"
                    >
                        <Suspense fallback={<div className="w-4 h-4" />}>
                            <Icons.HiOutlineUser className="w-4 h-4" />
                        </Suspense>
                        <span className="text-sm">ورود | ثبت‌نام</span>
                    </motion.button>
                ) : (
                    <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white">
                        <span className="text-sm">ورود | ثبت‌نام</span>
                    </button>
                )}
            </Link>
        )
    }, [isLoading, session, isUserMenuOpen, mounted, handleLogout])

    const renderMobileAuthButton = useMemo(() => {
        if (session) {
            return (
                <div className="border-t border-[#E8E2D8] pt-4 mt-4">
                    <div className="bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 rounded-xl p-4 mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4B06A] to-[#B8922E] flex items-center justify-center text-white font-bold">
                                {session.user.full_name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <p className="font-bold text-[#2C2418]">{session.user.full_name}</p>
                                <p className="text-xs text-gray-500">{session.user.role_fa || 'کاربر عادی'}</p>
                            </div>
                        </div>
                    </div>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        {mounted ? (
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-white border border-[#D4B06A] text-[#D4B06A] rounded-xl font-bold mb-2"
                            >
                                <Suspense fallback={<div className="w-4 h-4" />}>
                                    <Icons.IoPersonOutline className="w-4 h-4" />
                                </Suspense>
                                پنل کاربری
                            </motion.button>
                        ) : (
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-white border border-[#D4B06A] text-[#D4B06A] rounded-xl font-bold mb-2">
                                پنل کاربری
                            </button>
                        )}
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-red-50 text-red-600 rounded-xl font-bold">
                        <Suspense fallback={<div className="w-4 h-4" />}>
                            <Icons.IoLogOutOutline className="w-4 h-4" />
                        </Suspense>
                        خروج از حساب
                    </button>
                </div>
            )
        }

        return (
            <div className="border-t border-[#E8E2D8] pt-4 mt-4">
                <Link href="/auth/user/login" onClick={() => setIsMobileMenuOpen(false)}>
                    {mounted ? (
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white rounded-xl font-bold shadow-md"
                        >
                            <Suspense fallback={<div className="w-4 h-4" />}>
                                <Icons.HiOutlineUser className="w-4 h-4" />
                            </Suspense>
                            ورود | ثبت‌نام
                        </motion.button>
                    ) : (
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white rounded-xl font-bold shadow-md">
                            ورود | ثبت‌نام
                        </button>
                    )}
                </Link>
            </div>
        )
    }, [session, mounted, handleLogout])

    //  رندر نهایی با Suspense برای محتوای داینامیک
    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-lg py-3 border-b border-[#D4B06A]/20'
                    : 'bg-white/80 backdrop-blur-sm py-5'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* لوگو - حذف انیمیشن‌های غیرضروری */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4B06A] to-[#B8922E] flex items-center justify-center shadow-md">
                                    <Suspense fallback={<div className="w-5 h-5" />}>
                                        <Icons.GiLaurelCrown className="w-5 h-5 text-white" />
                                    </Suspense>
                                </div>
                            </div>
                            <div>
                                <span className="text-xl font-black tracking-tight text-[#2C2418]">
                                    مراسمینو
                                </span>
                                <span className="text-[10px] block font-medium tracking-wide text-[#8E8276]">
                                    برگزارکننده حرفه‌ای مراسم
                                </span>
                            </div>
                        </Link>

                        {/* منوی دسکتاپ - حذف انیمیشن‌های سنگین */}
                        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
                            {menuItems.map((item, idx) => (
                                <div key={idx} className="relative">
                                    {item.dropdown ? (
                                        <div
                                            onMouseEnter={() => setActiveDropdown(idx)}
                                            onMouseLeave={() => setActiveDropdown(null)}
                                        >
                                            <button
                                                className={`px-4 lg:px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-1.5 group ${isScrolled
                                                    ? 'text-[#2C2418] hover:text-[#D4B06A] hover:bg-[#F5F2ED]'
                                                    : 'text-[#2C2418] hover:text-[#D4B06A] hover:bg-[#F5F2ED]'
                                                    }`}
                                            >
                                                <span>{item.name}</span>
                                                <Suspense fallback={<div className="w-3.5 h-3.5" />}>
                                                    <Icons.IoChevronDownOutline className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === idx ? 'rotate-180' : ''}`} />
                                                </Suspense>
                                            </button>

                                            {activeDropdown === idx && mounted && (
                                                <Suspense fallback={<div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl p-4" />}>
                                                    <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-[#D4B06A]/20 overflow-hidden">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4B06A]/5 to-transparent" />
                                                        {item.dropdown.map((sub, subIdx) => {
                                                            const IconComponent = Icons[sub.icon] || Icons.GiPartyPopper
                                                            return (
                                                                <Link
                                                                    key={subIdx}
                                                                    href={sub.href}
                                                                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-gradient-to-r hover:from-[#D4B06A]/10 hover:to-transparent transition-all duration-200 group"
                                                                >
                                                                    <Suspense fallback={<div className="w-5 h-5" />}>
                                                                        <IconComponent className="w-5 h-5 text-[#D4B06A] group-hover:scale-110 transition-transform duration-300" />
                                                                    </Suspense>
                                                                    <span className="text-sm font-medium text-[#2C2418] group-hover:text-[#D4B06A]">
                                                                        {sub.name}
                                                                    </span>
                                                                </Link>
                                                            )
                                                        })}
                                                    </div>
                                                </Suspense>
                                            )}
                                        </div>
                                    ) : (
                                        <Link href={item.href}>
                                            <div
                                                className={`px-4 lg:px-5 py-2.5 rounded-xl font-medium transition-all duration-300 relative group ${isScrolled
                                                    ? 'text-[#2C2418] hover:text-[#D4B06A] hover:bg-[#F5F2ED]'
                                                    : 'text-[#2C2418] hover:text-[#D4B06A] hover:bg-[#F5F2ED]'
                                                    }`}
                                            >
                                                {item.name}
                                                {item.isActive && (
                                                    <div className="absolute -bottom-1 right-2 left-2 h-0.5 bg-gradient-to-r from-[#D4B06A] to-[#F5D89C] rounded-full" />
                                                )}
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* ابزارها */}
                        <div className="flex items-center gap-2 lg:gap-3">
                            {/* دکمه تماس سریع */}
                            <Link href="tel:+982188888888" className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F5F2ED] hover:bg-[#E8E2D8] transition-colors">
                                <Suspense fallback={<div className="w-4 h-4" />}>
                                    <Icons.FaPhone className="w-4 h-4 text-[#D4B06A]" />
                                </Suspense>
                                <span className="text-sm font-medium text-[#2C2418]">۰۲۱-۸۸۸۸۸۸۸۸</span>
                            </Link>

                            {renderAuthButton}

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2.5 rounded-xl transition-all duration-300 text-[#2C2418] hover:text-[#D4B06A] hover:bg-[#F5F2ED]"
                            >
                                <Suspense fallback={<div className="w-6 h-6" />}>
                                    {isMobileMenuOpen ?
                                        <Icons.HiOutlineX className="w-6 h-6" /> :
                                        <Icons.HiOutlineMenu className="w-6 h-6" />
                                    }
                                </Suspense>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* منوی موبایل */}
            {isMobileMenuOpen && mounted && (
                <Suspense fallback={<div className="fixed inset-0 z-40 bg-white pt-24 px-4" />}>
                    <div className="fixed inset-0 z-40 bg-white pt-24 px-4 overflow-y-auto md:hidden">
                        <nav className="flex flex-col gap-2">
                            {menuItems.map((item, idx) => (
                                <div key={idx}>
                                    {item.dropdown ? (
                                        <div>
                                            <div className="px-4 py-3.5 text-[#2C2418] font-bold border-b border-[#E8E2D8]">
                                                {item.name}
                                            </div>
                                            <div className="pr-4 py-2 space-y-1">
                                                {item.dropdown.map((sub, subIdx) => {
                                                    const IconComponent = Icons[sub.icon] || Icons.GiPartyPopper
                                                    return (
                                                        <Link
                                                            key={subIdx}
                                                            href={sub.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-gradient-to-r hover:from-[#D4B06A]/10 hover:to-transparent transition-all"
                                                        >
                                                            <Suspense fallback={<div className="w-5 h-5" />}>
                                                                <IconComponent className="w-5 h-5 text-[#D4B06A]" />
                                                            </Suspense>
                                                            <span className="text-sm text-[#2C2418]">{sub.name}</span>
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`block px-4 py-3.5 rounded-xl font-medium transition-all ${item.isActive
                                                ? 'text-[#D4B06A] bg-gradient-to-r from-[#D4B06A]/10 to-transparent'
                                                : 'text-[#2C2418] hover:bg-[#F5F2ED]'
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    )}
                                </div>
                            ))}

                            {/* لینک‌های تماس در موبایل */}
                            <div className="border-t border-[#E8E2D8] pt-4 mt-4">
                                <Link href="tel:+982188888888" className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-[#F5F2ED] transition-colors">
                                    <Suspense fallback={<div className="w-5 h-5" />}>
                                        <Icons.FaPhone className="w-5 h-5 text-[#D4B06A]" />
                                    </Suspense>
                                    <span className="text-sm text-[#2C2418]">تماس با ما: ۰۲۱-۸۸۸۸۸۸۸۸</span>
                                </Link>
                            </div>

                            {/* شبکه‌های اجتماعی */}
                            <div className="border-t border-[#E8E2D8] pt-4 mt-2">
                                <p className="text-xs text-gray-500 mb-3 px-4">ما را در شبکه‌های اجتماعی دنبال کنید</p>
                                <div className="flex justify-center gap-3">
                                    {socialIcons.map((social, idx) => {
                                        const IconComponent = Icons[social.icon]
                                        return (
                                            <a
                                                key={idx}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-full bg-[#F5F2ED] flex items-center justify-center hover:bg-[#E8E2D8] transition-colors"
                                                aria-label={social.label}
                                            >
                                                <Suspense fallback={<div className="w-5 h-5" />}>
                                                    <IconComponent className="w-5 h-5 text-[#2C2418] hover:text-[#D4B06A]" />
                                                </Suspense>
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>

                            {renderMobileAuthButton}
                        </nav>
                    </div>
                </Suspense>
            )}
        </>
    )
}