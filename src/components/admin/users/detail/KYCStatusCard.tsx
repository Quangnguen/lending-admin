"use client";

import { Check, X, Minus } from "lucide-react";

interface KYCDetails {
  lastUpdated?: string;
  identityVerified?: boolean;
  identityMethod?: string;
  addressVerified?: boolean;
  addressMethod?: string;
  videoInterview?: boolean;
  videoNote?: string;
  frontIdImageUrl?: string | null;
  backIdImageUrl?: string | null;
  selfieImageUrl?: string | null;
}

interface KYCStatusCardProps {
  kycDetails: KYCDetails;
  onViewDocuments?: () => void;
}

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api/v1";

function buildImageUrl(relPath: string | null | undefined): string | null {
  if (!relPath) return null;
  if (relPath.startsWith("http")) return relPath;
  const base = BACKEND_BASE.replace(/\/api\/v1\/?$/, "");
  return `${base}${relPath}`;
}

interface VerificationItemProps {
  verified?: boolean | null;
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
  const frontUrl   = buildImageUrl(kycDetails.frontIdImageUrl);
  const backUrl    = buildImageUrl(kycDetails.backIdImageUrl);
  const selfieUrl  = buildImageUrl(kycDetails.selfieImageUrl);
  const hasImages  = !!(frontUrl || backUrl || selfieUrl);

  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">KYC Status</h3>
          <span className="text-xs text-foreground-muted">
            Last updated: {kycDetails.lastUpdated || "—"}
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
            description={kycDetails.videoNote || "Không yêu cầu"}
          />
        </div>

        {/* Uploaded KYC Previews inside Status Card */}
        {hasImages && (
          <div className="mt-5 pt-4 border-t border-card-border">
            <p className="text-xs font-semibold text-foreground-muted mb-2">Ảnh tài liệu thực tế:</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { url: frontUrl,  label: "Mặt trước" },
                { url: backUrl,   label: "Mặt sau" },
                { url: selfieUrl, label: "Selfie" },
              ].map((img, i) =>
                img.url ? (
                  <button
                    key={i}
                    onClick={onViewDocuments}
                    className="relative group aspect-square rounded-lg overflow-hidden border border-card-border bg-background-tertiary w-full block hover:border-blue-500/50 transition-colors"
                    title={`Click để xem tài liệu ${img.label}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.label}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[10px] text-white font-medium">{img.label}</span>
                    </div>
                  </button>
                ) : null,
              )}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onViewDocuments}
        className="w-full mt-5 px-4 py-2.5 border border-card-border rounded-lg hover:bg-background-tertiary transition-colors text-sm font-medium"
      >
        Xem chi tiết tài liệu & So khớp
      </button>
    </div>
  );
}
