import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchBackend } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.backendToken || null;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();
    ["page", "limit", "action", "adminId", "from", "to", "targetType"].forEach(k => {
      const v = searchParams.get(k);
      if (v) params.set(k, v);
    });

    const [logsData, statsData] = await Promise.all([
      fetchBackend(`/admin/audit-logs?${params.toString()}`, token),
      fetchBackend("/admin/audit-logs/stats", token),
    ]);

    return NextResponse.json({
      success: true,
      data: logsData || { data: [], total: 0, page: 1, totalPages: 0 },
      stats: statsData || { totalToday: 0, loginCount: 0, approvalCount: 0, rejectionCount: 0, settingsChangeCount: 0, byAction: {} },
    });
  } catch (error) {
    console.error("[Admin AuditLogs]", error);
    return NextResponse.json({ success: false, data: { data: [], total: 0 } }, { status: 500 });
  }
}
