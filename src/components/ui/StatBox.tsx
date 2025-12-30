import React, { ReactNode } from 'react';

interface StatBoxProps {
  value: ReactNode;
  label: ReactNode;
  icon?: ReactNode;
  className?: string;
  variant?: 'default' | 'compact';
}

/**
 * Composant StatBox pour afficher des statistiques
 * - Utilise les couleurs du thème
 * - Hiérarchie de couleurs cohérente
 */
export const StatBox: React.FC<StatBoxProps> = ({ 
  value,
  label,
  icon,
  className = '',
  variant = 'default'
}) => {
  const isCompact = variant === 'compact';

  return (
    <div 
      className={`rounded-lg border text-center flex flex-col items-center ${isCompact ? 'h-[64px] px-3 py-2 gap-1' : 'p-4 gap-2'} ${className}`}
      style={{
        backgroundColor: 'var(--elevated)',
        borderColor: 'var(--border)'
      }}
    >
      {icon && <div className={isCompact ? '' : 'mb-2'} style={{ color: 'var(--accent)' }}>{icon}</div>}
      <div className={`${isCompact ? 'text-xl leading-tight' : 'text-3xl'} font-bold`} style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div 
        className={`${isCompact ? 'text-[9px]' : 'text-[10px]'} uppercase tracking-wider font-bold ${isCompact ? '' : 'mt-1'}`}
        style={{ color: 'var(--text-tertiary)' }}
      >
        {label}
      </div>
    </div>
  );
};
