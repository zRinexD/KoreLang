import React from "react";
import { Modal } from "./ui";
import { useTranslation } from "../i18n";
import { PhonemeModel, PhonemeType } from "../types";

import { Manner, Place, Height, Backness } from "../types";
interface AddPhonemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: Place | Backness | null;
  manner: Manner | Height | null;
  phonemes: PhonemeModel[];
  onSelect: (phoneme: PhonemeModel) => void;
}

import { PhonemeDataService } from "../services/PhonemeDataService";
import { StatBadge } from "./ui/StatBadge";
import { getPhonemesForCell } from "../services/phonemeGridUtils";

const AddPhonemeModal: React.FC<AddPhonemeModalProps> = ({
  isOpen,
  onClose,
  place,
  manner,
  phonemes,
  onSelect,
}) => {
  const { t } = useTranslation();

  // Nouvelle logique : on utilise la source centrale des phonèmes pour remplir la dropdown
  let availablePhonemes: any[] = [];
  if (place && manner) {
    const isVowel = phonemes.some(p => p.category === 'vowel');
    const found = getPhonemesForCell(phonemes, manner, place, isVowel);
    availablePhonemes = found.map((model) => ({
      id: model.id,
      symbol: PhonemeDataService.getIPA(model.id as PhonemeType) || model.symbol,
      name: model.name
    }));
  }

  const [selectedPhonemeId, setSelectedPhonemeId] = React.useState<string>(
    availablePhonemes[0]?.id || ""
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("phonology.add_phoneme")}
      maxWidth="max-w-xs"
      icon={null}
    >
      <div className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
        {place && manner ? `${t(`phonology.place.${place}`) || place} / ${t(`phonology.manner.${manner}`) || manner}` : ''}
      </div>
      <div className="flex flex-col items-center gap-2">
        <select
          value={selectedPhonemeId}
          onChange={(e) => setSelectedPhonemeId(e.target.value)}
          style={{
            minWidth: 180,
            minHeight: 32,
            border: "2px solid #888",
            color: "#222",
            background: "#fff",
            borderRadius: 4,
            fontSize: 15,
            margin: 4,
          }}
        >
          {availablePhonemes.map((phoneme) => (
            <option key={phoneme.id} value={phoneme.id}>
              {/* Badge IPA + nom */}
              {phoneme.symbol} {phoneme.name}
            </option>
          ))}
        </select>
        {/* Affichage du badge IPA + nom en dehors du select pour prévisualisation */}
        {selectedPhonemeId && (
          <div className="flex items-center gap-2 mt-2">
            <StatBadge value={availablePhonemes.find(p => p.id === selectedPhonemeId)?.symbol || ''} label="IPA" />
            <span className="font-semibold text-sm">{availablePhonemes.find(p => p.id === selectedPhonemeId)?.name || ''}</span>
          </div>
        )}
        <button
          className="mt-2 px-4 py-2 rounded bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-dark)]"
          disabled={!selectedPhonemeId}
          onClick={() => {
            const selected = availablePhonemes.find(p => p.id === selectedPhonemeId);
            if (selected) {
              const model = phonemes.find(p => p.id === selected.id);
              if (model) onSelect(model);
            }
          }}
        >
          {t("phonology.add_phoneme")}
        </button>
      </div>
    </Modal>
  );
};

export default AddPhonemeModal;
