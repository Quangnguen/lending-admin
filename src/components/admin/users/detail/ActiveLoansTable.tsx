"use client";

import { Landmark, ExternalLink } from "lucide-react";
import { ActiveLoan } from "./types";

interface ActiveLoansTableProps {
  loans: ActiveLoan[];
}

export default function ActiveLoansTable({ loans }: ActiveLoansTableProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400";
      case "Overdue":
        return "bg-red-500/20 text-red-400";
      case "Paid Off":
        return "bg-blue-500/20 text-blue-400";
      case "Default":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Landmark className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Active Loans
          </h3>
        </div>
        <button className="flex items-center gap-1.5 text-sm text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors">
          View All
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--card-border)]">
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Loan ID
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Interest Rate
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Start Date
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Next Payment
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--card-border)]">
            {loans.map((loan) => (
              <tr
                key={loan.id}
                className="hover:bg-[var(--sidebar-bg)] transition-colors"
              >
                <td className="py-4 px-4">
                  <span className="text-sm font-medium text-[var(--primary)]">
                    #{loan.id}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {formatCurrency(loan.amount)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-[var(--foreground)]">
                    {loan.interestRate}%
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {loan.startDate}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {loan.nextPayment}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(loan.status)}`}
                  >
                    {loan.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loans.length === 0 && (
        <div className="text-center py-8 text-[var(--muted-foreground)]">
          No active loans found
        </div>
      )}
    </div>
  );
}
