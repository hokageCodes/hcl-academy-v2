import { NextResponse } from "next/server";
import { requireAuth, hasRole } from "@/lib/auth";
import { isCloudinaryConfigured, getCloudinaryConfig, signCloudinaryParams } from "@/lib/cloudinary";
import { logError } from "@/lib/logger";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const isAdminUpload = body?.admin === true;

    if (isAdminUpload) {
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
    }

    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { success: false, error: "Receipt upload is not configured" },
        { status: 503 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "hcl-academy/receipt-proofs";
    const paramsToSign = {
      folder,
      timestamp,
    };

    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const signature = signCloudinaryParams(paramsToSign, apiSecret);

    return NextResponse.json({
      success: true,
      data: {
        cloudName,
        apiKey,
        folder,
        timestamp,
        signature,
      },
    });
  } catch (error) {
    logError("receipt-signature", error);
    return NextResponse.json(
      { success: false, error: "Could not prepare upload" },
      { status: 500 }
    );
  }
}

