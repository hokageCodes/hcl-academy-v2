/** Relative path to a program's full detail + registration page */
export function getProgramSharePath(programId) {
  return `/programs/${programId}`;
}

/** Resolve app origin — pass `window.location.origin` on the client when available */
export function getAppOrigin(origin) {
  if (origin) return origin.replace(/\/$/, "");
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

/** Server-side origin from the incoming request (works locally and in production) */
export async function getRequestOrigin() {
  const { headers } = await import("next/headers");
  const h = await headers();
  const host = h.get("x-forwarded-host")?.split(",")[0]?.trim() || h.get("host");
  if (!host) return getAppOrigin();

  const proto =
    h.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  return `${proto}://${host}`;
}

export function getProgramShareUrl(programId, origin) {
  const base = getAppOrigin(origin);
  return `${base}${getProgramSharePath(programId)}`;
}

export async function getProgramShareUrlFromRequest(programId) {
  const base = await getRequestOrigin();
  return `${base}${getProgramSharePath(programId)}`;
}
