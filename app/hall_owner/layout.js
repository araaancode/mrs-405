"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { motion } from "framer-motion";
import {
  PiCrownSimpleFill,
  PiSignOut,
  PiUserCircle,
  PiBuilding,
  PiTicket,
  PiPlusCircle,
  PiListChecks,
  PiMegaphone,
  PiPlus,
  PiNewspaper,
  PiCurrencyDollar,
  PiWallet,
  PiCaretDown,
  PiCalendarCheck
} from "react-icons/pi";

export default function HallOwnerLayout({ children }) {

  const pathname = usePathname();

  const logoutHandler = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const isActive = (path) => pathname === path;

  return (
    <div className="min-h-screen">

      <Header />

      <div className="pt-20 md:pt-24 lg:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar - مثل کارت لاگین */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-80 w-full"
            >
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden sticky top-28">

                {/* Header sidebar با تم طلایی */}
                <div className="bg-gradient-to-r from-[#D4B06A] to-[#B8922E] px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <PiCrownSimpleFill className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-black text-white">
                      پنل تالاردار
                    </h2>
                  </div>
                  <p className="text-white/80 text-sm mt-2">مدیریت تالارهای شما</p>
                </div>

                <nav className="p-4">
                  <div className="space-y-1.5">
                    <Link
                      href="/hall_owner/profile"
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive("/hall_owner/profile")
                        ? "bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 text-[#B8922E] font-medium border-r-4 border-[#D4B06A]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#D4B06A]"
                        }`}
                    >
                      <PiUserCircle className="w-5 h-5" />
                      <span>ویرایش پروفایل</span>
                    </Link>

                    {/* Dropdown تالارها */}
                    <div className="relative group">
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${pathname.includes("/hall_owner/halls")
                        ? "bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 text-[#B8922E] font-medium border-r-4 border-[#D4B06A]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#D4B06A]"
                        }`}
                      >
                        <PiBuilding className="w-5 h-5" />
                        <span className="flex-1">تالارها</span>
                        <PiCaretDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                      </div>
                      <div className="mr-8 mt-1 space-y-1 overflow-hidden max-h-0 group-hover:max-h-48 transition-all duration-300">
                        <Link href="/hall_owner/halls/create" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#D4B06A] hover:bg-gray-50 rounded-lg transition-colors">
                          <PiPlusCircle className="w-4 h-4" />
                          ایجاد تالار جدید
                        </Link>
                        <Link href="/hall_owner/halls" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#D4B06A] hover:bg-gray-50 rounded-lg transition-colors">
                          <PiListChecks className="w-4 h-4" />
                          همه تالارها
                        </Link>
                      </div>
                    </div>

                    <Link
                      href="/hall_owner/reservations"
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive("/hall_owner/reservations")
                        ? "bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 text-[#B8922E] font-medium border-r-4 border-[#D4B06A]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#D4B06A]"
                        }`}
                    >
                      <PiCalendarCheck className="w-5 h-5" />
                      <span>رزروها</span>
                    </Link>

                    {/* Dropdown تیکت های پشتیبانی */}
                    <div className="relative group">
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#D4B06A] transition-all duration-300 cursor-pointer">
                        <PiTicket className="w-5 h-5" />
                        <span className="flex-1">تیکت های پشتیبانی</span>
                        <PiCaretDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                      </div>
                      <div className="mr-8 mt-1 space-y-1 overflow-hidden max-h-0 group-hover:max-h-48 transition-all duration-300">
                        <Link href="/hall_owner/tickets/create" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#D4B06A] hover:bg-gray-50 rounded-lg transition-colors">
                          <PiPlusCircle className="w-4 h-4" />
                          ایجاد تیکت جدید
                        </Link>
                        <Link href="/hall_owner/tickets" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#D4B06A] hover:bg-gray-50 rounded-lg transition-colors">
                          <PiListChecks className="w-4 h-4" />
                          همه تیکت ها
                        </Link>
                      </div>
                    </div>

                    {/* Dropdown آگهی ها */}
                    <div className="relative group">
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#D4B06A] transition-all duration-300 cursor-pointer">
                        <PiMegaphone className="w-5 h-5" />
                        <span className="flex-1">آگهی ها</span>
                        <PiCaretDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                      </div>
                      <div className="mr-8 mt-1 space-y-1 overflow-hidden max-h-0 group-hover:max-h-48 transition-all duration-300">
                        <Link href="/hall_owner/ads/create" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#D4B06A] hover:bg-gray-50 rounded-lg transition-colors">
                          <PiPlus className="w-4 h-4" />
                          ایجاد آگهی جدید
                        </Link>
                        <Link href="/hall_owner/ads" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#D4B06A] hover:bg-gray-50 rounded-lg transition-colors">
                          <PiNewspaper className="w-4 h-4" />
                          همه آگهی ها
                        </Link>
                      </div>
                    </div>

                    {/* Dropdown امور مالی */}
                    <div className="relative group">
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#D4B06A] transition-all duration-300 cursor-pointer">
                        <PiCurrencyDollar className="w-5 h-5" />
                        <span className="flex-1">امور مالی</span>
                        <PiCaretDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                      </div>
                      <div className="mr-8 mt-1 space-y-1 overflow-hidden max-h-0 group-hover:max-h-48 transition-all duration-300">
                        <Link href="/hall_owner/transactions" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#D4B06A] hover:bg-gray-50 rounded-lg transition-colors">
                          <PiListChecks className="w-4 h-4" />
                          تراکنش ها
                        </Link>
                        <Link href="/hall_owner/wallet" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#D4B06A] hover:bg-gray-50 rounded-lg transition-colors">
                          <PiWallet className="w-4 h-4" />
                          کیف پول
                        </Link>
                      </div>
                    </div>

                    {/* دکمه خروج */}
                    <button
                      onClick={logoutHandler}
                      className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-xl transition-all duration-300 group"
                    >
                      <PiSignOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      خروج از حساب
                    </button>
                  </div>
                </nav>
              </div>
            </motion.aside>

            {/* Main Content */}
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1"
            >
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 p-6 md:p-8">
                {children}
              </div>
            </motion.main>

          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}