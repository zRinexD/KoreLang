import React, { ReactNode } from 'react';

interface FormFieldProps {
  label: ReactNode;
  children: ReactNode;
  className?: string;
  required?: boolean;
  error?: string;
}

/**
 * Composant FormField pour les champs de formulaire
 * - Label avec hiérarchie cohérente
 * - Support des messages d'erreur
 * - Input styles unifiés
 */
export const FormField: React.FC<FormFieldProps> = ({ 
  label,
  children,
  className = '',
  required = false,
  error
}) => {
  return (
    <div className={className}>
      <label 
        className="block mb-2 text-xs font-bold uppercase tracking-wider"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
        {required && <span style={{ color: 'var(--error)' }}> *</span>}
      </label>
      <div>
        {children}
      </div>
      {error && (
        <p 
          className="text-xs mt-1"
          style={{ color: 'var(--error)' }}
        >
          {error}
        </p>
      )}
    </div>
  );
};
