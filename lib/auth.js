import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { requireEnv } from "@/lib/env";

const JWT_SECRET = new TextEncoder().encode(
  requireEnv("JWT_SECRET", "dev-only-insecure-jwt-secret-change-me!!")
);

export const COOKIE_NAME = "admin_session";
const SESSION_DURATION = 24 * 60 * 60; // 24 hours in seconds

export async function createToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(JWT_SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions(token) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  };
}

export async function createSessionToken(adminId, email, role) {
  return createToken({ adminId, email, role });
}

export async function setSessionCookie(adminId, email, role) {
  const token = await createSessionToken(adminId, email, role);
  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieOptions(token));
  return token;
}

export async function attachSessionCookie(response, adminId, email, role) {
  const token = await createSessionToken(adminId, email, role);
  response.cookies.set(getSessionCookieOptions(token));
  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  return verifyToken(token);
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    return { authenticated: false, session: null };
  }

  return { authenticated: true, session };
}

export function hasRole(session, requiredRoles) {
  if (!session) return false;
  if (!Array.isArray(requiredRoles)) requiredRoles = [requiredRoles];
  return requiredRoles.includes(session.role);
}
