// components/layout/Footer.jsx
import Link from 'next/link'
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
} from 'react-icons/pi'

/* ============================================================
   Palette
   ============================================================ */
const GOLD_GRADIENT = 'linear-gradient(135deg, #E0C67B 0%, #C6A14C 50%, #A8853A 100%)'

/* ============================================================
   Data
   ============================================================ */
const QUICK_LINKS = [
    { href: '/', label: 'خانه' },
    { href: '/halls', label: 'تالارها' },
    { href: '/about', label: 'درباره ما' },
    { href: '/contact', label: 'تماس با ما' },
]

const SERVICES = [
    { href: '/halls', label: 'رزرو تالار' },
    { href: '/user/tickets', label: 'پشتیبانی' },
    { href: '/faq', label: 'سوالات متداول' },
    { href: '/terms', label: 'قوانین و مقررات' },
]

const SOCIALS = [
    {
        href: 'https://instagram.com',
        label: 'اینستاگرام',
        icon: PiInstagramLogo,
        hoverBg: 'hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600',
    },
    {
        href: 'https://t.me',
        label: 'تلگرام',
        icon: PiTelegramLogo,
        hoverBg: 'hover:bg-gradient-to-br hover:from-sky-400 hover:to-sky-600',
    },
    {
        href: 'https://wa.me',
        label: 'واتساپ',
        icon: PiWhatsappLogo,
        hoverBg: 'hover:bg-gradient-to-br hover:from-emerald-400 hover:to-emerald-600',
    },
]

const CONTACT = [
    {
        icon: PiPhone,
        value: '۰۲۱-۱۲۳۴۵۶۷۸',
        href: 'tel:+982112345678',
        dir: 'rtl',
    },
    {
        icon: PiEnvelope,
        value: 'info@mrsapp.com',
        href: 'mailto:info@mrsapp.com',
        dir: 'ltr',
    },
    {
        icon: PiMapPin,
        value: 'تهران، خیابان ولیعصر',
        href: null,
    },
]

/* ============================================================
   FooterLink
   ============================================================ */
function FooterLink({ href, children }) {
    return (
        <Link
            href={href}
            className="
                group inline-flex items-center gap-1
                text-slate-400 hover:text-[#E0C67B]
                focus-visible:outline-none focus-visible:text-[#E0C67B]
                focus-visible:underline focus-visible:underline-offset-4
                transition-colors duration-200
            "
        >
            <span>{children}</span>
            <PiArrowUpRight
                className="
                    w-3 h-3 opacity-0 translate-x-1
                    group-hover:opacity-100 group-hover:translate-x-0
                    motion-reduce:transition-none
                    transition-all duration-200
                "
                aria-hidden="true"
            />
        </Link>
    )
}

/* ============================================================
   ColumnTitle
   ============================================================ */
function ColumnTitle({ children }) {
    return (
        <h3 className="relative inline-block font-bold text-[13px] text-[#E0C67B] mb-4 pb-2">
            {children}
            <span
                className="absolute bottom-0 right-0 w-8 h-0.5 rounded-full"
                style={{ backgroundImage: GOLD_GRADIENT }}
                aria-hidden="true"
            />
        </h3>
    )
}

/* ============================================================
   ContactItem
   ============================================================ */
function ContactItem({ icon: Icon, value, href, dir }) {
    const content = (
        <>
            <span
                className="
                    w-8 h-8 rounded-lg shrink-0
                    bg-[#C6A14C]/10 ring-1 ring-[#C6A14C]/20
                    flex items-center justify-center
                    group-hover/item:bg-[#C6A14C] group-hover/item:ring-[#C6A14C]
                    motion-reduce:transition-none
                    transition-all duration-200
                "
            >
                <Icon
                    className="
                        w-4 h-4 text-[#E0C67B]
                        group-hover/item:text-white
                        transition-colors
                    "
                    aria-hidden="true"
                />
            </span>
            <span
                className="text-slate-400 group-hover/item:text-[#E0C67B] transition-colors"
                dir={dir || 'rtl'}
            >
                {value}
            </span>
        </>
    )

    if (href) {
        return (
            <a
                href={href}
                className="
                    group/item flex items-center gap-2.5
                    hover:-translate-y-0.5
                    focus-visible:outline-none focus-visible:-translate-y-0.5
                    focus-visible:text-[#E0C67B]
                    motion-reduce:transition-none
                    transition-transform duration-200
                "
            >
                {content}
            </a>
        )
    }

    return <div className="group/item flex items-center gap-2.5">{content}</div>
}

/* ============================================================
   Footer
   ============================================================ */
export default function Footer() {
    const currentYear = new Date().toLocaleDateString('fa-IR', {
        year: 'numeric',
    })

    return (
        <footer
            role="contentinfo"
            aria-label="فوتر سایت"
            className="
                relative mt-16 overflow-hidden
                text-white
                bg-gradient-to-br from-[#2C2418] via-[#221c13] to-[#1a1510]
            "
        >
            {/* پس‌زمینه تزئینی */}
            <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 15% 20%, rgba(198,161,76,0.08) 0%, transparent 45%),
                        radial-gradient(circle at 85% 75%, rgba(198,161,76,0.06) 0%, transparent 45%)
                    `,
                }}
                aria-hidden="true"
            />

            {/* خط طلایی بالا */}
            <div
                className="h-1 bg-gradient-to-r from-transparent via-[#C6A14C] to-transparent"
                aria-hidden="true"
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                    {/* ==================== درباره ==================== */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link
                            href="/"
                            aria-label="صفحه اصلی رزرو تالار"
                            className="
                                inline-flex items-center gap-2.5 mb-4 group
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A14C]/40 rounded-lg
                            "
                        >
                            <div
                                className="
                                    w-11 h-11 rounded-xl
                                    flex items-center justify-center
                                    shadow-lg shadow-[#C6A14C]/25
                                    group-hover:shadow-xl group-hover:shadow-[#C6A14C]/40
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
                            <span className="font-black text-lg text-white tracking-tight">
                                رزرو تالار
                            </span>
                        </Link>

                        <p className="text-[13px] text-slate-400 leading-relaxed mb-5">
                            سیستم جامع رزرو آنلاین تالارهای عروسی، همایش و مراسم با
                            پرداخت امن و آسان در سراسر ایران.
                        </p>

                        {/* شبکه‌های اجتماعی */}
                        <ul
                            className="flex items-center gap-2.5"
                            aria-label="شبکه‌های اجتماعی"
                        >
                            {SOCIALS.map((social) => {
                                const Icon = social.icon
                                return (
                                    <li key={social.label}>
                                        <a
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
                                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A14C]/60
                                                motion-reduce:transition-none
                                                transition-all duration-300
                                                ${social.hoverBg}
                                            `}
                                        >
                                            <Icon
                                                className="w-[18px] h-[18px]"
                                                aria-hidden="true"
                                            />
                                        </a>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    {/* ==================== دسترسی سریع ==================== */}
                    <nav aria-label="دسترسی سریع">
                        <ColumnTitle>دسترسی سریع</ColumnTitle>
                        <ul className="space-y-3 text-[13px]">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.href}>
                                    <FooterLink href={link.href}>
                                        {link.label}
                                    </FooterLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* ==================== خدمات ==================== */}
                    <nav aria-label="خدمات">
                        <ColumnTitle>خدمات</ColumnTitle>
                        <ul className="space-y-3 text-[13px]">
                            {SERVICES.map((link) => (
                                <li key={link.href}>
                                    <FooterLink href={link.href}>
                                        {link.label}
                                    </FooterLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* ==================== تماس ==================== */}
                    <section aria-label="اطلاعات تماس">
                        <ColumnTitle>تماس با ما</ColumnTitle>
                        <ul className="space-y-3 text-[13px]">
                            {CONTACT.map((item, i) => (
                                <li key={i}>
                                    <ContactItem {...item} />
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* خط جداکننده */}
                <div
                    className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    aria-hidden="true"
                />

                {/* ==================== پایین فوتر ==================== */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px]">
                    <p className="text-slate-500 text-center sm:text-right">
                        © {currentYear}{' '}
                        <span className="text-slate-300 font-medium">
                            سیستم رزرو تالار
                        </span>
                        . تمامی حقوق محفوظ است.
                    </p>

                    <p className="inline-flex items-center gap-1.5 text-slate-500">
                        <span>طراحی و توسعه با</span>
                        <PiHeart
                            className="
                                w-3.5 h-3.5 text-rose-500 fill-rose-500
                                motion-safe:animate-pulse
                            "
                            aria-label="عشق"
                        />
                        <span>در ایران</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}