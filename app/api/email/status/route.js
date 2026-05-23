import { NextResponse } from "next/server";
import { requireAuth, hasRole } from "@/lib/auth";
import { isEmailConfigured } from "@/lib/resend";
import { logError } from "@/lib/logger";

export async function GET() {
  try {
    const { authenticated, session } = await requireAuth();

    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!hasRole(session, ["super_admin", "admin"])) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const configured = isEmailConfigured();

    return NextResponse.json({
      provider: "resend",
      configured,
      hasApiKey: Boolean(process.env.RESEND_API_KEY?.trim()),
      hasFrom: Boolean(process.env.RESEND_FROM?.trim()),
      message: configured
        ? "Emails are sent via Resend."
        : "Set RESEND_API_KEY and RESEND_FROM (verified domain) in your environment.",
    });
  } catch (error) {
    logError("email-status", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}
