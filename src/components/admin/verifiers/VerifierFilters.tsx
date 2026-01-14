"use client";

import { Search, Download } from "lucide-react";
import { Dropdown } from "@/components/admin/users";
import { statusOptions, departmentOptions } from "./types";

interface VerifierFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  departmentFilter: string;
  onDepartmentChange: (value: string) => void;
  onExport?: () => void;
}

export default function VerifierFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  departmentFilter,
  onDepartmentChange,
  onExport,
}: VerifierFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-card-bg border border-card-border rounded-lg text-sm focus:outline-none focus:border-input-focus-border"
        />
      </div>

      {/* Filter dropdowns */}
      <Dropdown
        label="All Statuses"
        options={statusOptions}
        value={statusFilter}
        onChange={onStatusChange}
      />
      <Dropdown
        label="All Departments"
        options={departmentOptions}
        value={departmentFilter}
        onChange={onDepartmentChange}
      />

      {/* Export button */}
      <button
        onClick={onExport}
        className="p-2 border border-card-border rounded-lg hover:bg-background-tertiary transition-colors"
        title="Export"
      >
        <Download className="w-4 h-4 text-foreground-muted" />
      </button>
    </div>
  );
}
