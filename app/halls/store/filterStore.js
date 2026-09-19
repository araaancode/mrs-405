// app/halls/store/filterStore.js
import { create } from "zustand";

const initialFilters = {
    search: "",
    province: "",
    city: "",
    hall_type: "",
    event_type: "",
    host_type: "",
    capacityRange: null,
    priceRange: null,
    properties: [],
    hasParking: false,
    hasSans: false,
};

export const useFilterStore = create((set, get) => ({
    filters: { ...initialFilters },
    sort: "newest",
    viewMode: "grid", // grid | list

    setFilter: (key, value) =>
        set((state) => ({ filters: { ...state.filters, [key]: value } })),

    toggleProperty: (prop) =>
        set((state) => {
            const props = state.filters.properties;
            return {
                filters: {
                    ...state.filters,
                    properties: props.includes(prop)
                        ? props.filter((p) => p !== prop)
                        : [...props, prop],
                },
            };
        }),

    setSort: (sort) => set({ sort }),
    setViewMode: (viewMode) => set({ viewMode }),

    resetFilters: () => set({ filters: { ...initialFilters }, sort: "newest" }),

    hasActiveFilters: () => {
        const f = get().filters;
        return Object.entries(f).some(([key, val]) => {
            if (Array.isArray(val)) return val.length > 0;
            if (typeof val === "boolean") return val;
            if (val === null) return false;
            return val !== "";
        });
    },

    getActiveFilterCount: () => {
        const f = get().filters;
        let count = 0;
        if (f.search) count++;
        if (f.province) count++;
        if (f.city) count++;
        if (f.hall_type) count++;
        if (f.event_type) count++;
        if (f.host_type) count++;
        if (f.capacityRange) count++;
        if (f.priceRange) count++;
        if (f.properties.length) count += f.properties.length;
        if (f.hasParking) count++;
        if (f.hasSans) count++;
        return count;
    },
}));