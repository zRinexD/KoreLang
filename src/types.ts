
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
  type: 'command' | 'success' | 'error' | 'info' | 'output';
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

export interface Phoneme {
  symbol: string;
  type: 'consonant' | 'vowel';
  manner?: string;
  place?: string;
  voiced?: boolean;
  height?: string;
  backness?: string;
  rounded?: boolean;
  description?: string;
}

export interface PhonologyConfig {
  name: string;
  description: string;
  consonants: Phoneme[];
  vowels: Phoneme[];
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
  bgMain: string;
  bgPanel: string;
  text1: string;
  text2: string;
  accent: string;
  bgHeader: string;
}

export interface AppSettings {
  theme: 'dark' | 'cappuccino' | 'tokyo-night' | 'custom';
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
