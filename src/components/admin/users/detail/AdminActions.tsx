"use client";

import { useState } from "react";
import { KeyRound, FileText, RefreshCw, Lock, Ban, AlertTriangle } from "lucide-react";

interface AdminActionsProps {
  isHighRisk: boolean;
  status: "Active" | "Locked" | "Suspended" | "Pending";
  onResetPassword?: () => void;
  onViewLogs?: () => void;
  onReKYC?: () => void;
  onLockAccount?: () => void;
  onSuspend?: () => void;
  onToggleHighRisk?: (value: boolean) => void;
}

export default function AdminActions({
  isHighRisk,
  status,
  onResetPassword,
  onViewLogs,
  onReKYC,
  onLockAccount,
  onSuspend,
  onToggleHighRisk,
}: AdminActionsProps) {
  const [highRisk, setHighRisk] = useState(isHighRisk);

  const handleHighRiskToggle = () => {
    const newValue = !highRisk;
    setHighRisk(newValue);
    onToggleHighRisk?.(newValue);
  };

  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-5">
      <h3 className="font-semibold text-foreground mb-4">Admin Actions</h3>

      <div className="space-y-3">
        {/* Action buttons row 1 */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onResetPassword}
            className="flex items-center justify-center gap-2 px-3 py-2.5 border border-card-border rounded-lg hover:bg-background-tertiary transition-colors text-sm"
          >
            <KeyRound className="w-4 h-4" />
            Reset Password
          </button>
          <button
            onClick={onViewLogs}
            className="flex items-center justify-center gap-2 px-3 py-2.5 border border-card-border rounded-lg hover:bg-background-tertiary transition-colors text-sm"
          >
            <FileText className="w-4 h-4" />
            Logs
          </button>
          <button
            onClick={onReKYC}
            className="flex items-center justify-center gap-2 px-3 py-2.5 border border-card-border rounded-lg hover:bg-background-tertiary transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Re-KYC
          </button>
        </div>

        {/* Action buttons row 2 */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onLockAccount}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              status === "Locked"
                ? "bg-error text-white"
                : "bg-error/10 text-error hover:bg-error/20"
            }`}
          >
            <Lock className="w-4 h-4" />
            {status === "Locked" ? "Unlock Account" : "Lock Account"}
          </button>
          <button
            onClick={onSuspend}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              status === "Suspended"
                ? "bg-warning text-white"
                : "bg-warning/10 text-warning hover:bg-warning/20"
            }`}
          >
            <Ban className="w-4 h-4" />
            {status === "Suspended" ? "Unsuspend" : "Suspend"}
          </button>
        </div>

        {/* High Risk Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-card-border mt-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${highRisk ? "text-error" : "text-foreground-muted"}`} />
            <span className="text-sm font-medium">High Risk</span>
          </div>
          <button
            onClick={handleHighRiskToggle}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              highRisk ? "bg-error" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                highRisk ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
