"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bell, Send, Users, AlertTriangle, RefreshCw,
  Clock, CheckCircle, ChevronDown,
} from "lucide-react";

type TargetGroup = "ALL" | "BORROWERS" | "LENDERS" | "OVERDUE_BORROWERS";
type NotifType = "LOAN" | "SYSTEM" | "TRANSACTION";

interface Broadcast {
  _id: string;
  adminId: { fullName: string; email: string } | null;
  newValue: { title: string; targetGroup: string; recipientCount: number };
  createdAt: string;
}

const TARGET_GROUPS: { value: TargetGroup; label: string; desc: string }[] = [
  { value: "ALL", label: "Tất cả người dùng", desc: "Gửi đến toàn bộ người dùng đã đăng ký" },
  { value: "BORROWERS", label: "Người vay", desc: "Người đã từng tạo yêu cầu vay" },
  { value: "LENDERS", label: "Người cho vay", desc: "Người đã từng cấp vốn cho khoản vay" },
  { value: "OVERDUE_BORROWERS", label: "Người vay quá hạn", desc: "Người đang có khoản vay quá hạn" },
];

export default function NotificationsPage() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const [form, setForm] = useState({
    title: "",
    message: "",
    targetGroup: "ALL" as TargetGroup,
    type: "SYSTEM" as NotifType,
  });

  const fetchBroadcasts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications/broadcast?page=1&limit=20");
      const json = await res.json();
      if (json.success) {
        setBroadcasts(json.data?.data || []);
      }
    } catch (err) {
      console.error("[Broadcasts]", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBroadcasts(); }, [fetchBroadcasts]);

  const handleSend = async () => {
    if (!form.title.trim() || !form.message.trim()) {
      setResult({ success: false, message: "Vui lòng điền đầy đủ tiêu đề và nội dung" });
      return;
    }
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/notifications/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        setResult({ success: true, message: `Đã gửi thông báo đến ${json.recipientCount} người dùng` });
        setForm({ title: "", message: "", targetGroup: "ALL", type: "SYSTEM" });
        setShowForm(false);
        fetchBroadcasts();
      } else {
        setResult({ success: false, message: json.error || "Gửi thất bại" });
      }
    } catch (err) {
      setResult({ success: false, message: "Lỗi kết nối server" });
    } finally {
      setSending(false);
    }
  };

  const selectedGroup = TARGET_GROUPS.find(g => g.value === form.targetGroup);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý thông báo</h1>
          <p className="text-foreground-muted mt-1">Gửi thông báo hàng loạt đến nhóm người dùng</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchBroadcasts}
            className="p-2 rounded-lg hover:bg-background-secondary border border-border transition-colors"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setShowForm(prev => !prev)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <Send className="w-4 h-4" />
            Gửi thông báo mới
          </button>
        </div>
      </div>

      {/* Result banner */}
      {result && (
        <div className={`rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-medium ${result.success ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400" : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400"}`}>
          {result.success ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          {result.message}
        </div>
      )}

      {/* Compose form */}
      {showForm && (
        <div className="bg-card-bg rounded-xl border border-border p-6 space-y-5">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Soạn thông báo
          </h2>

          {/* Target group */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Nhóm nhận</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TARGET_GROUPS.map(g => (
                <button
                  key={g.value}
                  onClick={() => setForm(f => ({ ...f, targetGroup: g.value }))}
                  className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${form.targetGroup === g.value ? "border-primary bg-primary/5" : "border-border hover:bg-background-secondary"}`}
                >
                  <div className={`w-4 h-4 mt-0.5 rounded-full border-2 shrink-0 ${form.targetGroup === g.value ? "border-primary bg-primary" : "border-border"}`} />
                  <div>
                    <p className={`text-sm font-medium ${form.targetGroup === g.value ? "text-primary" : "text-foreground"}`}>{g.label}</p>
                    <p className="text-xs text-foreground-subtle mt-0.5">{g.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-1.5">Loại thông báo</label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value as NotifType }))}
                className="w-full px-3 py-2.5 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground text-sm"
              >
                <option value="SYSTEM">Hệ thống</option>
                <option value="LOAN">Khoản vay</option>
                <option value="TRANSACTION">Giao dịch</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Tiêu đề <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ví dụ: Bảo trì hệ thống vào tối nay"
              maxLength={100}
              className="w-full px-3 py-2.5 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-foreground-subtle text-sm"
            />
            <p className="text-xs text-foreground-subtle mt-1 text-right">{form.title.length}/100</p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nội dung <span className="text-red-500">*</span></label>
            <textarea
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
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
              <p className="text-xs text-foreground-subtle mb-2 font-medium uppercase tracking-wide">Xem trước</p>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{form.title}</p>
                  <p className="text-sm text-foreground-muted mt-1">{form.message}</p>
                  <p className="text-xs text-foreground-subtle mt-2">
                    → {selectedGroup?.label} • {new Date().toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-background-secondary transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !form.title.trim() || !form.message.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? "Đang gửi..." : `Gửi đến ${selectedGroup?.label}`}
            </button>
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-card-bg rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Lịch sử broadcast</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : broadcasts.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-foreground-subtle">
            <Bell className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">Chưa có broadcast nào</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background-tertiary">
                <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Tiêu đề</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Nhóm nhận</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Số người</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Gửi bởi</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-foreground-subtle uppercase">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {broadcasts.map(b => (
                <tr key={b._id} className="hover:bg-background-tertiary transition-colors">
                  <td className="px-6 py-4 font-medium text-sm text-foreground">
                    {b.newValue?.title || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      <Users className="w-3 h-3" />
                      {TARGET_GROUPS.find(g => g.value === b.newValue?.targetGroup)?.label || b.newValue?.targetGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground-muted">
                    {b.newValue?.recipientCount?.toLocaleString("vi-VN") || 0} người
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground-muted">
                    {b.adminId ? (typeof b.adminId === "object" ? b.adminId.fullName || b.adminId.email : "Admin") : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground-subtle">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(b.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
