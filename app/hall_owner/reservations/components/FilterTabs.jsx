// app/hall_owner/reservations/components/FilterTabs.jsx
"use client";

const TABS = [
    { key: "all", label: "همه" },
    { key: "pending", label: "در انتظار", color: "#B45309" },
    { key: "accepted", label: "تایید شده", color: "#047857" },
    { key: "rejected", label: "رد شده", color: "#B91C1C" },
    { key: "canceled", label: "لغو شده", color: "#4B5563" },
];

export default function FilterTabs({ active, onChange, counts = {} }) {
    return (
        <div className="flex flex-wrap gap-2">
            {TABS.map((t) => {
                const isActive = active === t.key;
                const count = t.key === "all"
                    ? Object.values(counts).reduce((a, b) => a + b, 0)
                    : counts[t.key] || 0;

                return (
                    <button
                        key={t.key}
                        onClick={() => onChange(t.key)}
                        className={`px-3.5 py-2 text-sm rounded-xl border-2 transition-all flex items-center gap-2 ${isActive
                                ? "bg-[#D4B06A] border-[#D4B06A] text-white font-bold shadow-md"
                                : "bg-white border-gray-100 text-gray-600 hover:border-[#D4B06A]"
                            }`}
                    >
                        <span>{t.label}</span>
                        {count > 0 && (
                            <span
                                className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${isActive ? "bg-white/25 text-white" : "bg-gray-100 text-gray-600"
                                    }`}
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