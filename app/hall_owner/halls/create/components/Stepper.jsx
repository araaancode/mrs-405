"use client";
import { motion } from "framer-motion";
import {
  PiBuildings,
  PiUser,
  PiWrench,
  PiCurrencyCircleDollar,
  PiShieldCheck,
  PiCalendarBlank,
  PiImage,
  PiCheck,
} from "react-icons/pi";

const ICONS = {
  building: PiBuildings,
  user: PiUser,
  wrench: PiWrench,
  coin: PiCurrencyCircleDollar,
  shield: PiShieldCheck,
  calendar: PiCalendarBlank,
  image: PiImage,
};

export default function Stepper({ steps, current, progress }) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-[0_2px_12px_rgba(15,23,42,0.06)] p-4 sm:p-6">
      {/* ==================== Header: شمارنده + درصد ==================== */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-[13px] font-bold text-slate-900">
            مرحله {current + 1}
          </span>
          <span className="text-[11.5px] text-slate-400">
            از {steps.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-gold-600 tabular-nums">
            {Math.round(progress)}٪
          </span>
          <span className="text-[11px] text-slate-400">تکمیل</span>
        </div>
      </div>

      {/* ==================== Progress Bar ==================== */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-8 relative">
        <motion.div
          className="h-full bg-gradient-to-l from-gold-400 via-gold-500 to-gold-600 rounded-full"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* ==================== Steps ==================== */}
      <ol className="flex items-center justify-between gap-1 overflow-x-auto pt-4 pb-2">
        {steps.map((step, i) => {
          const Icon = ICONS[step.icon];
          const done = i < current;
          const active = i === current;

          return (
            <li
              key={step.id}
              aria-current={active ? "step" : undefined}
              className="flex-1 min-w-[76px] flex flex-col items-center gap-2 pt-1"
            >
              <motion.div
                initial={false}
                animate={{ scale: active ? 1.08 : 1 }}
                transition={{ duration: 0.25 }}
                className={`
                  w-11 h-11 rounded-2xl flex items-center justify-center
                  ring-2 transition-all duration-300 relative
                  ${
                    done
                      ? "bg-emerald-500 ring-emerald-500/30 text-white shadow-md shadow-emerald-500/25"
                      : active
                      ? "bg-gradient-to-br from-gold-400 to-gold-600 ring-gold-500/40 text-white shadow-lg shadow-gold-500/35"
                      : "bg-slate-50 ring-slate-200/70 text-slate-400"
                  }
                `}
              >
                {done ? (
                  <PiCheck className="w-5 h-5" strokeWidth={2.5} />
                ) : (
                  <Icon className="w-5 h-5" />
                )}

                {/* Pulse halo برای مرحله فعال */}
                {active && (
                  <motion.span
                    className="absolute inset-0 rounded-2xl bg-gold-400/30 pointer-events-none"
                    initial={{ opacity: 0.6, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                )}
              </motion.div>

              <span
                className={`
                  text-[11px] font-bold text-center leading-tight tracking-tight
                  transition-colors
                  ${
                    active
                      ? "text-gold-700"
                      : done
                      ? "text-emerald-700"
                      : "text-slate-400"
                  }
                `}
              >
                {step.title}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}