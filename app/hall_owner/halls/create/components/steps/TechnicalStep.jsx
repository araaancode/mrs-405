"use client";
import {
  PiWrench,
  PiRuler,
  PiUsersThree,
  PiCarProfile,
  PiNote,
  PiDoor,
  PiStar,
} from "react-icons/pi";
import FormSection from "../ui/FormSection";
import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import TextareaField from "../ui/TextareaField";
import TagsInputField from "../ui/TagsInputField";
import {
  EVENT_TYPES,
  HALL_TYPES,
  HOST_TYPES,
} from "@/lib/constants/hallOptions";

export default function TechnicalStep() {
  return (
    <FormSection
      icon={PiWrench}
      title="مشخصات فنی تالار"
      description="متراژ، ظرفیت و امکانات"
    >
      {/* ============ فیلدهای عددی و انتخابی ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="متراژ تالار (متر مربع)"
          name="hall_measure"
          icon={PiRuler}
          type="number"
          placeholder="مثلاً: 800"
          dir="ltr"
          inputMode="numeric"
          hint="بین ۱۰ تا ۱۰۰۰۰ متر مربع"
          required
        />

        <InputField
          label="ظرفیت (نفر)"
          name="capacity"
          icon={PiUsersThree}
          type="number"
          placeholder="مثلاً: 500"
          dir="ltr"
          inputMode="numeric"
          hint="بین ۱ تا ۱۰۰۰۰ نفر"
          required
        />

        <InputField
          label="مدت سانس (ساعت)"
          name="duration"
          type="number"
          placeholder="مثلاً: 4"
          dir="ltr"
          inputMode="numeric"
          hint="بین ۱ تا ۲۴ ساعت"
          required
        />

        <InputField
          label="سال ساخت"
          name="year"
          type="number"
          placeholder="مثلاً: 1395"
          dir="ltr"
          inputMode="numeric"
          hint="بین ۱۳۰۰ تا سال جاری"
          required
        />

        <InputField
          label="تعداد پارکینگ"
          name="parking_count"
          icon={PiCarProfile}
          type="text"
          placeholder="مثلاً: 50 یا نامحدود"
          dir="rtl"
          hint="عدد یا «نامحدود»"
          required
        />

        <InputField
          label="تعداد طبقات"
          name="roof_count"
          type="number"
          placeholder="مثلاً: 2"
          dir="ltr"
          inputMode="numeric"
          required
        />

        <SelectField
          label="نوع تالار"
          name="hall_type"
          options={HALL_TYPES}
          placeholder="انتخاب نوع"
          required
        />

        <SelectField
          label="نوع میزبانی"
          name="host_type"
          options={HOST_TYPES}
          placeholder="انتخاب میزبانی"
          required
        />

        <SelectField
          label="نوع مراسم"
          name="event_type"
          options={EVENT_TYPES}
          placeholder="انتخاب مراسم"
          required
        />
      </div>

      {/* ============ فیلدهای متنی طولانی ============ */}
      <div className="mt-5 space-y-4">
        <TextareaField
          label="توضیحات کامل تالار"
          name="description"
          placeholder="توضیحات دقیق در مورد تالار، امکانات، سرویس‌ها و..."
          required
          rows={5}
          minLength={20}
          maxLength={2000}
          hint="حداقل ۲۰ کاراکتر"
        />

        <TagsInputField
          name="hall_roles"
          label="قوانین تالار"
          icon={PiNote}
          placeholder="مثال: ورود با کفش ممنوع"
          hint="با Enter یا دکمه افزودن — حداقل ۱ و حداکثر ۵ مورد"
          minTagLength={5}
          maxTagLength={500}
          minTags={1}
          maxTags={5}
        />

        <TagsInputField
          name="entrance_rolls"
          label="قوانین ورود و خروج"
          icon={PiDoor}
          placeholder="مثال: ورود از ساعت ۱۸"
          hint="با Enter یا دکمه افزودن — حداقل ۱ و حداکثر ۵ مورد"
          minTagLength={3}
          maxTagLength={500}
          minTags={1}
          maxTags={5}
        />

        <TagsInputField
          name="properties"
          label="امکانات تالار"
          icon={PiStar}
          placeholder="مثال: آسانسور"
          hint="با Enter یا دکمه افزودن — حداقل ۱ و حداکثر ۵ مورد"
          minTagLength={3}
          maxTagLength={1000}
          minTags={1}
          maxTags={5}
        />
      </div>
    </FormSection>
  );
}