import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Hall from "@/models/Hall"

export async function GET(req) {

    await connectDB()

    const { searchParams } = new URL(req.url)

    const province = searchParams.get("province")
    const city = searchParams.get("city")
    const event_type = searchParams.get("event_type")
    const hall_type = searchParams.get("hall_type")

    let query = {
        is_active: true
    }

    if (province) {
        query.province = province
    }

    if (city) {
        query.city = { $regex: city, $options: "i" }
    }

    if (event_type) {
        query.event_type = event_type
    }

    if (hall_type) {
        query.hall_type = hall_type
    }

    const halls = await Hall.find(query)
        .select("title province city capacity images event_type hall_type")
        .lean()

    return NextResponse.json({
        success: true,
        count: halls.length,
        data: halls
    })
}
