"use client";

import { VerifierDetailTab } from "../types";

interface VerifierTabsProps {
  activeTab: VerifierDetailTab;
  onTabChange: (tab: VerifierDetailTab) => void;
}

const tabs: { id: VerifierDetailTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "reviews", label: "Reviews" },
  { id: "performance", label: "Performance" },
  { id: "settings", label: "Settings" },
];

export default function VerifierTabs({ activeTab, onTabChange }: VerifierTabsProps) {
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
