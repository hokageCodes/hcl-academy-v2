import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Payment from "@/lib/models/Payment";
import { sendBankTransferIntentEmails } from "@/lib/email";
import { logError } from "@/lib/logger";

function sanitizeInput(input, max = 500) {
  if (typeof input !== "string") return "";
  return input.trim().replace(/[<>]/g, "").slice(0, max);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const reference = sanitizeInput(body?.reference, 120);
    const transferReference = sanitizeInput(body?.transferReference, 120);
    const proofUrl = sanitizeInput(body?.proofUrl, 500);
    const proofNote = sanitizeInput(body?.proofNote, 500);

    if (!reference || !transferReference) {
      return NextResponse.json(
        { success: false, error: "reference and transferReference are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const payment = await Payment.findByReference(reference);
    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Enrollment not found" },
        { status: 404 }
      );
    }
    if (payment.paymentMethod !== "bank_transfer") {
      return NextResponse.json(
        { success: false, error: "This payment is not a bank transfer record" },
        { status: 400 }
      );
    }
    if (payment.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "This payment can no longer accept proof" },
        { status: 400 }
      );
    }

    payment.transferReference = transferReference;
    payment.transferSubmittedAt = new Date();
    payment.proofUrl = proofUrl || payment.proofUrl;
    payment.proofNote = proofNote || payment.proofNote;
    await payment.save();

    const emailResult = await sendBankTransferIntentEmails(payment, {
      proofUrl: payment.proofUrl,
      proofNote: payment.proofNote,
    });

    const emailWarning =
      !emailResult.sentToStudent || !emailResult.sentToAdmin
        ? "Proof saved, but one or more emails could not be delivered yet."
        : null;

    return NextResponse.json({
      success: true,
      data: {
        reference: payment.reference,
        emailWarning,
        message: "Proof submitted. We are now verifying your transfer.",
      },
    });
  } catch (error) {
    logError("bank-transfer-confirm", error);
    return NextResponse.json(
      { success: false, error: "Could not submit transfer proof" },
      { status: 500 }
    );
  }
}

