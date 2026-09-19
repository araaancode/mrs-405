// components/layout/Footer.jsx
import Link from "next/link";
import {
    PiBuildings,
    PiPhone,
    PiEnvelope,
    PiMapPin,
    PiInstagramLogo,
    PiTelegramLogo,
    PiWhatsappLogo
} from "react-icons/pi";

export default function Footer() {
    const currentYear = new Date().toLocaleDateString('fa-IR', { year: 'numeric' });

    return (
        <footer className="bg-gradient-to-br from-[#2C2418] to-[#1a1510] text-white mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* درباره */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#D4B06A] to-[#B8922E] rounded-xl flex items-center justify-center">
                                <PiBuildings className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-black text-lg">رزرو تالار</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            سیستم جامع رزرو آنلاین تالارهای عروسی، همایش و مراسم با پرداخت امن و آسان.
                        </p>
                    </div>

                    {/* لینک‌های سریع */}
                    <div>
                        <h3 className="font-bold text-[#D4B06A] mb-4">دسترسی سریع</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-[#D4B06A] transition">خانه</Link></li>
                            <li><Link href="/halls" className="hover:text-[#D4B06A] transition">تالارها</Link></li>
                            <li><Link href="/reservations" className="hover:text-[#D4B06A] transition">رزروهای من</Link></li>
                            <li><Link href="/about" className="hover:text-[#D4B06A] transition">درباره ما</Link></li>
                        </ul>
                    </div>

                    {/* خدمات */}
                    <div>
                        <h3 className="font-bold text-[#D4B06A] mb-4">خدمات</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/halls" className="hover:text-[#D4B06A] transition">رزرو تالار</Link></li>
                            <li><Link href="/support" className="hover:text-[#D4B06A] transition">پشتیبانی</Link></li>
                            <li><Link href="/faq" className="hover:text-[#D4B06A] transition">سوالات متداول</Link></li>
                            <li><Link href="/terms" className="hover:text-[#D4B06A] transition">قوانین و مقررات</Link></li>
                        </ul>
                    </div>

                    {/* تماس */}
                    <div>
                        <h3 className="font-bold text-[#D4B06A] mb-4">تماس با ما</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <PiPhone className="w-4 h-4 text-[#D4B06A]" />
                                <span dir="ltr">۰۲۱-۱۲۳۴۵۶۷۸</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <PiEnvelope className="w-4 h-4 text-[#D4B06A]" />
                                <span>info@mrsapp.com</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <PiMapPin className="w-4 h-4 text-[#D4B06A] mt-0.5" />
                                <span>تهران، خیابان ولیعصر</span>
                            </li>
                        </ul>

                        {/* شبکه‌های اجتماعی */}
                        <div className="flex items-center gap-3 mt-4">
                            <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#D4B06A] transition">
                                <PiInstagramLogo className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#D4B06A] transition">
                                <PiTelegramLogo className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#D4B06A] transition">
                                <PiWhatsappLogo className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* خط جداکننده */}
                <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                    <p>© {currentYear} سیستم رزرو تالار. تمامی حقوق محفوظ است.</p>
                    <p>
                        طراحی و توسعه با ❤️ در ایران
                    </p>
                </div>
            </div>
        </footer>
    );
}