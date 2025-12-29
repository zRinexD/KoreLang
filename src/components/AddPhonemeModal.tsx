import React from 'react';
import { Modal } from './ui';
import { useTranslation } from '../i18n';
import { PhonemeModel } from '../types';

interface AddPhonemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: string;
  manner: string;
  phonemes: PhonemeModel[];
  onSelect: (phoneme: PhonemeModel) => void;
}

const AddPhonemeModal: React.FC<AddPhonemeModalProps> = ({
  isOpen,
  onClose,
  place,
  manner,
  phonemes,
  onSelect
}) => {
  const { t } = useTranslation();

  // Filtrer les phonèmes selon place et manner
  const filtered = phonemes.filter(p =>
    (p.features?.place === place && p.features?.manner === manner)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('phonology.add_phoneme') || 'Add Phoneme'}
      maxWidth="max-w-xs"
      icon={null}
    >
      <div className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
        {place} / {manner}
      </div>
      <div className="flex flex-col gap-1">
        {filtered.length === 0 && (
          <div className="text-center text-[var(--text-secondary)] text-xs py-4">
            {t('phonology.no_phoneme_found') || 'No phoneme found for this cell.'}
          </div>
        )}
        {filtered.map((phoneme, idx) => (
          <button
            key={phoneme.id}
            onClick={() => onSelect(phoneme)}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors w-full text-left font-mono text-sm ${idx % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--elevated)]'} hover:bg-[var(--hover)]`}
            style={{ color: 'var(--text-primary)' }}
          >
            <span className="inline-block px-2 py-0.5 rounded bg-[var(--accent)] text-white text-xs font-bold min-w-[28px] text-center">
              {phoneme.symbol}
            </span>
            <span className="ml-2 font-sans text-sm">{phoneme.name}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
};

export default AddPhonemeModal;
