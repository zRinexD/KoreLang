import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface SelectPhonemeButtonProps {
  symbol: string;
  name: string;
  icon?: 'plus' | 'trash';
  onClick: () => void;
}

const SelectPhonemeButton: React.FC<SelectPhonemeButtonProps> = ({
  symbol,
  name,
  icon,
  onClick,
}) => {
  return (
    <div
      className="relative flex flex-col items-center justify-center p-1 rounded-2xl border-2 border-[var(--border)] w-15 h-15 bg-[var(--surface)] cursor-pointer"
      style={{ width: 60, height: 60 }}
      onClick={onClick}
    >
      {icon === 'plus' && (
        <span className="absolute top-2 right-2 bg-[var(--accent)] rounded-full p-[1.5px] flex items-center justify-center" style={{ zIndex: 2, width: 14, height: 14 }}>
          <Plus size={8} style={{ color: 'white' }} />
        </span>
      )}
      {icon === 'trash' && (
        <span className="absolute top-1.5 right-1.5 bg-transparent flex items-center justify-center" style={{ zIndex: 2 }}>
          <Trash2 size={16} style={{ color: 'var(--error)' }} />
        </span>
      )}
      <span className="mb-1 font-serif text-xl font-bold">{symbol}</span>
      <span className="text-[8px] uppercase text-center font-normal" style={{ color: 'var(--text-tertiary)' }}>{name.replace(/([A-Z])/g, ' $1').trim()}</span>
    </div>
  );
};

export default SelectPhonemeButton;
