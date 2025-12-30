import React, { ReactNode } from 'react';

interface ActionButtonProps {
  onClick: () => void;
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  trailingIcon?: ReactNode;
}

/**
 * Composant ActionButton pour les boutons d'action principaux
 * - Utilisé sur Dashboard pour Lexicon, Grammar, etc.
 * - Hover effects avec accent color
 * - Icône avec accent color
 */
export const ActionButton: React.FC<ActionButtonProps> = ({ 
  onClick,
  icon,
  title,
  description,
  className = '',
  trailingIcon
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-5 rounded-lg border transition-all group text-left w-full ${className}`}
      style={{
        backgroundColor: 'var(--elevated)',
        borderColor: 'var(--border)'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div className="flex justify-between items-start mb-3">
        <div 
          className="p-2 rounded-md"
          style={{ backgroundColor: 'rgb(from var(--accent) r g b / 0.2)' }}
        >
          <div 
            style={{ color: 'var(--accent)' }}
            className="group-hover:scale-110 transition-transform"
          >
            {icon}
          </div>
        </div>
        {trailingIcon && (
          <div style={{ color: 'var(--text-tertiary)' }}>
            {trailingIcon}
          </div>
        )}
      </div>
      <div className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
        {title}
      </div>
      {description && (
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          {description}
        </p>
      )}
    </button>
  );
};
