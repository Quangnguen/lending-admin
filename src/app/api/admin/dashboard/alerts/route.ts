import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchBackend } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.backendToken || null;
    if (!token) return NextResponse.json({ success: false, alerts: [] }, { status: 401 });

    const data = await fetchBackend("/admin/dashboard/alerts", token);
    return NextResponse.json({ success: true, ...(data || { alerts: [], total: 0 }) });
  } catch (error) {
    console.error("[Admin Alerts]", error);
    return NextResponse.json({ success: false, alerts: [], total: 0 }, { status: 500 });
  }
}
