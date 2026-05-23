import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Payment from "@/lib/models/Payment";
import { processPaymentEmailNotification } from "@/lib/paymentNotifications";
import { logError, logInfo, logWarn } from "@/lib/logger";

// Verify Paystack webhook signature
function verifyWebhookSignature(payload, signature, secret) {
  const hash = crypto
    .createHmac("sha512", secret)
    .update(payload)
    .digest("hex");
  return hash === signature;
}

export async function POST(request) {
  try {
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecretKey) {
      logError("webhook", "PAYSTACK_SECRET_KEY not configured");
      return NextResponse.json(
        { success: false, error: "Configuration error" },
        { status: 500 }
      );
    }

    // Get the raw body for signature verification
    const rawBody = await request.text();

    // Get Paystack signature from headers
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      logWarn("webhook", "Missing Paystack signature");
      return NextResponse.json(
        { success: false, error: "No signature provided" },
        { status: 401 }
      );
    }

    // Verify the signature
    if (!verifyWebhookSignature(rawBody, signature, paystackSecretKey)) {
      logWarn("webhook", "Invalid Paystack signature");
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse the verified payload
    let event;
    try {
      event = JSON.parse(rawBody);
    } catch {
      logWarn("webhook", "Invalid JSON payload");
      return NextResponse.json(
        { success: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Handle different event types
    switch (event.event) {
      case "charge.success": {
        const { data } = event;
        const reference = data.reference;

        // IDEMPOTENCY CHECK: Find payment and check if already processed
        const payment = await Payment.findByReference(reference);

        if (!payment) {
          logWarn("webhook", `Payment not found: ${reference}`);
          return NextResponse.json({ success: true, received: true });
        }

        if (payment.status === "completed") {
          if (!payment.confirmationEmailsSent) {
            await processPaymentEmailNotification(payment.reference);
          }
          logInfo("webhook", `Payment already processed: ${reference}`);
          return NextResponse.json({
            success: true,
            received: true,
            message: "Already processed",
          });
        }

        // Mark as completed
        await payment.markAsCompleted(data);

        // Sync amount from Paystack (source of truth for what was charged)
        if (data.amount && data.amount !== payment.amount) {
          payment.amount = data.amount;
          await payment.save();
        }

        const emailResult = await processPaymentEmailNotification(
          payment.reference
        );
        if (!emailResult.sent && !emailResult.skipped) {
          logWarn("webhook", `Email failed for ${reference}`);
        }

        logInfo("webhook", `Payment completed: ${reference}`);
        break;
      }

      case "charge.failed": {
        const { data } = event;
        const reference = data.reference;

        const payment = await Payment.findByReference(reference);

        if (!payment) {
          logWarn("webhook", `Failed payment not found: ${reference}`);
          return NextResponse.json({ success: true, received: true });
        }

        if (payment.status !== "pending") {
          logInfo("webhook", `Failed charge already handled: ${reference}`);
          return NextResponse.json({ success: true, received: true });
        }

        await payment.markAsFailed(data.gateway_response || "Payment failed");
        logInfo("webhook", `Payment failed: ${reference}`);
        break;
      }

      case "transfer.success": {
        logInfo("webhook", `Transfer success: ${event.data.reference}`);
        
        // Update payment if this is a refund
        const reference = event.data.reason?.includes("Refund:")
          ? event.data.reason.split("Refund:")[1]?.trim()
          : null;

        if (reference) {
          const payment = await Payment.findByReference(reference);
          if (payment) {
            payment.status = "refunded";
            payment.adminNotes = `Refunded via transfer ${event.data.reference}`;
            await payment.save();
          }
        }
        break;
      }

      case "transfer.failed": {
        logWarn("webhook", `Transfer failed: ${event.data.reference}`);
        break;
      }

      default:
        logInfo("webhook", `Unhandled event: ${event.event}`);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    logError("webhook", error);
    // Still return 200 to prevent Paystack from retrying indefinitely
    // Log the error for investigation
    return NextResponse.json({ success: true, received: true, error: "Internal error logged" });
  }
}

// Only allow POST
export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method not allowed" },
    { status: 405 }
  );
}
