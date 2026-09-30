// app/hall_owner/reservations/components/ConfirmModal.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PiCheckCircleFill,
  PiX,
  PiSpinnerGap,
  PiNote,
} from "react-icons/pi";

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  reservationId,
  loading,
}) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) setNote("");
  }, [open]);

  const handleConfirm = () => {
    onConfirm({ owner_note: note.trim() });
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
            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 ring-1 ring-emerald-100">
              <PiCheckCircleFill className="w-7 h-7 text-emerald-600" />
            </div>

            <h3 className="text-[16px] font-bold text-slate-900 text-center mb-2">
              تایید رزرو
            </h3>
            <p className="text-[13px] text-slate-500 text-center leading-relaxed mb-5">
              آیا از تایید این رزرو مطمئن هستید؟ پس از تایید، رزرو در وضعیت
              «تایید شده» قرار می‌گیرد و به کاربر اطلاع داده می‌شود.
            </p>

            {/* یادداشت */}
            <label className="flex items-center gap-1.5 text-[13px] font-medium text-slate-700 mb-1.5">
              <PiNote className="w-3.5 h-3.5 text-gold-500" />
              یادداشت مالک (اختیاری)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="مثلاً: لطفاً ۱ ساعت قبل از مراسم حضور داشته باشید..."
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

            <p className="text-[10.5px] text-slate-400 mt-1.5 text-left">
              {note.length.toLocaleString("fa-IR")} / ۵۰۰
            </p>

            {/* دکمه‌ها */}
            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="
                  flex-1 inline-flex items-center justify-center gap-2
                  py-3 rounded-xl
                  text-[13px] font-bold text-white
                  bg-gradient-to-b from-emerald-400 to-emerald-600
                  hover:from-emerald-500 hover:to-emerald-700
                  shadow-md shadow-emerald-500/25
                  hover:shadow-lg hover:shadow-emerald-500/40
                  active:scale-95
                  disabled:opacity-60 disabled:cursor-not-allowed
                  transition-all duration-200
                "
              >
                {loading ? (
                  <>
                    <PiSpinnerGap className="w-4 h-4 animate-spin" />
                    در حال تایید...
                  </>
                ) : (
                  <>
                    <PiCheckCircleFill className="w-4 h-4" />
                    بله، تایید کن
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