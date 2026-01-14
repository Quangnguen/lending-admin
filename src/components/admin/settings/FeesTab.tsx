"use client";

import { useState } from "react";
import { Receipt, ChevronDown } from "lucide-react";
import { FeeConfiguration } from "./types";

interface FeesTabProps {
  data: FeeConfiguration;
  isEditMode: boolean;
  onChange: (data: FeeConfiguration) => void;
}

export default function FeesTab({ data, isEditMode, onChange }: FeesTabProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (field: keyof FeeConfiguration, value: string | number) => {
    onChange({
      ...data,
      [field]: typeof value === "string" && field !== "lateFeeStructure" 
        ? parseFloat(value) || 0 
        : value,
    });
  };

  const lateFeeOptions: Array<"Flat Amount" | "Percentage"> = ["Flat Amount", "Percentage"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Fee Configuration</h3>
        </div>
        {isEditMode && (
          <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
            Editing
          </span>
        )}
      </div>

      {/* Revenue & Origination */}
      <div>
        <h4 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-4">
          Revenue & Origination
        </h4>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm text-foreground mb-2">
              Platform Fee (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={data.platformFee}
                onChange={(e) => handleChange("platformFee", e.target.value)}
                disabled={!isEditMode}
                className="w-full px-4 py-2.5 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted text-sm">
                %
              </span>
            </div>
            <p className="text-xs text-foreground-muted mt-1">
              Taken from principal amount.
            </p>
          </div>
          <div>
            <label className="block text-sm text-foreground mb-2">
              Origination Fee (Flat)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted text-sm">
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={data.originationFeeFlat}
                onChange={(e) => handleChange("originationFeeFlat", e.target.value)}
                disabled={!isEditMode}
                className="w-full pl-7 pr-4 py-2.5 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-foreground-muted mt-1">
              Fixed cost per loan creation.
            </p>
          </div>
          <div>
            <label className="block text-sm text-foreground mb-2">
              Service Fee (Monthly)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted text-sm">
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={data.serviceFeeMonthly}
                onChange={(e) => handleChange("serviceFeeMonthly", e.target.value)}
                disabled={!isEditMode}
                className="w-full pl-7 pr-4 py-2.5 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-foreground-muted mt-1">
              Recurring maintenance fee.
            </p>
          </div>
        </div>
      </div>

      {/* Penalties & Delinquency */}
      <div>
        <h4 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-4">
          Penalties & Delinquency
        </h4>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm text-foreground mb-2">
              Late Fee Structure
            </label>
            <div className="relative">
              <button
                onClick={() => isEditMode && setShowDropdown(!showDropdown)}
                disabled={!isEditMode}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{data.lateFeeStructure}</span>
                <ChevronDown className="w-4 h-4 text-foreground-muted" />
              </button>
              {showDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-card-bg border border-card-border rounded-lg shadow-lg z-10">
                  {lateFeeOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        handleChange("lateFeeStructure", option);
                        setShowDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-sidebar-bg transition-colors ${
                        data.lateFeeStructure === option
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm text-foreground mb-2">
              Late Fee Value
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted text-sm">
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={data.lateFeeValue}
                onChange={(e) => handleChange("lateFeeValue", e.target.value)}
                disabled={!isEditMode}
                className="w-full pl-7 pr-4 py-2.5 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-foreground mb-2">
              Grace Period (Days)
            </label>
            <div className="relative">
              <input
                type="number"
                value={data.gracePeriod}
                onChange={(e) => handleChange("gracePeriod", e.target.value)}
                disabled={!isEditMode}
                className="w-full px-4 py-2.5 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted text-sm">
                days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Adjustments */}
      <div>
        <h4 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-4">
          Adjustments
        </h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-foreground mb-2">
              Prepayment Penalty (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={data.prepaymentPenalty}
                onChange={(e) => handleChange("prepaymentPenalty", e.target.value)}
                disabled={!isEditMode}
                className="w-full px-4 py-2.5 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted text-sm">
                %
              </span>
            </div>
            <p className="text-xs text-foreground-muted mt-1">
              Charged if loan is repaid before 50% term.
            </p>
          </div>
          <div>
            <label className="block text-sm text-foreground mb-2">
              Applicable Tax / VAT (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={data.applicableTax}
                onChange={(e) => handleChange("applicableTax", e.target.value)}
                disabled={!isEditMode}
                className="w-full px-4 py-2.5 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted text-sm">
                %
              </span>
            </div>
            <p className="text-xs text-foreground-muted mt-1">
              Applied on top of all fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
