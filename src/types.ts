// Enum centralisés pour la phonologie
export enum Manner {
  Plosive = 'plosive',
  Nasal = 'nasal',
  Trill = 'trill',
  Tap = 'tap',
  Fricative = 'fricative',
  LateralFricative = 'lateral-fricative',
  Approximant = 'approximant',
  LateralApproximant = 'lateral-approximant',
}
export enum Place {
  Bilabial = 'bilabial',
  Labiodental = 'labiodental',
  Dental = 'dental',
  Alveolar = 'alveolar',
  Postalveolar = 'postalveolar',
  Retroflex = 'retroflex',
  Palatal = 'palatal',
  Velar = 'velar',
  Uvular = 'uvular',
  Pharyngeal = 'pharyngeal',
  Glottal = 'glottal',
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
  Central = 'central',
  Back = 'back',
}
export interface PhonemeInstance {
  id: string; // identifiant unique de l'instance (ex: uuid ou concat symbol+cell)
  phoneme: PhonemeModel; // référence au modèle métier
  type: 'consonant' | 'vowel';
  // Position dans la grille
  manner?: string;
  place?: string;
  height?: string;
  backness?: string;
  // Diacritiques ou modifications spécifiques à l'instance
  diacritics?: string[];
  features?: Record<string, string | boolean | number>;
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
  GlottalStop = "GlottalStop",
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
  VoicelessUvularFricative = "VoicelessUvularFricative",
  VoicedUvularFricative = "VoicedUvularFricative",
  VoicelessPharyngealFricative = "VoicelessPharyngealFricative",
  VoicedPharyngealFricative = "VoicedPharyngealFricative",
  VoicelessGlottalFricative = "VoicelessGlottalFricative",
  VoicedGlottalFricative = "VoicedGlottalFricative",
  LabiodentalApproximant = "LabiodentalApproximant",
  AlveolarApproximant = "AlveolarApproximant",
  RetroflexApproximant = "RetroflexApproximant",
  PalatalApproximant = "PalatalApproximant",
  VelarApproximant = "VelarApproximant",
  BilabialTrill = "BilabialTrill",
  AlveolarTrill = "AlveolarTrill",
  UvularTrill = "UvularTrill",
  AlveolarTap = "AlveolarTap",
  RetroflexTap = "RetroflexTap",
  VoicelessAlveolarLateralFricative = "VoicelessAlveolarLateralFricative",
  VoicedAlveolarLateralFricative = "VoicedAlveolarLateralFricative",
  AlveolarLateralApproximant = "AlveolarLateralApproximant",
  RetroflexLateralApproximant = "RetroflexLateralApproximant",
  PalatalLateralApproximant = "PalatalLateralApproximant",
  VelarLateralApproximant = "VelarLateralApproximant",
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
  // Duplicates and variants (as in C#)
  CloseFrontUnrounded = "CloseFrontUnrounded",
  CloseFrontRounded = "CloseFrontRounded",
  CloseCentralUnrounded = "CloseCentralUnrounded",
  CloseCentralRounded = "CloseCentralRounded",
  CloseBackUnrounded = "CloseBackUnrounded",
  CloseBackRounded = "CloseBackRounded",
  NearCloseFrontUnrounded = "NearCloseFrontUnrounded",
  NearCloseFrontRounded = "NearCloseFrontRounded",
  NearCloseBackRounded = "NearCloseBackRounded",
  CloseMidFrontUnrounded = "CloseMidFrontUnrounded",
  CloseMidFrontRounded = "CloseMidFrontRounded",
  CloseMidCentralUnrounded = "CloseMidCentralUnrounded",
  CloseMidCentralRounded = "CloseMidCentralRounded",
  CloseMidBackUnrounded = "CloseMidBackUnrounded",
  CloseMidBackRounded = "CloseMidBackRounded",
  MidCentral = "MidCentral",
  OpenMidFrontUnrounded = "OpenMidFrontUnrounded",
  OpenMidFrontRounded = "OpenMidFrontRounded",
  OpenMidCentralUnrounded = "OpenMidCentralUnrounded",
  OpenMidCentralRounded = "OpenMidCentralRounded",
  OpenMidBackUnrounded = "OpenMidBackUnrounded",
  OpenMidBackRounded = "OpenMidBackRounded",
  NearOpenFrontUnrounded = "NearOpenFrontUnrounded",
  NearOpenCentral = "NearOpenCentral",
  OpenFrontUnrounded = "OpenFrontUnrounded",
  OpenFrontRounded = "OpenFrontRounded",
  OpenBackUnrounded = "OpenBackUnrounded",
  OpenBackRounded = "OpenBackRounded",
  VoicedAlveolarLateralApproximant = "VoicedAlveolarLateralApproximant",
  VoicedRetroflexLateralApproximant = "VoicedRetroflexLateralApproximant",
  VoicedLabioDentalApproximant = "VoicedLabioDentalApproximant",
  VoicedAlveolarApproximant = "VoicedAlveolarApproximant",
  VoicedRetroflexApproximant = "VoicedRetroflexApproximant",
  VoicedPalatalApproximant = "VoicedPalatalApproximant",
  VoicedVelarApproximant = "VoicedVelarApproximant",
  VoicedBilabialTrill = "VoicedBilabialTrill",
  VoicedAlveolarTrill = "VoicedAlveolarTrill",
  VoicedUvularTrill = "VoicedUvularTrill",
  VoicedAlveolarTap = "VoicedAlveolarTap",
  VoicedRetroflexTap = "VoicedRetroflexTap",
  VoicedPalatalLateralApproximant = "VoicedPalatalLateralApproximant",
  VoicedVelarLateralApproximant = "VoicedVelarLateralApproximant",
  VoicedPostAlveolarSibilantFricative = "VoicedPostAlveolarSibilantFricative",
  VoicelessPostAlveolarSibilantFricative = "VoicelessPostAlveolarSibilantFricative",
  VoicedLabioDentalFricative = "VoicedLabioDentalFricative",
  VoicelessLabioDentalFricative = "VoicelessLabioDentalFricative",
  VoicelessGlottalPlosive = "VoicelessGlottalPlosive",
  VoicedLabioDentalNasal = "VoicedLabioDentalNasal",
  Voicedlabiodentalflap = "Voicedlabiodentalflap",
  VoicedLabioVelarApproximant = "VoicedLabioVelarApproximant"
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
