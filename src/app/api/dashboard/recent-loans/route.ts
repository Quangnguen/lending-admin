// src/app/api/dashboard/recent-loans/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchBackend } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.backendToken || null;

    const data = await fetchBackend("/loans/requests/pending", token);

    // Backend trả mảng trực tiếp hoặc wrapped trong ResponseBuilder
    const requests = Array.isArray(data) ? data : (data?.data || data || []);

    // Map sang format cho dashboard table (lấy 5 gần nhất)
    const recentCases = (Array.isArray(requests) ? requests : [])
      .slice(0, 5)
      .map((req: any) => ({
        id: req._id || req.id,
        borrowerName: req.borrowerId?.fullName || "Ẩn danh",
        borrowerEmail: req.borrowerId?.email || "",
        amount: req.loanAmount || 0,
        interestRate: req.interestRate || 0,
        durationDays: req.durationDays || 0,
        purpose: req.purpose || "",
        status: req.status || "PENDING",
        creditScore: req.borrowerId?.creditScore || 0,
        createdAt: req.createdAt,
      }));

    return NextResponse.json({
      success: true,
      data: recentCases,
    });
  } catch (error) {
    console.error("[Recent Loans] Error:", error);
    return NextResponse.json(
      { success: false, data: [], error: "Không thể tải dữ liệu" },
      { status: 500 }
    );
  }
}
