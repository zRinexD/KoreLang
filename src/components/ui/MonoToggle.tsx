import React from 'react';

interface MonoToggleProps {
    active: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
    label?: string;
    title?: string;
    className?: string;
    color?: string;
}

// Single-state toggle styled for mode switches (e.g., Script Mode)
export const MonoToggle: React.FC<MonoToggleProps> = ({ active, onClick, icon, label, title, className = '', color = 'var(--accent)' }) => {
    const baseBg = 'var(--surface)';
    const activeBg = `color-mix(in srgb, ${color} 25%, transparent)`;
    const activeBorder = `color-mix(in srgb, ${color} 60%, var(--border))`;
    const inactiveBorder = 'var(--border)';

    return (
        <button
            onClick={onClick}
            title={title}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold transition-all border shadow-sm ${className}`}
            style={{
                backgroundColor: active ? activeBg : baseBg,
                color: active ? color : 'var(--text-secondary)',
                borderColor: active ? activeBorder : inactiveBorder,
                boxShadow: active ? `0 0 10px rgb(from ${color} r g b / 0.25)` : 'none'
            }}
        >
            {icon}
            {label && <span className="hidden sm:inline">{label}</span>}
        </button>
    );
};
