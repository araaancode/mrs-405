// components/layout/Footer.jsx
import Link from "next/link";
import {
    PiBuildings,
    PiPhone,
    PiEnvelope,
    PiMapPin,
    PiInstagramLogo,
    PiTelegramLogo,
    PiWhatsappLogo,
    PiArrowUpRight,
    PiHeart,
} from "react-icons/pi";

/* ============================================================
   داده‌ها
   ============================================================ */
const QUICK_LINKS = [
    { href: "/", label: "خانه" },
    { href: "/halls", label: "تالارها" },
    { href: "/about", label: "درباره ما" },
    { href: "/contact", label: "تماس با ما" },
];

const SERVICES = [
    { href: "/halls", label: "رزرو تالار" },
    { href: "/user/tickets", label: "پشتیبانی" },
    { href: "/faq", label: "سوالات متداول" },
    { href: "/terms", label: "قوانین و مقررات" },
];

const SOCIALS = [
    {
        href: "https://instagram.com",
        label: "اینستاگرام",
        icon: PiInstagramLogo,
        hoverColor: "hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600",
    },
    {
        href: "https://t.me",
        label: "تلگرام",
        icon: PiTelegramLogo,
        hoverColor: "hover:bg-gradient-to-br hover:from-sky-400 hover:to-sky-600",
    },
    {
        href: "https://wa.me",
        label: "واتساپ",
        icon: PiWhatsappLogo,
        hoverColor: "hover:bg-gradient-to-br hover:from-emerald-400 hover:to-emerald-600",
    },
];

const CONTACT = [
    {
        icon: PiPhone,
        value: "۰۲۱-۱۲۳۴۵۶۷۸",
        href: "tel:+982112345678",
        dir: "rtl",
    },
    {
        icon: PiEnvelope,
        value: "info@mrsapp.com",
        href: "mailto:info@mrsapp.com",
        dir: "ltr",
    },
    {
        icon: PiMapPin,
        value: "تهران، خیابان ولیعصر",
        href: null,
    },
];

/* ============================================================
   Sub-components
   ============================================================ */

/** لینک ستون‌های فوتر */
function FooterLink({ href, children }) {
    return (
        <Link
            href={href}
            className="
        group inline-flex items-center gap-1
        text-slate-400 hover:text-gold-400
        transition-colors duration-200
      "
        >
            <span>{children}</span>
            <PiArrowUpRight
                className="
          w-3 h-3 opacity-0 -translate-x-1
          group-hover:opacity-100 group-hover:translate-x-0
          transition-all duration-200
        "
            />
        </Link>
    );
}

/** عنوان ستون */
function ColumnTitle({ children }) {
    return (
        <h3 className="relative inline-block font-bold text-[13px] text-gold-400 mb-4 pb-2">
            {children}
            <span className="absolute bottom-0 right-0 w-8 h-0.5 rounded-full bg-gradient-to-r from-gold-400 to-gold-600" />
        </h3>
    );
}

/* ============================================================
   Footer
   ============================================================ */
export default function Footer() {
    const currentYear = new Date().toLocaleDateString("fa-IR", {
        year: "numeric",
    });

    return (
        <footer className="relative bg-gradient-to-br from-[#2C2418] via-[#221c13] to-[#1a1510] text-white mt-16 overflow-hidden">
            {/* الگوی تزئینی پس‌زمینه */}
            <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                    backgroundImage: `
            radial-gradient(circle at 15% 20%, rgba(198,161,76,0.08) 0%, transparent 45%),
            radial-gradient(circle at 85% 75%, rgba(198,161,76,0.06) 0%, transparent 45%)
          `,
                }}
            />

            {/* خط طلایی بالا */}
            <div className="h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent relative" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

                    {/* ==================== درباره ==================== */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2.5 mb-4 group"
                        >
                            <div
                                className="
                  w-11 h-11 rounded-xl
                  bg-gradient-to-br from-gold-400 to-gold-600
                  flex items-center justify-center
                  shadow-lg shadow-gold-500/25
                  group-hover:shadow-xl group-hover:shadow-gold-500/40
                  group-hover:scale-105
                  transition-all duration-300
                "
                            >
                                <PiBuildings className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-black text-lg text-white tracking-tight">
                                رزرو تالار
                            </span>
                        </Link>

                        <p className="text-[13px] text-slate-400 leading-relaxed mb-5">
                            سیستم جامع رزرو آنلاین تالارهای عروسی، همایش و مراسم با پرداخت
                            امن و آسان در سراسر ایران.
                        </p>

                        {/* شبکه‌های اجتماعی */}
                        <div className="flex items-center gap-2.5">
                            {SOCIALS.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        title={social.label}
                                        className={`
                      w-10 h-10 rounded-xl
                      flex items-center justify-center
                      bg-white/5
                      ring-1 ring-white/10
                      text-slate-300 hover:text-white
                      hover:scale-110 active:scale-95
                      hover:ring-transparent
                      shadow-sm hover:shadow-lg
                      transition-all duration-300
                      ${social.hoverColor}
                    `}
                                    >
                                        <Icon className="w-[18px] h-[18px]" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* ==================== دسترسی سریع ==================== */}
                    <div>
                        <ColumnTitle>دسترسی سریع</ColumnTitle>
                        <ul className="space-y-3 text-[13px]">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.href}>
                                    <FooterLink href={link.href}>{link.label}</FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ==================== خدمات ==================== */}
                    <div>
                        <ColumnTitle>خدمات</ColumnTitle>
                        <ul className="space-y-3 text-[13px]">
                            {SERVICES.map((link) => (
                                <li key={link.href}>
                                    <FooterLink href={link.href}>{link.label}</FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ==================== تماس ==================== */}
                    <div>
                        <ColumnTitle>تماس با ما</ColumnTitle>
                        <ul className="space-y-3 text-[13px]">
                            {CONTACT.map((item, i) => {
                                const Icon = item.icon;
                                const content = (
                                    <>
                                        <span
                                            className="
                        w-8 h-8 rounded-lg flex-shrink-0
                        bg-gold-500/10 ring-1 ring-gold-500/20
                        flex items-center justify-center
                        group-hover/item:bg-gold-500 group-hover/item:ring-gold-500
                        transition-all duration-200
                      "
                                        >
                                            <Icon className="w-4 h-4 text-gold-400 group-hover/item:text-white transition-colors" />
                                        </span>
                                        <span
                                            className="text-slate-400 group-hover/item:text-gold-300 transition-colors"
                                            dir={item.dir || "rtl"}
                                        >
                                            {item.value}
                                        </span>
                                    </>
                                );

                                return (
                                    <li key={i}>
                                        {item.href ? (
                                            <a
                                                href={item.href}
                                                className="group/item flex items-center gap-2.5 hover:translate-x-[-2px] transition-transform duration-200"
                                            >
                                                {content}
                                            </a>
                                        ) : (
                                            <div className="group/item flex items-center gap-2.5">
                                                {content}
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* ==================== خط جداکننده ==================== */}
                <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* ==================== پایین فوتر ==================== */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px]">
                    <p className="text-slate-500 text-center sm:text-right">
                        © {currentYear}{" "}
                        <span className="text-slate-300 font-medium">
                            سیستم رزرو تالار
                        </span>
                        . تمامی حقوق محفوظ است.
                    </p>

                    <p className="inline-flex items-center gap-1.5 text-slate-500">
                        <span>طراحی و توسعه با</span>
                        <PiHeart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
                        <span>در ایران</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}