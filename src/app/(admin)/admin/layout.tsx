// src/app/(admin)/admin/layout.tsx
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background-secondary">
      <aside className="border-r border-sidebar-border bg-sidebar-bg flex-shrink-0 overflow-visible relative z-20">
        <Sidebar />
      </aside>
      <main className="flex-1 min-w-0">
        <div className="border-b border-border bg-card-bg">
          <Topbar />
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
