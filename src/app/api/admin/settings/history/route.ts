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
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    const data = await fetchBackend(`/admin/settings/history?page=${page}&limit=${limit}`, token);
    return NextResponse.json({ success: true, data: data || { data: [], total: 0 } });
  } catch (error) {
    console.error("[Admin Settings History]", error);
    return NextResponse.json({ success: false, data: { data: [], total: 0 } }, { status: 500 });
  }
}
