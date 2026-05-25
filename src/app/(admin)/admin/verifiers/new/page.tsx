"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, Eye, EyeOff, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  role: string;
  status: string;
  password: string;
  confirmPassword: string;
  enable2FA: boolean;
}

export default function CreateVerifierPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    role: "Verifier",
    status: "Active",
    password: "",
    confirmPassword: "",
    enable2FA: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const roles = ["Verifier", "Senior Verifier", "Lead Verifier"];
  const statuses = ["Active", "Inactive"];

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitResult(null);

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password) {
      setSubmitResult({ success: false, message: "Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu" });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setSubmitResult({ success: false, message: "Mật khẩu xác nhận không khớp" });
      return;
    }
    if (formData.password.length < 8) {
      setSubmitResult({ success: false, message: "Mật khẩu phải có ít nhất 8 ký tự" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/verifiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitResult({ success: true, message: `Tài khoản Verifier "${formData.fullName}" đã được tạo thành công!` });
        setTimeout(() => router.push("/admin/verifiers"), 1500);
      } else {
        setSubmitResult({ success: false, message: json.error || json.message || "Tạo tài khoản thất bại" });
      }
    } catch (err) {
      setSubmitResult({ success: false, message: "Lỗi kết nối server" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/verifiers");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={handleCancel}
        className="flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Verifiers
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Create New Verifier</h1>
        <p className="text-foreground-muted mt-1">
          Add a new staff member with verification privileges. Please fill in their details and set
          initial security credentials.
        </p>
      </div>

      {/* Submit result banner */}
      {submitResult && (
        <div className={`rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-medium mb-6 ${
          submitResult.success
            ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
            : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
        }`}>
          {submitResult.success
            ? <CheckCircle className="w-4 h-4 shrink-0" />
            : <AlertTriangle className="w-4 h-4 shrink-0" />}
          {submitResult.message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-card-bg border border-card-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Verifier Details</h2>

          {/* Row 1: Full Name & Email */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="e.g. john.doe@company.com"
                className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Row 2: Role & Status */}
          <div className="grid grid-cols-2 gap-6 mb-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Role</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground text-left flex items-center justify-between focus:outline-none focus:border-primary"
                >
                  {formData.role}
                  <ChevronDown className="w-4 h-4 text-foreground-muted" />
                </button>
                {roleDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setRoleDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-card-bg border border-card-border rounded-lg shadow-lg z-20">
                      {roles.map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => {
                            handleChange("role", role);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-background-tertiary first:rounded-t-lg last:rounded-b-lg ${
                            formData.role === role ? "bg-background-tertiary font-medium" : ""
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Account Status
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground text-left flex items-center justify-between focus:outline-none focus:border-primary"
                >
                  {formData.status}
                  <ChevronDown className="w-4 h-4 text-foreground-muted" />
                </button>
                {statusDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setStatusDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-card-bg border border-card-border rounded-lg shadow-lg z-20">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            handleChange("status", status);
                            setStatusDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-background-tertiary first:rounded-t-lg last:rounded-b-lg ${
                            formData.status === status ? "bg-background-tertiary font-medium" : ""
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Role description */}
          <p className="text-sm text-foreground-muted mb-6">
            Verifiers can review loan applications but cannot modify system settings.
          </p>

          {/* Row 3: Passwords */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Initial Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 pr-12 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm Initial Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 pr-12 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 2FA Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="enable2FA"
              checked={formData.enable2FA}
              onChange={(e) => handleChange("enable2FA", e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-card-border text-primary focus:ring-primary"
            />
            <label htmlFor="enable2FA" className="cursor-pointer">
              <p className="text-sm font-medium text-foreground">
                Enable Two-Factor Authentication (2FA)
              </p>
              <p className="text-sm text-foreground-muted">
                Require the user to verify their identity via a secondary device upon login.
              </p>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 text-foreground font-medium hover:bg-background-tertiary rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Verifier"}
          </button>
        </div>
      </form>
    </div>
  );
}
