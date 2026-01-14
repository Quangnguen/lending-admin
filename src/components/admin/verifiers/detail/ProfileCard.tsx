"use client";

import { VerifierDetail } from "../types";
import VerifierAvatar from "../VerifierAvatar";

interface ProfileCardProps {
  verifier: VerifierDetail;
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between py-3 border-b border-card-border last:border-b-0">
      <span className="text-sm text-foreground-muted">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export default function ProfileCard({ verifier }: ProfileCardProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-6">
      {/* Avatar and basic info */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-3">
          {/* Placeholder avatar - in real app would be actual image */}
          <div className="w-full h-full flex items-center justify-center">
            <VerifierAvatar name={verifier.name} size="lg" />
          </div>
        </div>
        <h3 className="font-semibold text-foreground text-lg">{verifier.name}</h3>
        <p className="text-sm text-foreground-muted">{verifier.email}</p>
      </div>

      {/* Info table */}
      <div>
        <InfoRow label="Department" value={verifier.department === "KYC" ? "Risk Assessment" : verifier.department} />
        <InfoRow label="Manager" value={verifier.supervisor} />
        <InfoRow label="Joined Date" value={verifier.joinedDate} />
        <InfoRow label="Phone" value={verifier.phone} />
      </div>
    </div>
  );
}
