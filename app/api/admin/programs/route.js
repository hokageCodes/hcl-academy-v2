import { NextResponse } from "next/server";
import { requireAuth, hasRole } from "@/lib/auth";
import { listProgramsForAdmin } from "@/lib/programService";

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

    const programs = await listProgramsForAdmin();

    return NextResponse.json({
      success: true,
      data: { programs },
    });
  } catch (error) {
    console.error("[programs] Admin list error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load programs" },
      { status: 500 }
    );
  }
}
