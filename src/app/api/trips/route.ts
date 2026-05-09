import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateTripNumber } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    if (session.organizationId) {
      where.organizationId = session.organizationId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { tripNumber: { contains: search, mode: "insensitive" } },
        { client: { name: { contains: search, mode: "insensitive" } } },
        { truck: { truckNumber: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        include: {
          client: { select: { name: true } },
          truck: { select: { truckNumber: true } },
          driver: { select: { name: true, phone: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.trip.count({ where }),
    ]);

    return NextResponse.json({
      trips,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get trips error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const trip = await prisma.trip.create({
      data: {
        tripNumber: generateTripNumber(),
        status: "CREATED",
        clientId: body.clientId,
        pickupAddress: body.pickupAddress,
        pickupCity: body.pickupCity,
        pickupLat: body.pickupLat,
        pickupLng: body.pickupLng,
        pickupRadius: body.pickupRadius || 500,
        pickupContact: body.pickupContact,
        pickupPhone: body.pickupPhone,
        pickupEmail: body.pickupEmail,
        dropAddress: body.dropAddress,
        dropCity: body.dropCity,
        dropLandmark: body.dropLandmark,
        dropLat: body.dropLat,
        dropLng: body.dropLng,
        dropRadius: body.dropRadius || 500,
        deliveryContact: body.deliveryContact,
        deliveryPhone: body.deliveryPhone,
        loadTypeId: body.loadTypeId,
        tripCost: body.tripCost,
        volume: body.volume,
        weight: body.weight,
        weightUnit: body.weightUnit,
        units: body.units,
        unitType: body.unitType,
        notes: body.notes,
        organizationId: session.organizationId || "",
      },
      include: {
        client: true,
      },
    });

    return NextResponse.json({ trip }, { status: 201 });
  } catch (error) {
    console.error("Create trip error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
