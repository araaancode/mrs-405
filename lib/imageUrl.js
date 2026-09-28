// lib/imageUrl.js

/**
 * نرمال‌سازی URL تصویر برای next/image
 * - "./images/x.jpg" → "/images/x.jpg"
 * - "images/x.jpg"   → "/images/x.jpg"
 * - "https://..."    → بدون تغییر
 * - undefined/""     → fallback
 */
export function normalizeImageUrl(
  url,
  fallback = "/images/placeholder-hall.jpg"
) {
  if (!url || typeof url !== "string") return fallback;

  const trimmed = url.trim();
  if (!trimmed) return fallback;

  // URL کامل
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // data URI
  if (trimmed.startsWith("data:")) return trimmed;

  // حذف ./ از ابتدا
  if (trimmed.startsWith("./")) {
    return "/" + trimmed.slice(2);
  }

  // اگر / ندارد، اضافه کن
  if (!trimmed.startsWith("/")) {
    return "/" + trimmed;
  }

  return trimmed;
}

/**
 * برگرداندن تصویر اصلی از یک آبجکت hall
 */
export function getHallImage(hall, fallback = "/images/placeholder-hall.jpg") {
  if (!hall) return fallback;

  // اولویت‌ها: image → thumbnail → images[0] → gallery[0]
  const raw =
    hall.image ||
    hall.thumbnail ||
    (Array.isArray(hall.images) && hall.images[0]) ||
    (Array.isArray(hall.gallery) && hall.gallery[0]);

  return normalizeImageUrl(raw, fallback);
}
