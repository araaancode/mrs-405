"use client";
import {
  PiShieldCheck,
  PiVideoCamera,
  PiCalendarCheck,
  PiXCircle,
} from "react-icons/pi";
import FormSection from "../ui/FormSection";
import TagsInputField from "../ui/TagsInputField";

export default function RulesStep() {
  return (
    <FormSection
      icon={PiShieldCheck}
      title="قوانین و مقررات"
      description="قوانین لغو، دوربین و رزرو"
    >
      <div className="space-y-5">
        <TagsInputField
          name="cancel_rolls"
          label="قوانین کنسلی"
          icon={PiXCircle}
          placeholder="مثال: کنسلی تا ۷ روز قبل"
          hint="با Enter یا دکمه افزودن — حداقل ۱ و حداکثر ۵ مورد"
          minTagLength={5}
          maxTagLength={500}
          minTags={1}
          maxTags={5}
        />

        <TagsInputField
          name="camera_capacities"
          label="ظرفیت فیلم و عکس‌برداری"
          icon={PiVideoCamera}
          placeholder="مثال: عکاس حرفه‌ای"
          hint="با Enter یا دکمه افزودن — حداقل ۱ و حداکثر ۵ مورد"
          minTagLength={3}
          maxTagLength={500}
          minTags={1}
          maxTags={5}
        />

        <TagsInputField
          name="reservation_rolls"
          label="قوانین رزرو"
          icon={PiCalendarCheck}
          placeholder="مثال: پرداخت ۵۰٪ بیعانه"
          hint="با Enter یا دکمه افزودن — حداقل ۱ و حداکثر ۵ مورد"
          minTagLength={5}
          maxTagLength={500}
          minTags={1}
          maxTags={5}
        />
      </div>
    </FormSection>
  );
}