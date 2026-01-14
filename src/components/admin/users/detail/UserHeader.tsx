"use client";

import { Mail, Hash, Calendar, Edit, MessageSquare } from "lucide-react";
import { UserDetail } from "./types";
import UserAvatar from "../UserAvatar";

interface UserHeaderProps {
  user: UserDetail;
  onEditDetails?: () => void;
  onSendMessage?: () => void;
}

const roleBadgeColors: Record<UserDetail["role"], string> = {
  Borrower: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Lender: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Verifier: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
};

const statusDotColors: Record<UserDetail["status"], string> = {
  Active: "bg-success",
  Locked: "bg-error",
  Suspended: "bg-warning",
  Pending: "bg-gray-400",
};

export default function UserHeader({ user, onEditDetails, onSendMessage }: UserHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        {/* Avatar with status indicator */}
        <div className="relative">
          <UserAvatar name={user.name} size="lg" />
          <div
            className={`absolute bottom-0 left-0 w-3.5 h-3.5 rounded-full border-2 border-card-bg ${statusDotColors[user.status]}`}
          />
        </div>

        {/* User info */}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleBadgeColors[user.role]}`}>
              {user.role}
            </span>
            {user.kycStatus === "Verified" && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-success-light text-success">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                KYC Verified
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mt-2 text-sm text-foreground-muted">
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              {user.email}
            </div>
            <div className="flex items-center gap-1.5">
              <Hash className="w-4 h-4" />
              ID: {user.id}
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-1 text-sm text-foreground-muted">
            <Calendar className="w-4 h-4" />
            Joined {user.registeredDate}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onEditDetails}
          className="flex items-center gap-2 px-4 py-2.5 bg-card-bg border border-card-border rounded-lg hover:bg-background-tertiary transition-colors font-medium"
        >
          <Edit className="w-4 h-4" />
          Edit Details
        </button>
        <button
          onClick={onSendMessage}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium"
        >
          <MessageSquare className="w-4 h-4" />
          Send Message
        </button>
      </div>
    </div>
  );
}
