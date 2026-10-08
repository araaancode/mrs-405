import { NextResponse } from "next/server";
import { sendPatternSMS } from "@/lib/smsService";

export async function POST(req) {
    const { to, bodyId, args } = await req.json();

    const result = await sendPatternSMS({ to, bodyId, args });

    return NextResponse.json(result);
}