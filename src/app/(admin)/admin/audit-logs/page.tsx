"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ClipboardList, Search, Calendar, User, Shield,
  Settings, LogIn, LogOut, FileText, ChevronLeft,
  ChevronRight, RefreshCw, CheckCircle, XCircle,
} from "lucide-react";

interface AuditLog {
  _id: string;
  adminId: { fullName: string; email: string; role: string } | string;
  actionType: string;
  targetType: string;
  targetId: string;
  reason: string;
  ipAddress: string;
  oldValue: any;
  newValue: any;
  createdAt: string;
}

interface Stats {
  totalToday: number;
  loginCount: number;
  approvalCount: number;
  rejectionCount: number;
  settingsChangeCount: number;
  byAction: Record<string, number>;
}

const ACTION_COLORS: Record<string, string> = {
  APPROVE_KYC:   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  REJECT_KYC:    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  APPROVE_LOAN:  "bg-green-100 text-green-700",
  REJECT_LOAN:   "bg-red-100 text-red-700",
  UPDATE_SETTINGS: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  CANCEL_LOAN_REQUEST: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  BROADCAST_NOTIFICATION: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  CREATE_VERIFIER: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  LOGIN:  "bg-blue-100 text-blue-700",
  LOGOUT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  DEFAULT:"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

const ACTION_LABELS: Record<string, string> = {
  APPROVE_KYC:    "Duyệt KYC",
  REJECT_KYC:     "Từ chối KYC",
  CANCEL_LOAN_REQUEST: "Hủy y/c vay",
  UPDATE_SETTINGS: "Cập nhật cài đặt",
  BROADCAST_NOTIFICATION: "Gửi thông báo",
  CREATE_VERIFIER: "Tạo verifier",
  LOGIN:  "Đăng nhập",
  LOGOUT: "Đăng xuất",
};

function getActionIcon(action: string) {
  if (action.includes("APPROVE")) return <CheckCircle className="w-3.5 h-3.5" />;
  if (action.includes("REJECT") || action.includes("CANCEL")) return <XCircle className="w-3.5 h-3.5" />;
  if (action.includes("SETTINGS")) return <Settings className="w-3.5 h-3.5" />;
  if (action === "LOGIN") return <LogIn className="w-3.5 h-3.5" />;
  if (action === "LOGOUT") return <LogOut className="w-3.5 h-3.5" />;
  return <FileText className="w-3.5 h-3.5" />;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalToday: 0, loginCount: 0, approvalCount: 0,
    rejectionCount: 0, settingsChangeCount: 0, byAction: {},
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
      if (actionFilter !== "all") params.set("action", actionFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setLogs(json.data?.data || []);
        setTotal(json.data?.total || 0);
        setTotalPages(json.data?.totalPages || 1);
        setStats(json.stats || stats);
      }
    } catch (err) {
      console.error("[AuditLogs]", err);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, actionFilter, search]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const getAdminName = (adminId: any) => {
    if (!adminId) return "—";
    if (typeof adminId === "object") return adminId.fullName || adminId.email || "Admin";
    return String(adminId).slice(-8);
  };

  const getAdminEmail = (adminId: any) => {
    if (!adminId) return "";
    if (typeof adminId === "object") return adminId.email || "";
    return "";
  };

  const getActionLabel = (action: string) =>
    ACTION_LABELS[action] || action.replace(/_/g, " ");

  const getActionColor = (action: string) =>
    ACTION_COLORS[action] || ACTION_COLORS.DEFAULT;

  const buildDescription = (log: AuditLog) => {
    if (log.reason) return log.reason;
    if (log.newValue) {
      const keys = Object.keys(log.newValue);
      if (keys.length > 0) return `→ ${keys.slice(0, 2).join(", ")}`;
    }
    return `${log.targetType || ""} ${String(log.targetId || "").slice(-6) || ""}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nhật ký hệ thống</h1>
          <p className="text-foreground-muted mt-1">
            Theo dõi toàn bộ hành động của Admin / Verifier
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Hôm nay", value: stats.totalToday, color: "text-foreground" },
          { label: "Đăng nhập", value: stats.loginCount, color: "text-blue-600" },
          { label: "Duyệt / Từ chối", value: stats.approvalCount + stats.rejectionCount, color: "text-green-600" },
          { label: "Thay đổi cài đặt", value: stats.settingsChangeCount, color: "text-purple-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card-bg rounded-xl border border-border p-4">
            <p className="text-sm text-foreground-subtle">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card-bg rounded-xl border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-subtle" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm kiếm theo lý do, mã target..."
              className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-foreground-subtle"
            />
          </div>
          <select
            value={actionFilter}
            onChange={e => { setActionFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground"
          >
            <option value="all">Tất cả hành động</option>
            <option value="APPROVE_KYC">Duyệt KYC</option>
            <option value="REJECT_KYC">Từ chối KYC</option>
            <option value="CANCEL_LOAN_REQUEST">Hủy yêu cầu vay</option>
            <option value="UPDATE_SETTINGS">Cập nhật cài đặt</option>
            <option value="BROADCAST_NOTIFICATION">Gửi thông báo</option>
            <option value="CREATE_VERIFIER">Tạo Verifier</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card-bg rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-foreground-muted">Đang tải...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-foreground-subtle">
            <ClipboardList className="w-12 h-12 mb-3 opacity-30" />
            <p>Không có log nào</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background-tertiary">
                <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Thời gian</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Người thực hiện</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Hành động</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Đối tượng</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Lý do / Mô tả</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map(log => (
                <tr key={log._id} className="hover:bg-background-tertiary transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground-muted whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-foreground-subtle" />
                      {new Date(log.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{getAdminName(log.adminId)}</p>
                        <p className="text-xs text-foreground-subtle">{getAdminEmail(log.adminId)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getActionColor(log.actionType)}`}>
                      {getActionIcon(log.actionType)}
                      {getActionLabel(log.actionType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground-muted">
                    <span className="capitalize">{log.targetType || "—"}</span>
                    {log.targetId && (
                      <span className="ml-1 text-xs text-foreground-subtle">
                        #{String(log.targetId).slice(-6)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground-muted max-w-xs">
                    <p className="truncate">{buildDescription(log)}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-foreground-subtle font-mono">
                    {log.ipAddress || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-foreground-muted">
          <span>Hiển thị {logs.length} / {total} bản ghi</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-background-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-3">Trang {page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-background-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
