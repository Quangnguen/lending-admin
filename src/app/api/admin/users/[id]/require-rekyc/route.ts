// src/app/api/admin/users/[id]/require-rekyc/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchBackend } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: userId } = await params;
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.backendToken || null;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const reason = body.reason?.trim();

    if (!reason) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập lý do yêu cầu xác minh lại." },
        { status: 400 },
      );
    }

    // Gọi backend NestJS endpoint
    const result = await fetchBackend(`/kyc/admin/require-reverify/${userId}`, token, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("[Admin RequireReKYC] Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 },
    );
  }
}
