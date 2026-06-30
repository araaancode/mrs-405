import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Hall from "@/models/Hall"

export async function GET(req) {

    await connectDB()

    const { searchParams } = new URL(req.url)

    const city = searchParams.get("city")

    if (!city) {
        return NextResponse.json({
            success: false,
            message: "city is required"
        }, { status: 400 })
    }

    const halls = await Hall.find({})
        .select("title province city capacity images event_type hall_type")
        .lean()


    return NextResponse.json({
        success: true,
        count: halls.length,
        data: halls
    })
}
