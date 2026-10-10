// app/api/notifications/send/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NotificationService from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session?.user?.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const {
            userId,
            type,
            title,
            message,
            data = {},
            channels = { email: false, sms: false, inApp: true },
        } = body;

        if (!userId || !type || !title || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const result = await NotificationService.createAndSend({
            userId,
            type,
            title,
            message,
            data,
            channels,
            source: "admin",
        });

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Send notification error:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}