"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { PiMapPin, PiMagnifyingGlass, PiCrosshair, PiX } from "react-icons/pi";
import { notify } from "@/lib/toast";

/* ============================================================
   LocationPicker — انتخاب موقعیت روی نقشه (Leaflet محلی)
   ============================================================ */
export default function LocationPicker() {
    const { control, setValue, watch } = useFormContext();

    const lat = watch("lat");
    const lng = watch("lng");

    const [searchQuery, setSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [loadingAddress, setLoadingAddress] = useState(false);
    const [mapReady, setMapReady] = useState(false);

    const mapContainerRef = useRef(null);
    const mapInstance = useRef(null);
    const markerRef = useRef(null);

    const NESHAN_KEY = process.env.NEXT_PUBLIC_NESHAN_API_KEY;

    /* ============================================================
       Reverse Geocoding (نشان) — بی‌صدا در صورت خطا
       ============================================================ */
    const fetchAddressFromCoordinates = useCallback(
        async (latitude, longitude) => {
            if (!NESHAN_KEY) return;

            setLoadingAddress(true);

            try {
                const res = await fetch(
                    `https://api.neshan.org/v5/reverse?lat=${latitude}&lng=${longitude}`,
                    {
                        method: "GET",
                        headers: { "Api-Key": NESHAN_KEY },
                    }
                );

                if (!res.ok) {
                    console.warn(
                        `[Neshan Reverse] HTTP ${res.status} — skipped`
                    );
                    return;
                }

                const data = await res.json();

                const address =
                    data?.formatted_address ||
                    (data?.address && data.address !== "null"
                        ? data.address
                        : null);

                if (address) {
                    setValue("address", address, { shouldDirty: true });
                    notify.success("آدرس به‌روزرسانی شد");
                }
            } catch (err) {
                console.warn("[Neshan Reverse] failed:", err?.message);
            } finally {
                setLoadingAddress(false);
            }
        },
        [NESHAN_KEY, setValue]
    );

    /* ============================================================
       Init Leaflet — فقط یک بار
       ============================================================ */
    useEffect(() => {
        let isCancelled = false;

        (async () => {
            try {
                if (typeof window === "undefined") return;
                if (mapInstance.current) return;
                if (!mapContainerRef.current) return;

                /* پاک کردن _leaflet_id قبلی */
                if (mapContainerRef.current._leaflet_id) {
                    console.warn(
                        "Container already has _leaflet_id — cleaning"
                    );
                    mapContainerRef.current._leaflet_id = null;
                }

                /* Leaflet از npm — نه CDN */
                const L = (await import("leaflet")).default;
                if (isCancelled) return;

                /* Fix icons */
                delete L.Icon.Default.prototype._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl:
                        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                    iconUrl:
                        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                    shadowUrl:
                        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                });

                /* Initial center */
                const initialLat = Number(lat) || 35.6892;
                const initialLng = Number(lng) || 51.389;

                /* Create map */
                const map = L.map(mapContainerRef.current, {
                    center: [initialLat, initialLng],
                    zoom: 13,
                    scrollWheelZoom: true,
                });

                /* ✅ فقط یک tile layer — OpenStreetMap */
                L.tileLayer(
                    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    {
                        attribution:
                            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                        maxZoom: 19,
                        subdomains: ["a", "b", "c"],
                    }
                ).addTo(map);

                /* Marker */
                const marker = L.marker([initialLat, initialLng], {
                    draggable: true,
                }).addTo(map);

                marker.on("dragend", (e) => {
                    const { lat: newLat, lng: newLng } = e.target.getLatLng();
                    const latStr = newLat.toFixed(6);
                    const lngStr = newLng.toFixed(6);
                    setValue("lat", latStr, { shouldDirty: true });
                    setValue("lng", lngStr, { shouldDirty: true });
                    fetchAddressFromCoordinates(latStr, lngStr);
                });

                map.on("click", (e) => {
                    const { lat: newLat, lng: newLng } = e.latlng;
                    const latStr = newLat.toFixed(6);
                    const lngStr = newLng.toFixed(6);
                    marker.setLatLng([newLat, newLng]);
                    setValue("lat", latStr, { shouldDirty: true });
                    setValue("lng", lngStr, { shouldDirty: true });
                    fetchAddressFromCoordinates(latStr, lngStr);
                });

                mapInstance.current = map;
                markerRef.current = marker;
                setMapReady(true);

                setTimeout(() => {
                    if (map && !isCancelled) map.invalidateSize();
                }, 200);

                console.log("✅ Leaflet Map initialized");
            } catch (err) {
                console.error("❌ Map init error:", err);
            }
        })();

        return () => {
            isCancelled = true;
            if (mapInstance.current) {
                try {
                    mapInstance.current.remove();
                } catch (e) {
                    console.warn("Map cleanup error:", e);
                }
                mapInstance.current = null;
                markerRef.current = null;
            }
            if (mapContainerRef.current) {
                mapContainerRef.current._leaflet_id = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Update marker when lat/lng change externally */
    useEffect(() => {
        if (!mapInstance.current || !markerRef.current) return;

        const newLat = Number(lat);
        const newLng = Number(lng);

        if (!isNaN(newLat) && !isNaN(newLng) && newLat && newLng) {
            try {
                markerRef.current.setLatLng([newLat, newLng]);
                mapInstance.current.setView(
                    [newLat, newLng],
                    mapInstance.current.getZoom()
                );
            } catch (e) {
                console.warn("Marker update error:", e);
            }
        }
    }, [lat, lng]);

    /* Search */
    const handleSearch = useCallback(async () => {
        const q = searchQuery.trim();
        if (!q) {
            notify.error("عبارت جستجو را وارد کنید");
            return;
        }

        setSearching(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    q
                )}&limit=5&accept-language=fa`,
                { headers: { "User-Agent": "MRS-App/1.0" } }
            );

            if (!res.ok) throw new Error("خطا در جستجو");

            const results = await res.json();

            if (!results.length) {
                notify.error("نتیجه‌ای یافت نشد");
                setSearchResults([]);
                return;
            }

            setSearchResults(results);
        } catch (err) {
            console.error(err);
            notify.error("خطا در جستجو");
        } finally {
            setSearching(false);
        }
    }, [searchQuery]);

    /* Select result */
    const handleSelectResult = useCallback(
        (result) => {
            const newLat = Number(result.lat);
            const newLng = Number(result.lon);
            const latStr = newLat.toFixed(6);
            const lngStr = newLng.toFixed(6);

            setValue("lat", latStr, { shouldDirty: true });
            setValue("lng", lngStr, { shouldDirty: true });

            if (mapInstance.current && markerRef.current) {
                markerRef.current.setLatLng([newLat, newLng]);
                mapInstance.current.setView([newLat, newLng], 16);
            }

            setSearchResults([]);
            setSearchQuery("");
            fetchAddressFromCoordinates(latStr, lngStr);
        },
        [setValue, fetchAddressFromCoordinates]
    );

    const handleClearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
    };

    /* Use current location */
    const handleLocate = () => {
        if (!navigator.geolocation) {
            notify.error("مرورگر از موقعیت‌یابی پشتیبانی نمی‌کند");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newLat = pos.coords.latitude;
                const newLng = pos.coords.longitude;
                const latStr = newLat.toFixed(6);
                const lngStr = newLng.toFixed(6);

                setValue("lat", latStr, { shouldDirty: true });
                setValue("lng", lngStr, { shouldDirty: true });

                if (mapInstance.current && markerRef.current) {
                    markerRef.current.setLatLng([newLat, newLng]);
                    mapInstance.current.setView([newLat, newLng], 16);
                }

                notify.success("موقعیت فعلی شما انتخاب شد");
                fetchAddressFromCoordinates(latStr, lngStr);
            },
            () => notify.error("دسترسی به موقعیت مکانی رد شد"),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    /* Render */
    return (
        <div className="space-y-3">
            {/* Search bar */}
            <div className="relative">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <PiMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSearch();
                                }
                            }}
                            placeholder="جستجوی آدرس یا نام مکان..."
                            dir="rtl"
                            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border-2 border-slate-200 focus:border-gold-400 focus:ring-4 focus:ring-gold-500/12 outline-none transition"
                        />

                        {searchQuery && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 flex items-center justify-center transition"
                                title="پاک کردن"
                            >
                                <PiX className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleSearch}
                        disabled={searching}
                        className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-b from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 shadow-md shadow-gold-500/25 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 transition"
                    >
                        {searching ? "..." : "جستجو"}
                    </button>

                    <button
                        type="button"
                        onClick={handleLocate}
                        className="w-10 h-10 rounded-xl bg-white border-2 border-slate-200 hover:border-gold-400 hover:bg-gold-50 flex items-center justify-center text-slate-500 hover:text-gold-600 transition"
                        title="استفاده از موقعیت فعلی"
                    >
                        <PiCrosshair className="w-4 h-4" />
                    </button>
                </div>

                {/* Search results */}
                {searchResults.length > 0 && (
                    <div className="absolute top-full right-0 left-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg z-[1000] max-h-60 overflow-y-auto">
                        {searchResults.map((r) => (
                            <button
                                key={r.place_id}
                                type="button"
                                onClick={() => handleSelectResult(r)}
                                className="w-full text-right px-4 py-2.5 hover:bg-gold-50 border-b border-slate-100 last:border-b-0 transition text-xs text-slate-700"
                            >
                                <div className="flex items-start gap-2">
                                    <PiMapPin className="w-3.5 h-3.5 text-gold-500 mt-0.5 flex-shrink-0" />
                                    <span className="line-clamp-2 leading-relaxed">
                                        {r.display_name}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Map container */}
            <div className="relative rounded-xl overflow-hidden ring-1 ring-slate-200 bg-slate-100">
                <div
                    ref={mapContainerRef}
                    className="w-full h-[320px]"
                    style={{ direction: "ltr", zIndex: 0 }}
                />
                {!mapReady && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <p className="text-slate-400 text-sm">
                            در حال بارگذاری نقشه...
                        </p>
                    </div>
                )}
                {loadingAddress && (
                    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg shadow text-xs text-slate-600 flex items-center gap-2 pointer-events-none">
                        <span className="w-3 h-3 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                        دریافت آدرس...
                    </div>
                )}
            </div>

            {/* Lat/Lng inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Controller
                    name="lat"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                عرض جغرافیایی (lat)
                            </label>
                            <input
                                {...field}
                                type="text"
                                dir="ltr"
                                placeholder="35.689200"
                                className={`w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none transition font-mono ${
                                    fieldState.error
                                        ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/12"
                                        : "border-slate-200 focus:border-gold-400 focus:ring-4 focus:ring-gold-500/12"
                                }`}
                            />
                            {fieldState.error && (
                                <p className="mt-1 text-xs text-rose-500">
                                    {fieldState.error.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                <Controller
                    name="lng"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                طول جغرافیایی (lng)
                            </label>
                            <input
                                {...field}
                                type="text"
                                dir="ltr"
                                placeholder="51.389000"
                                className={`w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none transition font-mono ${
                                    fieldState.error
                                        ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/12"
                                        : "border-slate-200 focus:border-gold-400 focus:ring-4 focus:ring-gold-500/12"
                                }`}
                            />
                            {fieldState.error && (
                                <p className="mt-1 text-xs text-rose-500">
                                    {fieldState.error.message}
                                </p>
                            )}
                        </div>
                    )}
                />
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
                💡 روی نقشه کلیک کنید، نشانگر را بکشید، آدرس را جستجو کنید یا
                از موقعیت فعلی خود استفاده کنید.
            </p>
        </div>
    );
}