import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { setSessionCookie } from "@/lib/auth";
import { smartRateLimit } from "@/lib/rateLimit";

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    // Strict rate limiting for login (prevent brute force)
    const rateLimitResult = await smartRateLimit({
      identifier: `admin_login:${ip}`,
      limit: 5,
      window: 300, // 5 attempts per 5 minutes
      prefix: "rl_admin",
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many login attempts. Try again later." },
        { status: 429 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find admin by email
    const admin = await Admin.findByEmail(email);

    if (!admin) {
      // Use same error to prevent email enumeration
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (admin.isLocked()) {
      return NextResponse.json(
        { success: false, error: "Account temporarily locked. Try again later." },
        { status: 423 }
      );
    }

    // Verify password
    if (!admin.verifyPassword(password)) {
      await admin.incLoginAttempts();
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!admin.isActive) {
      return NextResponse.json(
        { success: false, error: "Account is deactivated" },
        { status: 403 }
      );
    }

    // Reset login attempts and update last login
    await admin.resetLoginAttempts();

    // Set session cookie
    await setSessionCookie(admin._id.toString(), admin.email, admin.role);

    return NextResponse.json({
      success: true,
      data: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

