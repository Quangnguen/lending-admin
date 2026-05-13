// src/app/(admin)/admin/profile/page.tsx
"use client";

import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Key,
  Bell,
  Globe,
  Save,
} from "lucide-react";

export default function AdminProfilePage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hồ sơ cá nhân</h1>
        <p className="text-foreground-muted mt-1">
          Quản lý thông tin tài khoản và cài đặt cá nhân
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-card-bg rounded-xl border border-border p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground text-2xl font-bold flex-shrink-0">
            {(session?.user?.name || session?.user?.email)?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">
              {session?.user?.name || "N/A"}
            </h2>
            <p className="text-foreground-muted">{session?.user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                isAdmin
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              }`}>
                <Shield className="w-3.5 h-3.5" />
                {isAdmin ? "Quản trị viên" : "Người xác minh"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Đang hoạt động
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Info */}
        <div className="bg-card-bg rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Thông tin tài khoản
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-foreground-subtle mb-1">Họ và tên</label>
              <input
                type="text"
                defaultValue={session?.user?.name || ""}
                className="w-full px-4 py-2.5 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground-subtle mb-1">Email</label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-foreground-subtle" />
                <span className="text-foreground">{session?.user?.email}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-foreground-subtle mb-1">Vai trò</label>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-foreground-subtle" />
                <span className="text-foreground">{isAdmin ? "Admin" : "Verifier"}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-foreground-subtle mb-1">Ngày tham gia</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-foreground-subtle" />
                <span className="text-foreground">01/01/2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-card-bg rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            Bảo mật
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-foreground-subtle mb-1">Mật khẩu hiện tại</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-foreground placeholder:text-foreground-subtle"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground-subtle mb-1">Mật khẩu mới</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-foreground placeholder:text-foreground-subtle"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground-subtle mb-1">Xác nhận mật khẩu</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-foreground placeholder:text-foreground-subtle"
              />
            </div>
            <button className="w-full py-2.5 bg-background-tertiary hover:bg-border text-foreground-muted font-medium rounded-lg transition-colors text-sm">
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-card-bg rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Tùy chọn thông báo
        </h3>
        <div className="space-y-3">
          {[
            { label: "Thông báo hồ sơ mới", desc: "Nhận thông báo khi có hồ sơ vay mới" },
            { label: "Cập nhật trạng thái", desc: "Nhận thông báo khi hồ sơ thay đổi trạng thái" },
            { label: "Cảnh báo hệ thống", desc: "Nhận thông báo về sự cố hệ thống" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-foreground-subtle">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors">
          <Save className="w-4 h-4" />
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
