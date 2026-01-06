import {
  ArticulationPlaceModification,
  RoundnessModification,
  TonguePositionModification,
  PhonationModification,
  OronasalProcessModification,
  TongueRootPositionModification,
  SyllabicRoleModification,
} from "../types";

export type TabKey = "diacritics" | "suprasegmentals" | "tone" | "allophones";

export type Option = {
  value: string;
  label: string;
  symbol: string;
};

export type CategoryMap = Record<string, { label: string; options: Option[] }>;

export const diacriticCategories = {
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

export const combinableDiacritics: Option[] = [
  { value: ArticulationPlaceModification.Linguolabial, label: "Linguolabial", symbol: "̼" },
  { value: ArticulationPlaceModification.Glottalized, label: "Glottalized", symbol: "ˀ" },
  { value: OronasalProcessModification.Aspirated, label: "Aspirated", symbol: "ʰ" },
  { value: OronasalProcessModification.Nasalized, label: "Nasalized", symbol: "̃" },
];

export const suprasegmentalCategories = {
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

export const combinableSuprasegmentals: Option[] = [
  { value: "linking", label: "Linking", symbol: "‿" },
];

export const toneLevelOptions: Option[] = [
  { value: "extra-high", label: "Extra-high", symbol: "˥" },
  { value: "high", label: "High", symbol: "˦" },
  { value: "mid", label: "Mid", symbol: "˧" },
  { value: "low", label: "Low", symbol: "˨" },
  { value: "extra-low", label: "Extra-low", symbol: "˩" },
];

export const toneContourOptions: Option[] = [
  { value: "rising", label: "Rising", symbol: "˩˥" },
  { value: "falling", label: "Falling", symbol: "˥˩" },
  { value: "high-falling", label: "High falling", symbol: "˥˧˩" },
  { value: "low-rising", label: "Low rising", symbol: "˩˨˧" },
  { value: "rising-falling", label: "Rising-falling", symbol: "˧˥˧" },
  { value: "falling-rising", label: "Falling-rising", symbol: "˥˩˦" },
];

export const tabOrder: { key: TabKey; label: string }[] = [
  { key: "diacritics", label: "Diacritics" },
  { key: "suprasegmentals", label: "Suprasegmentals" },
  { key: "tone", label: "Tone" },
  { key: "allophones", label: "Allophones" },
];
