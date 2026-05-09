import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { truckId, driverId } = body;

    if (!truckId || !driverId) {
      return NextResponse.json(
        { error: "Truck and driver are required" },
        { status: 400 }
      );
    }

    // Update trip with truck and driver
    const trip = await prisma.trip.update({
      where: { id: params.id },
      data: {
        truckId,
        driverId,
        status: "ASSIGNED",
        assignedAt: new Date(),
      },
    });

    // Update truck status
    await prisma.truck.update({
      where: { id: truckId },
      data: { status: "ON_TRIP" },
    });

    // Update driver status
    await prisma.driver.update({
      where: { id: driverId },
      data: { status: "ON_TRIP", assignedTruckId: truckId },
    });

    // Create tracking event
    await prisma.trackingEvent.create({
      data: {
        tripId: params.id,
        status: "ASSIGNED",
        message: `Trip assigned to truck and driver`,
      },
    });

    // Create notification for driver
    const driver = await prisma.driver.findUnique({ where: { id: driverId } });
    if (driver?.userId) {
      await prisma.notification.create({
        data: {
          userId: driver.userId,
          type: "TRIP_ASSIGNED",
          title: "New Trip Assigned",
          message: `You have been assigned a new trip (${trip.tripNumber}). Please accept or reject.`,
        },
      });
    }

    return NextResponse.json({ trip });
  } catch (error) {
    console.error("Assign trip error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
