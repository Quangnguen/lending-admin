"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  UserFilters,
  UserTable,
  Pagination,
  mockUsers,
  User,
} from "@/components/admin/users";

export default function UsersPage() {
  const router = useRouter();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [kycFilter, setKycFilter] = useState("KYC Status");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.id.includes(searchQuery);

      // Role filter
      const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;

      // Status filter
      const matchesStatus = statusFilter === "All Statuses" || user.status === statusFilter;

      // KYC filter
      const matchesKyc = kycFilter === "KYC Status" || user.kycStatus === kycFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesKyc;
    });
  }, [searchQuery, roleFilter, statusFilter, kycFilter]);

  // Paginated users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Reset to first page when filters change
  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  // Action handlers
  const handleViewUser = (user: User) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleEditUser = (user: User) => {
    router.push(`/admin/users/${user.id}?edit=true`);
  };

  const handleDeleteUser = (user: User) => {
    console.log("Delete user:", user);
    // TODO: Show confirmation dialog
  };

  const handleExport = () => {
    console.log("Export users");
    // TODO: Implement export functionality
  };

  const handleCreateUser = () => {
    console.log("Create new user");
    // TODO: Navigate to create page or open modal
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-foreground-muted mt-1">
            Manage all internal staff and external customers.
          </p>
        </div>
       
      </div>

      {/* Filters */}
      <UserFilters
        searchQuery={searchQuery}
        onSearchChange={handleFilterChange(setSearchQuery)}
        roleFilter={roleFilter}
        onRoleChange={handleFilterChange(setRoleFilter)}
        statusFilter={statusFilter}
        onStatusChange={handleFilterChange(setStatusFilter)}
        kycFilter={kycFilter}
        onKycChange={handleFilterChange(setKycFilter)}
        onExport={handleExport}
      />

      {/* Table */}
      <UserTable
        users={paginatedUsers}
        onViewUser={handleViewUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
