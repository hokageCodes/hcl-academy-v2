import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Payment from "@/lib/models/Payment";
import { requireAuth, hasRole } from "@/lib/auth";

export async function GET(request) {
  try {
    // Check authentication
    const { authenticated, session } = await requireAuth();

    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check role
    if (!hasRole(session, ["super_admin", "admin", "viewer"])) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
    const status = searchParams.get("status");
    const programId = searchParams.get("programId");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Connect to database
    await connectDB();

    // Build query
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (programId && programId !== "all") {
      query.programId = programId;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { email: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { reference: searchRegex },
        { phone: searchRegex },
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Get total count
    const total = await Payment.countDocuments(query);

    // Get paginated results
    const payments = await Payment.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Transform for response
    const transformedPayments = payments.map((p) => ({
      id: p._id.toString(),
      reference: p.reference,
      email: p.email,
      fullName: `${p.firstName} ${p.lastName}`,
      phone: p.phone,
      programId: p.programId,
      programName: p.programName,
      amount: p.amount / 100, // Convert to Naira
      currency: p.currency,
      status: p.status,
      channel: p.channel,
      paidAt: p.paidAt,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        payments: transformedPayments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Fetch payments error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

