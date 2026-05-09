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
    const search = searchParams.get("search");

    const where: any = {};
    if (session.organizationId) {
      where.organizationId = session.organizationId;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { gstNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const clients = await prisma.client.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("Get clients error:", error);
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

    const client = await prisma.client.create({
      data: {
        name: body.name,
        address: body.address,
        city: body.city,
        state: body.state,
        pincode: body.pincode,
        contactName: body.contactName,
        contactPhone: body.contactPhone,
        contactEmail: body.contactEmail,
        gstNumber: body.gstNumber,
        organizationId: session.organizationId || "",
      },
    });

    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    console.error("Create client error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
