/**
 * Phonetic Features - Binary distinctive features for phonological rules
 * Based on SPE (Sound Pattern of English) and contemporary feature theory
 * 
 * Each feature is a bit in a 32-bit integer, allowing fast bitwise operations
 * for allophonic rule matching and natural class identification.
 */

/**
 * Phonetic feature flags (32 bits total)
 */
export enum PhoneticFeature {
  // === MAJOR CLASS FEATURES (bits 0-5) ===
  /** [±consonantal] - produced with constriction in oral cavity */
  Consonantal = 1 << 0,
  
  /** [±syllabic] - forms syllable nucleus */
  Syllabic = 1 << 1,
  
  /** [±sonorant] - spontaneous voicing (vowels, nasals, liquids, glides) */
  Sonorant = 1 << 2,
  
  /** [±voice] - vocal fold vibration */
  Voice = 1 << 3,
  
  /** [±continuant] - air flows continuously (fricatives, approximants) */
  Continuant = 1 << 4,
  
  /** [±nasal] - velum lowered, air through nose */
  Nasal = 1 << 5,
  
  // === PLACE OF ARTICULATION (bits 6-10) ===
  /** [±labial] - articulated with lips */
  Labial = 1 << 6,
  
  /** [±coronal] - articulated with tongue tip/blade */
  Coronal = 1 << 7,
  
  /** [±dorsal] - articulated with tongue body */
  Dorsal = 1 << 8,
  
  /** [±anterior] - articulated in front of palato-alveolar region */
  Anterior = 1 << 9,
  
  /** [±distributed] - long/extended constriction area */
  Distributed = 1 << 10,
  
  // === LARYNGEAL FEATURES (bits 11-14) ===
  /** [±spread glottis] - glottis open (aspirated, voiceless) */
  SpreadGlottis = 1 << 11,
  
  /** [±constricted glottis] - glottis constricted (ejectives, implosives) */
  ConstrictedGlottis = 1 << 12,
  
  /** [±stiff vocal cords] - tense phonation */
  StiffVocalCords = 1 << 13,
  
  /** [±slack vocal cords] - lax phonation, breathy voice */
  SlackVocalCords = 1 << 14,
  
  // === MANNER FEATURES (bits 15-18) ===
  /** [±strident] - high-amplitude turbulent noise (sibilants) */
  Strident = 1 << 15,
  
  /** [±lateral] - air flows around side(s) of tongue */
  Lateral = 1 << 16,
  
  /** [±delayed release] - slow release (affricates) */
  DelayedRelease = 1 << 17,
  
  /** [±trill] - rapid vibration */
  Trill = 1 << 18,
  
  // === VOWEL FEATURES (bits 19-24) ===
  /** [±high] - tongue body raised (close vowels, palatals, velars) */
  High = 1 << 19,
  
  /** [±low] - tongue body lowered (open vowels) */
  Low = 1 << 20,
  
  /** [±back] - tongue body retracted (back vowels, velars, uvulars) */
  Back = 1 << 21,
  
  /** [±round] - lips rounded */
  Round = 1 << 22,
  
  /** [±ATR] - Advanced Tongue Root (tense vowels) */
  ATR = 1 << 23,
  
  /** [±tense] - greater muscular effort, peripheral vowels */
  Tense = 1 << 24,
  
  // === TONE FEATURES (bits 25-29) ===
  /** Tone: High level */
  ToneHigh = 1 << 25,
  
  /** Tone: Low level */
  ToneLow = 1 << 26,
  
  /** Tone: Rising contour */
  ToneRising = 1 << 27,
  
  /** Tone: Falling contour */
  ToneFalling = 1 << 28,
  
  /** Tone: Complex contour (rising-falling, etc.) */
  ToneContour = 1 << 29,
  
  // === SUPRASEGMENTAL FEATURES (bits 30-31) ===
  /** [±stress] - primary or secondary stress */
  Stress = 1 << 30,
  
  /** [±long] - lengthened duration */
  Long = 1 << 31,
}

/**
 * Natural class specification - array of required features
 * Example: [PhoneticFeature.Voice, PhoneticFeature.Coronal] = voiced coronals
 */
export type NaturalClass = PhoneticFeature[];

/**
 * Feature specification with positive and negative requirements
 */
export interface FeatureSpec {
  /** Features that must be present */
  positive: PhoneticFeature[];
  /** Features that must be absent */
  negative: PhoneticFeature[];
}

/**
 * Human-readable feature names for display
 */
export const FEATURE_NAMES: Record<PhoneticFeature, string> = {
  [PhoneticFeature.Consonantal]: 'consonantal',
  [PhoneticFeature.Syllabic]: 'syllabic',
  [PhoneticFeature.Sonorant]: 'sonorant',
  [PhoneticFeature.Voice]: 'voice',
  [PhoneticFeature.Continuant]: 'continuant',
  [PhoneticFeature.Nasal]: 'nasal',
  [PhoneticFeature.Labial]: 'labial',
  [PhoneticFeature.Coronal]: 'coronal',
  [PhoneticFeature.Dorsal]: 'dorsal',
  [PhoneticFeature.Anterior]: 'anterior',
  [PhoneticFeature.Distributed]: 'distributed',
  [PhoneticFeature.SpreadGlottis]: 'spread glottis',
  [PhoneticFeature.ConstrictedGlottis]: 'constricted glottis',
  [PhoneticFeature.StiffVocalCords]: 'stiff vocal cords',
  [PhoneticFeature.SlackVocalCords]: 'slack vocal cords',
  [PhoneticFeature.Strident]: 'strident',
  [PhoneticFeature.Lateral]: 'lateral',
  [PhoneticFeature.DelayedRelease]: 'delayed release',
  [PhoneticFeature.Trill]: 'trill',
  [PhoneticFeature.High]: 'high',
  [PhoneticFeature.Low]: 'low',
  [PhoneticFeature.Back]: 'back',
  [PhoneticFeature.Round]: 'round',
  [PhoneticFeature.ATR]: 'ATR',
  [PhoneticFeature.Tense]: 'tense',
  [PhoneticFeature.ToneHigh]: 'tone: high',
  [PhoneticFeature.ToneLow]: 'tone: low',
  [PhoneticFeature.ToneRising]: 'tone: rising',
  [PhoneticFeature.ToneFalling]: 'tone: falling',
  [PhoneticFeature.ToneContour]: 'tone: contour',
  [PhoneticFeature.Stress]: 'stress',
  [PhoneticFeature.Long]: 'long',
};
