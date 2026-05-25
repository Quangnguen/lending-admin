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

    const id = params.id;
    if (!id || id === "undefined" || id === "null" || id.length < 10) {
      return NextResponse.json({ success: false, error: "ID người dùng không hợp lệ" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const data = await fetchBackend(`/kyc/admin/approve/${id}`, token, {
      method: "POST",
      body: JSON.stringify({ note: body.note || "" }),
    });

    return NextResponse.json(data || { success: false, error: "Backend error" });
  } catch (error) {
    console.error("[Admin KYC Approve]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
