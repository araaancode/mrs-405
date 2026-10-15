// components/layout/Navbar.jsx
'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    PiBuildings,
    PiCalendarCheck,
    PiUser,
    PiSignIn,
    PiList,
    PiX,
    PiHouse,
    PiSignOut,
    PiUserCircle,
    PiCaretDown,
    PiInfo,
    PiPhone,
    PiTicket,
} from 'react-icons/pi'
import NotificationBell from '@/components/notifications/NotificationBell'

/* ============================================================
   Constants
   ============================================================ */
const NAV_LINKS = [
    { href: '/', label: 'خانه', icon: PiHouse },
    { href: '/halls', label: 'تالارها', icon: PiBuildings },
    { href: '/about', label: 'درباره ما', icon: PiInfo },
    { href: '/contact', label: 'تماس با ما', icon: PiPhone },
]

const GOLD_GRADIENT = 'linear-gradient(135deg, #E0C67B 0%, #C6A14C 50%, #A8853A 100%)'

const USER_MENU_ITEMS = [
    { href: '/user/profile', label: 'پروفایل من', icon: PiUserCircle },
    { href: '/user/reservations', label: 'رزروهای من', icon: PiCalendarCheck },
    { href: '/user/tickets', label: 'تیکت‌های پشتیبانی', icon: PiTicket },
]

/* ============================================================
   DeskLink — لینک دسکتاپ با indicator
   ============================================================ */
const DeskLink = memo(function DeskLink({ link, active }) {
    const Icon = link.icon
    return (
        <Link
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={`
                relative flex items-center gap-2
                px-4 py-2 rounded-xl
                text-[13.5px] font-medium
                transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A14C]/40
                ${
                    active
                        ? 'text-[#85672C] bg-[#FBF7EC]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
            `}
        >
            <Icon className="w-4 h-4" aria-hidden="true" />
            <span>{link.label}</span>

            {active && (
                <motion.span
                    layoutId="navbarIndicator"
                    className="absolute -bottom-[21px] left-3 right-3 h-[2px] rounded-full"
                    style={{ backgroundImage: GOLD_GRADIENT }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
            )}
        </Link>
    )
})

/* ============================================================
   MobileLink
   ============================================================ */
const MobileLink = memo(function MobileLink({ link, active, onClick }) {
    const Icon = link.icon
    return (
        <Link
            href={link.href}
            onClick={onClick}
            aria-current={active ? 'page' : undefined}
            className={`
                flex items-center gap-3
                px-4 py-3 rounded-xl
                text-[13.5px] font-medium
                transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A14C]/40
                ${
                    active
                        ? 'bg-[#FBF7EC] text-[#85672C]'
                        : 'text-slate-600 hover:bg-slate-50'
                }
            `}
        >
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span>{link.label}</span>
        </Link>
    )
})

/* ============================================================
   UserDropdown
   ============================================================ */
const UserDropdown = memo(function UserDropdown({
    user,
    isOpen,
    onClose,
    onLogout,
    menuRef,
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={menuRef}
                    role="menu"
                    aria-label="منوی کاربر"
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                    className="
                        absolute left-0 mt-2 w-64
                        bg-white rounded-2xl
                        border border-slate-100
                        shadow-[0_8px_32px_rgba(15,23,42,0.10)]
                        py-1.5 z-50
                        overflow-hidden
                    "
                >
                    {/* هدر اطلاعات کاربر */}
                    <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-[13px] font-bold text-slate-900 truncate">
                            {user.full_name || 'کاربر'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                            {user.email || user.phone || '—'}
                        </p>
                    </div>

                    {/* آیتم‌های منو */}
                    <div className="py-1">
                        {USER_MENU_ITEMS.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    role="menuitem"
                                    onClick={onClose}
                                    className="
                                        flex items-center gap-2.5
                                        px-4 py-2.5
                                        text-[13px] text-slate-700
                                        hover:bg-[#FBF7EC] hover:text-[#85672C]
                                        focus-visible:outline-none focus-visible:bg-[#FBF7EC]
                                        transition-colors duration-200
                                    "
                                >
                                    <Icon
                                        className="w-4 h-4 text-slate-400"
                                        aria-hidden="true"
                                    />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </div>

                    {/* خروج */}
                    <div className="border-t border-slate-100 py-1">
                        <button
                            type="button"
                            role="menuitem"
                            onClick={onLogout}
                            className="
                                flex items-center gap-2.5 w-full
                                px-4 py-2.5
                                text-[13px] text-rose-600
                                hover:bg-rose-50
                                focus-visible:outline-none focus-visible:bg-rose-50
                                transition-colors duration-200
                            "
                        >
                            <PiSignOut className="w-4 h-4" aria-hidden="true" />
                            خروج از حساب
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
})

/* ============================================================
   Navbar
   ============================================================ */
export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    const userMenuRef = useRef(null)
    const userButtonRef = useRef(null)

    const pathname = usePathname()
    const { data: session, status } = useSession()
    const user = session?.user

    /* ---------- Active detection ---------- */
    const isActive = useCallback(
        (href) => {
            if (href === '/') return pathname === '/'
            return pathname?.startsWith(href)
        },
        [pathname]
    )

    /* ---------- بستن منوها با تغییر مسیر ---------- */
    useEffect(() => {
        setIsOpen(false)
        setUserMenuOpen(false)
    }, [pathname])

    /* ---------- بستن user menu با کلیک بیرون ---------- */
    useEffect(() => {
        if (!userMenuOpen) return

        const handleClickOutside = (e) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(e.target) &&
                userButtonRef.current &&
                !userButtonRef.current.contains(e.target)
            ) {
                setUserMenuOpen(false)
            }
        }

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setUserMenuOpen(false)
                userButtonRef.current?.focus()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [userMenuOpen])

    /* ---------- Scroll effect با RAF ---------- */
    useEffect(() => {
        let rafId = null
        const handleScroll = () => {
            if (rafId) return
            rafId = requestAnimationFrame(() => {
                setScrolled(window.scrollY > 10)
                rafId = null
            })
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()
        return () => {
            window.removeEventListener('scroll', handleScroll)
            if (rafId) cancelAnimationFrame(rafId)
        }
    }, [])

    /* ---------- Logout ---------- */
    const handleLogout = useCallback(async () => {
        setUserMenuOpen(false)
        setIsOpen(false)
        await signOut({ callbackUrl: '/', redirect: true })
    }, [])

    /* ---------- User display name ---------- */
    const displayName = user?.full_name?.split(' ')[0] || user?.name || 'کاربر'

    return (
        <nav
            role="navigation"
            aria-label="ناوبری اصلی"
            className={`
                sticky top-0 z-40 font-iransans
                transition-[background-color,backdrop-filter,box-shadow,border-color] duration-300
                ${
                    scrolled
                        ? 'bg-white/90 backdrop-blur-xl shadow-[0_2px_12px_rgba(15,23,42,0.06)] border-b border-slate-100'
                        : 'bg-white/80 backdrop-blur-md border-b border-transparent'
                }
            `}
        >
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* ==================== Logo ==================== */}
                    <Link
                        href="/"
                        className="
                            flex items-center gap-2.5 group shrink-0
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A14C]/40
                            rounded-xl
                        "
                        aria-label="صفحه اصلی رزرو تالار"
                    >
                        <div
                            className="
                                w-10 h-10 rounded-xl
                                flex items-center justify-center
                                shadow-md shadow-[#C6A14C]/25
                                group-hover:shadow-lg group-hover:shadow-[#C6A14C]/40
                                group-hover:scale-105
                                transition-all duration-300
                            "
                            style={{ backgroundImage: GOLD_GRADIENT }}
                        >
                            <PiBuildings
                                className="w-5 h-5 text-white"
                                aria-hidden="true"
                            />
                        </div>
                        <span className="font-black text-lg text-slate-900 hidden sm:block tracking-tight">
                           مراسمینو
                        </span>
                    </Link>

                    {/* ==================== Desktop Navigation ==================== */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <DeskLink
                                key={link.href}
                                link={link}
                                active={isActive(link.href)}
                            />
                        ))}
                    </div>

                    {/* ==================== Actions ==================== */}
                    <div className="flex items-center gap-2">
                        {/* Loading */}
                        {status === 'loading' && (
                            <div
                                className="w-24 h-9 bg-slate-100 rounded-xl animate-pulse"
                                aria-hidden="true"
                            />
                        )}

                        {/* Authenticated */}
                        {status !== 'loading' && user && (
                            <>
                                <NotificationBell />

                                <div className="relative">
                                    <button
                                        ref={userButtonRef}
                                        type="button"
                                        onClick={() => setUserMenuOpen((v) => !v)}
                                        aria-expanded={userMenuOpen}
                                        aria-haspopup="menu"
                                        aria-label="منوی کاربر"
                                        className={`
                                            flex items-center gap-2
                                            ps-2.5 pe-2 py-1.5
                                            rounded-xl
                                            transition-colors duration-200
                                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A14C]/40
                                            ${
                                                userMenuOpen
                                                    ? 'bg-[#FBF7EC] ring-1 ring-[#EDDCA9]'
                                                    : 'hover:bg-slate-50'
                                            }
                                        `}
                                    >
                                        <div
                                            className="
                                                w-8 h-8 rounded-full
                                                flex items-center justify-center
                                                shadow-sm shadow-[#C6A14C]/25
                                                shrink-0
                                            "
                                            style={{ backgroundImage: GOLD_GRADIENT }}
                                        >
                                            <PiUser
                                                className="w-4 h-4 text-white"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <span className="hidden sm:block text-[13px] font-medium text-slate-800 max-w-[100px] truncate">
                                            {displayName}
                                        </span>
                                        <PiCaretDown
                                            className={`
                                                hidden sm:block w-3.5 h-3.5 text-slate-400
                                                transition-transform duration-200
                                                ${userMenuOpen ? 'rotate-180' : ''}
                                            `}
                                            aria-hidden="true"
                                        />
                                    </button>

                                    <UserDropdown
                                        user={user}
                                        isOpen={userMenuOpen}
                                        onClose={() => setUserMenuOpen(false)}
                                        onLogout={handleLogout}
                                        menuRef={userMenuRef}
                                    />
                                </div>
                            </>
                        )}

                        {/* Not Authenticated */}
                        {status !== 'loading' && !user && (
                            <Link
                                href="/auth/user/login"
                                className="
                                    flex items-center gap-2
                                    px-3.5 sm:px-4 py-2
                                    rounded-xl text-[13px] font-bold
                                    text-[#2A1F1F]
                                    shadow-md shadow-[#C6A14C]/25
                                    hover:shadow-lg hover:shadow-[#C6A14C]/40
                                    hover:-translate-y-0.5
                                    active:scale-95
                                    focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6A14C]/40
                                    transition-all duration-200
                                "
                                style={{ backgroundImage: GOLD_GRADIENT }}
                            >
                                <PiSignIn className="w-4 h-4" aria-hidden="true" />
                                <span className="hidden sm:inline">ورود / ثبت‌نام</span>
                                <span className="sm:hidden">ورود</span>
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setIsOpen((v) => !v)}
                            className="
                                md:hidden
                                w-10 h-10 rounded-xl
                                flex items-center justify-center
                                text-slate-600
                                hover:bg-slate-50 hover:text-slate-900
                                active:scale-95
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A14C]/40
                                transition-all duration-200
                            "
                            aria-label={isOpen ? 'بستن منو' : 'باز کردن منو'}
                            aria-expanded={isOpen}
                            aria-controls="mobile-menu"
                        >
                            {isOpen ? (
                                <PiX className="w-5 h-5" aria-hidden="true" />
                            ) : (
                                <PiList className="w-5 h-5" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ==================== Mobile Menu ==================== */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="md:hidden overflow-hidden border-t border-slate-100 bg-white"
                    >
                        <div className="px-3 py-3 space-y-1">
                            {NAV_LINKS.map((link) => (
                                <MobileLink
                                    key={link.href}
                                    link={link}
                                    active={isActive(link.href)}
                                    onClick={() => setIsOpen(false)}
                                />
                            ))}

                            {user && (
                                <div className="pt-2 mt-2 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="
                                            flex items-center gap-3 w-full
                                            px-4 py-3 rounded-xl
                                            text-[13.5px] font-medium text-rose-600
                                            hover:bg-rose-50
                                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40
                                            transition-colors duration-200
                                        "
                                    >
                                        <PiSignOut
                                            className="w-5 h-5"
                                            aria-hidden="true"
                                        />
                                        خروج از حساب
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}