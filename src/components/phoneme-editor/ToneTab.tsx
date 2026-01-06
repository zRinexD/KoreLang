import React from "react";
import { toneLevelOptions, toneContourOptions } from "../EditPhonemOptions";
import { OptionButton } from "./OptionButton";

interface ToneTabProps {
  toneLevel: string | null;
  toneContour: string | null;
  onToggleLevel: (value: string) => void;
  onToggleContour: (value: string) => void;
}

export const ToneTab: React.FC<ToneTabProps> = ({
  toneLevel,
  toneContour,
  onToggleLevel,
  onToggleContour,
}) => (
  <div className="space-y-3">
    <div>
      <div className="mb-1 text-xs font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
        Level
      </div>
      <div className="flex flex-wrap gap-2">
        {toneLevelOptions.map((opt) => (
          <OptionButton
            key={opt.value}
            option={opt}
            isActive={toneLevel === opt.value}
            onToggle={() => onToggleLevel(opt.value)}
          />
        ))}
      </div>
    </div>
    <div>
      <div className="mb-1 text-xs font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
        Contour
      </div>
      <div className="flex flex-wrap gap-2">
        {toneContourOptions.map((opt) => (
          <OptionButton
            key={opt.value}
            option={opt}
            isActive={toneContour === opt.value}
            onToggle={() => onToggleContour(opt.value)}
          />
        ))}
      </div>
    </div>
  </div>
);
