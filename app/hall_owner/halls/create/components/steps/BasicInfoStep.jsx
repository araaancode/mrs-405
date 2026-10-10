"use client";

import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
    PiBuildings,
    PiMapPin,
    PiPhone,
    PiEnvelopeSimple,
} from "react-icons/pi";
import FormSection from "../ui/FormSection";
import InputField from "../ui/InputField";
import SearchableSelect from "../ui/SearchableSelect";
import LocationPicker from "@/components/ui/LocationPicker";
import { IRAN_PROVINCES } from "@/lib/iranProvinces";

/* ============================================================
   BasicInfoStep
   ============================================================ */
export default function BasicInfoStep() {
    const { setValue, watch } = useFormContext();
    console.log("🔵 BasicInfoStep RENDERED — with LocationPicker");
console.log("   lat:", watch("lat"), "lng:", watch("lng"));
    const selectedProvince = watch("province") || "";

    /** لیست استان‌ها — فقط یک بار محاسبه */
    const provinceNames = useMemo(() => Object.keys(IRAN_PROVINCES), []);

    /** لیست شهرهای استان انتخاب‌شده */
    const cityOptions = useMemo(() => {
        if (!selectedProvince) return [];
        return IRAN_PROVINCES[selectedProvince] || [];
    }, [selectedProvince]);

    /** با تغییر استان، شهر ریست می‌شود */
    const handleProvinceChange = () => {
        setValue("city", "", { shouldValidate: false, shouldDirty: true });
    };

    return (
        <FormSection
            icon={PiBuildings}
            title="اطلاعات اصلی تالار"
            description="نام، موقعیت و اطلاعات تماس"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ==================== نام تالار ==================== */}
                <InputField
                    label="نام تالار"
                    name="title"
                    icon={PiBuildings}
                    placeholder="مثلاً: تالار گلستان"
                    required
                />

                {/* ==================== تلفن تالار ==================== */}
                <InputField
                    label="تلفن تالار"
                    name="hall_phone"
                    icon={PiPhone}
                    type="tel"
                    placeholder="021xxxxxxxx"
                    dir="ltr"
                    required
                />

                {/* ==================== استان ==================== */}
                <SearchableSelect
                    name="province"
                    label="استان"
                    icon={PiMapPin}
                    options={provinceNames}
                    placeholder="جستجوی استان..."
                    required
                    onValueChange={handleProvinceChange}
                />

                {/* ==================== شهر ==================== */}
                <SearchableSelect
                    name="city"
                    label="شهر"
                    icon={PiMapPin}
                    options={cityOptions}
                    placeholder={
                        selectedProvince
                            ? "جستجوی شهر..."
                            : "ابتدا استان را انتخاب کنید"
                    }
                    required
                    disabled={!selectedProvince}
                />

                {/* ==================== آدرس کامل ==================== */}
                <div className="sm:col-span-2">
                    <InputField
                        label="آدرس کامل"
                        name="address"
                        icon={PiMapPin}
                        placeholder="خیابان، کوچه، پلاک"
                        required
                    />
                </div>

                {/* ==================== کد پستی ==================== */}
                <div className="sm:col-span-2">
                    <InputField
                        label="کد پستی"
                        name="postal_code"
                        icon={PiEnvelopeSimple}
                        placeholder="۱۰ رقمی"
                        dir="ltr"
                    />
                </div>

                {/* ==================== موقعیت روی نقشه ==================== */}
                <div className="sm:col-span-2 pt-4 mt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center flex-shrink-0">
                            <PiMapPin className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-slate-800">
                                موقعیت مکانی روی نقشه
                            </h3>
                            <p className="text-[11.5px] text-slate-400 mt-0.5">
                                روی نقشه کلیک کنید، نشانگر را بکشید یا آدرس را
                                جستجو کنید
                            </p>
                        </div>
                    </div>

                <div id="map" className="bg-red">
                  <LocationPicker />
                </div>
                </div>
            </div>
        </FormSection>
    );
}