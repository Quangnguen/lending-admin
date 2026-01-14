"use client";

import { useState } from "react";
import { MoreHorizontal, Eye, Edit, UserX, UserCheck } from "lucide-react";
import { Verifier } from "./types";

interface VerifierActionMenuProps {
  verifier: Verifier;
  onView?: (verifier: Verifier) => void;
  onEdit?: (verifier: Verifier) => void;
  onToggleStatus?: (verifier: Verifier) => void;
}

export default function VerifierActionMenu({
  verifier,
  onView,
  onEdit,
  onToggleStatus,
}: VerifierActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
      >
        <MoreHorizontal className="w-4 h-4 text-foreground-muted" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-40 bg-card-bg border border-card-border rounded-lg shadow-lg z-20">
            <button
              onClick={() => handleAction(() => onView?.(verifier))}
              className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-background-tertiary first:rounded-t-lg"
            >
              <Eye className="w-4 h-4" />
              Xem chi tiết
            </button>
            <button
              onClick={() => handleAction(() => onEdit?.(verifier))}
              className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-background-tertiary"
            >
              <Edit className="w-4 h-4" />
              Chỉnh sửa
            </button>
            <button
              onClick={() => handleAction(() => onToggleStatus?.(verifier))}
              className={`w-full flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-background-tertiary last:rounded-b-lg ${
                verifier.status === "Active" ? "text-error" : "text-success"
              }`}
            >
              {verifier.status === "Active" ? (
                <>
                  <UserX className="w-4 h-4" />
                  Vô hiệu hóa
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  Kích hoạt
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
