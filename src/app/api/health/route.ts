import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: {
        database: "connected",
        application: "running",
      },
    });
  } catch {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        services: {
          database: "disconnected",
          application: "running",
        },
      },
      { status: 503 }
    );
  }
}
