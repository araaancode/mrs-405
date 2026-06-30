import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Hall from "../../../../models/Hall";

export async function GET(req, { params }) {
    try {
        await dbConnect();

        const { id } = params;

        const hall = await Hall.findById(id)
            .populate("hall_owner_id", "name email")
            .lean();


        if (!hall) {
            return NextResponse.json(
                { message: "تالار یافت نشد" },
                { status: 404 }
            );
        }

        return NextResponse.json(hall, { status: 200 });

    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}
