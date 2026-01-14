"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Transaction } from "./types";

interface RecentTransactionsProps {
  transactions: Transaction[];
  onViewAll?: () => void;
}

const transactionIcons: Record<Transaction["type"], { icon: React.ReactNode; bg: string }> = {
  Repayment: {
    icon: <ArrowUpRight className="w-4 h-4 text-warning" />,
    bg: "bg-warning/10",
  },
  Disbursed: {
    icon: <ArrowDownLeft className="w-4 h-4 text-success" />,
    bg: "bg-success/10",
  },
  Fee: {
    icon: <ArrowUpRight className="w-4 h-4 text-error" />,
    bg: "bg-error/10",
  },
  Refund: {
    icon: <ArrowDownLeft className="w-4 h-4 text-primary" />,
    bg: "bg-primary/10",
  },
  "Payment Failed": {
    icon: <ArrowUpRight className="w-4 h-4 text-error" />,
    bg: "bg-error/10",
  },
};

export default function RecentTransactions({ transactions, onViewAll }: RecentTransactionsProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-5">
      <h3 className="font-semibold text-foreground mb-4">Recent Transactions</h3>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transactionIcons[transaction.type].bg
              }`}
            >
              {transactionIcons[transaction.type].icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{transaction.type}</p>
              <p className="text-xs text-foreground-muted">
                {transaction.date}, {transaction.time}
              </p>
            </div>
            <p
              className={`text-sm font-semibold ${
                transaction.amount > 0 ? "text-success" : "text-foreground"
              }`}
            >
              {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}.00
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={onViewAll}
        className="w-full mt-4 px-4 py-2.5 border border-card-border rounded-lg hover:bg-background-tertiary transition-colors text-sm font-medium"
      >
        View All Transactions
      </button>
    </div>
  );
}
