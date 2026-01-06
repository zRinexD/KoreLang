import React from "react";
import { CategoryMap, Option } from "../EditPhonemOptions";
import { OptionButton } from "./OptionButton";

interface DiacriticsTabProps {
  categories: CategoryMap;
  combinable: Option[];
  selections: Record<string, string | null>;
  combinableSet: Set<string>;
  onToggleCategory: (category: string, value: string) => void;
  onToggleCombinable: (value: string) => void;
}

export const DiacriticsTab: React.FC<DiacriticsTabProps> = ({
  categories,
  combinable,
  selections,
  combinableSet,
  onToggleCategory,
  onToggleCombinable,
}) => (
  <div className="space-y-4">
    {Object.entries(categories).map(([key, category]) => (
      <div key={key}>
        <div className="mb-2 text-xs font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
          {category.label}
        </div>
        <div className="flex flex-wrap gap-2">
          {category.options.map((opt) => (
            <OptionButton
              key={opt.value}
              option={opt}
              isActive={selections[key] === opt.value}
              onToggle={() => onToggleCategory(key, opt.value)}
            />
          ))}
        </div>
      </div>
    ))}

    {combinable.length > 0 && (
      <div>
        <div className="mb-2 text-xs font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
          Other (Combinable)
        </div>
        <div className="flex flex-wrap gap-2">
          {combinable.map((opt) => (
            <OptionButton
              key={opt.value}
              option={opt}
              isActive={combinableSet.has(opt.value)}
              onToggle={() => onToggleCombinable(opt.value)}
            />
          ))}
        </div>
      </div>
    )}
  </div>
);
