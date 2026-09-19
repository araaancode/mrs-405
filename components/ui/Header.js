// components/ui/Header.jsx
"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { PiUserCircle, PiSignOut } from "react-icons/pi";

export default function Header() {
    const { data: session } = useSession();

    return (
        <header className="fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
                <Link href="/" className="text-xl font-black text-[#2C2418]">
                    سامانه <span className="text-[#D4B06A]">تالار</span>
                </Link>

                <nav className="flex items-center gap-4">
                    {session ? (
                        <>
                            <Link
                                href="/hall_owner/profile"
                                className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#D4B06A]"
                            >
                                <PiUserCircle className="w-5 h-5" />
                                {session.user?.name || "حساب من"}
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                                <PiSignOut className="w-4 h-4" />
                                خروج
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="px-4 py-2 bg-[#D4B06A] text-white text-sm rounded-lg font-bold hover:bg-[#c39f59] transition-colors"
                        >
                            ورود
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}