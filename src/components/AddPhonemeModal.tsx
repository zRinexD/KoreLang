import React from "react";
import { Modal } from "./ui";
import { useTranslation } from "../i18n";
import { PhonemeType } from "../types";


import { Manner, Place, Height, Backness } from "../types";

import SelectPhonemeButton from './SelectPhonemeButton';
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

  let availablePhonemes: { id: string, symbol: string, name: string }[] = [];
  if (place && manner) {
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
      title={`${place || ''} ${manner || ''}`}
      maxWidth="max-w-xs"
      icon={null}
    >
      <div className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
        {place && manner ? `${t(`phonology.place.${place}`) || place} / ${t(`phonology.manner.${manner}`) || manner}` : ''}
      </div>
      {/* Section Registered Phonemes */}
      <div className="mb-4">
        <div className="mb-1 text-xs font-bold uppercase" style={{ color: 'var(--text-tertiary)' }}>{t('phonology.registered_phonemes') || 'Registered phonemes'}</div>
        <div className="grid items-center justify-center w-full grid-cols-2 gap-2 md:grid-cols-3">
          {existingPhonemes.length > 0 ? existingPhonemes.map((ph) => (
            <SelectPhonemeButton
              key={ph.id}
              symbol={ph.symbol}
              name={ph.name}
              icon="trash"
              onClick={typeof onRemove === 'function' ? () => onRemove(ph.id) : () => {}}
            />
          )) : <span className="text-xs text-[var(--text-tertiary)]">{t('phonology.no_registered_phoneme') || 'No phoneme registered.'}</span>}
        </div>
      </div>
      {/* Section Add Phoneme */}
      <div>
        <div className="mb-1 text-xs font-bold uppercase" style={{ color: 'var(--text-tertiary)' }}>{t('phonology.add_phoneme') || 'Add phoneme'}</div>
        <div className="grid items-center justify-center w-full grid-cols-2 gap-2 md:grid-cols-3">
          {availablePhonemes.map((phoneme) => (
            <SelectPhonemeButton
              key={phoneme.id}
              symbol={phoneme.symbol}
              name={phoneme.name}
              icon="plus"
              onClick={() => onSelect(phoneme.id as PhonemeType)}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default AddPhonemeModal;
