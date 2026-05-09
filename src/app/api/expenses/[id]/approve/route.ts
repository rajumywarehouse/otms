import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body; // "approve" or "reject"

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const expense = await prisma.expense.update({
      where: { id: params.id },
      data: {
        status: action === "approve" ? "APPROVED" : "REJECTED",
      },
    });

    return NextResponse.json({ expense });
  } catch (error) {
    console.error("Approve expense error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
