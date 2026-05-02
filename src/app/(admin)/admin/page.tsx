// src/app/(admin)/admin/page.tsx
"use client";

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
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, change, changeType, icon, color }: StatCardProps) {
  return (
    <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-card-border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground-muted font-medium">{title}</p>
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
          style={{ background: gradient }}
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

interface RecentCaseProps {
  id: string;
  applicant: string;
  amount: string;
  status: "pending" | "approved" | "rejected" | "review";
  date: string;
}

function RecentCaseRow({ id, applicant, amount, status, date }: RecentCaseProps) {
  const statusConfig = {
    pending: { label: "Chờ xử lý", color: "bg-warning-light text-warning" },
    approved: { label: "Đã duyệt", color: "bg-success-light text-success" },
    rejected: { label: "Từ chối", color: "bg-error-light text-error" },
    review: { label: "Đang xét", color: "bg-info-light text-info" },
  };

  return (
    <tr className="border-b border-border hover:bg-background-tertiary transition-colors">
      <td className="py-3 px-4 text-sm font-medium text-primary">{id}</td>
      <td className="py-3 px-4 text-sm text-foreground">{applicant}</td>
      <td className="py-3 px-4 text-sm text-foreground font-medium">{amount}</td>
      <td className="py-3 px-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[status].color}`}>
          {statusConfig[status].label}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-foreground-muted">{date}</td>
    </tr>
  );
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  const recentCases: RecentCaseProps[] = [
    { id: "LOAN-001", applicant: "Nguyễn Văn A", amount: "1,000 USDT", status: "pending", date: "13/04/2026" },
    { id: "LOAN-002", applicant: "Trần Thị B", amount: "2,500 USDT", status: "review", date: "12/04/2026" },
    { id: "LOAN-003", applicant: "Lê Văn C", amount: "500 USDT", status: "approved", date: "11/04/2026" },
    { id: "LOAN-004", applicant: "Phạm Thị D", amount: "5,000 USDT", status: "rejected", date: "10/04/2026" },
    { id: "LOAN-005", applicant: "Hoàng Văn E", amount: "800 USDT", status: "pending", date: "10/04/2026" },
  ];

  // Weekly loan volume data (7 days)
  const weeklyData = [
    { label: "T2", value: 3, color: "bg-primary" },
    { label: "T3", value: 5, color: "bg-primary" },
    { label: "T4", value: 2, color: "bg-primary" },
    { label: "T5", value: 7, color: "bg-primary" },
    { label: "T6", value: 4, color: "bg-primary" },
    { label: "T7", value: 6, color: "bg-primary" },
    { label: "CN", value: 1, color: "bg-primary" },
  ];

  // Loan status distribution for donut chart
  const statusDistribution = [
    { label: "Đang hoạt động", value: 12, color: "#22c55e" },
    { label: "Đã trả nợ", value: 25, color: "#3b82f6" },
    { label: "Quá hạn", value: 3, color: "#f59e0b" },
    { label: "Vỡ nợ", value: 1, color: "#ef4444" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-foreground-muted mt-1">
            Xin chào, {session?.user?.email || "Admin"} ({role === "ADMIN" ? "Quản trị viên" : "Người xác minh"})
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-foreground-muted bg-card-bg border border-card-border rounded-lg px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Blockchain: Đã kết nối
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Tổng khoản vay"
          value="41"
          change="+12% so với tháng trước"
          changeType="positive"
          icon={<FileText className="w-6 h-6 text-info" />}
          color="bg-info-light"
        />
        <StatCard
          title="Đang chờ duyệt"
          value="8"
          change="3 yêu cầu mới hôm nay"
          changeType="neutral"
          icon={<Clock className="w-6 h-6 text-warning" />}
          color="bg-warning-light"
        />
        <StatCard
          title="Đang hoạt động"
          value="12"
          change="+2 so với tuần trước"
          changeType="positive"
          icon={<CheckCircle className="w-6 h-6 text-success" />}
          color="bg-success-light"
        />
        <StatCard
          title="Cần xem xét"
          value="4"
          change="3 quá hạn, 1 vỡ nợ"
          changeType="negative"
          icon={<AlertTriangle className="w-6 h-6 text-error" />}
          color="bg-error-light"
        />
      </div>

      {/* Admin-only Extended Stats */}
      {role === "ADMIN" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
            title="Tổng giá trị giải ngân"
            value="45,200 USDT"
            change="+15% so với tháng trước"
            changeType="positive"
            icon={<DollarSign className="w-6 h-6 text-success" />}
            color="bg-success-light"
          />
          <StatCard
            title="Người dùng hoạt động"
            value="156"
            change="24 đã liên kết ví"
            changeType="neutral"
            icon={<Users className="w-6 h-6 text-purple-500" />}
            color="bg-purple-500/10"
          />
          <StatCard
            title="Tỷ lệ trả nợ đúng hạn"
            value="92.3%"
            change="+2.1% so với tháng trước"
            changeType="positive"
            icon={<TrendingUp className="w-6 h-6 text-info" />}
            color="bg-info-light"
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Volume Chart */}
        <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Banknote className="w-4 h-4 text-primary" />
                Khoản vay tuần này
              </h3>
              <p className="text-xs text-foreground-muted mt-1">Số lượng yêu cầu vay theo ngày</p>
            </div>
            <span className="text-sm font-bold text-foreground">28 tổng</span>
          </div>
          <MiniBarChart data={weeklyData} maxValue={7} />
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
          <DonutChart segments={statusDistribution} />
        </div>
      </div>

      {/* Recent Cases Table */}
      <div className="bg-card-bg rounded-xl shadow-sm border border-card-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Yêu cầu vay gần đây</h2>
              <p className="text-sm text-foreground-muted mt-1">Danh sách các yêu cầu vay mới nhất trên nền tảng</p>
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
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Mã hồ sơ</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Người vay</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Số tiền</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Trạng thái</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {recentCases.map((caseItem) => (
                <RecentCaseRow key={caseItem.id} {...caseItem} />
              ))}
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
                <p className="text-sm text-foreground-muted">8 hồ sơ đang chờ</p>
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
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-background-tertiary rounded-lg transition-colors">
              <div className="w-10 h-10 bg-warning-light rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium text-foreground">Khoản vay rủi ro cao</p>
                <p className="text-sm text-foreground-muted">4 khoản cần xem xét</p>
              </div>
            </button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-card-bg rounded-xl shadow-sm border border-card-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            {[
              { icon: <CheckCircle className="w-4 h-4 text-success" />, bg: "bg-success-light", text: <><span className="font-medium">LOAN-003</span> đã được cấp vốn</>, time: "15 phút trước" },
              { icon: <DollarSign className="w-4 h-4 text-primary" />, bg: "bg-primary-light", text: <><span className="font-medium">LOAN-001</span> đã trả nợ thành công</>, time: "1 giờ trước" },
              { icon: <Activity className="w-4 h-4 text-info" />, bg: "bg-info-light", text: <>Blockchain sync: <span className="font-medium">5 loans</span> đã đồng bộ</>, time: "2 giờ trước" },
              { icon: <AlertTriangle className="w-4 h-4 text-warning" />, bg: "bg-warning-light", text: <><span className="font-medium">LOAN-004</span> đã quá hạn 3 ngày</>, time: "3 giờ trước" },
              { icon: <Blocks className="w-4 h-4 text-purple-500" />, bg: "bg-purple-500/10", text: <>Event: LoanMatched — RequestID: 4</>, time: "5 giờ trước" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center flex-shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm text-foreground">{item.text}</p>
                  <p className="text-xs text-foreground-muted">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
