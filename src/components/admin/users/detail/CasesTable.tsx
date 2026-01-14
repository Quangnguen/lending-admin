"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { SupportCase } from "./types";

interface CasesTableProps {
  cases: SupportCase[];
}

type CaseStatus = "All" | "Open" | "In Progress" | "Resolved" | "Closed";
type CasePriority = "All" | "Low" | "Medium" | "High" | "Urgent";

export default function CasesTable({ cases }: CasesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CaseStatus>("All");
  const [priorityFilter, setPriorityFilter] = useState<CasePriority>("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const filteredCases = useMemo(() => {
    let result = [...cases];

    if (searchQuery) {
      result = result.filter(
        (c) =>
          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (priorityFilter !== "All") {
      result = result.filter((c) => c.priority === priorityFilter);
    }

    return result;
  }, [cases, searchQuery, statusFilter, priorityFilter]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Open":
        return { bg: "bg-blue-500/20", text: "text-blue-400", icon: AlertCircle };
      case "In Progress":
        return { bg: "bg-amber-500/20", text: "text-amber-400", icon: Clock };
      case "Resolved":
        return { bg: "bg-green-500/20", text: "text-green-400", icon: CheckCircle2 };
      case "Closed":
        return { bg: "bg-gray-500/20", text: "text-gray-400", icon: XCircle };
      default:
        return { bg: "bg-gray-500/20", text: "text-gray-400", icon: AlertCircle };
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-500/20 text-red-400";
      case "High":
        return "bg-orange-500/20 text-orange-400";
      case "Medium":
        return "bg-amber-500/20 text-amber-400";
      case "Low":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getCategoryIcon = (category: string) => {
    return MessageSquare;
  };

  const handleCreateCase = () => {
    console.log("Create new case");
  };

  const statusOptions: CaseStatus[] = ["All", "Open", "In Progress", "Resolved", "Closed"];
  const priorityOptions: CasePriority[] = ["All", "Low", "Medium", "High", "Urgent"];

  return (
    <div className="bg-card-bg border border-card-border rounded-xl">
      {/* Header */}
      <div className="p-4 border-b border-card-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Support Cases</h3>
              <p className="text-sm text-foreground-muted">{cases.length} total cases</p>
            </div>
          </div>
          <button
            onClick={handleCreateCase}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Case
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-sidebar-bg border border-card-border rounded-lg text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-sidebar-bg border border-card-border rounded-lg text-sm text-foreground"
            >
              Status: {statusFilter}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-card-bg border border-card-border rounded-lg shadow-lg z-10 min-w-[140px]">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-sidebar-bg transition-colors ${
                      statusFilter === status ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <button
              onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-sidebar-bg border border-card-border rounded-lg text-sm text-foreground"
            >
              Priority: {priorityFilter}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showPriorityDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-card-bg border border-card-border rounded-lg shadow-lg z-10 min-w-[140px]">
                {priorityOptions.map((priority) => (
                  <button
                    key={priority}
                    onClick={() => {
                      setPriorityFilter(priority);
                      setShowPriorityDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-sidebar-bg transition-colors ${
                      priorityFilter === priority ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div className="divide-y divide-card-border">
        {filteredCases.map((caseItem) => {
          const statusStyle = getStatusStyle(caseItem.status);
          const StatusIcon = statusStyle.icon;
          const CategoryIcon = getCategoryIcon(caseItem.category);

          return (
            <div
              key={caseItem.id}
              className="p-4 hover:bg-sidebar-bg transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-card-border flex items-center justify-center flex-shrink-0">
                    <CategoryIcon className="w-5 h-5 text-foreground-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-primary">{caseItem.id}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityStyle(caseItem.priority)}`}>
                        {caseItem.priority}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      {caseItem.subject}
                    </h4>
                    <p className="text-xs text-foreground-muted line-clamp-1 mb-2">
                      {caseItem.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-foreground-muted">
                      <span>{caseItem.category}</span>
                      <span>•</span>
                      <span>Created: {caseItem.createdDate}</span>
                      {caseItem.assignedTo && (
                        <>
                          <span>•</span>
                          <span>Assigned: {caseItem.assignedTo}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusStyle.bg}`}>
                    <StatusIcon className={`w-3.5 h-3.5 ${statusStyle.text}`} />
                    <span className={`text-xs font-medium ${statusStyle.text}`}>
                      {caseItem.status}
                    </span>
                  </div>
                  <button className="p-2 text-foreground-muted hover:text-foreground hover:bg-card-border rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-8 text-foreground-muted">
          No cases found
        </div>
      )}
    </div>
  );
}
