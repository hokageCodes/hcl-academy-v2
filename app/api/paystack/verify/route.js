import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Payment from "@/lib/models/Payment";
import { smartRateLimit } from "@/lib/rateLimit";

// Tightened reference validation
function isValidReference(ref) {
  if (typeof ref !== "string") return false;
  // Match our exact format: HCL_<base36timestamp>_<16 hex chars>
  const refRegex = /^HCL_[A-Z0-9]+_[A-F0-9]{16}$/;
  return refRegex.test(ref);
}

export async function GET(request) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    // Check rate limit
    const rateLimitResult = await smartRateLimit({
      identifier: `payment_verify:${ip}`,
      limit: 10,
      window: 60, // 10 requests per minute
      prefix: "rl_verify",
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Get reference from query params
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    // Validate reference
    if (!reference) {
      return NextResponse.json(
        { success: false, error: "Reference is required" },
        { status: 400 }
      );
    }

    if (!isValidReference(reference)) {
      return NextResponse.json(
        { success: false, error: "Invalid reference format" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // FIRST: Check our database (source of truth)
    const payment = await Payment.findByReference(reference);

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      );
    }

    // If payment is already completed in our DB, return success immediately
    // This is faster and doesn't rely on Paystack being available
    if (payment.status === "completed") {
      return NextResponse.json({
        success: true,
        data: {
          status: "success",
          reference: payment.reference,
          amount: payment.amount / 100, // Convert from kobo to naira
          currency: payment.currency,
          paidAt: payment.paidAt,
          channel: payment.channel,
          customer: {
            email: payment.email,
            name: payment.fullName,
          },
          program: {
            name: payment.programName,
            id: payment.programId,
          },
        },
      });
    }

    // If payment is pending, verify with Paystack
    if (payment.status === "pending") {
      const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
      
      if (!paystackSecretKey) {
        return NextResponse.json(
          { success: false, error: "Payment service unavailable" },
          { status: 503 }
        );
      }

      // Verify with Paystack
      const paystackResponse = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const paystackData = await paystackResponse.json();

      if (paystackResponse.ok && paystackData.status) {
        const { data } = paystackData;

        // Update our database based on Paystack response
        if (data.status === "success") {
          // Mark as completed in our DB
          await payment.markAsCompleted(data);

          return NextResponse.json({
            success: true,
            data: {
              status: "success",
              reference: data.reference,
              amount: data.amount / 100,
              currency: data.currency,
              paidAt: data.paid_at,
              channel: data.channel,
              customer: {
                email: data.customer.email,
                name: payment.fullName,
              },
              program: {
                name: payment.programName,
                id: payment.programId,
              },
            },
          });
        } else if (data.status === "abandoned") {
          payment.status = "abandoned";
          await payment.save();

          return NextResponse.json({
            success: false,
            data: {
              status: "abandoned",
              message: "Payment was abandoned",
            },
          });
        } else if (data.status === "failed") {
          await payment.markAsFailed(data.gateway_response || "Payment failed");

          return NextResponse.json({
            success: false,
            data: {
              status: "failed",
              message: data.gateway_response || "Payment failed",
            },
          });
        }
      }

      // Paystack verification failed or returned unexpected status
      return NextResponse.json({
        success: false,
        data: {
          status: "pending",
          message: "Payment is still being processed",
        },
      });
    }

    // Payment exists but is in failed/abandoned/refunded state
    return NextResponse.json({
      success: false,
      data: {
        status: payment.status,
        message: payment.status === "failed" 
          ? payment.gatewayResponse || "Payment failed"
          : `Payment ${payment.status}`,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Only allow GET
export async function POST() {
  return NextResponse.json(
    { success: false, error: "Method not allowed" },
    { status: 405 }
  );
}
