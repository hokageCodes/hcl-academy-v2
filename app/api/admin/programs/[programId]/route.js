import { NextResponse } from "next/server";
import { requireAuth, hasRole } from "@/lib/auth";
import { updateProgram } from "@/lib/programService";

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

    const { programId } = await params;
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const updated = await updateProgram(programId, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { program: updated },
    });
  } catch (error) {
    console.error("[programs] Admin update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update program" },
      { status: 500 }
    );
  }
}
