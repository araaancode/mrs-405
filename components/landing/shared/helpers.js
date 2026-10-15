// components/landing/shared/helpers.js

export const PLACEHOLDER = '/images/placeholder-hall.jpg'

const faNumFormatter = new Intl.NumberFormat('fa-IR')
export const faNum = (n) => faNumFormatter.format(Number(n) || 0)

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

export function getHallImages(hall) {
    if (!hall) return []
    const raw = Array.isArray(hall.images) ? hall.images : []
    const cleaned = raw
        .filter((img) => typeof img === 'string' && img.trim())
        .map((img) => normalizeImageUrl(img))

    if (cleaned.length === 0) {
        const single = hall.image || hall.thumbnail
        if (single) return [normalizeImageUrl(single)]
    }
    return cleaned
}

/**
 * محاسبه قیمت و تخفیف — سازگار با Schema پروژه
 *
 * Schema:
 *   sans_price: Number (تومان)      — قیمت اصلی سانس
 *   sans_discount: Number (0-100)   — درصد تخفیف
 *   main_price: Number              — قیمت خط‌خورده (اختیاری)
 *   has_sans: Boolean               — آیا سانس دارد؟
 */
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

/**
 * فیلتر و مرتب‌سازی تالارها بر اساس بیشترین تخفیف
 */
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