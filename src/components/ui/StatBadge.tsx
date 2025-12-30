import React, { ReactNode } from 'react';

interface StatBadgeProps {
  value: ReactNode;
  label: ReactNode;
  className?: string;
}

/**
 * Small stat badge for inline display (e.g. in headers)
 * Compact vertical layout with number above label
 */
export const StatBadge: React.FC<StatBadgeProps> = ({ 
  value,
  label,
  className = ''
}) => {
  return (
    <div 
      className={`rounded text-center flex flex-col items-center px-2 py-1 gap-0.5 ${className}`}
      style={{
        backgroundColor: 'var(--secondary)'
      }}
    >
      <div className="font-bold leading-none text-sm" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div 
        className="text-[8px] uppercase font-semibold"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {label}
      </div>
    </div>
  );
};
