import React from "react";
import { ViewState } from "../types";
import { ToggleIndicator } from "./ui/ToggleIndicator";

interface FooterProps {
  project: {
    projectName: string;
    lexicon: any[];
    phonology?: {
      consonants?: any[];
      vowels?: any[];
    };
    settings?: {
      enableAI?: boolean;
    };
  };
  currentView?: ViewState;
}

export const Footer: React.FC<FooterProps> = ({ project, currentView }) => {
  // Calculate total phonemes for phonology view
  const totalPhonemes = (project.phonology?.consonants?.length || 0) + (project.phonology?.vowels?.length || 0);
  
  return (
    <footer className="h-6 bg-[var(--surface)] border-t border-neutral-700 flex items-center pl-4  text-xs gap-4 shrink-0 z-50 relative" style={{ color: 'var(--text-secondary)' }}>
      <span className="flex items-center gap-1 font-bold" style={{ color: 'var(--accent)' }}>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></span>
        Auto-Saved
      </span>
      <span style={{ color: 'var(--text-secondary)' }}>{project.projectName}</span>
      <span className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)', opacity: 0.8 }}>v1.1</span>
      <span className="ml-auto">{totalPhonemes} phonems</span>
      <span>{project.lexicon?.length || 0} Words</span>
      <ToggleIndicator active={project.settings?.enableAI || false} label="AI" />
    </footer>
  );
};
