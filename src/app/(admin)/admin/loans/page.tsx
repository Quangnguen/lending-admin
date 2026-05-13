// src/app/(admin)/admin/loans/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search, Filter, Eye, RefreshCw, ArrowUpDown,
  ChevronLeft, ChevronRight, DollarSign, Clock,
  CheckCircle, AlertTriangle, XCircle, Loader2, FileText,
} from "lucide-react";

function toNum(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "object" && "$numberDecimal" in val) return parseFloat(val.$numberDecimal);
  return Number(val) || 0;
}

interface Loan {
  id: string;
  borrower: string;
  borrowerEmail: string;
  lender: string;
  amount: number;
  interestRate: number;
  duration: number;
  status: string;
  purpose: string;
  createdAt: string;
  contractAddress: string;
  startDate: string;
  dueDate: string;
}

interface LoanStats {
  total: number;
  active: number;
  repaid: number;
  overdue: number;
  defaulted: number;
  pending: number;
  totalValue: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  active: { label: "Đang hoạt động", color: "bg-success-light text-success", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  repaid: { label: "Đã trả nợ", color: "bg-info-light text-info", icon: <DollarSign className="w-3.5 h-3.5" /> },
  overdue: { label: "Quá hạn", color: "bg-warning-light text-warning", icon: <Clock className="w-3.5 h-3.5" /> },
  defaulted: { label: "Vỡ nợ", color: "bg-error-light text-error", icon: <XCircle className="w-3.5 h-3.5" /> },
  liquidated: { label: "Đã thanh lý", color: "bg-error-light text-error", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  pending: { label: "Chờ duyệt", color: "bg-warning-light text-warning", icon: <Clock className="w-3.5 h-3.5" /> },
  approved: { label: "Đã duyệt", color: "bg-success-light text-success", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  funded: { label: "Đã cấp vốn", color: "bg-info-light text-info", icon: <DollarSign className="w-3.5 h-3.5" /> },
};

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [stats, setStats] = useState<LoanStats>({ total: 0, active: 0, repaid: 0, overdue: 0, defaulted: 0, pending: 0, totalValue: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/loans");
      const data = await res.json();
      if (data.success && data.data) {
        setLoans(data.data.loans || []);
        setStats(data.data.stats || stats);
      }
    } catch (err) {
      console.error("Failed to fetch loans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const matchesSearch =
        !searchQuery ||
        (loan.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.borrower.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || loan.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [loans, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý khoản vay</h1>
          <p className="text-foreground-muted mt-1">Theo dõi tất cả khoản vay trên nền tảng (dữ liệu thực)</p>
        </div>
        <button onClick={fetchData} disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium text-sm disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Tổng", value: stats.total, color: "text-foreground" },
          { label: "Chờ duyệt", value: stats.pending, color: "text-warning" },
          { label: "Đang vay", value: stats.active, color: "text-success" },
          { label: "Đã trả", value: stats.repaid, color: "text-info" },
          { label: "Quá hạn", value: stats.overdue, color: "text-warning" },
          { label: "Vỡ nợ", value: stats.defaulted, color: "text-error" },
        ].map((s) => (
          <div key={s.label} className="bg-card-bg rounded-xl p-4 border border-card-border">
            <p className="text-xs text-foreground-muted font-medium">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{loading ? "—" : s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card-bg rounded-xl p-4 border border-card-border">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <input type="text" placeholder="Tìm theo mã, người vay..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-input-bg border border-input-border rounded-lg text-foreground text-sm focus:outline-none focus:border-input-focus-border" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-input-bg border border-input-border rounded-lg text-foreground text-sm">
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="active">Đang hoạt động</option>
            <option value="repaid">Đã trả nợ</option>
            <option value="overdue">Quá hạn</option>
            <option value="defaulted">Vỡ nợ</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card-bg rounded-xl shadow-sm border border-card-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-tertiary">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Người vay</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Số tiền</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Lãi suất</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Thời hạn</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Mục đích</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Trạng thái</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-foreground-subtle">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => {
                  const st = statusConfig[loan.status] || statusConfig.pending;
                  return (
                    <tr key={loan.id} className="border-b border-border hover:bg-background-tertiary transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="text-sm font-medium text-foreground">{loan.borrower}</p>
                        <p className="text-xs text-foreground-muted">{loan.borrowerEmail}</p>
                      </td>
                      <td className="py-3.5 px-4 text-sm font-semibold text-foreground">{toNum(loan.amount).toLocaleString()} USDT</td>
                      <td className="py-3.5 px-4 text-sm text-foreground">{toNum(loan.interestRate)}%</td>
                      <td className="py-3.5 px-4 text-sm text-foreground-muted">{toNum(loan.duration)} ngày</td>
                      <td className="py-3.5 px-4 text-sm text-foreground-muted">{loan.purpose || "—"}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${st.color}`}>
                          {st.icon} {st.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-foreground-muted">
                        {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString("vi-VN") : "—"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-foreground-subtle">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p>Chưa có khoản vay nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-foreground-muted">
            Hiển thị <span className="font-medium text-foreground">{filteredLoans.length}</span> khoản vay
          </p>
        </div>
      </div>
    </div>
  );
}
