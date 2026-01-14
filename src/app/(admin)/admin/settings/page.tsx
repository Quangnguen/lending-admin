"use client";

import { useState, useMemo } from "react";
import { History, Pencil, Landmark, Receipt, ShieldAlert, Plug, ArrowRight } from "lucide-react";
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

  // Track which sections have changes
  const changedSections = useMemo(() => {
    const sections: string[] = [];
    
    if (JSON.stringify(config.lending) !== JSON.stringify(originalConfig.lending)) {
      sections.push("Lending Policies");
    }
    if (JSON.stringify(config.fees) !== JSON.stringify(originalConfig.fees)) {
      sections.push("Fee Configuration");
    }
    if (JSON.stringify(config.risk) !== JSON.stringify(originalConfig.risk)) {
      sections.push("Risk Thresholds");
    }
    if (JSON.stringify(config.integrations) !== JSON.stringify(originalConfig.integrations)) {
      sections.push("Integrations");
    }
    
    return sections;
  }, [config, originalConfig]);

  const hasChanges = changedSections.length > 0;

  const handleCancel = () => {
    setConfig(originalConfig);
    setIsEditMode(false);
  };

  const handleReviewChanges = () => {
    console.log("Review changes:", config);
    // TODO: Open review modal or submit changes
    setOriginalConfig(config);
    setIsEditMode(false);
  };

  const handleViewHistory = () => {
    console.log("View history");
    // TODO: Open history modal
  };

  const tabs = [
    { id: "lending" as const, label: "Lending", icon: Landmark },
    { id: "fees" as const, label: "Fees", icon: Receipt },
    { id: "risk" as const, label: "Risk", icon: ShieldAlert },
    { id: "integrations" as const, label: "Integrations", icon: Plug },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              System Configuration
            </h1>
            <p className="text-foreground-muted">
              Manage global lending parameters, fee structures, and risk thresholds.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleViewHistory}
              className="flex items-center gap-2 px-4 py-2 bg-sidebar-bg border border-card-border rounded-lg text-sm text-foreground hover:bg-card-border transition-colors"
            >
              <History className="w-4 h-4" />
              View History
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
              {isEditMode ? "Editing..." : "Edit Mode"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-card-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "text-primary border-primary"
                    : "text-foreground-muted border-transparent hover:text-foreground hover:border-card-border"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6">
        {activeTab === "lending" && (
          <LendingTab
            data={config.lending}
            isEditMode={isEditMode}
            onChange={(lending) => setConfig({ ...config, lending })}
          />
        )}
        {activeTab === "fees" && (
          <FeesTab
            data={config.fees}
            isEditMode={isEditMode}
            onChange={(fees) => setConfig({ ...config, fees })}
          />
        )}
        {activeTab === "risk" && (
          <RiskTab
            data={config.risk}
            isEditMode={isEditMode}
            onChange={(risk) => setConfig({ ...config, risk })}
          />
        )}
        {activeTab === "integrations" && (
          <IntegrationsTab
            data={config.integrations}
            isEditMode={isEditMode}
            onChange={(integrations) => setConfig({ ...config, integrations })}
          />
        )}
      </div>

      {/* Unsaved Changes Bar */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-card-border p-4 z-50">
          <div className="max-w-screen-xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-foreground">
                Unsaved changes in{" "}
                <span className="font-medium text-primary">
                  {changedSections.join(", ")}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewChanges}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Review Changes
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed bottom bar */}
      {hasChanges && <div className="h-20" />}
    </div>
  );
}
