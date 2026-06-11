"use client";

import { useState } from "react";
import {
  Bell, Send, Users, User, AlertTriangle,
  RefreshCw, CheckCircle, X,
} from "lucide-react";

type SendMode = "ALL" | "TARGETED";

export default function NotificationsPage() {
  const [mode, setMode] = useState<SendMode>("ALL");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const [form, setForm] = useState({
    title: "",
    message: "",
    targetUserIds: "", // comma / newline separated IDs
  });

  const handleSend = async () => {
    if (!form.title.trim() || !form.message.trim()) {
      setResult({ success: false, message: "Vui lòng điền đầy đủ tiêu đề và nội dung" });
      return;
    }

    const targetUserIds =
      mode === "TARGETED"
        ? form.targetUserIds
            .split(/[\n,]+/)
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;

    if (mode === "TARGETED" && (!targetUserIds || targetUserIds.length === 0)) {
      setResult({ success: false, message: "Vui lòng nhập ít nhất một User ID" });
      return;
    }

    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          message: form.message.trim(),
          targetUserIds: targetUserIds ?? [],
        }),
      });
      const json = await res.json();
      if (json.success) {
        setResult({
          success: true,
          message:
            mode === "ALL"
              ? `Đã gửi thông báo đến toàn bộ người dùng (${json.sent} người)`
              : `Đã gửi thông báo đến ${json.sent} người dùng`,
        });
        setForm({ title: "", message: "", targetUserIds: "" });
      } else {
        setResult({ success: false, message: json.error || "Gửi thất bại" });
      }
    } catch {
      setResult({ success: false, message: "Lỗi kết nối server" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gửi thông báo</h1>
        <p className="text-foreground-muted mt-1">Gửi thông báo đến toàn bộ hoặc một số người dùng cụ thể</p>
      </div>

      {/* Result banner */}
      {result && (
        <div className={`rounded-xl px-4 py-3 flex items-center justify-between gap-3 text-sm font-medium ${
          result.success
            ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
            : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
        }`}>
          <span className="flex items-center gap-2">
            {result.success ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            {result.message}
          </span>
          <button onClick={() => setResult(null)} className="p-0.5 rounded hover:opacity-70">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Form */}
      <div className="bg-card-bg rounded-xl border border-border p-6 space-y-5">

        {/* Mode selector */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Đối tượng nhận</label>
          <div className="flex gap-3">
            <button
              onClick={() => setMode("ALL")}
              className={`flex-1 flex items-center gap-2.5 p-3.5 rounded-lg border text-left transition-colors ${
                mode === "ALL" ? "border-primary bg-primary/5" : "border-border hover:bg-background-secondary"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 shrink-0 transition-colors ${mode === "ALL" ? "border-primary bg-primary" : "border-border"}`} />
              <div>
                <p className={`text-sm font-medium ${mode === "ALL" ? "text-primary" : "text-foreground"}`}>
                  <Users className="w-3.5 h-3.5 inline mr-1" />
                  Tất cả người dùng
                </p>
                <p className="text-xs text-foreground-subtle mt-0.5">Gửi broadcast đến toàn bộ tài khoản</p>
              </div>
            </button>
            <button
              onClick={() => setMode("TARGETED")}
              className={`flex-1 flex items-center gap-2.5 p-3.5 rounded-lg border text-left transition-colors ${
                mode === "TARGETED" ? "border-primary bg-primary/5" : "border-border hover:bg-background-secondary"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 shrink-0 transition-colors ${mode === "TARGETED" ? "border-primary bg-primary" : "border-border"}`} />
              <div>
                <p className={`text-sm font-medium ${mode === "TARGETED" ? "text-primary" : "text-foreground"}`}>
                  <User className="w-3.5 h-3.5 inline mr-1" />
                  User cụ thể
                </p>
                <p className="text-xs text-foreground-subtle mt-0.5">Nhập danh sách User ID</p>
              </div>
            </button>
          </div>
        </div>

        {/* Target user IDs (only for TARGETED mode) */}
        {mode === "TARGETED" && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              User ID <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.targetUserIds}
              onChange={(e) => setForm((f) => ({ ...f, targetUserIds: e.target.value }))}
              placeholder={"Nhập User ID, mỗi ID một dòng hoặc cách nhau bằng dấu phẩy:\n6651a3c4b8e2f1a3c4b8e2f1\n6651a3c4b8e2f1a3c4b8e2f2"}
              rows={4}
              className="w-full px-3 py-2.5 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-foreground-subtle text-sm resize-none font-mono"
            />
            <p className="text-xs text-foreground-subtle mt-1">
              {form.targetUserIds.split(/[\n,]+/).filter((s) => s.trim()).length} User ID đã nhập
            </p>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Ví dụ: Thông báo bảo trì hệ thống"
            maxLength={100}
            className="w-full px-3 py-2.5 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-foreground-subtle text-sm"
          />
          <p className="text-xs text-foreground-subtle mt-1 text-right">{form.title.length}/100</p>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Nội dung <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            placeholder="Nhập nội dung chi tiết của thông báo..."
            rows={4}
            maxLength={500}
            className="w-full px-3 py-2.5 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-foreground-subtle text-sm resize-none"
          />
          <p className="text-xs text-foreground-subtle mt-1 text-right">{form.message.length}/500</p>
        </div>

        {/* Preview */}
        {form.title && form.message && (
          <div className="bg-background-secondary rounded-lg p-4 border border-border">
            <p className="text-xs text-foreground-subtle mb-3 font-semibold uppercase tracking-wide">Xem trước</p>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{form.title}</p>
                <p className="text-sm text-foreground-muted mt-1 leading-relaxed">{form.message}</p>
                <p className="text-xs text-foreground-subtle mt-2">
                  {mode === "ALL" ? "→ Tất cả người dùng" : `→ ${form.targetUserIds.split(/[\n,]+/).filter((s) => s.trim()).length} user cụ thể`}
                  {" · "}Ngay bây giờ
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={() => setForm({ title: "", message: "", targetUserIds: "" })}
            disabled={sending}
            className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-background-secondary transition-colors disabled:opacity-50"
          >
            Xóa form
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !form.title.trim() || !form.message.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed min-w-32 justify-center"
          >
            {sending ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Đang gửi...</>
            ) : (
              <><Send className="w-4 h-4" /> Gửi thông báo</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
