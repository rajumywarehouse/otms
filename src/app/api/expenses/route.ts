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
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};
    if (tripId) where.tripId = tripId;
    if (status) where.status = status;

    // Filter by organization through trip
    if (session.organizationId) {
      where.trip = { organizationId: session.organizationId };
    }

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          trip: { select: { tripNumber: true } },
          expenseType: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.expense.count({ where }),
    ]);

    return NextResponse.json({
      expenses,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get expenses error:", error);
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

    const expense = await prisma.expense.create({
      data: {
        tripId: body.tripId,
        expenseTypeId: body.expenseTypeId,
        amount: body.amount,
        remarks: body.remarks,
        receiptUrl: body.receiptUrl,
        status: "PENDING",
      },
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.error("Create expense error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
