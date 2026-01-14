"use client";

import {
  Shield,
  CreditCard,
  Scan,
  MapPin,
  CheckCircle2,
  Clock,
  Calendar,
} from "lucide-react";
import { KYCVerificationItem } from "./types";

interface KYCVerificationStatusProps {
  kycLevel: 1 | 2 | 3;
  verificationItems: KYCVerificationItem[];
}

export default function KYCVerificationStatus({
  kycLevel,
  verificationItems,
}: KYCVerificationStatusProps) {
  const getVerificationIcon = (type: string) => {
    switch (type) {
      case "identity":
        return CreditCard;
      case "face":
        return Scan;
      case "address":
        return MapPin;
      default:
        return Shield;
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case "identity":
        return "bg-blue-500/20 text-blue-400";
      case "face":
        return "bg-purple-500/20 text-purple-400";
      case "address":
        return "bg-amber-500/20 text-amber-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            KYC Verification Status
          </h3>
        </div>
        <span className="px-3 py-1.5 bg-green-500/20 text-green-400 text-sm font-medium rounded-full flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          Verified Level {kycLevel}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {verificationItems.map((item) => {
          const Icon = getVerificationIcon(item.type);
          return (
            <div
              key={item.id}
              className="bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconBgColor(item.type)}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-[var(--foreground)]">
                      {item.title}
                    </h4>
                    {item.verified && (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-2">
                    {item.method}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                    {item.expiryDate ? (
                      <>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Expires: {item.expiryDate}</span>
                      </>
                    ) : item.verifiedDate ? (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Verified: {item.verifiedDate}</span>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
