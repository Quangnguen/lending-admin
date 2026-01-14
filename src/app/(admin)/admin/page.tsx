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
    <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground-muted font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {change && (
            <p
              className={`text-sm mt-2 ${
                changeType === "positive"
                  ? "text-success"
                  : changeType === "negative"
                  ? "text-error"
                  : "text-foreground-muted"
              }`}
            >
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
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
      <td className="py-3 px-4 text-sm text-foreground">{amount}</td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status].color}`}>
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
    { id: "LOAN-001", applicant: "Nguyễn Văn A", amount: "50,000,000 ₫", status: "pending", date: "03/01/2026" },
    { id: "LOAN-002", applicant: "Trần Thị B", amount: "120,000,000 ₫", status: "review", date: "02/01/2026" },
    { id: "LOAN-003", applicant: "Lê Văn C", amount: "80,000,000 ₫", status: "approved", date: "02/01/2026" },
    { id: "LOAN-004", applicant: "Phạm Thị D", amount: "200,000,000 ₫", status: "rejected", date: "01/01/2026" },
    { id: "LOAN-005", applicant: "Hoàng Văn E", amount: "65,000,000 ₫", status: "pending", date: "01/01/2026" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-foreground-muted mt-1">
          Xin chào, {session?.user?.email} ({role === "ADMIN" ? "Quản trị viên" : "Người xác minh"})
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng hồ sơ"
          value="1,234"
          change="+12% so với tháng trước"
          changeType="positive"
          icon={<FileText className="w-6 h-6 text-info" />}
          color="bg-info-light"
        />
        <StatCard
          title="Chờ xử lý"
          value="56"
          change="8 hồ sơ mới hôm nay"
          changeType="neutral"
          icon={<Clock className="w-6 h-6 text-warning" />}
          color="bg-warning-light"
        />
        <StatCard
          title="Đã duyệt"
          value="892"
          change="+8% so với tháng trước"
          changeType="positive"
          icon={<CheckCircle className="w-6 h-6 text-success" />}
          color="bg-success-light"
        />
        <StatCard
          title="Cần xem xét"
          value="23"
          change="5 hồ sơ rủi ro cao"
          changeType="negative"
          icon={<AlertTriangle className="w-6 h-6 text-error" />}
          color="bg-error-light"
        />
      </div>

      {/* Admin-only Stats */}
      {role === "ADMIN" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Tổng giá trị giải ngân"
            value="45.2 tỷ ₫"
            change="+15% so với tháng trước"
            changeType="positive"
            icon={<DollarSign className="w-6 h-6 text-success" />}
            color="bg-success-light"
          />
          <StatCard
            title="Nhân viên hoạt động"
            value="24"
            change="3 verifier online"
            changeType="neutral"
            icon={<Users className="w-6 h-6 text-purple-500" />}
            color="bg-purple-500/10"
          />
          <StatCard
            title="Tỷ lệ duyệt"
            value="72.3%"
            change="+2.1% so với tháng trước"
            changeType="positive"
            icon={<TrendingUp className="w-6 h-6 text-info" />}
            color="bg-info-light"
          />
        </div>
      )}

      {/* Recent Cases Table */}
      <div className="bg-card-bg rounded-xl shadow-sm border border-card-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Hồ sơ gần đây</h2>
              <p className="text-sm text-foreground-muted mt-1">Danh sách các hồ sơ vay mới nhất</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-hover hover:bg-primary-light rounded-lg transition-colors">
              Xem tất cả
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-tertiary">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  Mã hồ sơ
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  Người vay
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  Ngày tạo
                </th>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verifier Actions */}
        <div className="bg-card-bg rounded-xl shadow-sm border border-card-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Thao tác nhanh</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-background-tertiary rounded-lg transition-colors">
              <div className="w-10 h-10 bg-info-light rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="font-medium text-foreground">Xem hồ sơ chờ duyệt</p>
                <p className="text-sm text-foreground-muted">56 hồ sơ đang chờ</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-background-tertiary rounded-lg transition-colors">
              <div className="w-10 h-10 bg-warning-light rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium text-foreground">Hồ sơ rủi ro cao</p>
                <p className="text-sm text-foreground-muted">5 hồ sơ cần xem xét</p>
              </div>
            </button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-card-bg rounded-xl shadow-sm border border-card-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-success-light rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-foreground">
                  <span className="font-medium">LOAN-003</span> đã được duyệt
                </p>
                <p className="text-xs text-foreground-muted">2 giờ trước</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-info-light rounded-full flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4 text-info" />
              </div>
              <div>
                <p className="text-sm text-foreground">
                  <span className="font-medium">LOAN-002</span> đang được xem xét
                </p>
                <p className="text-xs text-foreground-muted">3 giờ trước</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-error-light rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-error" />
              </div>
              <div>
                <p className="text-sm text-foreground">
                  <span className="font-medium">LOAN-004</span> đã bị từ chối
                </p>
                <p className="text-xs text-foreground-muted">5 giờ trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
