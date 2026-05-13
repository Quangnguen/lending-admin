"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
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
} from "@/components/admin/users/detail";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<UserDetailTab>("overview");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = params.id as string;

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/admin/users/${userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setUser(data.data);
        } else {
          setError(data.error || "Không thể tải thông tin người dùng");
        }
      })
      .catch(() => setError("Lỗi kết nối backend"))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleBack = () => router.push("/admin/users");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-foreground-muted">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm">Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-4">
        <button onClick={handleBack} className="flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-700 dark:text-red-400">Không thể tải thông tin</p>
            <p className="text-sm text-red-600 dark:text-red-500 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh sách
      </button>

      {/* Credit Score Badge (nếu có) */}
      {user.creditScore > 0 && (
        <div className="flex items-center gap-3 bg-card-bg border border-card-border rounded-xl px-5 py-3">
          <span className="text-sm text-foreground-muted">Điểm tín dụng (từ DB):</span>
          <span className={`text-xl font-bold ${user.creditScore >= 700 ? "text-green-500" : user.creditScore >= 500 ? "text-yellow-500" : "text-red-500"}`}>
            {user.creditScore}
          </span>
          <span className="text-xs text-foreground-muted">/ 1000</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-background-tertiary text-foreground-muted">{user.creditRating}</span>
          {user.loanLimit > 0 && (
            <span className="text-xs text-foreground-muted ml-2">Hạn mức: <strong>{user.loanLimit} USDT</strong></span>
          )}
          {user.creditCalculatedAt && (
            <span className="text-xs text-foreground-muted ml-auto">
              Cập nhật: {new Date(user.creditCalculatedAt).toLocaleDateString("vi-VN")}
            </span>
          )}
        </div>
      )}

      {/* User Header */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6">
        <UserHeader
          user={user}
          onEditDetails={() => {}}
          onSendMessage={() => {}}
        />
        <div className="mt-6">
          <UserTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-6">
            <StatsCards stats={user.stats} />
            <LoanHistorySummary loans={user.loanHistory} onViewAll={() => setActiveTab("loans")} />
            <div className="grid grid-cols-2 gap-6">
              <KYCStatusCard kycDetails={user.kycDetails} onViewDocuments={() => setActiveTab("kyc")} />
              <RecentTransactions transactions={user.recentTransactions} onViewAll={() => setActiveTab("transactions")} />
            </div>
          </div>
          <div className="col-span-4 space-y-6">
            <AdminActions
              isHighRisk={user.isHighRisk}
              status={user.status}
              onResetPassword={() => {}}
              onViewLogs={() => setActiveTab("cases")}
              onReKYC={() => {}}
              onLockAccount={() => {}}
              onSuspend={() => {}}
              onToggleHighRisk={() => {}}
            />
            <PersonalDetailsCard details={user.personalDetails} />
          </div>
        </div>
      )}

      {activeTab === "kyc" && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-6">
            <KYCVerificationStatus kycLevel={user.kycLevel} verificationItems={user.kycVerificationItems} />
            <ActiveLoansTable loans={user.activeLoans} />
          </div>
          <div className="col-span-4 space-y-6">
            <UploadedDocuments documents={user.uploadedDocuments} />
            <KYCTransactionsList transactions={user.recentTransactions} />
          </div>
        </div>
      )}

      {activeTab === "loans" && (
        <div className="space-y-6">
          <LoansTable loans={user.loanDetails} />
          <LoanSummaryCards summary={user.loanSummary} />
        </div>
      )}

      {activeTab === "transactions" && (
        <TransactionsTable transactions={user.transactionHistory} />
      )}

      {activeTab === "cases" && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7">
            <CasesTable cases={user.supportCases} />
          </div>
          <div className="col-span-5">
            <UserActivityLog logs={user.activityLogs} />
          </div>
        </div>
      )}
    </div>
  );
}
