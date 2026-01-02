import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      );
    }

    // Get fresh admin data from database
    await connectDB();
    const admin = await Admin.findById(session.adminId).select("-passwordHash -salt");

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { success: false, authenticated: false, error: "Account not found or inactive" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      data: {
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

