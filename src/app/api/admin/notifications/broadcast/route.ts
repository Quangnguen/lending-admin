import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchBackend } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.backendToken || null;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const data = await fetchBackend("/admin/notifications/broadcast", token, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json(data || { success: false, error: "Backend error" });
  } catch (error) {
    console.error("[Admin Broadcast]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.backendToken || null;
    if (!token) return NextResponse.json({ success: false, data: { data: [], total: 0 } }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    const data = await fetchBackend(`/admin/notifications/broadcasts?page=${page}&limit=${limit}`, token);
    return NextResponse.json({ success: true, data: data || { data: [], total: 0 } });
  } catch (error) {
    console.error("[Admin Broadcasts GET]", error);
    return NextResponse.json({ success: false, data: { data: [], total: 0 } }, { status: 500 });
  }
}
