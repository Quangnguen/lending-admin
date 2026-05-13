// src/app/api/admin/loans/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchBackend } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

function toNum(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "object" && "$numberDecimal" in val) return parseFloat(val.$numberDecimal);
  return Number(val) || 0;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.backendToken || null;

    // Lấy loan requests (pending) + loan stats + loan list
    const [pendingData, statsData] = await Promise.all([
      fetchBackend("/loans/requests/pending", token),
      fetchBackend("/loans/stats", token),
    ]);

    // Parse pending requests
    const pendingRequests = Array.isArray(pendingData) ? pendingData : (pendingData?.data || []);
    const requests = (Array.isArray(pendingRequests) ? pendingRequests : []).map((r: any) => ({
      id: r._id || r.id,
      type: "request",
      borrower: r.borrowerId?.fullName || "Ẩn danh",
      borrowerEmail: r.borrowerId?.email || "",
      lender: "—",
      amount: toNum(r.loanAmount),
      interestRate: toNum(r.interestRate),
      duration: toNum(r.durationDays),
      status: r.status || "pending",
      purpose: r.purpose || "",
      createdAt: r.createdAt,
      contractAddress: "",
      startDate: "",
      dueDate: "",
    }));

    // Stats
    const stats = statsData?.data || statsData || {};

    return NextResponse.json({
      success: true,
      data: {
        loans: requests,
        stats: {
          total: (stats.loans?.total || 0) + (stats.requests?.total || 0),
          active: stats.loans?.active || 0,
          repaid: stats.loans?.repaid || 0,
          overdue: stats.loans?.overdue || 0,
          defaulted: stats.loans?.defaulted || 0,
          pending: stats.requests?.pending || 0,
          totalValue: toNum(stats.values?.totalDisbursed),
        },
      },
    });
  } catch (error) {
    console.error("[Admin Loans] Error:", error);
    return NextResponse.json({
      success: false,
      data: { loans: [], stats: { total: 0, active: 0, repaid: 0, overdue: 0, defaulted: 0, pending: 0, totalValue: 0 } },
    }, { status: 500 });
  }
}
