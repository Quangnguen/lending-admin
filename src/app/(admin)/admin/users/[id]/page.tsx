"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  UserHeader,
  UserTabs,
  StatsCards,
  AdminActions,
  LoanHistorySummary,
  KYCStatusCard,
  RecentTransactions,
  PersonalDetailsCard,
  KYCVerificationStatus,
  UploadedDocuments,
  ActiveLoansTable,
  KYCTransactionsList,
  LoansTable,
  LoanSummaryCards,
  TransactionsTable,
  CasesTable,
  UserActivityLog,
  UserDetailTab,
  mockUserDetail,
} from "@/components/admin/users/detail";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<UserDetailTab>("overview");

  // In real app, fetch user by params.id
  const userId = params.id as string;
  const user = { ...mockUserDetail, id: userId || mockUserDetail.id };

  const handleBack = () => {
    router.push("/admin/users");
  };

  const handleEditDetails = () => {
    console.log("Edit details");
    // TODO: Open edit modal or navigate to edit page
  };

  const handleSendMessage = () => {
    console.log("Send message");
    // TODO: Open message modal
  };

  const handleResetPassword = () => {
    console.log("Reset password");
    // TODO: Trigger password reset
  };

  const handleViewLogs = () => {
    setActiveTab("cases");
  };

  const handleReKYC = () => {
    console.log("Re-KYC");
    // TODO: Trigger KYC re-verification
  };

  const handleLockAccount = () => {
    console.log("Lock/Unlock account");
    // TODO: Toggle account lock
  };

  const handleSuspend = () => {
    console.log("Suspend/Unsuspend");
    // TODO: Toggle suspension
  };

  const handleToggleHighRisk = (value: boolean) => {
    console.log("High risk:", value);
    // TODO: Update high risk status
  };

  const handleViewAllLoans = () => {
    setActiveTab("loans");
  };

  const handleViewDocuments = () => {
    setActiveTab("kyc");
  };

  const handleViewAllTransactions = () => {
    setActiveTab("transactions");
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </button>

      {/* User Header */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6">
        <UserHeader
          user={user}
          onEditDetails={handleEditDetails}
          onSendMessage={handleSendMessage}
        />

        {/* Tabs */}
        <div className="mt-6">
          <UserTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Stats & Loans */}
          <div className="col-span-8 space-y-6">
            {/* Stats Cards */}
            <StatsCards stats={user.stats} />

            {/* Loan History Summary */}
            <LoanHistorySummary loans={user.loanHistory} onViewAll={handleViewAllLoans} />

            {/* Bottom Row - KYC & Transactions */}
            <div className="grid grid-cols-2 gap-6">
              <KYCStatusCard
                kycDetails={user.kycDetails}
                onViewDocuments={handleViewDocuments}
              />
              <RecentTransactions
                transactions={user.recentTransactions}
                onViewAll={handleViewAllTransactions}
              />
            </div>
          </div>

          {/* Right Column - Admin Actions & Personal Details */}
          <div className="col-span-4 space-y-6">
            <AdminActions
              isHighRisk={user.isHighRisk}
              status={user.status}
              onResetPassword={handleResetPassword}
              onViewLogs={handleViewLogs}
              onReKYC={handleReKYC}
              onLockAccount={handleLockAccount}
              onSuspend={handleSuspend}
              onToggleHighRisk={handleToggleHighRisk}
            />
            <PersonalDetailsCard details={user.personalDetails} />
          </div>
        </div>
      )}

      {activeTab === "kyc" && (
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - KYC Verification & Loans */}
          <div className="col-span-8 space-y-6">
            {/* KYC Verification Status */}
            <KYCVerificationStatus
              kycLevel={user.kycLevel}
              verificationItems={user.kycVerificationItems}
            />

            {/* Active Loans Table */}
            <ActiveLoansTable loans={user.activeLoans} />
          </div>

          {/* Right Column - Documents & Transactions */}
          <div className="col-span-4 space-y-6">
            {/* Uploaded Documents */}
            <UploadedDocuments documents={user.uploadedDocuments} />

            {/* Recent Transactions */}
            <KYCTransactionsList transactions={user.recentTransactions} />
          </div>
        </div>
      )}

      {activeTab === "loans" && (
        <div className="space-y-6">
          {/* Loans Table */}
          <LoansTable loans={user.loanDetails} />

          {/* Loan Summary Cards */}
          <LoanSummaryCards summary={user.loanSummary} />
        </div>
      )}

      {activeTab === "transactions" && (
        <TransactionsTable transactions={user.transactionHistory} />
      )}

      {activeTab === "cases" && (
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Support Cases */}
          <div className="col-span-7">
            <CasesTable cases={user.supportCases} />
          </div>

          {/* Right Column - Activity Log */}
          <div className="col-span-5">
            <UserActivityLog logs={user.activityLogs} />
          </div>
        </div>
      )}
    </div>
  );
}
