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
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const where: any = { isActive: true };

    if (session.organizationId) {
      where.organizationId = session.organizationId;
    }
    if (status) where.status = status;
    if (type) where.truckTypeId = type;

    const trucks = await prisma.truck.findMany({
      where,
      include: {
        truckType: { select: { name: true } },
        driver: { select: { name: true, phone: true, status: true } },
      },
      orderBy: { truckNumber: "asc" },
    });

    return NextResponse.json({ trucks });
  } catch (error) {
    console.error("Get trucks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const truck = await prisma.truck.create({
      data: {
        truckNumber: body.truckNumber,
        truckTypeId: body.truckTypeId,
        capacity: body.capacity,
        ownershipType: body.ownershipType || "OWNED",
        rcNumber: body.rcNumber,
        gpsDeviceId: body.gpsDeviceId,
        fitnessExpiry: body.fitnessExpiry ? new Date(body.fitnessExpiry) : null,
        insuranceExpiry: body.insuranceExpiry ? new Date(body.insuranceExpiry) : null,
        organizationId: session.organizationId || "",
      },
    });

    return NextResponse.json({ truck }, { status: 201 });
  } catch (error) {
    console.error("Create truck error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
