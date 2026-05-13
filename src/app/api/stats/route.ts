import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchBackend } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.backendToken || null;

    // Gọi đồng thời stats khoản vay và thông tin người dùng
    const [loanStatsRaw, usersRaw] = await Promise.all([
      fetchBackend("/loans/stats", token),
      fetchBackend("/users/?page=1&limit=1", token),
    ]);

    const stats = loanStatsRaw?.data || loanStatsRaw || {};
    const totalUsers = usersRaw?.data?.meta?.total || usersRaw?.data?.items?.length || 0;

    // Map sang cấu trúc cũ nếu cần, hoặc trả về cấu trúc mới
    return NextResponse.json({
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
        currency: "USDT",
      },
      users: {
        total: totalUsers,
        kycVerified: totalUsers, // Tạm thời map 1:1
      },
      repaymentRate: stats.repaymentRate ?? 0,
      defaultRate: stats.defaultRate ?? 0,
    });
  } catch (error) {
    console.error("[Stats API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
