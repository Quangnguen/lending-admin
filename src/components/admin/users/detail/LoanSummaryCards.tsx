"use client";

import { Wallet, CheckCircle2, MessageSquare } from "lucide-react";
import { LoanSummary } from "./types";

interface LoanSummaryCardsProps {
  summary: LoanSummary;
}

export default function LoanSummaryCards({ summary }: LoanSummaryCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const cards = [
    {
      icon: Wallet,
      label: "TOTAL BORROWED",
      value: summary.totalBorrowed,
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      icon: CheckCircle2,
      label: "TOTAL REPAID",
      value: summary.totalRepaid,
      iconBg: "bg-green-500/20",
      iconColor: "text-green-400",
    },
    {
      icon: MessageSquare,
      label: "OUTSTANDING",
      value: summary.outstanding,
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${card.iconBg}`}
              >
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)] font-medium uppercase tracking-wider mb-1">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  {formatCurrency(card.value)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
