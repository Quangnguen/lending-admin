// src/app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchBackend } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Lấy session (bao gồm backendToken) từ NextAuth
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.backendToken || null;

    if (!token) {
      console.warn("[Dashboard Stats] Không có backend token trong session");
    }

    // Gọi API backend với JWT token
    const [loanStatsRaw, usersRaw] = await Promise.all([
      fetchBackend("/loans/stats", token),
      fetchBackend("/users/?page=1&limit=1", token),
    ]);

    // Debug: log raw responses
    console.log("[Dashboard Stats] loanStatsRaw:", JSON.stringify(loanStatsRaw, null, 2));
    console.log("[Dashboard Stats] usersRaw keys:", usersRaw ? Object.keys(usersRaw) : "null");

    // Backend response: getLoanStats() trả raw object (không qua ResponseBuilder)
    // Nhưng vẫn cần handle cả 2 trường hợp
    const stats = loanStatsRaw?.data || loanStatsRaw || {};
    const totalUsers = usersRaw?.data?.meta?.total || usersRaw?.data?.items?.length || 0;

    console.log("[Dashboard Stats] Parsed stats:", JSON.stringify(stats, null, 2));
    console.log("[Dashboard Stats] totalUsers:", totalUsers);

    return NextResponse.json({
      success: true,
      hasToken: !!token,
      data: {
        requests: {
          total: stats.requests?.total ?? 0,
          pending: stats.requests?.pending ?? 0,
          funded: stats.requests?.funded ?? 0,
        },
        loans: {
          total: stats.loans?.total ?? 0,
          active: stats.loans?.active ?? 0,
          repaid: stats.loans?.repaid ?? 0,
          overdue: stats.loans?.overdue ?? 0,
          defaulted: stats.loans?.defaulted ?? 0,
        },
        values: {
          totalDisbursed: stats.values?.totalDisbursed ?? 0,
          totalInterest: stats.values?.totalInterest ?? 0,
          totalRepaid: stats.values?.totalRepaid ?? 0,
        },
        repaymentRate: stats.repaymentRate ?? 0,
        defaultRate: stats.defaultRate ?? 0,
        totalUsers,
      },
    });
  } catch (error) {
    console.error("[Dashboard Stats] Error:", error);
    return NextResponse.json(
      { success: false, data: null, error: "Không thể tải dữ liệu" },
      { status: 500 }
    );
  }
}
