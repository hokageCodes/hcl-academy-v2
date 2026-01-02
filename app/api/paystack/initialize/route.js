import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Payment from "@/lib/models/Payment";
import { smartRateLimit } from "@/lib/rateLimit";

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate Nigerian phone number
function isValidPhone(phone) {
  const phoneRegex = /^(\+234|234|0)[789][01]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

// Sanitize input to prevent XSS
function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, 500);
}

// Generate unique reference with tighter format
function generateReference() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = crypto.randomBytes(8).toString("hex").toUpperCase();
  return `HCL_${timestamp}_${randomPart}`;
}

// Valid programs and their prices (in kobo - Paystack uses kobo)
const VALID_PROGRAMS = {
  "intro-to-web-development": {
    name: "Intro to Web Development",
    amount: 5000000, // N50,000 in kobo
    description: "8-week comprehensive web development program",
  },
  "ui-ux-design-fundamentals": {
    name: "UI/UX Design Fundamentals",
    amount: 4500000, // N45,000 in kobo
    description: "6-week UI/UX design program",
  },
  "vibe-coding-essentials": {
    name: "Vibe Coding Essentials",
    amount: 3500000, // N35,000 in kobo
    description: "4-week coding essentials program",
  },
};

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Check rate limit using Redis (or fallback)
    const rateLimitResult = await smartRateLimit({
      identifier: `payment_init:${ip}`,
      limit: 5,
      window: 60, // 5 requests per minute
      prefix: "rl_payment",
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
          retryAfter: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.reset - Math.floor(Date.now() / 1000)),
            "X-RateLimit-Limit": String(rateLimitResult.limit),
            "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          },
        }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { email, firstName, lastName, phone, programId } = body;

    // Validate required fields
    if (!email || !firstName || !lastName || !phone || !programId) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required",
          missing: {
            email: !email,
            firstName: !firstName,
            lastName: !lastName,
            phone: !phone,
            programId: !programId,
          },
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedFirstName = sanitizeInput(firstName);
    const sanitizedLastName = sanitizeInput(lastName);
    const sanitizedPhone = sanitizeInput(phone).replace(/\s/g, "");
    const sanitizedProgramId = sanitizeInput(programId);

    // Validate email
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate phone
    if (!isValidPhone(sanitizedPhone)) {
      return NextResponse.json(
        { success: false, error: "Invalid Nigerian phone number" },
        { status: 400 }
      );
    }

    // Validate name lengths
    if (sanitizedFirstName.length < 2 || sanitizedLastName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Names must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Validate program exists
    const program = VALID_PROGRAMS[sanitizedProgramId];
    if (!program) {
      return NextResponse.json(
        { success: false, error: "Invalid program selected" },
        { status: 400 }
      );
    }

    // Check for Paystack secret key
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      console.error("PAYSTACK_SECRET_KEY not configured");
      return NextResponse.json(
        { success: false, error: "Payment service unavailable" },
        { status: 503 }
      );
    }

    // Validate we're not using test keys in production
    const isProduction = process.env.NODE_ENV === "production";
    const isTestKey = paystackSecretKey.startsWith("sk_test_");
    if (isProduction && isTestKey) {
      console.error("WARNING: Using test Paystack key in production!");
      // Optionally block this in production
    }

    // Generate unique reference
    const reference = generateReference();

    // Connect to database
    await connectDB();

    // Create payment record BEFORE calling Paystack
    const payment = new Payment({
      reference,
      email: sanitizedEmail,
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      phone: sanitizedPhone,
      programId: sanitizedProgramId,
      programName: program.name,
      amount: program.amount,
      currency: "NGN",
      status: "pending",
      ipAddress: ip,
      userAgent: userAgent.slice(0, 500),
    });

    await payment.save();

    // Initialize transaction with Paystack
    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: sanitizedEmail,
          amount: program.amount,
          reference,
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/programs/payment-callback`,
          metadata: {
            custom_fields: [
              {
                display_name: "Student Name",
                variable_name: "student_name",
                value: `${sanitizedFirstName} ${sanitizedLastName}`,
              },
              {
                display_name: "Phone Number",
                variable_name: "phone",
                value: sanitizedPhone,
              },
              {
                display_name: "Program",
                variable_name: "program",
                value: program.name,
              },
              {
                display_name: "Program ID",
                variable_name: "program_id",
                value: sanitizedProgramId,
              },
            ],
            firstName: sanitizedFirstName,
            lastName: sanitizedLastName,
            phone: sanitizedPhone,
            programId: sanitizedProgramId,
            programName: program.name,
            paymentId: payment._id.toString(),
          },
          channels: ["card", "bank", "ussd", "bank_transfer"],
        }),
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      console.error("Paystack initialization failed:", paystackData);

      // Update payment record to failed
      payment.status = "failed";
      payment.gatewayResponse = paystackData.message || "Initialization failed";
      await payment.save();

      return NextResponse.json(
        {
          success: false,
          error: paystackData.message || "Payment initialization failed",
        },
        { status: 500 }
      );
    }

    // Return success with authorization URL and reference
    return NextResponse.json({
      success: true,
      data: {
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
      },
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Prevent other methods
export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method not allowed" },
    { status: 405 }
  );
}
