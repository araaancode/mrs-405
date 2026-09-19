// components/layout/Navbar.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    PiBuildings,
    PiCalendarCheck,
    PiUser,
    PiSignIn,
    PiList,
    PiX,
    PiHouse,
    PiSignOut,
    PiUserCircle
} from "react-icons/pi";
import NotificationBell from "@/components/notifications/NotificationBell";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const user = session?.user;

    const navLinks = [
        { href: "/", label: "خانه", icon: PiHouse },
        { href: "/halls", label: "تالارها", icon: PiBuildings },
        { href: "/about", label: "درباره ما", icon: PiCalendarCheck },
        { href: "/contact", label: "تماس با ما", icon: PiCalendarCheck },
    ];

    const isActive = (href) => {
        if (href === "/") return pathname === "/";
        return pathname?.startsWith(href);
    };

    const handleLogout = async () => {
        await signOut({
            callbackUrl: "/",
            redirect: true
        });
    };

    return (
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#D4B06A] to-[#B8922E] rounded-xl flex items-center justify-center shadow-md">
                            <PiBuildings className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-black text-lg text-[#2C2418] hidden sm:block">
                            رزرو تالار
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            if (link.requireAuth && !user) return null;
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-xl 
                                        text-sm font-medium transition-all duration-200
                                        ${isActive(link.href)
                                            ? 'bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 text-[#D4B06A]'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-[#2C2418]'
                                        }
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-2">
                        {status === "loading" ? (
                            <div className="w-24 h-9 bg-gray-100 rounded-xl animate-pulse" />
                        ) : user ? (
                            <>
                                <NotificationBell />
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-[#D4B06A] to-[#B8922E] rounded-full flex items-center justify-center">
                                            <PiUser className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="hidden sm:block text-sm font-medium text-[#2C2418]">
                                            {user.full_name?.split(' ')[0] || 'کاربر'}
                                        </span>
                                    </button>

                                    {/* User Menu Dropdown */}
                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                                            >
                                                <div className="px-4 py-2 border-b border-gray-100">
                                                    <p className="text-sm font-bold text-[#2C2418]">
                                                        {user.full_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {user.role_fa || 'کاربر'}
                                                    </p>
                                                </div>
                                                <Link
                                                    href="/user/profile"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                                                >
                                                    <PiUserCircle className="w-4 h-4" />
                                                    پروفایل من
                                                </Link>



                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                                >
                                                    <PiSignOut className="w-4 h-4" />
                                                    خروج از حساب
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <Link
                                href="/auth/user/login"
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] text-white rounded-xl text-sm font-bold hover:shadow-lg transition"
                            >
                                <PiSignIn className="w-4 h-4" />
                                <span className="hidden sm:inline">ورود / ثبت‌نام</span>
                                <span className="sm:hidden">ورود</span>
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 rounded-xl hover:bg-gray-50 transition"
                            aria-label="منو"
                        >
                            {isOpen ? (
                                <PiX className="w-5 h-5 text-gray-600" />
                            ) : (
                                <PiList className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden overflow-hidden border-t border-gray-100 bg-white"
                    >
                        <div className="px-3 py-3 space-y-1">
                            {navLinks.map((link) => {
                                if (link.requireAuth && !user) return null;
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-xl 
                                            text-sm font-medium transition-all
                                            ${isActive(link.href)
                                                ? 'bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 text-[#D4B06A]'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {link.label}
                                    </Link>
                                );
                            })}

                            {user && (
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        handleLogout();
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
                                >
                                    <PiSignOut className="w-5 h-5" />
                                    خروج از حساب
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}