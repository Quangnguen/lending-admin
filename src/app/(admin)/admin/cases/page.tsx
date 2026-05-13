// src/app/(admin)/admin/cases/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FileText, Search, Eye, CheckCircle, XCircle, Clock,
  AlertTriangle, Loader2, RefreshCw,
} from "lucide-react";

function toNum(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "object" && "$numberDecimal" in val) return parseFloat(val.$numberDecimal);
  return Number(val) || 0;
}

type CaseStatus = "all" | "pending" | "approved" | "rejected" | "funded" | "cancelled";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: <Clock className="w-3.5 h-3.5" /> },
  approved: { label: "Đã duyệt", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  rejected: { label: "Từ chối", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: <XCircle className="w-3.5 h-3.5" /> },
  funded: { label: "Đã cấp vốn", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: <Eye className="w-3.5 h-3.5" /> },
  cancelled: { label: "Đã hủy", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400", icon: <XCircle className="w-3.5 h-3.5" /> },
};

interface LoanCase {
  id: string;
  borrower: string;
  borrowerEmail: string;
  amount: number;
  purpose: string;
  status: string;
  creditScore: number;
  createdAt: string;
  interestRate: number;
  durationDays: number;
}

export default function AdminCasesPage() {
  const [cases, setCases] = useState<LoanCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CaseStatus>("all");
  const [search, setSearch] = useState("");

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/recent-loans");
      const data = await res.json();
      if (data.success && data.data) {
        setCases(data.data.map((r: any) => ({
          id: r.id,
          borrower: r.borrowerName,
          borrowerEmail: r.borrowerEmail,
          amount: toNum(r.amount),
          purpose: r.purpose,
          status: r.status,
          creditScore: toNum(r.creditScore),
          createdAt: r.createdAt,
          interestRate: toNum(r.interestRate),
          durationDays: toNum(r.durationDays),
        })));
      }
    } catch (err) {
      console.error("Failed to fetch cases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCases(); }, []);

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const matchStatus = filter === "all" || c.status === filter;
      const matchSearch = !search ||
        c.borrower.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [cases, filter, search]);

  const counts = useMemo(() => ({
    all: cases.length,
    pending: cases.filter((c) => c.status === "pending").length,
    approved: cases.filter((c) => c.status === "approved").length,
    funded: cases.filter((c) => c.status === "funded").length,
    rejected: cases.filter((c) => c.status === "rejected").length,
    cancelled: cases.filter((c) => c.status === "cancelled").length,
  }), [cases]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hồ sơ vay</h1>
          <p className="text-foreground-muted mt-1">
            {cases.length > 0 ? `${cases.length} hồ sơ vay (dữ liệu thực)` : "Quản lý tất cả hồ sơ vay"}
          </p>
        </div>
        <button onClick={fetchCases} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-card-bg border border-card-border rounded-lg hover:bg-background-tertiary transition-colors disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Làm mới
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "approved", "funded", "rejected"] as CaseStatus[]).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === s ? "bg-primary text-primary-foreground" : "bg-card-bg text-foreground-muted hover:bg-background-tertiary border border-border"
            }`}>
            {s === "all" ? "Tất cả" : statusConfig[s]?.label || s} ({counts[s] || 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-card-bg rounded-xl border border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-subtle" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo mã hồ sơ, tên người vay..."
            className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-foreground" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card-bg rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-background-tertiary">
              <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Người vay</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Số tiền</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Lãi suất</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Thời hạn</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Mục đích</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Điểm tín dụng</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Trạng thái</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Ngày nộp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={8} className="py-12 text-center text-foreground-subtle">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Đang tải...
              </td></tr>
            ) : filtered.length > 0 ? (
              filtered.map((c) => {
                const st = statusConfig[c.status] || statusConfig.pending;
                return (
                  <tr key={c.id} className="hover:bg-background-tertiary transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground">{c.borrower}</p>
                      <p className="text-xs text-foreground-muted">{c.borrowerEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{c.amount.toLocaleString()} USDT</td>
                    <td className="px-6 py-4 text-sm text-foreground">{c.interestRate}%</td>
                    <td className="px-6 py-4 text-sm text-foreground-muted">{c.durationDays} ngày</td>
                    <td className="px-6 py-4 text-sm text-foreground-muted">{c.purpose || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${c.creditScore >= 700 ? "text-green-600" : c.creditScore >= 600 ? "text-yellow-600" : "text-foreground-muted"}`}>
                        {c.creditScore || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${st.color}`}>
                        {st.icon} {st.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground-muted">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString("vi-VN") : "—"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={8} className="text-center py-12 text-foreground-subtle">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" /> Không tìm thấy hồ sơ nào
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
