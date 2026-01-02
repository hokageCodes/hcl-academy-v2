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
    const search = searchParams.get("search");
    const programId = searchParams.get("programId");

    // Connect to database
    await connectDB();

    // Aggregation pipeline to get unique students
    const matchStage = { status: "completed" };
    
    if (programId && programId !== "all") {
      matchStage.programId = programId;
    }

    // Build the aggregation pipeline
    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: "$email",
          email: { $first: "$email" },
          firstName: { $first: "$firstName" },
          lastName: { $first: "$lastName" },
          phone: { $first: "$phone" },
          programs: { $addToSet: "$programName" },
          programIds: { $addToSet: "$programId" },
          totalPaid: { $sum: "$amount" },
          enrollments: { $sum: 1 },
          firstEnrolledAt: { $min: "$paidAt" },
          lastEnrolledAt: { $max: "$paidAt" },
        },
      },
      { $sort: { lastEnrolledAt: -1 } },
    ];

    // Add search filter if provided
    if (search) {
      pipeline.unshift({
        $match: {
          $or: [
            { email: { $regex: search, $options: "i" } },
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    // Get total count
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await Payment.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Add pagination
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: limit });

    // Execute aggregation
    const students = await Payment.aggregate(pipeline);

    // Transform for response
    const transformedStudents = students.map((s) => ({
      id: s._id,
      email: s.email,
      fullName: `${s.firstName} ${s.lastName}`,
      firstName: s.firstName,
      lastName: s.lastName,
      phone: s.phone,
      programs: s.programs,
      programIds: s.programIds,
      totalPaid: s.totalPaid / 100, // Convert from kobo
      enrollments: s.enrollments,
      firstEnrolledAt: s.firstEnrolledAt,
      lastEnrolledAt: s.lastEnrolledAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        students: transformedStudents,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Fetch students error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

