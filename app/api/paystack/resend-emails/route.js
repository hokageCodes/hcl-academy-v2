import { NextResponse } from "next/server";
import { requireAuth, hasRole } from "@/lib/auth";
import { processPaymentEmailNotification } from "@/lib/paymentNotifications";
import { logError } from "@/lib/logger";

async function requireAdmin() {
  const { authenticated, session } = await requireAuth();

  if (!authenticated) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  if (!hasRole(session, ["super_admin", "admin"])) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      ),
    };
  }

  return { ok: true };
}

export async function POST(request) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    let reference;
    try {
      const body = await request.json();
      reference = body.reference;
    } catch {
      return NextResponse.json(
        { success: false, error: "JSON body with reference required" },
        { status: 400 }
      );
    }

    if (!reference) {
      return NextResponse.json(
        { success: false, error: "reference is required" },
        { status: 400 }
      );
    }

    const result = await processPaymentEmailNotification(reference, {
      force: true,
    });

    if (!result.sent) {
      return NextResponse.json({
        success: false,
        result,
      });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    logError("resend-emails", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { success: false, error: "reference query param required" },
        { status: 400 }
      );
    }

    const result = await processPaymentEmailNotification(reference, {
      force: true,
    });

    return NextResponse.json({ success: result.sent === true, result });
  } catch (error) {
    logError("resend-emails", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}
