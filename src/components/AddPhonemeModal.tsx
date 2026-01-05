import React, { useEffect, useState } from "react";
import { CompactButton, Modal } from "./ui";
import { useTranslation } from "../i18n";
import { PhonemeType } from "../types";
import { PlusCircle } from "lucide-react";

import { Manner, Place, Height, Backness } from "../types";
import { PhonemeInstance } from "../types";

import SelectPhonemeButton from "./SelectPhonemeButton";
import EditPhonemModal from "./EditPhonemModal";
interface AddPhonemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: Place | Backness | null;
  manner: Manner | Height | null;
  onRemove?: (phonemeId: string) => void;
  existingPhonemes?: { id: string; symbol: string; name: string }[];
  onAddPhoneme: (
    phoneme: PhonemeInstance,
    row: string,
    col: string,
    isVowel: boolean
  ) => void;
}

import { PhonemeDataService } from "../services/PhonemeDataService";
import { getPhonemesForCell } from "../services/phonemeGridUtils";

const AddPhonemeModal: React.FC<AddPhonemeModalProps> = ({
  isOpen,
  onClose,
  place,
  manner,
  existingPhonemes = [],
  onAddPhoneme,
}) => {
  const { t } = useTranslation();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [pendingPhonemes, setPendingPhonemes] = useState<PhonemeType[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setIsEditOpen(false);
      setPendingPhonemes([]);
    }
  }, [isOpen]);

  const onOpenEditPhonemeModal = (phonemeId: string) => {};

  const onOpenEditPhoneme = (availablePhonemes: PhonemeType[]) => {
    setPendingPhonemes(availablePhonemes);
    setIsEditOpen(true);
  };

  let availablePhonemesData: { id: string; symbol: string; name: string }[] = [];
  let availablePhonemes: PhonemeType[] = [];

  if (place && manner) {
    const isVowel =
      typeof manner === "string" &&
      Object.values(Height).includes(manner as Height);
    availablePhonemes = getPhonemesForCell(manner as any, place as any, isVowel);
    availablePhonemesData = availablePhonemes.map((pt) => ({
      id: pt,
      symbol: PhonemeDataService.getIPA(pt) || pt,
      name: pt,
    }));
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${place} ${manner}`}
      maxWidth="max-w-md"
      icon={null}
    >
      <div
        className="sticky top-0 flex items-center text-xs font-bold uppercase"
        style={{ color: "var(--text-tertiary)" }}
      >
        {t("phonology.registered_phonemes")}
        <CompactButton
          onClick={() => {onOpenEditPhoneme(availablePhonemes); }}
          icon={<PlusCircle />}
          title={t("phonology.add_phoneme")}
          variant="ghost"
          disabled={availablePhonemesData.length === 0}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {existingPhonemes.length > 0 ? (
          existingPhonemes.map((ph) => (
            <SelectPhonemeButton
              key={ph.id}
              symbol={ph.symbol}
              name={t(`phonology.${ph.name}`)}
              onIconClick={() => onOpenEditPhonemeModal(ph.id)}
            />
          ))
        ) : (
          <span className="text-xs text-[var(--text-tertiary)]">
            {t("phonology.no_registered_phoneme")}
          </span>
        )}
      </div>
      <EditPhonemModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        availablePhonemes={pendingPhonemes}
        onAdd={(payload) => {
          if (!place || !manner) return;
          const isVowel =
            typeof manner === "string" &&
            Object.values(Height).includes(manner as Height);

          const displaySymbol =
            PhonemeDataService.buildPhonemSymbol(payload.id) || payload.symbol;

          const instance: PhonemeInstance = {
            id: payload.id,
            phoneme: payload.phoneme as PhonemeType,
            type: isVowel ? "vowel" : "consonant",
            manner: !isVowel ? (manner as string) : undefined,
            place: !isVowel ? (place as string) : undefined,
            height: isVowel ? (manner as string) : undefined,
            backness: isVowel ? (place as string) : undefined,
            diacritics: [...payload.diacritics, ...payload.suprasegmentals].concat(
              [payload.toneLevel, payload.toneContour].filter(Boolean) as string[]
            ),
            features: {
              displaySymbol,
              flags: payload.flags.toString(),
            },
          };

          onAddPhoneme(instance, manner as string, place as string, isVowel);
          setIsEditOpen(false);
          onClose();
        }}
      />
    </Modal>
  );
};

export default AddPhonemeModal;
