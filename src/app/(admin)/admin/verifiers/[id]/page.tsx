"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  VerifierHeader,
  VerifierStatsCards,
  ProfileCard,
  SecurityCard,
  ActivityLog,
  mockVerifierDetail,
} from "@/components/admin/verifiers/detail";

export default function VerifierDetailPage() {
  const params = useParams();
  const router = useRouter();

  // In real app, fetch verifier by params.id
  const verifierId = params.id as string;
  const verifier = { ...mockVerifierDetail, id: verifierId || mockVerifierDetail.id };

  const handleBack = () => {
    router.push("/admin/verifiers");
  };

  const handleLockAccount = () => {
    console.log("Lock account");
  };

  const handleEditProfile = () => {
    console.log("Edit profile");
  };

  const handleResetPassword = () => {
    console.log("Reset password");
  };

  const handleRevokeSessions = () => {
    console.log("Revoke sessions");
  };

  const handleViewAllActivity = () => {
    console.log("View all activity");
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Verifiers
      </button>

      {/* Header */}
      <VerifierHeader
        verifier={verifier}
        onLockAccount={handleLockAccount}
        onEditProfile={handleEditProfile}
      />

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Profile & Security */}
        <div className="col-span-4 space-y-6">
          <ProfileCard verifier={verifier} />
          <SecurityCard
            security={verifier.security}
            onResetPassword={handleResetPassword}
            onRevokeSessions={handleRevokeSessions}
          />
        </div>

        {/* Right Column - Stats & Activity */}
        <div className="col-span-8 space-y-6">
          <VerifierStatsCards stats={verifier.stats} />
          <ActivityLog
            activities={verifier.activityLog}
            onViewAll={handleViewAllActivity}
          />
        </div>
      </div>
    </div>
  );
}
