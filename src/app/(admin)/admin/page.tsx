// src/app/(admin)/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Blocks,
  Banknote,
  PieChart,
  Loader2,
  RefreshCw,
} from "lucide-react";

// ===== Types =====
interface DashboardStats {
  requests: { total: number; pending: number; funded: number };
  loans: { total: number; active: number; repaid: number; overdue: number; defaulted: number };
  values: { totalDisbursed: number; totalInterest: number; totalRepaid: number };
  repaymentRate: number;
  defaultRate: number;
  totalUsers: number;
}

interface RecentLoan {
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

// ===== Components =====
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

function StatCard({ title, value, change, changeType, icon, color, loading }: StatCardProps) {
  return (
    <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-card-border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground-muted font-medium">{title}</p>
          {loading ? (
            <div className="flex items-center gap-2 mt-1">
              <Loader2 className="w-5 h-5 animate-spin text-foreground-muted" />
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
              {change && (
                <div className={`flex items-center gap-1 text-sm mt-2 ${
                  changeType === "positive"
                    ? "text-success"
                    : changeType === "negative"
                    ? "text-error"
                    : "text-foreground-muted"
                }`}>
                  {changeType === "positive" && <ArrowUpRight className="w-3.5 h-3.5" />}
                  {changeType === "negative" && <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>{change}</span>
                </div>
              )}
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

// ===== Mini Bar Chart Component (CSS only) =====
function MiniBarChart({ data, maxValue }: { data: { label: string; value: number; color: string }[]; maxValue: number }) {
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((bar, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <span className="text-xs font-bold text-foreground">{bar.value}</span>
          <div className="w-full bg-background-tertiary rounded-t-md relative" style={{ height: "90px" }}>
            <div
              className={`absolute bottom-0 w-full rounded-t-md transition-all duration-1000 ease-out ${bar.color}`}
              style={{ height: maxValue > 0 ? `${Math.max((bar.value / maxValue) * 100, 4)}%` : "4%" }}
            />
          </div>
          <span className="text-[10px] text-foreground-muted text-center leading-tight">{bar.label}</span>
        </div>
      ))}
    </div>
  );
}

// ===== Donut Chart Component (CSS only) =====
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let cumulativePercent = 0;

  const gradientParts = segments.map((segment) => {
    const percent = total > 0 ? (segment.value / total) * 100 : 0;
    const start = cumulativePercent;
    cumulativePercent += percent;
    return `${segment.color} ${start}% ${cumulativePercent}%`;
  });

  const gradient = `conic-gradient(${gradientParts.join(", ")})`;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32 flex-shrink-0">
        <div
          className="w-full h-full rounded-full"
          style={{ background: total > 0 ? gradient : "#e5e7eb" }}
        />
        <div className="absolute inset-3 bg-card-bg rounded-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{total}</p>
            <p className="text-[10px] text-foreground-muted">Tổng</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: seg.color }} />
            <span className="text-xs text-foreground-muted">{seg.label}</span>
            <span className="text-xs font-bold text-foreground ml-auto">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== Helpers: MongoDB Decimal128 safety =====
function toNum(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "object" && "$numberDecimal" in val) return parseFloat(val.$numberDecimal);
  if (typeof val === "number") return val;
  return parseFloat(String(val)) || 0;
}

function formatAmount(amount: any): string {
  const n = toNum(amount);
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K USDT`;
  return `${n.toLocaleString()} USDT`;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// ===== Status helpers =====
const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Chờ xử lý", color: "bg-warning-light text-warning" },
  pending: { label: "Chờ xử lý", color: "bg-warning-light text-warning" },
  APPROVED: { label: "Đã duyệt", color: "bg-success-light text-success" },
  approved: { label: "Đã duyệt", color: "bg-success-light text-success" },
  FUNDED: { label: "Đã cấp vốn", color: "bg-info-light text-info" },
  funded: { label: "Đã cấp vốn", color: "bg-info-light text-info" },
  CANCELLED: { label: "Đã hủy", color: "bg-error-light text-error" },
  cancelled: { label: "Đã hủy", color: "bg-error-light text-error" },
  ACTIVE: { label: "Đang hoạt động", color: "bg-info-light text-info" },
  active: { label: "Đang hoạt động", color: "bg-info-light text-info" },
  REPAID: { label: "Đã trả nợ", color: "bg-success-light text-success" },
  repaid: { label: "Đã trả nợ", color: "bg-success-light text-success" },
  OVERDUE: { label: "Quá hạn", color: "bg-warning-light text-warning" },
  overdue: { label: "Quá hạn", color: "bg-warning-light text-warning" },
  DEFAULTED: { label: "Vỡ nợ", color: "bg-error-light text-error" },
  defaulted: { label: "Vỡ nợ", color: "bg-error-light text-error" },
};

// ===== Main Dashboard =====
export default function AdminDashboard() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLoans, setRecentLoans] = useState<RecentLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [statsRes, loansRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/recent-loans"),
      ]);

      const statsData = await statsRes.json();
      const loansData = await loansRes.json();

      if (statsData.success && statsData.data) {
        setStats(statsData.data);
      }

      if (loansData.success && loansData.data) {
        setRecentLoans(loansData.data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Không thể kết nối đến backend. Kiểm tra Lending-BE đã chạy chưa.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh mỗi 60 giây
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Derived data for charts
  const loanStatusDistribution = stats
    ? [
        { label: "Đang hoạt động", value: stats.loans.active, color: "#22c55e" },
        { label: "Đã trả nợ", value: stats.loans.repaid, color: "#3b82f6" },
        { label: "Quá hạn", value: stats.loans.overdue, color: "#f59e0b" },
        { label: "Vỡ nợ", value: stats.loans.defaulted, color: "#ef4444" },
      ]
    : [];

  const requestBarData = stats
    ? [
        { label: "Tổng YC", value: stats.requests.total, color: "bg-primary" },
        { label: "Chờ duyệt", value: stats.requests.pending, color: "bg-warning" },
        { label: "Đã cấp vốn", value: stats.requests.funded, color: "bg-success" },
        { label: "Đang vay", value: stats.loans.active, color: "bg-info" },
        { label: "Đã trả", value: stats.loans.repaid, color: "bg-primary" },
        { label: "Quá hạn", value: stats.loans.overdue, color: "bg-warning" },
        { label: "Vỡ nợ", value: stats.loans.defaulted, color: "bg-error" },
      ]
    : [];

  const barMaxValue = requestBarData.length > 0 ? Math.max(...requestBarData.map((d) => d.value), 1) : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-foreground-muted mt-1">
            Xin chào, {session?.user?.name || session?.user?.email || "Admin"} ({role === "ADMIN" ? "Quản trị viên" : "Người xác minh"})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-card-bg border border-card-border rounded-lg hover:bg-background-tertiary transition-colors text-foreground-muted disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </button>
          <div className="flex items-center gap-2 text-xs text-foreground-muted bg-card-bg border border-card-border rounded-lg px-3 py-2">
            <div className={`w-2 h-2 rounded-full ${error ? "bg-error" : "bg-success"} animate-pulse`} />
            {error ? "Mất kết nối" : "Backend: Đã kết nối"}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-error-light border border-error/20 rounded-xl p-4 text-error text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">{error}</p>
            <p className="text-xs mt-1 opacity-75">Đang hiển thị dữ liệu mẫu. Hãy khởi động backend bằng: cd Lending-BE && npm run start</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Tổng yêu cầu vay"
          value={stats?.requests.total ?? "—"}
          change={stats ? `${stats.requests.pending} đang chờ duyệt` : undefined}
          changeType="neutral"
          icon={<FileText className="w-6 h-6 text-info" />}
          color="bg-info-light"
          loading={loading && !stats}
        />
        <StatCard
          title="Đang chờ duyệt"
          value={stats?.requests.pending ?? "—"}
          change={stats ? `${stats.requests.funded} đã cấp vốn` : undefined}
          changeType="neutral"
          icon={<Clock className="w-6 h-6 text-warning" />}
          color="bg-warning-light"
          loading={loading && !stats}
        />
        <StatCard
          title="Khoản vay hoạt động"
          value={stats?.loans.active ?? "—"}
          change={stats ? `Tổng ${stats.loans.total} khoản vay` : undefined}
          changeType="positive"
          icon={<CheckCircle className="w-6 h-6 text-success" />}
          color="bg-success-light"
          loading={loading && !stats}
        />
        <StatCard
          title="Cần xem xét"
          value={stats ? stats.loans.overdue + stats.loans.defaulted : "—"}
          change={stats ? `${stats.loans.overdue} quá hạn, ${stats.loans.defaulted} vỡ nợ` : undefined}
          changeType={stats && (stats.loans.overdue + stats.loans.defaulted) > 0 ? "negative" : "neutral"}
          icon={<AlertTriangle className="w-6 h-6 text-error" />}
          color="bg-error-light"
          loading={loading && !stats}
        />
      </div>

      {/* Admin-only Extended Stats */}
      {role === "ADMIN" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
            title="Tổng giá trị giải ngân"
            value={stats ? formatAmount(stats.values.totalDisbursed) : "—"}
            change={stats ? `Đã thu hồi: ${formatAmount(stats.values.totalRepaid)}` : undefined}
            changeType="positive"
            icon={<DollarSign className="w-6 h-6 text-success" />}
            color="bg-success-light"
            loading={loading && !stats}
          />
          <StatCard
            title="Người dùng"
            value={stats?.totalUsers ?? "—"}
            change="Tổng tài khoản đã đăng ký"
            changeType="neutral"
            icon={<Users className="w-6 h-6 text-purple-500" />}
            color="bg-purple-500/10"
            loading={loading && !stats}
          />
          <StatCard
            title="Tỷ lệ trả nợ đúng hạn"
            value={stats ? `${stats.repaymentRate}%` : "—"}
            change={stats ? `Tỷ lệ vỡ nợ: ${stats.defaultRate}%` : undefined}
            changeType={stats && stats.repaymentRate > 80 ? "positive" : "negative"}
            icon={<TrendingUp className="w-6 h-6 text-info" />}
            color="bg-info-light"
            loading={loading && !stats}
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request & Loan Bar Chart */}
        <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Banknote className="w-4 h-4 text-primary" />
                Tổng quan khoản vay
              </h3>
              <p className="text-xs text-foreground-muted mt-1">Phân bổ yêu cầu vay và khoản vay</p>
            </div>
            <span className="text-sm font-bold text-foreground">{stats?.loans.total ?? 0} khoản vay</span>
          </div>
          {stats ? (
            <MiniBarChart data={requestBarData} maxValue={barMaxValue} />
          ) : (
            <div className="h-32 flex items-center justify-center text-foreground-subtle">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
        </div>

        {/* Status Distribution Donut */}
        <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <PieChart className="w-4 h-4 text-primary" />
                Phân bổ trạng thái
              </h3>
              <p className="text-xs text-foreground-muted mt-1">Tổng quan khoản vay hiện tại</p>
            </div>
          </div>
          {stats ? (
            <DonutChart segments={loanStatusDistribution} />
          ) : (
            <div className="h-32 flex items-center justify-center text-foreground-subtle">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Recent Cases Table */}
      <div className="bg-card-bg rounded-xl shadow-sm border border-card-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Yêu cầu vay gần đây</h2>
              <p className="text-sm text-foreground-muted mt-1">
                {recentLoans.length > 0
                  ? `${recentLoans.length} yêu cầu vay đang chờ xử lý (dữ liệu thực)`
                  : "Danh sách các yêu cầu vay mới nhất trên nền tảng"}
              </p>
            </div>
            <a href="/admin/loans" className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-hover hover:bg-primary-light rounded-lg transition-colors">
              Xem tất cả
            </a>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-tertiary">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Người vay</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Số tiền</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Lãi suất</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Thời hạn</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Mục đích</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Trạng thái</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {recentLoans.length > 0 ? (
                recentLoans.map((loan) => {
                  const st = statusConfig[loan.status] || { label: loan.status, color: "bg-gray-100 text-gray-600" };
                  return (
                    <tr key={loan.id} className="border-b border-border hover:bg-background-tertiary transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{loan.borrowerName}</p>
                          <p className="text-xs text-foreground-muted">{loan.borrowerEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-foreground">{toNum(loan.amount).toLocaleString()} USDT</td>
                      <td className="py-3 px-4 text-sm text-foreground">{toNum(loan.interestRate)}%</td>
                      <td className="py-3 px-4 text-sm text-foreground-muted">{toNum(loan.durationDays)} ngày</td>
                      <td className="py-3 px-4 text-sm text-foreground-muted">{loan.purpose || "—"}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${st.color}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground-muted">{formatDate(loan.createdAt)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-foreground-subtle">
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang tải dữ liệu...</span>
                      </div>
                    ) : (
                      <div>
                        <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                        <p>Chưa có yêu cầu vay nào</p>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions & Activity Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-card-bg rounded-xl shadow-sm border border-card-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Thao tác nhanh</h3>
          <div className="space-y-3">
            <a href="/admin/loans" className="w-full flex items-center gap-3 p-3 text-left hover:bg-background-tertiary rounded-lg transition-colors">
              <div className="w-10 h-10 bg-info-light rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="font-medium text-foreground">Xem hồ sơ chờ duyệt</p>
                <p className="text-sm text-foreground-muted">{stats?.requests.pending ?? 0} hồ sơ đang chờ</p>
              </div>
            </a>
            <a href="/admin/blockchain" className="w-full flex items-center gap-3 p-3 text-left hover:bg-background-tertiary rounded-lg transition-colors">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Blocks className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Blockchain Monitor</p>
                <p className="text-sm text-foreground-muted">Giám sát smart contracts</p>
              </div>
            </a>
            <a href="/admin/users" className="w-full flex items-center gap-3 p-3 text-left hover:bg-background-tertiary rounded-lg transition-colors">
              <div className="w-10 h-10 bg-warning-light rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium text-foreground">Quản lý người dùng</p>
                <p className="text-sm text-foreground-muted">{stats?.totalUsers ?? 0} người dùng đã đăng ký</p>
              </div>
            </a>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-card-bg rounded-xl shadow-sm border border-card-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Thông tin hệ thống</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-foreground-muted">Backend API</span>
              <span className={`text-sm font-medium ${error ? "text-error" : "text-success"}`}>
                {error ? "Offline" : "Online"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-foreground-muted">Tổng khoản vay</span>
              <span className="text-sm font-medium text-foreground">{stats?.loans.total ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-foreground-muted">Giá trị giải ngân</span>
              <span className="text-sm font-medium text-foreground">{stats ? formatAmount(stats.values.totalDisbursed) : "—"}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-foreground-muted">Tổng lãi suất</span>
              <span className="text-sm font-medium text-foreground">{stats ? formatAmount(stats.values.totalInterest) : "—"}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-foreground-muted">Tỷ lệ vỡ nợ</span>
              <span className={`text-sm font-medium ${stats && stats.defaultRate > 5 ? "text-error" : "text-success"}`}>
                {stats ? `${stats.defaultRate}%` : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
