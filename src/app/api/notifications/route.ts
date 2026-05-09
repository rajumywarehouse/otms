import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unread") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = { userId: session.userId };
    if (unreadOnly) where.isRead = false;

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: session.userId, isRead: false },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, notificationId } = body;

    if (action === "markAllRead") {
      await prisma.notification.updateMany({
        where: { userId: session.userId, isRead: false },
        data: { isRead: true },
      });
    } else if (action === "markRead" && notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update notification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
