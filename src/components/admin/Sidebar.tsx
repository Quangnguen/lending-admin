// src/components/admin/Sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ClipboardList,
  Shield,
  User,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Banknote,
  Blocks,
  Bell,
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
}

function NavItem({ href, icon, label, isActive, isCollapsed }: NavItemProps) {
  return (
    <Link
      href={href}
      title={isCollapsed ? label : undefined}
      className={`flex items-center gap-3 rounded-lg transition-colors ${
        isActive
          ? "bg-sidebar-item-active-bg text-sidebar-item-active-text font-medium"
          : "text-foreground-muted hover:bg-sidebar-item-hover hover:text-foreground"
      } ${isCollapsed ? "justify-center p-2.5" : "px-4 py-2.5"}`}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
}

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isAdmin = role === "ADMIN";
  const basePath = isAdmin ? "/admin" : "/verifier";

  const commonLinks = [
    { href: basePath, icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
    { href: `${basePath}/cases`, icon: <FileText className="w-5 h-5" />, label: "Hồ sơ vay" },
    { href: `${basePath}/profile`, icon: <User className="w-5 h-5" />, label: "Hồ sơ cá nhân" },
  ];

  const adminLinks = [
    { href: "/admin/users", icon: <Users className="w-5 h-5" />, label: "Quản lý người dùng" },
    { href: "/admin/loans", icon: <Banknote className="w-5 h-5" />, label: "Quản lý khoản vay" },
    { href: "/admin/blockchain", icon: <Blocks className="w-5 h-5" />, label: "Blockchain Monitor" },
    { href: "/admin/verifiers", icon: <UserCheck className="w-5 h-5" />, label: "Quản lý Verifier" },
    { href: "/admin/notifications", icon: <Bell className="w-5 h-5" />, label: "Thông báo" },
    { href: "/admin/settings", icon: <Settings className="w-5 h-5" />, label: "Cài đặt" },
    { href: "/admin/audit-logs", icon: <ClipboardList className="w-5 h-5" />, label: "Nhật ký hệ thống" },
  ];

  return (
    <div className={`h-screen sticky top-0 flex flex-col transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} relative overflow-visible`}>
      {/* Toggle Button - positioned on right border */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-card-bg border border-border rounded-full flex items-center justify-center text-foreground-muted hover:bg-sidebar-item-hover hover:text-foreground transition-colors shadow-md z-50"
        title={isCollapsed ? "Mở rộng" : "Thu gọn"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Logo */}
      <div className="p-3 border-b border-sidebar-border">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-semibold text-foreground">LoanManager</p>
              <p className="text-xs text-foreground-subtle">{isAdmin ? "Admin Portal" : "Verifier Portal"}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-1 overflow-hidden ${isCollapsed ? "p-2" : "p-4"}`}>
        {!isCollapsed && (
          <p className="px-4 py-2 text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
            Menu chính
          </p>
        )}
        {commonLinks.map((link) => (
          <NavItem
            key={link.href}
            href={link.href}
            icon={link.icon}
            label={link.label}
            isActive={pathname === link.href}
            isCollapsed={isCollapsed}
          />
        ))}

        {isAdmin && (
          <>
            {!isCollapsed && (
              <p className="px-4 py-2 mt-6 text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
                Quản trị
              </p>
            )}
            {isCollapsed && <div className="my-4 border-t border-sidebar-border" />}
            {adminLinks.map((link) => (
              <NavItem
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                isActive={pathname === link.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </>
        )}
      </nav>

      {/* User Info */}
      <div className={`border-t border-sidebar-border ${isCollapsed ? "p-2" : "p-4"}`}>
        {isCollapsed ? (
          <div className="flex justify-center">
            <div 
              className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium"
              title={session?.user?.name || session?.user?.email}
            >
              {(session?.user?.name || session?.user?.email)?.charAt(0).toUpperCase()}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3 bg-background-tertiary rounded-lg">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
              {(session?.user?.name || session?.user?.email)?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {session?.user?.name || session?.user?.email}
              </p>
              <p className="text-xs text-foreground-subtle">
                {isAdmin ? "Quản trị viên" : "Người xác minh"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}