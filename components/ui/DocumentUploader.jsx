"use client";

import { useCallback, useRef, useState, memo, useMemo } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
    PiUploadSimple,
    PiFilePdf,
    PiFileImage,
    PiFileDoc,
    PiFile,
    PiTrash,
    PiEye,
} from "react-icons/pi";

/* ============================================================
   Constants — یک بار در ماژول
   ============================================================ */
const DEFAULT_ACCEPTED = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
];

const DEFAULT_MAX_FILES = 5;
const DEFAULT_MAX_SIZE_MB = 5;

/* ============================================================
   FileIcon — memoized
   ============================================================ */
const FileIcon = memo(function FileIcon({ type, className = "w-5 h-5" }) {
    if (type?.startsWith("image/")) return <PiFileImage className={className} />;
    if (type === "application/pdf") return <PiFilePdf className={className} />;
    if (
        type === "application/msword" ||
        type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
        return <PiFileDoc className={className} />;
    return <PiFile className={className} />;
});

/* ============================================================
   formatBytes — بیرون از کامپوننت
   ============================================================ */
const SIZE_UNITS = ["B", "KB", "MB", "GB"];
function formatBytes(bytes) {
    if (!bytes) return "0 B";
    const k = 1024;
    const i = Math.min(
        Math.floor(Math.log(bytes) / Math.log(k)),
        SIZE_UNITS.length - 1
    );
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${SIZE_UNITS[i]}`;
}

/* ============================================================
   isRemote — تشخیص داده/بلاب/آدرس
   ============================================================ */
const isRemote = (url) =>
    typeof url === "string" && /^https?:\/\//i.test(url);

/* ============================================================
   uploadToServer — بیرون از کامپوننت
   ============================================================ */
async function uploadToServer(file) {
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
}

/* ============================================================
   DocumentRow — memoized
   ============================================================ */
const DocumentRow = memo(function DocumentRow({ doc, index, onRemove }) {
    const isImage = doc.type?.startsWith("image/");

    /* محاسبه‌های نمایشی — یک بار */
    const meta = useMemo(() => {
        const sizeLabel = formatBytes(doc.size);
        const ext = doc.type ? doc.type.split("/")[1]?.toUpperCase() : null;
        return { sizeLabel, ext };
    }, [doc.size, doc.type]);

    const handleRemove = useCallback(() => onRemove(index), [onRemove, index]);

    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-gold-300 hover:bg-gold-50/30 transition-colors duration-200 group">
            {isImage ? (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 ring-1 ring-slate-200">
                    <Image
                        src={doc.url}
                        alt={doc.name || "پیش‌نمایش"}
                        fill
                        sizes="48px"
                        quality={70}
                        loading="lazy"
                        unoptimized={!isRemote(doc.url)}
                        className="object-cover"
                    />
                </div>
            ) : (
                <div className="w-12 h-12 rounded-lg bg-gold-50 flex items-center justify-center flex-shrink-0 text-gold-600">
                    <FileIcon type={doc.type} className="w-6 h-6" />
                </div>
            )}

            <div className="flex-1 min-w-0">
                <p
                    className="text-sm font-medium text-slate-800 truncate"
                    title={doc.name}
                >
                    {doc.name || "فایل بدون نام"}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                    {meta.sizeLabel}
                    {meta.ext && (
                        <>
                            <span className="mx-1.5 text-slate-300">•</span>
                            <span>{meta.ext}</span>
                        </>
                    )}
                </p>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-gold-600 hover:bg-gold-50 transition-colors"
                    title="مشاهده"
                >
                    <PiEye className="w-4 h-4" />
                </a>
                <button
                    type="button"
                    onClick={handleRemove}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="حذف"
                >
                    <PiTrash className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
});

/* ============================================================
   DocumentUploader
   ============================================================ */
export const DocumentUploader = memo(function DocumentUploader({
    documents = [],
    onChange,
    maxFiles = DEFAULT_MAX_FILES,
    maxSizeMB = DEFAULT_MAX_SIZE_MB,
    acceptedTypes = DEFAULT_ACCEPTED,
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);

    /* برای جلوگیری از گم شدن batch ها در آپلود موازی */
    const documentsRef = useRef(documents);
    documentsRef.current = documents;

    /* ============================================================
       اعتبارسنجی — useCallback وابسته به props
       ============================================================ */
    const validateFile = useCallback(
        (file) => {
            if (!acceptedTypes.includes(file.type)) {
                toast.error(`فرمت فایل ${file.name} پشتیبانی نمی‌شود`);
                return false;
            }
            if (file.size > maxSizeMB * 1024 * 1024) {
                toast.error(`حجم فایل ${file.name} بیشتر از ${maxSizeMB}MB است`);
                return false;
            }
            return true;
        },
        [acceptedTypes, maxSizeMB]
    );

    /* ============================================================
       پردازش فایل‌ها
       ============================================================ */
    const handleFiles = useCallback(
        async (fileList) => {
            const list = Array.from(fileList || []);
            if (!list.length) return;

            const remaining = maxFiles - documentsRef.current.length;
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
                /* از ref استفاده می‌کنیم تا آخرین مقدار را داشته باشیم */
                onChange([...documentsRef.current, ...uploaded]);
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
        [maxFiles, validateFile, onChange]
    );

    /* ============================================================
       Drag & Drop — useCallback برای پراپ‌های پایدار
       ============================================================ */
    const onDrop = useCallback(
        (e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles]
    );

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onInputChange = useCallback(
        (e) => {
            handleFiles(e.target.files);
            e.target.value = "";
        },
        [handleFiles]
    );

    const openFileDialog = useCallback(() => {
        if (!uploading) inputRef.current?.click();
    }, [uploading]);

    /* ============================================================
       حذف فایل
       ============================================================ */
    const removeFile = useCallback(
        (index) => {
            const next = documentsRef.current.filter((_, i) => i !== index);
            onChange(next);
            toast.success("فایل حذف شد");
        },
        [onChange]
    );

    const canUploadMore = documents.length < maxFiles;
    const isFull = documents.length >= maxFiles;

    return (
        <div className="space-y-4">
            {/* راهنما */}
            <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                    فرمت‌های مجاز: JPG، PNG، WEBP، PDF — حداکثر {maxSizeMB}MB
                </span>
                <span
                    className={`font-medium ${
                        isFull ? "text-rose-500" : "text-slate-600"
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
                    onClick={openFileDialog}
                    className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-8 transition-[border-color,background-color,transform] duration-300 text-center group ${
                        isDragging
                            ? "border-gold-500 bg-gold-50 scale-[1.01]"
                            : "border-slate-200 hover:border-gold-400 hover:bg-gold-50/40"
                    } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        accept={acceptedTypes.join(",")}
                        className="hidden"
                        onChange={onInputChange}
                        disabled={uploading}
                    />

                    <div
                        className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-[background-color,transform] duration-300 ${
                            isDragging
                                ? "bg-gold-500 text-white scale-110"
                                : "bg-gold-50 text-gold-600 group-hover:bg-gold-100 group-hover:scale-105"
                        }`}
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

            {/* لیست فایل‌ها */}
            {documents.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-600">
                        مدارک آپلودشده:
                    </p>

                    {documents.map((doc, index) => (
                        <DocumentRow
                            key={`${doc.url}-${index}`}
                            doc={doc}
                            index={index}
                            onRemove={removeFile}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});