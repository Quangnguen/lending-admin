"use client";

import { UserDetailTab } from "./types";

interface UserTabsProps {
  activeTab: UserDetailTab;
  onTabChange: (tab: UserDetailTab) => void;
}

const tabs: { id: UserDetailTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "kyc", label: "KYC Details" },
  { id: "loans", label: "Loans" },
  { id: "transactions", label: "Transactions" },
  { id: "cases", label: "Cases & Logs" },
];

export default function UserTabs({ activeTab, onTabChange }: UserTabsProps) {
  return (
    <div className="border-b border-card-border">
      <nav className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-primary"
                : "text-foreground-muted hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
