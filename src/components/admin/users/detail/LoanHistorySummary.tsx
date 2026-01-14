"use client";

import Link from "next/link";
import { LoanRecord } from "./types";

interface LoanHistorySummaryProps {
  loans: LoanRecord[];
  onViewAll?: () => void;
}

const statusColors: Record<LoanRecord["status"], string> = {
  Active: "text-primary",
  "Paid Off": "text-success",
  Overdue: "text-warning",
  Default: "text-error",
};

export default function LoanHistorySummary({ loans, onViewAll }: LoanHistorySummaryProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-card-border">
        <h3 className="font-semibold text-foreground">Loan History Summary</h3>
        <button
          onClick={onViewAll}
          className="text-sm text-primary hover:text-primary-hover font-medium"
        >
          View All
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-card-border">
            <th className="text-left px-5 py-3 text-xs font-medium text-foreground-muted">
              Loan ID
            </th>
            <th className="text-left px-5 py-3 text-xs font-medium text-foreground-muted">
              Amount
            </th>
            <th className="text-left px-5 py-3 text-xs font-medium text-foreground-muted">
              Date
            </th>
            <th className="text-left px-5 py-3 text-xs font-medium text-foreground-muted">
              Status
            </th>
            <th className="text-left px-5 py-3 text-xs font-medium text-foreground-muted">
              Progress
            </th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr
              key={loan.id}
              className="border-b border-card-border last:border-b-0 hover:bg-background-secondary transition-colors"
            >
              <td className="px-5 py-3">
                <Link href="#" className="text-sm text-primary hover:underline">
                  {loan.id}
                </Link>
              </td>
              <td className="px-5 py-3 text-sm text-foreground">
                ${loan.amount.toLocaleString()}.00
              </td>
              <td className="px-5 py-3 text-sm text-foreground-muted">{loan.date}</td>
              <td className="px-5 py-3">
                <span className={`text-sm font-medium ${statusColors[loan.status]}`}>
                  {loan.status}
                </span>
              </td>
              <td className="px-5 py-3">
                {loan.status === "Active" && loan.progress !== undefined ? (
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${loan.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-foreground-muted">{loan.progress}%</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-success text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Completed
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
