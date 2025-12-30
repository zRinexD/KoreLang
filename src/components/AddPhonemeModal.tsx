import React from "react";
import { Modal } from "./ui";
import { useTranslation } from "../i18n";
import { PhonemeModel } from "../types";

interface AddPhonemeModalProps {
  isOpen: boolean;
  isConsonant: boolean;
  onClose: () => void;
  place: string;
  manner: string;
  phonemes: PhonemeModel[];
  onSelect: (phoneme: PhonemeModel) => void;
}

const AddPhonemeModal: React.FC<AddPhonemeModalProps> = ({
  isOpen,
  isConsonant,
  onClose,
  place,
  manner,
  phonemes,
  onSelect,
}) => {
  const { t } = useTranslation();

  const availablePhonemes = [
    { id: "dummy1", symbol: "d", name: "Dummy 1" },
    { id: "dummy2", symbol: "d2", name: "Dummy 2" },
    { id: "dummy3", symbol: "d3", name: "Dummy 3" },
  ];

  const [selectedPhonemeId, setSelectedPhonemeId] = React.useState<string>(
    availablePhonemes[0]?.id
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
        {`${place} / ${manner}`}
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
              [{phoneme.symbol}] {phoneme.name}
            </option>
          ))}
        </select>
        <button
          className="mt-2 px-4 py-2 rounded bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-dark)]"
          disabled={!selectedPhonemeId}
          onClick={() => {}}
        >
          {t("phonology.add_phoneme")}
        </button>
      </div>
    </Modal>
  );
};

export default AddPhonemeModal;
