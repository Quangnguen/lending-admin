// src/app/(admin)/admin/audit-logs/page.tsx
"use client";

import { useState } from "react";
import {
  ClipboardList,
  Search,
  Calendar,
  User,
  Shield,
  Settings,
  LogIn,
  LogOut,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type LogAction = "LOGIN" | "LOGOUT" | "APPROVE" | "REJECT" | "UPDATE" | "CREATE" | "DELETE" | "SETTINGS";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: "ADMIN" | "VERIFIER";
  action: LogAction;
  description: string;
  ip: string;
}

const actionConfig: Record<LogAction, { label: string; color: string; icon: React.ReactNode }> = {
  LOGIN: { label: "Đăng nhập", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: <LogIn className="w-3.5 h-3.5" /> },
  LOGOUT: { label: "Đăng xuất", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400", icon: <LogOut className="w-3.5 h-3.5" /> },
  APPROVE: { label: "Phê duyệt", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: <FileText className="w-3.5 h-3.5" /> },
  REJECT: { label: "Từ chối", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: <FileText className="w-3.5 h-3.5" /> },
  UPDATE: { label: "Cập nhật", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: <Settings className="w-3.5 h-3.5" /> },
  CREATE: { label: "Tạo mới", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: <User className="w-3.5 h-3.5" /> },
  DELETE: { label: "Xóa", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: <User className="w-3.5 h-3.5" /> },
  SETTINGS: { label: "Cài đặt", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400", icon: <Settings className="w-3.5 h-3.5" /> },
};

const mockLogs: AuditLog[] = [
  { id: "LOG-001", timestamp: "05/01/2026 14:32:10", user: "admin@loanmanager.com", role: "ADMIN", action: "LOGIN", description: "Đăng nhập hệ thống thành công", ip: "192.168.1.100" },
  { id: "LOG-002", timestamp: "05/01/2026 14:35:22", user: "admin@loanmanager.com", role: "ADMIN", action: "APPROVE", description: "Phê duyệt hồ sơ LOAN-003 của Lê Văn C", ip: "192.168.1.100" },
  { id: "LOG-003", timestamp: "05/01/2026 14:40:15", user: "verifier@loanmanager.com", role: "VERIFIER", action: "LOGIN", description: "Đăng nhập hệ thống thành công", ip: "192.168.1.105" },
  { id: "LOG-004", timestamp: "05/01/2026 14:45:30", user: "verifier@loanmanager.com", role: "VERIFIER", action: "REJECT", description: "Từ chối hồ sơ LOAN-004 — điểm tín dụng thấp", ip: "192.168.1.105" },
  { id: "LOG-005", timestamp: "05/01/2026 15:00:00", user: "admin@loanmanager.com", role: "ADMIN", action: "CREATE", description: "Tạo tài khoản verifier mới: verifier2@loanmanager.com", ip: "192.168.1.100" },
  { id: "LOG-006", timestamp: "05/01/2026 15:10:45", user: "admin@loanmanager.com", role: "ADMIN", action: "SETTINGS", description: "Cập nhật cài đặt hệ thống — thay đổi lãi suất tối đa", ip: "192.168.1.100" },
  { id: "LOG-007", timestamp: "05/01/2026 15:20:00", user: "verifier@loanmanager.com", role: "VERIFIER", action: "APPROVE", description: "Phê duyệt hồ sơ LOAN-001 của Nguyễn Văn A", ip: "192.168.1.105" },
  { id: "LOG-008", timestamp: "05/01/2026 16:00:00", user: "admin@loanmanager.com", role: "ADMIN", action: "UPDATE", description: "Cập nhật trạng thái người dùng Phạm Thị D → Tạm khóa", ip: "192.168.1.100" },
  { id: "LOG-009", timestamp: "05/01/2026 16:30:00", user: "verifier@loanmanager.com", role: "VERIFIER", action: "LOGOUT", description: "Đăng xuất khỏi hệ thống", ip: "192.168.1.105" },
  { id: "LOG-010", timestamp: "05/01/2026 17:00:00", user: "admin@loanmanager.com", role: "ADMIN", action: "LOGOUT", description: "Đăng xuất khỏi hệ thống", ip: "192.168.1.100" },
];

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<LogAction | "all">("all");

  const filtered = mockLogs.filter((log) => {
    const matchAction = actionFilter === "all" || log.action === actionFilter;
    const matchSearch =
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.id.toLowerCase().includes(search.toLowerCase());
    return matchAction && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nhật ký hệ thống</h1>
        <p className="text-foreground-muted mt-1">
          Theo dõi tất cả hoạt động của người dùng trong hệ thống
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card-bg rounded-xl border border-border p-4">
          <p className="text-sm text-foreground-subtle">Tổng hoạt động hôm nay</p>
          <p className="text-2xl font-bold text-foreground mt-1">{mockLogs.length}</p>
        </div>
        <div className="bg-card-bg rounded-xl border border-border p-4">
          <p className="text-sm text-foreground-subtle">Đăng nhập</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{mockLogs.filter(l => l.action === "LOGIN").length}</p>
        </div>
        <div className="bg-card-bg rounded-xl border border-border p-4">
          <p className="text-sm text-foreground-subtle">Phê duyệt / Từ chối</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{mockLogs.filter(l => l.action === "APPROVE" || l.action === "REJECT").length}</p>
        </div>
        <div className="bg-card-bg rounded-xl border border-border p-4">
          <p className="text-sm text-foreground-subtle">Thay đổi cài đặt</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{mockLogs.filter(l => l.action === "SETTINGS" || l.action === "UPDATE").length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card-bg rounded-xl border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-subtle" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo mô tả, email, mã log..."
              className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-foreground placeholder:text-foreground-subtle"
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value as LogAction | "all")}
            className="px-4 py-2.5 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-foreground"
          >
            <option value="all">Tất cả hành động</option>
            <option value="LOGIN">Đăng nhập</option>
            <option value="LOGOUT">Đăng xuất</option>
            <option value="APPROVE">Phê duyệt</option>
            <option value="REJECT">Từ chối</option>
            <option value="UPDATE">Cập nhật</option>
            <option value="CREATE">Tạo mới</option>
            <option value="SETTINGS">Cài đặt</option>
          </select>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-card-bg rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-background-tertiary">
              <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Thời gian</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Người thực hiện</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Vai trò</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Hành động</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Mô tả</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Địa chỉ IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-background-tertiary transition-colors">
                <td className="px-6 py-4 text-sm text-foreground-muted whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-foreground-subtle" />
                    {log.timestamp}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{log.user}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    log.role === "ADMIN"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}>
                    <Shield className="w-3 h-3" />
                    {log.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${actionConfig[log.action].color}`}>
                    {actionConfig[log.action].icon}
                    {actionConfig[log.action].label}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{log.description}</td>
                <td className="px-6 py-4 text-sm text-foreground-muted font-mono">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-foreground-subtle">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Không tìm thấy nhật ký nào</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground-muted">
          Hiển thị {filtered.length} / {mockLogs.length} bản ghi
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border border-border hover:bg-background-tertiary transition-colors text-foreground-muted">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm font-medium">1</span>
          <button className="p-2 rounded-lg border border-border hover:bg-background-tertiary transition-colors text-foreground-muted">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
