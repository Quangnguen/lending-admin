"use client";

import { PersonalDetails } from "./types";

interface PersonalDetailsCardProps {
  details: PersonalDetails;
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex justify-between py-2.5 border-b border-card-border last:border-b-0">
      <span className="text-sm text-foreground-muted">{label}</span>
      <span className="text-sm font-medium text-foreground text-right whitespace-pre-line">
        {value}
      </span>
    </div>
  );
}

export default function PersonalDetailsCard({ details }: PersonalDetailsCardProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-5">
      <h3 className="font-semibold text-foreground mb-2">Personal Details</h3>

      <div>
        <DetailRow label="Full Name" value={details.fullName} />
        <DetailRow label="Phone" value={details.phone} />
        <DetailRow label="Date of Birth" value={details.dateOfBirth} />
        <DetailRow label="Nationality" value={details.nationality} />
        <DetailRow label="Address" value={details.address} />
      </div>
    </div>
  );
}
