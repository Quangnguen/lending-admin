// src/app/(verifier)/verifier/cases/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FileText, Search, Eye, CheckCircle, XCircle, Clock,
  Loader2, RefreshCw, Filter,
} from "lucide-react";

function toNum(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "object" && "$numberDecimal" in val) return parseFloat(val.$numberDecimal);
  return Number(val) || 0;
}

interface LoanCase {
  id: string;
  borrowerName: string;
  borrowerEmail: string;
  amount: number;
  interestRate: number;
  durationDays: number;
  purpose: string;
  status: string;
  creditScore: number;
  createdAt: string;
}

const statusBadge: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Chờ xử lý", color: "bg-warning-light text-warning", icon: <Clock className="w-3.5 h-3.5" /> },
  approved: { label: "Đã duyệt", color: "bg-success-light text-success", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  rejected: { label: "Từ chối", color: "bg-error-light text-error", icon: <XCircle className="w-3.5 h-3.5" /> },
  funded: { label: "Đã cấp vốn", color: "bg-info-light text-info", icon: <Eye className="w-3.5 h-3.5" /> },
};

export default function VerifierCasesPage() {
  const [cases, setCases] = useState<LoanCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/recent-loans");
      const data = await res.json();
      if (data.success && data.data) {
        setCases(data.data.map((r: any) => ({
          ...r,
          amount: toNum(r.amount),
          interestRate: toNum(r.interestRate),
          durationDays: toNum(r.durationDays),
          creditScore: toNum(r.creditScore),
        })));
      }
    } catch (err) {
      console.error("Failed to fetch cases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCases(); }, []);

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchFilter = filter === "all" || c.status === filter;
      const matchSearch = !search || c.borrowerName.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [cases, filter, search]);

  const counts = useMemo(() => ({
    all: cases.length,
    pending: cases.filter((c) => c.status === "pending").length,
    approved: cases.filter((c) => c.status === "approved").length,
    rejected: cases.filter((c) => c.status === "rejected").length,
  }), [cases]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hồ sơ vay — Verifier</h1>
          <p className="text-foreground-muted mt-1">
            {cases.length > 0 ? `${cases.length} hồ sơ (dữ liệu thực từ backend)` : "Xem xét và duyệt hồ sơ vay"}
          </p>
        </div>
        <button onClick={fetchCases} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-card-bg border border-card-border rounded-lg hover:bg-background-tertiary disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Làm mới
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: "Tất cả" },
          { key: "pending", label: "Chờ xử lý" },
          { key: "approved", label: "Đã duyệt" },
          { key: "rejected", label: "Từ chối" },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key ? "bg-primary text-primary-foreground" : "bg-card-bg text-foreground-muted hover:bg-background-tertiary border border-border"
            }`}>
            {tab.label} ({counts[tab.key as keyof typeof counts] || 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-card-bg rounded-xl border border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên người vay..."
            className="w-full pl-10 pr-4 py-2.5 bg-input-bg border border-input-border rounded-lg text-foreground text-sm" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card-bg rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-background-tertiary">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Người vay</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Số tiền</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Lãi suất</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Thời hạn</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Credit Score</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Trạng thái</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Ngày nộp</th>
              <th className="py-3 px-4 text-center text-xs font-medium text-foreground-muted uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={8} className="py-12 text-center text-foreground-subtle">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Đang tải...
              </td></tr>
            ) : filteredCases.length > 0 ? (
              filteredCases.map((c) => {
                const st = statusBadge[c.status] || { label: c.status, color: "bg-gray-100 text-gray-600", icon: null };
                return (
                  <tr key={c.id} className="hover:bg-background-tertiary transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-foreground">{c.borrowerName}</p>
                      <p className="text-xs text-foreground-muted">{c.borrowerEmail}</p>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{c.amount.toLocaleString()} USDT</td>
                    <td className="py-3 px-4 text-sm text-foreground">{c.interestRate}%</td>
                    <td className="py-3 px-4 text-sm text-foreground-muted">{c.durationDays} ngày</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-semibold ${c.creditScore >= 700 ? "text-success" : c.creditScore >= 500 ? "text-warning" : "text-foreground-muted"}`}>
                        {c.creditScore || "—"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${st.color}`}>
                        {st.icon} {st.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground-muted">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString("vi-VN") : "—"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 hover:bg-success-light rounded-lg text-foreground-muted hover:text-success" title="Duyệt">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-error-light rounded-lg text-foreground-muted hover:text-error" title="Từ chối">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={8} className="py-12 text-center text-foreground-subtle">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" /> Không tìm thấy hồ sơ nào
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
