import React from "react";
import { Modal } from "./ui";
import { useTranslation } from "../i18n";
import { PhonemeType } from "../types";


import { Manner, Place, Height, Backness } from "../types";

import { Trash2, Plus } from 'lucide-react';
interface AddPhonemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: Place | Backness | null;
  manner: Manner | Height | null;
  onSelect: (phoneme: PhonemeType) => void;
  onRemove?: (phonemeId: string) => void;
  existingPhonemes?: { id: string, symbol: string, name: string }[];
}

import { PhonemeDataService } from "../services/PhonemeDataService";
import { StatBadge } from "./ui/StatBadge";
import { getPhonemesForCell } from "../services/phonemeGridUtils";

const AddPhonemeModal: React.FC<AddPhonemeModalProps> = ({
  isOpen,
  onClose,
  place,
  manner,
  onSelect,
  onRemove,
  existingPhonemes = [],
}) => {
  const { t } = useTranslation();

  // Nouvelle logique : on utilise la source centrale des phonèmes pour remplir la dropdown
  let availablePhonemes: { id: string, symbol: string, name: string }[] = [];
  if (place && manner) {
    // On déduit isVowel du contexte d'appel (ex: via props ou via le parent)
    // Ici, on suppose que la modal est appelée dans le bon contexte (consonant/vowel)
    // On tente d'inférer isVowel à partir du type de row/col
    const isVowel = typeof manner === 'string' && Object.values(Height).includes(manner as Height);
    const found = getPhonemesForCell(manner as any, place as any, isVowel);
    availablePhonemes = found.map((pt) => ({
      id: pt,
      symbol: PhonemeDataService.getIPA(pt) || pt,
      name: pt
    }));
  }




  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${place || ''} / ${manner || ''}`}
      maxWidth="max-w-xs"
      icon={null}
    >
      <div className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
        {place && manner ? `${t(`phonology.place.${place}`) || place} / ${t(`phonology.manner.${manner}`) || manner}` : ''}
      </div>
      {/* Section Registered Phonemes */}
      <div className="mb-4">
        <div className="mb-1 text-xs font-bold uppercase" style={{ color: 'var(--text-tertiary)' }}>{t('phonology.registered_phonemes') || 'Registered phonemes'}</div>
        <div className="flex flex-wrap justify-center gap-2">
          {existingPhonemes.length > 0 ? existingPhonemes.map((ph) => (
            <div key={ph.id} className="relative flex flex-col items-center justify-center p-2 rounded border border-[var(--border)] min-w-[80px] min-h-[70px] bg-[var(--surface)]">
              {typeof onRemove === 'function' && (
                <button
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-transparent hover:bg-[var(--error-bg)] flex items-center justify-center shadow-none border-none outline-none"
                  style={{ color: 'var(--error)', zIndex: 2 }}
                  onClick={() => onRemove(ph.id)}
                  title={t('phonology.remove_phoneme') || 'Remove'}
                >
                  <Trash2 size={18} />
                </button>
              )}
              <span className="mb-1 font-serif text-2xl">{ph.symbol}</span>
              <span className="text-[10px] uppercase text-center font-bold" style={{ color: 'var(--text-tertiary)' }}>{ph.name.replace(/([A-Z])/g, ' $1').trim()}</span>
            </div>
          )) : <span className="text-xs text-[var(--text-tertiary)]">{t('phonology.no_registered_phoneme') || 'No phoneme registered.'}</span>}
        </div>
      </div>
      {/* Section Add Phoneme */}
      <div>
        <div className="mb-1 text-xs font-bold uppercase" style={{ color: 'var(--text-tertiary)' }}>{t('phonology.add_phoneme') || 'Add phoneme'}</div>
        <div className="flex flex-wrap justify-center gap-2">
          {availablePhonemes.map((phoneme) => {
            const isRegistered = existingPhonemes.some(ph => ph.id === phoneme.id);
            return (
              <button
                key={phoneme.id}
                className="relative flex flex-col items-center justify-center p-2 rounded border border-[var(--border)] min-w-[80px] min-h-[70px] bg-[var(--surface)] hover:bg-[var(--accent-bg)] transition-colors"
                style={{ opacity: isRegistered ? 0.4 : 1, cursor: isRegistered ? 'not-allowed' : 'pointer' }}
                disabled={isRegistered}
                onClick={() => !isRegistered && onSelect(phoneme.id as PhonemeType)}
              >
                {/* Bouton + en overlay haut droite */}
                {!isRegistered && (
                  <span className="absolute top-1.5 right-1.5 bg-[var(--surface)] rounded-full p-0.5 shadow" style={{ zIndex: 2 }}>
                    <Plus size={16} style={{ color: 'var(--accent)' }} />
                  </span>
                )}
                {isRegistered && (
                  <span className="absolute top-1.5 right-1.5 text-[var(--accent)] font-bold">✓</span>
                )}
                <span className="mb-1 font-serif text-2xl">{phoneme.symbol}</span>
                <span className="text-[10px] uppercase text-center font-bold" style={{ color: 'var(--text-tertiary)' }}>{phoneme.name.replace(/([A-Z])/g, ' $1').trim()}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default AddPhonemeModal;
