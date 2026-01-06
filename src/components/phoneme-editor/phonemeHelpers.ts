import {
  PhoneticModification,
  ArticulationPlaceModification,
  RoundnessModification,
  TonguePositionModification,
  PhonationModification,
  OronasalProcessModification,
  TongueRootPositionModification,
  SyllabicRoleModification,
  PhonemeType,
} from "../../types";
import {
  diacriticCategories,
  suprasegmentalCategories,
  toneLevelOptions,
  toneContourOptions,
  combinableDiacritics,
  combinableSuprasegmentals,
  Option,
} from "../EditPhonemOptions";
import { PhonemeDataService } from "../../services/PhonemeDataService";

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

export function computeFlags(
  diacriticSelections: Record<string, string | null>,
  combinableDiacriticsSet: Set<string>,
  suprasegmentalSelections: Record<string, string | null>,
  combinableSuprasegmentalsSet: Set<string>,
  toneLevel: string | null,
  toneContour: string | null
): bigint {
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
}

export function computePhonemeId(activeHeader: PhonemeType | null, flags: bigint): string {
  if (!activeHeader) return "";
  
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
}

export function computePhonemeName(
  activeHeader: PhonemeType | null,
  diacriticSelections: Record<string, string | null>,
  combinableDiacriticsSet: Set<string>,
  suprasegmentalSelections: Record<string, string | null>,
  combinableSuprasegmentalsSet: Set<string>,
  toneLevel: string | null,
  toneContour: string | null
): string {
  if (!activeHeader) return "";
  const modifications: string[] = [];

  // Add diacritics from categories
  Object.entries(diacriticCategories).forEach(([key, category]) => {
    const selected = diacriticSelections[key];
    if (selected) {
      const opt = category.options.find((o) => o.value === selected);
      if (opt) modifications.push(opt.label);
    }
  });

  // Add combinable diacritics
  combinableDiacriticsSet.forEach((val) => {
    const opt = combinableDiacritics.find((o) => o.value === val);
    if (opt) modifications.push(opt.label);
  });

  // Add suprasegmentals from categories
  Object.entries(suprasegmentalCategories).forEach(([key, category]) => {
    const selected = suprasegmentalSelections[key];
    if (selected) {
      const opt = category.options.find((o) => o.value === selected);
      if (opt) modifications.push(opt.label);
    }
  });

  // Add combinable suprasegmentals
  combinableSuprasegmentalsSet.forEach((val) => {
    const opt = combinableSuprasegmentals.find((o) => o.value === val);
    if (opt) modifications.push(opt.label);
  });

  // Add tone level
  if (toneLevel) {
    const opt = toneLevelOptions.find((o) => o.value === toneLevel);
    if (opt) modifications.push(opt.label);
  }

  // Add tone contour
  if (toneContour) {
    const opt = toneContourOptions.find((o) => o.value === toneContour);
    if (opt) modifications.push(opt.label);
  }

  return modifications.length > 0
    ? `${activeHeader} + ${modifications.join(" + ")}`
    : activeHeader;
}

function findSymbol(value: string, allOptions: Option[]): string {
  return allOptions.find((o) => o.value === value)?.symbol || "";
}

function getAllDiacriticOptions(): Option[] {
  const all: Option[] = [];
  Object.values(diacriticCategories).forEach((cat) => all.push(...cat.options));
  all.push(...combinableDiacritics);
  return all;
}

function getAllSuprasegmentalOptions(): Option[] {
  const all: Option[] = [];
  Object.values(suprasegmentalCategories).forEach((cat) => all.push(...cat.options));
  all.push(...combinableSuprasegmentals);
  return all;
}

export function computeDisplaySymbols(
  activePhonemeSymbol: string,
  diacriticSelections: Record<string, string | null>,
  combinableDiacriticsSet: Set<string>,
  suprasegmentalSelections: Record<string, string | null>,
  combinableSuprasegmentalsSet: Set<string>,
  toneLevel: string | null,
  toneContour: string | null
): string {
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

  const diacriticSymbols = getAllSelectedDiacritics()
    .map((v) => findSymbol(v, getAllDiacriticOptions()))
    .join("");

  const suprasegmentalSymbols = getAllSelectedSuprasegmentals()
    .map((v) => findSymbol(v, getAllSuprasegmentalOptions()))
    .join("");

  const toneLevelSymbol = toneLevel ? findSymbol(toneLevel, toneLevelOptions) : "";
  const toneContourSymbol = toneContour ? findSymbol(toneContour, toneContourOptions) : "";

  return `${activePhonemeSymbol}${diacriticSymbols}${suprasegmentalSymbols}${toneLevelSymbol}${toneContourSymbol}` || "—";
}

/**
 * Generate variant IPA by applying transformation features to a base phoneme
 * @param baseSymbol - The IPA symbol of the base phoneme
 * @param transformationFeatures - Array of features that define the variant (e.g., ["+voiced", "-continuant"])
 * @returns The IPA representation of the variant
 */
export function getVariantIPA(baseSymbol: string, transformationFeatures: string[]): string {
  if (!baseSymbol || transformationFeatures.length === 0) {
    return baseSymbol;
  }

  // Map of feature modifications to diacritic symbols
  const featureToDiacritic: Record<string, string> = {
    // Voicing features
    "+voiced": "", // Already voiced
    "-voiced": "̥", // Voiceless
    "+voice": "", // Already voiced
    "-voice": "̥", // Voiceless

    // Aspiration/spread glottis
    "+spread glottis": "ʰ",
    "+aspirated": "ʰ",

    // Nasalization
    "+nasal": "̃",

    // Rounding
    "+rounded": "",
    "-rounded": "",

    // Backness
    "+back": "ˠ", // Velarized
    "-back": "̺", // Advanced

    // Syllabicity
    "+syllabic": "̩",
    "-syllabic": "̯",

    // Labialization
    "+labialized": "ʷ",

    // Velarization
    "+velarized": "ˠ",

    // Lengthening
    "long": "ː",
    "short": "",
  };

  let result = baseSymbol;
  const diacritics: string[] = [];

  // Collect diacritics from transformation features
  transformationFeatures.forEach((feature) => {
    const diacritic = featureToDiacritic[feature.toLowerCase()];
    if (diacritic) {
      diacritics.push(diacritic);
    }
  });

  return result + diacritics.join("");
}

/**
 * Parse traits from rule output text and generate variant IPA
 * @param baseSymbol - The IPA symbol of the base phoneme
 * @param outputText - The output part of the rule (e.g., "[+voice]" or "[ɾ]")
 * @param baseFeatureVector - The feature vector of the base phoneme (from computeFeatureVector)
 * @param outputMask - The bitmask of features to change (from ParsedRule.outputMask)
 * @param outputChanges - The new values for those features (from ParsedRule.outputChanges)
 * @param allPhonemes - All available phonemes to search for match
 * @returns The IPA representation of the variant
 */
export function getVariantIPAFromRuleOutput(
  baseSymbol: string,
  outputText: string,
  baseFeatureVector?: number,
  outputMask?: number,
  outputChanges?: number,
  allPhonemes?: Array<{ phoneme: PhonemeType; featureVector: number }>
): string {
  if (!outputText) return baseSymbol;

  // If output already contains direct IPA (no features), use it
  const ipaMatch = outputText.match(/\[([^\[\]]+)\]/);
  if (ipaMatch) {
    const content = ipaMatch[1];
    // Check if it's already an IPA symbol (no +/- or commas)
    if (!content.includes("+") && !content.includes("-") && !content.includes(",")) {
      return content;
    }
  }

  // If we have bitmasks, use them to find the transformed phoneme
  if (baseFeatureVector !== undefined && outputMask !== undefined && outputChanges !== undefined && allPhonemes) {
    // Apply the transformation: clear bits in mask, then set new values
    const transformedVector = (baseFeatureVector & ~outputMask) | outputChanges;
    
    console.log('[getVariantIPAFromRuleOutput] Debug info:');
    console.log('  baseSymbol:', baseSymbol);
    console.log('  baseFeatureVector:', baseFeatureVector.toString(2).padStart(32, '0'));
    console.log('  outputMask:', outputMask.toString(2).padStart(32, '0'));
    console.log('  outputChanges:', outputChanges.toString(2).padStart(32, '0'));
    console.log('  transformedVector:', transformedVector.toString(2).padStart(32, '0'));
    
    // Find the phoneme that best matches the transformed vector
    let bestMatch: { phoneme: PhonemeType; featureVector: number } | null = null;
    let bestScore = -1;
    const candidateScores: Array<{phoneme: PhonemeType; score: number; diff: number}> = [];
    
    for (const phoneme of allPhonemes) {
      // Count matching bits (use XOR to find differences, then count zeros)
      const diff = transformedVector ^ phoneme.featureVector;
      const matchingBits = 32 - countSetBits(diff);
      
      candidateScores.push({
        phoneme: phoneme.phoneme,
        score: matchingBits,
        diff: countSetBits(diff)
      });
      
      if (matchingBits > bestScore) {
        bestScore = matchingBits;
        bestMatch = phoneme;
      }
    }
    
    // Show top 5 candidates
    candidateScores.sort((a, b) => b.score - a.score);
    console.log('  Top candidates:');
    candidateScores.slice(0, 5).forEach(c => {
      const ipa = PhonemeDataService.getIPA(c.phoneme);
      const phonemeObj = allPhonemes.find(p => p.phoneme === c.phoneme);
      const vectorStr = phonemeObj ? phonemeObj.featureVector.toString(2).padStart(32, '0') : 'N/A';
      console.log(`    [${ipa}] (${c.phoneme}): ${c.score} bits match, ${c.diff} bits differ`);
      console.log(`      Vector: ${vectorStr}`);
    });
    
    // Check specifically for [d]
    const dPhoneme = allPhonemes.find(p => {
      const ipa = PhonemeDataService.getIPA(p.phoneme);
      return ipa === 'd';
    });
    if (dPhoneme) {
      const dDiff = transformedVector ^ dPhoneme.featureVector;
      const dMatchingBits = 32 - countSetBits(dDiff);
      console.log('  [d] specifically:');
      console.log(`    Vector: ${dPhoneme.featureVector.toString(2).padStart(32, '0')}`);
      console.log(`    Matching bits: ${dMatchingBits}, Differing bits: ${countSetBits(dDiff)}`);
      console.log(`    Phoneme type: ${dPhoneme.phoneme}`);
    } else {
      console.log('  [d] NOT FOUND in allPhonemes!');
    }
    
    if (bestMatch) {
      const resultIPA = PhonemeDataService.getIPA(bestMatch.phoneme) || baseSymbol;
      console.log('  Best match:', resultIPA, '(' + bestMatch.phoneme + ')');
      return resultIPA;
    }
  }

  // Fallback to diacritic application
  if (outputText.includes("+") || outputText.includes("-")) {
    const features = outputText
      .replace(/[\[\]]/g, "")
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f);
    return getVariantIPA(baseSymbol, features);
  }

  return baseSymbol;
}

/**
 * Count number of set bits in a 32-bit integer
 */
function countSetBits(n: number): number {
  let count = 0;
  while (n) {
    count += n & 1;
    n >>= 1;
  }
  return count;
}

