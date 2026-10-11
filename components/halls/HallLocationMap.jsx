"use client";

import { useEffect, useRef, useState } from "react";
import { PiMapPin, PiNavigationArrow } from "react-icons/pi";

/* ============================================================
   HallLocationMap — نمایش فقط-خواندنی مکان تالار روی نقشه
   ============================================================ */
export default function HallLocationMap({
    lat,
    lng,
    title = "موقعیت تالار",
    address = "",
    height = 320,
}) {
    const mapContainerRef = useRef(null);
    const mapInstance = useRef(null);
    const markerRef = useRef(null);
    const [mapReady, setMapReady] = useState(false);

    /* ✅ بررسی معتبر بودن مختصات */
    const hasCoords =
        lat !== null &&
        lat !== undefined &&
        lng !== null &&
        lng !== undefined &&
        !isNaN(Number(lat)) &&
        !isNaN(Number(lng)) &&
        Number(lat) !== 0 &&
        Number(lng) !== 0;

    const initialLat = hasCoords ? Number(lat) : 35.6892;
    const initialLng = hasCoords ? Number(lng) : 51.389;

    /* ============================================================
       Init Leaflet
       ============================================================ */
    useEffect(() => {
        let isCancelled = false;
        let map = null;

        const initMap = async () => {
            if (typeof window === "undefined") return;
            if (mapInstance.current) return;
            if (!mapContainerRef.current) return;

            if (mapContainerRef.current._leaflet_id) {
                mapContainerRef.current._leaflet_id = null;
            }

            try {
                const L = (await import("leaflet")).default;
                if (isCancelled) return;

                map = L.map(mapContainerRef.current, {
                    center: [initialLat, initialLng],
                    zoom: hasCoords ? 15 : 5,
                    scrollWheelZoom: false,
                    dragging: true,
                    zoomControl: true,
                    attributionControl: true,
                });

                L.tileLayer(
                    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    {
                        attribution:
                            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                        maxZoom: 19,
                        subdomains: ["a", "b", "c"],
                    }
                ).addTo(map);

                /* ---------- Marker DivIcon طلایی ---------- */
                const markerIcon = L.divIcon({
                    className: "custom-marker-leaflet",
                    html: `
                        <div style="
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 32px;
                            height: 42px;
                            filter: drop-shadow(0 3px 6px rgba(0,0,0,0.4));
                        ">
                            <div style="
                                position: absolute;
                                top: 0;
                                left: 50%;
                                transform: translateX(-50%) rotate(-45deg);
                                width: 28px;
                                height: 28px;
                                border-radius: 50% 50% 50% 0;
                                background: linear-gradient(135deg, #D3B263 0%, #C6A14C 50%, #A8853A 100%);
                                border: 3px solid #ffffff;
                            "></div>
                            <div style="
                                position: absolute;
                                top: 9px;
                                left: 50%;
                                transform: translateX(-50%);
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                                background: #ffffff;
                            "></div>
                        </div>
                    `,
                    iconSize: [32, 42],
                    iconAnchor: [16, 42],
                });

                if (hasCoords) {
                    const marker = L.marker([initialLat, initialLng], {
                        icon: markerIcon,
                        draggable: false,
                        zIndexOffset: 1000,
                    }).addTo(map);

                    marker.bindPopup(
                        `<div style="font-family: 'IranianSans', system-ui, sans-serif; direction: rtl; text-align: right; min-width: 180px;">
                            <strong style="color:#A8853A; font-size: 13px;">${title}</strong>
                            ${
                                address
                                    ? `<p style="margin: 6px 0 0; font-size: 11px; color: #475569; line-height: 1.5;">${address}</p>`
                                    : ""
                            }
                        </div>`
                    );

                    markerRef.current = marker;
                }

                mapInstance.current = map;

                const invalidate = () => {
                    if (map && !isCancelled) {
                        try {
                            map.invalidateSize({ animate: false });
                        } catch (e) {
                            console.warn("invalidateSize error:", e);
                        }
                    }
                };

                requestAnimationFrame(() => {
                    invalidate();
                    setMapReady(true);
                });
                setTimeout(invalidate, 100);
                setTimeout(invalidate, 400);
                setTimeout(invalidate, 1000);

                if (typeof ResizeObserver !== "undefined") {
                    const ro = new ResizeObserver(() => invalidate());
                    ro.observe(mapContainerRef.current);
                    map._resizeObserver = ro;
                }
            } catch (err) {
                console.error("❌ HallLocationMap init error:", err);
            }
        };

        initMap();

        return () => {
            isCancelled = true;
            if (mapInstance.current) {
                try {
                    if (mapInstance.current._resizeObserver) {
                        mapInstance.current._resizeObserver.disconnect();
                    }
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

    /* ============================================================
       اگر مختصات تغییر کرد (مثلاً بعد از fetch)
       ============================================================ */
    useEffect(() => {
        if (!mapInstance.current || !markerRef.current) return;
        if (!hasCoords) return;

        try {
            markerRef.current.setLatLng([initialLat, initialLng]);
            mapInstance.current.setView([initialLat, initialLng], 15);
        } catch (e) {
            console.warn("Marker update error:", e);
        }
    }, [initialLat, initialLng, hasCoords]);

    /* ============================================================
       Render
       ============================================================ */
    if (!hasCoords) {
        return (
            <div className="rounded-xl bg-slate-50 ring-1 ring-slate-100 p-6 text-center">
                <PiMapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">
                    مختصات جغرافیایی این تالار ثبت نشده است
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* ---------- Map ---------- */}
            <div
                className="relative rounded-xl overflow-hidden ring-1 ring-slate-200 bg-slate-100"
                style={{ width: "100%", height: `${height}px` }}
            >
                <div
                    ref={mapContainerRef}
                    style={{
                        width: "100%",
                        height: `${height}px`,
                        direction: "ltr",
                        zIndex: 0,
                    }}
                />

                {!mapReady && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-slate-100">
                        <p className="text-slate-400 text-sm">
                            در حال بارگذاری نقشه...
                        </p>
                    </div>
                )}
            </div>

            {/* ---------- Coordinates + Navigation ---------- */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 font-mono">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-50 ring-1 ring-slate-100">
                        lat: {Number(lat).toFixed(6)}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-50 ring-1 ring-slate-100">
                        lng: {Number(lng).toFixed(6)}
                    </span>
                </div>

                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${initialLat},${initialLng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-bold text-white bg-gradient-to-b from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 shadow-sm shadow-gold-500/25 hover:shadow-md hover:shadow-gold-500/40 transition-all"
                >
                    <PiNavigationArrow className="w-3.5 h-3.5" />
                    مسیریابی
                </a>
            </div>
        </div>
    );
}