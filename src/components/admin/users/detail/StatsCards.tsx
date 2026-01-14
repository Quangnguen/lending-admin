"use client";

import { TrendingUp } from "lucide-react";
import { UserStats } from "./types";

interface StatsCardsProps {
  stats: UserStats;
}

const riskLevelColors: Record<UserStats["riskLevel"], string> = {
  Low: "text-success",
  Medium: "text-warning",
  High: "text-error",
};

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Total Borrowed */}
      <div className="bg-card-bg border border-card-border rounded-xl p-5">
        <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide">
          Total Borrowed
        </p>
        <p className="text-2xl font-bold text-foreground mt-2">
          ${stats.totalBorrowed.toLocaleString()}
        </p>
        {stats.percentile && (
          <p className="flex items-center gap-1 text-xs text-success mt-2">
            <TrendingUp className="w-3 h-3" />
            Top {stats.percentile}% of borrowers
          </p>
        )}
      </div>

      {/* Active Loans */}
      <div className="bg-card-bg border border-card-border rounded-xl p-5">
        <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide">
          Active Loans
        </p>
        <p className="text-2xl font-bold text-foreground mt-2">
          {stats.activeLoans}{" "}
          <span className="text-base font-normal text-foreground-muted">
            of {stats.totalLoans} total
          </span>
        </p>
        <p className="text-xs text-foreground-muted mt-2">
          Next payment in {stats.nextPaymentDays} days
        </p>
      </div>

      {/* Risk Score */}
      <div className="bg-card-bg border border-card-border rounded-xl p-5">
        <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide">
          Risk Score
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className={`text-2xl font-bold ${riskLevelColors[stats.riskLevel]}`}>
            {stats.riskLevel}
          </span>
          <span className="text-sm text-foreground-muted">
            (Score: {stats.riskScore}/100)
          </span>
        </div>
      </div>
    </div>
  );
}
