import { NextRequest, NextResponse } from "next/server";
import { createToken } from "@/lib/auth";

// Demo users for development without database
const DEMO_USERS = [
  { email: "admin@otms.com", password: "admin123", id: "demo-admin-001", name: "Admin User", role: "TRANSPORTER_ADMIN" as const, organizationId: "demo-org-001" },
  { email: "dispatcher@otms.com", password: "dispatcher123", id: "demo-disp-001", name: "Ramesh Patel", role: "DISPATCHER" as const, organizationId: "demo-org-001" },
  { email: "driver@otms.com", password: "driver123", id: "demo-driver-001", name: "Rajesh Kumar", role: "DRIVER" as const, organizationId: "demo-org-001" },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Try demo login first (works without database)
    const demoUser = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (demoUser) {
      const token = await createToken({
        userId: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
        organizationId: demoUser.organizationId,
      });

      const response = NextResponse.json({
        user: {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          organizationId: demoUser.organizationId,
        },
      });

      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    // If not a demo user, try database auth
    try {
      const { compare } = await import("bcryptjs");
      const { prisma } = await import("@/lib/prisma");

      const user = await prisma.user.findUnique({
        where: { email },
        include: { organization: true },
      });

      if (!user || !user.isActive) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const token = await createToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId || undefined,
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      const response = NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId,
        },
      });

      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    } catch {
      // Database unavailable - only demo users can login
      return NextResponse.json(
        { error: "Invalid credentials. Try demo: admin@otms.com / admin123" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
