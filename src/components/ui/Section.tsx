import React, { ReactNode } from 'react';

interface SectionProps {
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
}

/**
 * Composant Section pour les sections avec titre et contenu
 * - Utilise des couleurs CSS variables
 * - Hiérarchie de texte cohérente
 */
export const Section: React.FC<SectionProps> = ({ 
  title,
  subtitle,
  children,
  className = '',
  icon
}) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        {icon && <div className="shrink-0" style={{ color: 'var(--accent)' }}>{React.cloneElement(icon as React.ReactElement, { size: 18 })}</div>}
        <div>
          <h4 
            className="text-xs font-bold tracking-wider uppercase"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h4>
          {subtitle && (
            <p 
              className="mt-1 text-[10px]"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
