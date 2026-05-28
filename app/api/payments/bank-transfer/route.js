import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Payment from "@/lib/models/Payment";
import { smartRateLimit } from "@/lib/rateLimit";
import { getProgramForPayment } from "@/lib/programService";
import { getBankTransferDetails } from "@/lib/bankTransfer";
import { logError } from "@/lib/logger";

function sanitizeInput(input, max = 500) {
  if (typeof input !== "string") return "";
  return input.trim().replace(/[<>]/g, "").slice(0, max);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^(\+234|234|0)[789][01]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

function generateReference() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = crypto.randomBytes(8).toString("hex").toUpperCase();
  return `HCL_BT_${timestamp}_${randomPart}`;
}

export async function POST(request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const rateLimitResult = await smartRateLimit({
      identifier: `bank_transfer:${ip}`,
      limit: 5,
      window: 60,
      prefix: "rl_bank_transfer",
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, firstName, lastName, phone, programId } = body || {};

    if (!email || !firstName || !lastName || !phone || !programId) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const sanitizedEmail = sanitizeInput(email, 120).toLowerCase();
    const sanitizedFirstName = sanitizeInput(firstName, 80);
    const sanitizedLastName = sanitizeInput(lastName, 80);
    const sanitizedPhone = sanitizeInput(phone, 24).replace(/\s/g, "");
    const sanitizedProgramId = sanitizeInput(programId, 80);

    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (!isValidPhone(sanitizedPhone)) {
      return NextResponse.json(
        { success: false, error: "Invalid Nigerian phone number" },
        { status: 400 }
      );
    }

    await connectDB();
    const program = await getProgramForPayment(sanitizedProgramId);

    if (!program || !program.available) {
      return NextResponse.json(
        { success: false, error: "This program is not open for enrollment yet" },
        { status: 400 }
      );
    }

    const payment = await Payment.create({
      reference: generateReference(),
      email: sanitizedEmail,
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      phone: sanitizedPhone,
      programId: sanitizedProgramId,
      programName: program.name,
      amount: program.amount,
      currency: "NGN",
      status: "pending",
      paymentMethod: "bank_transfer",
      channel: "bank_transfer",
      ipAddress: ip,
      userAgent: userAgent.slice(0, 500),
    });

    const bankDetails = getBankTransferDetails();

    return NextResponse.json({
      success: true,
      data: {
        paymentId: payment._id.toString(),
        reference: payment.reference,
        bankDetails,
        message:
          "Enrollment received. Complete transfer, then submit your transfer reference and proof.",
      },
    });
  } catch (error) {
    logError("bank-transfer", error);
    return NextResponse.json(
      { success: false, error: "Could not start bank transfer enrollment" },
      { status: 500 }
    );
  }
}

