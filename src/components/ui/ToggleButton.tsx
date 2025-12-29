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
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase transition-all w-full ${roundedClass}`}
      style={
        isActive
          ? { backgroundColor: 'var(--accent)', color: 'var(--text-primary)', flex: 1 }
          : { color: 'var(--text-secondary)', flex: 1 }
      }
      title={title}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {label}
    </button>
  );
};
