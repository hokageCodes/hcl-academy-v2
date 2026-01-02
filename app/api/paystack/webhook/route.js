import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Payment from "@/lib/models/Payment";

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
      console.error("PAYSTACK_SECRET_KEY not configured");
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
      console.error("No Paystack signature in webhook request");
      return NextResponse.json(
        { success: false, error: "No signature provided" },
        { status: 401 }
      );
    }

    // Verify the signature
    if (!verifyWebhookSignature(rawBody, signature, paystackSecretKey)) {
      console.error("Invalid Paystack webhook signature");
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
      console.error("Failed to parse webhook payload");
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
          // Payment not found - might be from another system or test
          console.warn(`Payment not found for reference: ${reference}`);
          // Still return 200 to acknowledge receipt
          return NextResponse.json({ success: true, received: true });
        }

        // Check if already processed (idempotency)
        if (payment.status === "completed") {
          console.log(`Payment ${reference} already processed, skipping`);
          return NextResponse.json({ 
            success: true, 
            received: true, 
            message: "Already processed" 
          });
        }

        // Mark as completed
        await payment.markAsCompleted(data);

        console.log("=== SUCCESSFUL PAYMENT ===");
        console.log("Reference:", reference);
        console.log("Amount:", data.amount / 100, "NGN");
        console.log("Email:", data.customer.email);
        console.log("Program:", payment.programName);
        console.log("Student:", payment.fullName);
        console.log("==========================");

        // TODO: Send confirmation email
        // await sendConfirmationEmail(payment);

        // TODO: Add to student enrollment system
        // await enrollStudent(payment);

        break;
      }

      case "charge.failed": {
        const { data } = event;
        const reference = data.reference;

        const payment = await Payment.findByReference(reference);

        if (!payment) {
          console.warn(`Payment not found for failed charge: ${reference}`);
          return NextResponse.json({ success: true, received: true });
        }

        // Check if already processed
        if (payment.status !== "pending") {
          console.log(`Payment ${reference} already processed (${payment.status})`);
          return NextResponse.json({ success: true, received: true });
        }

        // Mark as failed
        await payment.markAsFailed(data.gateway_response || "Payment failed");

        console.log("=== FAILED PAYMENT ===");
        console.log("Reference:", reference);
        console.log("Email:", data.customer?.email);
        console.log("Reason:", data.gateway_response);
        console.log("======================");

        break;
      }

      case "transfer.success": {
        // Handle transfer success (for refunds)
        console.log("Transfer successful:", event.data.reference);
        
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
        console.log("Transfer failed:", event.data.reference);
        break;
      }

      default:
        console.log("Unhandled webhook event:", event.event);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
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
