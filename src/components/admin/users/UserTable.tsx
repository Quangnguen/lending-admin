"use client";

import UserAvatar from "./UserAvatar";
import ActionMenu from "./ActionMenu";
import { User, roleBadgeColors, statusConfig, kycStatusConfig } from "./types";

interface UserTableProps {
  users: User[];
  onViewUser?: (user: User) => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
}

export default function UserTable({
  users,
  onViewUser,
  onEditUser,
  onDeleteUser,
}: UserTableProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-card-border">
            <th className="text-left px-6 py-4 text-sm font-medium text-foreground-muted">
              User
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-foreground-muted">
              Role
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-foreground-muted">
              Status
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-foreground-muted">
              KYC Status
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-foreground-muted">
              Registered Date
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-foreground-muted">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-card-border last:border-b-0 hover:bg-background-secondary transition-colors"
            >
              {/* User */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <UserAvatar name={user.name} />
                  <div>
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-sm text-foreground-muted">{user.email}</p>
                  </div>
                </div>
              </td>

              {/* Role */}
              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${roleBadgeColors[user.role]}`}
                >
                  {user.role}
                </span>
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${statusConfig[user.status].dot}`} />
                  <span className={statusConfig[user.status].color}>{user.status}</span>
                </div>
              </td>

              {/* KYC Status */}
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${kycStatusConfig[user.kycStatus].bg} ${kycStatusConfig[user.kycStatus].text}`}
                >
                  {user.kycStatus === "Verified" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  )}
                  {user.kycStatus === "Pending Review" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                  )}
                  {user.kycStatus === "Rejected" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-error" />
                  )}
                  {user.kycStatus}
                </span>
              </td>

              {/* Registered Date */}
              <td className="px-6 py-4 text-foreground-muted">{user.registeredDate}</td>

              {/* Actions */}
              <td className="px-6 py-4">
                <ActionMenu
                  user={user}
                  onView={onViewUser}
                  onEdit={onEditUser}
                  onDelete={onDeleteUser}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state */}
      {users.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-foreground-muted">Không tìm thấy người dùng nào.</p>
        </div>
      )}
    </div>
  );
}
