// app/admin/layout.jsx
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "@/components/ui/Header";
import {
  PiCrownSimpleFill,
  PiSignOut,
  PiUserCircle,
  PiBuildings,
  PiTicket,
  PiListChecks,
  PiCurrencyDollar,
  PiWallet,
  PiCaretDown,
  PiUsersThree,
  PiShieldCheckFill,
  PiSparkle,
} from "react-icons/pi";

/* ============================================================
   NavLink
   ============================================================ */
function NavLink({ href, icon: Icon, label, pathname, exact = false }) {
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`
        group relative flex items-center gap-3
        pl-3 pr-4 py-2.5 rounded-xl
        text-[13.5px] font-medium
        transition-all duration-300
        ${
          active
            ? "text-gold-700 bg-gradient-to-l from-gold-50/80 to-gold-50/40 shadow-sm shadow-gold-500/10"
            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/80"
        }
      `}
    >
      {/* نشانگر عمودی طلایی */}
      <span
        className={`
          absolute right-0 top-1/2 -translate-y-1/2
          w-[3px] rounded-full
          transition-all duration-300
          ${
            active
              ? "h-6 bg-gradient-to-b from-gold-400 to-gold-600"
              : "h-0 bg-transparent"
          }
        `}
      />

      {/* آیکون */}
      <span
        className={`
          w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
          transition-all duration-300
          ${
            active
              ? "bg-gradient-to-br from-gold-400 to-gold-600 text-white shadow-sm shadow-gold-500/25"
              : "bg-transparent text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-700"
          }
        `}
      >
        <Icon className="w-4 h-4" />
      </span>

      <span className="flex-1 text-right">{label}</span>

      {active && (
        <motion.span
          layoutId="adminActiveDot"
          className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0"
        />
      )}
    </Link>
  );
}

/* ============================================================
   NavDropdown
   ============================================================ */
function NavDropdown({
  id,
  icon: Icon,
  label,
  items,
  activePaths,
  pathname,
  openDropdown,
  toggleDropdown,
}) {
  const isOpen = openDropdown === id;
  const groupActive = activePaths.some((p) => pathname.startsWith(p));

  return (
    <div>
      <button
        type="button"
        onClick={() => toggleDropdown(id)}
        aria-expanded={isOpen}
        className={`
          w-full group relative flex items-center gap-3
          pl-3 pr-4 py-2.5 rounded-xl
          text-[13.5px] font-medium
          transition-all duration-300
          ${
            groupActive
              ? "text-gold-700 bg-gradient-to-l from-gold-50/80 to-gold-50/40 shadow-sm shadow-gold-500/10"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/80"
          }
        `}
      >
        <span
          className={`
            absolute right-0 top-1/2 -translate-y-1/2
            w-[3px] rounded-full
            transition-all duration-300
            ${
              groupActive
                ? "h-6 bg-gradient-to-b from-gold-400 to-gold-600"
                : "h-0 bg-transparent"
            }
          `}
        />

        <span
          className={`
            w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
            transition-all duration-300
            ${
              groupActive
                ? "bg-gradient-to-br from-gold-400 to-gold-600 text-white shadow-sm shadow-gold-500/25"
                : "bg-transparent text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-700"
            }
          `}
        >
          <Icon className="w-4 h-4" />
        </span>

        <span className="flex-1 text-right">{label}</span>

        <PiCaretDown
          className={`
            w-3.5 h-3.5 flex-shrink-0 transition-transform duration-300
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-1.5 mr-4 pr-4 border-r-2 border-gold-100 space-y-0.5 pb-1">
              {items.map((item) => {
                const ItemIcon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-2.5
                      px-3 py-2 rounded-lg
                      text-[12.5px] transition-all duration-150
                      ${
                        active
                          ? "text-gold-700 bg-gold-50 font-medium"
                          : "text-slate-400 hover:text-gold-700 hover:bg-gold-50"
                      }
                    `}
                  >
                    {ItemIcon && (
                      <ItemIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   Layout
   ============================================================ */
export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState(null);

  /* بستن dropdown با تغییر مسیر */
  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  const logoutHandler = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const toggleDropdown = (key) =>
    setOpenDropdown((prev) => (prev === key ? null : key));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFCF9] via-[#FAF8F2] to-[#F7F3E8] relative">
      {/* الگوی تزئینی پس‌زمینه */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.5]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(198,161,76,0.07) 0%, transparent 45%),
            radial-gradient(circle at 85% 70%, rgba(198,161,76,0.05) 0%, transparent 45%)
          `,
        }}
      />

      <Header />

      <div className="relative pt-20 md:pt-24 lg:pt-28">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* ==================== Sidebar ==================== */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="lg:w-64 xl:w-72 w-full flex-shrink-0"
            >
              <div
                className="
                  relative
                  bg-white/80 backdrop-blur-xl
                  rounded-2xl
                  border border-white/70
                  shadow-[0_8px_32px_rgba(198,161,76,0.10),0_2px_8px_rgba(0,0,0,0.04)]
                  lg:sticky lg:top-24
                  overflow-hidden
                "
              >
                {/* خط طلایی بالا */}
                <div className="h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600" />

                {/* ========== هدر سایدبار ========== */}
                <div className="px-5 pt-5 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div
                        className="
                          w-11 h-11 rounded-2xl
                          bg-gradient-to-br from-gold-400 to-gold-600
                          flex items-center justify-center
                          shadow-md shadow-gold-500/30
                        "
                      >
                        <PiCrownSimpleFill className="w-[18px] h-[18px] text-white" />
                      </div>
                      {/* نشان ادمین */}
                      <span
                        className="
                          absolute -bottom-0.5 -right-0.5
                          w-3 h-3 rounded-full
                          bg-emerald-400
                          border-[2.5px] border-white
                        "
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-[15px] font-bold text-slate-800 leading-tight">
                        پنل مدیریت
                      </h2>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <PiSparkle className="w-3 h-3 text-gold-500" />
                        مدیریت کامل سیستم
                      </p>
                    </div>
                  </div>
                </div>

                {/* جداکننده */}
                <div className="mx-5 h-px bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />

                {/* ========== منو ========== */}
                <nav className="px-3 py-4">
                  <div className="space-y-1">
                    <NavLink
                      href="/admin/profile"
                      icon={PiUserCircle}
                      label="ویرایش پروفایل"
                      pathname={pathname}
                    />
                    <NavLink
                      href="/admin/users"
                      icon={PiUsersThree}
                      label="کاربران"
                      pathname={pathname}
                    />
                    <NavLink
                      href="/admin/halls"
                      icon={PiBuildings}
                      label="تالارها"
                      pathname={pathname}
                    />
                    <NavLink
                      href="/admin/tickets"
                      icon={PiTicket}
                      label="تیکت‌های پشتیبانی"
                      pathname={pathname}
                    />

                    {/* جداکننده بخش دوم */}
                    <div className="py-2">
                      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent" />
                    </div>

                    <NavDropdown
                      id="orders"
                      icon={PiListChecks}
                      label="سفارش‌ها"
                      activePaths={["/admin/reservations"]}
                      pathname={pathname}
                      openDropdown={openDropdown}
                      toggleDropdown={toggleDropdown}
                      items={[
                        {
                          href: "/admin/reservations/halls",
                          label: "رزروهای تالار",
                        },
                      ]}
                    />

                    <NavDropdown
                      id="finance"
                      icon={PiCurrencyDollar}
                      label="امور مالی"
                      activePaths={[
                        "/admin/transactions",
                        "/admin/wallet",
                      ]}
                      pathname={pathname}
                      openDropdown={openDropdown}
                      toggleDropdown={toggleDropdown}
                      items={[
                        {
                          href: "/admin/transactions",
                          icon: PiListChecks,
                          label: "تراکنش‌ها",
                        },
                        {
                          href: "/admin/wallet",
                          icon: PiWallet,
                          label: "کیف پول",
                        },
                      ]}
                    />
                  </div>
                </nav>

                {/* ========== دکمه خروج ========== */}
                <div className="px-3 pb-4">
                  <div className="mx-2 mb-3 h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent" />

                  <button
                    onClick={logoutHandler}
                    className="
                      w-full flex items-center justify-center gap-2
                      px-4 py-2.5 rounded-xl
                      text-[13px] font-medium
                      text-slate-500
                      border border-transparent
                      hover:text-rose-600
                      hover:bg-rose-50/80
                      hover:border-rose-100
                      active:scale-95
                      transition-all duration-300
                      group
                    "
                  >
                    <PiSignOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    خروج از حساب
                  </button>
                </div>

                {/* خط طلایی پایین */}
                <div className="h-1 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
              </div>
            </motion.aside>

            {/* ==================== Main ==================== */}
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="flex-1 min-w-0"
            >
              <div
                className="
                  bg-white/85 backdrop-blur-sm
                  rounded-2xl
                  border border-white/70
                  shadow-[0_8px_32px_rgba(198,161,76,0.10),0_2px_8px_rgba(0,0,0,0.04)]
                  p-6 sm:p-8 md:p-10
                  min-h-[600px]
                "
              >
                {children}
              </div>
            </motion.main>
          </div>
        </div>
      </div>
    </div>
  );
}