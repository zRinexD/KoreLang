import React from "react";
import { PlusCircle, Trash2 } from "lucide-react";

interface SelectPhonemeButtonProps {
  symbol: string;
  name: string;
  icon?: 'plus' | 'trash';
  onIconClick: () => void;
  // onClick?: () => void; // Pour usage futur (ex: diacritiques)
}

const SelectPhonemeButton: React.FC<SelectPhonemeButtonProps> = ({
  symbol,
  name,
  icon,
  onIconClick,
}) => {
  return (
    <div
      className="relative flex flex-col items-center justify-center p-1 border-2 border-[var(--border)] w-15 h-15 bg-[var(--surface)]"
      style={{ width: 100, height: 60 }}
    >
      {icon === 'plus' && (
        <button
          type="button"
          className="absolute top-0 right-0 flex items-center justify-center hover:text-[var(--accent-strong)] transition-colors"
          style={{ zIndex: 2, width: 24, height: 24, padding: 0, margin: 0, background: 'none' }}
          onClick={e => { e.stopPropagation(); onIconClick(); }}
          title="Ajouter"
        >
          <PlusCircle size={20} color="var(--accent)" />
        </button>
      )}
      {icon === 'trash' && (
        <button
          type="button"
          className="absolute top-0 right-0 bg-transparent rounded-full flex items-center justify-center hover:bg-[var(--error-bg)] transition-colors"
          style={{ zIndex: 2, width: 22, height: 22, padding: 0, margin: 0 }}
          onClick={e => { e.stopPropagation(); onIconClick(); }}
          title="Supprimer"
        >
          <Trash2 size={16} style={{ color: 'var(--error)' }} />
        </button>
      )}
      <span className="mb-1 font-serif text-xl font-bold">{symbol}</span>
      <span className="text-[8px] uppercase text-center font-normal" style={{ color: 'var(--text-tertiary)' }}>{name.replace(/([A-Z])/g, ' $1').trim()}</span>
    </div>
  );
};

export default SelectPhonemeButton;
