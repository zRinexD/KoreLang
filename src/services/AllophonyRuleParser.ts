/**
 * Allophony Rule Parser
 * Parses formal phonological rule notation into feature vectors
 * for efficient matching and allophone generation
 */

import { PhoneticFeature } from '../types/phoneticFeatures';

export interface ParsedRule {
  id: string;
  name: string;
  inputMask: number;       // Features that must be checked (32-bit)
  inputValues: number;     // Expected values for those features (32-bit)
  outputMask: number;      // Features to change (32-bit)
  outputChanges: number;   // New values for those features (32-bit)
  outputText?: string;     // Human-readable output (e.g., "[ɾ]")
  context: string;         // Context notation (A_B)
  rawRule: string;         // Original rule text
}

/**
 * Feature name to PhoneticFeature enum mapping
 */
const FEATURE_NAME_MAP: Record<string, PhoneticFeature> = {
  'consonantal': PhoneticFeature.Consonantal,
  'syllabic': PhoneticFeature.Syllabic,
  'sonorant': PhoneticFeature.Sonorant,
  'voice': PhoneticFeature.Voice,
  'voiced': PhoneticFeature.Voice,
  'continuant': PhoneticFeature.Continuant,
  'nasal': PhoneticFeature.Nasal,
  'labial': PhoneticFeature.Labial,
  'coronal': PhoneticFeature.Coronal,
  'dorsal': PhoneticFeature.Dorsal,
  'anterior': PhoneticFeature.Anterior,
  'distributed': PhoneticFeature.Distributed,
  'spread glottis': PhoneticFeature.SpreadGlottis,
  'aspirated': PhoneticFeature.SpreadGlottis,
  'constricted glottis': PhoneticFeature.ConstrictedGlottis,
  'stiff vocal cords': PhoneticFeature.StiffVocalCords,
  'slack vocal cords': PhoneticFeature.SlackVocalCords,
  'strident': PhoneticFeature.Strident,
  'lateral': PhoneticFeature.Lateral,
  'delayed release': PhoneticFeature.DelayedRelease,
  'trill': PhoneticFeature.Trill,
  'high': PhoneticFeature.High,
  'low': PhoneticFeature.Low,
  'back': PhoneticFeature.Back,
  'round': PhoneticFeature.Round,
  'atr': PhoneticFeature.ATR,
  'tense': PhoneticFeature.Tense,
  'stress': PhoneticFeature.Stress,
  'long': PhoneticFeature.Long,
  'stop': PhoneticFeature.Consonantal, // Simplified: -continuant
};

/**
 * Parse feature bundle like "[+voice, -continuant, +coronal]"
 * Returns { mask, values } for bitwise matching
 */
function parseFeatureBundle(bundle: string): { mask: number; values: number } {
  let mask = 0;
  let values = 0;

  // Remove brackets and split by comma
  const cleaned = bundle.replace(/[\[\]]/g, '').trim();
  if (!cleaned) return { mask, values };

  const features = cleaned.split(',').map(f => f.trim());

  for (const feature of features) {
    const isPositive = feature.startsWith('+');
    const isNegative = feature.startsWith('-');
    
    if (!isPositive && !isNegative) continue;

    const featureName = feature.substring(1).trim().toLowerCase();
    const featureBit = FEATURE_NAME_MAP[featureName];

    if (featureBit !== undefined) {
      mask |= featureBit;
      if (isPositive) {
        values |= featureBit;
      }
      // If negative, bit stays 0 in values
    }
  }

  // Handle mutually exclusive features: voice ↔ spreadglottis
  // [+voice] → remove [spreadglottis]
  if ((values & PhoneticFeature.Voice) !== 0) {
    mask |= PhoneticFeature.SpreadGlottis;
    values &= ~PhoneticFeature.SpreadGlottis;
  }
  // [-voice] → add [+spreadglottis]
  else if ((mask & PhoneticFeature.Voice) !== 0 && (values & PhoneticFeature.Voice) === 0) {
    mask |= PhoneticFeature.SpreadGlottis;
    values |= PhoneticFeature.SpreadGlottis;
  }
  
  // [+spreadglottis] → remove [voice]
  if ((values & PhoneticFeature.SpreadGlottis) !== 0) {
    mask |= PhoneticFeature.Voice;
    values &= ~PhoneticFeature.Voice;
  }
  // [-spreadglottis] → add [+voice]
  else if ((mask & PhoneticFeature.SpreadGlottis) !== 0 && (values & PhoneticFeature.SpreadGlottis) === 0) {
    mask |= PhoneticFeature.Voice;
    values |= PhoneticFeature.Voice;
  }

  return { mask, values };
}

/**
 * Parse a formal rule notation into a ParsedRule
 * Format: X → Y / A_B
 * 
 * Examples:
 * - /t/ → [ɾ] / [+vowel]_[+vowel, -stress]
 * - [+stop, -voice] → [+aspirated] / #_
 * - [+nasal] → [+syllabic] / _#
 */
export function parseAllophonyRule(id: string, name: string, ruleText: string): ParsedRule | null {
  try {
    // Split by arrow → or ->
    const arrowMatch = ruleText.match(/(.+?)\s*(→|->)\s*(.+?)\s*\/\s*(.+)/);
    
    if (!arrowMatch) {
      // No context, simple rule: X → Y
      const simpleMatch = ruleText.match(/(.+?)\s*(→|->)\s*(.+)/);
      if (simpleMatch) {
        const [, inputPart, , outputPart] = simpleMatch;
        const input = parseFeatureBundle(inputPart);
        const output = parseFeatureBundle(outputPart);
        
        return {
          id,
          name,
          inputMask: input.mask,
          inputValues: input.values,
          outputMask: output.mask,
          outputChanges: output.values,
          outputText: outputPart.trim(),
          context: '',
          rawRule: ruleText,
        };
      }
      return null;
    }

    const [, inputPart, , outputPart, contextPart] = arrowMatch;

    // Parse input features
    const input = parseFeatureBundle(inputPart);

    // Parse output features
    const output = parseFeatureBundle(outputPart);

    return {
      id,
      name,
      inputMask: input.mask,
      inputValues: input.values,
      outputMask: output.mask,
      outputChanges: output.values,
      outputText: outputPart.trim(),
      context: contextPart.trim(),
      rawRule: ruleText,
    };
  } catch (error) {
    console.error(`Failed to parse rule: ${ruleText}`, error);
    return null;
  }
}

/**
 * Check if a phoneme matches a rule's input specification
 */
export function matchesRule(phonemeVector: number, rule: ParsedRule): boolean {
  // Check if phoneme has all required features with correct values
  return (phonemeVector & rule.inputMask) === rule.inputValues;
}

/**
 * Generate allophone by applying rule to base phoneme
 */
export function applyRule(baseVector: number, rule: ParsedRule): number {
  // Apply output changes: clear bits in mask, then set new values
  return (baseVector & ~rule.outputMask) | rule.outputChanges;
}

/**
 * Get all applicable rules for a phoneme
 */
export function getApplicableRules(
  phonemeVector: number,
  allRules: ParsedRule[]
): ParsedRule[] {
  return allRules.filter(rule => matchesRule(phonemeVector, rule));
}
