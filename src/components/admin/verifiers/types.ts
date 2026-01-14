// Verifier types
export interface Verifier {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: "Active" | "Inactive" | "On Leave";
  department: "KYC" | "Loans" | "Fraud" | "General";
  joinedDate: string;
  lastActive: string;
  stats: VerifierStats;
}

export interface VerifierStats {
  totalReviews: number;
  pendingCases: number;
  approvalRate: number;
  avgReviewTime: string;
}

// Verifier Detail types
export interface VerifierDetail extends Verifier {
  phone: string;
  employeeId: string;
  supervisor: string;
  location: string;
  permissions: string[];
  recentReviews: ReviewRecord[];
  performanceHistory: PerformanceRecord[];
  security: SecurityInfo;
  activityLog: ActivityLogItem[];
}

export interface SecurityInfo {
  twoFactorEnabled: boolean;
  twoFactorMethod?: string;
  lastActive: string;
  lastIP: string;
  passwordChanged: string;
}

export interface ActivityLogItem {
  id: string;
  action: string;
  actionType: "approved" | "rejected" | "reviewed" | "login" | "other";
  context?: string;
  status: "Success" | "Completed" | "Failed" | "Pending";
  timestamp: string;
}

export interface ReviewRecord {
  id: string;
  type: "KYC" | "Loan" | "Fraud" | "Document";
  applicantName: string;
  decision: "Approved" | "Rejected" | "Pending" | "Escalated";
  date: string;
  reviewTime: string;
}

export interface PerformanceRecord {
  month: string;
  reviews: number;
  approvalRate: number;
  avgTime: string;
}

// Status badge config
export const statusConfig: Record<Verifier["status"], { color: string; dot: string }> = {
  Active: { color: "text-success", dot: "bg-success" },
  Inactive: { color: "text-error", dot: "bg-error" },
  "On Leave": { color: "text-warning", dot: "bg-warning" },
};

// Department badge colors
export const departmentBadgeColors: Record<Verifier["department"], string> = {
  KYC: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Loans: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Fraud: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  General: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

// Decision badge colors
export const decisionColors: Record<ReviewRecord["decision"], string> = {
  Approved: "text-success bg-success-light",
  Rejected: "text-error bg-error-light",
  Pending: "text-warning bg-warning-light",
  Escalated: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
};

// Filter options
export const statusOptions = ["All Statuses", "Active", "Inactive", "On Leave"];
export const departmentOptions = ["All Departments", "KYC", "Loans", "Fraud", "General"];

// Mock data
export const mockVerifiers: Verifier[] = [
  {
    id: "VRF-001",
    name: "Emily Verifier",
    email: "emily.v@system.internal",
    status: "Active",
    department: "KYC",
    joinedDate: "Mar 10, 2023",
    lastActive: "2 mins ago",
    stats: {
      totalReviews: 1250,
      pendingCases: 12,
      approvalRate: 78,
      avgReviewTime: "4.2 mins",
    },
  },
  {
    id: "VRF-002",
    name: "Michael Chen",
    email: "m.chen@system.internal",
    status: "Active",
    department: "Loans",
    joinedDate: "Jan 15, 2023",
    lastActive: "5 mins ago",
    stats: {
      totalReviews: 2100,
      pendingCases: 8,
      approvalRate: 82,
      avgReviewTime: "3.8 mins",
    },
  },
  {
    id: "VRF-003",
    name: "Sarah Johnson",
    email: "s.johnson@system.internal",
    status: "On Leave",
    department: "Fraud",
    joinedDate: "Jun 20, 2023",
    lastActive: "3 days ago",
    stats: {
      totalReviews: 890,
      pendingCases: 0,
      approvalRate: 45,
      avgReviewTime: "8.5 mins",
    },
  },
  {
    id: "VRF-004",
    name: "David Kim",
    email: "d.kim@system.internal",
    status: "Active",
    department: "KYC",
    joinedDate: "Sep 05, 2023",
    lastActive: "1 hour ago",
    stats: {
      totalReviews: 650,
      pendingCases: 15,
      approvalRate: 75,
      avgReviewTime: "5.1 mins",
    },
  },
  {
    id: "VRF-005",
    name: "Lisa Wang",
    email: "l.wang@system.internal",
    status: "Inactive",
    department: "General",
    joinedDate: "Nov 12, 2022",
    lastActive: "2 weeks ago",
    stats: {
      totalReviews: 3200,
      pendingCases: 0,
      approvalRate: 80,
      avgReviewTime: "3.5 mins",
    },
  },
];

// Mock detail data
export const mockVerifierDetail: VerifierDetail = {
  id: "VF-2023-892",
  name: "James Wilson",
  email: "j.wilson@company.com",
  phone: "+1 (555) 012-3456",
  employeeId: "VF-2023-892",
  supervisor: "Sarah Jenkins",
  location: "San Francisco HQ",
  status: "Active",
  department: "KYC",
  joinedDate: "Oct 12, 2022",
  lastActive: "2 mins ago",
  stats: {
    totalReviews: 1248,
    pendingCases: 12,
    approvalRate: 68.5,
    avgReviewTime: "45m",
  },
  permissions: ["KYC Review", "Document Verification", "Identity Check", "Address Verification"],
  security: {
    twoFactorEnabled: true,
    twoFactorMethod: "Authenticator",
    lastActive: "Today, 09:14 AM",
    lastIP: "192.168.1.45",
    passwordChanged: "3 months ago",
  },
  activityLog: [
    {
      id: "ACT-001",
      action: "Loan Approved",
      actionType: "approved",
      context: "LN-8842-X",
      status: "Success",
      timestamp: "2 mins ago",
    },
    {
      id: "ACT-002",
      action: "Document Reviewed",
      actionType: "reviewed",
      context: "Income Statement (John Doe)",
      status: "Completed",
      timestamp: "15 mins ago",
    },
    {
      id: "ACT-003",
      action: "Loan Rejected",
      actionType: "rejected",
      context: "LN-9921-A",
      status: "Success",
      timestamp: "42 mins ago",
    },
    {
      id: "ACT-004",
      action: "System Login",
      actionType: "login",
      context: "Web Portal",
      status: "Success",
      timestamp: "2 hours ago",
    },
  ],
  recentReviews: [
    {
      id: "REV-001",
      type: "KYC",
      applicantName: "John Doe",
      decision: "Approved",
      date: "Jan 04, 2026",
      reviewTime: "3.5 mins",
    },
    {
      id: "REV-002",
      type: "Document",
      applicantName: "Jane Smith",
      decision: "Rejected",
      date: "Jan 04, 2026",
      reviewTime: "5.2 mins",
    },
    {
      id: "REV-003",
      type: "KYC",
      applicantName: "Robert Brown",
      decision: "Escalated",
      date: "Jan 03, 2026",
      reviewTime: "8.0 mins",
    },
    {
      id: "REV-004",
      type: "KYC",
      applicantName: "Alice Johnson",
      decision: "Approved",
      date: "Jan 03, 2026",
      reviewTime: "2.8 mins",
    },
  ],
  performanceHistory: [
    { month: "Dec 2025", reviews: 245, approvalRate: 76, avgTime: "4.5 mins" },
    { month: "Nov 2025", reviews: 268, approvalRate: 79, avgTime: "4.1 mins" },
    { month: "Oct 2025", reviews: 230, approvalRate: 77, avgTime: "4.3 mins" },
  ],
};

// Tab types for detail page
export type VerifierDetailTab = "overview" | "reviews" | "performance" | "settings";
