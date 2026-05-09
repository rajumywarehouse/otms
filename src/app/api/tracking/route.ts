import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where: any = {
      isActive: true,
      status: { in: ["ON_TRIP"] },
    };

    if (session.organizationId) {
      where.organizationId = session.organizationId;
    }

    const trucks = await prisma.truck.findMany({
      where,
      select: {
        id: true,
        truckNumber: true,
        currentLat: true,
        currentLng: true,
        lastLocationAt: true,
        status: true,
        driver: true,
        trips: {
          where: { status: { in: ["IN_TRANSIT", "ENROUTE_PICKUP", "TRIP_STARTED"] } },
          take: 1,
          select: {
            id: true,
            tripNumber: true,
            pickupCity: true,
            dropCity: true,
            currentEta: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({ vehicles: trucks });
  } catch (error) {
    console.error("Get tracking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { truckId, lat, lng, speed, heading } = body;

    await prisma.$transaction([
      prisma.truck.update({
        where: { id: truckId },
        data: {
          currentLat: lat,
          currentLng: lng,
          lastLocationAt: new Date(),
        },
      }),
      prisma.locationHistory.create({
        data: {
          truckId,
          lat,
          lng,
          speed,
          heading,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update location error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
