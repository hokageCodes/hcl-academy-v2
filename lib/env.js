/** Require an env var in production; optional fallback only in development */
export function requireEnv(name, devFallback) {
  const value = process.env[name]?.trim();
  if (value) return value;

  if (process.env.NODE_ENV === "production") {
    throw new Error(`${name} must be set in production`);
  }

  if (devFallback !== undefined) return devFallback;
  throw new Error(`${name} is not configured`);
}
