"use client";

import { VerifierDetail } from "../types";

interface VerifierInfoCardProps {
  verifier: VerifierDetail;
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between py-2.5 border-b border-card-border last:border-b-0">
      <span className="text-sm text-foreground-muted">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export default function VerifierInfoCard({ verifier }: VerifierInfoCardProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-5">
      <h3 className="font-semibold text-foreground mb-2">Verifier Information</h3>

      <div>
        <InfoRow label="Employee ID" value={verifier.employeeId} />
        <InfoRow label="Department" value={verifier.department} />
        <InfoRow label="Supervisor" value={verifier.supervisor} />
        <InfoRow label="Joined Date" value={verifier.joinedDate} />
        <InfoRow label="Last Active" value={verifier.lastActive} />
      </div>
    </div>
  );
}
