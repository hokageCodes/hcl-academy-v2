const isProd = process.env.NODE_ENV === "production";

/** Safe server logging — never log secrets or full error objects in production */
export function logError(context, error) {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "Unknown error";
  console.error(`[${context}]`, message);
}

export function logWarn(context, message) {
  console.warn(`[${context}]`, message);
}

export function logInfo(context, message) {
  if (!isProd) {
    console.log(`[${context}]`, message);
  }
}
