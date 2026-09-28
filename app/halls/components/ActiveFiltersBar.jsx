// app/halls/components/ActiveFiltersBar.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PiX, PiFunnel, PiMagnifyingGlass } from "react-icons/pi";
import { useFilterStore } from "../store/filterStore";

/* ============================================================
   FilterChip — چیپ فیلتر فعال
   ============================================================ */
function FilterChip({ icon: Icon, label, onRemove, prefix }) {
    return (
        <motion.span
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="
        group inline-flex items-center gap-1.5
        pr-2.5 pl-1.5 py-1.5
        bg-white
        border border-gold-200
        rounded-lg
        text-[11.5px] font-medium text-slate-700
        shadow-sm hover:shadow-md hover:border-gold-300
        transition-all duration-200
        max-w-full
      "
        >
            {Icon ? (
                <Icon className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
            ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
            )}

            <span className="truncate">
                {prefix && (
                    <span className="text-slate-400 font-normal ml-1">{prefix}</span>
                )}
                {label}
            </span>

            <button
                type="button"
                onClick={onRemove}
                aria-label={`حذف فیلتر ${label}`}
                className="
          w-5 h-5 rounded-md
          flex items-center justify-center flex-shrink-0
          text-slate-400
          hover:text-rose-500 hover:bg-rose-50
          active:scale-90
          transition-all duration-150
        "
            >
                <PiX className="w-3 h-3" strokeWidth={2.5} />
            </button>
        </motion.span>
    );
}

/* ============================================================
   ActiveFiltersBar
   ============================================================ */
export default function ActiveFiltersBar() {
    const { filters, setFilter, toggleProperty, resetFilters } =
        useFilterStore();

    /* ============================================================
       ساخت لیست چیپ‌ها
       ============================================================ */
    const chips = [];

    if (filters.search) {
        chips.push({
            key: "search",
            label: filters.search,
            prefix: "جستجو:",
            icon: PiMagnifyingGlass,
            onRemove: () => setFilter("search", ""),
        });
    }

    if (filters.province) {
        chips.push({
            key: "province",
            label: filters.province,
            onRemove: () => setFilter("province", ""),
        });
    }

    if (filters.hall_type) {
        chips.push({
            key: "hall_type",
            label: filters.hall_type,
            onRemove: () => setFilter("hall_type", ""),
        });
    }

    if (filters.event_type) {
        chips.push({
            key: "event_type",
            label: filters.event_type,
            onRemove: () => setFilter("event_type", ""),
        });
    }

    if (filters.host_type) {
        chips.push({
            key: "host_type",
            label: filters.host_type,
            onRemove: () => setFilter("host_type", ""),
        });
    }

    if (filters.capacityRange) {
        chips.push({
            key: "cap",
            label: filters.capacityRange.label,
            onRemove: () => setFilter("capacityRange", null),
        });
    }

    if (filters.priceRange) {
        chips.push({
            key: "price",
            label: filters.priceRange.label,
            onRemove: () => setFilter("priceRange", null),
        });
    }

    filters.properties.forEach((p) => {
        chips.push({
            key: `prop-${p}`,
            label: p,
            onRemove: () => toggleProperty(p),
        });
    });

    if (filters.hasParking) {
        chips.push({
            key: "parking",
            label: "پارکینگ",
            onRemove: () => setFilter("hasParking", false),
        });
    }

    if (filters.hasSans) {
        chips.push({
            key: "sans",
            label: "سانس",
            onRemove: () => setFilter("hasSans", false),
        });
    }

    /* ============================================================
       حالت خالی — هیچ چیپی
       ============================================================ */
    const count = chips.length;
    if (count === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="
          relative
          mb-4 p-3
          bg-gold-50/40
          border border-gold-100
          rounded-xl
        "
            >
                <div className="flex items-start gap-3 flex-wrap">
                    {/* آیکون + برچسب */}
                    <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                        <div className="w-7 h-7 rounded-lg bg-white border border-gold-200 flex items-center justify-center shadow-sm">
                            <PiFunnel className="w-3.5 h-3.5 text-gold-600" />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-[11px] font-bold text-slate-700 leading-tight">
                                فیلترهای فعال
                            </p>
                            <p className="text-[10px] text-slate-400 leading-tight">
                                {count.toLocaleString("fa-IR")} مورد
                            </p>
                        </div>
                    </div>

                    {/* جداکننده عمودی */}
                    <div className="hidden sm:block w-px self-stretch bg-gold-200/50" />

                    {/* چیپ‌ها */}
                    <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {chips.map((c) => (
                                <FilterChip
                                    key={c.key}
                                    icon={c.icon}
                                    label={c.label}
                                    prefix={c.prefix}
                                    onRemove={c.onRemove}
                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* دکمه پاک کردن همه */}
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="
              flex-shrink-0 self-start
              inline-flex items-center gap-1.5
              px-3 py-1.5 rounded-lg
              text-[11px] font-bold
              text-rose-600
              bg-white
              border border-rose-100
              hover:bg-rose-500 hover:text-white hover:border-rose-500
              hover:shadow-md hover:shadow-rose-500/25
              active:scale-95
              transition-all duration-200
            "
                    >
                        <PiX className="w-3 h-3" strokeWidth={2.5} />
                        <span>پاک کردن همه</span>
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}