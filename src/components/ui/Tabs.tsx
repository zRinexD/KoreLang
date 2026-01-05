import React from "react";

interface TabItem {
  key: string;
  label: string;
}

interface TabsProps {
  value: string;
  onChange: (key: string) => void;
  items: TabItem[];
  className?: string;
}

// Simple underline tabs with accent indicator
export const Tabs: React.FC<TabsProps> = ({ value, onChange, items, className = "" }) => {
  return (
    <div className={`flex items-center gap-2 border-b border-[var(--border)] ${className}`}>
      {items.map((item) => {
        const isActive = item.key === value;
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className="relative px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors"
            style={{
              color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
            }}
          >
            {item.label}
            <span
              className="absolute left-1 right-1 -bottom-[1px] h-0.5 rounded-full transition-all"
              style={{
                backgroundColor: isActive ? "var(--accent)" : "transparent",
              }}
            />
          </button>
        );
      })}
    </div>
  );
};
