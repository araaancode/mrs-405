// app/api/test-sms/route.js
import { NextResponse } from "next/server";
import { sendSMS } from "@/lib/smsService";

export async function POST(req) {
    const { phone } = await req.json();
    const result = await sendSMS({
        to: phone,
        text: "تست پیامک از پروژه رزرو تالار",
    });
    return NextResponse.json(result);
}