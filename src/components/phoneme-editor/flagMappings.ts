import {
  ArticulationPlaceModification,
  RoundnessModification,
  TonguePositionModification,
  PhonationModification,
  OronasalProcessModification,
  TongueRootPositionModification,
  SyllabicRoleModification,
  PhoneticModification,
} from "../../types";
import {
  diacriticCategories,
  suprasegmentalCategories,
  combinableDiacritics,
  combinableSuprasegmentals,
  toneLevelOptions,
  toneContourOptions,
} from "../EditPhonemOptions";

export const valueToFlagMapping: Record<string, PhoneticModification> = {
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
  "primary-stress": PhoneticModification.PrimaryStress,
  "secondary-stress": PhoneticModification.SecondaryStress,
  "long": PhoneticModification.Long,
  "half-long": PhoneticModification.HalfLong,
  "extra-short": PhoneticModification.ExtraShort,
  "linking": PhoneticModification.Linking,
  "minor-group": PhoneticModification.MinorGroup,
  "major-group": PhoneticModification.MajorGroup,
  "syllable-break": PhoneticModification.SyllableBreak,
  "extra-high": PhoneticModification.ToneExtraHigh,
  "high": PhoneticModification.ToneHigh,
  "mid": PhoneticModification.ToneMid,
  "low": PhoneticModification.ToneLow,
  "extra-low": PhoneticModification.ToneExtraLow,
  "rising": PhoneticModification.ToneRising,
  "falling": PhoneticModification.ToneFalling,
  "high-falling": PhoneticModification.ToneHighFalling,
  "low-rising": PhoneticModification.ToneLowRising,
  "rising-falling": PhoneticModification.ToneRisingFalling,
  "falling-rising": PhoneticModification.ToneFallingRising,
};

// Build reverse mapping and category lookups once
export const flagToValueMap = new Map<bigint, string>(
  Object.entries(valueToFlagMapping).map(([val, flag]) => [BigInt(flag), val])
);

export const diacriticCategoryByValue: Record<string, string> = {};
Object.entries(diacriticCategories).forEach(([catKey, cat]) => {
  cat.options.forEach((opt) => {
    diacriticCategoryByValue[opt.value] = catKey;
  });
});

export const suprasegmentalCategoryByValue: Record<string, string> = {};
Object.entries(suprasegmentalCategories).forEach(([catKey, cat]) => {
  cat.options.forEach((opt) => {
    suprasegmentalCategoryByValue[opt.value] = catKey;
  });
});

export const combinableDiacriticValues = new Set(
  combinableDiacritics.map((o) => o.value)
);

export const combinableSuprasegmentalValues = new Set(
  combinableSuprasegmentals.map((o) => o.value)
);

export const toneLevelValues = new Set(toneLevelOptions.map((o) => o.value));
export const toneContourValues = new Set(toneContourOptions.map((o) => o.value));

export interface DecodedPhonemeState {
  diacriticSelections: Record<string, string | null>;
  combinableDiacriticsSet: Set<string>;
  suprasegmentalSelections: Record<string, string | null>;
  combinableSuprasegmentalsSet: Set<string>;
  toneLevel: string | null;
  toneContour: string | null;
}

export function decodePhonemeFlags(flags: bigint): DecodedPhonemeState {
  const diacriticSelections: Record<string, string | null> = {
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
  const combinableDiacriticsSet = new Set<string>();
  const suprasegmentalSelections: Record<string, string | null> = {
    length: null,
    stress: null,
    breaks: null,
  };
  const combinableSuprasegmentalsSet = new Set<string>();
  let toneLevel: string | null = null;
  let toneContour: string | null = null;

  Object.values(valueToFlagMapping).forEach((flagVal) => {
    const flag = BigInt(flagVal);
    if ((flags & flag) !== flag) return;
    
    const value = flagToValueMap.get(flag);
    if (!value) return;

    if (diacriticCategoryByValue[value]) {
      diacriticSelections[diacriticCategoryByValue[value]] = value;
    } else if (combinableDiacriticValues.has(value)) {
      combinableDiacriticsSet.add(value);
    } else if (suprasegmentalCategoryByValue[value]) {
      suprasegmentalSelections[suprasegmentalCategoryByValue[value]] = value;
    } else if (combinableSuprasegmentalValues.has(value)) {
      combinableSuprasegmentalsSet.add(value);
    } else if (toneLevelValues.has(value) && !toneLevel) {
      toneLevel = value;
    } else if (toneContourValues.has(value) && !toneContour) {
      toneContour = value;
    }
  });

  return {
    diacriticSelections,
    combinableDiacriticsSet,
    suprasegmentalSelections,
    combinableSuprasegmentalsSet,
    toneLevel,
    toneContour,
  };
}
