// app/halls/components/ActiveFiltersBar.jsx
"use client";
import { PiX } from "react-icons/pi";
import { useFilterStore } from "../store/filterStore";

export default function ActiveFiltersBar() {
    const { filters, setFilter, toggleProperty, resetFilters } = useFilterStore();

    const chips = [];
    if (filters.search) chips.push({ key: "search", label: `جستجو: ${filters.search}`, onRemove: () => setFilter("search", "") });
    if (filters.province) chips.push({ key: "province", label: filters.province, onRemove: () => setFilter("province", "") });
    if (filters.hall_type) chips.push({ key: "hall_type", label: filters.hall_type, onRemove: () => setFilter("hall_type", "") });
    if (filters.event_type) chips.push({ key: "event_type", label: filters.event_type, onRemove: () => setFilter("event_type", "") });
    if (filters.host_type) chips.push({ key: "host_type", label: filters.host_type, onRemove: () => setFilter("host_type", "") });
    if (filters.capacityRange) chips.push({ key: "cap", label: filters.capacityRange.label, onRemove: () => setFilter("capacityRange", null) });
    if (filters.priceRange) chips.push({ key: "price", label: filters.priceRange.label, onRemove: () => setFilter("priceRange", null) });
    filters.properties.forEach((p) =>
        chips.push({ key: `prop-${p}`, label: p, onRemove: () => toggleProperty(p) })
    );
    if (filters.hasParking) chips.push({ key: "parking", label: "پارکینگ", onRemove: () => setFilter("hasParking", false) });
    if (filters.hasSans) chips.push({ key: "sans", label: "سانس", onRemove: () => setFilter("hasSans", false) });

    if (chips.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mb-4">
            {chips.map((c) => (
                <span
                    key={c.key}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D4B06A]/10 text-[#2C2418] text-xs rounded-lg font-medium border border-[#D4B06A]/20"
                >
                    {c.label}
                    <button onClick={c.onRemove} className="hover:text-red-500 transition-colors">
                        <PiX className="w-3.5 h-3.5" />
                    </button>
                </span>
            ))}
            <button
                onClick={resetFilters}
                className="text-xs text-red-500 hover:text-red-700 font-bold px-2"
            >
                پاک کردن همه
            </button>
        </div>
    );
}