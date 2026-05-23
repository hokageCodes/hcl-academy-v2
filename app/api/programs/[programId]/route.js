import { NextResponse } from "next/server";
import { getPublicProgramByProgramId } from "@/lib/programService";

export async function GET(_request, { params }) {
  try {
    const { programId } = await params;
    const program = await getPublicProgramByProgramId(programId);

    if (!program) {
      return NextResponse.json(
        { success: false, error: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { program },
    });
  } catch (error) {
    console.error("[programs] Public get error:", error);
    const isTimeout =
      error.name === "MongoServerSelectionError" ||
      error.name === "MongoNetworkTimeoutError";
    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? "Database connection timed out. Please try again."
          : "Failed to load program",
      },
      { status: isTimeout ? 503 : 500 }
    );
  }
}
