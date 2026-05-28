import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Payment from "@/lib/models/Payment";
import { requireAuth, hasRole } from "@/lib/auth";
import { notifyPaymentCompleted } from "@/lib/paymentNotifications";
import { logError } from "@/lib/logger";

export async function PATCH(request, { params }) {
  try {
    const { authenticated, session } = await requireAuth();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!hasRole(session, ["super_admin", "admin"])) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { paymentId } = await params;
    const body = await request.json();
    const status = body?.status;
    const adminNotes = typeof body?.adminNotes === "string" ? body.adminNotes.trim() : "";

    if (!["completed", "failed", "pending"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    await connectDB();
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      );
    }

    payment.status = status;
    payment.adminNotes = adminNotes || payment.adminNotes;

    if (status === "completed") {
      payment.channel = payment.channel || "bank_transfer";
      payment.paidAt = payment.paidAt || new Date();
    }

    await payment.save();

    if (status === "completed") {
      await notifyPaymentCompleted(payment, { force: true });
    }

    return NextResponse.json({
      success: true,
      data: { id: payment._id.toString(), status: payment.status },
    });
  } catch (error) {
    logError("admin-payments-update", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

