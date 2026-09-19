// app/halls/hooks/useHallFilters.js
"use client";
import { useMemo } from "react";

export function useHallFilters(halls, filters, sort) {
    return useMemo(() => {
        let result = [...halls];

        // جستجوی متنی پیشرفته
        if (filters.search.trim()) {
            const term = filters.search.trim().toLowerCase();
            result = result.filter((h) => {
                const haystack = [
                    h.title,
                    h.city,
                    h.province,
                    h.address,
                    h.description,
                    h.hall_type,
                    h.event_type,
                    h.host_type,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();
                return haystack.includes(term);
            });
        }

        // فیلترهای تک‌مقداری
        if (filters.province) result = result.filter((h) => h.province === filters.province);
        if (filters.city) result = result.filter((h) => h.city === filters.city);
        if (filters.hall_type) result = result.filter((h) => h.hall_type === filters.hall_type);
        if (filters.event_type) result = result.filter((h) => h.event_type === filters.event_type);
        if (filters.host_type) result = result.filter((h) => h.host_type === filters.host_type);

        // ظرفیت
        if (filters.capacityRange) {
            const { min, max } = filters.capacityRange;
            result = result.filter((h) => (h.capacity ?? 0) >= min && (h.capacity ?? 0) <= max);
        }

        // قیمت
        if (filters.priceRange) {
            const { min, max } = filters.priceRange;
            result = result.filter((h) => {
                const p = h.sans_price ?? 0;
                return p >= min && p <= max;
            });
        }

        // ویژگی‌ها (هر ویژگی انتخاب‌شده باید در properties تالار باشد)
        if (filters.properties.length > 0) {
            result = result.filter((h) => {
                const props = (h.properties || []).join(" ").toLowerCase();
                return filters.properties.every((p) => props.includes(p.toLowerCase()));
            });
        }

        // پارکینگ
        if (filters.hasParking) {
            result = result.filter((h) => {
                const pc = String(h.parking_count ?? "");
                return pc === "نامحدود" || (parseInt(pc, 10) || 0) > 0;
            });
        }

        // قابلیت سانس
        if (filters.hasSans) result = result.filter((h) => h.has_sans === true);

        // مرتب‌سازی
        const sorters = {
            newest: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
            price_asc: (a, b) => (a.sans_price ?? 0) - (b.sans_price ?? 0),
            price_desc: (a, b) => (b.sans_price ?? 0) - (a.sans_price ?? 0),
            capacity_desc: (a, b) => (b.capacity ?? 0) - (a.capacity ?? 0),
            capacity_asc: (a, b) => (a.capacity ?? 0) - (b.capacity ?? 0),
        };
        if (sorters[sort]) result.sort(sorters[sort]);

        return result;
    }, [halls, filters, sort]);
}