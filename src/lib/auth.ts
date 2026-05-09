import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type UserRole = "SUPER_ADMIN" | "TRANSPORTER_ADMIN" | "DISPATCHER" | "DRIVER" | "CLIENT" | "ACCOUNTS";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-key"
);

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function hasPermission(
  userRole: UserRole,
  requiredRoles: UserRole[]
): boolean {
  return requiredRoles.includes(userRole);
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPER_ADMIN: ["*"],
  TRANSPORTER_ADMIN: [
    "trips:*",
    "trucks:*",
    "drivers:*",
    "clients:*",
    "reports:*",
    "settings:*",
  ],
  DISPATCHER: [
    "trips:create",
    "trips:read",
    "trips:update",
    "trucks:read",
    "drivers:read",
    "clients:read",
    "tracking:read",
  ],
  DRIVER: ["trips:read", "trips:update:own", "expenses:create", "documents:create"],
  CLIENT: ["trips:read:own", "tracking:read:own", "documents:read:own"],
  ACCOUNTS: ["trips:read", "expenses:*", "reports:read", "invoices:*"],
};
