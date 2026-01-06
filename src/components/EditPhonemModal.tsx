import React, { useEffect, useMemo, useState } from "react";
import {
  ModalWithCustomFooter,
  Tabs,
  PhonemeCarousel,
  DefaultModalFooter,
} from "./ui";
import { PhonemeType } from "../types";
import { AllophonyRule } from "../types/allophony";
import { PhonemeDataService } from "../services/PhonemeDataService";
import {
  parseAllophonyRule,
  getApplicableRules,
  type ParsedRule,
} from "../services/AllophonyRuleParser";
import {
  combinableDiacritics,
  combinableSuprasegmentals,
  diacriticCategories,
  suprasegmentalCategories,
  tabOrder,
  toneContourOptions,
  toneLevelOptions,
  TabKey,
} from "./EditPhonemOptions";
import { DiacriticsTab } from "./phoneme-editor/DiacriticsTab";
import { SuprasegmentalsTab } from "./phoneme-editor/SuprasegmentalsTab";
import { ToneTab } from "./phoneme-editor/ToneTab";
import { AllophonesTab } from "./phoneme-editor/AllophonesTab";
import {
  computeFlags,
  computePhonemeId,
  computePhonemeName,
  computeDisplaySymbols,
} from "./phoneme-editor/phonemeHelpers";
import { decodePhonemeFlags } from "./phoneme-editor/flagMappings";
import { useAllophony } from "../contexts/AllophonyContext";

interface EditPhonemModalProps {
  isOpen: boolean;
  onCancel: () => void;
  disableCancel?: boolean;
  disableValidate?: boolean;
  availablePhonemes: PhonemeType[];
  allophonyRules?: AllophonyRule[];
  editingId?: string;
  existingPhonemeIds?: string[];
  manner?: string;
  place?: string;
  height?: string;
  backness?: string;
  initialState?: {
    basePhoneme: PhonemeType;
    flags: bigint;
  };
  onAdd?: (payload: {
    id: string;
    phoneme: string;
    symbol: string;
    name: string;
    flags: bigint;
    diacritics: string[];
    suprasegmentals: string[];
    toneLevel: string | null;
    toneContour: string | null;
  }) => void;
  onUpdate?: (
    payload: {
      id: string;
      phoneme: string;
      symbol: string;
      name: string;
      flags: bigint;
      diacritics: string[];
      suprasegmentals: string[];
      toneLevel: string | null;
      toneContour: string | null;
    },
    originalId: string
  ) => void;
}

const EditPhonemModal: React.FC<EditPhonemModalProps> = ({
  isOpen,
  onCancel,
  disableCancel,
  disableValidate,
  availablePhonemes,
  allophonyRules: allophonyRulesProp = [],
  onAdd,
  onUpdate,
  editingId,
  existingPhonemeIds = [],
  initialState,
  manner,
  place,
  height,
  backness,
}) => {
  const { allophonyRules: contextAllophonyRules } = useAllophony();
  const allophonyRules = contextAllophonyRules.length > 0 ? contextAllophonyRules : allophonyRulesProp;
  
  const [activeHeader, setActiveHeader] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("diacritics");
  const [diacriticSelections, setDiacriticSelections] = useState<Record<string, string | null>>({
    articulationPlace: null,
    secondaryArticulation: null,
    roundness: null,
    tonguePosition: null,
    phonation: null,
    tongueHeight: null,
    tongueRoot: null,
    release: null,
    syllabicity: null,
  });
  const [combinableDiacriticsSet, setCombinableDiacriticsSet] = useState<Set<string>>(new Set());
  const [suprasegmentalSelections, setSuprasegmentalSelections] = useState<Record<string, string | null>>({
    length: null,
    stress: null,
    breaks: null,
  });
  const [combinableSuprasegmentalsSet, setCombinableSuprasegmentalsSet] = useState<Set<string>>(new Set());
  const [toneLevel, setToneLevel] = useState<string | null>(null);
  const [toneContour, setToneContour] = useState<string | null>(null);

  const headerOptions = useMemo(
    () =>
      availablePhonemes.map((pt) => ({
        id: pt,
        label: pt,
        symbol: PhonemeDataService.getIPA(pt) || pt,
      })),
    [availablePhonemes]
  );

  const parsedRules = useMemo<ParsedRule[]>(() => {
    return allophonyRules
      .map((rule) => parseAllophonyRule(rule.id, rule.name, rule.rule))
      .filter((rule): rule is ParsedRule => rule !== null);
  }, [allophonyRules]);

  useEffect(() => {
    if (headerOptions.length === 0) {
      setActiveHeader(null);
      return;
    }
    if (!activeHeader || !headerOptions.some((h) => h.id === activeHeader)) {
      setActiveHeader(headerOptions[0].id);
    }
  }, [headerOptions, activeHeader]);

  const flags = useMemo(() => {
    return computeFlags(
      diacriticSelections,
      combinableDiacriticsSet,
      suprasegmentalSelections,
      combinableSuprasegmentalsSet,
      toneLevel,
      toneContour
    );
  }, [
    diacriticSelections,
    combinableDiacriticsSet,
    suprasegmentalSelections,
    combinableSuprasegmentalsSet,
    toneLevel,
    toneContour,
  ]);

  const currentPhonemeVector = useMemo(() => {
    if (!activeHeader) return 0;
    const tempInstance = {
      id: `temp#${flags.toString()}`,
      phoneme: activeHeader as PhonemeType,
      type: "consonant" as const,
      manner,
      place,
      height,
      backness,
      features: { flags: flags.toString() },
    };
    return PhonemeDataService.computeFeatureVector(tempInstance);
  }, [activeHeader, flags, manner, place, height, backness]);

  const applicableRules = useMemo(() => {
    if (!activeHeader || currentPhonemeVector === 0) return [];
    return getApplicableRules(currentPhonemeVector, parsedRules);
  }, [currentPhonemeVector, parsedRules, activeHeader]);

  const activePhonemeSymbol = useMemo(() => {
    const match = headerOptions.find((h) => h.id === activeHeader);
    return match?.symbol || "";
  }, [headerOptions, activeHeader]);

  const displayIPA = useMemo(() => {
    return computeDisplaySymbols(
      activePhonemeSymbol,
      diacriticSelections,
      combinableDiacriticsSet,
      suprasegmentalSelections,
      combinableSuprasegmentalsSet,
      toneLevel,
      toneContour
    );
  }, [
    activePhonemeSymbol,
    diacriticSelections,
    combinableDiacriticsSet,
    suprasegmentalSelections,
    combinableSuprasegmentalsSet,
    toneLevel,
    toneContour,
  ]);

  const computedId = useMemo(
    () => computePhonemeId(activeHeader as PhonemeType | null, flags),
    [activeHeader, flags]
  );

  const computedName = useMemo(() => {
    return computePhonemeName(
      activeHeader as PhonemeType | null,
      diacriticSelections,
      combinableDiacriticsSet,
      suprasegmentalSelections,
      combinableSuprasegmentalsSet,
      toneLevel,
      toneContour
    );
  }, [
    activeHeader,
    diacriticSelections,
    combinableDiacriticsSet,
    suprasegmentalSelections,
    combinableSuprasegmentalsSet,
    toneLevel,
    toneContour,
  ]);

  const isIdDuplicateForUpdate = useMemo(() => {
    if (!computedId) return false;
    if (editingId && computedId === editingId) return false;
    return existingPhonemeIds.includes(computedId);
  }, [computedId, editingId, existingPhonemeIds]);

  const isIdDuplicateForAdd = useMemo(() => {
    if (!computedId) return false;
    return existingPhonemeIds.includes(computedId);
  }, [computedId, existingPhonemeIds]);

  const toggleDiacriticCategory = (category: string, value: string) =>
    setDiacriticSelections((prev) => ({ ...prev, [category]: prev[category] === value ? null : value }));

  const toggleCombinableDiacritic = (value: string) =>
    setCombinableDiacriticsSet((prev) => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });

  const toggleSuprasegmentalCategory = (category: string, value: string) =>
    setSuprasegmentalSelections((prev) => ({ ...prev, [category]: prev[category] === value ? null : value }));

  const toggleCombinableSuprasegmental = (value: string) =>
    setCombinableSuprasegmentalsSet((prev) => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });

  const getAllSelectedDiacritics = (): string[] => {
    const all: string[] = [];
    Object.values(diacriticSelections).forEach((val) => val && all.push(val));
    combinableDiacriticsSet.forEach((val) => all.push(val));
    return all;
  };

  const getAllSelectedSuprasegmentals = (): string[] => {
    const all: string[] = [];
    Object.values(suprasegmentalSelections).forEach((val) => val && all.push(val));
    combinableSuprasegmentalsSet.forEach((val) => all.push(val));
    return all;
  };

  const buildComposite = () => ({
    id: computedId,
    phoneme: activeHeader || "",
    symbol: displayIPA,
    name: computedName,
    flags,
    diacritics: getAllSelectedDiacritics(),
    suprasegmentals: getAllSelectedSuprasegmentals(),
    toneLevel,
    toneContour,
  });

  const handleAddAsNew = () => {
    if (!activeHeader || !onAdd || isIdDuplicateForAdd) return;
    onAdd(buildComposite());
  };

  const handleUpdate = () => {
    if (!activeHeader || !onUpdate || !editingId || isIdDuplicateForUpdate) return;
    onUpdate(buildComposite(), editingId);
  };

  useEffect(() => {
    if (!isOpen || !initialState) return;
    setActiveHeader(initialState.basePhoneme);
    const decoded = decodePhonemeFlags(initialState.flags);
    setDiacriticSelections(decoded.diacriticSelections);
    setCombinableDiacriticsSet(decoded.combinableDiacriticsSet);
    setSuprasegmentalSelections(decoded.suprasegmentalSelections);
    setCombinableSuprasegmentalsSet(decoded.combinableSuprasegmentalsSet);
    setToneLevel(decoded.toneLevel);
    setToneContour(decoded.toneContour);
  }, [isOpen, initialState]);

  return (
    <ModalWithCustomFooter
      isOpen={isOpen}
      onCancel={onCancel}
      title="Edit phoneme"
      maxWidth="max-w-3xl"
      footer={
        <div className="flex items-center justify-end w-full gap-3">
          <div
            className="flex-1 text-xs"
            style={{
              color:
                isIdDuplicateForAdd || isIdDuplicateForUpdate
                  ? "var(--error)"
                  : "var(--text-tertiary)",
            }}
          >
            ID: {computedId || "—"}
            {(isIdDuplicateForAdd || isIdDuplicateForUpdate) && (
              <span className="ml-2">(déjà existant)</span>
            )}
          </div>
          <DefaultModalFooter
            onCancel={onCancel}
            disableCancel={disableCancel}
            disableValidate={
              disableValidate ||
              !activeHeader ||
              !computedId ||
              (editingId ? isIdDuplicateForUpdate : isIdDuplicateForAdd)
            }
            onValidate={editingId ? handleUpdate : handleAddAsNew}
          />
        </div>
      }
    >
      <div
        className="sticky top-0 z-10 pb-3"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <PhonemeCarousel
          items={headerOptions}
          activeId={activeHeader}
          onSelect={(id) => setActiveHeader(id)}
          displaySymbol={displayIPA}
        />
        <div className="mt-3">
          <Tabs
            items={tabOrder}
            value={activeTab}
            onChange={(key) => setActiveTab(key as TabKey)}
          />
        </div>
      </div>

      {activeTab === "diacritics" && (
        <DiacriticsTab
          categories={diacriticCategories}
          combinable={combinableDiacritics}
          selections={diacriticSelections}
          combinableSet={combinableDiacriticsSet}
          onToggleCategory={toggleDiacriticCategory}
          onToggleCombinable={toggleCombinableDiacritic}
        />
      )}

      {activeTab === "suprasegmentals" && (
        <SuprasegmentalsTab
          categories={suprasegmentalCategories}
          combinable={combinableSuprasegmentals}
          selections={suprasegmentalSelections}
          combinableSet={combinableSuprasegmentalsSet}
          onToggleCategory={toggleSuprasegmentalCategory}
          onToggleCombinable={toggleCombinableSuprasegmental}
        />
      )}

      {activeTab === "tone" && (
        <ToneTab
          toneLevel={toneLevel}
          toneContour={toneContour}
          onToggleLevel={(value) => setToneLevel(toneLevel === value ? null : value)}
          onToggleContour={(value) => setToneContour(toneContour === value ? null : value)}
        />
      )}

      {activeTab === "allophones" && (
        <AllophonesTab 
          applicableRules={applicableRules} 
          allophonyRules={allophonyRules}
          baseSymbol={activePhonemeSymbol}
          baseName={computedName}
          basePhoneme={activeHeader as PhonemeType}
          baseFeatureVector={currentPhonemeVector}
        />
      )}
    </ModalWithCustomFooter>
  );
};

export default EditPhonemModal;
