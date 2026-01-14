// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "Borrower" | "Lender" | "Admin" | "Verifier";
  status: "Active" | "Locked" | "Pending";
  kycStatus: "Verified" | "Pending Review" | "Rejected" | "N/A (Internal)";
  registeredDate: string;
}

// Role badge colors
export const roleBadgeColors: Record<User["role"], string> = {
  Borrower: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Lender: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Verifier: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
};

// Status badge config
export const statusConfig: Record<User["status"], { color: string; dot: string }> = {
  Active: { color: "text-success", dot: "bg-success" },
  Locked: { color: "text-error", dot: "bg-error" },
  Pending: { color: "text-warning", dot: "bg-warning" },
};

// KYC Status badge config
export const kycStatusConfig: Record<User["kycStatus"], { bg: string; text: string }> = {
  Verified: { bg: "bg-success-light", text: "text-success" },
  "Pending Review": { bg: "bg-warning-light", text: "text-warning" },
  Rejected: { bg: "bg-error-light", text: "text-error" },
  "N/A (Internal)": { bg: "bg-gray-100 dark:bg-gray-800", text: "text-foreground-muted" },
};

// Filter options
export const roleOptions = ["All Roles", "Borrower", "Lender", "Admin", "Verifier"];
export const statusOptions = ["All Statuses", "Active", "Locked", "Pending"];
export const kycStatusOptions = ["KYC Status", "Verified", "Pending Review", "Rejected", "N/A (Internal)"];

// Mock data
export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Borrower",
    status: "Active",
    kycStatus: "Pending Review",
    registeredDate: "Oct 24, 2023",
  },
  {
    id: "2",
    name: "Sarah Smith",
    email: "sarah.smith@lender.io",
    role: "Lender",
    status: "Active",
    kycStatus: "Verified",
    registeredDate: "Sep 15, 2023",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@system.internal",
    role: "Admin",
    status: "Active",
    kycStatus: "N/A (Internal)",
    registeredDate: "Jan 01, 2023",
  },
  {
    id: "4",
    name: "Emily Verifier",
    email: "emily.v@system.internal",
    role: "Verifier",
    status: "Active",
    kycStatus: "Verified",
    registeredDate: "Mar 10, 2023",
  },
  {
    id: "5",
    name: "Robert Brown",
    email: "rob.brown@fraud.test",
    role: "Borrower",
    status: "Locked",
    kycStatus: "Rejected",
    registeredDate: "Oct 20, 2023",
  },
];
