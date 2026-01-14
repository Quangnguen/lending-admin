"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Pagination } from "@/components/admin/users";
import {
  VerifierFilters,
  VerifierTable,
  mockVerifiers,
  Verifier,
} from "@/components/admin/verifiers";

export default function VerifiersPage() {
  const router = useRouter();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter verifiers
  const filteredVerifiers = useMemo(() => {
    return mockVerifiers.filter((verifier) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        verifier.name.toLowerCase().includes(searchLower) ||
        verifier.email.toLowerCase().includes(searchLower) ||
        verifier.id.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "All Statuses" || verifier.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "All Departments" || verifier.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [searchQuery, statusFilter, departmentFilter]);

  // Paginated verifiers
  const paginatedVerifiers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVerifiers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVerifiers, currentPage]);

  const totalPages = Math.ceil(filteredVerifiers.length / itemsPerPage);

  // Reset to first page when filters change
  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  // Action handlers
  const handleViewVerifier = (verifier: Verifier) => {
    router.push(`/admin/verifiers/${verifier.id}`);
  };

  const handleEditVerifier = (verifier: Verifier) => {
    router.push(`/admin/verifiers/${verifier.id}?edit=true`);
  };

  const handleToggleStatus = (verifier: Verifier) => {
    console.log("Toggle status:", verifier);
    // TODO: Implement status toggle
  };

  const handleExport = () => {
    console.log("Export verifiers");
    // TODO: Implement export
  };

  const handleAddVerifier = () => {
    router.push("/admin/verifiers/new");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Verifier Management</h1>
          <p className="text-foreground-muted mt-1">
            Manage verification staff and monitor their performance.
          </p>
        </div>
        <button
          onClick={handleAddVerifier}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Verifier
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card-bg border border-card-border rounded-xl p-4">
          <p className="text-sm text-foreground-muted">Total Verifiers</p>
          <p className="text-2xl font-bold text-foreground mt-1">{mockVerifiers.length}</p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-xl p-4">
          <p className="text-sm text-foreground-muted">Active Now</p>
          <p className="text-2xl font-bold text-success mt-1">
            {mockVerifiers.filter((v) => v.status === "Active").length}
          </p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-xl p-4">
          <p className="text-sm text-foreground-muted">Total Pending Cases</p>
          <p className="text-2xl font-bold text-warning mt-1">
            {mockVerifiers.reduce((sum, v) => sum + v.stats.pendingCases, 0)}
          </p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-xl p-4">
          <p className="text-sm text-foreground-muted">Avg Approval Rate</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {Math.round(
              mockVerifiers.reduce((sum, v) => sum + v.stats.approvalRate, 0) / mockVerifiers.length
            )}
            %
          </p>
        </div>
      </div>

      {/* Filters */}
      <VerifierFilters
        searchQuery={searchQuery}
        onSearchChange={handleFilterChange(setSearchQuery)}
        statusFilter={statusFilter}
        onStatusChange={handleFilterChange(setStatusFilter)}
        departmentFilter={departmentFilter}
        onDepartmentChange={handleFilterChange(setDepartmentFilter)}
        onExport={handleExport}
      />

      {/* Table */}
      <VerifierTable
        verifiers={paginatedVerifiers}
        onView={handleViewVerifier}
        onEdit={handleEditVerifier}
        onToggleStatus={handleToggleStatus}
      />

      {/* Pagination */}
      {filteredVerifiers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredVerifiers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
