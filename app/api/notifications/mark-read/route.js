// app/api/notifications/mark-read/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import NotificationService from "@/lib/notifications";

export async function POST(req) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { notificationId, markAll } = body;

        let result;

        if (markAll) {
            result = await NotificationService.markAllAsRead(session.user.id);
        } else if (notificationId) {
            result = await NotificationService.markAsRead(
                notificationId,
                session.user.id
            );
        } else {
            return NextResponse.json(
                { error: "Missing notificationId or markAll" },
                { status: 400 }
            );
        }

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('Mark read error:', error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}