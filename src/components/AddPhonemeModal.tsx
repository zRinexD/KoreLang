import React from 'react';
import { Modal } from './ui';
import { useTranslation } from '../i18n';
import { PhonemeModel, ArticulationPlaceModification, RoundnessModification, TonguePositionModification, PhonationModification, OronasalProcessModification, TongueRootPositionModification, SyllabicRoleModification } from '../types';

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


  // Déterminer les options possibles pour la case sélectionnée
  const isVowel = phonemes.length > 0 && phonemes[0].category === 'vowel';
  let filtered: PhonemeModel[] = [];
  if (isVowel) {
    filtered = phonemes.filter(p => p.features?.height === manner && p.features?.backness === place);
  } else {
    filtered = phonemes.filter(p => p.features?.place === place && p.features?.manner === manner);
  }
  const [selectedPhonemeId, setSelectedPhonemeId] = React.useState<string>('');

  // Always update selectedPhonemeId to first available when filtered changes or modal opens
  React.useEffect(() => {
    if (isOpen && filtered.length > 0) {
      setSelectedPhonemeId(filtered[0].id);
    } else if (!isOpen) {
      setSelectedPhonemeId('');
    }
  }, [isOpen, filtered]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('phonology.add_phoneme') || 'Add Phoneme'}
      maxWidth="max-w-xs"
      icon={null}
    >
      <div className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
        {isVowel
          ? `${manner || ''} / ${place || ''}`
          : `${place || ''} / ${manner || ''}`}
      </div>
      <div className="flex flex-col gap-2 items-center">
        {filtered.length === 0 ? (
          <div className="text-center text-[var(--text-secondary)] text-xs py-4">
            {t('phonology.no_phoneme_found') || 'No phoneme found for this cell.'}
          </div>
        ) : (
          <>
            <select
              value={selectedPhonemeId}
              onChange={e => setSelectedPhonemeId(e.target.value)}
              style={{ minWidth: 180, minHeight: 32, border: '2px solid #888', color: '#222', background: '#fff', borderRadius: 4, fontSize: 15, margin: 4 }}
            >
              {filtered.map(phoneme => (
                <option key={phoneme.id} value={phoneme.id}>
                  [{phoneme.symbol}] {phoneme.name}
                </option>
              ))}
            </select>
            <button
              className="mt-2 px-4 py-2 rounded bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-dark)]"
              disabled={!selectedPhonemeId}
              onClick={() => {
                const selected = filtered.find(p => p.id === selectedPhonemeId);
                if (selected) onSelect(selected);
              }}
            >
              {t('phonology.add_phoneme') || 'Add Phoneme'}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AddPhonemeModal;
