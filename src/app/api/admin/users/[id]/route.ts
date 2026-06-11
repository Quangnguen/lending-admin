// src/app/api/admin/users/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchBackend } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

function toNum(val: any): number {
  if (val == null) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "string") return parseFloat(val) || 0;
  if (val.$numberDecimal) return parseFloat(val.$numberDecimal) || 0;
  return 0;
}

function fmtDate(d: any): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("vi-VN");
}

function fmtTime(d: any): string {
  if (!d) return "—";
  return new Date(d).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await params;
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.backendToken || null;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Admin User Detail] userId:", userId);


    // 1. Fetch user info
    let rawUser: any = null;
    try {
      const userData = await fetchBackend(`/users/${userId}`, token);
      if (userData && userData.data) {
        rawUser = userData.data;
      }
    } catch (e) {
      console.warn("[Admin User Detail] Lỗi khi gọi /users/:id:", e);
    }

    // Fallback: Nếu không tìm thấy, thử tìm trong danh sách
    if (!rawUser || (!rawUser._id && !rawUser.id && !rawUser.email)) {
      console.log("[Admin User Detail] Fallback tìm trong danh sách users...");
      const usersData = await fetchBackend(`/users/?page=1&limit=1000`, token);
      const rawUsers = usersData?.data?.items || usersData?.data || [];
      rawUser = rawUsers.find((u: any) => (u._id || u.id) === userId);
    }

    if (!rawUser) {
      return NextResponse.json({ success: false, error: "User không tồn tại (Không tìm thấy trong DB)" }, { status: 404 });
    }

    // 2. Fetch credit score từ creditscores collection
    let creditScore = 0, creditRating = "UNRATED", loanLimit = 0, creditCalcAt = null;
    try {
      const creditData = await fetchBackend(`/credit/admin/score/${userId}`, token);
      console.log("[Admin User Detail] Credit response:", JSON.stringify(creditData));
      if (creditData?.success && creditData?.data) {
        creditScore = creditData.data.score || 0;
        creditRating = creditData.data.rating || "UNRATED";
        loanLimit = creditData.data.loanLimit || 0;
        creditCalcAt = creditData.data.calculatedAt || null;
      } else if (creditData?.data) {
        // Backend có thể trả về trực tiếp không wrap trong {success, data}
        creditScore = creditData.data.score || creditData.score || 0;
        creditRating = creditData.data.rating || creditData.rating || "UNRATED";
        loanLimit = creditData.data.loanLimit || creditData.loanLimit || 0;
        creditCalcAt = creditData.data.calculatedAt || creditData.calculatedAt || null;
      } else if (creditData?.score) {
        // Trường hợp backend trả về flat object
        creditScore = creditData.score || 0;
        creditRating = creditData.rating || "UNRATED";
        loanLimit = creditData.loanLimit || 0;
        creditCalcAt = creditData.calculatedAt || null;
      }
    } catch (e: any) {
      console.error("[Admin User Detail] Credit score fetch error:", e?.message || e);
    }
    console.log("[Admin User Detail] Final creditScore:", creditScore, "rating:", creditRating);

    // 3b. Fetch KYC record đầy đủ (OCR data + ảnh)
    let kycRecord: any = null;
    try {
      const kycData = await fetchBackend(`/kyc/admin/details/${userId}`, token);
      console.log("[KYC DEBUG] Raw kycData:", JSON.stringify(kycData));
      console.log("[KYC DEBUG] kycData type:", typeof kycData);
      console.log("[KYC DEBUG] kycData keys:", kycData ? Object.keys(kycData) : "NULL");
      console.log("[KYC DEBUG] frontIdImageUrl:", kycData?.frontIdImageUrl);
      console.log("[KYC DEBUG] status:", kycData?.status);
      if (kycData) kycRecord = kycData;
    } catch (e) {
      console.warn("[Admin User Detail] KYC details fetch error:", e);
    }
    console.log("[KYC DEBUG] Final kycRecord:", JSON.stringify(kycRecord));

    // 3. Fetch loans của user — dùng admin endpoint để lấy đúng user, không phải admin
    let allLoans: any[] = [];
    let activeLoans: any[] = [];
    let loanSummary = { totalBorrowed: 0, totalRepaid: 0, outstanding: 0 };
    try {
      const loansData = await fetchBackend(`/loans/admin/user/${userId}/loans`, token);
      const rawLoans = Array.isArray(loansData) ? loansData : (loansData?.data || []);
      if (Array.isArray(rawLoans)) {
        allLoans = rawLoans;

        activeLoans = allLoans
          .filter((l: any) => l.status === "active" || l.status === "overdue")
          .slice(0, 5)
          .map((l: any) => ({
            id: l._id,
            amount: toNum(l.principalAmount),
            interestRate: toNum(l.interestRate),
            startDate: fmtDate(l.startDate || l.createdAt),
            nextPayment: fmtDate(l.dueDate),
            status: l.status === "active" ? "Active" : l.status === "overdue" ? "Overdue" : "Paid Off",
          }));

        loanSummary.totalBorrowed = allLoans.reduce((s, l) => s + toNum(l.principalAmount), 0);
        loanSummary.totalRepaid = allLoans.reduce((s, l) => s + toNum(l.amountPaid), 0);
        loanSummary.outstanding = allLoans.reduce((s, l) => s + toNum(l.remainingAmount || 0), 0);
      }
    } catch (_e) { /* loans optional */ }

    // 4. Fetch loan requests của user — dùng admin endpoint
    let loanRequests: any[] = [];
    try {
      const reqData = await fetchBackend(`/loans/admin/user/${userId}/requests`, token);
      const rawReqs = Array.isArray(reqData) ? reqData : (reqData?.data || []);
      if (Array.isArray(rawReqs)) {
        loanRequests = rawReqs;
      }
    } catch (_e) { /* requests optional */ }

    // 5. Fetch transactions của user — dùng admin endpoint
    let transactions: any[] = [];
    try {
      const txData = await fetchBackend(`/loans/admin/user/${userId}/transactions`, token);
      const rawTx = Array.isArray(txData) ? txData : (txData?.data || []);
      if (Array.isArray(rawTx)) {
        transactions = rawTx.slice(0, 10);
      }
    } catch (_e) { /* tx optional */ }

    // Kết hợp loans + requests cho loanHistory
    const loanHistory = [
      ...allLoans.slice(0, 3).map((l: any) => ({
        id: l._id,
        amount: toNum(l.principalAmount),
        date: fmtDate(l.createdAt),
        status: l.status === "active" ? "Active" : l.status === "repaid" ? "Paid Off" : l.status === "overdue" ? "Overdue" : "Active",
        progress: l.totalAmount > 0 ? Math.min(100, Math.round((toNum(l.amountPaid) / toNum(l.totalAmount)) * 100)) : 0,
      })),
      ...loanRequests.slice(0, 2).map((r: any) => ({
        id: r._id,
        amount: toNum(r.loanAmount),
        date: fmtDate(r.createdAt),
        status: r.status === "funded" ? "Active" : r.status === "pending" ? "Active" : "Active",
        progress: 0,
      })),
    ].slice(0, 5);

    const loanDetails = [
      ...allLoans.map((l: any) => ({
        id: l._id,
        principalAmount: toNum(l.principalAmount),
        interestRate: toNum(l.interestRate),
        startDate: fmtDate(l.startDate || l.createdAt),
        nextPayment: fmtDate(l.dueDate),
        nextPaymentLate: l.status === "overdue",
        status: l.status === "active" ? "Active" : l.status === "overdue" ? "Overdue" : l.status === "repaid" ? "Paid Off" : "Active" as any,
      })),
      ...loanRequests.map((r: any) => ({
        id: r._id,
        principalAmount: toNum(r.loanAmount),
        interestRate: toNum(r.interestRate),
        startDate: fmtDate(r.createdAt),
        nextPayment: "—",
        status: "Pending" as any,
      })),
    ];

    const recentTransactions = transactions.slice(0, 5).map((tx: any) => ({
      id: tx._id,
      type: tx.type === "PAYMENT" ? "Repayment" : "Disbursed",
      amount: toNum(tx.amount),
      date: fmtDate(tx.date),
      time: fmtTime(tx.date),
      description: tx.type === "PAYMENT" ? "Thanh toán trả nợ" : "Nhận tiền",
    }));

    const transactionHistory = transactions.map((tx: any) => ({
      id: tx._id,
      type: tx.type === "PAYMENT" ? "Repayment" : "Loan Disbursement" as any,
      subText: tx.loanInfo ? `Loan #${tx.loanInfo._id?.slice(-6)}` : "—",
      loanId: tx.loanInfo?._id,
      date: fmtDate(tx.date),
      time: fmtTime(tx.date),
      method: "crypto" as const,
      methodHash: tx.txHash ? `${tx.txHash.slice(0, 6)}...${tx.txHash.slice(-4)}` : "—",
      status: tx.status === "COMPLETED" ? "Completed" : "Pending" as any,
      amount: toNum(tx.amount),
    }));

    // 6. Map sang UserDetail
    const kycStatusRaw = rawUser.kycStatus || "not_started";
    const kycStatus = kycStatusRaw === "verified" ? "Verified"
      : kycStatusRaw === "rejected" ? "Rejected"
        : kycStatusRaw === "pending" ? "Pending Review"
          : "N/A (Internal)";

    // Fallback credit score từ user model khi credit service trả 0
    const effectiveCreditScore = creditScore > 0 ? creditScore : (toNum(rawUser.creditScore) || 0);

    // Map status: user model có active/suspended/banned
    const statusMap: Record<string, string> = {
      active: "Active",
      suspended: "Suspended",
      banned: "Suspended", // banned cũng hiển thị Suspended ở FE (Locked là UI state)
    };
    const mappedStatus = statusMap[rawUser.status] || "Pending";

    // totalBorrowed: ưu tiên tính từ loans thực tế, fallback sang user.totalBorrowed
    const effectiveTotalBorrowed = loanSummary.totalBorrowed > 0
      ? loanSummary.totalBorrowed
      : toNum(rawUser.totalBorrowed);

    // personalDetails: ưu tiên user model, fallback KYC OCR data
    const kycDob = kycRecord?.idInfo?.dob || null;
    const kycNationality = kycRecord?.idInfo?.nationality || null;
    const kycAddress = kycRecord?.idInfo?.address || null;

    const userDetail = {
      id: userId,
      name: rawUser.fullName || rawUser.email,
      email: rawUser.email,
      role: rawUser.role === "admin" || rawUser.role === "super_admin" ? "Admin" : rawUser.role === "verifier" ? "Verifier" : "Borrower",
      status: mappedStatus,
      kycStatus,
      kycLevel: kycStatusRaw === "verified" ? 3 : kycStatusRaw === "pending" ? 2 : 1,
      registeredDate: fmtDate(rawUser.createdAt),
      isHighRisk: rawUser.isHighRisk || false,
      creditScore: effectiveCreditScore,
      creditRating,
      loanLimit,
      creditCalculatedAt: creditCalcAt,
      personalDetails: {
        fullName: rawUser.fullName || rawUser.email,
        phone: rawUser.phone || "—",
        dateOfBirth: rawUser.dateOfBirth
          ? fmtDate(rawUser.dateOfBirth)
          : kycDob || "—",
        nationality: rawUser.nationality || rawUser.country || kycNationality || "Việt Nam",
        address: rawUser.address || kycAddress || "—",
      },
      stats: {
        totalBorrowed: effectiveTotalBorrowed,
        activeLoans: activeLoans.length,
        totalLoans: allLoans.length + loanRequests.length,
        nextPaymentDays: (() => {
          const activeLoan = allLoans.find((l: any) => l.status === "active" || l.status === "overdue");
          if (!activeLoan?.dueDate) return 0;
          const diff = Math.ceil((new Date(activeLoan.dueDate).getTime() - Date.now()) / 86400000);
          return diff > 0 ? diff : 0;
        })(),
        riskScore: effectiveCreditScore > 0 ? Math.round((effectiveCreditScore / 1000) * 100) : 0,
        riskLevel: effectiveCreditScore === 0 ? "N/A" : effectiveCreditScore >= 700 ? "Low" : effectiveCreditScore >= 500 ? "Medium" : "High",
        percentile: effectiveCreditScore > 0 ? Math.round((effectiveCreditScore / 1000) * 100) : 0,
      },
      kycDetails: {
        lastUpdated: kycRecord?.completedAt
          ? fmtDate(kycRecord.completedAt)
          : rawUser.kycVerifiedAt
            ? fmtDate(rawUser.kycVerifiedAt)
            : fmtDate(rawUser.updatedAt),
        identityVerified: kycStatusRaw === "verified" || kycRecord?.status === "COMPLETED",
        identityMethod: (kycStatusRaw === "verified" || kycRecord?.status === "COMPLETED")
          ? (kycRecord?.idInfo?.type === "CMND" ? "CMND" : "CCCD")
          : undefined,
        addressVerified: kycStatusRaw === "verified" || kycRecord?.status === "COMPLETED",
        addressMethod: (kycStatusRaw === "verified" || kycRecord?.status === "COMPLETED")
          ? "Đã xác minh địa chỉ"
          : undefined,
        videoInterview: false,
        videoNote: "Không yêu cầu",
        // ── Dữ liệu OCR từ CCCD ──
        idNumber: kycRecord?.idInfo?.id || null,
        fullName: kycRecord?.idInfo?.name || null,
        dob: kycRecord?.idInfo?.dob || null,
        sex: kycRecord?.idInfo?.sex || null,
        nationality: kycRecord?.idInfo?.nationality || null,
        home: kycRecord?.idInfo?.home || null,
        address: kycRecord?.idInfo?.address || null,
        doe: kycRecord?.idInfo?.doe || null,
        issueDate: kycRecord?.idInfo?.issue_date || null,
        issueLoc: kycRecord?.idInfo?.issue_loc || null,
        idType: kycRecord?.idInfo?.type || null,
        features: kycRecord?.idInfo?.features || null,
        // ── Ảnh ──
        frontIdImageUrl: kycRecord?.frontIdImageUrl || null,
        backIdImageUrl: kycRecord?.backIdImageUrl || null,
        selfieImageUrl: kycRecord?.selfieImageUrl || null,
        faceMatchScore: kycRecord?.faceMatchScore || null,
        // ── Re-KYC ──
        kycStatus: kycRecord?.status || null,
        reKycReason: kycRecord?.reKycReason || null,
        reKycRequestedAt: kycRecord?.reKycRequestedAt ? fmtDate(kycRecord.reKycRequestedAt) : null,
      },
      kycVerificationItems: [
        {
          id: "kyc-1",
          type: "identity",
          title: "Giấy tờ tùy thân",
          method: "CCCD / Hộ chiếu",
          detail: kycStatusRaw === "verified" ? "Đã xác minh" : "Chưa xác minh",
          verified: kycStatusRaw === "verified",
          verifiedDate: rawUser.kycVerifiedAt ? fmtDate(rawUser.kycVerifiedAt) : undefined,
        },
        {
          id: "kyc-2",
          type: "face",
          title: "Xác minh khuôn mặt",
          method: "Ảnh selfie",
          detail: kycStatusRaw === "verified" ? "Đã khớp ảnh" : "Chưa xác minh",
          verified: kycStatusRaw === "verified",
          verifiedDate: rawUser.kycVerifiedAt ? fmtDate(rawUser.kycVerifiedAt) : undefined,
        },
      ],
      uploadedDocuments: [
        ...(kycRecord?.frontIdImageUrl ? [{
          id: "doc-front",
          type: "id_front",
          name: "CCCD/CMND Mặt trước",
          url: kycRecord.frontIdImageUrl,
          uploadedAt: kycRecord?.completedAt ? fmtDate(kycRecord.completedAt) : "—",
        }] : []),
        ...(kycRecord?.backIdImageUrl ? [{
          id: "doc-back",
          type: "id_back",
          name: "CCCD/CMND Mặt sau",
          url: kycRecord.backIdImageUrl,
          uploadedAt: kycRecord?.completedAt ? fmtDate(kycRecord.completedAt) : "—",
        }] : []),
        ...(kycRecord?.selfieImageUrl ? [{
          id: "doc-selfie",
          type: "selfie",
          name: "Ảnh selfie xác thực",
          url: kycRecord.selfieImageUrl,
          uploadedAt: kycRecord?.completedAt ? fmtDate(kycRecord.completedAt) : "—",
        }] : []),
      ],
      activeLoans,
      loanDetails,
      loanSummary,
      loanHistory,
      recentTransactions,
      transactionHistory,
      supportCases: [],
      activityLogs: [
        {
          id: "LOG-REG",
          action: "Đăng ký tài khoản",
          category: "account",
          details: `Tạo tài khoản với email ${rawUser.email}`,
          performedBy: "User",
          date: fmtDate(rawUser.createdAt),
          time: fmtTime(rawUser.createdAt),
        },
        ...(kycStatusRaw === "verified" ? [{
          id: "LOG-KYC",
          action: "KYC được duyệt",
          category: "kyc",
          details: "Admin xác thực danh tính thành công",
          performedBy: "Admin",
          date: fmtDate(rawUser.kycVerifiedAt || rawUser.updatedAt),
          time: fmtTime(rawUser.kycVerifiedAt || rawUser.updatedAt),
        }] : []),
      ],
    };

    return NextResponse.json({ success: true, data: userDetail });
  } catch (error) {
    console.error("[Admin UserDetail] Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
