import { NextResponse } from "next/server";
import { listPublicBanners } from "@/lib/bannerService";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get("placement") || "all";

    const banners = await listPublicBanners(
      placement === "navbar" || placement === "cohortsHero" ? placement : undefined
    );

    return NextResponse.json({
      success: true,
      data: { banners },
    });
  } catch (error) {
    console.error("[banners] Public list error:", error);
    const isTimeout =
      error.name === "MongoServerSelectionError" ||
      error.name === "MongoNetworkTimeoutError";
    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? "Database connection timed out. Please try again."
          : "Failed to load banners",
      },
      { status: isTimeout ? 503 : 500 }
    );
  }
}
