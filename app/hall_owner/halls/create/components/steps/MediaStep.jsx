"use client";
import { PiImage, PiFilePdf, PiTrash } from "react-icons/pi";
import { toast } from "react-toastify";
import FormSection from "../ui/FormSection";
import UploadBox from "../ui/UploadBox";
import ImagePreviewGrid from "../ui/ImagePreviewGrid";
import { convertToBase64 } from "@/lib/utils/hallHelpers";

const MIN_IMAGES = 6;
const MAX_IMAGES = 12;

export default function MediaStep({
  images,
  setImages,
  documents,
  setDocuments,
}) {
  /** ---------- تصاویر ---------- */
  const handleImages = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      toast.error(`حداکثر ${MAX_IMAGES} تصویر مجاز است`);
      e.target.value = "";
      return;
    }

    const toAdd = files.slice(0, remaining);
    if (toAdd.length < files.length) {
      toast.warning(
        `فقط ${toAdd.length} تصویر اضافه شد (حداکثر ${MAX_IMAGES})`
      );
    }

    const toastId = toast.loading(`در حال بارگذاری ${toAdd.length} تصویر...`);
    try {
      const base64 = await Promise.all(toAdd.map(convertToBase64));
      setImages([...images, ...base64].slice(0, MAX_IMAGES));
      toast.update(toastId, {
        render: `${toAdd.length} تصویر اضافه شد`,
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
    } catch {
      toast.update(toastId, {
        render: "خطا در بارگذاری تصاویر",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
    } finally {
      e.target.value = "";
    }
  };

  /** ---------- مدارک (بدون محدودیت) ---------- */
  const handleDocs = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const toastId = toast.loading(`در حال بارگذاری ${files.length} مدرک...`);
    try {
      const base64 = await Promise.all(files.map(convertToBase64));
      setDocuments([...documents, ...base64]);
      toast.update(toastId, {
        render: `${files.length} مدرک اضافه شد`,
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
    } catch {
      toast.update(toastId, {
        render: "خطا در بارگذاری مدارک",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
    } finally {
      e.target.value = "";
    }
  };

  /** حذف مدرک — با ایندکس */
  const removeDoc = (idx) => {
    setDocuments(documents.filter((_, i) => i !== idx));
    toast.info("مدرک حذف شد");
  };

  const imagesFull = images.length >= MAX_IMAGES;
  const imagesEnough = images.length >= MIN_IMAGES;
  const remainingToMin = MIN_IMAGES - images.length;

  return (
    <>
      <FormSection
        icon={PiImage}
        title="تصاویر تالار"
        description={`حداقل ${MIN_IMAGES} و حداکثر ${MAX_IMAGES} تصویر`}
      >
        {/* هشدار کمبود تصویر */}
        {images.length > 0 && !imagesEnough && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 ring-1 ring-amber-200 flex items-start gap-2">
            <span className="text-amber-600 font-bold text-[18px] leading-none">
              !
            </span>
            <div className="flex-1">
              <p className="text-[12.5px] font-bold text-amber-800">
                {remainingToMin.toLocaleString("fa-IR")} تصویر دیگر اضافه کنید
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                حداقل {MIN_IMAGES} تصویر برای ثبت تالار الزامی است
              </p>
            </div>
          </div>
        )}

        {/* پیام موفقیت */}
        {imagesEnough && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-50 ring-1 ring-emerald-200 flex items-center gap-2">
            <span className="text-emerald-600 font-bold text-[14px]">✓</span>
            <p className="text-[12.5px] font-semibold text-emerald-800">
              تعداد تصاویر کافی است
            </p>
          </div>
        )}

        <UploadBox
          id="image-upload"
          accept="image/*"
          onChange={handleImages}
          title={imagesFull ? "ظرفیت تصاویر پر است" : "انتخاب تصاویر"}
          hint={
            imagesFull
              ? `حداکثر ${MAX_IMAGES} تصویر مجاز است`
              : `فرمت JPG، PNG، WEBP — ${images.length}/${MAX_IMAGES}`
          }
          icon={PiImage}
          disabled={imagesFull}
        />

        {images.length > 0 && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 ring-1 ring-slate-100">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-[18px] font-bold text-gold-600">
                  {images.length.toLocaleString("fa-IR")}
                </span>
                <span className="text-[12.5px] text-slate-500">
                  از {MAX_IMAGES.toLocaleString("fa-IR")} تصویر
                </span>
              </div>
              {imagesFull && (
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  تکمیل شد
                </span>
              )}
            </div>
            <ImagePreviewGrid images={images} onChange={setImages} />
          </div>
        )}
      </FormSection>

      <FormSection
        icon={PiFilePdf}
        title="مدارک تالار"
        description="اختیاری — بدون محدودیت تعداد"
      >
        <UploadBox
          id="doc-upload"
          accept=".pdf,image/*"
          onChange={handleDocs}
          title="انتخاب مدارک"
          hint={`فرمت PDF، JPG، PNG — ${documents.length} مدرک انتخاب‌شده`}
          icon={PiFilePdf}
        />

        {documents.length > 0 && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 ring-1 ring-slate-100">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
              <span className="text-[18px] font-bold text-gold-600">
                {documents.length.toLocaleString("fa-IR")}
              </span>
              <span className="text-[12.5px] text-slate-500">
                مدرک انتخاب‌شده
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {documents.map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white ring-1 ring-slate-100 group/doc"
                >
                  <PiFilePdf className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  <span className="text-[12px] text-slate-700 truncate flex-1">
                    مدرک {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDoc(idx)}
                    aria-label="حذف مدرک"
                    className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-rose-500 transition opacity-0 group-hover/doc:opacity-100"
                  >
                    <PiTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </FormSection>
    </>
  );
}