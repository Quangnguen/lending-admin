// src/app/(admin)/admin/cases/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText, Search, CheckCircle, XCircle, Clock,
  AlertTriangle, Loader2, RefreshCw, User, Shield,
  ChevronLeft, ChevronRight, Ban, Eye, X, RotateCcw,
} from "lucide-react";

function toNum(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "object" && "$numberDecimal" in val) return parseFloat(val.$numberDecimal);
  return Number(val) || 0;
}

// ─── Loan Request types ───────────────────────────────────────────────────────

const loanStatusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:   { label: "Chờ duyệt",   color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",  icon: <Clock className="w-3.5 h-3.5" /> },
  approved:  { label: "Đã duyệt",    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",    icon: <CheckCircle className="w-3.5 h-3.5" /> },
  rejected:  { label: "Từ chối",     color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",            icon: <XCircle className="w-3.5 h-3.5" /> },
  funded:    { label: "Đã cấp vốn",  color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",        icon: <CheckCircle className="w-3.5 h-3.5" /> },
  cancelled: { label: "Đã hủy",      color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",           icon: <XCircle className="w-3.5 h-3.5" /> },
  expired:   { label: "Hết hạn",     color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",           icon: <Clock className="w-3.5 h-3.5" /> },
};

interface LoanRequest {
  _id: string;
  borrower: { fullName: string; email: string; creditScore?: number } | null;
  amount: number;
  purpose: string;
  status: string;
  interestRate: number;
  durationDays: number;
  createdAt: string;
}

// ─── KYC types ────────────────────────────────────────────────────────────────

const kycStepLabels: Record<string, string> = {
  NOT_STARTED:      "Chưa bắt đầu",
  ID_VERIFIED:      "Đã xác minh CCCD",
  FACE_VERIFIED:    "Đã xác minh khuôn mặt",
  COMPLETED:        "Hoàn tất",
  REJECTED:         "Từ chối",
  REQUIRE_REVERIFY: "Cần xác minh lại",
};

interface KycRecord {
  _id: string;
  userId: { _id: string; fullName: string; email: string } | null;
  status: string;
  idFrontUrl?: string;
  idBackUrl?: string;
  selfieUrl?: string;
  updatedAt: string;
}

// ─── ReKycModal ───────────────────────────────────────────────────────────────

function ReKycModal({
  onConfirm, onClose, loading, userName,
}: {
  onConfirm: (reason: string) => void;
  onClose: () => void;
  loading: boolean;
  userName?: string;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card-bg rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Yêu cầu xác minh lại KYC</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-background-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        {userName && (
          <p className="text-sm text-foreground-muted mb-3">
            Gửi yêu cầu xác minh lại đến{" "}
            <span className="font-medium text-foreground">{userName}</span>.
          </p>
        )}
        <p className="text-sm text-foreground-muted mb-4">
          Vui lòng nhập lý do để người dùng biết cần chỉnh sửa gì. Họ sẽ nhận được thông báo ngay.
        </p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Ví dụ: Ảnh CCCD không rõ nét, vui lòng chụp lại với ánh sáng tốt hơn..."
          rows={3}
          className="w-full px-3 py-2.5 bg-background-secondary border border-border rounded-lg text-foreground placeholder:text-foreground-subtle text-sm resize-none focus:ring-2 focus:ring-primary outline-none mb-4"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-background-secondary transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={loading || !reason.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
            Gửi yêu cầu
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CancelModal ──────────────────────────────────────────────────────────────

function CancelModal({
  request, onConfirm, onClose, loading,
}: {
  request: LoanRequest;
  onConfirm: (reason: string) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card-bg rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Hủy yêu cầu vay</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-background-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-foreground-muted mb-1">
          Hủy yêu cầu vay{" "}
          <span className="font-medium text-foreground">{toNum(request.amount).toLocaleString()} USDT</span> của{" "}
          <span className="font-medium text-foreground">{request.borrower?.fullName || "—"}</span>?
        </p>
        <p className="text-sm text-foreground-muted mb-4">Hành động này không thể hoàn tác.</p>
        <input
          type="text"
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Lý do hủy (bắt buộc)"
          className="w-full px-3 py-2.5 bg-background-secondary border border-border rounded-lg text-foreground placeholder:text-foreground-subtle text-sm focus:ring-2 focus:ring-primary outline-none mb-4"
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-background-secondary transition-colors">
            Đóng
          </button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={loading || !reason.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
            Xác nhận hủy
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type PageTab = "loans" | "kyc";

export default function AdminCasesPage() {
  const [activeTab, setActiveTab] = useState<PageTab>("loans");

  // ── Loan Requests state ──
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [loanLoading, setLoanLoading] = useState(true);
  const [loanSearch, setLoanSearch] = useState("");
  const [loanStatus, setLoanStatus] = useState("all");
  const [loanPage, setLoanPage] = useState(1);
  const [loanTotalPages, setLoanTotalPages] = useState(1);
  const [loanTotal, setLoanTotal] = useState(0);
  const [loanStats, setLoanStats] = useState<Record<string, number>>({});
  const [cancelTarget, setCancelTarget] = useState<LoanRequest | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [loanResult, setLoanResult] = useState<{ success: boolean; message: string } | null>(null);

  // ── KYC state ──
  const [kycList, setKycList] = useState<KycRecord[]>([]);
  const [kycLoading, setKycLoading] = useState(true);
  const [kycPage, setKycPage] = useState(1);
  const [kycTotalPages, setKycTotalPages] = useState(1);
  const [kycTotal, setKycTotal] = useState(0);
  const [reKycTarget, setReKycTarget] = useState<KycRecord | null>(null);
  const [reKycLoading, setReKycLoading] = useState(false);
  const [kycResult, setKycResult] = useState<{ success: boolean; message: string } | null>(null);

  const LIMIT = 20;

  // ── Fetch loan requests ──
  const fetchLoanRequests = useCallback(async () => {
    setLoanLoading(true);
    try {
      const params = new URLSearchParams({ page: String(loanPage), limit: String(LIMIT) });
      if (loanStatus !== "all") params.set("status", loanStatus);
      if (loanSearch) params.set("search", loanSearch);

      const res = await fetch(`/api/admin/loan-requests?${params}`);
      const json = await res.json();
      if (json.success) {
        // Loan API spreads backend response → json.data is the array directly,
        // json.total / json.totalPages / json.stats are top-level keys
        const raw: any[] = Array.isArray(json.data) ? json.data
          : Array.isArray(json.data?.data) ? json.data.data : [];

        setLoanRequests(raw.map((r: any) => ({
          // _id: plain hex string from MongoDB ObjectId (after JSON.stringify)
          _id: String(r._id || r.id || ""),
          borrower: r.borrowerId || r.borrower || null,
          // backend field is loanAmount (Decimal128), not amount
          amount: toNum(r.loanAmount ?? r.amount),
          purpose: r.purpose || r.purposeDescription || "—",
          status: r.status || "pending",
          interestRate: toNum(r.interestRate),
          durationDays: Number(r.durationDays) || 0,
          createdAt: r.createdAt,
        })));
        // Total/pages are top-level when API route spreads backend data
        setLoanTotal(json.total ?? json.data?.total ?? 0);
        setLoanTotalPages(json.totalPages ?? json.data?.totalPages ?? 1);
        setLoanStats(json.stats ?? json.data?.stats ?? {});
        console.debug("[Cases] Loan requests loaded:", raw.length, "first _id:", raw[0]?._id);
      }
    } catch (err) {
      console.error("[LoanRequests fetch]", err);
    } finally {
      setLoanLoading(false);
    }
  }, [loanPage, loanStatus, loanSearch]);

  // ── Fetch KYC list ──
  const fetchKyc = useCallback(async () => {
    setKycLoading(true);
    try {
      const res = await fetch(`/api/admin/kyc/pending?page=${kycPage}&limit=${LIMIT}`);
      const json = await res.json();
      if (json.success) {
        const inner = json.data?.data || json.data || [];
        setKycList(inner);
        setKycTotal(json.data?.total || 0);
        setKycTotalPages(json.data?.totalPages || 1);
      }
    } catch (err) {
      console.error("[KYC fetch]", err);
    } finally {
      setKycLoading(false);
    }
  }, [kycPage]);

  useEffect(() => { fetchLoanRequests(); }, [fetchLoanRequests]);
  useEffect(() => { fetchKyc(); }, [fetchKyc]);

  // ── Cancel loan request ──
  const handleCancelConfirm = async (reason: string) => {
    if (!cancelTarget) return;
    const reqId = cancelTarget._id;
    if (!reqId || reqId === "undefined" || reqId.length < 10) {
      setLoanResult({ success: false, message: "ID yêu cầu vay không hợp lệ. Hãy tải lại trang." });
      setCancelTarget(null);
      return;
    }
    setCancelling(true);
    try {
      const res = await fetch(`/api/admin/loan-requests/${reqId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const json = await res.json();
      if (json.success) {
        setLoanResult({ success: true, message: "Đã hủy yêu cầu vay thành công" });
        setCancelTarget(null);
        fetchLoanRequests();
      } else {
        setLoanResult({ success: false, message: json.error || "Hủy thất bại" });
      }
    } catch {
      setLoanResult({ success: false, message: "Lỗi kết nối server" });
    } finally {
      setCancelling(false);
    }
  };

  // ── Require Re-KYC ──
  const handleReKycConfirm = async (reason: string) => {
    if (!reKycTarget) return;
    // Safe userId extraction: typeof null === "object" guard
    const rawUserId = reKycTarget.userId;
    let userId: string | null = null;
    if (rawUserId && typeof rawUserId === "object") userId = rawUserId._id || null;
    else if (typeof rawUserId === "string" && rawUserId.length >= 10) userId = rawUserId;

    if (!userId) {
      setKycResult({ success: false, message: "Không lấy được ID người dùng. Hãy tải lại trang." });
      setReKycTarget(null);
      return;
    }

    setReKycLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/require-rekyc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const json = await res.json();
      if (json.success) {
        const name =
          reKycTarget.userId && typeof reKycTarget.userId === "object"
            ? reKycTarget.userId.fullName
            : "người dùng";
        setKycResult({ success: true, message: `Đã gửi yêu cầu xác minh lại đến ${name}` });
        setReKycTarget(null);
        fetchKyc();
      } else {
        setKycResult({ success: false, message: json.error || "Gửi yêu cầu thất bại" });
      }
    } catch {
      setKycResult({ success: false, message: "Lỗi kết nối server" });
    } finally {
      setReKycLoading(false);
    }
  };

  const pendingCount = loanStats["pending"] ?? loanRequests.filter(r => r.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý hồ sơ</h1>
          <p className="text-foreground-muted mt-1">Xét duyệt yêu cầu vay và kiểm tra hồ sơ KYC</p>
        </div>
        <button
          onClick={() => activeTab === "loans" ? fetchLoanRequests() : fetchKyc()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${(loanLoading || kycLoading) ? "animate-spin" : ""}`} />
          Làm mới
        </button>
      </div>

      {/* Page Tabs */}
      <div className="flex gap-1 bg-background-secondary rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab("loans")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "loans"
              ? "bg-card-bg text-foreground shadow-sm border border-border"
              : "text-foreground-muted hover:text-foreground"
          }`}
        >
          <FileText className="w-4 h-4" />
          Yêu cầu vay
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs rounded-full font-semibold">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("kyc")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "kyc"
              ? "bg-card-bg text-foreground shadow-sm border border-border"
              : "text-foreground-muted hover:text-foreground"
          }`}
        >
          <Shield className="w-4 h-4" />
          Hồ sơ KYC
          {kycTotal > 0 && (
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full font-semibold">
              {kycTotal}
            </span>
          )}
        </button>
      </div>

      {/* ── LOAN REQUESTS TAB ── */}
      {activeTab === "loans" && (
        <>
          {/* Result banner */}
          {loanResult && (
            <div className={`rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-medium ${
              loanResult.success
                ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
            }`}>
              {loanResult.success ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              {loanResult.message}
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { key: "pending",   label: "Chờ duyệt",   color: "text-amber-600" },
              { key: "approved",  label: "Đã duyệt",    color: "text-green-600" },
              { key: "funded",    label: "Đã cấp vốn",  color: "text-blue-600"  },
              { key: "cancelled", label: "Đã hủy",      color: "text-gray-500"  },
            ].map(({ key, label, color }) => (
              <div key={key} className="bg-card-bg rounded-xl border border-border p-4">
                <p className="text-xs text-foreground-subtle">{label}</p>
                <p className={`text-2xl font-bold mt-1 ${color}`}>{loanStats[key] ?? 0}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-card-bg rounded-xl border border-border p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
                <input
                  type="text"
                  value={loanSearch}
                  onChange={e => { setLoanSearch(e.target.value); setLoanPage(1); }}
                  placeholder="Tìm kiếm tên người vay, email..."
                  className="w-full pl-9 pr-4 py-2.5 bg-background-secondary border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-foreground-subtle"
                />
              </div>
              <select
                value={loanStatus}
                onChange={e => { setLoanStatus(e.target.value); setLoanPage(1); }}
                className="px-4 py-2.5 bg-background-secondary border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none text-foreground"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="funded">Đã cấp vốn</option>
                <option value="rejected">Từ chối</option>
                <option value="cancelled">Đã hủy</option>
                <option value="expired">Hết hạn</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card-bg rounded-xl border border-border overflow-hidden">
            {loanLoading ? (
              <div className="flex items-center justify-center py-16 gap-2 text-foreground-muted">
                <Loader2 className="w-5 h-5 animate-spin text-primary" /> Đang tải...
              </div>
            ) : loanRequests.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-foreground-subtle">
                <FileText className="w-12 h-12 mb-3 opacity-30" />
                <p>Không có yêu cầu vay nào</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-background-tertiary">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Người vay</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Số tiền</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Lãi suất</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Thời hạn</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Mục đích</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Trạng thái</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Ngày nộp</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loanRequests.map(req => {
                    const st = loanStatusConfig[req.status] || loanStatusConfig.pending;
                    const canCancel = req.status === "pending" || req.status === "approved";
                    return (
                      <tr key={req._id} className="hover:bg-background-tertiary transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <User className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{req.borrower?.fullName || "—"}</p>
                              <p className="text-xs text-foreground-subtle">{req.borrower?.email || ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-foreground">
                          {toNum(req.amount).toLocaleString("vi-VN")} USDT
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground-muted">{toNum(req.interestRate)}%</td>
                        <td className="px-6 py-4 text-sm text-foreground-muted">{req.durationDays} ngày</td>
                        <td className="px-6 py-4 text-sm text-foreground-muted max-w-40">
                          <p className="truncate">{req.purpose || "—"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${st.color}`}>
                            {st.icon} {st.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground-subtle">
                          {req.createdAt ? new Date(req.createdAt).toLocaleDateString("vi-VN") : "—"}
                        </td>
                        <td className="px-6 py-4">
                          {canCancel && (
                            <button
                              onClick={() => { setLoanResult(null); setCancelTarget(req); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Ban className="w-3.5 h-3.5" /> Hủy
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {loanTotalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-foreground-muted">
              <span>Hiển thị {loanRequests.length} / {loanTotal} yêu cầu</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setLoanPage(p => Math.max(1, p - 1))} disabled={loanPage === 1}
                  className="p-1.5 rounded-lg hover:bg-background-secondary disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-3">Trang {loanPage} / {loanTotalPages}</span>
                <button onClick={() => setLoanPage(p => Math.min(loanTotalPages, p + 1))} disabled={loanPage === loanTotalPages}
                  className="p-1.5 rounded-lg hover:bg-background-secondary disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── KYC TAB ── */}
      {activeTab === "kyc" && (
        <>
          {/* Result banner */}
          {kycResult && (
            <div className={`rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-medium ${
              kycResult.success
                ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
            }`}>
              {kycResult.success ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              {kycResult.message}
            </div>
          )}

          <div className="bg-card-bg rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Hồ sơ KYC đã nộp</h2>
              <p className="text-sm text-foreground-muted mt-0.5">
                Xem thông tin KYC của người dùng. Nếu thông tin không khớp, hãy gửi yêu cầu xác minh lại.
              </p>
            </div>

            {kycLoading ? (
              <div className="flex items-center justify-center py-16 gap-2 text-foreground-muted">
                <Loader2 className="w-5 h-5 animate-spin text-primary" /> Đang tải...
              </div>
            ) : kycList.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-foreground-subtle">
                <Shield className="w-12 h-12 mb-3 opacity-30" />
                <p>Không có hồ sơ KYC nào</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-background-tertiary">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Người dùng</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Trạng thái hồ sơ</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Ảnh CCCD mặt trước</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Ảnh CCCD mặt sau</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Ảnh selfie</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Cập nhật lúc</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {kycList.map(record => {
                    const user = typeof record.userId === "object" ? record.userId : null;
                    return (
                      <tr key={record._id} className="hover:bg-background-tertiary transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{user?.fullName || "—"}</p>
                              <p className="text-xs text-foreground-subtle">{user?.email || ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            <Clock className="w-3.5 h-3.5" />
                            {kycStepLabels[record.status] || record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {record.idFrontUrl ? (
                            <a href={record.idFrontUrl} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                              <Eye className="w-3.5 h-3.5" /> Xem ảnh
                            </a>
                          ) : <span className="text-xs text-foreground-subtle">—</span>}
                        </td>
                        <td className="px-6 py-4">
                          {record.idBackUrl ? (
                            <a href={record.idBackUrl} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                              <Eye className="w-3.5 h-3.5" /> Xem ảnh
                            </a>
                          ) : <span className="text-xs text-foreground-subtle">—</span>}
                        </td>
                        <td className="px-6 py-4">
                          {record.selfieUrl ? (
                            <a href={record.selfieUrl} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                              <Eye className="w-3.5 h-3.5" /> Xem ảnh
                            </a>
                          ) : <span className="text-xs text-foreground-subtle">—</span>}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground-subtle">
                          {record.updatedAt ? new Date(record.updatedAt).toLocaleString("vi-VN") : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => { setKycResult(null); setReKycTarget(record); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50 dark:text-amber-400 dark:border-amber-700 dark:hover:bg-amber-900/20 transition-colors whitespace-nowrap"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Re-KYC
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {kycTotalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-foreground-muted">
              <span>Hiển thị {kycList.length} / {kycTotal} hồ sơ</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setKycPage(p => Math.max(1, p - 1))} disabled={kycPage === 1}
                  className="p-1.5 rounded-lg hover:bg-background-secondary disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-3">Trang {kycPage} / {kycTotalPages}</span>
                <button onClick={() => setKycPage(p => Math.min(kycTotalPages, p + 1))} disabled={kycPage === kycTotalPages}
                  className="p-1.5 rounded-lg hover:bg-background-secondary disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {cancelTarget && (
        <CancelModal
          request={cancelTarget}
          onConfirm={handleCancelConfirm}
          onClose={() => setCancelTarget(null)}
          loading={cancelling}
        />
      )}
      {reKycTarget && (
        <ReKycModal
          userName={
            reKycTarget.userId && typeof reKycTarget.userId === "object"
              ? reKycTarget.userId.fullName
              : undefined
          }
          onConfirm={handleReKycConfirm}
          onClose={() => setReKycTarget(null)}
          loading={reKycLoading}
        />
      )}
    </div>
  );
}
