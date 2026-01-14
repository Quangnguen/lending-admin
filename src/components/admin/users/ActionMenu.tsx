"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { User } from "./types";

interface ActionMenuProps {
  user: User;
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export default function ActionMenu({ user, onView, onEdit, onDelete }: ActionMenuProps) {
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
          <div className="absolute right-0 top-full mt-1 w-36 bg-card-bg border border-card-border rounded-lg shadow-lg z-20">
            <button
              onClick={() => handleAction(() => onView?.(user))}
              className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-background-tertiary first:rounded-t-lg"
            >
              <Eye className="w-4 h-4" />
              Xem chi tiết
            </button>
            <button
              onClick={() => handleAction(() => onEdit?.(user))}
              className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-background-tertiary"
            >
              <Edit className="w-4 h-4" />
              Chỉnh sửa
            </button>
            <button
              onClick={() => handleAction(() => onDelete?.(user))}
              className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-error hover:bg-background-tertiary last:rounded-b-lg"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          </div>
        </>
      )}
    </div>
  );
}
