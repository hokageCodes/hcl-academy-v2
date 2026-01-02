import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-min-32-chars-long!"
);

const COOKIE_NAME = "admin_session";
const SESSION_DURATION = 24 * 60 * 60; // 24 hours in seconds

/**
 * Create a signed JWT token
 */
export async function createToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

/**
 * Set session cookie
 */
export async function setSessionCookie(adminId, email, role) {
  const token = await createToken({ adminId, email, role });
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });

  return token;
}

/**
 * Get current session from cookie
 */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  return verifyToken(token);
}

/**
 * Clear session cookie
 */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Middleware helper to require authentication
 */
export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    return { authenticated: false, session: null };
  }

  return { authenticated: true, session };
}

/**
 * Check if user has required role
 */
export function hasRole(session, requiredRoles) {
  if (!session) return false;
  if (!Array.isArray(requiredRoles)) requiredRoles = [requiredRoles];
  return requiredRoles.includes(session.role);
}

