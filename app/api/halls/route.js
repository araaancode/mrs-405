// app/api/halls/route.js
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Hall from '@/models/Hall'

const HALL_LIST_FIELDS = [
    'title',
    'city',
    'province',
    'images',
    'capacity',
    'duration',
    'sans_price',
    'main_price',
    'sans_discount',
    'has_sans',
    'parking_count',
    'hall_type',
    'host_type',
    'event_type',
    'description',
    'createdAt',
    'is_active',     // ← اضافه کن تا در response باشد
].join(' ')

export async function GET(request) {
    try {
        await connectDB()

        const { searchParams } = new URL(request.url)
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
        const limit = Math.min(
            50,
            Math.max(1, parseInt(searchParams.get('limit') || '12', 10))
        )
        const skip = (page - 1) * limit

        // ✅ فیلتر: فقط تالارهای فعال (اگر نیاز داری)
        // اگر می‌خواهی همه را برگردانی، این خط را حذف کن
        const filter = { is_active: true }

        const [halls, total] = await Promise.all([
            Hall.find(filter)
                .select(HALL_LIST_FIELDS)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Hall.countDocuments(filter),
        ])

        const totalPages = Math.ceil(total / limit)

        return NextResponse.json(
            {
                success: true,
                count: halls.length,
                total,
                page,
                totalPages,
                data: halls,
            },
            {
                status: 200,
                headers: {
                    'Cache-Control':
                        'public, s-maxage=300, stale-while-revalidate=600',
                },
            }
        )
    } catch (error) {
        console.error('Error fetching halls:', error)

        return NextResponse.json(
            {
                success: false,
                message: 'خطا در دریافت لیست تالارها',
            },
            { status: 500 }
        )
    }
}