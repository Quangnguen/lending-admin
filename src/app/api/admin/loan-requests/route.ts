import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchBackend } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.backendToken || null;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();
    ["page", "limit", "status", "borrowerId", "minAmount", "maxAmount"].forEach(k => {
      const v = searchParams.get(k);
      if (v) params.set(k, v);
    });

    const data = await fetchBackend(`/admin/loans/requests?${params.toString()}`, token);
    return NextResponse.json({ success: true, ...(data || { data: [], total: 0, stats: {} }) });
  } catch (error) {
    console.error("[Admin LoanRequests]", error);
    return NextResponse.json({ success: false, data: [], total: 0 }, { status: 500 });
  }
}
