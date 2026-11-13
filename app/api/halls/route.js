export const dynamic = "force-dynamic";

// app/api/halls/route.js
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Hall from '@/models/Hall'

/* ============================================================
   نقشه slug → نام فارسی شهر
   ============================================================ */
const CITY_SLUG_MAP = {
    tehran: "تهران",
    isfahan: "اصفهان",
    shiraz: "شیراز",
    mashhad: "مشهد",
    tabriz: "تبریز",
    kish: "کیش",
    rasht: "رشت",
    kerman: "کرمان",
    kashan: "کاشان",
    ramsar: "رامسر",
    anzali: "بندر انزلی",
    qeshm: "قشم",
    ahvaz: "اهواز",
    babol: "بابل",
    chalus: "چالوس",
    karaj: "کرج",
    savadkoh: "سوادکوه",
};

/**
 * اگر ورودی slug بود، به نام فارسی تبدیل کن
 * در غیر این صورت، همان مقدار را برگردان
 */
function resolveCityInput(input) {
    if (!input) return input;
    const normalized = String(input).trim().toLowerCase();
    return CITY_SLUG_MAP[normalized] || input;
}

/* ============================================================
   Helpers
   ============================================================ */
function escapeRegex(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function normalizeText(str) {
    if (!str || typeof str !== 'string') return ''
    return str
        .trim()
        .replace(/ي/g, 'ی')
        .replace(/ك/g, 'ک')
        .replace(/\u200c/g, ' ')
        .replace(/\s+/g, ' ')
}

/**
 * regex انعطاف‌پذیر — فقط partial match روی یه فیلد
 */
function flexibleRegex(input) {
    const normalized = normalizeText(input)
    if (!normalized) return null
    const parts = normalized
        .split(/\s+/)
        .map((w) => escapeRegex(w))
        .filter(Boolean)
    if (parts.length === 0) return null
    return {
        $regex: parts.join('[\\s\\u200c]*'),
        $options: 'i',
    }
}

/* ============================================================
   ✅ شرط برای فیلدهای string (province, city)
   ساده، بهینه و بدون $elemMatch
   ============================================================ */
function buildStringFieldCondition(fieldName, value) {
    const rx = flexibleRegex(value)
    if (!rx) return null
    return { [fieldName]: rx }
}

/* ============================================================
   ✅ شرط برای فیلدهایی که ممکنه string یا array باشن
   (event_type, hall_type)
   با استفاده از $type برای جدا کردن رفتار string و array
   ============================================================ */
function buildFlexibleFieldCondition(fieldName, value) {
    const normalized = normalizeText(value)
    if (!normalized) return null

    const rx = flexibleRegex(value)
    if (!rx) return null

    return {
        $or: [
            // --- حالت string: تطابق دقیق ---
            { [fieldName]: normalized },

            // --- حالت string: تطابق partial ---
            {
                $and: [
                    { [fieldName]: { $type: 'string' } },
                    { [fieldName]: rx },
                ],
            },

            // --- حالت array: شامل آیتم دقیق ---
            {
                $and: [
                    { [fieldName]: { $type: 'array' } },
                    { [fieldName]: { $in: [normalized] } },
                ],
            },

            // --- حالت array: شامل آیتم partial ---
            {
                $and: [
                    { [fieldName]: { $type: 'array' } },
                    {
                        [fieldName]: {
                            $elemMatch: { $regex: rx.$regex, $options: 'i' },
                        },
                    },
                ],
            },
        ],
    }
}

/* ============================================================
   GET /api/halls
   ============================================================ */
export async function GET(req) {
    try {
        await connectDB()

        const { searchParams } = new URL(req.url)
        const province = searchParams.get('province')
        const city = searchParams.get('city')
        const event_type = searchParams.get('event_type')
        const hall_type = searchParams.get('hall_type')

        /* ------------------------------------------------------------
           Query پایه — همه شرط‌ها با $and ترکیب می‌شن
           ------------------------------------------------------------ */
        const conditions = []

        // ✅ is_active: یا true هست یا اصلاً وجود نداره
        conditions.push({
            $or: [
                { is_active: true },
                { is_active: { $exists: false } },
            ],
        })

        /* ------------------------------------------------------------
           🔥 هر فیلتر **فقط** روی فیلد خودش اعمال می‌شه
           ------------------------------------------------------------ */

        // province — همیشه string
        if (province && province.trim()) {
            const cond = buildStringFieldCondition('province', province)
            if (cond) conditions.push(cond)
        }

        // city — همیشه string، با پشتیبانی از slug و نام فارسی
        if (city && city.trim()) {
            const resolvedCity = resolveCityInput(city)
            const cond = buildStringFieldCondition('city', resolvedCity)
            if (cond) conditions.push(cond)
        }

        // event_type — ممکنه string یا array باشه
        if (event_type && event_type.trim()) {
            const cond = buildFlexibleFieldCondition('event_type', event_type)
            if (cond) conditions.push(cond)
        }

        // hall_type — ممکنه string یا array باشه
        if (hall_type && hall_type.trim()) {
            const cond = buildFlexibleFieldCondition('hall_type', hall_type)
            if (cond) conditions.push(cond)
        }

        /* ------------------------------------------------------------
           Query نهایی — همه با $and
           ------------------------------------------------------------ */
        const query = { $and: conditions }

        // 🔥 DEBUG
        console.log('========== [/api/halls] ==========')
        console.log('📥 Filters:', { province, city, event_type, hall_type })
        console.log('🔍 Query:', JSON.stringify(query, null, 2))

        /* ------------------------------------------------------------
           اجرا
           ------------------------------------------------------------ */
        const halls = await Hall.find(query)
            .select(
                'title ' +
                'province city address ' +
                'capacity duration ' +
                'images image thumbnail ' +
                'event_type event_types ' +
                'hall_type hall_types ' +
                'sans_price sans_discount main_price has_sans ' +
                'description is_active isFavorite createdAt'
            )
            .sort({ createdAt: -1 })
            .lean()

        console.log('✅ Found:', halls.length, 'halls')
        if (halls.length > 0) {
            console.log(
                '📋 Cities:',
                [...new Set(halls.map((h) => h.city))].join(', ')
            )
            console.log(
                '📋 Provinces:',
                [...new Set(halls.map((h) => h.province))].join(', ')
            )
        }
        console.log('===================================')

        return NextResponse.json({
            success: true,
            count: halls.length,
            data: halls,
        })
    } catch (err) {
        console.error('[/api/halls] error:', err)
        return NextResponse.json(
            {
                success: false,
                message: 'خطا در دریافت تالارها',
                error: err.message,
            },
            { status: 500 }
        )
    }
}