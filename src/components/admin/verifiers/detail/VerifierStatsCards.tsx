"use client";

import { CheckCircle, ThumbsUp, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { VerifierStats } from "../types";

interface VerifierStatsCardsProps {
  stats: VerifierStats;
}

export default function VerifierStatsCards({ stats }: VerifierStatsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Cases Processed */}
      <div className="bg-card-bg border border-card-border rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-foreground-muted">Cases Processed</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-bold text-foreground">
                {stats.totalReviews.toLocaleString()}
              </p>
              <span className="flex items-center text-xs text-success">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                12%
              </span>
            </div>
            <p className="text-xs text-foreground-muted mt-1">This month</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Approval Rate */}
      <div className="bg-card-bg border border-card-border rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-foreground-muted">Approval Rate</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-bold text-foreground">{stats.approvalRate}%</p>
              <span className="flex items-center text-xs text-error">
                <TrendingDown className="w-3 h-3 mr-0.5" />
                0.2%
              </span>
            </div>
            <p className="text-xs text-foreground-muted mt-1">vs. last month</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
            <ThumbsUp className="w-5 h-5 text-success" />
          </div>
        </div>
      </div>

      {/* Avg. Decision Time */}
      <div className="bg-card-bg border border-card-border rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-foreground-muted">Avg. Decision Time</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-bold text-foreground">{stats.avgReviewTime}</p>
              <span className="flex items-center text-xs text-success">
                <TrendingDown className="w-3 h-3 mr-0.5" />
                5m
              </span>
            </div>
            <p className="text-xs text-foreground-muted mt-1">Efficiency metric</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-warning" />
          </div>
        </div>
      </div>
    </div>
  );
}
