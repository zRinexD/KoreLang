import { PhonemeDataService } from "../services/PhonemeDataService";
import React from "react";
import { Check, X, Trash, Volume2 } from "lucide-react";
import { PhonologyConfig, PhonemeInstance, PhonemeModel, PhonemeType } from "../types";

import { ViewLayout, StatBadge, CIcon, VIcon, CompactButton, Modal } from "./ui";
import PhonemeGrid from "./PhonemeGrid";
import { useTranslation } from "../i18n";
import { useCommandRegister } from "../state/commandStore";

interface PhonologyEditorProps {
  phonology: PhonologyConfig;
  setData: (data: PhonologyConfig) => void;
  setPendingPhonology?: (pending: any) => void;
  enableAI?: boolean;
}

const PhonologyEditor: React.FC<PhonologyEditorProps> = (props) => {
  const { phonology, setData } = props;
  const [showClearModal, setShowClearModal] = React.useState(false);
  const register = useCommandRegister();
  const { t } = useTranslation();

  // Register phoneme commands
  React.useEffect(() => {
    register({
      addPhoneme: (payload) => {
        if (!payload) return;
        const {
          basePhoneme,
          flags,
          isVowel,
          manner,
          place,
          height,
          backness,
          diacritics = [],
          suprasegmentals = [],
          toneLevel,
          toneContour,
        } = payload;

        if (!basePhoneme) return;

        // Compute ID from base + flags
        const flagsBigInt = typeof flags === "string" ? BigInt(flags) : flags || 0n;
        const combined = `${basePhoneme}|${flagsBigInt.toString()}`;
        const encode = (input: string) => {
          try {
            return btoa(unescape(encodeURIComponent(input)));
          } catch {
            return Array.from(input)
              .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
              .join("");
          }
        };
        const hash = encode(combined);
        const id = `${basePhoneme}#${hash}`;

        const displaySymbol = PhonemeDataService.buildPhonemSymbol(id) || "";

        const instance: PhonemeInstance = {
          id,
          phoneme: basePhoneme as PhonemeType,
          type: isVowel ? "vowel" : "consonant",
          manner: !isVowel ? manner : undefined,
          place: !isVowel ? place : undefined,
          height: isVowel ? height : undefined,
          backness: isVowel ? backness : undefined,
          diacritics: [...diacritics, ...suprasegmentals].concat(
            [toneLevel, toneContour].filter(Boolean) as string[]
          ),
          features: {
            displaySymbol,
            flags: flagsBigInt.toString(),
          },
        };

        handleAddPhoneme(
          instance,
          (isVowel ? height : manner) || "",
          (isVowel ? backness : place) || "",
          !!isVowel
        );

        // Log to console (output will be visible in console view)
        console.log(`Phoneme added: ${displaySymbol || basePhoneme} (${id})`);
      },
      deletePhoneme: (payload) => {
        if (!payload?.phonemeHash) return;
        const hash = payload.phonemeHash;
        
        // Find phoneme by hash in consonants or vowels
        const consonantMatch = phonology.consonants.find((p) => p.id === hash);
        const vowelMatch = phonology.vowels.find((p) => p.id === hash);
        
        if (consonantMatch) {
          handleRemove(consonantMatch, false);
          const symbol = PhonemeDataService.buildPhonemSymbol(hash) || hash;
          console.log(`Phoneme deleted: ${symbol}`);
        } else if (vowelMatch) {
          handleRemove(vowelMatch, true);
          const symbol = PhonemeDataService.buildPhonemSymbol(hash) || hash;
          console.log(`Phoneme deleted: ${symbol}`);
        } else {
          console.error(`Phoneme not found: ${hash}`);
        }
      },
    });
  }, [register, phonology]);

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
  const renderPhoneme = (p: PhonemeInstance) => {
    const symbol =
      p.features?.displaySymbol ||
      PhonemeDataService.buildPhonemSymbol(p.id) ||
      PhonemeDataService.getIPA(p.phoneme) ||
      (typeof p.phoneme === "string" ? p.phoneme : "");
    return <span>{symbol}</span>;
  };

  return (
    <ViewLayout
      icon={Volume2}
      title={t("phonology.title")}
      subtitle={t("phonology.subtitle")}
      headerChildren={
        <div className="flex items-center gap-2">
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
          <CompactButton
            label={t("phonology.clear_inventory")}
            variant="outline"
            color="var(--error)"
            icon={<Trash />}
            onClick={() => setShowClearModal(true)}
            className="hover:bg-[var(--error)] hover:text-white hover:border-[var(--error)]"
          />
          <Modal isOpen={showClearModal} showCloseButton={false} onClose={()=>{}} title={t("phonology.clear_inventory")}>
            <div className="flex flex-col items-center p-6">
              <div className="mb-4 text-lg font-semibold">{t("phonology.clear_confirm")}</div>
              <div className="flex gap-4 mt-2">
                <CompactButton
                  label={t("common.confirm")}
                  color="var(--error)"
                  variant="solid"
                  icon={<Trash />}
                  onClick={() => {
                    setData({ ...phonology, consonants: [], vowels: [] });
                    setShowClearModal(false);
                  }}
                />
                <CompactButton
                  label={t("common.cancel")}
                  icon={<X size={14} />}
                  color="var(--error)"
                  variant="outline"
                  onClick={() => setShowClearModal(false)}
                />
              </div>
            </div>
          </Modal>
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
