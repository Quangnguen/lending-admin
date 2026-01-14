"use client";

import { FileText, Image, Download, Eye } from "lucide-react";
import { UploadedDocument } from "./types";

interface UploadedDocumentsProps {
  documents: UploadedDocument[];
}

export default function UploadedDocuments({ documents }: UploadedDocumentsProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return FileText;
      case "jpg":
      case "png":
        return Image;
      default:
        return FileText;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case "pdf":
        return "bg-red-500/20 text-red-400";
      case "jpg":
      case "png":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          Uploaded Documents
        </h3>
        <span className="text-sm text-[var(--muted-foreground)]">
          {documents.length} files
        </span>
      </div>

      <div className="space-y-3">
        {documents.map((doc) => {
          const Icon = getFileIcon(doc.type);
          return (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-lg hover:border-[var(--primary)]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileColor(doc.type)}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {doc.name}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {doc.size} • Uploaded {doc.uploadedDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card-border)] rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card-border)] rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
