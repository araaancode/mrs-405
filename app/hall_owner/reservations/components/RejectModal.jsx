// app/hall_owner/reservations/components/RejectModal.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PiXCircleFill,
  PiX,
  PiSpinnerGap,
  PiWarningCircle,
  PiNote,
  PiLightning,
} from "react-icons/pi";

const QUICK_REASONS = [
  "تالار در این تاریخ رزرو شده است",
  "تعداد مهمانان بیش از ظرفیت است",
  "درخواست کاربر با قوانین تالار همخوانی ندارد",
  "عدم پرداخت پیش‌پرداخت در زمان مقرر",
];

export default function RejectModal({ open, onClose, onReject, loading }) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
      setNote("");
      setError("");
    }
  }, [open]);

  const handleReject = () => {
    if (reason.trim().length < 5) {
      setError("دلیل رد باید حداقل ۵ کاراکتر باشد");
      return;
    }
    onReject({ cancel_reason: reason.trim(), owner_note: note.trim() });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
            fixed inset-0 z-50
            bg-slate-950/60 backdrop-blur-sm
            flex items-center justify-center
            p-4
          "
          onClick={loading ? undefined : onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="
              relative bg-white rounded-2xl
              ring-1 ring-slate-100
              shadow-2xl
              w-full max-w-md p-6
              max-h-[90vh] overflow-y-auto
              scrollbar-thin
            "
            dir="rtl"
          >
            {/* دکمه بستن */}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="بستن"
              className="
                absolute top-4 left-4
                w-8 h-8 rounded-lg
                flex items-center justify-center
                text-slate-400 hover:text-slate-700 hover:bg-slate-100
                active:scale-90
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-all duration-200
              "
            >
              <PiX className="w-4 h-4" />
            </button>

            {/* آیکون */}
            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/60 ring-1 ring-rose-100">
              <PiXCircleFill className="w-7 h-7 text-rose-600" />
            </div>

            <h3 className="text-[16px] font-bold text-slate-900 text-center mb-2">
              رد رزرو
            </h3>
            <p className="text-[13px] text-slate-500 text-center leading-relaxed mb-5">
              لطفاً دلیل رد را برای اطلاع کاربر وارد کنید.
            </p>

            {/* پیشنهادهای سریع */}
            <div className="mb-4">
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 mb-2">
                <PiLightning className="w-3.5 h-3.5 text-gold-500" />
                دلایل پیشنهادی
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setReason(r);
                      setError("");
                    }}
                    className={`
                      px-2.5 py-1.5 rounded-lg
                      text-[11px] font-medium
                      border transition-all duration-200
                      active:scale-95
                      ${
                        reason === r
                          ? "bg-rose-50 border-rose-300 text-rose-700 font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-700 hover:bg-rose-50/40"
                      }
                    `}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* دلیل رد */}
            <label className="flex items-center gap-1.5 text-[13px] font-medium text-slate-700 mb-1.5">
              <PiWarningCircle className="w-3.5 h-3.5 text-rose-500" />
              دلیل رد
              <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              rows={3}
              maxLength={300}
              placeholder="دلیل رد را بنویسید..."
              className={`
                w-full px-3.5 py-2.5
                bg-white border rounded-xl
                text-[13.5px] text-slate-900
                placeholder:text-slate-400
                resize-none
                focus:outline-none focus:ring-4
                transition-all duration-200
                ${
                  error
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                    : "border-slate-200 hover:border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                }
              `}
            />
            <div className="flex items-center justify-between mt-1.5">
              {error ? (
                <p className="text-[11px] text-rose-600 flex items-center gap-1">
                  <PiWarningCircle className="w-3 h-3" />
                  {error}
                </p>
              ) : (
                <span className="text-[10.5px] text-slate-400">
                  حداقل ۵ کاراکتر
                </span>
              )}
              <span className="text-[10.5px] text-slate-400">
                {reason.length.toLocaleString("fa-IR")} / ۳۰۰
              </span>
            </div>

            {/* یادداشت اضافی */}
            <label className="flex items-center gap-1.5 text-[13px] font-medium text-slate-700 mb-1.5 mt-4">
              <PiNote className="w-3.5 h-3.5 text-gold-500" />
              یادداشت اضافی (اختیاری)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="توضیحات بیشتر..."
              className="
                w-full px-3.5 py-2.5
                bg-white border border-slate-200 rounded-xl
                text-[13.5px] text-slate-900
                placeholder:text-slate-400
                resize-none
                hover:border-gold-300
                focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10
                transition-all duration-200
              "
            />

            {/* دکمه‌ها */}
            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={handleReject}
                disabled={loading}
                className="
                  flex-1 inline-flex items-center justify-center gap-2
                  py-3 rounded-xl
                  text-[13px] font-bold text-white
                  bg-gradient-to-b from-rose-400 to-rose-600
                  hover:from-rose-500 hover:to-rose-700
                  shadow-md shadow-rose-500/25
                  hover:shadow-lg hover:shadow-rose-500/40
                  active:scale-95
                  disabled:opacity-60 disabled:cursor-not-allowed
                  transition-all duration-200
                "
              >
                {loading ? (
                  <>
                    <PiSpinnerGap className="w-4 h-4 animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <PiXCircleFill className="w-4 h-4" />
                    رد کردن رزرو
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="
                  px-5 py-3 rounded-xl
                  text-[13px] font-medium text-slate-700
                  bg-white border border-slate-200
                  hover:bg-slate-50 hover:border-slate-300
                  active:scale-95
                  disabled:opacity-60 disabled:cursor-not-allowed
                  transition-all duration-200
                "
              >
                انصراف
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}