import { NextResponse } from "next/server";
import { listProgramsForPublic } from "@/lib/programService";

export async function GET() {
  try {
    const programs = await listProgramsForPublic();

    return NextResponse.json({
      success: true,
      data: { programs },
    });
  } catch (error) {
    console.error("[programs] Public list error:", error);
    const isTimeout =
      error.name === "MongoServerSelectionError" ||
      error.name === "MongoNetworkTimeoutError";
    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? "Database connection timed out. Please try again."
          : "Failed to load programs",
      },
      { status: isTimeout ? 503 : 500 }
    );
  }
}
