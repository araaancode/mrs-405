"use client";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/teal.css";
import { PiCalendarBlank, PiX } from "react-icons/pi";
import { toast } from "react-toastify";
import FormSection from "../ui/FormSection";
import { convertToGregorian } from "@/lib/utils/hallHelpers";

export default function DatesStep({ dates, setDates }) {
  const addDate = (dateObject) => {
    if (!dateObject) return;
    const gregorian = convertToGregorian(dateObject);
    if (!gregorian) return;

    if (dates.includes(gregorian)) {
      toast.warning("این تاریخ قبلاً اضافه شده است");
      return;
    }
    setDates([...dates, gregorian].sort());
    toast.success("تاریخ اضافه شد");
  };

  const removeDate = (date) => {
    setDates(dates.filter((d) => d !== date));
    toast.info("تاریخ حذف شد");
  };

  return (
    <FormSection
      icon={PiCalendarBlank}
      title="تاریخ‌های آزاد"
      description="تاریخ‌هایی که تالار در دسترس است"
    >
      <div className="space-y-4">
        {/*
          نکته: onOpenPickNewDate={false} از انتخاب خودکار تاریخ امروز
          هنگام باز شدن تقویم جلوگیری می‌کند (باگ شناخته‌شده پکیج).
        */}
        <DatePicker
          calendar={persian}
          locale={persian_fa}
          onChange={addDate}
          onOpenPickNewDate={false}
          format="YYYY/MM/DD"
          placeholder="انتخاب تاریخ آزاد"
          inputClass="
            w-full px-4 py-3
            bg-white border-2 border-slate-200 rounded-xl
            text-[13.5px] font-medium text-slate-900
            placeholder:text-slate-400
            hover:border-gold-300
            focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10
            transition-all duration-200
          "
          containerClassName="w-full"
        />

        {dates.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {dates.map((date) => (
              <span
                key={date}
                className="
                  inline-flex items-center gap-2
                  px-3 py-1.5 rounded-lg
                  bg-gold-50 text-gold-700
                  ring-1 ring-gold-200
                  text-[12px] font-semibold
                "
              >
                {new Date(date).toLocaleDateString("fa-IR")}
                <button
                  type="button"
                  onClick={() => removeDate(date)}
                  aria-label="حذف تاریخ"
                  className="
                    w-4 h-4 rounded-full
                    flex items-center justify-center
                    text-gold-600 hover:text-white hover:bg-rose-500
                    transition-all duration-200
                  "
                >
                  <PiX className="w-3 h-3" strokeWidth={3} />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[12px] text-slate-400">
            هنوز تاریخی اضافه نشده است
          </p>
        )}
      </div>
    </FormSection>
  );
}