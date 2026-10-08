"use client";
import { PiCurrencyCircleDollar, PiPercent } from "react-icons/pi";
import FormSection from "../ui/FormSection";
import InputField from "../ui/InputField";
import CheckboxField from "../ui/CheckboxField";

export default function PricingStep() {
  return (
    <FormSection
      icon={PiCurrencyCircleDollar}
      title="اطلاعات سانس و قیمت"
      description="قیمت‌گذاری و تخفیف‌ها"
    >
      <CheckboxField name="has_sans" label="این تالار دارای سانس است" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <InputField
          label="قیمت سانس (تومان)"
          name="sans_price"
          icon={PiCurrencyCircleDollar}
          type="number"
          placeholder="مثلاً: 50000000"
          dir="ltr"
        />
        <InputField
          label="تخفیف سانس (درصد)"
          name="sans_discount"
          icon={PiPercent}
          type="number"
          placeholder="مثلاً: 10"
          dir="ltr"
        />
        <div className="sm:col-span-2">
          <InputField
            label="شماره مجوز"
            name="licensee_number"
            placeholder="شماره پروانه کسب"
            dir="ltr"
          />
        </div>
      </div>
    </FormSection>
  );
}