"use client";

import { Check, X, FileText, LogIn, ArrowRight, Filter, Download } from "lucide-react";
import { ActivityLogItem } from "../types";

interface ActivityLogProps {
  activities: ActivityLogItem[];
  onViewAll?: () => void;
}

const actionIcons: Record<ActivityLogItem["actionType"], React.ReactNode> = {
  approved: (
    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
      <Check className="w-4 h-4 text-success" />
    </div>
  ),
  rejected: (
    <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center">
      <X className="w-4 h-4 text-error" />
    </div>
  ),
  reviewed: (
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
      <FileText className="w-4 h-4 text-primary" />
    </div>
  ),
  login: (
    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
      <LogIn className="w-4 h-4 text-purple-500" />
    </div>
  ),
  other: (
    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
      <FileText className="w-4 h-4 text-foreground-muted" />
    </div>
  ),
};

const statusColors: Record<ActivityLogItem["status"], string> = {
  Success: "bg-success/10 text-success",
  Completed: "bg-primary/10 text-primary",
  Failed: "bg-error/10 text-error",
  Pending: "bg-warning/10 text-warning",
};

export default function ActivityLog({ activities, onViewAll }: ActivityLogProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
        <h3 className="font-semibold text-foreground">Recent Activity Log</h3>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
            <Filter className="w-4 h-4 text-foreground-muted" />
          </button>
          <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
            <Download className="w-4 h-4 text-foreground-muted" />
          </button>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-card-border">
            <th className="text-left px-6 py-3 text-xs font-medium text-foreground-muted uppercase">
              Action
            </th>
            <th className="text-left px-6 py-3 text-xs font-medium text-foreground-muted uppercase">
              Context
            </th>
            <th className="text-left px-6 py-3 text-xs font-medium text-foreground-muted uppercase">
              Status
            </th>
            <th className="text-left px-6 py-3 text-xs font-medium text-foreground-muted uppercase">
              Timestamp
            </th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr
              key={activity.id}
              className="border-b border-card-border last:border-b-0 hover:bg-background-secondary transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {actionIcons[activity.actionType]}
                  <span className="text-sm font-medium text-foreground">{activity.action}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                {activity.context && (
                  <span className="inline-flex px-2.5 py-1 bg-background-secondary rounded text-xs font-mono text-foreground-muted">
                    {activity.context}
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[activity.status]}`}
                >
                  {activity.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-foreground-muted">{activity.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Full Activity Log */}
      <div className="px-6 py-4 border-t border-card-border">
        <button
          onClick={onViewAll}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium mx-auto"
        >
          View Full Activity Log
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
