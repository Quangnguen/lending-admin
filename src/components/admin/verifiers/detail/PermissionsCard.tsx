"use client";

import { Shield } from "lucide-react";

interface PermissionsCardProps {
  permissions: string[];
  onManage?: () => void;
}

export default function PermissionsCard({ permissions, onManage }: PermissionsCardProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Permissions</h3>
        <button
          onClick={onManage}
          className="text-sm text-primary hover:text-primary-hover font-medium"
        >
          Manage
        </button>
      </div>

      <div className="space-y-2">
        {permissions.map((permission) => (
          <div
            key={permission}
            className="flex items-center gap-2 px-3 py-2 bg-background-secondary rounded-lg"
          >
            <Shield className="w-4 h-4 text-success" />
            <span className="text-sm text-foreground">{permission}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
