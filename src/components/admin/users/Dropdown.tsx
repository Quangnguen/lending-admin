"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function Dropdown({ label, options, value, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-card-bg border border-card-border rounded-lg text-sm text-foreground hover:bg-background-tertiary transition-colors"
      >
        {value || label}
        <ChevronDown className="w-4 h-4 text-foreground-muted" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-40 bg-card-bg border border-card-border rounded-lg shadow-lg z-20">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-background-tertiary first:rounded-t-lg last:rounded-b-lg ${
                  value === option ? "bg-background-tertiary font-medium" : ""
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
