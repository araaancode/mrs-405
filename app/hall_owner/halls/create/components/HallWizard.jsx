"use client";

import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { PiFloppyDisk, PiSpinnerGap } from "react-icons/pi";

import { hallSchema } from "@/lib/schemas/hall";
import { notify } from "@/lib/toast";
import { useBeforeUnload } from "@/lib/hooks/useBeforeUnload";
import { useDraft } from "@/lib/hooks/useDraft";

import Stepper from "./Stepper";
import BasicInfoStep from "./steps/BasicInfoStep";
import OwnerInfoStep from "./steps/OwnerInfoStep";
import TechnicalStep from "./steps/TechnicalStep";
import PricingStep from "./steps/PricingStep";
import RulesStep from "./steps/RulesStep";
import DatesStep from "./steps/DatesStep";
import MediaStep from "./steps/MediaStep";

/* ============================================================
   Constants
   ============================================================ */
const STEPS = [
  { id: "basic",     title: "اطلاعات اصلی", icon: "building",
    fields: ["title", "province", "city", "address", "lat", "lng", "hall_phone"] },
  { id: "owner",     title: "مالک",         icon: "user",
    fields: ["hall_owner_name", "hall_owner_phone"] },
  { id: "technical", title: "مشخصات فنی",   icon: "wrench",
    fields: ["hall_measure", "capacity", "duration", "year", "hall_type",
             "host_type", "event_type", "description"] },
  { id: "pricing",   title: "قیمت‌گذاری",    icon: "coin",   fields: ["has_sans"] },
  { id: "rules",     title: "قوانین",       icon: "shield",   fields: [] },
  { id: "dates",     title: "تاریخ‌ها",      icon: "calendar", fields: [] },
  { id: "media",     title: "تصاویر",       icon: "image",    fields: [] },
];

const MIN_IMAGES = 6;
const MAX_IMAGES = 12;
const MIN_CSV_ITEMS = 1;
const MAX_CSV_ITEMS = 5;

const CSV_FIELDS = [
  { key: "hall_roles",        label: "قوانین تالار",            step: 2 },
  { key: "entrance_rolls",    label: "قوانین ورود و خروج",       step: 2 },
  { key: "properties",        label: "امکانات تالار",            step: 2 },
  { key: "cancel_rolls",      label: "قوانین کنسلی",            step: 4 },
  { key: "camera_capacities", label: "ظرفیت فیلم و عکس‌برداری", step: 4 },
  { key: "reservation_rolls", label: "قوانین رزرو",             step: 4 },
];

const FIELD_TO_STEP = {
  title: 0, province: 0, city: 0, address: 0, lat: 0, lng: 0,
  hall_phone: 0, postal_code: 0,
  hall_owner_name: 1, hall_owner_phone: 1,
  hall_measure: 2, capacity: 2, duration: 2, year: 2,
  hall_type: 2, host_type: 2, event_type: 2, description: 2,
  hall_roles: 2, entrance_rolls: 2, properties: 2,
  parking_count: 2, roof_count: 2,
  has_sans: 3, sans_price: 3, sans_discount: 3, licensee_number: 3,
  cancel_rolls: 4, camera_capacities: 4, reservation_rolls: 4,
};

const DEFAULT_VALUES = {
  title: "", province: "", city: "", address: "",
  lat: "", lng: "", postal_code: "", hall_phone: "",
  hall_owner_name: "", hall_owner_phone: "",
  hall_measure: "", capacity: "", duration: "", year: "",
  hall_type: "", host_type: "", event_type: "",
  description: "", hall_roles: "", entrance_rolls: "",
  properties: "", parking_count: "", roof_count: "",
  has_sans: false, sans_price: "", sans_discount: "",
  licensee_number: "", cancel_rolls: "",
  camera_capacities: "", reservation_rolls: "",
};

/* ============================================================
   Utils
   ============================================================ */
const csvToArray = (v) => {
  if (Array.isArray(v)) return v;
  if (!v) return [];
  return v.split(",").map((s) => s.trim()).filter(Boolean);
};

const arrayToCsv = (arr) =>
  Array.isArray(arr) ? arr.join(", ") : "";

/* ============================================================
   Component
   ============================================================ */
export default function HallWizard({ mode = "create", hallId }) {
  const isEdit = mode === "edit";
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm({
    resolver: zodResolver(hallSchema),
    mode: "onBlur",
    defaultValues: DEFAULT_VALUES,
  });

  const { handleSubmit, formState, reset, watch, trigger } = methods;

  /* ---------- Draft (فقط create) ---------- */
  useDraft({
    watch,
    reset,
    key: isEdit ? `hall-edit-${hallId}` : "hall-create-draft",
    extra: isEdit ? {} : { images, dates },
  });

  useBeforeUnload(formState.isDirty && !submitting);

  /* ---------- Load hall (فقط edit) ---------- */
  useEffect(() => {
    if (!isEdit || !hallId) return;

    (async () => {
      try {
        const { data } = await axios.get(`/api/hall_owner/halls/${hallId}`);
        if (!data.success || !data.hall) throw new Error("تالار یافت نشد");
        const h = data.hall;

        reset({
          title: h.title || "",
          province: h.province || "",
          city: h.city || "",
          address: h.address || "",
          lat: h.lat?.toString() || "",
          lng: h.lng?.toString() || "",
          postal_code: h.postal_code?.toString() || "",
          hall_phone: h.hall_phone || "",
          hall_owner_name: h.hall_owner_name || "",
          hall_owner_phone: h.hall_owner_phone || "",
          hall_measure: h.hall_measure?.toString() || "",
          capacity: h.capacity?.toString() || "",
          duration: h.duration?.toString() || "",
          year: h.year?.toString() || "",
          hall_type: h.hall_type || "",
          host_type: h.host_type || "",
          event_type: h.event_type || "",
          description: h.description || "",
          hall_roles: arrayToCsv(h.hall_roles),
          entrance_rolls: arrayToCsv(h.entrance_rolls),
          properties: arrayToCsv(h.properties),
          parking_count: h.parking_count?.toString() || "",
          roof_count: h.roof_count?.toString() || "",
          has_sans: !!h.has_sans,
          sans_price: h.sans_price?.toString() || "",
          sans_discount: h.sans_discount?.toString() || "",
          licensee_number: h.licensee_number || "",
          cancel_rolls: arrayToCsv(h.cancel_rolls),
          camera_capacities: arrayToCsv(h.camera_capacities),
          reservation_rolls: arrayToCsv(h.reservation_rolls),
        });

        if (Array.isArray(h.free_dates)) {
          setDates(h.free_dates.map((d) => d.slice(0, 10)));
        }
        setImages(h.images || []);
        setDocuments(h.hall_document || []);
      } catch (err) {
        notify.error(
          err.response?.data?.message || "خطا در دریافت اطلاعات تالار"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, hallId, reset]);

  /* ============================================================
     Navigation
     ============================================================ */
  const goNext = async () => {
    const fields = STEPS[currentStep].fields;
    const ok = fields.length ? await trigger(fields) : true;
    if (!ok) return notify.error("لطفاً خطاهای این مرحله را برطرف کنید");
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ============================================================
     onInvalid
     ============================================================ */
  const onInvalid = (errors) => {
    const [field, error] = Object.entries(errors)[0] || [];
    if (field) notify.error(`«${field}»: ${error?.message || "نامعتبر"}`);

    const target = FIELD_TO_STEP[field];
    if (target !== undefined && target !== currentStep) {
      setCurrentStep(target);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* ============================================================
     Submit
     ============================================================ */
  const onSubmit = async (values) => {
    /* 1) تصاویر */
    if (images.length < MIN_IMAGES)
      return notify.error(`حداقل ${MIN_IMAGES} تصویر لازم است`);
    if (images.length > MAX_IMAGES)
      return notify.error(`حداکثر ${MAX_IMAGES} تصویر مجاز است`);

    /* 2) CSV ها */
    for (const { key, label, step } of CSV_FIELDS) {
      const arr = csvToArray(values[key]);
      if (arr.length < MIN_CSV_ITEMS) {
        notify.error(`حداقل ${MIN_CSV_ITEMS} مورد در «${label}» الزامی است`);
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (arr.length > MAX_CSV_ITEMS) {
        notify.error(`«${label}» حداکثر ${MAX_CSV_ITEMS} مورد مجاز است`);
        setCurrentStep(step);
        return;
      }
    }

    setSubmitting(true);
    const toastId = toast.loading(
      isEdit ? "در حال ذخیره تغییرات..." : "در حال ثبت تالار..."
    );

    try {
      const payload = {
        ...values,
        hall_roles: csvToArray(values.hall_roles),
        entrance_rolls: csvToArray(values.entrance_rolls),
        properties: csvToArray(values.properties),
        cancel_rolls: csvToArray(values.cancel_rolls),
        camera_capacities: csvToArray(values.camera_capacities),
        reservation_rolls: csvToArray(values.reservation_rolls),
        hall_measure: values.hall_measure ? Number(values.hall_measure) : undefined,
        capacity: values.capacity ? Number(values.capacity) : undefined,
        duration: values.duration ? Number(values.duration) : undefined,
        year: values.year ? Number(values.year) : undefined,
        sans_price: values.sans_price ? Number(values.sans_price) : 0,
        sans_discount: values.sans_discount ? Number(values.sans_discount) : 0,
        lat: Number(values.lat),
        lng: Number(values.lng),
        images,
        hall_document: documents,
        free_dates: dates,
      };

      const { data } = isEdit
        ? await axios.put(`/api/hall_owner/halls/${hallId}`, payload)
        : await axios.post("/api/hall_owner/halls", payload);

      if (!data.success) throw new Error(data.message || "خطا در ذخیره");

      toast.update(toastId, {
        render: isEdit
          ? "تالار با موفقیت ویرایش شد!"
          : "تالار با موفقیت ثبت شد!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });

      if (!isEdit) {
        localStorage.removeItem("hall-create-draft");
        reset(DEFAULT_VALUES);
        setImages([]);
        setDocuments([]);
        setDates([]);
        setCurrentStep(0);
      } else {
        setTimeout(() => router.push("/hall_owner/halls"), 1000);
      }
    } catch (err) {
      toast.update(toastId, {
        render:
          err.response?.data?.message || err.message || "خطا در ذخیره تالار",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ============================================================
     Derived
     ============================================================ */
  const progress = useMemo(
    () => ((currentStep + 1) / STEPS.length) * 100,
    [currentStep]
  );
  const isLastStep = currentStep === STEPS.length - 1;
  const imagesReady =
    images.length >= MIN_IMAGES && images.length <= MAX_IMAGES;

  /* ============================================================
     Loading (edit)
     ============================================================ */
  if (loading) {
    return (
      <div dir="rtl" className="w-full max-w-5xl mx-auto p-4 sm:p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-100" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-48 bg-slate-100 rounded-lg" />
            <div className="h-3.5 w-64 bg-slate-100 rounded-md" />
          </div>
        </div>
        <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-6 space-y-5">
          <div className="h-2 bg-slate-100 rounded-full" />
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <div key={s} className="w-11 h-11 rounded-2xl bg-slate-100" />
            ))}
          </div>
        </div>
        <div className="mt-6 bg-white rounded-2xl ring-1 ring-slate-100 p-6 sm:p-8 space-y-4">
          <div className="h-6 w-40 bg-slate-100 rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="h-14 bg-slate-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     Render
     ============================================================ */
  return (
    <div dir="rtl" className="w-full max-w-5xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <header className="mb-6 flex items-start gap-3">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25 flex-shrink-0">
          <span className="text-white text-xl font-bold">
            {isEdit ? "✎" : "ت"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isEdit ? "ویرایش تالار" : "ایجاد تالار جدید"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isEdit
              ? "اطلاعات تالار خود را ویرایش کنید"
              : `اطلاعات کامل تالار خود را در ${STEPS.length} مرحله وارد کنید`}
          </p>
        </div>
      </header>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
          <Stepper steps={STEPS} current={currentStep} progress={progress} />

          <div className="mt-6 bg-white rounded-2xl ring-1 ring-slate-100 shadow-sm p-5 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={STEPS[currentStep].id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {currentStep === 0 && <BasicInfoStep />}
                {currentStep === 1 && <OwnerInfoStep />}
                {currentStep === 2 && <TechnicalStep />}
                {currentStep === 3 && <PricingStep />}
                {currentStep === 4 && <RulesStep />}
                {currentStep === 5 && (
                  <DatesStep dates={dates} setDates={setDates} />
                )}
                {currentStep === 6 && (
                  <MediaStep
                    images={images} setImages={setImages}
                    documents={documents} setDocuments={setDocuments}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav Bar */}
          <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentStep === 0 || submitting}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              مرحله قبل
            </button>

            {isEdit ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm("تغییرات ذخیره‌نشده از دست می‌رود. مطمئنید؟"))
                    router.push("/hall_owner/halls");
                }}
                disabled={submitting}
                className="hidden sm:inline-flex px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 disabled:opacity-40 transition"
              >
                انصراف
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (confirm("تمام اطلاعات فرم پاک خواهد شد. مطمئنید؟")) {
                    reset(DEFAULT_VALUES);
                    setImages([]);
                    setDocuments([]);
                    setDates([]);
                    setCurrentStep(0);
                    localStorage.removeItem("hall-create-draft");
                    notify.info("فرم پاک شد");
                  }
                }}
                disabled={submitting}
                className="hidden sm:inline-flex px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 disabled:opacity-40 transition"
              >
                پاک کردن فرم
              </button>
            )}

            {!isLastStep ? (
              <button
                type="button"
                onClick={goNext}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-b from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 shadow-md shadow-gold-500/25 hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                مرحله بعد
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting || !imagesReady}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-b from-emerald-500 to-emerald-700 shadow-md shadow-emerald-500/25 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all min-w-[180px] inline-flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <PiSpinnerGap className="w-4 h-4 animate-spin" />
                    {isEdit ? "در حال ذخیره..." : "در حال ثبت..."}
                  </>
                ) : (
                  <>
                    <PiFloppyDisk className="w-4 h-4" />
                    {isEdit ? "ذخیره تغییرات" : "ثبت نهایی تالار"}
                  </>
                )}
              </button>
            )}
          </div>

          {isLastStep && !imagesReady && (
            <p className="mt-3 text-center text-[12px] text-amber-700 bg-amber-50 py-2 rounded-lg ring-1 ring-amber-200">
              برای فعال شدن دکمه، حداقل {MIN_IMAGES} تصویر لازم است
              (فعلاً {images.length})
            </p>
          )}
        </form>
      </FormProvider>
    </div>
  );
}