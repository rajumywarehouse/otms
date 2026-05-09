import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        truck: {
          include: { truckType: true },
        },
        driver: true,
        loadType: true,
        expenses: {
          include: { expenseType: true },
          orderBy: { createdAt: "desc" },
        },
        documents: {
          orderBy: { createdAt: "desc" },
        },
        trackingEvents: {
          orderBy: { timestamp: "desc" },
          take: 20,
        },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json({ trip });
  } catch (error) {
    console.error("Get trip error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const trip = await prisma.trip.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({ trip });
  } catch (error) {
    console.error("Update trip error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
