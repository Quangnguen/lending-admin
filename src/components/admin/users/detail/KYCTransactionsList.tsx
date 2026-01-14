"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  XCircle,
  Receipt,
  ExternalLink,
} from "lucide-react";
import { Transaction } from "./types";

interface KYCTransactionsListProps {
  transactions: Transaction[];
}

export default function KYCTransactionsList({
  transactions,
}: KYCTransactionsListProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "Disbursed":
        return ArrowDownLeft;
      case "Repayment":
        return ArrowUpRight;
      case "Payment Failed":
        return XCircle;
      case "Fee":
      case "Refund":
        return Receipt;
      default:
        return Receipt;
    }
  };

  const getTransactionStyle = (type: string) => {
    switch (type) {
      case "Disbursed":
        return {
          icon: "bg-green-500/20 text-green-400",
          amount: "text-green-400",
        };
      case "Repayment":
        return {
          icon: "bg-blue-500/20 text-blue-400",
          amount: "text-[var(--foreground)]",
        };
      case "Payment Failed":
        return {
          icon: "bg-red-500/20 text-red-400",
          amount: "text-red-400",
        };
      case "Fee":
        return {
          icon: "bg-amber-500/20 text-amber-400",
          amount: "text-amber-400",
        };
      case "Refund":
        return {
          icon: "bg-purple-500/20 text-purple-400",
          amount: "text-purple-400",
        };
      default:
        return {
          icon: "bg-gray-500/20 text-gray-400",
          amount: "text-[var(--foreground)]",
        };
    }
  };

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    const prefix = amount >= 0 ? "+" : "-";
    return `${prefix}$${absAmount.toLocaleString()}`;
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          Recent Transactions
        </h3>
        <button className="flex items-center gap-1.5 text-sm text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors">
          View All Transactions
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => {
          const Icon = getTransactionIcon(transaction.type);
          const style = getTransactionStyle(transaction.type);
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${style.icon}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {transaction.description || transaction.type}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {transaction.date} at {transaction.time}
                  </p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${style.amount}`}>
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          );
        })}
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-8 text-[var(--muted-foreground)]">
          No transactions found
        </div>
      )}
    </div>
  );
}
