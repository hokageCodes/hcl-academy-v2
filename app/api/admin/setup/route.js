import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";

/**
 * ONE-TIME SETUP ROUTE
 * Creates the initial super admin account
 * Should be disabled after first use in production
 */
export async function POST(request) {
  try {
    // Check setup secret (prevents unauthorized admin creation)
    const setupSecret = process.env.ADMIN_SETUP_SECRET;
    
    if (!setupSecret) {
      return NextResponse.json(
        { success: false, error: "Setup is disabled" },
        { status: 403 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const { secret, email, password, name } = body;

    // Validate setup secret
    if (secret !== setupSecret) {
      return NextResponse.json(
        { success: false, error: "Invalid setup secret" },
        { status: 403 }
      );
    }

    // Validate inputs
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    if (password.length < 12) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 12 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if any admin exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      // Recovery path: allow password reset for an existing admin when setup secret is provided.
      // This is useful if the original password is unknown but server access is still available.
      const existingByEmail = await Admin.findByEmail(email);
      if (!existingByEmail) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Admin already exists with a different email. Use that email or update it from dashboard after login.",
          },
          { status: 400 }
        );
      }

      existingByEmail.setPassword(password);
      existingByEmail.name = name?.trim() || existingByEmail.name;
      existingByEmail.isActive = true;
      existingByEmail.loginAttempts = 0;
      existingByEmail.lockUntil = null;
      await existingByEmail.save();

      return NextResponse.json({
        success: true,
        message: "Admin password reset successfully.",
        data: {
          email: existingByEmail.email,
          name: existingByEmail.name,
          role: existingByEmail.role,
        },
      });
    }

    // Create super admin
    const admin = new Admin({
      email: email.toLowerCase(),
      name,
      role: "super_admin",
      isActive: true,
    });

    admin.setPassword(password);
    await admin.save();

    return NextResponse.json({
      success: true,
      message: "Super admin created successfully. Please remove ADMIN_SETUP_SECRET from environment variables.",
      data: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Setup error:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

