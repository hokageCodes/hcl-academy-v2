import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { requireAuth, hasRole } from "@/lib/auth";

// GET - Fetch admin profile
export async function GET() {
  try {
    const { authenticated, session } = await requireAuth();

    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const admin = await Admin.findById(session.adminId).select("-passwordHash -salt");

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isActive: admin.isActive,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    console.error("Fetch admin error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

// PATCH - Update admin profile
export async function PATCH(request) {
  try {
    const { authenticated, session } = await requireAuth();

    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, currentPassword, newPassword } = body;

    await connectDB();
    const admin = await Admin.findById(session.adminId);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 404 }
      );
    }

    // Update name if provided
    if (name && name.trim()) {
      admin.name = name.trim();
    }

    // Update email if provided (and different)
    if (email && email.trim() && email.toLowerCase() !== admin.email) {
      // Check if email is already in use
      const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
      if (existingAdmin && existingAdmin._id.toString() !== admin._id.toString()) {
        return NextResponse.json(
          { success: false, error: "Email already in use" },
          { status: 400 }
        );
      }
      admin.email = email.toLowerCase().trim();
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: "Current password is required" },
          { status: 400 }
        );
      }

      // Verify current password
      if (!admin.verifyPassword(currentPassword)) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      // Validate new password
      if (newPassword.length < 8) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 8 characters" },
          { status: 400 }
        );
      }

      admin.setPassword(newPassword);
    }

    await admin.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Update admin error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

