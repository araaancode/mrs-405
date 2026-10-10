// components/layout/Navbar.jsx
"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
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
} from "react-icons/pi";
import NotificationBell from "@/components/notifications/NotificationBell";

/* ============================================================
   Constants — یک بار در ماژول
   ============================================================ */
const NAV_LINKS = [
    { href: "/", label: "خانه", icon: PiHouse },
    { href: "/halls", label: "تالارها", icon: PiBuildings },
    { href: "/about", label: "درباره ما", icon: PiInfo },
    { href: "/contact", label: "تماس با ما", icon: PiPhone },
];

/* ============================================================
   NavLink — memoized، بدون layout animation
   ============================================================ */
const NavLink = memo(function NavLink({ href, label, Icon, isActive }) {
    return (
        <Link
            href={href}
            prefetch
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-[13.5px] font-medium transition-colors duration-200 ${
                isActive
                    ? "text-gold-700 bg-gold-50"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
        >
            <Icon className="w-4 h-4" />
            {label}

            {/* ✅ نشانگر فعال با CSS — بدون layoutId */}
            {isActive && (
                <span
                    className="absolute -bottom-[21px] left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-gold-400 to-gold-600"
                    aria-hidden="true"
                />
            )}
        </Link>
    );
});

/* ============================================================
   Navbar
   ============================================================ */
export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const userMenuRef = useRef(null);
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const user = session?.user;

    /* ============================================================
       بستن منوها با تغییر مسیر
       ============================================================ */
    useEffect(() => {
        setIsOpen(false);
        setUserMenuOpen(false);
    }, [pathname]);

    /* ============================================================
       بستن user menu با کلیک بیرون
       ============================================================ */
    useEffect(() => {
        if (!userMenuOpen) return;

        const handleClickOutside = (e) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(e.target)
            ) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [userMenuOpen]);

    /* ============================================================
       Scroll effect — با RAF throttle
       ============================================================ */
    useEffect(() => {
        let rafId = null;
        let lastScrolled = false;

        const handleScroll = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                const next = window.scrollY > 10;
                if (next !== lastScrolled) {
                    lastScrolled = next;
                    setScrolled(next);
                }
                rafId = null;
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    /* ============================================================
       Active detection — useCallback برای پراپ پایدار
       ============================================================ */
    const isActive = useCallback(
        (href) => {
            if (href === "/") return pathname === "/";
            return pathname?.startsWith(href);
        },
        [pathname]
    );

    /* ============================================================
       Logout
       ============================================================ */
    const handleLogout = useCallback(async () => {
        setUserMenuOpen(false);
        setIsOpen(false);
        await signOut({ callbackUrl: "/", redirect: true });
    }, []);

    const toggleUserMenu = useCallback(() => {
        setUserMenuOpen((v) => !v);
    }, []);

    const toggleMobileMenu = useCallback(() => {
        setIsOpen((v) => !v);
    }, []);

    return (
        <nav
            className={`sticky top-0 z-40 transition-shadow duration-300 ${
                scrolled
                    ? "bg-white/95 shadow-[0_2px_12px_rgba(15,23,42,0.06)] border-b border-slate-100"
                    : "bg-white/90 border-b border-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* ==================== Logo ==================== */}
                    <Link
                        href="/"
                        prefetch
                        className="flex items-center gap-2.5 group flex-shrink-0"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-md shadow-gold-500/25 group-hover:shadow-lg group-hover:shadow-gold-500/40 transition-shadow duration-300">
                            <PiBuildings className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-black text-lg text-slate-900 hidden sm:block tracking-tight">
                            رزرو تالار
                        </span>
                    </Link>

                    {/* ==================== Desktop Navigation ==================== */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.href}
                                href={link.href}
                                label={link.label}
                                Icon={link.icon}
                                isActive={isActive(link.href)}
                            />
                        ))}
                    </div>

                    {/* ==================== Actions ==================== */}
                    <div className="flex items-center gap-2">
                        {/* Loading */}
                        {status === "loading" && (
                            <div className="w-24 h-9 bg-slate-100 rounded-xl animate-pulse" />
                        )}

                        {/* Authenticated */}
                        {status !== "loading" && user && (
                            <>
                                <NotificationBell />

                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        type="button"
                                        onClick={toggleUserMenu}
                                        aria-expanded={userMenuOpen}
                                        aria-haspopup="true"
                                        className={`flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl transition-colors duration-200 ${
                                            userMenuOpen
                                                ? "bg-gold-50 ring-1 ring-gold-200"
                                                : "hover:bg-slate-50"
                                        }`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-sm shadow-gold-500/25 flex-shrink-0">
                                            <PiUser className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="hidden sm:block text-[13px] font-medium text-slate-800 max-w-[100px] truncate">
                                            {user.full_name?.split(" ")[0] || "کاربر"}
                                        </span>
                                        <PiCaretDown
                                            className={`hidden sm:block w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                                                userMenuOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {/* -------- User Menu Dropdown — CSS-only -------- */}
                                    <div
                                        className={`absolute left-0 mt-2 w-60 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_32px_rgba(15,23,42,0.10)] py-1.5 z-50 overflow-hidden transition-all duration-200 origin-top ${
                                            userMenuOpen
                                                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                                                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                                        }`}
                                        role="menu"
                                        aria-hidden={!userMenuOpen}
                                    >
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="text-[13px] font-bold text-slate-900 truncate">
                                                {user.full_name || "کاربر"}
                                            </p>
                                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                                {user.email || user.phone || "—"}
                                            </p>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                href="/user/profile"
                                                prefetch
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-700 hover:bg-gold-50 hover:text-gold-700 transition-colors"
                                                role="menuitem"
                                            >
                                                <PiUserCircle className="w-4 h-4 text-slate-400" />
                                                پروفایل من
                                            </Link>

                                            <Link
                                                href="/user/reservations"
                                                prefetch
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-700 hover:bg-gold-50 hover:text-gold-700 transition-colors"
                                                role="menuitem"
                                            >
                                                <PiCalendarCheck className="w-4 h-4 text-slate-400" />
                                                رزروهای من
                                            </Link>

                                            <Link
                                                href="/user/tickets"
                                                prefetch
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-700 hover:bg-gold-50 hover:text-gold-700 transition-colors"
                                                role="menuitem"
                                            >
                                                <PiTicket className="w-4 h-4 text-slate-400" />
                                                تیکت‌های پشتیبانی
                                            </Link>
                                        </div>

                                        <div className="border-t border-slate-100 py-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-rose-600 hover:bg-rose-50 transition-colors"
                                                role="menuitem"
                                            >
                                                <PiSignOut className="w-4 h-4" />
                                                خروج از حساب
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Not Authenticated */}
                        {status !== "loading" && !user && (
                            <Link
                                href="/auth/user/login"
                                prefetch
                                className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-[13px] font-bold text-white bg-gradient-to-b from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 shadow-md shadow-gold-500/25 hover:shadow-lg hover:shadow-gold-500/40 transition-all duration-200"
                            >
                                <PiSignIn className="w-4 h-4" />
                                <span className="hidden sm:inline">ورود / ثبت‌نام</span>
                                <span className="sm:hidden">ورود</span>
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition-colors duration-200"
                            aria-label={isOpen ? "بستن منو" : "باز کردن منو"}
                            aria-expanded={isOpen}
                        >
                            {isOpen ? (
                                <PiX className="w-5 h-5" />
                            ) : (
                                <PiList className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ==================== Mobile Menu — CSS-only ==================== */}
            <div
                className={`md:hidden overflow-hidden border-t border-slate-100 bg-white transition-[max-height,opacity] duration-300 ease-out ${
                    isOpen
                        ? "max-h-[400px] opacity-100"
                        : "max-h-0 opacity-0"
                }`}
                aria-hidden={!isOpen}
            >
                <div className="px-3 py-3 space-y-1">
                    {NAV_LINKS.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                prefetch
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13.5px] font-medium transition-colors duration-200 ${
                                    active
                                        ? "bg-gold-50 text-gold-700"
                                        : "text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {link.label}
                            </Link>
                        );
                    })}

                    {user && (
                        <div className="pt-2 mt-2 border-t border-slate-100">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[13.5px] font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                                <PiSignOut className="w-5 h-5" />
                                خروج از حساب
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}