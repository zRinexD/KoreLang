import React from "react";

interface FooterProps {
  project: {
    projectName: string;
    lexicon: any[];
    settings?: {
      enableAI?: boolean;
    };
  };
}

export const Footer: React.FC<FooterProps> = ({ project }) => {
  return (
    <footer className="h-6 bg-[var(--bg-panel)] border-t border-neutral-700 flex items-center px-4 text-xs text-[var(--text-2)] gap-4 shrink-0 z-50 relative">
      <span className="flex items-center gap-1 font-bold text-emerald-500">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        Auto-Saved
      </span>
      <span className="text-neutral-400">{project.projectName}</span>
      <span className="text-neutral-500/80 font-mono text-[11px]">v1.1</span>
      <span className="ml-auto">Ln 1, Col 1</span>
      <span>{project.lexicon?.length || 0} Words</span>
      <span>AI: {project.settings?.enableAI ? "READY" : "OFF"}</span>
    </footer>
  );
};
