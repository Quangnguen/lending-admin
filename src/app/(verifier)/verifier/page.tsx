// src/app/(verifier)/verifier/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FileText, CheckCircle, Clock, AlertTriangle, Eye,
  Search, Loader2, RefreshCw,
} from "lucide-react";

function toNum(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "object" && "$numberDecimal" in val) return parseFloat(val.$numberDecimal);
  return Number(val) || 0;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

function StatCard({ title, value, subtitle, icon, color, loading }: StatCardProps) {
  return (
    <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground-muted font-medium">{title}</p>
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-foreground-muted mt-2" />
          ) : (
            <>
              <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
              {subtitle && <p className="text-sm text-foreground-muted mt-1">{subtitle}</p>}
            </>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
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

const statusBadge: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xử lý", color: "bg-warning-light text-warning" },
  approved: { label: "Đã duyệt", color: "bg-success-light text-success" },
  rejected: { label: "Từ chối", color: "bg-error-light text-error" },
  funded: { label: "Đã cấp vốn", color: "bg-info-light text-info" },
};

export default function VerifierDashboard() {
  const { data: session } = useSession();
  const [cases, setCases] = useState<LoanCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
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
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const pending = cases.filter((c) => c.status === "pending").length;
  const approved = cases.filter((c) => c.status === "approved" || c.status === "funded").length;

  const filteredCases = cases.filter((c) =>
    !search || c.borrowerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Verifier Dashboard</h1>
          <p className="text-foreground-muted mt-1">
            Xin chào, {session?.user?.name || "Verifier"} — Xem xét hồ sơ vay (dữ liệu thực)
          </p>
        </div>
        <button onClick={fetchData} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-card-bg border border-card-border rounded-lg hover:bg-background-tertiary disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Làm mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Tổng hồ sơ" value={cases.length} icon={<FileText className="w-6 h-6 text-info" />} color="bg-info-light" loading={loading} />
        <StatCard title="Chờ xử lý" value={pending} icon={<Clock className="w-6 h-6 text-warning" />} color="bg-warning-light" loading={loading} />
        <StatCard title="Đã duyệt" value={approved} icon={<CheckCircle className="w-6 h-6 text-success" />} color="bg-success-light" loading={loading} />
        <StatCard title="Cần xem xét" value={pending} subtitle="Yêu cầu cần action" icon={<AlertTriangle className="w-6 h-6 text-error" />} color="bg-error-light" loading={loading} />
      </div>

      {/* Search */}
      <div className="bg-card-bg rounded-xl border border-card-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm hồ sơ..."
            className="w-full pl-10 pr-4 py-2.5 bg-input-bg border border-input-border rounded-lg text-foreground text-sm focus:outline-none focus:border-input-focus-border" />
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-card-bg rounded-xl border border-card-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Hồ sơ vay cần xem xét</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-tertiary">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Người vay</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Số tiền</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Lãi suất</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Mục đích</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Credit Score</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Trạng thái</th>
                <th className="py-3 px-4 text-center text-xs font-medium text-foreground-muted uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center text-foreground-subtle">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Đang tải...
                </td></tr>
              ) : filteredCases.length > 0 ? (
                filteredCases.map((c) => {
                  const st = statusBadge[c.status] || { label: c.status, color: "bg-gray-100 text-gray-600" };
                  return (
                    <tr key={c.id} className="border-b border-border hover:bg-background-tertiary transition-colors">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-foreground">{c.borrowerName}</p>
                        <p className="text-xs text-foreground-muted">{c.borrowerEmail}</p>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-foreground">{c.amount.toLocaleString()} USDT</td>
                      <td className="py-3 px-4 text-sm text-foreground">{c.interestRate}%</td>
                      <td className="py-3 px-4 text-sm text-foreground-muted">{c.purpose || "—"}</td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-semibold ${c.creditScore >= 700 ? "text-success" : c.creditScore >= 500 ? "text-warning" : "text-foreground-muted"}`}>
                          {c.creditScore || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button className="p-1.5 hover:bg-primary-light rounded-lg transition-colors text-foreground-muted hover:text-primary">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={7} className="py-12 text-center text-foreground-subtle">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" /> Chưa có hồ sơ nào
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
