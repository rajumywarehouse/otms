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
    const search = searchParams.get("search");

    const where: any = { isActive: true };
    if (session.organizationId) {
      where.organizationId = session.organizationId;
    }
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { licenseNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const drivers = await prisma.driver.findMany({
      where,
      include: {
        assignedTruck: { select: { truckNumber: true } },
        user: { select: { email: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ drivers });
  } catch (error) {
    console.error("Get drivers error:", error);
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

    const driver = await prisma.driver.create({
      data: {
        name: body.name,
        phone: body.phone,
        licenseNumber: body.licenseNumber,
        licenseExpiry: body.licenseExpiry ? new Date(body.licenseExpiry) : null,
        emergencyContact: body.emergencyContact,
        emergencyPhone: body.emergencyPhone,
        organizationId: session.organizationId || "",
      },
    });

    return NextResponse.json({ driver }, { status: 201 });
  } catch (error) {
    console.error("Create driver error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
