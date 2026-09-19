// app/user/layout.js
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import {
  PiCrownSimpleFill,
  PiSignOut,
  PiUserCircle,
  PiBuilding,
  PiTicket,
  PiPlusCircle,
  PiListChecks,
  PiCurrencyDollar,
  PiWallet,
  PiCaretDown
} from "react-icons/pi";

export default function UserLayout({ children }) {

  const pathname = usePathname();

  const logoutHandler = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const isActive = (path) => pathname === path;

  return (
    <div className="min-h-screen">

      {/* 
        ✅ Header حذف شد چون در app/layout.js هست (Navbar)
        ✅ به جای آن، فاصله pt-20 برای fixed navbar
      */}

      <div className="pt-20 md:pt-24 lg:pt-28">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">

            {/* Sidebar - مثل کارت لاگین */}
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
                      پنل کاربری
                    </h2>
                  </div>
                  <p className="text-white/80 text-xs sm:text-sm mt-1 sm:mt-2">مدیریت حساب کاربری شما</p>
                </div>

                <nav className="p-3 sm:p-4">
                  <div className="space-y-1 sm:space-y-1.5">
                    <Link
                      href="/user/profile"
                      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-300 text-sm sm:text-base ${isActive("/user/profile")
                        ? "bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 text-[#B8922E] font-medium border-r-4 border-[#D4B06A]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#D4B06A]"
                        }`}
                    >
                      <PiUserCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>ویرایش پروفایل</span>
                    </Link>

                    <Link
                      href="/user/halls/reservatios"
                      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-300 text-sm sm:text-base ${isActive("/user/halls/reservatios")
                        ? "bg-gradient-to-r from-[#D4B06A]/10 to-[#B8922E]/10 text-[#B8922E] font-medium border-r-4 border-[#D4B06A]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#D4B06A]"
                        }`}
                    >
                      <PiBuilding className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>تالارهای رزرو شده</span>
                    </Link>

                    {/* Dropdown تیکت های پشتیبانی */}
                    <div className="relative group">
                      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#D4B06A] transition-all duration-300 cursor-pointer text-sm sm:text-base">
                        <PiTicket className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="flex-1">تیکت های پشتیبانی</span>
                        <PiCaretDown className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-180 transition-transform" />
                      </div>
                      <div className="mr-6 sm:mr-8 mt-1 space-y-1 overflow-hidden max-h-0 group-hover:max-h-48 transition-all duration-300">
                        <Link href="/user/tickets/create" className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-[#D4B06A] hover:bg-gray-50 rounded-lg transition-colors">
                          <PiPlusCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          ایجاد تیکت جدید
                        </Link>
                        <Link href="/user/tickets" className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-[#D4B06A] hover:bg-gray-50 rounded-lg transition-colors">
                          <PiListChecks className="w-3 h-3 sm:w-4 sm:h-4" />
                          همه تیکت ها
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
                        <Link href="/user/transactions" className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-[#D4B06A] hover:bg-gray-50 rounded-lg transition-colors">
                          <PiListChecks className="w-3 h-3 sm:w-4 sm:h-4" />
                          تراکنش ها
                        </Link>
                        <Link href="/user/wallet" className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-[#D4B06A] hover:bg-gray-50 rounded-lg transition-colors">
                          <PiWallet className="w-3 h-3 sm:w-4 sm:h-4" />
                          کیف پول
                        </Link>
                      </div>
                    </div>

                    {/* دکمه خروج با استایل مشابه لاگین */}
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

            {/* Main Content - مثل کارت لاگین */}
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

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff",
              color: "#333",
              border: "1px solid #e5e7eb",
              padding: "12px 16px",
              borderRadius: "10px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#ffffff"
              }
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff"
              }
            }
          }}
        />
      </div>

      {/* 
        ✅ Footer حذف شد چون در app/layout.js هست
      */}
    </div>
  );
}