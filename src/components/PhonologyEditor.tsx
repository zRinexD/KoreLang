import { PhonemeDataService } from "../services/PhonemeDataService";
import React from "react";
import { Volume2 } from "lucide-react";
import { PhonologyConfig, PhonemeInstance, PhonemeModel } from "../types";

import { ViewLayout, StatBadge, CIcon, VIcon } from "./ui";
import PhonemeGrid from "./PhonemeGrid";
import { useTranslation } from "../i18n";

interface PhonologyEditorProps {
  phonology: PhonologyConfig;
  setData: (data: PhonologyConfig) => void;
  setPendingPhonology?: (pending: any) => void;
  enableAI?: boolean;
}

const PhonologyEditor: React.FC<PhonologyEditorProps> = (props) => {
  const { phonology, setData } = props;
  const getConsonantPhonemes = React.useCallback(
    (manner: string, place: string) =>
      phonology.consonants.filter(
        (p) => p.manner === manner && p.place === place
      ),
    [phonology.consonants]
  );

  // Utility: get phonemes for a vowel cell
  const getVowelPhonemes = React.useCallback(
    (height: string, backness: string) =>
      phonology.vowels.filter(
        (p) => p.height === height && p.backness === backness
      ),
    [phonology.vowels]
  );

  // Remove a phoneme instance
  const handleRemove = (instance: PhonemeInstance, isVowel: boolean) => {
    if (isVowel) {
      setData({
        ...phonology,
        vowels: phonology.vowels.filter((p) => p.id !== instance.id),
      });
    } else {
      setData({
        ...phonology,
        consonants: phonology.consonants.filter((p) => p.id !== instance.id),
      });
    }
  };

  // Add a phoneme instance to the grid
  const handleAddPhoneme = (
    phonemeInstance: PhonemeInstance,
    row: string,
    col: string,
    isVowel: boolean
  ) => {
    if (isVowel) {
      setData({ ...phonology, vowels: [...phonology.vowels, phonemeInstance] });
    } else {
      setData({
        ...phonology,
        consonants: [...phonology.consonants, phonemeInstance],
      });
    }
  };

  // Render a phoneme instance (symbol)
  const renderPhoneme = (p: PhonemeInstance) => (
    <span>{PhonemeDataService.getIPA(p.phoneme)}</span>
  );

  const { t } =useTranslation();
  return (
    <ViewLayout
      icon={Volume2}
      title="Phonology"
      subtitle="Manage your phoneme inventory and grid."
      headerChildren={
        <div className="flex gap-2">
          <StatBadge
            value={phonology.consonants.length}
            label="C"
            className="min-w-[50px]"
          />
          <StatBadge
            value={phonology.vowels.length}
            label="V"
            className="min-w-[50px]"
          />
        </div>
      }
    >
      <div className="flex gap-8 p-8">
        <div className="flex-1">
          <PhonemeGrid
            title={t("phonology.consonants")}
            icon={<CIcon />}
            isVowels={false}
            getPhonemes={getConsonantPhonemes}
            onRemove={(p) => handleRemove(p, false)}
            renderPhoneme={renderPhoneme}
            onAddPhoneme={handleAddPhoneme}
          />
        </div>
        <div className="flex-1">
          <PhonemeGrid
            title={t("phonology.vowels")}
            icon={<VIcon />}
            isVowels={true}
            getPhonemes={getVowelPhonemes}
            onRemove={(p) => handleRemove(p, true)}
            renderPhoneme={renderPhoneme}
            onAddPhoneme={handleAddPhoneme}
          />
        </div>
      </div>
    </ViewLayout>
  );
};

export default PhonologyEditor;
