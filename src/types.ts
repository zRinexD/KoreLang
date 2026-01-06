// Enum centralisés pour la phonologie
export enum Manner {
  Plosive = 'plosive',
  Nasal = 'nasal',
  Trill = 'trill',
  Tap = 'tap',
  Click = 'click',
  Implosive = 'implosive',
  Fricative = 'fricative',
  Affricate = 'affricate',
  LateralFricative = 'lateral-fricative',
  Approximant = 'approximant',
  LateralApproximant = 'lateral-approximant',
  LateralFlap = 'lateral-flap',
}
export enum Place {
  Bilabial = 'bilabial',
  Labiodental = 'labiodental',
  Dental = 'dental',
  Alveolar = 'alveolar',
  Postalveolar = 'postalveolar',
  Retroflex = 'retroflex',
  Palatal = 'palatal',
  AlveoloPalatal = 'alveolo-palatal',
  Velar = 'velar',
  LabioVelar = 'labio-velar',
  LabioPalatal = 'labio-palatal',
  Uvular = 'uvular',
  Pharyngeal = 'pharyngeal',
  Epiglottal = 'epiglottal',
  Glottal = 'glottal',
  Other = 'other',
}
export enum Height {
  Close = 'close',
  NearClose = 'near-close',
  CloseMid = 'close-mid',
  Mid = 'mid',
  OpenMid = 'open-mid',
  NearOpen = 'near-open',
  Open = 'open',
}
export enum Backness {
  Front = 'front',
  NearFront = 'near-front',
  Central = 'central',
  NearBack = 'near-back',
  Back = 'back',
}
export interface PhonemeInstance {
  id: string; // identifiant unique de l'instance (ex: uuid ou concat symbol+cell)
  phoneme: PhonemeType; // référence à l'enum source de vérité
  type: 'consonant' | 'vowel';
  // Position dans la grille
  manner?: string;
  place?: string;
  height?: string;
  backness?: string;
  // Diacritiques ou modifications spécifiques à l'instance
  diacritics?: string[];
  features?: {
    displaySymbol?: string;
    flags?: string; // BigInt stored as string for diacritics/modifications
    featureVector?: number; // 32-bit phonetic feature vector for allophonic rules
    [key: string]: string | boolean | number | undefined;
  };
}
export interface PhonemeModel {
  /** Identifiant unique du phonème (ex: "p", "b", "a") */
  id: string;
  /** Représentation IPA ou Unicode */
  symbol: string;
  /** Nom ou description (ex: "Voiced Bilabial Plosive") */
  name: string;
  /** Catégorie (ex: "consonant", "vowel", etc.) */
  category: string;
  /** Traits optionnels (ex: voicing, place, manner, etc.) */
  features?: Record<string, string | boolean | number>;
  /** Diacritiques ou modifications éventuelles */
  diacritics?: string[];
  /** Champs extensibles pour la future compatibilité */
  [key: string]: any;
}

export interface PhonemeInventory {
  /** Liste des phonèmes de la langue */
  phonemes: PhonemeModel[];
  /** Métadonnées optionnelles (ex: version, auteur, etc.) */
  metadata?: Record<string, any>;
}
export enum PhonemeType {
  // Consonants
  VoicedBilabialNasal = "VoicedBilabialNasal",
  VoicedLabiodentalNasal = "VoicedLabiodentalNasal",
  VoicedAlveolarNasal = "VoicedAlveolarNasal",
  VoicedRetroflexNasal = "VoicedRetroflexNasal",
  VoicedPalatalNasal = "VoicedPalatalNasal",
  VoicedVelarNasal = "VoicedVelarNasal",
  VoicedUvularNasal = "VoicedUvularNasal",
  VoicelessBilabialPlosive = "VoicelessBilabialPlosive",
  VoicedBilabialPlosive = "VoicedBilabialPlosive",
  VoicelessAlveolarPlosive = "VoicelessAlveolarPlosive",
  VoicedAlveolarPlosive = "VoicedAlveolarPlosive",
  VoicelessRetroflexPlosive = "VoicelessRetroflexPlosive",
  VoicedRetroflexPlosive = "VoicedRetroflexPlosive",
  VoicelessPalatalPlosive = "VoicelessPalatalPlosive",
  VoicedPalatalPlosive = "VoicedPalatalPlosive",
  VoicelessVelarPlosive = "VoicelessVelarPlosive",
  VoicedVelarPlosive = "VoicedVelarPlosive",
  VoicelessUvularPlosive = "VoicelessUvularPlosive",
  VoicedUvularPlosive = "VoicedUvularPlosive",
  EpiglottalPlosive = "EpiglottalPlosive",
  VoicelessGlottalPlosive = "VoicelessGlottalPlosive",
  VoicelessLabialVelarFricative = "VoicelessLabialVelarFricative",
  VoicelessBilabialFricative = "VoicelessBilabialFricative",
  VoicedBilabialFricative = "VoicedBilabialFricative",
  VoicelessLabiodentalFricative = "VoicelessLabiodentalFricative",
  VoicedLabiodentalFricative = "VoicedLabiodentalFricative",
  VoicelessDentalFricative = "VoicelessDentalFricative",
  VoicedDentalFricative = "VoicedDentalFricative",
  VoicelessAlveolarFricative = "VoicelessAlveolarFricative",
  VoicedAlveolarFricative = "VoicedAlveolarFricative",
  VoicelessPostalveolarFricative = "VoicelessPostalveolarFricative",
  VoicedPostalveolarFricative = "VoicedPostalveolarFricative",
  VoicelessRetroflexFricative = "VoicelessRetroflexFricative",
  VoicedRetroflexFricative = "VoicedRetroflexFricative",
  VoicelessPalatalFricative = "VoicelessPalatalFricative",
  VoicedPalatalFricative = "VoicedPalatalFricative",
  VoicelessVelarFricative = "VoicelessVelarFricative",
  VoicedVelarFricative = "VoicedVelarFricative",
  VoicelessAlveoloPalatalFricative = "VoicelessAlveoloPalatalFricative",
  VoicedAlveoloPalatalFricative = "VoicedAlveoloPalatalFricative",
  VoicelessUvularFricative = "VoicelessUvularFricative",
  VoicedUvularFricative = "VoicedUvularFricative",
  VoicelessPharyngealFricative = "VoicelessPharyngealFricative",
  VoicedPharyngealFricative = "VoicedPharyngealFricative",
  VoicelessEpiglottalFricative = "VoicelessEpiglottalFricative",
  VoicedEpiglottalFricative = "VoicedEpiglottalFricative",
  VoicelessGlottalFricative = "VoicelessGlottalFricative",
  VoicedGlottalFricative = "VoicedGlottalFricative",
  VoicelessAlveolarAffricate = "VoicelessAlveolarAffricate",
  VoicedAlveolarAffricate = "VoicedAlveolarAffricate",
  VoicelessPostalveolarAffricate = "VoicelessPostalveolarAffricate",
  VoicedPostalveolarAffricate = "VoicedPostalveolarAffricate",
  VoicedLabioDentalApproximant = "VoicedLabioDentalApproximant",
  VoicedAlveolarApproximant = "VoicedAlveolarApproximant",
  VoicedRetroflexApproximant = "VoicedRetroflexApproximant",
  VoicedPalatalApproximant = "VoicedPalatalApproximant",
  VoicedLabialPalatalApproximant = "VoicedLabialPalatalApproximant",
  VoicedLabioVelarApproximant = "VoicedLabioVelarApproximant",
  VoicedVelarApproximant = "VoicedVelarApproximant",
  VoicedBilabialTrill = "VoicedBilabialTrill",
  VoicedAlveolarTrill = "VoicedAlveolarTrill",
  VoicedUvularTrill = "VoicedUvularTrill",
  VoicedAlveolarTap = "VoicedAlveolarTap",
  VoicedRetroflexTap = "VoicedRetroflexTap",
  VoicedAlveolarLateralFlap = "VoicedAlveolarLateralFlap",
  VoicelessAlveolarLateralFricative = "VoicelessAlveolarLateralFricative",
  VoicedAlveolarLateralFricative = "VoicedAlveolarLateralFricative",
  VoicedAlveolarLateralApproximant = "VoicedAlveolarLateralApproximant",
  VoicedRetroflexLateralApproximant = "VoicedRetroflexLateralApproximant",
  VoicedPalatalLateralApproximant = "VoicedPalatalLateralApproximant",
  VoicedVelarLateralApproximant = "VoicedVelarLateralApproximant",
  // Other (coarticulated/special)
  VoicelessPalatalVelarFricative = "VoicelessPalatalVelarFricative",
  VoicelessAlveolarLateralAffricate = "VoicelessAlveolarLateralAffricate",
  VoicedAlveolarLateralAffricate = "VoicedAlveolarLateralAffricate",
  VoicelessDarkL = "VoicelessDarkL",
  VoicedDarkL = "VoicedDarkL",
  VoicelessLabialPalatalApproximant = "VoicelessLabialPalatalApproximant",
  // Clicks
  ClickBilabial = "ClickBilabial",
  ClickDental = "ClickDental",
  ClickPostAlveolar = "ClickPostAlveolar",
  ClickPalatoAlveolar = "ClickPalatoAlveolar",
  ClickAlveolarLateral = "ClickAlveolarLateral",
  // Implosives
  ImplosiveBilabial = "ImplosiveBilabial",
  ImplosiveDentalAlveolar = "ImplosiveDentalAlveolar",
  ImplosivePalatal = "ImplosivePalatal",
  ImplosiveVelar = "ImplosiveVelar",
  ImplosiveUvular = "ImplosiveUvular",
  VoicedPostAlveolarSibilantFricative = "VoicedPostAlveolarSibilantFricative",
  VoicelessPostAlveolarSibilantFricative = "VoicelessPostAlveolarSibilantFricative",
  VoicedLabioDentalFricative = "VoicedLabioDentalFricative",
  VoicelessLabioDentalFricative = "VoicelessLabioDentalFricative",
  VoicedLabioDentalNasal = "VoicedLabioDentalNasal",
  Voicedlabiodentalflap = "Voicedlabiodentalflap",
  // Vowels
  CloseFrontUnroundedVowel = "CloseFrontUnroundedVowel",
  CloseFrontRoundedVowel = "CloseFrontRoundedVowel",
  CloseCentralUnroundedVowel = "CloseCentralUnroundedVowel",
  CloseCentralRoundedVowel = "CloseCentralRoundedVowel",
  CloseBackUnroundedVowel = "CloseBackUnroundedVowel",
  CloseBackRoundedVowel = "CloseBackRoundedVowel",
  NearCloseNearFrontUnroundedVowel = "NearCloseNearFrontUnroundedVowel",
  NearCloseNearFrontRoundedVowel = "NearCloseNearFrontRoundedVowel",
  NearCloseNearBackRoundedVowel = "NearCloseNearBackRoundedVowel",
  CloseMidFrontUnroundedVowel = "CloseMidFrontUnroundedVowel",
  CloseMidFrontRoundedVowel = "CloseMidFrontRoundedVowel",
  MidCentralVowel = "MidCentralVowel",
  OpenMidFrontUnroundedVowel = "OpenMidFrontUnroundedVowel",
  OpenMidFrontRoundedVowel = "OpenMidFrontRoundedVowel",
  OpenMidBackUnroundedVowel = "OpenMidBackUnroundedVowel",
  OpenMidBackRoundedVowel = "OpenMidBackRoundedVowel",
  NearOpenFrontUnroundedVowel = "NearOpenFrontUnroundedVowel",
  OpenFrontUnroundedVowel = "OpenFrontUnroundedVowel",
  OpenBackUnroundedVowel = "OpenBackUnroundedVowel",
  OpenBackRoundedVowel = "OpenBackRoundedVowel",
}

export enum ArticulationPlaceModification {
  Dental = "Dental",
  Apical = "Apical",
  Laminal = "Laminal",
  Linguolabial = "Linguolabial",
  Labialized = "Labialized",
  Palatalized = "Palatalized",
  Velarized = "Velarized",
  Pharyngealized = "Pharyngealized",
  Glottalized = "Glottalized",
  None = "None"
}

export enum RoundnessModification {
  MoreRounded = "MoreRounded",
  LessRounded = "LessRounded",
  None = "None"
}

export enum TonguePositionModification {
  Advanced = "Advanced",
  Retracted = "Retracted",
  Centralized = "Centralized",
  MidCentralized = "MidCentralized",
  None = "None"
}

export enum PhonationModification {
  Voiceless = "Voiceless",
  Voiced = "Voiced",
  BreathyVoiced = "BreathyVoiced",
  CreakyVoiced = "CreakyVoiced",
  None = "None"
}

export enum OronasalProcessModification {
  Aspirated = "Aspirated",
  Nasalized = "Nasalized",
  NasalRelease = "NasalRelease",
  LateralRelease = "LateralRelease",
  NoAudibleRelease = "NoAudibleRelease"
}

export enum TongueRootPositionModification {
  AdvancedTongueRoot = "AdvancedTongueRoot",
  RetractedTongueRoot = "RetractedTongueRoot",
  Raised = "Raised",
  Lowered = "Lowered",
  None = "None"
}

export enum SyllabicRoleModification {
  Syllabic = "Syllabic",
  NonSyllabic = "NonSyllabic",
  None = "None"
}

export const PhoneticModification = {
  // Articulation place
  Dental: 1n << 0n,
  Apical: 1n << 1n,
  Laminal: 1n << 2n,
  Linguolabial: 1n << 3n,

  // Secondary articulation
  Labialized: 1n << 4n,
  Palatalized: 1n << 5n,
  Velarized: 1n << 6n,
  Pharyngealized: 1n << 7n,
  Glottalized: 1n << 8n,

  // Roundness
  MoreRounded: 1n << 9n,
  LessRounded: 1n << 10n,

  // Tongue position
  Advanced: 1n << 11n,
  Retracted: 1n << 12n,
  Centralized: 1n << 13n,
  MidCentralized: 1n << 14n,

  // Phonation
  Voiceless: 1n << 15n,
  Voiced: 1n << 16n,
  BreathyVoiced: 1n << 17n,
  CreakyVoiced: 1n << 18n,

  // Oronasal process
  Aspirated: 1n << 19n,
  Nasalized: 1n << 20n,
  NasalRelease: 1n << 21n,
  LateralRelease: 1n << 22n,
  NoAudibleRelease: 1n << 23n,

  // Tongue root position
  AdvancedTongueRoot: 1n << 24n,
  RetractedTongueRoot: 1n << 25n,
  Raised: 1n << 26n,
  Lowered: 1n << 27n,

  // Syllabic role
  Syllabic: 1n << 28n,
  NonSyllabic: 1n << 29n,

  // Suprasegmentals
  PrimaryStress: 1n << 30n,
  SecondaryStress: 1n << 31n,
  Long: 1n << 32n,
  HalfLong: 1n << 33n,
  ExtraShort: 1n << 34n,
  Linking: 1n << 35n,
  MinorGroup: 1n << 36n,
  MajorGroup: 1n << 37n,
  SyllableBreak: 1n << 38n,

  // Tone level
  ToneExtraHigh: 1n << 39n,
  ToneHigh: 1n << 40n,
  ToneMid: 1n << 41n,
  ToneLow: 1n << 42n,
  ToneExtraLow: 1n << 43n,

  // Tone contour
  ToneRising: 1n << 44n,
  ToneFalling: 1n << 45n,
  ToneHighFalling: 1n << 46n,
  ToneLowRising: 1n << 47n,
  ToneRisingFalling: 1n << 48n,
  ToneFallingRising: 1n << 49n,
} as const;

export type PhoneticModification =
  typeof PhoneticModification[keyof typeof PhoneticModification];

import React from 'react';

export const POS_SUGGESTIONS = [
  'Noun', 'Verb', 'Adjective', 'Adverb',
  'Pronoun', 'Preposition', 'Conjunction', 'Interjection',
  'Determiner', 'Numeral', 'Particle', 'Classifier',
  'Affix', 'Clitic', 'Auxiliary', 'Proper Noun'
] as const;

export type StandardPOS = typeof POS_SUGGESTIONS[number];

export enum PartOfSpeech {
  NOUN = 'Noun',
  VERB = 'Verb',
  ADJECTIVE = 'Adjective',
  ADVERB = 'Adverb',
  PRONOUN = 'Pronoun',
  PREPOSITION = 'Preposition',
  CONJUNCTION = 'Conjunction',
  INTERJECTION = 'Interjection',
  OTHER = 'Other'
}

export interface LexiconEntry {
  id: string;
  word: string;
  ipa: string;
  pos: string;
  definition: string;
  etymology?: string;
  derivedFrom?: string;
  notes?: string;
}

export interface LogEntry {
  type: 'command' | 'success' | 'error' | 'info' | 'output' | 'warning';
  content: string;
  timestamp: string;
  component?: React.ReactNode;
}

export interface GlyphStroke {
  id: string;
  type: 'path' | 'rect' | 'circle' | 'line' | 'image';
  d: string; // Used for paths and lines
  x?: number; // For rects/circles/images
  y?: number;
  width: number;
  height?: number; // For rects/images
  radius?: number; // For circles
  strokeWidth: number;
  cap: 'round' | 'square';
  color: string;
  visible: boolean;
  locked: boolean;
  label?: string; // For layer identification
  imageUrl?: string; // For image layers
  opacity?: number; // For image layers
}

export interface ScriptGlyph {
  char: string;
  pua: string;
  strokes: GlyphStroke[];
  width?: number;
  viewWidth?: number;
  imageUrl?: string; // Deprecated but kept for migration compatibility
  fontOverride?: boolean;
}

export interface ScriptConfig {
  name: string;
  direction: 'ltr' | 'rtl' | 'ttb';
  glyphs: ScriptGlyph[];
  fontFamily?: string;
  fontData?: string;
  spacingMode?: 'mono' | 'proportional';
}


export interface PhonologyConfig {
  name: string;
  description: string;
  consonants: PhonemeInstance[];
  vowels: PhonemeInstance[];
  syllableStructure: string;
  bannedCombinations: string[];
}

export interface SoundChangeRule {
  id: string;
  rule: string;
  description: string;
}

export interface MorphologyState {
  dimensions: MorphDimension[];
  paradigms: MorphParadigm[];
}

export interface MorphDimension {
  id: string;
  name: string;
  values: string[];
}

export interface InflectionRule {
  coordinates: Record<string, string>;
  affix: string;
  isPrefix: boolean;
  logic?: {
    pos?: string;
    regex?: string;
  };
}

export interface MorphParadigm {
  id: string;
  name: string;
  pos: string;
  dimensions: string[];
  rules: InflectionRule[];
}

export interface ConstraintRule {
  target: string;
  conditionPos?: string;
}

export interface ProjectConstraints {
  allowDuplicates: boolean;
  caseSensitive: boolean;
  bannedSequences: string[];
  allowedGraphemes: string;
  phonotacticStructure: string;
  mustStartWith: ConstraintRule[];
  mustEndWith: ConstraintRule[];
  customSortingOrder?: string;
  sortingLocale?: string;
}

export type ViewState = 'DASHBOARD' | 'LEXICON' | 'GRAMMAR' | 'PHONOLOGY' | 'GENEVOLVE' | 'CONSOLE' | 'SCRIPT' | 'NOTEBOOK';

export interface CustomTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  elevated: string;
  inputField: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  divider: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  hover: string;
  disabled: string;
}

export interface AppSettings {
  theme: string; // Allow any named theme preset or 'custom'
  customTheme?: CustomTheme;
  autoSave: boolean;
  showLineNumbers: boolean;
  enableAI: boolean;
  language?: string;
}

export interface ProjectData {
  version: string;
  name: string;
  author: string;
  description: string;
  lexicon: LexiconEntry[];
  grammar: string;
  phonology?: PhonologyConfig;
  morphology: MorphologyState;
  evolutionRules: SoundChangeRule[];
  constraints: ProjectConstraints;
  scriptConfig?: ScriptConfig;
  notebook?: string;
  lastModified: number;
}
