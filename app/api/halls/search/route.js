export const dynamic = "force-dynamic";

// app/api/halls/search/route.js (یا هر مسیری که داری)
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Hall from '@/models/Hall'

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

function buildFlexibleRegex(input) {
    const normalized = normalizeText(input)
    if (!normalized) return null
    const parts = normalized
        .split(/\s+/)
        .map((w) => escapeRegex(w))
        .filter(Boolean)
    if (parts.length === 0) return null
    return { $regex: parts.join('[\\s\\u200c]*'), $options: 'i' }
}

export async function GET(req) {
    try {
        await connectDB()
        const { searchParams } = new URL(req.url)
        const city = searchParams.get('city')

        if (!city || !city.trim()) {
            return NextResponse.json(
                { success: false, message: 'city is required' },
                { status: 400 }
            )
        }

        const query = {
            is_active: true,
            city: buildFlexibleRegex(city),
        }

        const halls = await Hall.find(query)
            .select(
                'title province city address capacity duration ' +
                'images image thumbnail event_type hall_type ' +
                'sans_price sans_discount main_price has_sans description ' +
                'isFavorite createdAt'
            )
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json({
            success: true,
            count: halls.length,
            data: halls,
        })
    } catch (err) {
        console.error('[/api/halls/search] error:', err)
        return NextResponse.json(
            { success: false, message: 'خطا در جستجو', error: err.message },
            { status: 500 }
        )
    }
}