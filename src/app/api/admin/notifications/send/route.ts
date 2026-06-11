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
    if (!body.title?.trim() || !body.message?.trim()) {
      return NextResponse.json({ success: false, error: "Tiêu đề và nội dung không được để trống" }, { status: 400 });
    }

    const data = await fetchBackend("/notifications/admin/send", token, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json(data || { success: false, error: "Backend error" });
  } catch (error) {
    console.error("[Admin Send Notification]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
