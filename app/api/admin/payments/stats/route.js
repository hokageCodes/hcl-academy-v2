import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Payment from "@/lib/models/Payment";
import { requireAuth, hasRole } from "@/lib/auth";

export async function GET() {
  try {
    // Check authentication
    const { authenticated, session } = await requireAuth();

    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!hasRole(session, ["super_admin", "admin", "viewer"])) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    await connectDB();

    // Get stats using aggregation
    const stats = await Payment.aggregate([
      {
        $facet: {
          // Overall stats
          overview: [
            {
              $group: {
                _id: null,
                totalPayments: { $sum: 1 },
                totalRevenue: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0],
                  },
                },
                completedCount: {
                  $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
                },
                pendingCount: {
                  $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
                },
                failedCount: {
                  $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
                },
                abandonedCount: {
                  $sum: { $cond: [{ $eq: ["$status", "abandoned"] }, 1, 0] },
                },
              },
            },
          ],
          // By program
          byProgram: [
            { $match: { status: "completed" } },
            {
              $group: {
                _id: "$programId",
                programName: { $first: "$programName" },
                count: { $sum: 1 },
                revenue: { $sum: "$amount" },
              },
            },
            { $sort: { revenue: -1 } },
          ],
          // Recent 7 days
          recentDaily: [
            {
              $match: {
                status: "completed",
                paidAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
                },
                count: { $sum: 1 },
                revenue: { $sum: "$amount" },
              },
            },
            { $sort: { _id: 1 } },
          ],
          // Top channels
          byChannel: [
            { $match: { status: "completed", channel: { $ne: null } } },
            {
              $group: {
                _id: "$channel",
                count: { $sum: 1 },
                revenue: { $sum: "$amount" },
              },
            },
            { $sort: { count: -1 } },
          ],
        },
      },
    ]);

    const overview = stats[0].overview[0] || {
      totalPayments: 0,
      totalRevenue: 0,
      completedCount: 0,
      pendingCount: 0,
      failedCount: 0,
      abandonedCount: 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          ...overview,
          totalRevenue: overview.totalRevenue / 100, // Convert to Naira
          conversionRate: overview.totalPayments
            ? ((overview.completedCount / overview.totalPayments) * 100).toFixed(1)
            : 0,
        },
        byProgram: stats[0].byProgram.map((p) => ({
          ...p,
          revenue: p.revenue / 100,
        })),
        recentDaily: stats[0].recentDaily.map((d) => ({
          ...d,
          revenue: d.revenue / 100,
        })),
        byChannel: stats[0].byChannel.map((c) => ({
          ...c,
          revenue: c.revenue / 100,
        })),
      },
    });
  } catch (error) {
    console.error("Fetch stats error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

