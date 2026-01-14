"use client";

import { Landmark } from "lucide-react";
import { LendingPolicies } from "./types";

interface LendingTabProps {
  data: LendingPolicies;
  isEditMode: boolean;
  onChange: (data: LendingPolicies) => void;
}

export default function LendingTab({ data, isEditMode, onChange }: LendingTabProps) {
  const handleChange = (field: keyof LendingPolicies, value: string) => {
    onChange({
      ...data,
      [field]: parseFloat(value) || 0,
    });
  };

  return (
    <div className="space-y-8">
      {/* Lending Policies */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Landmark className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Lending Policies</h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-foreground-muted mb-2">
              Minimum Loan Amount ($)
            </label>
            <input
              type="number"
              value={data.minLoanAmount}
              onChange={(e) => handleChange("minLoanAmount", e.target.value)}
              disabled={!isEditMode}
              className="w-full px-4 py-2.5 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground-muted mb-2">
              Maximum Loan Amount ($)
            </label>
            <input
              type="number"
              value={data.maxLoanAmount}
              onChange={(e) => handleChange("maxLoanAmount", e.target.value)}
              disabled={!isEditMode}
              className="w-full px-4 py-2.5 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground-muted mb-2">
              Max Duration (Days)
            </label>
            <input
              type="number"
              value={data.maxDuration}
              onChange={(e) => handleChange("maxDuration", e.target.value)}
              disabled={!isEditMode}
              className="w-full px-4 py-2.5 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground-muted mb-2">
              Base Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={data.baseInterestRate}
              onChange={(e) => handleChange("baseInterestRate", e.target.value)}
              disabled={!isEditMode}
              className="w-full px-4 py-2.5 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-foreground-muted mb-2">
              Collateral Ratio (%)
            </label>
            <input
              type="number"
              value={data.collateralRatio}
              onChange={(e) => handleChange("collateralRatio", e.target.value)}
              disabled={!isEditMode}
              className="w-full px-4 py-2.5 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-foreground-muted mt-1">
              Minimum collateral value required relative to loan amount.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
