"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  AlertCircle,
  Calendar,
  CheckCircle2,
  XCircle,
  Bitcoin,
  Building2,
  Settings,
} from "lucide-react";
import { TransactionDetail } from "./types";

interface TransactionsTableProps {
  transactions: TransactionDetail[];
}

type TransactionType = "All Transactions" | "Loan Disbursement" | "Repayment" | "Payment Failed" | "Late Fee";

export default function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType>("All Transactions");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const itemsPerPage = 6;

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Filter by search (hash or ID)
    if (searchQuery) {
      result = result.filter(
        (txn) =>
          txn.methodHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
          txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          txn.loanId?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (typeFilter !== "All Transactions") {
      result = result.filter((txn) => txn.type === typeFilter);
    }

    // Filter by date range
    if (startDate) {
      result = result.filter((txn) => new Date(txn.date) >= new Date(startDate));
    }
    if (endDate) {
      result = result.filter((txn) => new Date(txn.date) <= new Date(endDate));
    }

    return result;
  }, [transactions, searchQuery, typeFilter, startDate, endDate]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "Loan Disbursement":
        return ArrowDownLeft;
      case "Repayment":
        return ArrowUpRight;
      case "Payment Failed":
        return AlertTriangle;
      case "Late Fee":
        return AlertCircle;
      default:
        return ArrowDownLeft;
    }
  };

  const getTransactionIconStyle = (type: string) => {
    switch (type) {
      case "Loan Disbursement":
        return "text-blue-400";
      case "Repayment":
        return "text-green-400";
      case "Payment Failed":
        return "text-red-400";
      case "Late Fee":
        return "text-amber-400";
      default:
        return "text-gray-400";
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "crypto":
        return Bitcoin;
      case "ach":
        return Building2;
      case "system":
        return Settings;
      default:
        return Bitcoin;
    }
  };

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    if (amount > 0) {
      return `+$${absAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    } else if (amount < 0) {
      return `-$${absAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    }
    return `$${absAmount.toFixed(2)}`;
  };

  const getAmountStyle = (amount: number) => {
    if (amount > 0) return "text-green-400";
    if (amount < 0) return "text-foreground";
    return "text-foreground-muted";
  };

  const handleExport = () => {
    console.log("Export transactions");
    // TODO: Implement export
  };

  const typeOptions: TransactionType[] = [
    "All Transactions",
    "Loan Disbursement",
    "Repayment",
    "Payment Failed",
    "Late Fee",
  ];

  return (
    <div className="bg-card-bg border border-card-border rounded-xl">
      {/* Filters */}
      <div className="p-4 border-b border-card-border">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {/* Transaction Type Filter */}
            <div className="relative">
              <div className="text-xs text-foreground-muted mb-1">Transaction Type</div>
              <button
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-sidebar-bg border border-card-border rounded-lg text-sm text-foreground min-w-[160px]"
              >
                <span className="flex-1 text-left">{typeFilter}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showTypeDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-card-bg border border-card-border rounded-lg shadow-lg z-10 min-w-[180px]">
                  {typeOptions.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setTypeFilter(type);
                        setShowTypeDropdown(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-sidebar-bg transition-colors ${
                        typeFilter === type
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range */}
            <div>
              <div className="text-xs text-foreground-muted mb-1">Date Range</div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9 pr-3 py-2 bg-sidebar-bg border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-[140px]"
                  />
                </div>
                <span className="text-foreground-muted">-</span>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9 pr-3 py-2 bg-sidebar-bg border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-[140px]"
                  />
                </div>
              </div>
            </div>

            {/* Search */}
            <div>
              <div className="text-xs text-foreground-muted mb-1 opacity-0">Search</div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input
                  type="text"
                  placeholder="Search hash or ID..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 pr-4 py-2 bg-sidebar-bg border border-card-border rounded-lg text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 w-[180px]"
                />
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div>
            <div className="text-xs text-foreground-muted mb-1 opacity-0">Export</div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-card-border">
              <th className="text-left py-3 px-4 text-xs font-medium text-foreground-muted uppercase tracking-wider">
                Transaction
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-foreground-muted uppercase tracking-wider">
                Date & Time
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-foreground-muted uppercase tracking-wider">
                Method / Hash
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-foreground-muted uppercase tracking-wider">
                Status
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-foreground-muted uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {paginatedTransactions.map((txn) => {
              const Icon = getTransactionIcon(txn.type);
              const MethodIcon = getMethodIcon(txn.method);
              return (
                <tr
                  key={txn.id}
                  className="hover:bg-sidebar-bg transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${getTransactionIconStyle(txn.type)}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {txn.type}
                        </p>
                        <p className={`text-xs ${txn.type === "Payment Failed" ? "text-red-400" : "text-foreground-muted"}`}>
                          {txn.subText}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-foreground">{txn.date}</p>
                    <p className="text-xs text-foreground-muted">{txn.time}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <MethodIcon className="w-4 h-4 text-foreground-muted" />
                      <span className="text-sm text-foreground-muted font-mono">
                        {txn.methodHash}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      {txn.status === "Completed" ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-green-400">Completed</span>
                        </>
                      ) : txn.status === "Failed" ? (
                        <>
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-red-400">Failed</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                          <span className="text-sm text-amber-400">Pending</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`text-sm font-semibold ${getAmountStyle(txn.amount)}`}>
                      {formatCurrency(txn.amount)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-card-border flex items-center justify-between">
        <p className="text-sm text-foreground-muted">
          Showing{" "}
          <span className="text-primary">
            {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
          </span>{" "}
          of <span className="text-primary">{filteredTransactions.length}</span>{" "}
          transactions
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground border border-card-border rounded-lg hover:bg-sidebar-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-4 py-2 text-sm text-foreground bg-sidebar-bg border border-card-border rounded-lg hover:bg-card-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-8 text-foreground-muted">
          No transactions found
        </div>
      )}
    </div>
  );
}
