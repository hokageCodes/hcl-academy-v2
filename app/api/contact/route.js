import { NextResponse } from "next/server";
import { sendContactFormEmails } from "@/lib/email";
import { smartRateLimit } from "@/lib/rateLimit";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeInput(input, maxLength = 500) {
  if (typeof input !== "string") return "";
  return input.trim().replace(/[<>]/g, "").slice(0, maxLength);
}

const VALID_PROGRAMS = [
  "intro-to-web-development",
  "ui-ux-design-fundamentals",
  "vibe-coding-essentials",
  "general",
];

export async function POST(request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    const rateLimitResult = await smartRateLimit({
      identifier: `contact:${ip}`,
      limit: 3,
      window: 300,
      prefix: "rl_contact",
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many messages. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const name = sanitizeInput(body.name, 120);
    const email = sanitizeInput(body.email, 254).toLowerCase();
    const program = sanitizeInput(body.program, 80);
    const message = sanitizeInput(body.message, 2000);

    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter your full name." },
        { status: 400 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!message || message.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "Please write a message of at least 10 characters.",
        },
        { status: 400 }
      );
    }

    if (program && !VALID_PROGRAMS.includes(program)) {
      return NextResponse.json(
        { success: false, error: "Please select a valid program." },
        { status: 400 }
      );
    }

    const result = await sendContactFormEmails({ name, email, program, message });

    if (!result.sent) {
      console.error("[contact] Email failed:", result.reason);
      return NextResponse.json(
        {
          success: false,
          error:
            "We couldn't send your message right now. Please try again shortly or email info@hokagecreativelabs.com directly.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[contact] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
