// app/api/notifications/my/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import NotificationService from "@/lib/notifications";

export async function GET(req) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit')) || 20;
        const offset = parseInt(searchParams.get('offset')) || 0;
        const unreadOnly = searchParams.get('unreadOnly') === 'true';
        const type = searchParams.get('type');

        const result = await NotificationService.getUserNotifications(
            session.user.id,
            { limit, offset, unreadOnly, type }
        );

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('Get notifications error:', error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}