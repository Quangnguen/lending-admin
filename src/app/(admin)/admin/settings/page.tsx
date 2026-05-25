"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { History, Pencil, Landmark, Receipt, ShieldAlert, Plug, ArrowRight, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";
import {
  LendingTab,
  FeesTab,
  RiskTab,
  IntegrationsTab,
  SystemConfig,
  SettingsTab,
  mockSystemConfig,
} from "@/components/admin/settings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("lending");
  const [isEditMode, setIsEditMode] = useState(false);
  const [config, setConfig] = useState<SystemConfig>(mockSystemConfig);
  const [originalConfig, setOriginalConfig] = useState<SystemConfig>(mockSystemConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (json.success && json.data && Object.keys(json.data).length > 0) {
        // Merge DB values into existing config structure
        const merged: SystemConfig = {
          lending: { ...mockSystemConfig.lending, ...json.data.lending },
          fees: { ...mockSystemConfig.fees, ...json.data.fees },
          risk: { ...mockSystemConfig.risk, ...json.data.risk },
          integrations: { ...mockSystemConfig.integrations, ...json.data.integrations },
        };
        setConfig(merged);
        setOriginalConfig(merged);
      }
    } catch (err) {
      console.error("[Settings fetch]", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  // Track which sections have changes
  const changedSections = useMemo(() => {
    const sections: Array<{ tab: SettingsTab; label: string }> = [];
    if (JSON.stringify(config.lending) !== JSON.stringify(originalConfig.lending))
      sections.push({ tab: "lending", label: "Lending Policies" });
    if (JSON.stringify(config.fees) !== JSON.stringify(originalConfig.fees))
      sections.push({ tab: "fees", label: "Fee Configuration" });
    if (JSON.stringify(config.risk) !== JSON.stringify(originalConfig.risk))
      sections.push({ tab: "risk", label: "Risk Thresholds" });
    if (JSON.stringify(config.integrations) !== JSON.stringify(originalConfig.integrations))
      sections.push({ tab: "integrations", label: "Integrations" });
    return sections;
  }, [config, originalConfig]);

  const hasChanges = changedSections.length > 0;

  const handleCancel = () => {
    setConfig(originalConfig);
    setIsEditMode(false);
    setSaveResult(null);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setSaveResult(null);
    const tabToCategory: Record<string, string> = {
      lending: "lending", fees: "fees", risk: "risk", integrations: "integrations",
    };

    try {
      for (const section of changedSections) {
        const category = tabToCategory[section.tab];
        const newValues = (config as any)[section.tab];
        const oldValues = (originalConfig as any)[section.tab];
        const changes: Record<string, any> = {};

        Object.keys(newValues).forEach(key => {
          if (JSON.stringify(newValues[key]) !== JSON.stringify(oldValues[key])) {
            changes[key] = newValues[key];
          }
        });

        if (Object.keys(changes).length === 0) continue;

        const res = await fetch("/api/admin/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, changes, reason: "Admin dashboard update" }),
        });
        const json = await res.json();
        if (!json.success) {
          setSaveResult({ success: false, message: `Lỗi khi lưu ${section.label}` });
          setSaving(false);
          return;
        }
      }

      setOriginalConfig(config);
      setIsEditMode(false);
      setSaveResult({ success: true, message: "Cấu hình đã được lưu thành công" });
    } catch (err) {
      setSaveResult({ success: false, message: "Lỗi kết nối server" });
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: "lending", label: "Lending", icon: Landmark },
    { id: "fees", label: "Fees", icon: Receipt },
    { id: "risk", label: "Risk", icon: ShieldAlert },
    { id: "integrations", label: "Integrations", icon: Plug },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">System Configuration</h1>
            <p className="text-foreground-muted">
              Quản lý tham số lending, phí, và ngưỡng rủi ro hệ thống.
              {loading && <span className="ml-2 inline-flex items-center gap-1 text-xs text-primary"><RefreshCw className="w-3 h-3 animate-spin" />Đang tải...</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchSettings}
              className="flex items-center gap-2 px-4 py-2 bg-sidebar-bg border border-card-border rounded-lg text-sm text-foreground hover:bg-card-border transition-colors"
              title="Làm mới từ server"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Reload
            </button>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isEditMode
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              <Pencil className="w-4 h-4" />
              {isEditMode ? "Đang chỉnh sửa..." : "Edit Mode"}
            </button>
          </div>
        </div>

        {/* Save result banner */}
        {saveResult && (
          <div className={`mb-4 rounded-lg px-4 py-3 flex items-center gap-2 text-sm ${saveResult.success ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"}`}>
            {saveResult.success ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {saveResult.message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-card-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const hasTabChange = changedSections.some(s => s.tab === tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "text-primary border-primary"
                    : "text-foreground-muted border-transparent hover:text-foreground hover:border-card-border"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {hasTabChange && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-2 right-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6">
        {activeTab === "lending" && (
          <LendingTab data={config.lending} isEditMode={isEditMode}
            onChange={(lending) => setConfig({ ...config, lending })} />
        )}
        {activeTab === "fees" && (
          <FeesTab data={config.fees} isEditMode={isEditMode}
            onChange={(fees) => setConfig({ ...config, fees })} />
        )}
        {activeTab === "risk" && (
          <RiskTab data={config.risk} isEditMode={isEditMode}
            onChange={(risk) => setConfig({ ...config, risk })} />
        )}
        {activeTab === "integrations" && (
          <IntegrationsTab data={config.integrations} isEditMode={isEditMode}
            onChange={(integrations) => setConfig({ ...config, integrations })} />
        )}
      </div>

      {/* Unsaved Changes Bar */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-card-border p-4 z-50 shadow-xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-sm text-foreground">
                Thay đổi chưa lưu:{" "}
                <span className="font-medium text-primary">
                  {changedSections.map(s => s.label).join(", ")}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleCancel}
                className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground transition-colors">
                Hủy
              </button>
              <button onClick={handleSaveChanges} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}
      {hasChanges && <div className="h-20" />}
    </div>
  );
}
