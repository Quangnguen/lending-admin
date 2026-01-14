"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Printer,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { LoanDetail } from "./types";

interface LoansTableProps {
  loans: LoanDetail[];
}

type LoanStatus = "All Statuses" | "Active" | "Overdue" | "Pending" | "Liquidated" | "Defaulted";
type SortOrder = "Newest First" | "Oldest First" | "Amount High" | "Amount Low";

export default function LoansTable({ loans }: LoansTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LoanStatus>("All Statuses");
  const [sortOrder, setSortOrder] = useState<SortOrder>("Newest First");
  const [currentPage, setCurrentPage] = useState(1);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const itemsPerPage = 5;

  const filteredAndSortedLoans = useMemo(() => {
    let result = [...loans];

    // Filter by search
    if (searchQuery) {
      result = result.filter((loan) =>
        loan.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "All Statuses") {
      result = result.filter((loan) => loan.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOrder) {
        case "Newest First":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case "Oldest First":
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case "Amount High":
          return b.principalAmount - a.principalAmount;
        case "Amount Low":
          return a.principalAmount - b.principalAmount;
        default:
          return 0;
      }
    });

    return result;
  }, [loans, searchQuery, statusFilter, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedLoans.length / itemsPerPage);
  const paginatedLoans = filteredAndSortedLoans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400";
      case "Overdue":
        return "bg-orange-500/20 text-orange-400";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "Liquidated":
        return "bg-gray-500/20 text-gray-400";
      case "Defaulted":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return "●";
      case "Overdue":
      case "Defaulted":
        return <AlertTriangle className="w-3 h-3 inline mr-1" />;
      case "Pending":
        return "●";
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleExportCSV = () => {
    console.log("Export CSV");
    // TODO: Implement CSV export
  };

  const handlePrint = () => {
    console.log("Print");
    // TODO: Implement print
  };

  const statusOptions: LoanStatus[] = [
    "All Statuses",
    "Active",
    "Overdue",
    "Pending",
    "Liquidated",
    "Defaulted",
  ];

  const sortOptions: SortOrder[] = [
    "Newest First",
    "Oldest First",
    "Amount High",
    "Amount Low",
  ];

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl">
      {/* Filters */}
      <div className="p-4 border-b border-[var(--card-border)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="Filter by Loan ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-lg text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 w-48"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-lg text-sm text-[var(--foreground)]"
              >
                {statusFilter}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showStatusDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-lg z-10 min-w-[150px]">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setShowStatusDropdown(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--sidebar-bg)] transition-colors ${
                        statusFilter === status
                          ? "text-[var(--primary)]"
                          : "text-[var(--foreground)]"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-lg text-sm text-[var(--foreground)]"
              >
                {sortOrder}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showSortDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-lg z-10 min-w-[150px]">
                  {sortOptions.map((sort) => (
                    <button
                      key={sort}
                      onClick={() => {
                        setSortOrder(sort);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--sidebar-bg)] transition-colors ${
                        sortOrder === sort
                          ? "text-[var(--primary)]"
                          : "text-[var(--foreground)]"
                      }`}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--sidebar-bg)] rounded-lg transition-colors"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary)]/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--card-border)]">
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Loan ID
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Principal Amount
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Interest Rate
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Start Date
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Next Payment
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--card-border)]">
            {paginatedLoans.map((loan) => (
              <tr
                key={loan.id}
                className="hover:bg-[var(--sidebar-bg)] transition-colors"
              >
                <td className="py-4 px-4">
                  <span className="text-sm font-medium text-[var(--primary)]">
                    #{loan.id}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    {formatCurrency(loan.principalAmount)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {loan.interestRate}%
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {loan.startDate}
                  </span>
                </td>
                <td className="py-4 px-4">
                  {loan.nextPayment ? (
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          loan.nextPaymentLate
                            ? "text-orange-400"
                            : "text-[var(--muted-foreground)]"
                        }`}
                      >
                        {loan.nextPayment}
                      </span>
                      {loan.nextPaymentLate && (
                        <span className="text-xs text-orange-400 font-medium">
                          LATE
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-[var(--muted-foreground)]">
                      —
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(loan.status)}`}
                  >
                    {getStatusIcon(loan.status)}
                    {loan.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-[var(--card-border)] flex items-center justify-between">
        <p className="text-sm text-[var(--muted-foreground)]">
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, filteredAndSortedLoans.length)}{" "}
          of {filteredAndSortedLoans.length} loans
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--sidebar-bg)] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--sidebar-bg)]"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--sidebar-bg)] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
