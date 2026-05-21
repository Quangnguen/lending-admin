"use client";

import { useState } from "react";
import { FileText, Shield, User, X, ZoomIn, ExternalLink } from "lucide-react";
import { UploadedDocument } from "./types";

interface UploadedDocumentsProps {
  documents: UploadedDocument[];
}

const BACKEND_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api/v1")
  .replace(/\/api\/v1\/?$/, "");

/**
 * Xây dựng URL ảnh:
 * - Cloudinary URL (https://res.cloudinary.com/...) → trả về trực tiếp
 * - URL tương đối cũ (/uploads/kyc/...) → ghép với backend base (legacy)
 */
function buildImageUrl(relPath: string | null | undefined): string | null {
  if (!relPath) return null;
  if (relPath.startsWith("http")) return relPath; // Cloudinary hoặc URL đầy đủ
  return `${BACKEND_BASE}${relPath}`;             // Legacy local disk
}


function getDocMeta(type: string) {
  switch (type) {
    case "id_front":
      return { label: "CCCD/CMND - Mặt trước", icon: Shield, color: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400" };
    case "id_back":
      return { label: "CCCD/CMND - Mặt sau", icon: FileText, color: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-400" };
    case "selfie":
      return { label: "Ảnh selfie xác thực", icon: User, color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400" };
    default:
      return { label: type, icon: FileText, color: "from-gray-500/20 to-gray-600/10 border-gray-500/30 text-gray-400" };
  }
}

export default function UploadedDocuments({ documents }: UploadedDocumentsProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (!documents || documents.length === 0) {
    return (
      <div className="bg-card-bg border border-card-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">Tài liệu KYC</h3>
          <span className="text-xs text-foreground-muted bg-background-tertiary px-2 py-0.5 rounded-full">0 files</span>
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-foreground-muted gap-2">
          <FileText className="w-8 h-8 opacity-30" />
          <p className="text-sm">Chưa có tài liệu nào được tải lên</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-3xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white flex items-center gap-1 text-sm"
            >
              <X className="w-4 h-4" /> Đóng
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox}
              alt="Document preview"
              className="w-full rounded-xl shadow-2xl border border-white/10"
            />
            <a
              href={lightbox}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/60 hover:text-white"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Mở trong tab mới
            </a>
          </div>
        </div>
      )}

      <div className="bg-card-bg border border-card-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">Tài liệu KYC</h3>
          <span className="text-xs text-foreground-muted bg-background-tertiary px-2 py-0.5 rounded-full">
            {documents.length} files
          </span>
        </div>

        <div className="space-y-3">
          {documents.map((doc) => {
            const imgUrl = buildImageUrl(doc.url);
            const { label, icon: Icon, color } = getDocMeta(doc.type);

            return (
              <div
                key={doc.id}
                className="border border-card-border rounded-xl overflow-hidden"
              >
                {/* Image preview */}
                {imgUrl ? (
                  <div
                    className="relative group cursor-zoom-in bg-background-tertiary"
                    onClick={() => setLightbox(imgUrl)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={label}
                      className="w-full object-cover max-h-48"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                        (e.currentTarget.nextElementSibling as HTMLElement | null)?.classList.remove("hidden");
                      }}
                    />
                    {/* Fallback if image fails */}
                    <div className={`hidden w-full h-28 bg-gradient-to-br ${color} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 opacity-50" />
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <ZoomIn className="w-5 h-5 text-white" />
                      <span className="text-white text-sm font-medium">Xem phóng to</span>
                    </div>
                  </div>
                ) : (
                  <div className={`w-full h-28 bg-gradient-to-br ${color} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 opacity-50" />
                  </div>
                )}

                {/* Doc metadata */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center border`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-foreground-muted">
                        {doc.uploadedAt || doc.uploadedDate || "—"}
                      </p>
                    </div>
                  </div>
                  {imgUrl && (
                    <button
                      onClick={() => setLightbox(imgUrl)}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      Xem
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
