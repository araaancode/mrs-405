// app/(public)/about/page.js - کاملاً رسپانسیو و حرفه‌ای
import Link from 'next/link'
import {
    PiHeart,
    PiStar,
    PiUsersThree,
    PiBuilding,
    PiMapPin,
    PiBus,
    PiCookingPot,
    PiCheckCircle,
    PiMedal,
    PiTrophy,
    PiRocketLaunch,
    PiShieldCheck,
    PiHeadphones,
    PiCalendar,
    PiWallet,
    PiCreditCard,
    PiChartLineUp,
    PiSparkle,
    PiArrowLeft,
    PiQuote,
    PiEnvelope,
    PiPhone,
    PiMapPin as PiMapPinIcon
} from 'react-icons/pi'

export const metadata = {
    title: 'درباره ما | مراسمینو',
    description: 'مراسمینو بزرگترین سامانه جستجو و رزرو آنلاین تالارها، املاک، اتوبوس‌ها و غذای خانگی در ایران',
}

export default function AboutPage() {
    const stats = [
        { id: 1, value: '۱۲۵,۰۰۰+', label: 'کاربر فعال', icon: PiUsersThree },
        { id: 2, value: '۲,۸۵۰+', label: 'تالار و باغ', icon: PiBuilding },
        { id: 3, value: '۱,۹۲۰+', label: 'ملک و ویلا', icon: PiMapPin },
        { id: 4, value: '۸۵۰+', label: 'اتوبوس', icon: PiBus },
        { id: 5, value: '۱,۴۵۰+', label: 'غذا', icon: PiCookingPot },
        { id: 6, value: '۴۵,۰۰۰+', label: 'رزرو موفق', icon: PiCalendar },
    ]

    const features = [
        {
            id: 1,
            title: 'تنوع بی‌نظیر',
            description: 'بیش از ۷۰۰۰ خدمات دهنده در سراسر ایران',
            icon: PiSparkle,
            color: 'from-[#D4B06A] to-orange-500'
        },
        {
            id: 2,
            title: 'قیمت منصفانه',
            description: 'بهترین قیمت‌ها بدون واسطه',
            icon: PiWallet,
            color: 'from-emerald-500 to-teal-500'
        },
        {
            id: 3,
            title: 'پرداخت امن',
            description: 'درگاه پرداخت مستقیم و امن',
            icon: PiCreditCard,
            color: 'from-blue-500 to-indigo-500'
        },
        {
            id: 4,
            title: 'پشتیبانی ۲۴/۷',
            description: 'پاسخگویی سریع در تمام ساعات',
            icon: PiHeadphones,
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 5,
            title: 'تایید هویت',
            description: 'همه خدمات دهندگان تایید هویت شده',
            icon: PiShieldCheck,
            color: 'from-rose-500 to-red-500'
        },
        {
            id: 6,
            title: 'رزرو آسان',
            description: 'رزرو آنلاین در کمتر از ۲ دقیقه',
            icon: PiCalendar,
            color: 'from-cyan-500 to-sky-500'
        },
    ]

    const team = [
        {
            id: 1,
            name: 'علی محمدی',
            role: 'مدیرعامل و بنیانگذار',
            bio: 'مدیریت سایت و بنیان گذار',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        },
        {
            id: 2,
            name: 'سارا احمدی',
            role: 'مدیر محصول',
            bio: 'گل آرایی و آرایش و میکاپ',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        },
        {
            id: 3,
            name: 'محمد کریمی',
            role: 'مدیر فنی',
            bio: 'راننده و خدمات پذیرایی',
            image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400',
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir="rtl">
            {/* Hero Section - کاملاً رسپانسیو */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-48 sm:w-64 h-48 sm:h-64 bg-[#D4B06A] rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-[#D4B06A] rounded-full filter blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-28 lg:py-32">
                    <div className="text-center max-w-3xl mx-auto">
                       

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#2C2418] mb-3 sm:mb-4">
                            داستان <span className="text-[#D4B06A]">مراسمینو</span>
                        </h1>
                        <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mx-auto mb-4 sm:mb-6" />
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed px-2">
                            ما در مراسمینو باور داریم که هر مراسمی می‌تواند خاص و به‌یادماندنی باشد.
                            از سال ۱۳۹۸ تلاش می‌کنیم تا بهترین خدمات را با مناسب‌ترین قیمت به شما ارائه دهیم.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section - کاملاً رسپانسیو */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-20">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon
                        return (
                            <div key={stat.id} className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-4">
                                    <Icon className="text-xl sm:text-2xl text-[#D4B06A]" />
                                </div>
                                <div className="text-lg sm:text-2xl font-bold text-[#2C2418]">{stat.value}</div>
                                <div className="text-[10px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{stat.label}</div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Mission Section - کاملاً رسپانسیو */}
            <div className="bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2C2418] mb-4 sm:mb-6">
                                ماموریت ما
                            </h2>
                            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mb-4 sm:mb-6" />
                            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
                                ما در مراسمینو تلاش می‌کنیم تا پلی باشیم بین شما و بهترین خدمات دهندگان ایران.
                                با حذف واسطه‌ها و ایجاد بستری امن و شفاف، به شما کمک می‌کنیم تا با خیال راحت،
                                مراسم خود را برنامه‌ریزی کنید.
                            </p>
                            <div className="space-y-3 sm:space-y-4">
                                {[
                                    'شفافیت کامل در قیمت‌ها',
                                    'تایید هویت تمام خدمات دهندگان',
                                    'پشتیبانی ۲۴ ساعته، ۷ روز هفته',
                                    'ضمانت بازگشت وجه در صورت نارضایتی'
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                            <PiCheckCircle className="text-emerald-600 text-xs sm:text-sm" />
                                        </div>
                                        <span className="text-sm sm:text-base text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative order-1 lg:order-2">
                            <div className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden">
                                <img
                                    src="../images/about/1.jpg"
                                    alt="مراسم"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                                        <PiMedal className="text-2xl sm:text-3xl text-[#D4B06A]" />
                                    </div>
                                    <div>
                                        <div className="text-xl sm:text-2xl font-bold text-[#2C2418]">۴۵,۰۰۰+</div>
                                        <div className="text-[10px] sm:text-sm text-gray-500">رزرو موفق</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section - کاملاً رسپانسیو */}
            <div className="bg-[#F5F2ED]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
                    <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2C2418] mb-2 sm:mb-4">
                            چرا <span className="text-[#D4B06A]">مراسمینو</span>؟
                        </h2>
                        <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mx-auto mb-3 sm:mb-4" />
                        <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2">
                            ما با ارائه خدمات منحصر به فرد، تجربه‌ای متفاوت از برنامه‌ریزی مراسم را برای شما رقم می‌زنیم
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon
                            return (
                                <div key={feature.id} className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-5 sm:p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-6 bg-gradient-to-br from-amber-100 to-amber-50">
                                        <Icon className="text-2xl sm:text-3xl text-[#D4B06A]" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-[#2C2418] mb-2 sm:mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Team Section - کاملاً رسپانسیو (کامنت شده) */}
            {/* <div className="bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
                    <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2C2418] mb-2 sm:mb-4">
                            تیم ما
                        </h2>
                        <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#D4B06A] to-[#B8922E] rounded-full mx-auto mb-3 sm:mb-4" />
                        <p className="text-sm sm:text-base md:text-lg text-gray-600">
                            تیمی از متخصصان با تجربه که عاشق کار خود هستند
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {team.map((member) => (
                            <div key={member.id} className="text-center">
                                <div className="relative mb-4 sm:mb-6 inline-block">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden mx-auto">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-[#D4B06A] rounded-lg sm:rounded-xl flex items-center justify-center text-white">
                                        <PiHeart className="text-base sm:text-lg" />
                                    </div>
                                </div>
                                <h3 className="text-base sm:text-xl font-semibold text-[#2C2418] mb-1 sm:mb-2">
                                    {member.name}
                                </h3>
                                <p className="text-[#D4B06A] font-medium text-sm sm:text-base mb-2 sm:mb-3">{member.role}</p>
                                <p className="text-gray-600 text-xs sm:text-sm">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div> */}

           
        </div>
    )
}