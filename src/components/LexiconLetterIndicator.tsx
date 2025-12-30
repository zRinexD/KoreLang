import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  letter: string;
  count: number;
  isConflictGroup?: boolean;
  onClick?: () => void;
}

const LexiconLetterIndicator: React.FC<Props> = ({ letter, count, isConflictGroup = false, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const baseStyle = isConflictGroup
    ? { backgroundColor: 'rgb(from var(--error) r g b / 0.08)', color: 'var(--error)' }
    : { backgroundColor: 'var(--surface)', color: 'var(--text-secondary)' };

  return (
    <span
      className="inline-flex items-baseline gap-2 px-3 py-1 text-xs font-bold leading-none tracking-wide shadow-sm"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '0 0 10px 0',
        border: '1px solid',
        borderColor: isConflictGroup ? 'var(--error)' : 'var(--divider)',
        backgroundColor: hovered
          ? (isConflictGroup ? baseStyle.backgroundColor : 'var(--elevated)')
          : baseStyle.backgroundColor,
        color: hovered
          ? (isConflictGroup ? baseStyle.color : 'var(--text-primary)')
          : baseStyle.color
      }}
    >
      {isConflictGroup && <AlertTriangle size={14} />}
      <span className="leading-none">{letter}</span>
      <span
        className="text-[10px] font-light leading-none"
        style={isConflictGroup ? { color: 'var(--error)', opacity: 0.6 } : { color: 'var(--text-tertiary)' }}
      >
        {count}
      </span>
    </span>
  );
};

export default LexiconLetterIndicator;
