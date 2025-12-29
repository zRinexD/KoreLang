import React from 'react';

interface ToggleButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
  title?: string;
  position?: 'first' | 'last' | 'middle';
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({ isActive, onClick, icon, label, title, position = 'first' }) => {
  const roundedClass = position === 'first' ? 'rounded-l' : position === 'last' ? 'rounded-r' : '';

  const baseStyles = {
    backgroundColor: 'var(--surface)',
    borderColor: 'var(--border)',
    color: 'var(--text-secondary)',
    flex: 1,
  } as const;

  const activeStyles = {
    backgroundColor: 'var(--accent)',
    borderColor: 'var(--accent)',
    color: 'var(--text-primary)',
    boxShadow: '0 0 0 1px var(--accent)',
  } as const;

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-colors border w-full ${roundedClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-0 disabled:opacity-60`}
      style={isActive ? { ...baseStyles, ...activeStyles } : baseStyles}
      title={title}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{label}</span>
    </button>
  );
};
