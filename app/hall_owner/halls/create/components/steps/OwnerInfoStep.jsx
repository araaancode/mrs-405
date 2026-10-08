"use client";
import { PiUser, PiPhone } from "react-icons/pi";
import FormSection from "../ui/FormSection";
import InputField from "../ui/InputField";

export default function OwnerInfoStep() {
  return (
    <FormSection
      icon={PiUser}
      title="اطلاعات مالک"
      description="نام و شماره تماس مدیر تالار"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="نام مالک"
          name="hall_owner_name"
          icon={PiUser}
          placeholder="مثلاً: علی محمدی"
          required
        />
        <InputField
          label="شماره تماس مالک"
          name="hall_owner_phone"
          icon={PiPhone}
          type="tel"
          placeholder="09xxxxxxxxx"
          dir="ltr"
          required
        />
      </div>
    </FormSection>
  );
}