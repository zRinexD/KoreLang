import React, { useEffect, useMemo, useState } from "react";
import { Modal, ToggleButton, CompactButton, Tabs, PhonemeCarousel } from "./ui";
import SelectPhonemeButton from "./SelectPhonemeButton";
import {
  ArticulationPlaceModification,
  RoundnessModification,
  TonguePositionModification,
  PhonationModification,
  OronasalProcessModification,
  TongueRootPositionModification,
  SyllabicRoleModification,
  PhonemeType,
  PhoneticModification,
} from "../types";
import { PhonemeDataService } from "../services/PhonemeDataService";

interface EditPhonemModalProps {
  isOpen: boolean;
  onClose: () => void;
  availablePhonemes: PhonemeType[];
  editingId?: string;
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
  onUpdate?: (payload: {
    id: string;
    phoneme: string;
    symbol: string;
    name: string;
    flags: bigint;
    diacritics: string[];
    suprasegmentals: string[];
    toneLevel: string | null;
    toneContour: string | null;
  }, originalId: string) => void;
}

type TabKey = "diacritics" | "suprasegmentals" | "tone" | "allophones";

type Option = {
  value: string;
  label: string;
  symbol: string;
};

// Diacritics organized by mutually exclusive categories
const diacriticCategories = {
  articulationPlace: {
    label: "Articulation Place",
    options: [
      { value: ArticulationPlaceModification.Dental, label: "Dental", symbol: "̪" },
      { value: ArticulationPlaceModification.Apical, label: "Apical", symbol: "̺" },
      { value: ArticulationPlaceModification.Laminal, label: "Laminal", symbol: "̻" },
    ],
  },
  secondaryArticulation: {
    label: "Secondary Articulation",
    options: [
      { value: ArticulationPlaceModification.Labialized, label: "Labialized", symbol: "ʷ" },
      { value: ArticulationPlaceModification.Palatalized, label: "Palatalized", symbol: "ʲ" },
      { value: ArticulationPlaceModification.Velarized, label: "Velarized", symbol: "ˠ" },
      { value: ArticulationPlaceModification.Pharyngealized, label: "Pharyngealized", symbol: "ˤ" },
    ],
  },
  roundness: {
    label: "Roundness",
    options: [
      { value: RoundnessModification.MoreRounded, label: "More rounded", symbol: "̹" },
      { value: RoundnessModification.LessRounded, label: "Less rounded", symbol: "̜" },
    ],
  },
  tonguePosition: {
    label: "Tongue Position (Horizontal)",
    options: [
      { value: TonguePositionModification.Advanced, label: "Advanced", symbol: "̟" },
      { value: TonguePositionModification.Retracted, label: "Retracted", symbol: "̠" },
      { value: TonguePositionModification.Centralized, label: "Centralized", symbol: "̈" },
      { value: TonguePositionModification.MidCentralized, label: "Mid-centralized", symbol: "̽" },
    ],
  },
  phonation: {
    label: "Phonation",
    options: [
      { value: PhonationModification.Voiceless, label: "Voiceless", symbol: "̥" },
      { value: PhonationModification.Voiced, label: "Voiced", symbol: "̬" },
      { value: PhonationModification.BreathyVoiced, label: "Breathy voiced", symbol: "̤" },
      { value: PhonationModification.CreakyVoiced, label: "Creaky voiced", symbol: "̰" },
    ],
  },
  tongueHeight: {
    label: "Tongue Height",
    options: [
      { value: TongueRootPositionModification.Raised, label: "Raised", symbol: "̝" },
      { value: TongueRootPositionModification.Lowered, label: "Lowered", symbol: "̞" },
    ],
  },
  tongueRoot: {
    label: "Tongue Root",
    options: [
      { value: TongueRootPositionModification.AdvancedTongueRoot, label: "Advanced tongue root", symbol: "̘" },
      { value: TongueRootPositionModification.RetractedTongueRoot, label: "Retracted tongue root", symbol: "̙" },
    ],
  },
  release: {
    label: "Release",
    options: [
      { value: OronasalProcessModification.NasalRelease, label: "Nasal release", symbol: "ⁿ" },
      { value: OronasalProcessModification.LateralRelease, label: "Lateral release", symbol: "ˡ" },
      { value: OronasalProcessModification.NoAudibleRelease, label: "No audible release", symbol: "̚" },
    ],
  },
  syllabicity: {
    label: "Syllabicity",
    options: [
      { value: SyllabicRoleModification.Syllabic, label: "Syllabic", symbol: "̩" },
      { value: SyllabicRoleModification.NonSyllabic, label: "Non-syllabic", symbol: "̯" },
    ],
  },
};

// Combinable diacritics (can be selected together with categories)
const combinableDiacritics: Option[] = [
  { value: ArticulationPlaceModification.Linguolabial, label: "Linguolabial", symbol: "̼" },
  { value: ArticulationPlaceModification.Glottalized, label: "Glottalized", symbol: "ˀ" },
  { value: OronasalProcessModification.Aspirated, label: "Aspirated", symbol: "ʰ" },
  { value: OronasalProcessModification.Nasalized, label: "Nasalized", symbol: "̃" },
];

// Suprasegmentals organized by categories
const suprasegmentalCategories = {
  length: {
    label: "Length",
    options: [
      { value: "long", label: "Long", symbol: "ː" },
      { value: "half-long", label: "Half-long", symbol: "ˑ" },
      { value: "extra-short", label: "Extra-short", symbol: "̆" },
    ],
  },
  stress: {
    label: "Stress",
    options: [
      { value: "primary-stress", label: "Primary stress", symbol: "ˈ" },
      { value: "secondary-stress", label: "Secondary stress", symbol: "ˌ" },
    ],
  },
  breaks: {
    label: "Breaks",
    options: [
      { value: "minor-group", label: "Minor (foot) group", symbol: "|" },
      { value: "major-group", label: "Major (intonation) group", symbol: "‖" },
      { value: "syllable-break", label: "Syllable break", symbol: "." },
    ],
  },
};

// Combinable suprasegmentals
const combinableSuprasegmentals: Option[] = [
  { value: "linking", label: "Linking", symbol: "‿" },
];

const toneLevelOptions: Option[] = [
  { value: "extra-high", label: "Extra-high", symbol: "˥" },
  { value: "high", label: "High", symbol: "˦" },
  { value: "mid", label: "Mid", symbol: "˧" },
  { value: "low", label: "Low", symbol: "˨" },
  { value: "extra-low", label: "Extra-low", symbol: "˩" },
];

const toneContourOptions: Option[] = [
  { value: "rising", label: "Rising", symbol: "˩˥" },
  { value: "falling", label: "Falling", symbol: "˥˩" },
  { value: "high-falling", label: "High falling", symbol: "˥˧˩" },
  { value: "low-rising", label: "Low rising", symbol: "˩˨˧" },
  { value: "rising-falling", label: "Rising-falling", symbol: "˧˥˧" },
  { value: "falling-rising", label: "Falling-rising", symbol: "˥˩˦" },
];

const tabOrder: { key: TabKey; label: string }[] = [
  { key: "diacritics", label: "Diacritics" },
  { key: "suprasegmentals", label: "Suprasegmentals" },
  { key: "tone", label: "Tone" },
  { key: "allophones", label: "Allophones" },
];

const OptionButton: React.FC<{
  option: Option;
  isActive: boolean;
  onToggle: () => void;
}> = ({ option, isActive, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-2 text-sm transition-colors border rounded-lg"
      style={{
        borderColor: isActive ? "var(--accent)" : "var(--border)",
        backgroundColor: isActive ? "rgb(from var(--accent) r g b / 0.12)" : "var(--surface)",
        color: "var(--text-primary)",
      }}
    >
      <span className="font-serif text-lg">{option.symbol}</span>
      <span className="text-xs tracking-wide uppercase" style={{ color: "var(--text-secondary)" }}>
        {option.label}
      </span>
    </button>
  );
};

const EditPhonemModal: React.FC<EditPhonemModalProps> = ({ isOpen, onClose, availablePhonemes, onAdd, onUpdate, editingId, initialState }) => {
  const [activeHeader, setActiveHeader] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("diacritics");
  
  // State for mutually exclusive categories
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

  useEffect(() => {
    if (headerOptions.length === 0) {
      setActiveHeader(null);
      return;
    }
    if (!activeHeader || !headerOptions.some((h) => h.id === activeHeader)) {
      setActiveHeader(headerOptions[0].id);
    }
  }, [headerOptions, activeHeader]);

  // Mapping from option values to PhoneticModification flags
  const valueToFlag: Record<string, PhoneticModification> = {
    // Diacritics
    [ArticulationPlaceModification.Dental]: PhoneticModification.Dental,
    [ArticulationPlaceModification.Apical]: PhoneticModification.Apical,
    [ArticulationPlaceModification.Laminal]: PhoneticModification.Laminal,
    [ArticulationPlaceModification.Linguolabial]: PhoneticModification.Linguolabial,
    [ArticulationPlaceModification.Labialized]: PhoneticModification.Labialized,
    [ArticulationPlaceModification.Palatalized]: PhoneticModification.Palatalized,
    [ArticulationPlaceModification.Velarized]: PhoneticModification.Velarized,
    [ArticulationPlaceModification.Pharyngealized]: PhoneticModification.Pharyngealized,
    [ArticulationPlaceModification.Glottalized]: PhoneticModification.Glottalized,
    [RoundnessModification.MoreRounded]: PhoneticModification.MoreRounded,
    [RoundnessModification.LessRounded]: PhoneticModification.LessRounded,
    [TonguePositionModification.Advanced]: PhoneticModification.Advanced,
    [TonguePositionModification.Retracted]: PhoneticModification.Retracted,
    [TonguePositionModification.Centralized]: PhoneticModification.Centralized,
    [TonguePositionModification.MidCentralized]: PhoneticModification.MidCentralized,
    [PhonationModification.Voiceless]: PhoneticModification.Voiceless,
    [PhonationModification.Voiced]: PhoneticModification.Voiced,
    [PhonationModification.BreathyVoiced]: PhoneticModification.BreathyVoiced,
    [PhonationModification.CreakyVoiced]: PhoneticModification.CreakyVoiced,
    [OronasalProcessModification.Aspirated]: PhoneticModification.Aspirated,
    [OronasalProcessModification.Nasalized]: PhoneticModification.Nasalized,
    [OronasalProcessModification.NasalRelease]: PhoneticModification.NasalRelease,
    [OronasalProcessModification.LateralRelease]: PhoneticModification.LateralRelease,
    [OronasalProcessModification.NoAudibleRelease]: PhoneticModification.NoAudibleRelease,
    [TongueRootPositionModification.AdvancedTongueRoot]: PhoneticModification.AdvancedTongueRoot,
    [TongueRootPositionModification.RetractedTongueRoot]: PhoneticModification.RetractedTongueRoot,
    [TongueRootPositionModification.Raised]: PhoneticModification.Raised,
    [TongueRootPositionModification.Lowered]: PhoneticModification.Lowered,
    [SyllabicRoleModification.Syllabic]: PhoneticModification.Syllabic,
    [SyllabicRoleModification.NonSyllabic]: PhoneticModification.NonSyllabic,
    // Suprasegmentals
    "primary-stress": PhoneticModification.PrimaryStress,
    "secondary-stress": PhoneticModification.SecondaryStress,
    "long": PhoneticModification.Long,
    "half-long": PhoneticModification.HalfLong,
    "extra-short": PhoneticModification.ExtraShort,
    "linking": PhoneticModification.Linking,
    "minor-group": PhoneticModification.MinorGroup,
    "major-group": PhoneticModification.MajorGroup,
    "syllable-break": PhoneticModification.SyllableBreak,
    // Tone level
    "extra-high": PhoneticModification.ToneExtraHigh,
    "high": PhoneticModification.ToneHigh,
    "mid": PhoneticModification.ToneMid,
    "low": PhoneticModification.ToneLow,
    "extra-low": PhoneticModification.ToneExtraLow,
    // Tone contour
    "rising": PhoneticModification.ToneRising,
    "falling": PhoneticModification.ToneFalling,
    "high-falling": PhoneticModification.ToneHighFalling,
    "low-rising": PhoneticModification.ToneLowRising,
    "rising-falling": PhoneticModification.ToneRisingFalling,
    "falling-rising": PhoneticModification.ToneFallingRising,
  };

  const computeFlags = (): bigint => {
    let flags = 0n;
    
    // Add diacritics from categories
    Object.values(diacriticSelections).forEach((val) => {
      if (val && valueToFlag[val]) flags |= BigInt(valueToFlag[val]);
    });
    
    // Add combinable diacritics
    combinableDiacriticsSet.forEach((val) => {
      if (valueToFlag[val]) flags |= BigInt(valueToFlag[val]);
    });
    
    // Add suprasegmentals from categories
    Object.values(suprasegmentalSelections).forEach((val) => {
      if (val && valueToFlag[val]) flags |= BigInt(valueToFlag[val]);
    });
    
    // Add combinable suprasegmentals
    combinableSuprasegmentalsSet.forEach((val) => {
      if (valueToFlag[val]) flags |= BigInt(valueToFlag[val]);
    });
    
    // Add tone level
    if (toneLevel && valueToFlag[toneLevel]) {
      flags |= BigInt(valueToFlag[toneLevel]);
    }
    
    // Add tone contour
    if (toneContour && valueToFlag[toneContour]) {
      flags |= BigInt(valueToFlag[toneContour]);
    }
    
    return flags;
  };

  const computePhonemeId = (): string => {
    if (!activeHeader) return "";
    const flags = computeFlags();
    const combined = `${activeHeader}|${flags.toString()}`;

    // Bijective, deterministic encoding: base64 or hex fallback
    const encode = (input: string) => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return btoa(unescape(encodeURIComponent(input)));
      } catch (_err) {
        return Array.from(input)
          .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join("");
      }
    };

    const hash = encode(combined);
    return `${activeHeader}#${hash}`;
  };

  const computePhonemeName = (): string => {
    if (!activeHeader) return "";
    const modifications: string[] = [];
    
    // Add diacritics from categories
    Object.entries(diacriticCategories).forEach(([key, category]) => {
      const selected = diacriticSelections[key];
      if (selected) {
        const opt = category.options.find(o => o.value === selected);
        if (opt) modifications.push(opt.label);
      }
    });
    
    // Add combinable diacritics
    combinableDiacriticsSet.forEach((val) => {
      const opt = combinableDiacritics.find(o => o.value === val);
      if (opt) modifications.push(opt.label);
    });
    
    // Add suprasegmentals from categories
    Object.entries(suprasegmentalCategories).forEach(([key, category]) => {
      const selected = suprasegmentalSelections[key];
      if (selected) {
        const opt = category.options.find(o => o.value === selected);
        if (opt) modifications.push(opt.label);
      }
    });
    
    // Add combinable suprasegmentals
    combinableSuprasegmentalsSet.forEach((val) => {
      const opt = combinableSuprasegmentals.find(o => o.value === val);
      if (opt) modifications.push(opt.label);
    });
    
    // Add tone level
    if (toneLevel) {
      const opt = toneLevelOptions.find(o => o.value === toneLevel);
      if (opt) modifications.push(opt.label);
    }
    
    // Add tone contour
    if (toneContour) {
      const opt = toneContourOptions.find(o => o.value === toneContour);
      if (opt) modifications.push(opt.label);
    }
    
    return modifications.length > 0 ? `${activeHeader} + ${modifications.join(' + ')}` : activeHeader;
  };

  const getAllSelectedDiacritics = (): string[] => {
    const all: string[] = [];
    Object.values(diacriticSelections).forEach((val) => {
      if (val) all.push(val);
    });
    combinableDiacriticsSet.forEach((val) => all.push(val));
    return all;
  };

  const getAllSelectedSuprasegmentals = (): string[] => {
    const all: string[] = [];
    Object.values(suprasegmentalSelections).forEach((val) => {
      if (val) all.push(val);
    });
    combinableSuprasegmentalsSet.forEach((val) => all.push(val));
    return all;
  };

  const findSymbol = (value: string, allOptions: Option[]): string => {
    return allOptions.find((o) => o.value === value)?.symbol || "";
  };

  const getAllDiacriticOptions = (): Option[] => {
    const all: Option[] = [];
    Object.values(diacriticCategories).forEach(cat => all.push(...cat.options));
    all.push(...combinableDiacritics);
    return all;
  };

  const getAllSuprasegmentalOptions = (): Option[] => {
    const all: Option[] = [];
    Object.values(suprasegmentalCategories).forEach(cat => all.push(...cat.options));
    all.push(...combinableSuprasegmentals);
    return all;
  };

  const activePhonemeSymbol = useMemo(() => {
    const match = headerOptions.find((h) => h.id === activeHeader);
    return match?.symbol || "";
  }, [headerOptions, activeHeader]);

  const diacriticSymbols = useMemo(() => {
    const selected = getAllSelectedDiacritics();
    const allOptions = getAllDiacriticOptions();
    return selected.map((v) => findSymbol(v, allOptions)).join("");
  }, [diacriticSelections, combinableDiacriticsSet]);

  const suprasegmentalSymbols = useMemo(() => {
    const selected = getAllSelectedSuprasegmentals();
    const allOptions = getAllSuprasegmentalOptions();
    return selected.map((v) => findSymbol(v, allOptions)).join("");
  }, [suprasegmentalSelections, combinableSuprasegmentalsSet]);

  const toneLevelSymbol = toneLevel ? findSymbol(toneLevel, toneLevelOptions) : "";
  const toneContourSymbol = toneContour ? findSymbol(toneContour, toneContourOptions) : "";

  const displayIPA = `${activePhonemeSymbol}${diacriticSymbols}${suprasegmentalSymbols}${toneLevelSymbol}${toneContourSymbol}` || "—";

  const allophoneOptions: Option[] = useMemo(() => {
    return availablePhonemes.map((pt) => ({
      value: pt,
      label: pt,
      symbol: PhonemeDataService.getIPA(pt) || pt,
    }));
  }, [availablePhonemes]);

  const toggleDiacriticCategory = (category: string, value: string) => {
    setDiacriticSelections((prev) => ({
      ...prev,
      [category]: prev[category] === value ? null : value,
    }));
  };

  const toggleCombinableDiacritic = (value: string) => {
    setCombinableDiacriticsSet((prev) => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  };

  const toggleSuprasegmentalCategory = (category: string, value: string) => {
    setSuprasegmentalSelections((prev) => ({
      ...prev,
      [category]: prev[category] === value ? null : value,
    }));
  };

  const toggleCombinableSuprasegmental = (value: string) => {
    setCombinableSuprasegmentalsSet((prev) => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  };

  const buildComposite = () => {
    const id = computePhonemeId();
    const flags = computeFlags();
    return {
      id,
      phoneme: activeHeader || "",
      symbol: displayIPA,
      name: computePhonemeName(),
      flags,
      diacritics: getAllSelectedDiacritics(),
      suprasegmentals: getAllSelectedSuprasegmentals(),
      toneLevel,
      toneContour,
    };
  };

  const handleAddAsNew = () => {
    if (!activeHeader || !onAdd) return;
    onAdd(buildComposite());
  };

  const handleUpdate = () => {
    if (!activeHeader || !onUpdate || !editingId) return;
    onUpdate(buildComposite(), editingId);
  };

  // Initialize state from initialState when editing
  useEffect(() => {
    if (!isOpen || !initialState) return;

    setActiveHeader(initialState.basePhoneme);

    // Build reverse mapping from flags to values
    const flagToValue = new Map<bigint, string>();
    Object.entries(valueToFlag).forEach(([val, flag]) => {
      flagToValue.set(BigInt(flag), val);
    });

    const nextDiacritics: Record<string, string | null> = {
      articulationPlace: null,
      secondaryArticulation: null,
      roundness: null,
      tonguePosition: null,
      phonation: null,
      tongueHeight: null,
      tongueRoot: null,
      release: null,
      syllabicity: null,
    };
    const nextCombDiacritics = new Set<string>();
    const nextSupra: Record<string, string | null> = {
      length: null,
      stress: null,
      breaks: null,
    };
    const nextCombSupra = new Set<string>();
    let nextToneLevel: string | null = null;
    let nextToneContour: string | null = null;

    // Map diacritic categories
    const diacriticCategoryByValue: Record<string, string> = {};
    Object.entries(diacriticCategories).forEach(([catKey, cat]) => {
      cat.options.forEach((opt) => {
        diacriticCategoryByValue[opt.value] = catKey;
      });
    });

    // Map suprasegmental categories
    const suprasegmentalCategoryByValue: Record<string, string> = {};
    Object.entries(suprasegmentalCategories).forEach(([catKey, cat]) => {
      cat.options.forEach((opt) => {
        suprasegmentalCategoryByValue[opt.value] = catKey;
      });
    });

    const combinableDiacriticValues = new Set(combinableDiacritics.map((o) => o.value));
    const combinableSuprasegmentalValues = new Set(combinableSuprasegmentals.map((o) => o.value));
    const toneLevelValues = new Set(toneLevelOptions.map((o) => o.value));
    const toneContourValues = new Set(toneContourOptions.map((o) => o.value));

    // Decode flags into selections
    Object.values(valueToFlag).forEach((flagVal) => {
      const flag = BigInt(flagVal);
      if ((initialState.flags & flag) !== flag) return;
      const value = flagToValue.get(flag);
      if (!value) return;

      if (diacriticCategoryByValue[value]) {
        nextDiacritics[diacriticCategoryByValue[value]] = value;
      } else if (combinableDiacriticValues.has(value)) {
        nextCombDiacritics.add(value);
      } else if (suprasegmentalCategoryByValue[value]) {
        nextSupra[suprasegmentalCategoryByValue[value]] = value;
      } else if (combinableSuprasegmentalValues.has(value)) {
        nextCombSupra.add(value);
      } else if (toneLevelValues.has(value) && !nextToneLevel) {
        nextToneLevel = value;
      } else if (toneContourValues.has(value) && !nextToneContour) {
        nextToneContour = value;
      }
    });

    setDiacriticSelections(nextDiacritics);
    setCombinableDiacriticsSet(nextCombDiacritics);
    setSuprasegmentalSelections(nextSupra);
    setCombinableSuprasegmentalsSet(nextCombSupra);
    setToneLevel(nextToneLevel);
    setToneContour(nextToneContour);
  }, [isOpen, initialState]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit phoneme"
      maxWidth="max-w-3xl"
      hideFooter={false}
      footer={
        <div className="flex items-center justify-end w-full gap-3">
          <div className="flex-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
            ID: {computePhonemeId() || "—"}
          </div>
          <CompactButton
            variant="outline"
            icon={<span>＋</span>}
            label="Add as new"
            onClick={handleAddAsNew}
            disabled={!activeHeader}
          />
          {onUpdate && editingId && (
            <CompactButton
              variant="solid"
              icon={<span>⟳</span>}
              label="Update"
              onClick={handleUpdate}
              disabled={!activeHeader}
            />
          )}
        </div>
      }
    >
      <div className="sticky top-0 z-10 pb-3" style={{ backgroundColor: "var(--surface)" }}>
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
        <div className="space-y-4">
          {Object.entries(diacriticCategories).map(([key, category]) => (
            <div key={key}>
              <div className="mb-2 text-xs font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
                {category.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {category.options.map((opt) => (
                  <OptionButton
                    key={opt.value}
                    option={opt}
                    isActive={diacriticSelections[key] === opt.value}
                    onToggle={() => toggleDiacriticCategory(key, opt.value)}
                  />
                ))}
              </div>
            </div>
          ))}
          {combinableDiacritics.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
                Other (Combinable)
              </div>
              <div className="flex flex-wrap gap-2">
                {combinableDiacritics.map((opt) => (
                  <OptionButton
                    key={opt.value}
                    option={opt}
                    isActive={combinableDiacriticsSet.has(opt.value)}
                    onToggle={() => toggleCombinableDiacritic(opt.value)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "suprasegmentals" && (
        <div className="space-y-4">
          {Object.entries(suprasegmentalCategories).map(([key, category]) => (
            <div key={key}>
              <div className="mb-2 text-xs font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
                {category.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {category.options.map((opt) => (
                  <OptionButton
                    key={opt.value}
                    option={opt}
                    isActive={suprasegmentalSelections[key] === opt.value}
                    onToggle={() => toggleSuprasegmentalCategory(key, opt.value)}
                  />
                ))}
              </div>
            </div>
          ))}
          {combinableSuprasegmentals.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
                Other (Combinable)
              </div>
              <div className="flex flex-wrap gap-2">
                {combinableSuprasegmentals.map((opt) => (
                  <OptionButton
                    key={opt.value}
                    option={opt}
                    isActive={combinableSuprasegmentalsSet.has(opt.value)}
                    onToggle={() => toggleCombinableSuprasegmental(opt.value)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "tone" && (
        <div className="space-y-3">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
              Level
            </div>
            <div className="flex flex-wrap gap-2">
              {toneLevelOptions.map((opt) => (
                <OptionButton
                  key={opt.value}
                  option={opt}
                  isActive={toneLevel === opt.value}
                  onToggle={() => setToneLevel(toneLevel === opt.value ? null : opt.value)}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
              Contour
            </div>
            <div className="flex flex-wrap gap-2">
              {toneContourOptions.map((opt) => (
                <OptionButton
                  key={opt.value}
                  option={opt}
                  isActive={toneContour === opt.value}
                  onToggle={() => setToneContour(toneContour === opt.value ? null : opt.value)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "allophones" && (
        <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          Not implemented yet.
        </div>
      )}

    </Modal>
  );
};

export default EditPhonemModal;
