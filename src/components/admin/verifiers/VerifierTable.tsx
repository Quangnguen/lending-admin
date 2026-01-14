"use client";

import VerifierAvatar from "./VerifierAvatar";
import VerifierActionMenu from "./VerifierActionMenu";
import { Verifier, statusConfig, departmentBadgeColors } from "./types";

interface VerifierTableProps {
  verifiers: Verifier[];
  onView?: (verifier: Verifier) => void;
  onEdit?: (verifier: Verifier) => void;
  onToggleStatus?: (verifier: Verifier) => void;
}

export default function VerifierTable({
  verifiers,
  onView,
  onEdit,
  onToggleStatus,
}: VerifierTableProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-card-border">
            <th className="text-left px-6 py-4 text-sm font-medium text-foreground-muted">
              Verifier
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-foreground-muted">
              Department
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-foreground-muted">
              Status
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-foreground-muted">
              Total Reviews
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-foreground-muted">
              Pending
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-foreground-muted">
              Approval Rate
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-foreground-muted">
              Last Active
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-foreground-muted">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {verifiers.map((verifier) => (
            <tr
              key={verifier.id}
              className="border-b border-card-border last:border-b-0 hover:bg-background-secondary transition-colors"
            >
              {/* Verifier */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <VerifierAvatar name={verifier.name} />
                  <div>
                    <p className="font-medium text-foreground">{verifier.name}</p>
                    <p className="text-sm text-foreground-muted">{verifier.email}</p>
                  </div>
                </div>
              </td>

              {/* Department */}
              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${departmentBadgeColors[verifier.department]}`}
                >
                  {verifier.department}
                </span>
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${statusConfig[verifier.status].dot}`} />
                  <span className={statusConfig[verifier.status].color}>{verifier.status}</span>
                </div>
              </td>

              {/* Total Reviews */}
              <td className="px-6 py-4">
                <span className="font-medium text-foreground">
                  {verifier.stats.totalReviews.toLocaleString()}
                </span>
              </td>

              {/* Pending */}
              <td className="px-6 py-4">
                <span
                  className={`font-medium ${
                    verifier.stats.pendingCases > 10
                      ? "text-warning"
                      : verifier.stats.pendingCases > 0
                      ? "text-foreground"
                      : "text-foreground-muted"
                  }`}
                >
                  {verifier.stats.pendingCases}
                </span>
              </td>

              {/* Approval Rate */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        verifier.stats.approvalRate >= 75
                          ? "bg-success"
                          : verifier.stats.approvalRate >= 50
                          ? "bg-warning"
                          : "bg-error"
                      }`}
                      style={{ width: `${verifier.stats.approvalRate}%` }}
                    />
                  </div>
                  <span className="text-sm text-foreground-muted">
                    {verifier.stats.approvalRate}%
                  </span>
                </div>
              </td>

              {/* Last Active */}
              <td className="px-6 py-4 text-sm text-foreground-muted">{verifier.lastActive}</td>

              {/* Actions */}
              <td className="px-6 py-4">
                <VerifierActionMenu
                  verifier={verifier}
                  onView={onView}
                  onEdit={onEdit}
                  onToggleStatus={onToggleStatus}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state */}
      {verifiers.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-foreground-muted">Không tìm thấy verifier nào.</p>
        </div>
      )}
    </div>
  );
}
