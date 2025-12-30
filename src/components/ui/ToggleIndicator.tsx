import React from 'react';

interface ToggleIndicatorProps {
  active: boolean;
  label: string;
  offText?: string;
  onText?: string;
  className?: string;
}

/**
 * Visual toggle indicator (non-interactive)
 * Shows a sliding button with ON/OFF background labels
 */
export const ToggleIndicator: React.FC<ToggleIndicatorProps> = ({ 
  active, 
  label, 
  offText = 'OFF', 
  onText = 'ON',
  className = '' 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center w-16 h-full overflow-hidden transition-all border ${className}`}
      style={{
        backgroundColor: active ? 'color-mix(in srgb, var(--primary) 25%, transparent)' : 'var(--disabled)',
        borderColor: active ? 'color-mix(in srgb, var(--primary) 60%, var(--border))' : 'var(--border)',
        boxShadow: active ? '0 0 10px rgb(from var(--primary) r g b / 0.25)' : 'none'
      }}
    >
      <span 
        className="absolute inset-0 flex items-center justify-between px-2 text-[6px]"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <span>{offText}</span>
        <span>{onText}</span>
      </span>
      <div
        className="absolute inset-y-0 w-8 flex items-center justify-center text-[9px] font-bold transition-transform shadow-md"
        style={{
          backgroundColor: active ? 'var(--primary)' : 'var(--border)',
          color: 'white',
          transform: active ? 'translateX(1px)' : 'translateX(31px)'
        }}
      >
        {label}
      </div>
    </div>
  );
};
