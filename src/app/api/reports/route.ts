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
    const type = searchParams.get("type") || "summary";
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const orgFilter = session.organizationId
      ? { organizationId: session.organizationId }
      : {};

    const dateFilter: any = {};
    if (from) dateFilter.gte = new Date(from);
    if (to) dateFilter.lte = new Date(to);

    const tripFilter: any = {
      ...orgFilter,
      ...(from || to ? { createdAt: dateFilter } : {}),
    };

    switch (type) {
      case "summary": {
        const [total, completed, inTransit, cancelled, revenue] = await Promise.all([
          prisma.trip.count({ where: tripFilter }),
          prisma.trip.count({ where: { ...tripFilter, status: "COMPLETED" } }),
          prisma.trip.count({ where: { ...tripFilter, status: "IN_TRANSIT" } }),
          prisma.trip.count({ where: { ...tripFilter, status: "CANCELLED" } }),
          prisma.trip.aggregate({ where: { ...tripFilter, status: "COMPLETED" }, _sum: { tripCost: true } }),
        ]);

        return NextResponse.json({
          report: { total, completed, inTransit, cancelled, revenue: revenue._sum.tripCost || 0 },
        });
      }

      case "client-wise": {
        const trips = await prisma.trip.groupBy({
          by: ["clientId"],
          where: tripFilter,
          _count: true,
          _sum: { tripCost: true },
        });

        const clientIds = trips.map((t) => t.clientId);
        const clients = await prisma.client.findMany({
          where: { id: { in: clientIds } },
          select: { id: true, name: true },
        });

        const report = trips.map((t) => ({
          client: clients.find((c) => c.id === t.clientId)?.name || "Unknown",
          trips: t._count,
          revenue: t._sum.tripCost || 0,
        }));

        return NextResponse.json({ report });
      }

      case "truck-wise": {
        const trips = await prisma.trip.groupBy({
          by: ["truckId"],
          where: { ...tripFilter, truckId: { not: null } },
          _count: true,
          _sum: { tripCost: true },
        });

        const truckIds = trips.map((t) => t.truckId).filter(Boolean) as string[];
        const trucks = await prisma.truck.findMany({
          where: { id: { in: truckIds } },
          select: { id: true, truckNumber: true },
        });

        const report = trips.map((t) => ({
          truck: trucks.find((tr) => tr.id === t.truckId)?.truckNumber || "Unknown",
          trips: t._count,
          revenue: t._sum.tripCost || 0,
        }));

        return NextResponse.json({ report });
      }

      case "expense": {
        const expenses = await prisma.expense.groupBy({
          by: ["expenseTypeId"],
          where: { status: "APPROVED" },
          _count: true,
          _sum: { amount: true },
        });

        const typeIds = expenses.map((e) => e.expenseTypeId);
        const types = await prisma.expenseType.findMany({
          where: { id: { in: typeIds } },
        });

        const report = expenses.map((e) => ({
          type: types.find((t) => t.id === e.expenseTypeId)?.name || "Unknown",
          count: e._count,
          total: e._sum.amount || 0,
        }));

        return NextResponse.json({ report });
      }

      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Reports error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
