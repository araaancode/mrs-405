"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { PiCamera, PiCircleNotch, PiTrash } from "react-icons/pi";

/* ============================================================
   Constants
   ============================================================ */
const MAX_SIZE_MB = 2;
const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const isRemote = (url) =>
    typeof url === "string" && /^https?:\/\//i.test(url);

/* ============================================================
   AvatarUploader
   ============================================================ */
export function AvatarUploader({ currentAvatar, onUploaded, name = "" }) {
    const inputRef = useRef(null);
    const objectUrlRef = useRef(null);

    const [preview, setPreview] = useState(currentAvatar || null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    /* همگام‌سازی با پراپ */
    useEffect(() => {
        setPreview(currentAvatar || null);
    }, [currentAvatar]);

    /* پاکسازی ObjectURL در unmount */
    useEffect(() => {
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
            }
        };
    }, []);

    const initials = (name || "")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    const handlePick = useCallback(() => inputRef.current?.click(), []);

    const handleFile = useCallback(
        async (file) => {
            if (!file) return;

            /* اعتبارسنجی سمت کلاینت */
            if (!ALLOWED_TYPES.includes(file.type)) {
                toast.error("فقط JPG، PNG یا WebP مجاز است");
                return;
            }
            if (file.size > MAX_SIZE) {
                toast.error(`حجم تصویر نباید بیشتر از ${MAX_SIZE_MB} مگابایت باشد`);
                return;
            }

            /* پیش‌نمایش فوری با ObjectURL */
            if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
            const objectUrl = URL.createObjectURL(file);
            objectUrlRef.current = objectUrl;
            setPreview(objectUrl);

            setUploading(true);
            setProgress(0);

            const fd = new FormData();
            fd.append("avatar", file);

            try {
                const { data } = await axios.post("/api/user/avatar", fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (e) => {
                        if (e.total) {
                            setProgress(Math.round((e.loaded * 100) / e.total));
                        }
                    },
                });

                /* جایگزینی با URL نهایی سرور */
                setPreview(data.avatar);
                onUploaded?.(data.avatar);
                toast.success("آواتار با موفقیت به‌روزرسانی شد");
            } catch (err) {
                toast.error(err.response?.data?.message || "خطا در آپلود");
                setPreview(currentAvatar || null);
            } finally {
                setUploading(false);
                if (objectUrlRef.current) {
                    URL.revokeObjectURL(objectUrlRef.current);
                    objectUrlRef.current = null;
                }
            }
        },
        [currentAvatar, onUploaded]
    );

    const handleChange = useCallback(
        (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            handleFile(file);
        },
        [handleFile]
    );

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            handleFile(file);
        },
        [handleFile]
    );

    const handleRemove = useCallback(() => {
        if (!confirm("آواتار حذف شود؟")) return;
        setPreview(null);
        onUploaded?.(null);
    }, [onUploaded]);

    /* تشخیص نوع پیش‌نمایش برای Image */
    const showImage =
        preview &&
        (isRemote(preview) ||
            preview.startsWith("blob:") ||
            preview.startsWith("data:"));

    return (
        <div className="flex flex-col items-center gap-3">
            <motion.div
                whileHover={{ scale: uploading ? 1 : 1.03 }}
                whileTap={{ scale: uploading ? 1 : 0.97 }}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={handlePick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handlePick();
                }}
                className="relative w-28 h-28 rounded-full ring-4 ring-white shadow-xl bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center cursor-pointer overflow-hidden group"
            >
                {showImage ? (
                    <Image
                        src={preview}
                        alt="avatar"
                        fill
                        sizes="112px"
                        unoptimized={!isRemote(preview)}
                        className="object-cover"
                    />
                ) : (
                    <span className="text-2xl font-bold text-gold-700">
                        {initials || "?"}
                    </span>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    {uploading ? (
                        <div className="text-white text-center">
                            <PiCircleNotch className="w-6 h-6 mx-auto animate-spin" />
                            <span className="text-xs mt-1 block">{progress}%</span>
                        </div>
                    ) : (
                        <PiCamera className="w-7 h-7 text-white" />
                    )}
                </div>

                {/* Progress ring */}
                {uploading && (
                    <svg
                        className="absolute inset-0 -rotate-90"
                        viewBox="0 0 100 100"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="48"
                            fill="none"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="4"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="48"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="4"
                            strokeDasharray={`${progress * 3.01} 301`}
                            strokeLinecap="round"
                        />
                    </svg>
                )}
            </motion.div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleChange}
            />

            <div className="flex items-center gap-3 text-xs">
                <button
                    type="button"
                    onClick={handlePick}
                    disabled={uploading}
                    className="text-gold-700 hover:text-gold-800 font-medium disabled:opacity-50"
                >
                    {preview ? "تغییر آواتار" : "افزودن آواتار"}
                </button>
                {preview && !uploading && (
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
                    >
                        <PiTrash className="w-3 h-3" />
                        حذف
                    </button>
                )}
            </div>
            <p className="text-[11px] text-slate-400">
                JPG / PNG / WebP — حداکثر {MAX_SIZE_MB} مگابایت
            </p>
        </div>
    );
}