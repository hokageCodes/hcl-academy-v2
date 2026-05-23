import { NextResponse } from "next/server";
import { requireAuth, hasRole } from "@/lib/auth";
import { deleteBanner, updateBanner } from "@/lib/bannerService";

export async function PATCH(request, { params }) {
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

    const { bannerId } = await params;
    const body = await request.json();
    const updated = await updateBanner(bannerId, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { banner: updated } });
  } catch (error) {
    console.error("[banners] Admin update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
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

    const { bannerId } = await params;
    const deleted = await deleteBanner(bannerId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[banners] Admin delete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
