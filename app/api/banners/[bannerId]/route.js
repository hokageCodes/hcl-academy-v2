import { NextResponse } from "next/server";
import { getBannerByBannerId } from "@/lib/bannerService";

export async function GET(_request, { params }) {
  try {
    const { bannerId } = await params;
    const banner = await getBannerByBannerId(bannerId);

    if (!banner) {
      return NextResponse.json(
        { success: false, error: "Banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { banner } });
  } catch (error) {
    console.error("[banners] Public get error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load banner" },
      { status: 500 }
    );
  }
}
