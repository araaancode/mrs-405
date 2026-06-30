import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Hall from "@/models/Hall";

export async function GET() {
    try {
        await connectDB();

        const halls = await Hall.find({}).sort({ createdAt: -1 });

        return NextResponse.json(
            {
                success: true,
                count: halls.length,
                data: halls
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching active halls:", error);

        return NextResponse.json(
            {
                success: false,
                message: "خطا در دریافت لیست تالارهای فعال"
            },
            { status: 500 }
        );
    }
}
