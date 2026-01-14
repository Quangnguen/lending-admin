"use client";

import { Power, RefreshCw, Key, Trash2 } from "lucide-react";

interface QuickActionsProps {
  status: "Active" | "Inactive" | "On Leave";
  onToggleStatus?: () => void;
  onResetPassword?: () => void;
  onReassignCases?: () => void;
  onDelete?: () => void;
}

export default function QuickActions({
  status,
  onToggleStatus,
  onResetPassword,
  onReassignCases,
  onDelete,
}: QuickActionsProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-5">
      <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>

      <div className="space-y-2">
        <button
          onClick={onToggleStatus}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            status === "Active"
              ? "bg-error/10 text-error hover:bg-error/20"
              : "bg-success/10 text-success hover:bg-success/20"
          }`}
        >
          <Power className="w-4 h-4" />
          <span className="font-medium">
            {status === "Active" ? "Deactivate Account" : "Activate Account"}
          </span>
        </button>

        <button
          onClick={onResetPassword}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-background-secondary hover:bg-background-tertiary transition-colors"
        >
          <Key className="w-4 h-4 text-foreground-muted" />
          <span className="font-medium text-foreground">Reset Password</span>
        </button>

        <button
          onClick={onReassignCases}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-background-secondary hover:bg-background-tertiary transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-foreground-muted" />
          <span className="font-medium text-foreground">Reassign Cases</span>
        </button>

        <button
          onClick={onDelete}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-background-secondary hover:bg-error/10 text-error transition-colors mt-4"
        >
          <Trash2 className="w-4 h-4" />
          <span className="font-medium">Delete Verifier</span>
        </button>
      </div>
    </div>
  );
}
