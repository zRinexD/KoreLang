import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  className?: string;
  renderOption?: (option: string) => string; // NEW PROP for i18n
}

const Combobox: React.FC<ComboboxProps> = ({ value, onChange, options, placeholder, className, renderOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (opt: string) => {
    onChange(opt);
    setIsOpen(false);
  };

  // Determine display value
  const displayValue = renderOption ? (options.includes(value) ? renderOption(value) : value) : value;

  // UX IMPROVEMENT: If the input matches exactly one option (the currently selected one),
  // we want to show ALL options when the dropdown opens, so the user doesn't have to clear the input to see others.
  const filteredOptions = options.filter(opt => {
      // If menu is open and the current input matches the selected value exactly, SHOW ALL
      // This solves the issue where "Noun" hides "Verb"
      if (isOpen && value === opt) return true;
      if (isOpen && options.includes(value)) return true; // Show all if value is a valid option

      const label = renderOption ? renderOption(opt) : opt;
      return label.toLowerCase().includes(displayValue.toLowerCase()) || opt.toLowerCase().includes(displayValue.toLowerCase());
  });

  // If filtered is empty or only contains current value, allow showing full list on explicit open?
  // The above logic covers most cases. 
  // Let's ensure if we type "V", we get Verb.
  
  const finalOptions = (isOpen && options.includes(value) && displayValue === (renderOption ? renderOption(value) : value)) 
      ? options // Show full list if the input is "clean" (equals selection)
      : options.filter(opt => { // Otherwise filter
          const label = renderOption ? renderOption(opt) : opt;
          return label.toLowerCase().includes(displayValue.toLowerCase()) || opt.toLowerCase().includes(displayValue.toLowerCase());
      });


  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          // CHANGED: pr-8 -> pe-8 to support RTL (padding-end)
          className="w-full bg-slate-950 border border-slate-700 rounded p-2 pe-8 focus:outline-none focus:ring-1 transition-all"
          style={{ color: 'var(--text-primary)', borderColor: isOpen ? 'var(--accent)' : '' }}
          placeholder={placeholder}
        />
        <button 
          onClick={() => setIsOpen(!isOpen)}
          // CHANGED: right-2 -> end-2 to support RTL (position-end)
          className="absolute end-2 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}    
          tabIndex={-1}
        >
          <ChevronDown size={14} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-700 rounded-md shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          {finalOptions.length > 0 ? (
            finalOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                // CHANGED: text-left -> text-start to support RTL
                className="w-full text-start px-3 py-2 text-sm flex items-center justify-between"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <span>{renderOption ? renderOption(opt) : opt}</span>
                {value === opt && <Check size={14} style={{ color: 'var(--accent)' }} />}
              </button>
            ))
          ) : (
             <div className="px-3 py-2 text-xs text-slate-500 italic">
               Press Enter to use custom value
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Combobox;