// src/app/(admin)/verifier/page.tsx
"use client";

import { useSession } from "next-auth/react";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Eye,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface CaseItemProps {
  id: string;
  applicant: string;
  amount: string;
  type: string;
  priority: "high" | "medium" | "low";
  submittedAt: string;
}

function CaseCard({ id, applicant, amount, type, priority, submittedAt }: CaseItemProps) {
  const priorityConfig = {
    high: { label: "Ưu tiên cao", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
    medium: { label: "Trung bình", color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
    low: { label: "Thấp", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-blue-600">{id}</p>
          <p className="text-sm text-gray-500">{type}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${priorityConfig[priority].color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig[priority].dot}`}></span>
          {priorityConfig[priority].label}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Người vay:</span>
          <span className="font-medium text-gray-900">{applicant}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Số tiền:</span>
          <span className="font-medium text-gray-900">{amount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Ngày nộp:</span>
          <span className="text-gray-600">{submittedAt}</span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Eye className="w-4 h-4" />
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}

export default function VerifierDashboard() {
  const { data: session } = useSession();

  const pendingCases: CaseItemProps[] = [
    { id: "LOAN-001", applicant: "Nguyễn Văn A", amount: "50,000,000 ₫", type: "Vay tiêu dùng", priority: "high", submittedAt: "03/01/2026" },
    { id: "LOAN-005", applicant: "Hoàng Văn E", amount: "65,000,000 ₫", type: "Vay mua xe", priority: "high", submittedAt: "01/01/2026" },
    { id: "LOAN-006", applicant: "Vũ Thị F", amount: "30,000,000 ₫", type: "Vay tiêu dùng", priority: "medium", submittedAt: "02/01/2026" },
    { id: "LOAN-007", applicant: "Đặng Văn G", amount: "150,000,000 ₫", type: "Vay mua nhà", priority: "low", submittedAt: "01/01/2026" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển Verifier</h1>
        <p className="text-gray-500 mt-1">
          Xin chào, {session?.user?.email} • Hôm nay bạn có <span className="font-semibold text-blue-600">12 hồ sơ</span> cần xử lý
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Được giao"
          value="12"
          subtitle="hồ sơ cần xử lý"
          icon={<FileText className="w-6 h-6 text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="Đã xử lý hôm nay"
          value="5"
          subtitle="hoàn thành 42%"
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          color="bg-green-50"
        />
        <StatCard
          title="Đang chờ"
          value="7"
          subtitle="chưa xem xét"
          icon={<Clock className="w-6 h-6 text-yellow-600" />}
          color="bg-yellow-50"
        />
        <StatCard
          title="Ưu tiên cao"
          value="3"
          subtitle="cần xử lý gấp"
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
          color="bg-red-50"
        />
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hồ sơ, tên người vay..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
              <option value="">Tất cả loại vay</option>
              <option value="consumer">Vay tiêu dùng</option>
              <option value="car">Vay mua xe</option>
              <option value="house">Vay mua nhà</option>
            </select>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
              <option value="">Tất cả độ ưu tiên</option>
              <option value="high">Ưu tiên cao</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Lọc
            </button>
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Hồ sơ cần xử lý</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Sắp xếp theo:</span>
            <select className="border-none bg-transparent font-medium text-gray-700 focus:outline-none cursor-pointer">
              <option value="priority">Độ ưu tiên</option>
              <option value="date">Ngày nộp</option>
              <option value="amount">Số tiền</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pendingCases.map((caseItem) => (
            <CaseCard key={caseItem.id} {...caseItem} />
          ))}
        </div>
      </div>

      {/* My Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiệu suất của tôi (Tháng này)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">127</p>
            <p className="text-sm text-gray-500 mt-1">Hồ sơ đã xử lý</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">89%</p>
            <p className="text-sm text-gray-500 mt-1">Tỷ lệ chính xác</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">2.5h</p>
            <p className="text-sm text-gray-500 mt-1">Thời gian TB/hồ sơ</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">#3</p>
            <p className="text-sm text-gray-500 mt-1">Xếp hạng team</p>
          </div>
        </div>
      </div>
    </div>
  );
}
