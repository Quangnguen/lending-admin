// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchBackend } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.backendToken || null;

    console.log("[Admin Users] Session user:", session?.user?.email, "| Has token:", !!token);

    if (!token) {
      return NextResponse.json({
        success: false,
        error: "Không có backend token. Đăng xuất và đăng nhập lại bằng tài khoản admin.",
        data: { items: [], meta: { total: 0 } },
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "100";
    const roleFilter = searchParams.get("role");

    // 1. Lấy danh sách users
    const data = await fetchBackend(`/users/?page=${page}&limit=${limit}`, token);

    if (!data) {
      return NextResponse.json({
        success: false,
        error: "Không thể lấy dữ liệu từ backend. Token hết hạn hoặc không đủ quyền.",
        data: { items: [], meta: { total: 0 } },
      });
    }

    // 2. Lấy credit scores từ collection creditscores (1 query cho tất cả users)
    let creditScoresMap: Record<string, any> = {};
    try {
      const creditData = await fetchBackend("/credit/admin/scores", token);
      if (creditData?.success && creditData?.data) {
        creditScoresMap = creditData.data; // { userId: { score, rating, loanLimit } }
      }
    } catch (err) {
      console.warn("[Admin Users] Không thể lấy credit scores:", err);
    }

    // 3. Map và merge
    let rawItems = data?.data?.items || data?.data || [];
    if (roleFilter) {
      rawItems = rawItems.filter((u: any) => u.role?.toLowerCase() === roleFilter.toLowerCase());
    }

    const items = rawItems.map((u: any) => {
      const userId = u._id || u.id;
      const creditInfo = creditScoresMap[userId] || {};

      return {
        id: userId,
        name: u.fullName || u.email,
        email: u.email,
        phone: u.phone || "",
        role: u.role === "admin" ? "Admin" : u.role === "super_admin" ? "Admin" : u.role === "verifier" ? "Verifier" : "Borrower",
        status: u.status === "active" ? "Active" : u.status === "suspended" ? "Locked" : "Pending",
        kycStatus: u.kycStatus === "verified"
          ? "Verified"
          : u.kycStatus === "rejected"
            ? "Rejected"
            : u.kycStatus === "pending"
              ? "Pending Review"
              : "Not Started",
        // Ưu tiên điểm từ collection creditscores, fallback về field trong user
        creditScore: creditInfo.score || u.creditScore || 0,
        creditRating: creditInfo.rating || "—",
        loanLimit: creditInfo.loanLimit || 0,
        creditCalculatedAt: creditInfo.calculatedAt || null,
        balance: u.balance || 0,
        isVerified: u.isVerified || false,
        registeredDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "—",
        walletAddress: u.walletAddress || "",
      };
    });

    console.log(`[Admin Users] ✅ Trả về ${items.length} users (credit scores từ DB: ${Object.keys(creditScoresMap).length})`);

    return NextResponse.json({
      success: true,
      data: {
        items,
        meta: data?.data?.meta || { total: items.length, page: Number(page), limit: Number(limit) },
      },
    });
  } catch (error) {
    console.error("[Admin Users] Error:", error);
    return NextResponse.json({ success: false, data: { items: [], meta: { total: 0 } } }, { status: 500 });
  }
}
