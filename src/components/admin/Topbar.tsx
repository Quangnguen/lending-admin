// src/components/admin/Topbar.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function Topbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <header className="h-16 px-6 flex items-center justify-between bg-card-bg transition-colors">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">Lending Admin</h1>
      </div>

      <div className="flex items-center gap-2">
        {status === "loading" ? (
          <span className="text-sm text-foreground-muted">Loading...</span>
        ) : session?.user ? (
          <>
            <button
              onClick={toggleTheme}
              className="p-2 text-foreground-muted hover:text-foreground hover:bg-sidebar-item-hover rounded-lg transition-colors"
              title={theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={handleSignOut}
              className="p-2 text-foreground-muted hover:text-error hover:bg-error-light rounded-lg transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors"
          >
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
}
