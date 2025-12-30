import React, { ReactNode } from 'react';

interface CompactButtonProps {
  onClick: () => void;
  icon: ReactNode;
  label?: string;
  disabled?: boolean;
  variant?: 'solid' | 'outline' | 'ghost';
  color?: string;
  className?: string;
  hideLabel?: boolean;
  title?: string;
}

/**
 * Compact button component for header actions and UI controls
 * 
 * Variants:
 * - 'solid': Filled background with the specified color (default)
 * - 'outline': Border with the specified color, transparent background
 * - 'ghost': No border, no background, only text and icon
 * 
 * Props:
 * - variant: 'solid' | 'outline' | 'ghost' (default: 'solid')
 * - color: CSS variable or color value (default: 'var(--accent)')
 * - onClick: Click handler
 * - icon: React node for the icon
 * - label: Button label text
 * - disabled: Disable the button (default: false)
 * - hideLabel: Hide label on all screen sizes (default: false)
 * - className: Additional CSS classes
 * 
 * Examples:
 * ```tsx
 * // Solid button (default)
 * <CompactButton onClick={handleClick} icon={<Plus size={14} />} label="Add" />
 * 
 * // Outline button with custom color
 * <CompactButton 
 *   variant="outline" 
 *   color="var(--error)" 
 *   onClick={handleDelete} 
 *   icon={<Trash2 size={14} />} 
 *   label="Delete" 
 * />
 * 
 * // Ghost button
 * <CompactButton 
 *   variant="ghost" 
 *   onClick={handleCancel} 
 *   icon={<X size={14} />} 
 *   label="Cancel" 
 * />
 * 
 * // Solid button with accent color
 * <CompactButton 
 *   variant="solid"
 *   color="var(--accent)" 
 *   onClick={handleGenerate} 
 *   icon={<Wand2 size={14} />} 
 *   label="Generate" 
 * />
 * ```
 */
export const CompactButton = React.memo<CompactButtonProps>(({ 
  onClick,
  icon,
  label,
  disabled = false,
  variant = 'solid',
  color = 'var(--accent)',
  className = '',
  hideLabel = false,
  title
}) => {
  const getButtonStyles = () => {
    if (disabled) {
      return {
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        color: 'var(--text-tertiary)',
        border: '1px solid var(--border)'
      };
    }

    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'var(--surface)',
          borderColor: color,
          color: color,
          border: `1px solid ${color}`
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          color: color,
          border: '1px solid transparent'
        };
      case 'solid':
      default:
        return {
          backgroundColor: color,
          borderColor: color,
          color: 'var(--text-primary)',
          border: `1px solid ${color}`
        };
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors disabled:cursor-not-allowed hover:opacity-90 ${!hideLabel && label ? '' : 'justify-center'} ${className}`}
      style={getButtonStyles()}
    >
      {icon}
      {!hideLabel && label && <span className="hidden sm:inline">{label}</span>}
    </button>
  );
});
