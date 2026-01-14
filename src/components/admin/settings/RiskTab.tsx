"use client";

import { ShieldAlert, AlertTriangle, Zap, Search, CheckCircle2, Info } from "lucide-react";
import { RiskThresholds } from "./types";

interface RiskTabProps {
  data: RiskThresholds;
  isEditMode: boolean;
  onChange: (data: RiskThresholds) => void;
}

export default function RiskTab({ data, isEditMode, onChange }: RiskTabProps) {
  const handleChange = (field: keyof RiskThresholds, value: string | boolean) => {
    onChange({
      ...data,
      [field]: typeof value === "boolean" ? value : parseFloat(value) || 0,
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Risk Thresholds</h3>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Audit Log Active
        </span>
      </div>

      {/* Emergency Circuit Breaker */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-foreground mb-1">
                Emergency Circuit Breaker
              </h4>
              <p className="text-sm text-foreground-muted leading-relaxed">
                Immediately halts all new loan originations.<br />
                Existing loans remain active but cannot be rolled over.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              data.emergencyCircuitBreaker ? "text-red-400" : "text-foreground-muted"
            }`}>
              {data.emergencyCircuitBreaker ? "EMERGENCY" : "SYSTEM"}<br />
              {data.emergencyCircuitBreaker ? "ACTIVE" : "ACTIVE"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.emergencyCircuitBreaker}
                onChange={(e) => handleChange("emergencyCircuitBreaker", e.target.checked)}
                disabled={!isEditMode}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-card-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500 peer-disabled:opacity-60 peer-disabled:cursor-not-allowed"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Default & Liquidation Parameters */}
      <div>
        <h4 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-4">
          Default & Liquidation Parameters
        </h4>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-1 mb-2">
              <label className="block text-sm text-foreground">
                Days Overdue for Default
              </label>
              <Info className="w-3.5 h-3.5 text-foreground-muted" />
            </div>
            <div className="relative">
              <input
                type="number"
                value={data.daysOverdueDefault}
                onChange={(e) => handleChange("daysOverdueDefault", e.target.value)}
                disabled={!isEditMode}
                className="w-full px-4 py-2.5 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted text-sm">
                days
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-2">
              <label className="block text-sm text-foreground">
                Health Factor Threshold
              </label>
              <Info className="w-3.5 h-3.5 text-foreground-muted" />
            </div>
            <input
              type="number"
              step="0.01"
              value={data.healthFactorThreshold}
              onChange={(e) => handleChange("healthFactorThreshold", e.target.value)}
              disabled={!isEditMode}
              className="w-full px-4 py-2.5 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground mb-2">
              Global Debt Ceiling
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted text-sm">
                $
              </span>
              <input
                type="text"
                value={formatCurrency(data.globalDebtCeiling)}
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, "");
                  handleChange("globalDebtCeiling", value);
                }}
                disabled={!isEditMode}
                className="w-full pl-7 pr-4 py-2.5 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Cards */}
      <div className="grid grid-cols-2 gap-6">
        {/* Auto-Liquidation Protocol */}
        <div className="bg-sidebar-bg border border-card-border rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  Auto-Liquidation Protocol
                </h4>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  Automatically trigger smart contract sale of collateral when Health Factor &lt; 1.0
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={data.autoLiquidationProtocol}
                onChange={(e) => handleChange("autoLiquidationProtocol", e.target.checked)}
                disabled={!isEditMode}
                className="sr-only peer"
              />
              <div className="w-6 h-6 bg-card-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:bg-primary flex items-center justify-center peer-disabled:opacity-60 peer-disabled:cursor-not-allowed">
                {data.autoLiquidationProtocol && (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                )}
              </div>
            </label>
          </div>
        </div>

        {/* High Value Review */}
        <div className="bg-sidebar-bg border border-card-border rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  High Value Review
                </h4>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  Manual approval required<br />
                  for loans &gt; $50k
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={data.highValueReview}
                onChange={(e) => handleChange("highValueReview", e.target.checked)}
                disabled={!isEditMode}
                className="sr-only peer"
              />
              <div className="w-6 h-6 bg-card-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:bg-primary flex items-center justify-center peer-disabled:opacity-60 peer-disabled:cursor-not-allowed">
                {data.highValueReview && (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                )}
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
