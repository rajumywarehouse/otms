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
    const tripId = searchParams.get("tripId");
    const type = searchParams.get("type");

    const where: any = {};
    if (tripId) where.tripId = tripId;
    if (type) where.type = type;

    // Filter by organization through trip
    if (session.organizationId) {
      where.trip = { organizationId: session.organizationId };
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        trip: { select: { tripNumber: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Get documents error:", error);
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

    const document = await prisma.document.create({
      data: {
        tripId: body.tripId,
        type: body.type,
        name: body.name,
        url: body.url,
        mimeType: body.mimeType,
        size: body.size,
      },
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error("Create document error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
