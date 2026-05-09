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
    const type = searchParams.get("type");

    let data: any = {};

    if (!type || type === "truckTypes") {
      data.truckTypes = await prisma.truckType.findMany({ orderBy: { name: "asc" } });
    }
    if (!type || type === "loadTypes") {
      data.loadTypes = await prisma.loadType.findMany({ orderBy: { name: "asc" } });
    }
    if (!type || type === "expenseTypes") {
      data.expenseTypes = await prisma.expenseType.findMany({ orderBy: { name: "asc" } });
    }
    if (!type || type === "unitTypes") {
      data.unitTypes = await prisma.unitType.findMany({ orderBy: { name: "asc" } });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get masters error:", error);
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
    const { type, name, description } = body;

    if (!type || !name) {
      return NextResponse.json({ error: "Type and name are required" }, { status: 400 });
    }

    const id = name.toLowerCase().replace(/\s+/g, "-");
    let result;

    switch (type) {
      case "truckTypes":
        result = await prisma.truckType.create({ data: { id, name, description } });
        break;
      case "loadTypes":
        result = await prisma.loadType.create({ data: { id, name, description } });
        break;
      case "expenseTypes":
        result = await prisma.expenseType.create({ data: { id, name, description } });
        break;
      case "unitTypes":
        result = await prisma.unitType.create({ data: { id, name, description } });
        break;
      default:
        return NextResponse.json({ error: "Invalid master type" }, { status: 400 });
    }

    return NextResponse.json({ result }, { status: 201 });
  } catch (error) {
    console.error("Create master error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
