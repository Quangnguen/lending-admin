// src/app/(admin)/admin/loans/page.tsx
"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  RefreshCw,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
} from "lucide-react";

// Mock data cho demo
const mockLoans = [
  {
    id: "LOAN-001",
    borrower: "Nguyễn Văn A",
    lender: "Trần Thị B",
    amount: 1000,
    interestRate: 12,
    duration: 30,
    status: "active",
    startDate: "2026-03-15",
    dueDate: "2026-04-14",
    contractAddress: "0x742d...35Cc",
  },
  {
    id: "LOAN-002",
    borrower: "Lê Văn C",
    lender: "Phạm Thị D",
    amount: 2500,
    interestRate: 10,
    duration: 60,
    status: "active",
    startDate: "2026-03-01",
    dueDate: "2026-04-30",
    contractAddress: "0x8f3a...12Ab",
  },
  {
    id: "LOAN-003",
    borrower: "Hoàng Văn E",
    lender: "Nguyễn Thị F",
    amount: 500,
    interestRate: 15,
    duration: 14,
    status: "repaid",
    startDate: "2026-02-20",
    dueDate: "2026-03-06",
    contractAddress: "0x1a2b...89Cd",
  },
  {
    id: "LOAN-004",
    borrower: "Vũ Văn G",
    lender: "Đỗ Thị H",
    amount: 5000,
    interestRate: 8,
    duration: 90,
    status: "overdue",
    startDate: "2026-01-01",
    dueDate: "2026-04-01",
    contractAddress: "0x9c8d...67Ef",
  },
  {
    id: "LOAN-005",
    borrower: "Bùi Văn I",
    lender: "Ngô Thị K",
    amount: 800,
    interestRate: 11,
    duration: 30,
    status: "defaulted",
    startDate: "2025-12-15",
    dueDate: "2026-01-14",
    contractAddress: "0x4e5f...34Gh",
  },
  {
    id: "LOAN-006",
    borrower: "Phan Văn L",
    lender: "Mai Thị M",
    amount: 3000,
    interestRate: 9,
    duration: 45,
    status: "repaid",
    startDate: "2026-02-01",
    dueDate: "2026-03-18",
    contractAddress: "0x6b7c...56Ij",
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  active: { label: "Đang hoạt động", color: "bg-success-light text-success", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  repaid: { label: "Đã trả nợ", color: "bg-info-light text-info", icon: <DollarSign className="w-3.5 h-3.5" /> },
  overdue: { label: "Quá hạn", color: "bg-warning-light text-warning", icon: <Clock className="w-3.5 h-3.5" /> },
  defaulted: { label: "Vỡ nợ", color: "bg-error-light text-error", icon: <XCircle className="w-3.5 h-3.5" /> },
  liquidated: { label: "Đã thanh lý", color: "bg-error-light text-error", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
};

export default function LoansPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLoans = mockLoans.filter((loan) => {
    const matchesSearch =
      loan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.borrower.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.lender.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Summary stats
  const stats = {
    total: mockLoans.length,
    active: mockLoans.filter((l) => l.status === "active").length,
    repaid: mockLoans.filter((l) => l.status === "repaid").length,
    overdue: mockLoans.filter((l) => l.status === "overdue").length,
    defaulted: mockLoans.filter((l) => l.status === "defaulted").length,
    totalValue: mockLoans.reduce((sum, l) => sum + l.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý khoản vay</h1>
          <p className="text-foreground-muted mt-1">Theo dõi và quản lý tất cả khoản vay trên nền tảng</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Đồng bộ Blockchain
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-card-bg rounded-xl p-4 border border-card-border">
          <p className="text-xs text-foreground-muted font-medium">Tổng khoản vay</p>
          <p className="text-xl font-bold text-foreground mt-1">{stats.total}</p>
        </div>
        <div className="bg-card-bg rounded-xl p-4 border border-card-border">
          <p className="text-xs text-foreground-muted font-medium">Đang hoạt động</p>
          <p className="text-xl font-bold text-success mt-1">{stats.active}</p>
        </div>
        <div className="bg-card-bg rounded-xl p-4 border border-card-border">
          <p className="text-xs text-foreground-muted font-medium">Đã trả</p>
          <p className="text-xl font-bold text-info mt-1">{stats.repaid}</p>
        </div>
        <div className="bg-card-bg rounded-xl p-4 border border-card-border">
          <p className="text-xs text-foreground-muted font-medium">Quá hạn</p>
          <p className="text-xl font-bold text-warning mt-1">{stats.overdue}</p>
        </div>
        <div className="bg-card-bg rounded-xl p-4 border border-card-border">
          <p className="text-xs text-foreground-muted font-medium">Vỡ nợ</p>
          <p className="text-xl font-bold text-error mt-1">{stats.defaulted}</p>
        </div>
        <div className="bg-card-bg rounded-xl p-4 border border-card-border">
          <p className="text-xs text-foreground-muted font-medium">Tổng giá trị</p>
          <p className="text-xl font-bold text-foreground mt-1">{stats.totalValue.toLocaleString()} USDT</p>
        </div>
      </div>

      {/* Simple Chart — Loan Status Distribution */}
      <div className="bg-card-bg rounded-xl p-6 border border-card-border">
        <h3 className="text-base font-semibold text-foreground mb-4">Phân bổ trạng thái khoản vay</h3>
        <div className="flex items-end gap-3 h-40">
          {[
            { label: "Active", value: stats.active, color: "bg-success", max: stats.total },
            { label: "Repaid", value: stats.repaid, color: "bg-info", max: stats.total },
            { label: "Overdue", value: stats.overdue, color: "bg-warning", max: stats.total },
            { label: "Defaulted", value: stats.defaulted, color: "bg-error", max: stats.total },
          ].map((bar) => (
            <div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-sm font-bold text-foreground">{bar.value}</span>
              <div className="w-full bg-background-tertiary rounded-t-lg relative" style={{ height: "100px" }}>
                <div
                  className={`absolute bottom-0 w-full ${bar.color} rounded-t-lg transition-all duration-700`}
                  style={{ height: bar.max > 0 ? `${(bar.value / bar.max) * 100}%` : "0%" }}
                />
              </div>
              <span className="text-xs text-foreground-muted">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card-bg rounded-xl p-4 border border-card-border">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <input
              type="text"
              placeholder="Tìm theo mã, người vay, người cho vay..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-input-bg border border-input-border rounded-lg text-foreground text-sm focus:outline-none focus:border-input-focus-border transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-foreground-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-input-bg border border-input-border rounded-lg text-foreground text-sm focus:outline-none focus:border-input-focus-border"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="repaid">Đã trả nợ</option>
              <option value="overdue">Quá hạn</option>
              <option value="defaulted">Vỡ nợ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-card-bg rounded-xl shadow-sm border border-card-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-tertiary">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Mã <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Người vay</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Người cho vay</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Số tiền <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Lãi suất</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Thời hạn</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Trạng thái</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Hạn trả</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Contract</th>
                <th className="py-3 px-4 text-center text-xs font-medium text-foreground-muted uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => {
                const status = statusConfig[loan.status] || statusConfig.active;
                return (
                  <tr key={loan.id} className="border-b border-border hover:bg-background-tertiary transition-colors">
                    <td className="py-3.5 px-4 text-sm font-medium text-primary">{loan.id}</td>
                    <td className="py-3.5 px-4 text-sm text-foreground">{loan.borrower}</td>
                    <td className="py-3.5 px-4 text-sm text-foreground">{loan.lender}</td>
                    <td className="py-3.5 px-4 text-sm font-semibold text-foreground">{loan.amount.toLocaleString()} USDT</td>
                    <td className="py-3.5 px-4 text-sm text-foreground">{loan.interestRate}%/năm</td>
                    <td className="py-3.5 px-4 text-sm text-foreground-muted">{loan.duration} ngày</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-foreground-muted">
                      {new Date(loan.dueDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-foreground-muted">{loan.contractAddress}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        className="p-1.5 hover:bg-primary-light rounded-lg transition-colors text-foreground-muted hover:text-primary"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-foreground-muted">
            Hiển thị <span className="font-medium text-foreground">{filteredLoans.length}</span> / {mockLoans.length} khoản vay
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-border hover:bg-background-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-foreground-muted" />
            </button>
            <span className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium">{currentPage}</span>
            <button
              disabled
              className="p-2 rounded-lg border border-border hover:bg-background-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-foreground-muted" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
