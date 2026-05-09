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
    const truckTypeId = searchParams.get("truckType");
    const pickupLat = parseFloat(searchParams.get("pickupLat") || "0");
    const pickupLng = parseFloat(searchParams.get("pickupLng") || "0");
    const weight = parseFloat(searchParams.get("weight") || "0");

    const where: any = {
      isActive: true,
      status: "AVAILABLE",
    };

    if (session.organizationId) {
      where.organizationId = session.organizationId;
    }
    if (truckTypeId) where.truckTypeId = truckTypeId;
    if (weight > 0) where.capacity = { gte: weight };

    const trucks = await prisma.truck.findMany({
      where,
      include: {
        truckType: { select: { name: true } },
        driver: { select: { id: true, name: true, phone: true, status: true } },
      },
    });

    // Score trucks based on proximity to pickup location
    const scoredTrucks = trucks.map((truck) => {
      let score = 100;

      // Distance score (if truck has current location)
      if (truck.currentLat && truck.currentLng && pickupLat && pickupLng) {
        const distance = calculateDistance(
          truck.currentLat,
          truck.currentLng,
          pickupLat,
          pickupLng
        );
        // Deduct points for distance (1 point per 10km)
        score -= Math.min(distance / 10, 50);
      }

      // Capacity match (prefer trucks with closest capacity to required)
      if (weight > 0 && truck.capacity) {
        const capacityRatio = weight / truck.capacity;
        if (capacityRatio > 0.7 && capacityRatio <= 1) {
          score += 10; // Good fit
        }
      }

      // Driver availability bonus
      if (truck.driver && truck.driver.status === "AVAILABLE") {
        score += 15;
      }

      return {
        ...truck,
        score: Math.round(Math.max(score, 0)),
        estimatedDistance: truck.currentLat && pickupLat
          ? Math.round(calculateDistance(truck.currentLat, truck.currentLng!, pickupLat, pickupLng))
          : null,
      };
    });

    // Sort by score descending
    scoredTrucks.sort((a, b) => b.score - a.score);

    return NextResponse.json({ recommendations: scoredTrucks.slice(0, 10) });
  } catch (error) {
    console.error("Truck recommendation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
