// app/hall_owner/reservations/components/FilterTabs.jsx
"use client";

import { motion } from "framer-motion";
import {
  PiCalendarBlank,
  PiClock,
  PiCheckCircle,
  PiXCircle,
  PiProhibit,
} from "react-icons/pi";

const TABS = [
  {
    key: "all",
    label: "همه",
    icon: PiCalendarBlank,
    color: "text-slate-600",
    activeBg: "from-slate-500 to-slate-700",
  },
  {
    key: "pending",
    label: "در انتظار",
    icon: PiClock,
    color: "text-amber-700",
    activeBg: "from-amber-400 to-amber-600",
  },
  {
    key: "accepted",
    label: "تایید شده",
    icon: PiCheckCircle,
    color: "text-emerald-700",
    activeBg: "from-emerald-400 to-emerald-600",
  },
  {
    key: "rejected",
    label: "رد شده",
    icon: PiXCircle,
    color: "text-rose-700",
    activeBg: "from-rose-400 to-rose-600",
  },
  {
    key: "canceled",
    label: "لغو شده",
    icon: PiProhibit,
    color: "text-slate-600",
    activeBg: "from-slate-400 to-slate-600",
  },
];

export default function FilterTabs({ active, onChange, counts = {} }) {
  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.key;
        const count = tab.key === "all" ? totalCount : counts[tab.key] || 0;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            aria-pressed={isActive}
            className={`
              group relative
              inline-flex items-center gap-2
              px-3.5 py-2 rounded-xl
              text-[12.5px] font-medium
              border transition-all duration-200
              active:scale-95
              ${
                isActive
                  ? `bg-gradient-to-b ${tab.activeBg} text-white border-transparent shadow-md`
                  : `bg-white border-slate-200 text-slate-600 hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50/40`
              }
            `}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>

            {count > 0 && (
              <span
                className={`
                  min-w-[22px] h-[20px] px-1.5
                  inline-flex items-center justify-center
                  rounded-full
                  text-[10.5px] font-bold
                  ${
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-slate-100 text-slate-600 group-hover:bg-gold-100 group-hover:text-gold-700"
                  }
                `}
              >
                {count.toLocaleString("fa-IR")}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}