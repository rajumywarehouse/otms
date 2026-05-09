import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgFilter = session.organizationId
      ? { organizationId: session.organizationId }
      : {};

    const [
      totalTrips,
      activeTrips,
      completedTrips,
      totalTrucks,
      availableTrucks,
      totalDrivers,
      totalClients,
      recentTrips,
    ] = await Promise.all([
      prisma.trip.count({ where: orgFilter }),
      prisma.trip.count({
        where: {
          ...orgFilter,
          status: { in: ["IN_TRANSIT", "ENROUTE_PICKUP", "REACHED_PICKUP", "TRIP_STARTED"] },
        },
      }),
      prisma.trip.count({ where: { ...orgFilter, status: "COMPLETED" } }),
      prisma.truck.count({ where: { ...orgFilter, isActive: true } }),
      prisma.truck.count({ where: { ...orgFilter, isActive: true, status: "AVAILABLE" } }),
      prisma.driver.count({ where: { ...orgFilter, isActive: true } }),
      prisma.client.count({ where: orgFilter }),
      prisma.trip.findMany({
        where: orgFilter,
        include: {
          client: { select: { name: true } },
          truck: { select: { truckNumber: true } },
          driver: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    // Revenue (sum of trip costs for completed trips)
    const revenue = await prisma.trip.aggregate({
      where: { ...orgFilter, status: "COMPLETED" },
      _sum: { tripCost: true },
    });

    return NextResponse.json({
      kpis: {
        totalTrips,
        activeTrips,
        completedTrips,
        totalTrucks,
        availableTrucks,
        totalDrivers,
        totalClients,
        revenue: revenue._sum.tripCost || 0,
      },
      recentTrips,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
