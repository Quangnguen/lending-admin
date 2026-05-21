"use client";

import { useState } from "react";
import {
  Shield,
  CreditCard,
  Scan,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  MapPin,
  Hash,
  Flag,
  Home,
  Building2,
  CalendarCheck,
  Star,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface KYCDetails {
  lastUpdated?: string;
  identityVerified?: boolean;
  idNumber?: string | null;
  fullName?: string | null;
  dob?: string | null;
  sex?: string | null;
  nationality?: string | null;
  home?: string | null;
  address?: string | null;
  doe?: string | null;
  issueDate?: string | null;
  issueLoc?: string | null;
  idType?: string | null;
  features?: string | null;
  frontIdImageUrl?: string | null;
  backIdImageUrl?: string | null;
  selfieImageUrl?: string | null;
  faceMatchScore?: number | null;
  kycStatus?: string | null;
  reKycReason?: string | null;
  reKycRequestedAt?: string | null;
}

interface KYCVerificationStatusProps {
  kycDetails: KYCDetails;
  userId: string;
  onRequireReverify?: (reason: string) => void;
}

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api/v1";

function buildImageUrl(relPath: string | null | undefined): string | null {
  if (!relPath) return null;
  if (relPath.startsWith("http")) return relPath;
  const base = BACKEND_BASE.replace(/\/api\/v1\/?$/, "");
  return `${base}${relPath}`;
}

export default function KYCVerificationStatus({
  kycDetails,
  userId,
  onRequireReverify,
}: KYCVerificationStatusProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const kycStatusBadge = () => {
    switch (kycDetails.kycStatus) {
      case "COMPLETED":
        return (
          <span className="px-3 py-1.5 bg-green-500/20 text-green-400 text-sm font-medium rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Đã xác minh
          </span>
        );
      case "REQUIRE_REVERIFY":
        return (
          <span className="px-3 py-1.5 bg-amber-500/20 text-amber-400 text-sm font-medium rounded-full flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4" /> Yêu cầu xác minh lại
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-3 py-1.5 bg-red-500/20 text-red-400 text-sm font-medium rounded-full flex items-center gap-1.5">
            <XCircle className="w-4 h-4" /> Bị từ chối
          </span>
        );
      case "ID_VERIFIED":
      case "FACE_VERIFIED":
        return (
          <span className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-full flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Đang xử lý
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 bg-gray-500/20 text-gray-400 text-sm font-medium rounded-full flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Chưa xác minh
          </span>
        );
    }
  };

  const ocrRows: { icon: React.ElementType; label: string; value: string | null | undefined; color: string }[] = [
    { icon: Hash,        label: "Số CCCD/CMND",    value: kycDetails.idNumber,    color: "text-blue-400" },
    { icon: User,        label: "Họ và tên",         value: kycDetails.fullName,    color: "text-purple-400" },
    { icon: Calendar,    label: "Ngày sinh",         value: kycDetails.dob,         color: "text-green-400" },
    { icon: Flag,        label: "Giới tính",         value: kycDetails.sex,         color: "text-amber-400" },
    { icon: Flag,        label: "Quốc tịch",         value: kycDetails.nationality, color: "text-cyan-400" },
    { icon: Home,        label: "Quê quán",          value: kycDetails.home,        color: "text-rose-400" },
    { icon: MapPin,      label: "Nơi thường trú",    value: kycDetails.address,     color: "text-pink-400" },
    { icon: CalendarCheck, label: "Ngày hết hạn",   value: kycDetails.doe,         color: "text-orange-400" },
    { icon: Calendar,    label: "Ngày cấp",          value: kycDetails.issueDate,   color: "text-teal-400" },
    { icon: Building2,   label: "Nơi cấp",           value: kycDetails.issueLoc,    color: "text-indigo-400" },
    { icon: Star,        label: "Đặc điểm nhận dạng", value: kycDetails.features,  color: "text-yellow-400" },
  ];

  const hasAnyOcrData = ocrRows.some((r) => r.value);
  const frontUrl   = buildImageUrl(kycDetails.frontIdImageUrl);
  const backUrl    = buildImageUrl(kycDetails.backIdImageUrl);
  const selfieUrl  = buildImageUrl(kycDetails.selfieImageUrl);
  const hasImages  = !!(frontUrl || backUrl || selfieUrl);

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">KYC Verification</h3>
              {kycDetails.lastUpdated && (
                <p className="text-xs text-[var(--muted-foreground)]">Cập nhật: {kycDetails.lastUpdated}</p>
              )}
            </div>
          </div>
          {kycStatusBadge()}
        </div>

        {/* Re-KYC warning */}
        {kycDetails.kycStatus === "REQUIRE_REVERIFY" && kycDetails.reKycReason && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-400">Lý do yêu cầu xác minh lại</p>
              <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{kycDetails.reKycReason}</p>
              {kycDetails.reKycRequestedAt && (
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Ngày yêu cầu: {kycDetails.reKycRequestedAt}</p>
              )}
            </div>
          </div>
        )}

        {/* Face match score */}
        {kycDetails.faceMatchScore != null && (
          <div className="mt-4 flex items-center gap-4 p-3 bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Scan className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Độ khớp khuôn mặt</p>
              <p className="text-lg font-bold text-[var(--foreground)]">
                {kycDetails.faceMatchScore}%{" "}
                <span className={`text-sm font-medium ${kycDetails.faceMatchScore >= 60 ? "text-green-400" : "text-red-400"}`}>
                  {kycDetails.faceMatchScore >= 60 ? "✓ Đạt" : "✗ Không đạt"}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* OCR Data */}
      {hasAnyOcrData && (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <h4 className="font-semibold text-[var(--foreground)]">Thông tin từ CCCD/CMND</h4>
            {kycDetails.idType && (
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">
                {kycDetails.idType}
              </span>
            )}
          </div>

          <div className="divide-y divide-[var(--card-border)]">
            {ocrRows
              .filter((r) => r.value)
              .map((row, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5">
                  <row.icon className={`w-4 h-4 flex-shrink-0 ${row.color}`} />
                  <span className="text-xs text-[var(--muted-foreground)] w-36 flex-shrink-0">{row.label}</span>
                  <span className="text-sm font-medium text-[var(--foreground)] flex-1">{row.value}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Uploaded Images */}
      {hasImages && (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
          <h4 className="font-semibold text-[var(--foreground)] mb-4">Ảnh giấy tờ đã tải lên</h4>
          <div className="grid grid-cols-3 gap-4">
            {[
              { url: frontUrl,  label: "Mặt trước CCCD" },
              { url: backUrl,   label: "Mặt sau CCCD" },
              { url: selfieUrl, label: "Ảnh selfie" },
            ].map((img, i) =>
              img.url ? (
                <div key={i} className="space-y-2">
                  <p className="text-xs text-[var(--muted-foreground)] font-medium">{img.label}</p>
                  <button
                    onClick={() => setSelectedImage(img.url!)}
                    className="block w-full aspect-video rounded-lg overflow-hidden border border-[var(--card-border)] hover:border-blue-500/60 transition-colors bg-[var(--sidebar-bg)]"
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
                  </button>
                </div>
              ) : null,
            )}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedImage} alt="KYC document" className="w-full rounded-xl shadow-2xl" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-lg font-bold transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
