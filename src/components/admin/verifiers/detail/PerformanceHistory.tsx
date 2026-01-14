"use client";

import { PerformanceRecord } from "../types";

interface PerformanceHistoryProps {
  history: PerformanceRecord[];
}

export default function PerformanceHistory({ history }: PerformanceHistoryProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-5">
      <h3 className="font-semibold text-foreground mb-4">Performance History</h3>

      <table className="w-full">
        <thead>
          <tr className="border-b border-card-border">
            <th className="text-left pb-3 text-xs font-medium text-foreground-muted">Month</th>
            <th className="text-left pb-3 text-xs font-medium text-foreground-muted">Reviews</th>
            <th className="text-left pb-3 text-xs font-medium text-foreground-muted">
              Approval Rate
            </th>
            <th className="text-left pb-3 text-xs font-medium text-foreground-muted">Avg Time</th>
          </tr>
        </thead>
        <tbody>
          {history.map((record, index) => (
            <tr
              key={record.month}
              className={index < history.length - 1 ? "border-b border-card-border" : ""}
            >
              <td className="py-3 text-sm font-medium text-foreground">{record.month}</td>
              <td className="py-3 text-sm text-foreground">{record.reviews}</td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        record.approvalRate >= 75
                          ? "bg-success"
                          : record.approvalRate >= 50
                          ? "bg-warning"
                          : "bg-error"
                      }`}
                      style={{ width: `${record.approvalRate}%` }}
                    />
                  </div>
                  <span className="text-sm text-foreground-muted">{record.approvalRate}%</span>
                </div>
              </td>
              <td className="py-3 text-sm text-foreground-muted">{record.avgTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
