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

import * as PhonemeCategories from "../phonemeCategories";
import { PhonemeDataService } from "../services/PhonemeDataService";
import { StatBadge } from "./ui/StatBadge";

const AddPhonemeModal: React.FC<AddPhonemeModalProps> = ({
  isOpen,
  onClose,
  place,
  manner,
  phonemes,
  onSelect,
}) => {
  const { t } = useTranslation();

  // Déterminer la liste à utiliser selon place/manner
  // (exemple simple, à adapter selon structure réelle)
  let availablePhonemes: any[] = [];
  // Correction : map enums to correct property names in PhonemeCategories
  function getCategoryKey(val: any): string {
    if (!val) return '';
    // exceptions pour les noms de catégories
    switch (val) {
      case 'nasal': return 'nasals';
      case 'plosive': return 'plosive';
      case 'trill': return 'trill';
      case 'tap': return 'tapOrFlap';
      case 'fricative': return 'fricative';
      case 'lateral-fricative': return 'lateralFricative';
      case 'approximant': return 'approximant';
      case 'lateral-approximant': return 'lateralApproximant';
      default: return val;
    }
  }

  const placeKey = getCategoryKey(place);
  const mannerKey = getCategoryKey(manner);
  if (placeKey && (PhonemeCategories as any)[placeKey]) {
    // consonnes par place
    availablePhonemes = (PhonemeCategories as any)[placeKey].filter((p: string) => {
      if (mannerKey && (PhonemeCategories as any)[mannerKey]) {
        return (PhonemeCategories as any)[mannerKey].includes(p);
      }
      return true;
    }).map((id: string) => {
      // On suppose que id correspond à une valeur de PhonemeType
      const ipa = PhonemeDataService.getIPA(id as PhonemeType) || id;
      // Chercher le nom humain si possible (sinon fallback sur id)
      const model = phonemes.find(p => p.id === id);
      return {
        id,
        symbol: ipa,
        name: model?.name || id
      };
    });
  } else if (mannerKey && (PhonemeCategories as any)[mannerKey]) {
    // voyelles par manner (hauteur)
    availablePhonemes = (PhonemeCategories as any)[mannerKey].map((id: string) => {
      const ipa = PhonemeDataService.getIPA(id as PhonemeType) || id;
      const model = phonemes.find(p => p.id === id);
      return {
        id,
        symbol: ipa,
        name: model?.name || id
      };
    });
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
