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
import { IRAN_PROVINCES } from "@/lib/iranProvinces";

export default function BasicInfoStep() {
  const { setValue, watch } = useFormContext();
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
        <InputField
          label="نام تالار"
          name="title"
          icon={PiBuildings}
          placeholder="مثلاً: تالار گلستان"
          required
        />
        <InputField
          label="تلفن تالار"
          name="hall_phone"
          icon={PiPhone}
          type="tel"
          placeholder="021xxxxxxxx"
          dir="ltr"
          required
        />

        <SearchableSelect
          name="province"
          label="استان"
          icon={PiMapPin}
          options={provinceNames}
          placeholder="جستجوی استان..."
          required
          onValueChange={handleProvinceChange}
        />

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

        <div className="sm:col-span-2">
          <InputField
            label="آدرس کامل"
            name="address"
            icon={PiMapPin}
            placeholder="خیابان، کوچه، پلاک"
            required
          />
        </div>

        <InputField
          label="Latitude (عرض)"
          name="lat"
          type="number"
          step="0.000001"
          placeholder="35.6892"
          dir="ltr"
          inputMode="decimal"
          required
        />
        <InputField
          label="Longitude (طول)"
          name="lng"
          type="number"
          step="0.000001"
          placeholder="51.3890"
          dir="ltr"
          inputMode="decimal"
          required
        />

        <div className="sm:col-span-2">
          <InputField
            label="کد پستی"
            name="postal_code"
            icon={PiEnvelopeSimple}
            placeholder="۱۰ رقمی"
            dir="ltr"
          />
        </div>
      </div>
    </FormSection>
  );
}