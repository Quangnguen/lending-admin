"use client";

import { Lock, Edit } from "lucide-react";
import { VerifierDetail, statusConfig, departmentBadgeColors } from "../types";

interface VerifierHeaderProps {
  verifier: VerifierDetail;
  onLockAccount?: () => void;
  onEditProfile?: () => void;
}

export default function VerifierHeader({ verifier, onLockAccount, onEditProfile }: VerifierHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">{verifier.name}</h1>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${departmentBadgeColors[verifier.department]}`}
          >
            VERIFIER
          </span>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${statusConfig[verifier.status].dot}`} />
            <span className={`text-sm font-medium ${statusConfig[verifier.status].color}`}>
              {verifier.status}
            </span>
          </div>
        </div>

        <p className="text-sm text-foreground-muted mt-1">
          Verifier ID: {verifier.employeeId} • {verifier.location}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onLockAccount}
          className="flex items-center gap-2 px-4 py-2.5 bg-card-bg border border-card-border rounded-lg hover:bg-background-tertiary transition-colors font-medium"
        >
          <Lock className="w-4 h-4" />
          Lock Account
        </button>
        <button
          onClick={onEditProfile}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium"
        >
          <Edit className="w-4 h-4" />
          Edit Profile
        </button>
      </div>
    </div>
  );
}
