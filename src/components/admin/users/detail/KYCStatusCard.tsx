"use client";

import { Check, X, Minus } from "lucide-react";
import { KYCDetails } from "./types";

interface KYCStatusCardProps {
  kycDetails: KYCDetails;
  onViewDocuments?: () => void;
}

interface VerificationItemProps {
  verified: boolean | null;
  title: string;
  description?: string;
}

function VerificationItem({ verified, title, description }: VerificationItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
          verified === true
            ? "bg-success text-white"
            : verified === false
            ? "bg-error text-white"
            : "bg-gray-300 dark:bg-gray-600 text-foreground-muted"
        }`}
      >
        {verified === true ? (
          <Check className="w-3 h-3" />
        ) : verified === false ? (
          <X className="w-3 h-3" />
        ) : (
          <Minus className="w-3 h-3" />
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-xs text-foreground-muted mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

export default function KYCStatusCard({ kycDetails, onViewDocuments }: KYCStatusCardProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">KYC Status</h3>
        <span className="text-xs text-foreground-muted">
          Last updated: {kycDetails.lastUpdated}
        </span>
      </div>

      <div className="space-y-4">
        <VerificationItem
          verified={kycDetails.identityVerified}
          title="Identity Verified"
          description={kycDetails.identityMethod}
        />
        <VerificationItem
          verified={kycDetails.addressVerified}
          title="Address Verified"
          description={kycDetails.addressMethod}
        />
        <VerificationItem
          verified={kycDetails.videoInterview ? true : null}
          title="Video Interview"
          description={kycDetails.videoNote}
        />
      </div>

      <button
        onClick={onViewDocuments}
        className="w-full mt-4 px-4 py-2.5 border border-card-border rounded-lg hover:bg-background-tertiary transition-colors text-sm font-medium"
      >
        View Documents
      </button>
    </div>
  );
}
