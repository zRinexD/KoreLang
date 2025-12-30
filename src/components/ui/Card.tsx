import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'elevated' | 'surface';
  onClick?: () => void;
}

/**
 * Composant Card réutilisable avec:
 * - Thème intégré (couleurs CSS variables)
 * - Bords arrondis
 * - Variantes elevated/surface
 */
export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  variant = 'elevated',
  onClick
}) => {
  const baseClasses = 'rounded-xl border';
  const elevatedStyle = {
    backgroundColor: 'var(--elevated)',
    borderColor: 'var(--border)'
  };
  const surfaceStyle = {
    backgroundColor: 'var(--surface)',
    borderColor: 'var(--border)'
  };

  const style = variant === 'elevated' ? elevatedStyle : surfaceStyle;

  return (
    <div 
      className={`${baseClasses} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
