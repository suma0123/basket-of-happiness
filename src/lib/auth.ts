import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import prisma from "./prisma";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return secret;
}
const TOKEN_COOKIE_NAME = "boh_session_token";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (
      typeof payload !== "object" ||
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    };
  } catch {
    return null;
  }
}

export async function getSessionUser(req?: NextRequest): Promise<TokenPayload | null> {
  let token: string | undefined;

  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      token = req.cookies.get(TOKEN_COOKIE_NAME)?.value;
    }
  } else {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    } catch {
      // Ignore if called outside server request context
    }
  }

  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(req?: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireAdmin(req?: NextRequest) {
  const session = await requireAuth(req);
  if (session.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required");
  }
  return session;
}

export { TOKEN_COOKIE_NAME };
