"use client";

import { useState } from "react";
import { KeyRound, FileText, RefreshCw, Lock, Ban, AlertTriangle, X, Loader2 } from "lucide-react";

interface AdminActionsProps {
  userId: string;
  isHighRisk: boolean;
  status: "Active" | "Locked" | "Suspended" | "Pending";
  kycStatus?: string | null;
  onResetPassword?: () => void;
  onViewLogs?: () => void;
  onLockAccount?: () => void;
  onSuspend?: () => void;
  onToggleHighRisk?: (value: boolean) => void;
  onReKYCSuccess?: () => void;
}

export default function AdminActions({
  userId,
  isHighRisk,
  status,
  kycStatus,
  onResetPassword,
  onViewLogs,
  onLockAccount,
  onSuspend,
  onToggleHighRisk,
  onReKYCSuccess,
}: AdminActionsProps) {
  const [highRisk, setHighRisk] = useState(isHighRisk);

  // Re-KYC modal state
  const [showReKYCModal, setShowReKYCModal] = useState(false);
  const [reKycReason, setReKycReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reKycError, setReKycError] = useState<string | null>(null);
  const [reKycSuccess, setReKycSuccess] = useState(false);

  const handleHighRiskToggle = () => {
    const newValue = !highRisk;
    setHighRisk(newValue);
    onToggleHighRisk?.(newValue);
  };

  const handleOpenReKYC = () => {
    setReKycReason("");
    setReKycError(null);
    setReKycSuccess(false);
    setShowReKYCModal(true);
  };

  const handleSubmitReKYC = async () => {
    if (!reKycReason.trim()) {
      setReKycError("Vui lòng nhập lý do yêu cầu xác minh lại.");
      return;
    }
    setIsSubmitting(true);
    setReKycError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/require-rekyc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reKycReason.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setReKycError(data.error || "Không thể gửi yêu cầu. Vui lòng thử lại.");
      } else {
        setReKycSuccess(true);
        setTimeout(() => {
          setShowReKYCModal(false);
          onReKYCSuccess?.();
        }, 1500);
      }
    } catch {
      setReKycError("Lỗi kết nối server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disable Re-KYC nếu chưa verified hoặc đã yêu cầu rồi
  const canReKYC = kycStatus === "COMPLETED";

  return (
    <>
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
              onClick={handleOpenReKYC}
              disabled={!canReKYC}
              title={!canReKYC ? "Chỉ có thể yêu cầu Re-KYC khi đã xác minh" : "Yêu cầu xác minh lại"}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 border rounded-lg transition-colors text-sm ${
                canReKYC
                  ? "border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                  : "border-card-border text-foreground-muted opacity-50 cursor-not-allowed"
              }`}
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

      {/* ── Re-KYC Modal ──────────────────────────────────────────────────── */}
      {showReKYCModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div
            className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--card-border)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Yêu cầu xác minh lại</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">Người dùng sẽ được thông báo và phải thực hiện KYC lại</p>
                </div>
              </div>
              <button
                onClick={() => setShowReKYCModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-[var(--background-tertiary)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {reKycSuccess ? (
                <div className="flex flex-col items-center gap-3 py-6">
                  <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                    <RefreshCw className="w-7 h-7 text-green-400" />
                  </div>
                  <p className="text-green-400 font-semibold">Đã gửi yêu cầu thành công!</p>
                  <p className="text-sm text-[var(--muted-foreground)] text-center">
                    Trạng thái KYC đã được chuyển sang &quot;Yêu cầu xác minh lại&quot;.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Lý do yêu cầu xác minh lại <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={reKycReason}
                      onChange={(e) => { setReKycReason(e.target.value); setReKycError(null); }}
                      placeholder="Ví dụ: Ảnh CCCD không rõ nét, thông tin không khớp với hồ sơ, nghi ngờ gian lận..."
                      rows={4}
                      className="w-full px-3 py-2.5 rounded-lg border border-[var(--card-border)] bg-[var(--sidebar-bg)] text-[var(--foreground)] text-sm placeholder-[var(--muted-foreground)] focus:outline-none focus:border-amber-500/60 resize-none"
                    />
                    {reKycError && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {reKycError}
                      </p>
                    )}
                  </div>

                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <p className="text-xs text-amber-400">
                      ⚠ Hành động này sẽ đặt lại trạng thái KYC của người dùng. Họ sẽ cần thực hiện
                      lại toàn bộ quá trình xác minh từ đầu.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            {!reKycSuccess && (
              <div className="flex gap-3 p-5 border-t border-[var(--card-border)]">
                <button
                  onClick={() => setShowReKYCModal(false)}
                  className="flex-1 px-4 py-2.5 border border-[var(--card-border)] rounded-lg text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-tertiary)] transition-colors"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleSubmitReKYC}
                  disabled={isSubmitting || !reKycReason.trim()}
                  className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Đang gửi...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4" /> Xác nhận yêu cầu</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
