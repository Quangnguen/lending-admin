"use client";

import { Shield, Check, Key, LogOut } from "lucide-react";
import { SecurityInfo } from "../types";

interface SecurityCardProps {
  security: SecurityInfo;
  onResetPassword?: () => void;
  onRevokeSessions?: () => void;
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between py-1.5">
      <span className="text-sm text-foreground-muted">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

export default function SecurityCard({ security, onResetPassword, onRevokeSessions }: SecurityCardProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-foreground-muted" />
        <h3 className="font-semibold text-foreground">Security & Access</h3>
      </div>

      {/* 2-Step Verification */}
      <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">2-Step Verification</p>
            <p className="text-xs text-foreground-muted">
              Enabled via {security.twoFactorMethod || "Authenticator"}
            </p>
          </div>
        </div>
        {security.twoFactorEnabled && (
          <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Security info */}
      <div className="space-y-1 mb-4">
        <InfoRow label="Last Active:" value={security.lastActive} />
        <InfoRow label="Last IP:" value={security.lastIP} />
        <InfoRow label="Password Changed:" value={security.passwordChanged} />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onResetPassword}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-card-border rounded-lg hover:bg-background-tertiary transition-colors text-sm font-medium"
        >
          <Key className="w-4 h-4" />
          Reset Password
        </button>
        <button
          onClick={onRevokeSessions}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Revoke Sessions
        </button>
      </div>
    </div>
  );
}
