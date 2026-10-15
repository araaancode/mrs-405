// components/landing/shared/helpers.js

/* ============================================================
   PLACEHOLDER — تصویر پیش‌فرض به صورت SVG inline
   چرا SVG data URL؟
   - نیازی به فایل فیزیکی توی /public نیست
   - هیچ‌وقت 400 (Bad Request) نمی‌ده
   - با unoptimized در <Image> سازگاره
   ============================================================ */
export const PLACEHOLDER =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
            <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#FBF7EC"/>
                    <stop offset="100%" stop-color="#F6EED5"/>
                </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#g)"/>
            <g fill="none" stroke="#C6A14C" stroke-width="2" opacity="0.55">
                <rect x="155" y="110" width="90" height="70" rx="8"/>
                <circle cx="180" cy="135" r="6"/>
                <path d="M 165 170 L 195 145 L 215 160 L 230 148 L 245 170 Z"
                      fill="#C6A14C" opacity="0.35" stroke="none"/>
            </g>
            <text x="200" y="215" font-size="13" fill="#A8853A"
                  text-anchor="middle" font-family="sans-serif" font-weight="600">
                تصویر موجود نیست
            </text>
        </svg>`
    )

/* ============================================================
   faNum — فرمت اعداد فارسی
   ============================================================ */
const faNumFormatter = new Intl.NumberFormat('fa-IR')
export const faNum = (n) => faNumFormatter.format(Number(n) || 0)

/* ============================================================
   normalizeImageUrl — نرمال‌سازی URL تصاویر
   ============================================================ */
export function normalizeImageUrl(url, fallback = PLACEHOLDER) {
    if (!url || typeof url !== 'string') return fallback
    const trimmed = url.trim()
    if (!trimmed) return fallback
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
    if (trimmed.startsWith('data:')) return trimmed
    if (trimmed.startsWith('./')) return '/' + trimmed.slice(2)
    if (!trimmed.startsWith('/')) return '/' + trimmed
    return trimmed
}

/* ============================================================
   getHallImages — استخراج همه تصاویر یک تالار
   پشتیبانی از هر ساختار داده‌ای که بک‌اند برگردونه
   ============================================================ */
export function getHallImages(hall) {
    if (!hall || typeof hall !== 'object') return []

    // همه فیلدهای ممکن برای تصاویر
    const buckets = [
        hall.images,
        hall.photos,
        hall.gallery,
        hall.image_urls,
        hall.imageUrls,
        hall.pictures,
    ]

    const result = []
    const seen = new Set()

    const push = (raw) => {
        if (!raw) return

        // آرایه‌ای از آیتم‌ها (string یا object)
        if (Array.isArray(raw)) {
            raw.forEach((item) => {
                let url
                if (typeof item === 'string') {
                    url = item
                } else if (item && typeof item === 'object') {
                    url = item.url || item.src || item.path || item.image || item.link
                }
                if (url && typeof url === 'string' && url.trim()) {
                    const normalized = normalizeImageUrl(url)
                    if (!seen.has(normalized)) {
                        seen.add(normalized)
                        result.push(normalized)
                    }
                }
            })
            return
        }

        // تک رشته
        if (typeof raw === 'string' && raw.trim()) {
            const normalized = normalizeImageUrl(raw)
            if (!seen.has(normalized)) {
                seen.add(normalized)
                result.push(normalized)
            }
        }
    }

    // اول همه آرایه‌ها
    buckets.forEach(push)

    // اگه هیچی پیدا نشد، تک‌تصویرها رو چک کن
    if (result.length === 0) {
        push(hall.image)
        push(hall.thumbnail)
        push(hall.cover)
        push(hall.main_image)
        push(hall.cover_image)
    }

    return result
}

/* ============================================================
   computePricing — محاسبه قیمت و تخفیف
   Schema:
     sans_price: Number (تومان)      — قیمت اصلی سانس
     sans_discount: Number (0-100)   — درصد تخفیف
     main_price: Number              — قیمت خط‌خورده (اختیاری)
     has_sans: Boolean               — آیا سانس دارد؟
   ============================================================ */
export function computePricing(hall) {
    const price = Number(hall?.sans_price || 0)
    const discountPercent = Number(hall?.sans_discount || 0)
    const mainPrice = Number(hall?.main_price || 0)

    // قیمت نهایی = قیمت - (درصد تخفیف × قیمت)
    const discountAmount = Math.round((price * discountPercent) / 100)
    const finalPrice = Math.max(price - discountAmount, 0)

    // قیمت خط‌خورده: اگر main_price وجود دارد و بزرگ‌تر از قیمت است
    // از آن استفاده کن، در غیر این صورت خود price
    const strikethroughPrice =
        mainPrice > price ? mainPrice : discountPercent > 0 ? price : 0

    return {
        price,
        finalPrice,
        discountPercent,
        discountAmount,
        mainPrice: strikethroughPrice,
        hasDiscount: discountPercent > 0 && price > 0,
        hasPrice: price > 0,
    }
}

/* ============================================================
   pickBestDiscounts — فیلتر و مرتب‌سازی بر اساس بیشترین تخفیف
   ============================================================ */
export function pickBestDiscounts(halls, limit = 10) {
    if (!Array.isArray(halls)) return []

    return halls
        .map((hall) => ({ hall, pricing: computePricing(hall) }))
        .filter(({ pricing }) => pricing.hasDiscount && pricing.hasPrice)
        .sort((a, b) => {
            if (b.pricing.discountPercent !== a.pricing.discountPercent) {
                return b.pricing.discountPercent - a.pricing.discountPercent
            }
            return b.pricing.discountAmount - a.pricing.discountAmount
        })
        .slice(0, limit)
        .map(({ hall }) => hall)
}