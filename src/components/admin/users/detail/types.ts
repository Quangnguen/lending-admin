// User Detail Types
export interface UserDetail {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "Borrower" | "Lender" | "Admin" | "Verifier";
  status: "Active" | "Locked" | "Suspended" | "Pending";
  kycStatus: "Verified" | "Pending Review" | "Rejected" | "N/A (Internal)";
  kycLevel: 1 | 2 | 3;
  registeredDate: string;
  isHighRisk: boolean;
  personalDetails: PersonalDetails;
  stats: UserStats;
  kycDetails: KYCDetails;
  kycVerificationItems: KYCVerificationItem[];
  uploadedDocuments: UploadedDocument[];
  activeLoans: ActiveLoan[];
  loanDetails: LoanDetail[];
  loanSummary: LoanSummary;
  loanHistory: LoanRecord[];
  recentTransactions: Transaction[];
  transactionHistory: TransactionDetail[];
  supportCases: SupportCase[];
  activityLogs: ActivityLogItem[];
}

// KYC Verification Types
export interface KYCVerificationItem {
  id: string;
  type: "identity" | "face" | "address";
  title: string;
  method: string;
  detail: string;
  verified: boolean;
  verifiedDate?: string;
  expiryDate?: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  size?: string;
  uploadedDate?: string;
  uploadedAt?: string;
  url?: string;
  type: "pdf" | "jpg" | "png" | "id_front" | "id_back" | "selfie" | string;
}


export interface ActiveLoan {
  id: string;
  amount: number;
  interestRate: number;
  startDate: string;
  nextPayment: string;
  status: "Active" | "Overdue" | "Paid Off" | "Default";
}

// Full Loan Details for Loans Tab
export interface LoanDetail {
  id: string;
  principalAmount: number;
  interestRate: number;
  startDate: string;
  nextPayment: string;
  nextPaymentLate?: boolean;
  status: "Active" | "Overdue" | "Pending" | "Liquidated" | "Defaulted";
}

export interface LoanSummary {
  totalBorrowed: number;
  totalRepaid: number;
  outstanding: number;
}

export interface PersonalDetails {
  fullName: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
}

export interface UserStats {
  totalBorrowed: number;
  activeLoans: number;
  totalLoans: number;
  nextPaymentDays: number;
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High";
  percentile?: number;
}

export interface KYCDetails {
  lastUpdated: string;
  identityVerified: boolean;
  identityMethod?: string;
  addressVerified: boolean;
  addressMethod?: string;
  videoInterview: boolean;
  videoNote?: string;
}

export interface LoanRecord {
  id: string;
  amount: number;
  date: string;
  status: "Active" | "Paid Off" | "Overdue" | "Default";
  progress?: number;
}

export interface Transaction {
  id: string;
  type: "Repayment" | "Disbursed" | "Fee" | "Refund" | "Payment Failed";
  amount: number;
  date: string;
  time: string;
  description?: string;
}

// Full Transaction Details for Transactions Tab
export interface TransactionDetail {
  id: string;
  type: "Loan Disbursement" | "Repayment" | "Payment Failed" | "Late Fee";
  subText: string;
  loanId?: string;
  date: string;
  time: string;
  method: "crypto" | "ach" | "system";
  methodHash: string;
  status: "Completed" | "Failed" | "Pending";
  amount: number;
}

// Cases & Logs Types
export interface SupportCase {
  id: string;
  subject: string;
  category: "Payment Issue" | "Account Access" | "KYC Verification" | "Loan Inquiry" | "Technical Issue" | "Other";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  createdDate: string;
  lastUpdated: string;
  assignedTo?: string;
  description: string;
}

export interface ActivityLogItem {
  id: string;
  action: string;
  category: "account" | "kyc" | "loan" | "payment" | "security" | "system";
  details: string;
  performedBy: "User" | "System" | "Admin";
  ipAddress?: string;
  date: string;
  time: string;
}

// Tab types
export type UserDetailTab = "overview" | "kyc" | "loans" | "transactions" | "cases";

// Mock data
export const mockUserDetail: UserDetail = {
  id: "USR-883492",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "Borrower",
  status: "Active",
  kycStatus: "Verified",
  kycLevel: 3,
  registeredDate: "Oct 24, 2023",
  isHighRisk: false,
  personalDetails: {
    fullName: "Johnathan Doe",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "Jan 15, 1985",
    nationality: "United States",
    address: "1234 Elm Street, Apt 4B\nSpringfield, IL 62704",
  },
  stats: {
    totalBorrowed: 12500,
    activeLoans: 1,
    totalLoans: 3,
    nextPaymentDays: 5,
    riskScore: 85,
    riskLevel: "Low",
    percentile: 15,
  },
  kycDetails: {
    lastUpdated: "Oct 25",
    identityVerified: true,
    identityMethod: "Passport verified via Stripe Identity",
    addressVerified: true,
    addressMethod: "Utility bill submitted and approved",
    videoInterview: false,
    videoNote: "Not required for current tier",
  },
  kycVerificationItems: [
    {
      id: "kyc-1",
      type: "identity",
      title: "Identity Document",
      method: "Passport (USA)",
      detail: "Verified via Stripe Identity",
      verified: true,
      expiryDate: "Dec 2028",
    },
    {
      id: "kyc-2",
      type: "face",
      title: "Face Verification",
      method: "Biometric Match",
      detail: "98.7% confidence score",
      verified: true,
      verifiedDate: "Oct 24, 2023",
    },
    {
      id: "kyc-3",
      type: "address",
      title: "Proof of Address",
      method: "Utility Bill",
      detail: "Electricity bill verified",
      verified: true,
      verifiedDate: "Oct 24, 2023",
    },
  ],
  uploadedDocuments: [
    {
      id: "doc-1",
      name: "passport_scan_front.pdf",
      size: "2.4 MB",
      uploadedDate: "Oct 24, 2023",
      type: "pdf",
    },
    {
      id: "doc-2",
      name: "utility_bill_july.jpg",
      size: "1.8 MB",
      uploadedDate: "Oct 24, 2023",
      type: "jpg",
    },
  ],
  activeLoans: [
    {
      id: "LN-2023-001",
      amount: 5000,
      interestRate: 8.5,
      startDate: "Nov 01, 2023",
      nextPayment: "Dec 01, 2023",
      status: "Active",
    },
    {
      id: "LN-2023-089",
      amount: 2500,
      interestRate: 9.2,
      startDate: "Aug 15, 2023",
      nextPayment: "Nov 15, 2023",
      status: "Overdue",
    },
  ],
  loanDetails: [
    {
      id: "LN-88392",
      principalAmount: 12500,
      interestRate: 4.5,
      startDate: "Sep 12, 2023",
      nextPayment: "Oct 12, 2023",
      status: "Active",
    },
    {
      id: "LN-77210",
      principalAmount: 2000,
      interestRate: 5.2,
      startDate: "Aug 01, 2023",
      nextPayment: "Sep 01, 2023",
      nextPaymentLate: true,
      status: "Overdue",
    },
    {
      id: "LN-99231",
      principalAmount: 1500,
      interestRate: 5.0,
      startDate: "Oct 05, 2023",
      nextPayment: "",
      status: "Pending",
    },
    {
      id: "LN-66192",
      principalAmount: 50000,
      interestRate: 3.8,
      startDate: "Jan 15, 2023",
      nextPayment: "",
      status: "Liquidated",
    },
    {
      id: "LN-55901",
      principalAmount: 5000,
      interestRate: 6.0,
      startDate: "Dec 10, 2022",
      nextPayment: "",
      status: "Defaulted",
    },
  ],
  loanSummary: {
    totalBorrowed: 71000,
    totalRepaid: 52345.5,
    outstanding: 14500,
  },
  loanHistory: [
    {
      id: "#LN-2023-001",
      amount: 5000,
      date: "Nov 12, 2023",
      status: "Active",
      progress: 45,
    },
    {
      id: "#LN-2023-089",
      amount: 2500,
      date: "Aug 01, 2023",
      status: "Paid Off",
      progress: 100,
    },
  ],
  recentTransactions: [
    {
      id: "TXN-001",
      type: "Disbursed",
      amount: 5000,
      date: "Nov 12",
      time: "09:00 AM",
      description: "Loan Disbursement",
    },
    {
      id: "TXN-002",
      type: "Repayment",
      amount: -250,
      date: "Nov 10",
      time: "10:23 AM",
      description: "Repayment - Auto Debit",
    },
    {
      id: "TXN-003",
      type: "Payment Failed",
      amount: -250,
      date: "Nov 05",
      time: "02:15 PM",
      description: "Payment Failed",
    },
  ],
  transactionHistory: [
    {
      id: "TXN-001",
      type: "Loan Disbursement",
      subText: "Loan #LN-88392",
      loanId: "LN-88392",
      date: "Sep 12, 2023",
      time: "10:42 AM",
      method: "crypto",
      methodHash: "0x8a7b...42b9",
      status: "Completed",
      amount: 12500,
    },
    {
      id: "TXN-002",
      type: "Repayment",
      subText: "Auto-Debit",
      date: "Sep 01, 2023",
      time: "09:00 AM",
      method: "ach",
      methodHash: "ACH ****8821",
      status: "Completed",
      amount: -345.5,
    },
    {
      id: "TXN-003",
      type: "Payment Failed",
      subText: "Insufficient Funds",
      date: "Aug 28, 2023",
      time: "09:00 AM",
      method: "ach",
      methodHash: "ACH ****8821",
      status: "Failed",
      amount: 0,
    },
    {
      id: "TXN-004",
      type: "Late Fee",
      subText: "System Charge",
      date: "Aug 15, 2023",
      time: "02:30 PM",
      method: "system",
      methodHash: "Sys_Tx_9921",
      status: "Completed",
      amount: -25,
    },
    {
      id: "TXN-005",
      type: "Loan Disbursement",
      subText: "Loan #LN-77210",
      loanId: "LN-77210",
      date: "Aug 01, 2023",
      time: "10:00 AM",
      method: "crypto",
      methodHash: "0x2c1f...99d1",
      status: "Completed",
      amount: 2000,
    },
    {
      id: "TXN-006",
      type: "Repayment",
      subText: "Manual Transfer",
      date: "Jul 15, 2023",
      time: "11:15 AM",
      method: "crypto",
      methodHash: "0x1a2b...3c4d",
      status: "Completed",
      amount: -150,
    },
  ],
  supportCases: [
    {
      id: "CASE-001",
      subject: "Unable to make payment",
      category: "Payment Issue",
      status: "Open",
      priority: "High",
      createdDate: "Oct 28, 2023",
      lastUpdated: "Oct 29, 2023",
      assignedTo: "Sarah Johnson",
      description: "User reported payment gateway timeout when attempting monthly repayment.",
    },
    {
      id: "CASE-002",
      subject: "KYC document rejected",
      category: "KYC Verification",
      status: "In Progress",
      priority: "Medium",
      createdDate: "Oct 15, 2023",
      lastUpdated: "Oct 20, 2023",
      assignedTo: "Mike Chen",
      description: "User's utility bill was rejected due to being older than 3 months.",
    },
    {
      id: "CASE-003",
      subject: "Request for loan extension",
      category: "Loan Inquiry",
      status: "Resolved",
      priority: "Medium",
      createdDate: "Sep 10, 2023",
      lastUpdated: "Sep 15, 2023",
      assignedTo: "Emily Davis",
      description: "User requested a 2-week extension on loan repayment due to personal circumstances.",
    },
    {
      id: "CASE-004",
      subject: "Cannot access account",
      category: "Account Access",
      status: "Closed",
      priority: "Urgent",
      createdDate: "Aug 05, 2023",
      lastUpdated: "Aug 05, 2023",
      assignedTo: "Tech Support",
      description: "User forgot password and 2FA device was lost. Identity verified and reset completed.",
    },
  ],
  activityLogs: [
    {
      id: "LOG-001",
      action: "Password Changed",
      category: "security",
      details: "User changed account password",
      performedBy: "User",
      ipAddress: "192.168.1.105",
      date: "Oct 30, 2023",
      time: "02:45 PM",
    },
    {
      id: "LOG-002",
      action: "KYC Document Uploaded",
      category: "kyc",
      details: "Uploaded new utility bill for address verification",
      performedBy: "User",
      ipAddress: "192.168.1.105",
      date: "Oct 24, 2023",
      time: "10:30 AM",
    },
    {
      id: "LOG-003",
      action: "Loan Application Submitted",
      category: "loan",
      details: "Applied for $5,000 personal loan - LN-88392",
      performedBy: "User",
      ipAddress: "192.168.1.102",
      date: "Sep 12, 2023",
      time: "09:15 AM",
    },
    {
      id: "LOG-004",
      action: "KYC Verified",
      category: "kyc",
      details: "Identity verification completed - Level 3",
      performedBy: "Admin",
      date: "Oct 24, 2023",
      time: "11:00 AM",
    },
    {
      id: "LOG-005",
      action: "Payment Auto-Debit Enabled",
      category: "payment",
      details: "User enabled automatic payment deduction",
      performedBy: "User",
      ipAddress: "192.168.1.105",
      date: "Sep 15, 2023",
      time: "03:20 PM",
    },
    {
      id: "LOG-006",
      action: "Account Login",
      category: "account",
      details: "Successful login from new device",
      performedBy: "User",
      ipAddress: "10.0.0.55",
      date: "Oct 30, 2023",
      time: "09:00 AM",
    },
    {
      id: "LOG-007",
      action: "High Risk Flag Removed",
      category: "system",
      details: "Admin removed high-risk flag after review",
      performedBy: "Admin",
      date: "Oct 25, 2023",
      time: "04:30 PM",
    },
    {
      id: "LOG-008",
      action: "Payment Failed",
      category: "payment",
      details: "Auto-debit failed - insufficient funds",
      performedBy: "System",
      date: "Aug 28, 2023",
      time: "09:00 AM",
    },
  ],
};
