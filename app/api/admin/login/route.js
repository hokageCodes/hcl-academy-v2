import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { attachSessionCookie } from "@/lib/auth";
import { smartRateLimit } from "@/lib/rateLimit";

export async function POST(request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    const rateLimitResult = await smartRateLimit({
      identifier: `admin_login:${ip}`,
      limit: 10,
      window: 300,
      prefix: "rl_admin",
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many login attempts. Try again later." },
        { status: 429 }
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

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const admin = await Admin.findByEmail(email);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (admin.isLocked()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Account temporarily locked after too many failed attempts. Wait 15 minutes or contact support.",
        },
        { status: 423 }
      );
    }

    if (!admin.verifyPassword(password)) {
      await admin.incLoginAttempts();
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!admin.isActive) {
      return NextResponse.json(
        { success: false, error: "Account is deactivated" },
        { status: 403 }
      );
    }

    await admin.resetLoginAttempts();

    const response = NextResponse.json({
      success: true,
      data: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    await attachSessionCookie(
      response,
      admin._id.toString(),
      admin.email,
      admin.role
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}
