"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Header from "@/components/ui/Header";
import { motion } from "framer-motion";
import {
  PiCrownSimpleFill,
  PiSignOut,
  PiUserCircle,
  PiBuilding,
  PiBus,
  PiForkKnife,
  PiHouse,
  PiTicket,
  PiPlusCircle,
  PiListChecks,
  PiMegaphone,
  PiPlus,
  PiNewspaper,
  PiCurrencyDollar,
  PiWallet,
  PiCaretDown,
  PiUsers
} from "react-icons/pi";

export default function AdminLayout({ children }) {

  const pathname = usePathname();

  const logoutHandler = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const isActive = (path) => pathname === path;

  return (
    <div className="min-h-screen ">

      <Header />

      <div className="pt-20 md:pt-24 lg:pt-28">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">

            {/* Sidebar - کاملاً رسپانسیو */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-80 w-full"
            >
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden sticky top-28">

                {/* Header sidebar با تم طلایی */}
                <div className="bg-gradient-to-r from-[#D4B06A] to-[#B8922E] px-4 sm:px-6 py-4 sm:py-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl">
                      <PiCrownSimpleFill className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      پنل مدیریت
                    </h2>
                  </div>
                  <p className="text-white/80 text-xs sm:text-sm mt-1 sm:mt-2">مدیریت کامل سیستم</p>
                </div>

                <nav className="p-3 sm:p-4">
                  <div className="space-y-1 sm:space-y-1.5">

                    {/* ویرایش پروفایل */}
                    <Link
                      href="/admin/profile"
                      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-300 text-sm sm:text-base ${isActive("/admin/profile")
                        ? "bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 text-[#B8922E] font-medium border-r-4 border-[#D4B06A]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#D4B06A]"
                        }`}
                    >
                      <PiUserCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>ویرایش پروفایل</span>
                    </Link>

                    {/* کاربران */}
                    <Link
                      href="/admin/users"
                      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-300 text-sm sm:text-base ${isActive("/admin/users")
                        ? "bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 text-[#B8922E] font-medium border-r-4 border-[#D4B06A]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#D4B06A]"
                        }`}
                    >
                      <PiUsers className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>کاربران</span>
                    </Link>

                    {/* تالارها */}
                    <Link
                      href="/admin/halls"
                      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-300 text-sm sm:text-base ${isActive("/admin/halls")
                        ? "bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 text-[#B8922E] font-medium border-r-4 border-[#D4B06A]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#D4B06A]"
                        }`}
                    >
                      <PiBuilding className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>تالارها</span>
                    </Link>

                    {/* تیکت های پشتیبانی */}
                    <Link
                      href="/admin/tickets"
                      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-300 text-sm sm:text-base ${isActive("/admin/tickets")
                        ? "bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 text-[#B8922E] font-medium border-r-4 border-[#D4B06A]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#D4B06A]"
                        }`}
                    >
                      <PiTicket className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>تیکت های پشتیبانی</span>
                    </Link>

                    {/* آگهی ها */}
                    {/* <Link
                      href="/admin/ads"
                      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-300 text-sm sm:text-base ${isActive("/admin/ads")
                        ? "bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 text-[#B8922E] font-medium border-r-4 border-[#D4B06A]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#D4B06A]"
                        }`}
                    >
                      <PiMegaphone className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>آگهی ها</span>
                    </Link> */}

                    {/* Dropdown سفارش ها */}
                    <div className="relative group">
                      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#D4B06A] transition-all duration-300 cursor-pointer text-sm sm:text-base">
                        <PiListChecks className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="flex-1">سفارش ها</span>
                        <PiCaretDown className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-180 transition-transform" />
                      </div>
                      <div className="mr-6 sm:mr-8 mt-1 space-y-1 overflow-hidden max-h-0 group-hover:max-h-48 transition-all duration-300">
                        <Link href="/admin/reservations/halls" className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-[#D4B06A] hover:bg-gray-50 rounded-lg transition-colors">
                          رزروهای تالار
                        </Link>
                      </div>
                    </div>

                    {/* Dropdown امور مالی */}
                    <div className="relative group">
                      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#D4B06A] transition-all duration-300 cursor-pointer text-sm sm:text-base">
                        <PiCurrencyDollar className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="flex-1">امور مالی</span>
                        <PiCaretDown className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-180 transition-transform" />
                      </div>
                      <div className="mr-6 sm:mr-8 mt-1 space-y-1 overflow-hidden max-h-0 group-hover:max-h-48 transition-all duration-300">
                        <Link href="/admin/transactions" className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-[#D4B06A] hover:bg-gray-50 rounded-lg transition-colors">
                          <PiListChecks className="w-3 h-3 sm:w-4 sm:h-4" />
                          تراکنش ها
                        </Link>
                        <Link href="/admin/wallet" className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-[#D4B06A] hover:bg-gray-50 rounded-lg transition-colors">
                          <PiWallet className="w-3 h-3 sm:w-4 sm:h-4" />
                          کیف پول
                        </Link>
                      </div>
                    </div>

                    {/* دکمه خروج */}
                    <button
                      onClick={logoutHandler}
                      className="w-full mt-3 sm:mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-xl transition-all duration-300 group"
                    >
                      <PiSignOut className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                      خروج از حساب
                    </button>
                  </div>
                </nav>
              </div>
            </motion.aside>

            {/* Main Content - کاملاً رسپانسیو */}
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 min-w-0"

            >
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 p-4 sm:p-6 md:p-8">
                {children}
              </div>
            </motion.main>

          </div>
        </div>
      </div>

    </div>
  );
}