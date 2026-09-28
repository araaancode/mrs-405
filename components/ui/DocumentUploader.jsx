"use client";

import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
    PiUploadSimple,
    PiFilePdf,
    PiFileImage,
    PiFileDoc,
    PiFile,
    PiTrash,
    PiEye,
    PiCheckCircle,
    PiXCircle,
} from "react-icons/pi";

/* ============================================================
   آیکون بر اساس نوع فایل
   ============================================================ */
function FileIcon({ type, className = "w-5 h-5" }) {
    if (type?.startsWith("image/"))
        return <PiFileImage className={className} />;
    if (type === "application/pdf") return <PiFilePdf className={className} />;
    if (
        type ===
        "application/msword" ||
        type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
        return <PiFileDoc className={className} />;
    return <PiFile className={className} />;
}

/* ============================================================
   فرمت بایت به خوانا
   ============================================================ */
function formatBytes(bytes) {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/* ============================================================
   کامپوننت اصلی
   ============================================================ */
export function DocumentUploader({
    documents = [],
    onChange,
    maxFiles = 5,
    maxSizeMB = 5,
    acceptedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
    ],
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);

    /* ============================================================
       اعتبارسنجی فایل
       ============================================================ */
    const validateFile = (file) => {
        if (!acceptedTypes.includes(file.type)) {
            toast.error(`فرمت فایل ${file.name} پشتیبانی نمی‌شود`);
            return false;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`حجم فایل ${file.name} بیشتر از ${maxSizeMB}MB است`);
            return false;
        }
        return true;
    };

    /* ============================================================
       آپلود به سرور
       ============================================================ */
    const uploadToServer = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "خطا در آپلود فایل");
        }

        const data = await res.json();
        return {
            url: data.url,
            name: file.name,
            size: file.size,
            type: file.type,
        };
    };

    /* ============================================================
       پردازش فایل‌های انتخاب‌شده
       ============================================================ */
    const handleFiles = useCallback(
        async (files) => {
            const list = Array.from(files || []);
            if (!list.length) return;

            const remaining = maxFiles - documents.length;
            if (remaining <= 0) {
                toast.error(`حداکثر ${maxFiles} فایل مجاز است`);
                return;
            }

            const valid = list.slice(0, remaining).filter(validateFile);
            if (!valid.length) return;

            setUploading(true);
            const toastId = toast.loading("در حال آپلود...");

            try {
                const uploaded = await Promise.all(valid.map(uploadToServer));
                onChange([...documents, ...uploaded]);
                toast.success(
                    `${uploaded.length} فایل با موفقیت آپلود شد`,
                    { id: toastId }
                );
            } catch (err) {
                toast.error(err.message || "خطا در آپلود", { id: toastId });
            } finally {
                setUploading(false);
            }
        },
        [documents, maxFiles, onChange]
    );

    /* ============================================================
       Drag & Drop
       ============================================================ */
    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    /* ============================================================
       حذف فایل
       ============================================================ */
    const removeFile = (index) => {
        const next = documents.filter((_, i) => i !== index);
        onChange(next);
        toast.success("فایل حذف شد");
    };

    /* ============================================================
       Render
       ============================================================ */
    const canUploadMore = documents.length < maxFiles;

    return (
        <div className="space-y-4">
            {/* راهنمای کلی */}
            <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                    فرمت‌های مجاز: JPG، PNG، WEBP، PDF — حداکثر {maxSizeMB}MB
                </span>
                <span
                    className={`font-medium ${documents.length >= maxFiles
                            ? "text-rose-500"
                            : "text-slate-600"
                        }`}
                >
                    {documents.length} / {maxFiles}
                </span>
            </div>

            {/* Drop Zone */}
            {canUploadMore && (
                <div
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onClick={() => !uploading && inputRef.current?.click()}
                    className={`
            relative cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-8
            transition-all duration-300 text-center group
            ${isDragging
                            ? "border-gold-500 bg-gold-50 scale-[1.01]"
                            : "border-slate-200 hover:border-gold-400 hover:bg-gold-50/40"
                        }
            ${uploading ? "opacity-60 pointer-events-none" : ""}
          `}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        accept={acceptedTypes.join(",")}
                        className="hidden"
                        onChange={(e) => {
                            handleFiles(e.target.files);
                            e.target.value = "";
                        }}
                    />

                    <div
                        className={`
              w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4
              transition-all duration-300
              ${isDragging
                                ? "bg-gold-500 text-white scale-110"
                                : "bg-gold-50 text-gold-600 group-hover:bg-gold-100 group-hover:scale-105"
                            }
            `}
                    >
                        {uploading ? (
                            <svg
                                className="w-6 h-6 animate-spin"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                        ) : (
                            <PiUploadSimple className="w-6 h-6" />
                        )}
                    </div>

                    <p className="text-sm font-medium text-slate-800 mb-1">
                        {uploading
                            ? "در حال آپلود..."
                            : isDragging
                                ? "فایل را رها کنید"
                                : "برای آپلود کلیک کنید یا فایل را بکشید"}
                    </p>
                    <p className="text-xs text-slate-500">
                        {documents.length === 0
                            ? "هنوز مدرکی آپلود نشده است"
                            : `${maxFiles - documents.length} فایل دیگر می‌توانید اضافه کنید`}
                    </p>
                </div>
            )}

            {/* لیست فایل‌های آپلودشده */}
            {documents.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-600">
                        مدارک آپلودشده:
                    </p>

                    {documents.map((doc, index) => {
                        const isImage = doc.type?.startsWith("image/");
                        return (
                            <div
                                key={`${doc.url}-${index}`}
                                className="
                  flex items-center gap-3 p-3 rounded-xl
                  bg-white border border-slate-100
                  hover:border-gold-300 hover:bg-gold-50/30
                  transition-all duration-200 group
                "
                            >
                                {/* پیش‌نمایش یا آیکون */}
                                {isImage ? (
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 ring-1 ring-slate-200">
                                        <img
                                            src={doc.url}
                                            alt={doc.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-gold-50 flex items-center justify-center flex-shrink-0 text-gold-600">
                                        <FileIcon type={doc.type} className="w-6 h-6" />
                                    </div>
                                )}

                                {/* اطلاعات */}
                                <div className="flex-1 min-w-0">
                                    <p
                                        className="text-sm font-medium text-slate-800 truncate"
                                        title={doc.name}
                                    >
                                        {doc.name || "فایل بدون نام"}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {formatBytes(doc.size)}
                                        {doc.type && (
                                            <span className="mx-1.5 text-slate-300">•</span>
                                        )}
                                        {doc.type && (
                                            <span className="text-slate-500">
                                                {doc.type.split("/")[1]?.toUpperCase()}
                                            </span>
                                        )}
                                    </p>
                                </div>

                                {/* اکشن‌ها */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                      w-8 h-8 rounded-lg flex items-center justify-center
                      text-slate-500 hover:text-gold-600 hover:bg-gold-50
                      transition-colors
                    "
                                        title="مشاهده"
                                    >
                                        <PiEye className="w-4 h-4" />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="
                      w-8 h-8 rounded-lg flex items-center justify-center
                      text-slate-500 hover:text-rose-600 hover:bg-rose-50
                      transition-colors
                    "
                                        title="حذف"
                                    >
                                        <PiTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}