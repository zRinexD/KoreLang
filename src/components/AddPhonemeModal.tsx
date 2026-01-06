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
  onRemove?: (phoneme: PhonemeInstance) => void;
  onReplacePhoneme?: (
    newInstance: PhonemeInstance,
    row: string,
    col: string,
    isVowel: boolean,
    originalId: string
  ) => void;
  existingPhonemes?: {
    id: string;
    symbol: string;
    name: string;
    instance?: PhonemeInstance;
  }[];
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
  onRemove,
  onReplacePhoneme,
}) => {
  const { t } = useTranslation();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [pendingPhonemes, setPendingPhonemes] = useState<PhonemeType[]>([]);
  const [editingPhoneme, setEditingPhoneme] = useState<{
    id: string;
    instance: PhonemeInstance;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsEditOpen(false);
      setPendingPhonemes([]);
      setEditingPhoneme(null);
    }
  }, [isOpen]);

  const onOpenEditPhonemeModal = (phonemeId: string) => {
    const existing = existingPhonemes.find((p) => p.id === phonemeId);
    if (!existing?.instance) return;
    
    setEditingPhoneme({ id: phonemeId, instance: existing.instance });
    setPendingPhonemes([existing.instance.phoneme as PhonemeType]);
    setIsEditOpen(true);
  };

  const onDeletePhoneme = (phonemeId: string) => {
    if (!onRemove) return;
    const existing = existingPhonemes.find((p) => p.id === phonemeId);
    if (existing?.instance) {
      onRemove(existing.instance);
    }
  };

  const onOpenEditPhoneme = (availablePhonemes: PhonemeType[]) => {
    setEditingPhoneme(null);
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
              onEdit={() => onOpenEditPhonemeModal(ph.id)}
              onDelete={() => onDeletePhoneme(ph.id)}
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
        onClose={() => {
          setIsEditOpen(false);
          setEditingPhoneme(null);
        }}
        availablePhonemes={pendingPhonemes}
        editingId={editingPhoneme?.id}
        existingPhonemeIds={existingPhonemes.map(p => p.id)}
        initialState={(() => {
          if (!editingPhoneme) return undefined;
          const inst = editingPhoneme.instance;
          const parsed = PhonemeDataService.parsePhonemeHash(inst.id);
          const flagsFromFeatures = inst.features?.flags
            ? BigInt(inst.features.flags as string)
            : null;
          return {
            basePhoneme: (parsed?.phoneme || inst.phoneme) as PhonemeType,
            flags: flagsFromFeatures ?? parsed?.flags ?? 0n,
          };
        })()}
        onAdd={(payload) => {
          if (!place || !manner) return;
          const isVowel =
            typeof manner === "string" &&
            Object.values(Height).includes(manner as Height);

          const displaySymbol =
            payload.symbol || PhonemeDataService.buildPhonemSymbol(payload.id) || payload.phoneme;

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
        onUpdate={(payload, originalId) => {
          if (!place || !manner || !editingPhoneme) return;
          const isVowel =
            typeof manner === "string" &&
            Object.values(Height).includes(manner as Height);

          const displaySymbol =
            payload.symbol || PhonemeDataService.buildPhonemSymbol(payload.id) || payload.phoneme;

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

          // Use replace callback when available to avoid stale state updates
          if (onReplacePhoneme) {
            onReplacePhoneme(instance, manner as string, place as string, isVowel, originalId);
          } else {
            // Fallback: delete then add
            if (onRemove && editingPhoneme?.instance) {
              onRemove(editingPhoneme.instance);
            }
            onAddPhoneme(instance, manner as string, place as string, isVowel);
          }

          setIsEditOpen(false);
          setEditingPhoneme(null);
          onClose();
        }}
      />
    </Modal>
  );
};

export default AddPhonemeModal;
