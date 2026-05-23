import { NextResponse } from "next/server";
import { requireAuth, hasRole } from "@/lib/auth";
import { createBanner, listBannersForAdmin } from "@/lib/bannerService";

export async function GET() {
  try {
    const { authenticated, session } = await requireAuth();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    if (!hasRole(session, ["super_admin", "admin", "viewer"])) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const banners = await listBannersForAdmin();
    return NextResponse.json({ success: true, data: { banners } });
  } catch (error) {
    console.error("[banners] Admin list error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load banners" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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

    const body = await request.json();
    const required = ["bannerId", "eyebrow", "title", "tagline", "duration", "format", "feeNaira", "flyerImage"];
    for (const field of required) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json(
          { success: false, error: `Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    const result = await createBanner(body);
    if (result.error === "banner_id_exists") {
      return NextResponse.json(
        { success: false, error: "A banner with this ID already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, data: { banner: result.banner } });
  } catch (error) {
    console.error("[banners] Admin create error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create banner" },
      { status: 500 }
    );
  }
}
