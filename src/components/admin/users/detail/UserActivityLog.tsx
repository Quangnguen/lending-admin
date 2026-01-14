"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Download,
  User,
  Bot,
  Shield,
  LogIn,
  FileCheck,
  CreditCard,
  Lock,
  Settings,
  Globe,
} from "lucide-react";
import { ActivityLogItem } from "./types";

interface UserActivityLogProps {
  logs: ActivityLogItem[];
}

type LogCategory = "All" | "account" | "kyc" | "loan" | "payment" | "security" | "system";
type PerformedBy = "All" | "User" | "System" | "Admin";

export default function UserActivityLog({ logs }: UserActivityLogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<LogCategory>("All");
  const [performerFilter, setPerformerFilter] = useState<PerformedBy>("All");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPerformerDropdown, setShowPerformerDropdown] = useState(false);

  const filteredLogs = useMemo(() => {
    let result = [...logs];

    if (searchQuery) {
      result = result.filter(
        (log) =>
          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.details.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter((log) => log.category === categoryFilter);
    }

    if (performerFilter !== "All") {
      result = result.filter((log) => log.performedBy === performerFilter);
    }

    return result;
  }, [logs, searchQuery, categoryFilter, performerFilter]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "account":
        return LogIn;
      case "kyc":
        return FileCheck;
      case "loan":
        return CreditCard;
      case "payment":
        return CreditCard;
      case "security":
        return Lock;
      case "system":
        return Settings;
      default:
        return Settings;
    }
  };

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "account":
        return "bg-blue-500/20 text-blue-400";
      case "kyc":
        return "bg-green-500/20 text-green-400";
      case "loan":
        return "bg-purple-500/20 text-purple-400";
      case "payment":
        return "bg-amber-500/20 text-amber-400";
      case "security":
        return "bg-red-500/20 text-red-400";
      case "system":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPerformerIcon = (performer: string) => {
    switch (performer) {
      case "User":
        return User;
      case "System":
        return Bot;
      case "Admin":
        return Shield;
      default:
        return User;
    }
  };

  const getPerformerStyle = (performer: string) => {
    switch (performer) {
      case "User":
        return "text-blue-400";
      case "System":
        return "text-amber-400";
      case "Admin":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };

  const handleExport = () => {
    console.log("Export logs");
  };

  const categoryOptions: LogCategory[] = ["All", "account", "kyc", "loan", "payment", "security", "system"];
  const performerOptions: PerformedBy[] = ["All", "User", "System", "Admin"];

  const getCategoryLabel = (cat: string) => {
    if (cat === "All") return "All Categories";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <div className="bg-card-bg border border-card-border rounded-xl">
      {/* Header */}
      <div className="p-4 border-b border-card-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Activity Log</h3>
              <p className="text-sm text-foreground-muted">{logs.length} activities recorded</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-sidebar-bg border border-card-border rounded-lg text-sm text-foreground hover:bg-card-border transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <input
              type="text"
              placeholder="Search activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-sidebar-bg border border-card-border rounded-lg text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-sidebar-bg border border-card-border rounded-lg text-sm text-foreground"
            >
              {getCategoryLabel(categoryFilter)}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-card-bg border border-card-border rounded-lg shadow-lg z-10 min-w-[160px]">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategoryFilter(cat);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-sidebar-bg transition-colors ${
                      categoryFilter === cat ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {getCategoryLabel(cat)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Performed By Filter */}
          <div className="relative">
            <button
              onClick={() => setShowPerformerDropdown(!showPerformerDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-sidebar-bg border border-card-border rounded-lg text-sm text-foreground"
            >
              By: {performerFilter}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showPerformerDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-card-bg border border-card-border rounded-lg shadow-lg z-10 min-w-[120px]">
                {performerOptions.map((performer) => (
                  <button
                    key={performer}
                    onClick={() => {
                      setPerformerFilter(performer);
                      setShowPerformerDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-sidebar-bg transition-colors ${
                      performerFilter === performer ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {performer}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4">
        <div className="space-y-4">
          {filteredLogs.map((log, index) => {
            const CategoryIcon = getCategoryIcon(log.category);
            const PerformerIcon = getPerformerIcon(log.performedBy);

            return (
              <div key={log.id} className="flex gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getCategoryStyle(log.category)}`}>
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  {index < filteredLogs.length - 1 && (
                    <div className="w-px h-full bg-card-border mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        {log.action}
                      </h4>
                      <p className="text-sm text-foreground-muted mb-2">
                        {log.details}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-foreground-muted">
                        <div className="flex items-center gap-1">
                          <PerformerIcon className={`w-3.5 h-3.5 ${getPerformerStyle(log.performedBy)}`} />
                          <span>{log.performedBy}</span>
                        </div>
                        {log.ipAddress && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Globe className="w-3.5 h-3.5" />
                              <span>{log.ipAddress}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-foreground">{log.date}</p>
                      <p className="text-xs text-foreground-muted">{log.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-8 text-foreground-muted">
          No activity logs found
        </div>
      )}
    </div>
  );
}
