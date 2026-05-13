// src/app/(verifier)/verifier/profile/page.tsx
"use client";

import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Key,
  Bell,
  Save,
  Award,
  BarChart3,
} from "lucide-react";

export default function VerifierProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
        <p className="text-gray-500 mt-1">
          Quản lý thông tin tài khoản và cài đặt cá nhân
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {(session?.user?.name || session?.user?.email)?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              {session?.user?.name || "N/A"}
            </h2>
            <p className="text-gray-500">{session?.user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                <Shield className="w-3.5 h-3.5" />
                Người xác minh
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                Đang hoạt động
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Thống kê hiệu suất
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">127</p>
            <p className="text-sm text-gray-500 mt-1">Hồ sơ đã xử lý</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-green-600">89%</p>
            <p className="text-sm text-gray-500 mt-1">Tỷ lệ chính xác</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-blue-600">2.5h</p>
            <p className="text-sm text-gray-500 mt-1">Thời gian TB/hồ sơ</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-purple-600">#3</p>
            <p className="text-sm text-gray-500 mt-1">Xếp hạng team</p>
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Thông tin tài khoản
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Họ và tên</label>
              <input
                type="text"
                defaultValue={session?.user?.name || ""}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{session?.user?.email}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Vai trò</label>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">Verifier</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Ngày tham gia</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">01/01/2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-600" />
            Bảo mật
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Mật khẩu hiện tại</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Mật khẩu mới</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Xác nhận mật khẩu</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-400"
              />
            </div>
            <button className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-lg transition-colors text-sm">
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          Tùy chọn thông báo
        </h3>
        <div className="space-y-3">
          {[
            { label: "Hồ sơ mới được phân công", desc: "Nhận thông báo khi có hồ sơ mới được giao cho bạn" },
            { label: "Nhắc nhở hồ sơ chờ", desc: "Nhắc nhở khi hồ sơ chờ xử lý quá lâu" },
            { label: "Cập nhật hệ thống", desc: "Nhận thông báo về bảo trì và cập nhật hệ thống" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
          <Save className="w-4 h-4" />
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
