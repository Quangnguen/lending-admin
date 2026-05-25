import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchBackend } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.backendToken || null;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const data = await fetchBackend("/admin/settings", token);
    return NextResponse.json({ success: true, data: data || {} });
  } catch (error) {
    console.error("[Admin Settings GET]", error);
    return NextResponse.json({ success: false, data: {} }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.backendToken || null;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const data = await fetchBackend("/admin/settings", token, {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    return NextResponse.json(data || { success: false, error: "Backend error" });
  } catch (error) {
    console.error("[Admin Settings PATCH]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
