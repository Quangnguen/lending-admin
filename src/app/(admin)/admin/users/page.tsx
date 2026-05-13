// src/app/(admin)/admin/users/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, RefreshCw, Loader2, Users, Eye, UserX, UserCheck } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  kycStatus: string;
  creditScore: number;
  creditRating: string;
  loanLimit: number;
  creditCalculatedAt: string | null;
  balance: number;
  isVerified: boolean;
  registeredDate: string;
  walletAddress: string;
}

const roleBadgeColors: Record<string, string> = {
  Borrower: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Lender: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Verifier: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
};

const statusDotColors: Record<string, string> = {
  Active: "bg-success",
  Locked: "bg-error",
  Pending: "bg-warning",
};

const kycBadge: Record<string, { bg: string; text: string }> = {
  Verified: { bg: "bg-success-light", text: "text-success" },
  "Pending Review": { bg: "bg-warning-light", text: "text-warning" },
  Rejected: { bg: "bg-error-light", text: "text-error" },
  "Not Started": { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-500 dark:text-gray-400" },
};

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users?limit=100");
      const data = await res.json();
      if (data.success && data.data?.items) {
        setUsers(data.data.items);
      } else {
        setError(data.error || "Không thể tải danh sách người dùng. Vui lòng đăng xuất và đăng nhập lại.");
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Lỗi kết nối. Kiểm tra backend có đang chạy không.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !searchQuery ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý người dùng</h1>
          <p className="text-foreground-muted mt-1">
            {users.length > 0 ? `${users.length} người dùng trong hệ thống (dữ liệu thực)` : "Đang tải dữ liệu..."}
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-card-bg border border-card-border rounded-lg hover:bg-background-tertiary transition-colors text-foreground-muted disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
          <span className="text-red-500 text-lg">⚠️</span>
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">Lỗi tải dữ liệu</p>
            <p className="text-xs text-red-600 dark:text-red-500 mt-1">{error}</p>
            <p className="text-xs text-red-500 dark:text-red-600 mt-2">
              💡 Hãy đảm bảo đăng nhập bằng tài khoản có role <strong>admin</strong> hoặc <strong>super_admin</strong> trong MongoDB.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-card-bg rounded-xl border border-card-border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <input
              type="text"
              placeholder="Tìm theo tên, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-input-bg border border-input-border rounded-lg text-foreground text-sm focus:outline-none focus:border-input-focus-border"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 bg-input-bg border border-input-border rounded-lg text-foreground text-sm"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="Borrower">Borrower</option>
            <option value="Lender">Lender</option>
            <option value="Admin">Admin</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-input-bg border border-input-border rounded-lg text-foreground text-sm"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Active">Active</option>
            <option value="Locked">Locked</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card-bg rounded-xl shadow-sm border border-card-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-tertiary">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Người dùng</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Vai trò</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Trạng thái</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">KYC</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Credit Score</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Ngày đăng ký</th>
                <th className="py-3 px-4 text-center text-xs font-medium text-foreground-muted uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-foreground-subtle">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Đang tải dữ liệu từ backend...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-background-tertiary transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-foreground-muted">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleBadgeColors[user.role] || "bg-gray-100 text-gray-600"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${statusDotColors[user.status] || "bg-gray-400"}`} />
                        <span className="text-sm text-foreground">{user.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${kycBadge[user.kycStatus]?.bg || "bg-gray-100"} ${kycBadge[user.kycStatus]?.text || "text-gray-600"}`}>
                        {user.kycStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.creditScore > 0 ? (
                        <div title={user.creditCalculatedAt ? `Cập nhật: ${new Date(user.creditCalculatedAt).toLocaleDateString("vi-VN")}` : ""}>
                          <span className={`text-sm font-bold ${user.creditScore >= 700 ? "text-success" : user.creditScore >= 500 ? "text-warning" : "text-error"}`}>
                            {user.creditScore}
                          </span>
                          <span className="text-xs text-foreground-muted ml-1">/ 1000</span>
                          {user.creditRating && user.creditRating !== "—" && (
                            <div className="text-xs text-foreground-muted">{user.creditRating}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-foreground-muted">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-sm text-foreground-muted">{user.registeredDate}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                        className="p-1.5 hover:bg-primary-light rounded-lg transition-colors text-foreground-muted hover:text-primary"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-foreground-subtle">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p>Không tìm thấy người dùng nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-foreground-muted">
            Hiển thị <span className="font-medium text-foreground">{filteredUsers.length}</span> / {users.length} người dùng
          </p>
        </div>
      </div>
    </div>
  );
}
