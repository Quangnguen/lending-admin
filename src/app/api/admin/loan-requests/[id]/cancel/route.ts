import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchBackend } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.backendToken || null;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    // Validate ID to prevent forwarding "undefined" to the backend
    const id = params.id;
    if (!id || id === "undefined" || id === "null" || id.length < 10) {
      return NextResponse.json({ success: false, error: "ID yêu cầu vay không hợp lệ" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    if (!body.reason?.trim()) {
      return NextResponse.json({ success: false, error: "Vui lòng nhập lý do hủy" }, { status: 400 });
    }

    const data = await fetchBackend(`/admin/loans/requests/${id}/cancel`, token, {
      method: "POST",
      body: JSON.stringify({ reason: body.reason }),
    });

    return NextResponse.json(data || { success: false, error: "Backend error" });
  } catch (error) {
    console.error("[Admin Cancel Request]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
