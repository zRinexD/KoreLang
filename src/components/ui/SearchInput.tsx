import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Search input component with icon and clear button
 * - Search icon on the left
 * - Clear button (X) on the right when text is present
 * - Supports all standard input events
 */
export const SearchInput: React.FC<SearchInputProps> = ({ 
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  className = '',
  autoFocus = false,
  onKeyDown
}) => {
  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={`relative ${className}`}>
      <Search 
        className="absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" 
        size={18} 
        style={{ color: 'var(--text-secondary)' }} 
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        className="w-full ps-10 pe-10 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all shadow-sm"
        style={{ 
          backgroundColor: 'var(--surface)', 
          color: 'var(--text-primary)', 
          border: `1px solid var(--border)`, 
          outline: 'none', 
          caretColor: 'var(--accent)',
          '--tw-ring-color': 'var(--accent)'
        } as React.CSSProperties}
      />
      {value && (
        <button 
          onClick={handleClear} 
          className="absolute end-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity" 
          style={{ color: 'var(--text-secondary)' }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
