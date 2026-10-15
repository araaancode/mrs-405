// app/(public)/about/page.js
import Link from 'next/link'
import Image from 'next/image'
import {
    PiUsersThree,
    PiBuildings,
    PiMapPin,
    PiBus,
    PiCookingPot,
    PiCheckCircle,
    PiMedal,
    PiRocketLaunch,
    PiShieldCheck,
    PiHeadphones,
    PiCalendarBlank,
    PiWallet,
    PiCreditCard,
    PiSparkle,
    PiArrowLeft,
    PiCrownSimpleFill,
} from 'react-icons/pi'

/* ============================================================
   Metadata
   ============================================================ */
export const metadata = {
    title: 'درباره ما | رزرو تالار',
    description:
        'بزرگترین سامانه جستجو و رزرو آنلاین تالارها، املاک، اتوبوس‌ها و غذای خانگی در ایران',
}

/* ============================================================
   Theme Constants
   ============================================================ */
const GOLD_GRADIENT = 'linear-gradient(135deg, #E0C67B 0%, #C6A14C 50%, #A8853A 100%)'
const GOLD_GRADIENT_BTN = 'linear-gradient(180deg, #D3B263 0%, #C6A14C 50%, #A8853A 100%)'
const GOLD_GRADIENT_TEXT = 'linear-gradient(90deg, #C6A14C 0%, #85672C 100%)'

/* ============================================================
   Shared classes
   ============================================================ */
const CARD_BASE = `
    group bg-white rounded-2xl
    shadow-[0_2px_16px_-4px_rgba(15,23,42,0.08)]
    hover:shadow-[0_20px_40px_-12px_rgba(198,161,76,0.25)]
    hover:-translate-y-1
    focus-within:ring-2 focus-within:ring-[#C6A14C]/40
    transition-[transform,box-shadow] duration-300
    motion-reduce:transition-none motion-reduce:hover:translate-y-0
    will-change-transform
`

const ICON_BOX = `
    flex items-center justify-center
    bg-gradient-to-br from-[#FBF7EC] to-[#F6EED5]
    ring-1 ring-[#EDDCA9]
    group-hover:from-[#D3B263] group-hover:to-[#A8853A]
    group-hover:ring-[#C6A14C]
    transition-all duration-300
`

const ICON_COLOR = `
    text-[#A8853A] group-hover:text-white
    transition-colors duration-300
`

/* ============================================================
   Static Data
   ============================================================ */
const STATS = [
    { id: 1, value: '۱۲۵٬۰۰۰+', label: 'کاربر فعال', icon: PiUsersThree },
    { id: 2, value: '۲٬۸۵۰+', label: 'تالار و باغ', icon: PiBuildings },
    { id: 3, value: '۱٬۹۲۰+', label: 'ملک و ویلا', icon: PiMapPin },
    { id: 4, value: '۸۵۰+', label: 'اتوبوس', icon: PiBus },
    { id: 5, value: '۱٬۴۵۰+', label: 'غذا', icon: PiCookingPot },
    { id: 6, value: '۴۵٬۰۰۰+', label: 'رزرو موفق', icon: PiCalendarBlank },
]

const FEATURES = [
    {
        id: 1,
        title: 'تنوع بی‌نظیر',
        description: 'بیش از ۷٬۰۰۰ خدمات‌دهنده در سراسر ایران',
        icon: PiSparkle,
    },
    {
        id: 2,
        title: 'قیمت منصفانه',
        description: 'بهترین قیمت‌ها بدون واسطه',
        icon: PiWallet,
    },
    {
        id: 3,
        title: 'پرداخت امن',
        description: 'درگاه پرداخت مستقیم و امن',
        icon: PiCreditCard,
    },
    {
        id: 4,
        title: 'پشتیبانی ۲۴/۷',
        description: 'پاسخگویی سریع در تمام ساعات',
        icon: PiHeadphones,
    },
    {
        id: 5,
        title: 'تایید هویت',
        description: 'همه خدمات‌دهندگان تایید هویت شده',
        icon: PiShieldCheck,
    },
    {
        id: 6,
        title: 'رزرو آسان',
        description: 'رزرو آنلاین در کمتر از ۲ دقیقه',
        icon: PiCalendarBlank,
    },
]

const MISSION_ITEMS = [
    'شفافیت کامل در قیمت‌ها',
    'تایید هویت تمام خدمات‌دهندگان',
    'پشتیبانی ۲۴ ساعته، ۷ روز هفته',
    'ضمانت بازگشت وجه در صورت نارضایتی',
]

/* ============================================================
   SectionTitle
   ============================================================ */
function SectionTitle({ title, highlight, description, align = 'center' }) {
    const alignment =
        align === 'center'
            ? 'text-center mx-auto'
            : align === 'right'
              ? 'text-right'
              : 'text-left'

    return (
        <div className={`max-w-2xl mb-10 sm:mb-12 ${alignment}`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                {title}{' '}
                {highlight && (
                    <span
                        className="bg-clip-text text-transparent"
                        style={{ backgroundImage: GOLD_GRADIENT_TEXT }}
                    >
                        {highlight}
                    </span>
                )}
            </h2>

            <div
                className={`h-1 rounded-full mb-4 ${
                    align === 'center' ? 'mx-auto w-20' : 'w-16'
                }`}
                style={{ backgroundImage: GOLD_GRADIENT }}
                aria-hidden="true"
            />

            {description && (
                <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed px-2">
                    {description}
                </p>
            )}
        </div>
    )
}

/* ============================================================
   AboutPage
   ============================================================ */
export default function AboutPage() {
    return (
        <div dir="rtl" className="min-h-screen bg-[#FDFCF9]">
            {/* ==================== Hero Section ==================== */}
            <section className="relative overflow-hidden">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none opacity-70"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 15% 20%, rgba(198,161,76,0.14) 0%, transparent 40%), radial-gradient(circle at 85% 80%, rgba(198,161,76,0.12) 0%, transparent 45%)',
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-28">
                    <div className="text-center max-w-3xl mx-auto">
                        {/* آیکون تاج */}
                        <div className="flex justify-center mb-6">
                            <div
                                className="
                                    relative
                                    w-16 h-16 sm:w-20 sm:h-20
                                    rounded-2xl
                                    flex items-center justify-center
                                    ring-4 ring-[#C6A14C]/15
                                "
                                style={{
                                    backgroundImage: GOLD_GRADIENT,
                                    boxShadow:
                                        '0 10px 40px -8px rgba(198,161,76,0.5)',
                                }}
                            >
                                <PiCrownSimpleFill
                                    className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                                    aria-hidden="true"
                                />
                            </div>
                        </div>

                        {/* نشان بالا */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBF7EC] border border-[#EDDCA9] mb-4">
                            <span
                                className="w-1.5 h-1.5 rounded-full bg-[#C6A14C] motion-safe:animate-pulse"
                                aria-hidden="true"
                            />
                            <span className="text-[11px] font-medium text-[#85672C]">
                                از سال ۱۳۹۸ در خدمت شما
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                            داستان{' '}
                            <span
                                className="bg-clip-text text-transparent"
                                style={{ backgroundImage: GOLD_GRADIENT_TEXT }}
                            >
                                رزرو تالار
                            </span>
                        </h1>

                        <div
                            className="w-20 h-1 rounded-full mx-auto mb-5"
                            style={{ backgroundImage: GOLD_GRADIENT }}
                            aria-hidden="true"
                        />

                        <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed px-2">
                            ما در رزرو تالار باور داریم که هر مراسمی می‌تواند خاص و
                            به‌یادماندنی باشد. از سال ۱۳۹۸ تلاش می‌کنیم تا بهترین
                            خدمات را با مناسب‌ترین قیمت به شما ارائه دهیم.
                        </p>
                    </div>
                </div>
            </section>

            {/* ==================== Stats Section ==================== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-20">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {STATS.map((stat) => {
                        const Icon = stat.icon
                        return (
                            <div
                                key={stat.id}
                                className={`${CARD_BASE} p-4 sm:p-5 text-center`}
                            >
                                <div
                                    className={`${ICON_BOX} w-11 h-11 sm:w-12 sm:h-12 rounded-xl mx-auto mb-3`}
                                >
                                    <Icon
                                        className={`w-5 h-5 ${ICON_COLOR}`}
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="text-lg sm:text-2xl font-black text-slate-900 tabular-nums">
                                    {stat.value}
                                </div>
                                <div className="text-[10px] sm:text-xs text-slate-500 mt-1 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* ==================== Mission Section ==================== */}
            <section className="bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                        {/* متن */}
                        <div className="order-2 lg:order-1">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                                ماموریت{' '}
                                <span
                                    className="bg-clip-text text-transparent"
                                    style={{ backgroundImage: GOLD_GRADIENT_TEXT }}
                                >
                                    ما
                                </span>
                            </h2>
                            <div
                                className="w-16 sm:w-20 h-1 rounded-full mb-5"
                                style={{ backgroundImage: GOLD_GRADIENT }}
                                aria-hidden="true"
                            />

                            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                                ما در رزرو تالار تلاش می‌کنیم تا پلی باشیم بین شما و
                                بهترین خدمات‌دهندگان ایران. با حذف واسطه‌ها و ایجاد
                                بستری امن و شفاف، به شما کمک می‌کنیم تا با خیال راحت،
                                مراسم خود را برنامه‌ریزی کنید.
                            </p>

                            <ul className="space-y-3">
                                {MISSION_ITEMS.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-3"
                                    >
                                        <span className="w-6 h-6 rounded-lg bg-emerald-50 ring-1 ring-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                            <PiCheckCircle
                                                className="w-3.5 h-3.5 text-emerald-600"
                                                strokeWidth={3}
                                                aria-hidden="true"
                                            />
                                        </span>
                                        <span className="text-sm sm:text-base text-slate-700 leading-relaxed">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* تصویر */}
                        <div className="relative order-1 lg:order-2">
                            <div className="aspect-square rounded-3xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(15,23,42,0.15)]">
                                <Image
                                    src="/images/about/1.jpg"
                                    alt="مراسم برگزار شده در تالار"
                                    width={800}
                                    height={800}
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    quality={85}
                                    priority
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* کارت شناور */}
                            <div
                                className="
                                    absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6
                                    bg-white rounded-2xl
                                    shadow-[0_20px_40px_-12px_rgba(15,23,42,0.15)]
                                    p-4 sm:p-5 min-w-[180px]
                                "
                            >
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div
                                        className="
                                            w-12 h-12 sm:w-14 sm:h-14
                                            rounded-xl
                                            flex items-center justify-center
                                            shrink-0
                                        "
                                        style={{
                                            backgroundImage: GOLD_GRADIENT,
                                            boxShadow:
                                                '0 8px 24px -6px rgba(198,161,76,0.45)',
                                        }}
                                    >
                                        <PiMedal
                                            className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
                                            ۴۵٬۰۰۰+
                                        </div>
                                        <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                                            رزرو موفق
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== Features Section ==================== */}
            <section className="bg-[#F5F2ED]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 md:py-20">
                    <SectionTitle
                        title="چرا"
                        highlight="رزرو تالار؟"
                        description="ما با ارائه خدمات منحصر به فرد، تجربه‌ای متفاوت از برنامه‌ریزی مراسم را برای شما رقم می‌زنیم"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {FEATURES.map((feature) => {
                            const Icon = feature.icon
                            return (
                                <div
                                    key={feature.id}
                                    className={`${CARD_BASE} p-5 sm:p-6`}
                                >
                                    <div
                                        className={`${ICON_BOX} w-12 h-12 sm:w-14 sm:h-14 rounded-xl mb-5`}
                                    >
                                        <Icon
                                            className={`w-6 h-6 sm:w-7 sm:h-7 ${ICON_COLOR}`}
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[13px] sm:text-sm text-slate-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ==================== CTA Section ==================== */}
            <section className="bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 md:py-20 text-center">
                    <div
                        className="
                            relative overflow-hidden
                            p-8 sm:p-12 rounded-3xl
                            shadow-[0_30px_80px_-20px_rgba(15,23,42,0.4)]
                        "
                        style={{
                            backgroundImage:
                                'linear-gradient(135deg, #2C2418 0%, #221c13 50%, #1a1510 100%)',
                        }}
                    >
                        {/* الگوی تزئینی */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 opacity-30 pointer-events-none"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 20% 30%, rgba(198,161,76,0.3) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(198,161,76,0.25) 0%, transparent 45%)',
                            }}
                        />

                        <div className="relative">
                            <div className="flex justify-center mb-5">
                                <div
                                    className="
                                        w-14 h-14 rounded-2xl
                                        flex items-center justify-center
                                    "
                                    style={{
                                        backgroundImage: GOLD_GRADIENT,
                                        boxShadow:
                                            '0 10px 30px -6px rgba(198,161,76,0.6)',
                                    }}
                                >
                                    <PiRocketLaunch
                                        className="w-6 h-6 text-white"
                                        aria-hidden="true"
                                    />
                                </div>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
                                آماده شروع هستید؟
                            </h2>
                            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed mb-7">
                                همین حالا مراسم خود را برنامه‌ریزی کنید و تجربه‌ای
                                به‌یادماندنی بسازید
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Link
                                    href="/halls"
                                    prefetch={false}
                                    className="
                                        group inline-flex items-center justify-center gap-2
                                        px-6 py-3 rounded-xl
                                        text-sm font-bold text-[#2A1F1F]
                                        w-full sm:w-auto
                                        hover:-translate-y-0.5
                                        active:scale-95
                                        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E0C67B]/50
                                        transition-all duration-300
                                        motion-reduce:transition-none
                                    "
                                    style={{
                                        backgroundImage: GOLD_GRADIENT_BTN,
                                        boxShadow:
                                            '0 10px 30px -6px rgba(198,161,76,0.6)',
                                    }}
                                >
                                    <span>مشاهده تالارها</span>
                                    <PiArrowLeft
                                        className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                                        aria-hidden="true"
                                    />
                                </Link>

                                <Link
                                    href="/contact"
                                    prefetch={false}
                                    className="
                                        inline-flex items-center justify-center gap-2
                                        px-6 py-3 rounded-xl
                                        text-sm font-bold text-white
                                        bg-white/10 backdrop-blur-md
                                        ring-1 ring-white/20
                                        hover:bg-white/20 hover:ring-white/30
                                        hover:-translate-y-0.5
                                        active:scale-95
                                        w-full sm:w-auto
                                        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30
                                        transition-all duration-300
                                        motion-reduce:transition-none
                                    "
                                >
                                    تماس با ما
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}