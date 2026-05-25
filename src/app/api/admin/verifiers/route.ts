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
    const data = await fetchBackend("/admin/verifiers", token, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json(data || { success: false, error: "Backend error" });
  } catch (error) {
    console.error("[Admin Create Verifier]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
