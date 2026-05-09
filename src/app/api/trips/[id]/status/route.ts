import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const VALID_TRANSITIONS: Record<string, string[]> = {
  CREATED: ["ASSIGNED", "CANCELLED"],
  ASSIGNED: ["DRIVER_ACCEPTED", "CANCELLED"],
  DRIVER_ACCEPTED: ["ENROUTE_PICKUP", "CANCELLED"],
  ENROUTE_PICKUP: ["REACHED_PICKUP"],
  REACHED_PICKUP: ["TRIP_STARTED"],
  TRIP_STARTED: ["IN_TRANSIT"],
  IN_TRANSIT: ["NEAR_DESTINATION", "DELAYED"],
  NEAR_DESTINATION: ["REACHED_DESTINATION"],
  REACHED_DESTINATION: ["COMPLETED"],
  DELAYED: ["IN_TRANSIT", "CANCELLED"],
};

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
    const { status, remarks, lat, lng } = body;

    // Get current trip
    const currentTrip = await prisma.trip.findUnique({
      where: { id: params.id },
      select: { status: true, tripNumber: true, truckId: true, driverId: true },
    });

    if (!currentTrip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // Validate status transition
    const validNext = VALID_TRANSITIONS[currentTrip.status];
    if (!validNext || !validNext.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${currentTrip.status} to ${status}` },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = { status };

    if (status === "TRIP_STARTED") {
      updateData.tripStartedAt = new Date();
    } else if (status === "COMPLETED") {
      updateData.completedAt = new Date();
      // Release truck and driver
      if (currentTrip.truckId) {
        await prisma.truck.update({
          where: { id: currentTrip.truckId },
          data: { status: "AVAILABLE" },
        });
      }
      if (currentTrip.driverId) {
        await prisma.driver.update({
          where: { id: currentTrip.driverId },
          data: { status: "AVAILABLE", assignedTruckId: null },
        });
      }
    }

    // Update trip
    const trip = await prisma.trip.update({
      where: { id: params.id },
      data: updateData,
    });

    // Create tracking event
    await prisma.trackingEvent.create({
      data: {
        tripId: params.id,
        status,
        message: remarks || `Status changed to ${status}`,
        lat,
        lng,
      },
    });

    return NextResponse.json({ trip });
  } catch (error) {
    console.error("Update trip status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
