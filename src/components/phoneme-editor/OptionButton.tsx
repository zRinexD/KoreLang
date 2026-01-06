import React from "react";
import { Option } from "../EditPhonemOptions";

interface OptionButtonProps {
  option: Option;
  isActive: boolean;
  onToggle: () => void;
}

export const OptionButton: React.FC<OptionButtonProps> = ({ option, isActive, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-2 text-sm transition-colors border rounded-lg"
      style={{
        borderColor: isActive ? "var(--accent)" : "var(--border)",
        backgroundColor: isActive
          ? "rgb(from var(--accent) r g b / 0.12)"
          : "var(--surface)",
        color: "var(--text-primary)",
      }}
    >
      <span className="font-serif text-lg">{option.symbol}</span>
      <span
        className="text-xs tracking-wide uppercase"
        style={{ color: "var(--text-secondary)" }}
      >
        {option.label}
      </span>
    </button>
  );
};
