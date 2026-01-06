import { PhonemeType, PhoneticModification, PhonemeInstance } from "../types";
import { PhoneticFeature, FEATURE_NAMES } from "../types/phoneticFeatures";

export class PhonemeDataService {
  // Métadonnées pour chaque phonème (catégorie, manner, place, height, backness, etc.)
  private static readonly phonemeMeta: Partial<Record<PhonemeType, {
    category: 'consonant' | 'vowel',
    manner?: string,
    place?: string,
    height?: string,
    backness?: string,
  }>> = {
    // Nasals
    [PhonemeType.VoicedBilabialNasal]: { category: 'consonant', manner: 'nasal', place: 'bilabial' },
    [PhonemeType.VoicedLabiodentalNasal]: { category: 'consonant', manner: 'nasal', place: 'labiodental' },
    [PhonemeType.VoicedAlveolarNasal]: { category: 'consonant', manner: 'nasal', place: 'alveolar' },
    [PhonemeType.VoicedRetroflexNasal]: { category: 'consonant', manner: 'nasal', place: 'retroflex' },
    [PhonemeType.VoicedPalatalNasal]: { category: 'consonant', manner: 'nasal', place: 'palatal' },
    [PhonemeType.VoicedVelarNasal]: { category: 'consonant', manner: 'nasal', place: 'velar' },
    [PhonemeType.VoicedUvularNasal]: { category: 'consonant', manner: 'nasal', place: 'uvular' },
    // Plosives
    [PhonemeType.VoicelessBilabialPlosive]: { category: 'consonant', manner: 'plosive', place: 'bilabial' },
    [PhonemeType.VoicedBilabialPlosive]: { category: 'consonant', manner: 'plosive', place: 'bilabial' },
    [PhonemeType.VoicelessAlveolarPlosive]: { category: 'consonant', manner: 'plosive', place: 'alveolar' },
    [PhonemeType.VoicedAlveolarPlosive]: { category: 'consonant', manner: 'plosive', place: 'alveolar' },
    [PhonemeType.VoicelessRetroflexPlosive]: { category: 'consonant', manner: 'plosive', place: 'retroflex' },
    [PhonemeType.VoicedRetroflexPlosive]: { category: 'consonant', manner: 'plosive', place: 'retroflex' },
    [PhonemeType.VoicelessPalatalPlosive]: { category: 'consonant', manner: 'plosive', place: 'palatal' },
    [PhonemeType.VoicedPalatalPlosive]: { category: 'consonant', manner: 'plosive', place: 'palatal' },
    [PhonemeType.VoicelessVelarPlosive]: { category: 'consonant', manner: 'plosive', place: 'velar' },
    [PhonemeType.VoicedVelarPlosive]: { category: 'consonant', manner: 'plosive', place: 'velar' },
    [PhonemeType.VoicelessUvularPlosive]: { category: 'consonant', manner: 'plosive', place: 'uvular' },
    [PhonemeType.VoicedUvularPlosive]: { category: 'consonant', manner: 'plosive', place: 'uvular' },
    [PhonemeType.EpiglottalPlosive]: { category: 'consonant', manner: 'plosive', place: 'epiglottal' },
    [PhonemeType.VoicelessGlottalPlosive]: { category: 'consonant', manner: 'plosive', place: 'glottal' },
    // Fricatives
    [PhonemeType.VoicelessBilabialFricative]: { category: 'consonant', manner: 'fricative', place: 'bilabial' },
    [PhonemeType.VoicedBilabialFricative]: { category: 'consonant', manner: 'fricative', place: 'bilabial' },
    [PhonemeType.VoicelessLabiodentalFricative]: { category: 'consonant', manner: 'fricative', place: 'labiodental' },
    [PhonemeType.VoicedLabiodentalFricative]: { category: 'consonant', manner: 'fricative', place: 'labiodental' },
    [PhonemeType.VoicelessDentalFricative]: { category: 'consonant', manner: 'fricative', place: 'dental' },
    [PhonemeType.VoicedDentalFricative]: { category: 'consonant', manner: 'fricative', place: 'dental' },
    [PhonemeType.VoicelessAlveolarFricative]: { category: 'consonant', manner: 'fricative', place: 'alveolar' },
    [PhonemeType.VoicedAlveolarFricative]: { category: 'consonant', manner: 'fricative', place: 'alveolar' },
    [PhonemeType.VoicelessPostalveolarFricative]: { category: 'consonant', manner: 'fricative', place: 'postalveolar' },
    [PhonemeType.VoicedPostalveolarFricative]: { category: 'consonant', manner: 'fricative', place: 'postalveolar' },
    [PhonemeType.VoicelessRetroflexFricative]: { category: 'consonant', manner: 'fricative', place: 'retroflex' },
    [PhonemeType.VoicedRetroflexFricative]: { category: 'consonant', manner: 'fricative', place: 'retroflex' },
    [PhonemeType.VoicelessPalatalFricative]: { category: 'consonant', manner: 'fricative', place: 'palatal' },
    [PhonemeType.VoicedPalatalFricative]: { category: 'consonant', manner: 'fricative', place: 'palatal' },
    [PhonemeType.VoicelessVelarFricative]: { category: 'consonant', manner: 'fricative', place: 'velar' },
    [PhonemeType.VoicedVelarFricative]: { category: 'consonant', manner: 'fricative', place: 'velar' },
    [PhonemeType.VoicelessAlveoloPalatalFricative]: { category: 'consonant', manner: 'fricative', place: 'alveolo-palatal' },
    [PhonemeType.VoicedAlveoloPalatalFricative]: { category: 'consonant', manner: 'fricative', place: 'alveolo-palatal' },
    [PhonemeType.VoicelessUvularFricative]: { category: 'consonant', manner: 'fricative', place: 'uvular' },
    [PhonemeType.VoicedUvularFricative]: { category: 'consonant', manner: 'fricative', place: 'uvular' },
    [PhonemeType.VoicelessPharyngealFricative]: { category: 'consonant', manner: 'fricative', place: 'pharyngeal' },
    [PhonemeType.VoicedPharyngealFricative]: { category: 'consonant', manner: 'fricative', place: 'pharyngeal' },
    [PhonemeType.VoicelessEpiglottalFricative]: { category: 'consonant', manner: 'fricative', place: 'epiglottal' },
      // Clicks
      [PhonemeType.ClickBilabial]: { category: 'consonant', manner: 'click', place: 'bilabial' },
      [PhonemeType.ClickDental]: { category: 'consonant', manner: 'click', place: 'dental' },
      [PhonemeType.ClickPostAlveolar]: { category: 'consonant', manner: 'click', place: 'postalveolar' },
      [PhonemeType.ClickPalatoAlveolar]: { category: 'consonant', manner: 'click', place: 'alveolo-palatal' },
      [PhonemeType.ClickAlveolarLateral]: { category: 'consonant', manner: 'click', place: 'alveolar' },
      // Implosives
      [PhonemeType.ImplosiveBilabial]: { category: 'consonant', manner: 'implosive', place: 'bilabial' },
      [PhonemeType.ImplosiveDentalAlveolar]: { category: 'consonant', manner: 'implosive', place: 'alveolar' },
      [PhonemeType.ImplosivePalatal]: { category: 'consonant', manner: 'implosive', place: 'palatal' },
      [PhonemeType.ImplosiveVelar]: { category: 'consonant', manner: 'implosive', place: 'velar' },
      [PhonemeType.ImplosiveUvular]: { category: 'consonant', manner: 'implosive', place: 'uvular' },
    [PhonemeType.VoicedEpiglottalFricative]: { category: 'consonant', manner: 'fricative', place: 'epiglottal' },
    [PhonemeType.VoicelessLabialVelarFricative]: { category: 'consonant', manner: 'fricative', place: 'other' },
    [PhonemeType.VoicelessGlottalFricative]: { category: 'consonant', manner: 'fricative', place: 'glottal' },
    [PhonemeType.VoicedGlottalFricative]: { category: 'consonant', manner: 'fricative', place: 'glottal' },
    // Affricates
    [PhonemeType.VoicelessAlveolarAffricate]: { category: 'consonant', manner: 'affricate', place: 'alveolar' },
    [PhonemeType.VoicedAlveolarAffricate]: { category: 'consonant', manner: 'affricate', place: 'alveolar' },
    [PhonemeType.VoicelessPostalveolarAffricate]: { category: 'consonant', manner: 'affricate', place: 'postalveolar' },
    [PhonemeType.VoicedPostalveolarAffricate]: { category: 'consonant', manner: 'affricate', place: 'postalveolar' },
    // Approximants
    [PhonemeType.VoicedLabioDentalApproximant]: { category: 'consonant', manner: 'approximant', place: 'labiodental' },
    [PhonemeType.VoicedAlveolarApproximant]: { category: 'consonant', manner: 'approximant', place: 'alveolar' },
    [PhonemeType.VoicedRetroflexApproximant]: { category: 'consonant', manner: 'approximant', place: 'retroflex' },
    [PhonemeType.VoicedPalatalApproximant]: { category: 'consonant', manner: 'approximant', place: 'palatal' },
    [PhonemeType.VoicedLabialPalatalApproximant]: { category: 'consonant', manner: 'approximant', place: 'other' },
    [PhonemeType.VoicedLabioVelarApproximant]: { category: 'consonant', manner: 'approximant', place: 'other' },
    [PhonemeType.VoicedVelarApproximant]: { category: 'consonant', manner: 'approximant', place: 'velar' },
    // Trills, taps, flaps
    [PhonemeType.VoicedBilabialTrill]: { category: 'consonant', manner: 'trill', place: 'bilabial' },
    [PhonemeType.VoicedAlveolarTrill]: { category: 'consonant', manner: 'trill', place: 'alveolar' },
    [PhonemeType.VoicedUvularTrill]: { category: 'consonant', manner: 'trill', place: 'uvular' },
    [PhonemeType.Voicedlabiodentalflap]: { category: 'consonant', manner: 'flap', place: 'labiodental' },
    [PhonemeType.VoicedAlveolarTap]: { category: 'consonant', manner: 'tap', place: 'alveolar' },
    [PhonemeType.VoicedRetroflexTap]: { category: 'consonant', manner: 'tap', place: 'retroflex' },
    [PhonemeType.VoicedAlveolarLateralFlap]: { category: 'consonant', manner: 'lateral-flap', place: 'alveolar' },
    // Lateral fricatives/approximants
    [PhonemeType.VoicelessAlveolarLateralFricative]: { category: 'consonant', manner: 'lateral fricative', place: 'alveolar' },
    [PhonemeType.VoicedAlveolarLateralFricative]: { category: 'consonant', manner: 'lateral fricative', place: 'alveolar' },
    [PhonemeType.VoicedAlveolarLateralApproximant]: { category: 'consonant', manner: 'lateral approximant', place: 'alveolar' },
    [PhonemeType.VoicedRetroflexLateralApproximant]: { category: 'consonant', manner: 'lateral approximant', place: 'retroflex' },
    [PhonemeType.VoicedPalatalLateralApproximant]: { category: 'consonant', manner: 'lateral approximant', place: 'palatal' },
    [PhonemeType.VoicedVelarLateralApproximant]: { category: 'consonant', manner: 'lateral approximant', place: 'velar' },
    // Manquants pour la couverture complète
    [PhonemeType.VoicedPostAlveolarSibilantFricative]: { category: 'consonant', manner: 'fricative', place: 'postalveolar' },
    [PhonemeType.VoicelessPostAlveolarSibilantFricative]: { category: 'consonant', manner: 'fricative', place: 'postalveolar' },
    [PhonemeType.VoicedLabioDentalFricative]: { category: 'consonant', manner: 'fricative', place: 'labiodental' },
    [PhonemeType.VoicelessLabioDentalFricative]: { category: 'consonant', manner: 'fricative', place: 'labiodental' },
    [PhonemeType.VoicedLabioDentalNasal]: { category: 'consonant', manner: 'nasal', place: 'labiodental' },
    // Vowels (close)
    [PhonemeType.CloseFrontUnroundedVowel]: { category: 'vowel', height: 'close', backness: 'front' },
    [PhonemeType.CloseFrontRoundedVowel]: { category: 'vowel', height: 'close', backness: 'front' },
    [PhonemeType.CloseCentralUnroundedVowel]: { category: 'vowel', height: 'close', backness: 'central' },
    [PhonemeType.CloseCentralRoundedVowel]: { category: 'vowel', height: 'close', backness: 'central' },
    [PhonemeType.CloseBackUnroundedVowel]: { category: 'vowel', height: 'close', backness: 'back' },
    [PhonemeType.CloseBackRoundedVowel]: { category: 'vowel', height: 'close', backness: 'back' },
    // Vowels (near-close)
    [PhonemeType.NearCloseNearFrontUnroundedVowel]: { category: 'vowel', height: 'near-close', backness: 'near-front' },
    [PhonemeType.NearCloseNearFrontRoundedVowel]: { category: 'vowel', height: 'near-close', backness: 'near-front' },
    [PhonemeType.NearCloseNearBackRoundedVowel]: { category: 'vowel', height: 'near-close', backness: 'near-back' },
    // Vowels (close-mid)
    [PhonemeType.CloseMidFrontUnroundedVowel]: { category: 'vowel', height: 'close-mid', backness: 'front' },
    [PhonemeType.CloseMidFrontRoundedVowel]: { category: 'vowel', height: 'close-mid', backness: 'front' },
    // Vowels (mid)
    [PhonemeType.MidCentralVowel]: { category: 'vowel', height: 'mid', backness: 'central' },
    // Vowels (open-mid)
    [PhonemeType.OpenMidFrontUnroundedVowel]: { category: 'vowel', height: 'open-mid', backness: 'front' },
    [PhonemeType.OpenMidFrontRoundedVowel]: { category: 'vowel', height: 'open-mid', backness: 'front' },
    [PhonemeType.OpenMidBackUnroundedVowel]: { category: 'vowel', height: 'open-mid', backness: 'back' },
    [PhonemeType.OpenMidBackRoundedVowel]: { category: 'vowel', height: 'open-mid', backness: 'back' },
    // Vowels (near-open)
    [PhonemeType.NearOpenFrontUnroundedVowel]: { category: 'vowel', height: 'near-open', backness: 'front' },
    // Vowels (open)
    [PhonemeType.OpenFrontUnroundedVowel]: { category: 'vowel', height: 'open', backness: 'front' },
    [PhonemeType.OpenBackUnroundedVowel]: { category: 'vowel', height: 'open', backness: 'back' },
    [PhonemeType.OpenBackRoundedVowel]: { category: 'vowel', height: 'open', backness: 'back' },
    // Other (coarticulated/special)
    [PhonemeType.VoicelessPalatalVelarFricative]: { category: 'consonant', manner: 'fricative', place: 'other' },
    [PhonemeType.VoicelessAlveolarLateralAffricate]: { category: 'consonant', manner: 'affricate', place: 'other' },
    [PhonemeType.VoicedAlveolarLateralAffricate]: { category: 'consonant', manner: 'affricate', place: 'other' },
    [PhonemeType.VoicelessDarkL]: { category: 'consonant', manner: 'lateral-approximant', place: 'other' },
    [PhonemeType.VoicedDarkL]: { category: 'consonant', manner: 'lateral-approximant', place: 'other' },
    [PhonemeType.VoicelessLabialPalatalApproximant]: { category: 'consonant', manner: 'approximant', place: 'other' },
  };

  static getMeta(phoneme: PhonemeType) {
    return this.phonemeMeta[phoneme];
  }

  /**
   * Vérifie que tous les PhonemeType sont couverts par le mapping phonemeMeta
   * (à appeler au démarrage en dev)
   */
  static checkMetaCoverage() {
    const all = Object.values(PhonemeType);
    const missing = all.filter(pt => !this.phonemeMeta[pt]);
    if (missing.length > 0) {
      // eslint-disable-next-line no-console
      console.warn('[PhonemeDataService] PhonemeType(s) manquants dans phonemeMeta:', missing);
    } else {
      // eslint-disable-next-line no-console
      console.info('[PhonemeDataService] Tous les PhonemeType sont couverts dans phonemeMeta.');
    }
  }
  private static readonly phonemeToIPA: Partial<Record<PhonemeType, string>> = {
    [PhonemeType.VoicedBilabialNasal]: "m",
    [PhonemeType.VoicedLabiodentalNasal]: "ɱ",
    [PhonemeType.VoicedAlveolarNasal]: "n",
    [PhonemeType.VoicedRetroflexNasal]: "ɳ",
    [PhonemeType.VoicedPalatalNasal]: "ɲ",
    [PhonemeType.VoicedVelarNasal]: "ŋ",
    [PhonemeType.VoicedUvularNasal]: "ɴ",
    [PhonemeType.VoicelessBilabialPlosive]: "p",
    [PhonemeType.VoicedBilabialPlosive]: "b",
    [PhonemeType.VoicelessAlveolarPlosive]: "t",
    [PhonemeType.VoicedAlveolarPlosive]: "d",
    [PhonemeType.VoicelessRetroflexPlosive]: "ʈ",
    [PhonemeType.VoicedRetroflexPlosive]: "ɖ",
    [PhonemeType.VoicelessPalatalPlosive]: "c",
    [PhonemeType.VoicedPalatalPlosive]: "ɟ",
    [PhonemeType.VoicelessVelarPlosive]: "k",
    [PhonemeType.VoicedVelarPlosive]: "ɡ",
    [PhonemeType.VoicelessUvularPlosive]: "q",
    [PhonemeType.VoicedUvularPlosive]: "ɢ",
    [PhonemeType.VoicelessGlottalPlosive]: "ʔ",
    [PhonemeType.VoicelessBilabialFricative]: "ɸ",
    [PhonemeType.VoicedBilabialFricative]: "β",
    [PhonemeType.VoicelessLabiodentalFricative]: "f",
    [PhonemeType.VoicedLabiodentalFricative]: "v",
    [PhonemeType.VoicelessDentalFricative]: "θ",
    [PhonemeType.VoicedDentalFricative]: "ð",
    [PhonemeType.VoicelessAlveolarFricative]: "s",
    [PhonemeType.VoicedAlveolarFricative]: "z",
    [PhonemeType.VoicelessPostalveolarFricative]: "ʃ",
    [PhonemeType.VoicedPostalveolarFricative]: "ʒ",
    [PhonemeType.VoicelessRetroflexFricative]: "ʂ",
    [PhonemeType.VoicedRetroflexFricative]: "ʐ",
    [PhonemeType.VoicelessPalatalFricative]: "ç",
    [PhonemeType.VoicedPalatalFricative]: "ʝ",
    [PhonemeType.VoicelessVelarFricative]: "x",
    [PhonemeType.VoicedVelarFricative]: "ɣ",
    [PhonemeType.VoicelessAlveoloPalatalFricative]: "ɕ",
    [PhonemeType.VoicedAlveoloPalatalFricative]: "ʑ",
    [PhonemeType.VoicelessUvularFricative]: "χ",
    [PhonemeType.VoicedUvularFricative]: "ʁ",
    [PhonemeType.VoicelessPharyngealFricative]: "ħ",
    [PhonemeType.VoicedPharyngealFricative]: "ʕ",
    [PhonemeType.VoicelessEpiglottalFricative]: "ʜ",
    [PhonemeType.VoicedEpiglottalFricative]: "ʢ",
    [PhonemeType.VoicelessLabialVelarFricative]: "ʍ",
    [PhonemeType.VoicelessGlottalFricative]: "h",
    [PhonemeType.VoicedGlottalFricative]: "ɦ",
    [PhonemeType.EpiglottalPlosive]: "ʡ",
    [PhonemeType.ClickBilabial]: "ʘ",
    [PhonemeType.ClickDental]: "ǀ",
    [PhonemeType.ClickPostAlveolar]: "ǃ",
    [PhonemeType.ClickPalatoAlveolar]: "ǂ",
    [PhonemeType.ClickAlveolarLateral]: "ǁ",
    [PhonemeType.ImplosiveBilabial]: "ɓ",
    [PhonemeType.ImplosiveDentalAlveolar]: "ɗ",
    [PhonemeType.ImplosivePalatal]: "ʄ",
    [PhonemeType.ImplosiveVelar]: "ɠ",
    [PhonemeType.ImplosiveUvular]: "ʛ",
    [PhonemeType.VoicelessAlveolarAffricate]: "t͡s",
    [PhonemeType.VoicedAlveolarAffricate]: "d͡z",
    [PhonemeType.VoicelessPostalveolarAffricate]: "t͡ʃ",
    [PhonemeType.VoicedPostalveolarAffricate]: "d͡ʒ",
    // [PhonemeType.VoicedLabioDentalApproximant]: "ʋ", // Duplicate, removed
    [PhonemeType.VoicedAlveolarApproximant]: "ɹ",
    [PhonemeType.VoicedRetroflexApproximant]: "ɻ",
    [PhonemeType.VoicedPalatalApproximant]: "j",
    [PhonemeType.VoicedLabialPalatalApproximant]: "ɥ",
    // [PhonemeType.VoicedLabioVelarApproximant]: "w", // Duplicate, removed
    [PhonemeType.VoicedVelarApproximant]: "ɰ",
    [PhonemeType.VoicedBilabialTrill]: "ʙ",
    [PhonemeType.VoicedAlveolarTrill]: "r",
    [PhonemeType.VoicedUvularTrill]: "ʀ",
    [PhonemeType.Voicedlabiodentalflap]: "ⱱ",
    [PhonemeType.VoicedAlveolarTap]: "ɾ",
    [PhonemeType.VoicedRetroflexTap]: "ɽ",
    [PhonemeType.VoicedAlveolarLateralFlap]: "ɺ",
    [PhonemeType.VoicelessAlveolarLateralFricative]: "ɬ",
    [PhonemeType.VoicedAlveolarLateralFricative]: "ɮ",
    [PhonemeType.VoicedAlveolarLateralApproximant]: "l",
    [PhonemeType.VoicedRetroflexLateralApproximant]: "ɭ",
    // [PhonemeType.VoicedPalatalLateralApproximant]: "ʎ", // Duplicate, removed
    // [PhonemeType.VoicedVelarLateralApproximant]: "ʟ", // Duplicate, removed
    // Other (coarticulated/special)
    [PhonemeType.VoicelessPalatalVelarFricative]: "ɧ",
    [PhonemeType.VoicelessAlveolarLateralAffricate]: "t͡ɬ",
    [PhonemeType.VoicedAlveolarLateralAffricate]: "d͡ɮ",
    [PhonemeType.VoicelessDarkL]: "ɫ̥",
    [PhonemeType.VoicedDarkL]: "ɫ",
    [PhonemeType.VoicelessLabialPalatalApproximant]: "ɥ̊",
    [PhonemeType.CloseFrontUnroundedVowel]: "i",
    [PhonemeType.CloseFrontRoundedVowel]: "y",
    [PhonemeType.CloseCentralUnroundedVowel]: "ɨ",
    [PhonemeType.CloseCentralRoundedVowel]: "ʉ",
    [PhonemeType.CloseBackUnroundedVowel]: "ɯ",
    [PhonemeType.CloseBackRoundedVowel]: "u",
    [PhonemeType.NearCloseNearFrontUnroundedVowel]: "ɪ",
    [PhonemeType.NearCloseNearFrontRoundedVowel]: "ʏ",
    [PhonemeType.NearCloseNearBackRoundedVowel]: "ʊ",
    [PhonemeType.CloseMidFrontUnroundedVowel]: "e",
    [PhonemeType.CloseMidFrontRoundedVowel]: "ø",
    [PhonemeType.MidCentralVowel]: "ə",
    [PhonemeType.OpenMidFrontUnroundedVowel]: "ɛ",
    [PhonemeType.OpenMidFrontRoundedVowel]: "œ",
    [PhonemeType.OpenMidBackUnroundedVowel]: "ʌ",
    [PhonemeType.OpenMidBackRoundedVowel]: "ɔ",
    [PhonemeType.NearOpenFrontUnroundedVowel]: "æ",
    [PhonemeType.OpenFrontUnroundedVowel]: "a",
    [PhonemeType.OpenBackUnroundedVowel]: "ɑ",
    [PhonemeType.OpenBackRoundedVowel]: "ɒ",
    [PhonemeType.VoicedLabioDentalApproximant]: "ʋ",
    [PhonemeType.VoicedLabioDentalFricative]: "v",
    [PhonemeType.VoicelessLabioDentalFricative]: "f",
    [PhonemeType.VoicedLabioDentalNasal]: "ɱ",
    [PhonemeType.VoicedLabioVelarApproximant]: "w",
    [PhonemeType.VoicedPalatalLateralApproximant]: "ʎ",
    [PhonemeType.VoicedVelarLateralApproximant]: "ʟ",
    [PhonemeType.VoicedPostAlveolarSibilantFricative]: "ʒ",
    [PhonemeType.VoicelessPostAlveolarSibilantFricative]: "ʃ",
  };

  private static readonly phonemeToRarity: Partial<Record<PhonemeType, number>> = {
    [PhonemeType.VoicedBilabialNasal]: 1,
    [PhonemeType.VoicedLabiodentalNasal]: 3,
    [PhonemeType.VoicedAlveolarNasal]: 1,
    [PhonemeType.VoicedRetroflexNasal]: 4,
    [PhonemeType.VoicedPalatalNasal]: 3,
    [PhonemeType.VoicedVelarNasal]: 2,
    [PhonemeType.VoicedUvularNasal]: 5,
    [PhonemeType.VoicelessBilabialPlosive]: 1,
    [PhonemeType.VoicedBilabialPlosive]: 1,
    [PhonemeType.VoicelessAlveolarPlosive]: 1,
    [PhonemeType.VoicedAlveolarPlosive]: 1,
    [PhonemeType.VoicelessRetroflexPlosive]: 4,
    [PhonemeType.VoicedRetroflexPlosive]: 4,
    [PhonemeType.VoicelessPalatalPlosive]: 5,
    [PhonemeType.VoicedPalatalPlosive]: 5,
    [PhonemeType.VoicelessVelarPlosive]: 1,
    [PhonemeType.VoicedVelarPlosive]: 1,
    [PhonemeType.VoicelessUvularPlosive]: 5,
    [PhonemeType.VoicedUvularPlosive]: 5,
    [PhonemeType.VoicelessGlottalPlosive]: 3,
    [PhonemeType.VoicelessBilabialFricative]: 4,
    [PhonemeType.VoicedBilabialFricative]: 4,
    [PhonemeType.VoicelessLabiodentalFricative]: 1,
    [PhonemeType.VoicedLabiodentalFricative]: 1,
    [PhonemeType.VoicelessDentalFricative]: 2,
    [PhonemeType.VoicedDentalFricative]: 2,
    [PhonemeType.VoicelessAlveolarFricative]: 1,
    [PhonemeType.VoicedAlveolarFricative]: 1,
    [PhonemeType.VoicelessPostalveolarFricative]: 2,
    [PhonemeType.VoicedPostalveolarFricative]: 2,
    [PhonemeType.VoicelessRetroflexFricative]: 4,
    [PhonemeType.VoicedRetroflexFricative]: 4,
    [PhonemeType.VoicelessPalatalFricative]: 4,
    [PhonemeType.VoicedPalatalFricative]: 4,
    [PhonemeType.VoicelessVelarFricative]: 2,
    [PhonemeType.VoicedVelarFricative]: 2,
    [PhonemeType.VoicelessAlveoloPalatalFricative]: 4,
    [PhonemeType.VoicedAlveoloPalatalFricative]: 4,
    [PhonemeType.VoicelessUvularFricative]: 4,
    [PhonemeType.VoicedUvularFricative]: 4,
    [PhonemeType.VoicelessPharyngealFricative]: 5,
    [PhonemeType.VoicedPharyngealFricative]: 5,
    [PhonemeType.VoicelessEpiglottalFricative]: 5,
    [PhonemeType.VoicedEpiglottalFricative]: 5,
    [PhonemeType.VoicelessLabialVelarFricative]: 4,
    [PhonemeType.VoicelessGlottalFricative]: 1,
    [PhonemeType.VoicedGlottalFricative]: 3,
    [PhonemeType.EpiglottalPlosive]: 5,
    [PhonemeType.ClickBilabial]: 5,
    [PhonemeType.ClickDental]: 5,
    [PhonemeType.ClickPostAlveolar]: 5,
    [PhonemeType.ClickPalatoAlveolar]: 5,
    [PhonemeType.ClickAlveolarLateral]: 5,
    [PhonemeType.ImplosiveBilabial]: 4,
    [PhonemeType.ImplosiveDentalAlveolar]: 4,
    [PhonemeType.ImplosivePalatal]: 5,
    [PhonemeType.ImplosiveVelar]: 4,
    [PhonemeType.ImplosiveUvular]: 5,
    [PhonemeType.VoicelessAlveolarAffricate]: 2,
    [PhonemeType.VoicedAlveolarAffricate]: 2,
    [PhonemeType.VoicelessPostalveolarAffricate]: 2,
    [PhonemeType.VoicedPostalveolarAffricate]: 2,
    [PhonemeType.VoicedAlveolarApproximant]: 2,
    [PhonemeType.VoicedRetroflexApproximant]: 4,
    [PhonemeType.VoicedPalatalApproximant]: 1,
    [PhonemeType.VoicedLabialPalatalApproximant]: 3,
    [PhonemeType.VoicedVelarApproximant]: 4,
    [PhonemeType.VoicedBilabialTrill]: 5,
    [PhonemeType.VoicedAlveolarTrill]: 2,
    [PhonemeType.VoicedUvularTrill]: 4,
    [PhonemeType.Voicedlabiodentalflap]: 5,
    [PhonemeType.VoicedAlveolarTap]: 2,
    [PhonemeType.VoicedRetroflexTap]: 5,
    [PhonemeType.VoicedAlveolarLateralFlap]: 3,
    [PhonemeType.VoicelessAlveolarLateralFricative]: 5,
    [PhonemeType.VoicedAlveolarLateralFricative]: 5,
    [PhonemeType.VoicedAlveolarLateralApproximant]: 1,
    [PhonemeType.VoicedRetroflexLateralApproximant]: 4,
    [PhonemeType.VoicedPalatalLateralApproximant]: 5,
    [PhonemeType.VoicedVelarLateralApproximant]: 5,
    [PhonemeType.VoicelessPalatalVelarFricative]: 5,
    [PhonemeType.VoicelessAlveolarLateralAffricate]: 5,
    [PhonemeType.VoicedAlveolarLateralAffricate]: 5,
    [PhonemeType.VoicelessDarkL]: 5,
    [PhonemeType.VoicedDarkL]: 4,
    [PhonemeType.VoicelessLabialPalatalApproximant]: 5,
    [PhonemeType.CloseFrontUnroundedVowel]: 1,
    [PhonemeType.CloseFrontRoundedVowel]: 2,
    [PhonemeType.CloseCentralUnroundedVowel]: 4,
    [PhonemeType.CloseCentralRoundedVowel]: 5,
    [PhonemeType.CloseBackUnroundedVowel]: 4,
    [PhonemeType.CloseBackRoundedVowel]: 1,
    [PhonemeType.NearCloseNearFrontUnroundedVowel]: 1,
    [PhonemeType.NearCloseNearFrontRoundedVowel]: 3,
    [PhonemeType.NearCloseNearBackRoundedVowel]: 2,
    [PhonemeType.CloseMidFrontUnroundedVowel]: 1,
    [PhonemeType.CloseMidFrontRoundedVowel]: 2,
    [PhonemeType.MidCentralVowel]: 1,
    [PhonemeType.OpenMidFrontUnroundedVowel]: 2,
    [PhonemeType.OpenMidFrontRoundedVowel]: 3,
    [PhonemeType.OpenMidBackUnroundedVowel]: 3,
    [PhonemeType.OpenMidBackRoundedVowel]: 2,
    [PhonemeType.NearOpenFrontUnroundedVowel]: 2,
    [PhonemeType.OpenFrontUnroundedVowel]: 1,
    [PhonemeType.OpenBackUnroundedVowel]: 1,
    [PhonemeType.OpenBackRoundedVowel]: 3,
    [PhonemeType.VoicedLabioDentalApproximant]: 3,
    [PhonemeType.VoicedLabioDentalFricative]: 1,
    [PhonemeType.VoicelessLabioDentalFricative]: 1,
    [PhonemeType.VoicedLabioDentalNasal]: 3,
    [PhonemeType.VoicedLabioVelarApproximant]: 1,
    [PhonemeType.VoicedPostAlveolarSibilantFricative]: 2,
    [PhonemeType.VoicelessPostAlveolarSibilantFricative]: 2,
  };

  static getIPA(phoneme: PhonemeType): string | undefined {
    return this.phonemeToIPA[phoneme];
  }

  static getRarity(phoneme: PhonemeType): number | undefined {
    return this.phonemeToRarity[phoneme];
  }

  private static readonly flagToSymbol = new Map<bigint, string>([
    [PhoneticModification.Dental, "̪"],
    [PhoneticModification.Apical, "̺"],
    [PhoneticModification.Laminal, "̻"],
    [PhoneticModification.Linguolabial, "̼"],
    [PhoneticModification.Labialized, "ʷ"],
    [PhoneticModification.Palatalized, "ʲ"],
    [PhoneticModification.Velarized, "ˠ"],
    [PhoneticModification.Pharyngealized, "ˤ"],
    [PhoneticModification.Glottalized, "ˀ"],
    [PhoneticModification.MoreRounded, "̹"],
    [PhoneticModification.LessRounded, "̜"],
    [PhoneticModification.Advanced, "̟"],
    [PhoneticModification.Retracted, "̠"],
    [PhoneticModification.Centralized, "̈"],
    [PhoneticModification.MidCentralized, "̽"],
    [PhoneticModification.Voiceless, "̥"],
    [PhoneticModification.Voiced, "̬"],
    [PhoneticModification.BreathyVoiced, "̤"],
    [PhoneticModification.CreakyVoiced, "̰"],
    [PhoneticModification.Raised, "̝"],
    [PhoneticModification.Lowered, "̞"],
    [PhoneticModification.AdvancedTongueRoot, "̘"],
    [PhoneticModification.RetractedTongueRoot, "̙"],
    [PhoneticModification.NasalRelease, "ⁿ"],
    [PhoneticModification.LateralRelease, "ˡ"],
    [PhoneticModification.NoAudibleRelease, "̚"],
    [PhoneticModification.Syllabic, "̩"],
    [PhoneticModification.NonSyllabic, "̯"],
    [PhoneticModification.Aspirated, "ʰ"],
    [PhoneticModification.Nasalized, "̃"],
    [PhoneticModification.PrimaryStress, "ˈ"],
    [PhoneticModification.SecondaryStress, "ˌ"],
    [PhoneticModification.Long, "ː"],
    [PhoneticModification.HalfLong, "ˑ"],
    [PhoneticModification.ExtraShort, "̆"],
    [PhoneticModification.Linking, "‿"],
    [PhoneticModification.MinorGroup, "|"],
    [PhoneticModification.MajorGroup, "‖"],
    [PhoneticModification.SyllableBreak, "."],
    [PhoneticModification.ToneExtraHigh, "˥"],
    [PhoneticModification.ToneHigh, "˦"],
    [PhoneticModification.ToneMid, "˧"],
    [PhoneticModification.ToneLow, "˨"],
    [PhoneticModification.ToneExtraLow, "˩"],
    [PhoneticModification.ToneRising, "˩˥"],
    [PhoneticModification.ToneFalling, "˥˩"],
    [PhoneticModification.ToneHighFalling, "˥˧˩"],
    [PhoneticModification.ToneLowRising, "˩˨˧"],
    [PhoneticModification.ToneRisingFalling, "˧˥˧"],
    [PhoneticModification.ToneFallingRising, "˥˩˦"],
  ]);

  private static readonly diacriticOrder: bigint[] = [
    PhoneticModification.Dental,
    PhoneticModification.Apical,
    PhoneticModification.Laminal,
    PhoneticModification.Linguolabial,
    PhoneticModification.Labialized,
    PhoneticModification.Palatalized,
    PhoneticModification.Velarized,
    PhoneticModification.Pharyngealized,
    PhoneticModification.Glottalized,
    PhoneticModification.MoreRounded,
    PhoneticModification.LessRounded,
    PhoneticModification.Advanced,
    PhoneticModification.Retracted,
    PhoneticModification.Centralized,
    PhoneticModification.MidCentralized,
    PhoneticModification.Voiceless,
    PhoneticModification.Voiced,
    PhoneticModification.BreathyVoiced,
    PhoneticModification.CreakyVoiced,
    PhoneticModification.Raised,
    PhoneticModification.Lowered,
    PhoneticModification.AdvancedTongueRoot,
    PhoneticModification.RetractedTongueRoot,
    PhoneticModification.NasalRelease,
    PhoneticModification.LateralRelease,
    PhoneticModification.NoAudibleRelease,
    PhoneticModification.Syllabic,
    PhoneticModification.NonSyllabic,
    PhoneticModification.Aspirated,
    PhoneticModification.Nasalized,
  ];

  private static readonly suprasegmentalOrder: bigint[] = [
    PhoneticModification.Long,
    PhoneticModification.HalfLong,
    PhoneticModification.ExtraShort,
    PhoneticModification.PrimaryStress,
    PhoneticModification.SecondaryStress,
    PhoneticModification.MinorGroup,
    PhoneticModification.MajorGroup,
    PhoneticModification.SyllableBreak,
    PhoneticModification.Linking,
  ];

  private static readonly toneLevelOrder: bigint[] = [
    PhoneticModification.ToneExtraHigh,
    PhoneticModification.ToneHigh,
    PhoneticModification.ToneMid,
    PhoneticModification.ToneLow,
    PhoneticModification.ToneExtraLow,
  ];

  private static readonly toneContourOrder: bigint[] = [
    PhoneticModification.ToneRising,
    PhoneticModification.ToneFalling,
    PhoneticModification.ToneHighFalling,
    PhoneticModification.ToneLowRising,
    PhoneticModification.ToneRisingFalling,
    PhoneticModification.ToneFallingRising,
  ];

  private static decodeBase64(input: string): string | null {
    try {
      if (typeof atob === "function") {
        // Preserve UTF-8 characters
        const decoded = atob(input);
        return decodeURIComponent(
          decoded
            .split("")
            .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
            .join("")
        );
      }
      // Node/browserless fallback
      if (typeof (globalThis as unknown as { Buffer?: any }).Buffer !== "undefined") {
        const buf = (globalThis as unknown as { Buffer: any }).Buffer;
        return buf.from(input, "base64").toString("utf-8");
      }
      return null;
    } catch (_err) {
      return null;
    }
  }

  private static decodeHex(input: string): string | null {
    if (input.length % 2 !== 0 || /[^0-9a-f]/i.test(input)) return null;
    try {
      let out = "";
      for (let i = 0; i < input.length; i += 2) {
        out += String.fromCharCode(parseInt(input.slice(i, i + 2), 16));
      }
      return out;
    } catch (_err) {
      return null;
    }
  }

  private static decodeHashPayload(encoded: string, fallbackBase: string): { base: string; flags: bigint } | null {
    const base64 = this.decodeBase64(encoded);
    const raw = base64 ?? this.decodeHex(encoded);
    if (!raw) return null;
    const [base, rawFlags] = raw.split("|");
    const baseId = base || fallbackBase;
    try {
      const flags = BigInt(rawFlags ?? "0");
      return { base: baseId, flags };
    } catch (_err) {
      return { base: baseId, flags: 0n };
    }
  }

  static parsePhonemeHash(hash: string): { phoneme: string; flags: bigint } | undefined {
    if (!hash.includes("#")) return undefined;
    const [basePart, encoded] = hash.split("#");
    const decoded = this.decodeHashPayload(encoded, basePart);
    if (!decoded) return undefined;
    return { phoneme: decoded.base, flags: decoded.flags };
  }

  private static collectSymbols(flags: bigint, order: bigint[]): string {
    const symbols: string[] = [];
    order.forEach((flag) => {
      if ((flags & flag) === flag) {
        const sym = this.flagToSymbol.get(flag);
        if (sym) symbols.push(sym);
      }
    });
    return symbols.join("");
  }

  static buildPhonemSymbol(hash: string): string | undefined {
    if (!hash || !hash.includes("#")) return undefined;
    const [basePart, encoded] = hash.split("#");
    if (!encoded) return undefined;

    const decoded = this.decodeHashPayload(encoded, basePart);
    const basePhoneme = decoded?.base || basePart;
    const flags = decoded?.flags ?? 0n;

    const baseSymbol = this.getIPA(basePhoneme as PhonemeType) || basePhoneme;
    const diacritics = this.collectSymbols(flags, this.diacriticOrder);
    const suprasegmentals = this.collectSymbols(flags, this.suprasegmentalOrder);
    const toneLevel = this.collectSymbols(flags, this.toneLevelOrder);
    const toneContour = this.collectSymbols(flags, this.toneContourOrder);

    const combined = `${baseSymbol}${diacritics}${suprasegmentals}${toneLevel}${toneContour}`;
    return combined || undefined;
  }

  // ============================================================================
  // PHONETIC FEATURE VECTORS
  // ============================================================================

  /**
   * Get metadata for a phoneme (category, manner, place, height, backness)
   */
  static getPhonemeMetadata(phoneme: PhonemeType): {
    category: 'consonant' | 'vowel';
    manner?: string;
    place?: string;
    height?: string;
    backness?: string;
  } | undefined {
    return this.phonemeMeta[phoneme];
  }

  /**
   * Feature mapping for consonants: manner × place → feature vector
   * Based on distinctive feature theory (SPE + contemporary features)
   * 
   * Only consonants are implemented initially
   */
  private static readonly CONSONANT_BASE_FEATURES: Record<string, Record<string, number>> = {
    // PLOSIVES (stops): [-continuant, -sonorant, +consonantal]
    'plosive': {
      'bilabial': PhoneticFeature.Consonantal | PhoneticFeature.Labial | PhoneticFeature.Anterior,
      'labiodental': PhoneticFeature.Consonantal | PhoneticFeature.Labial | PhoneticFeature.Anterior,
      'dental': PhoneticFeature.Consonantal | PhoneticFeature.Coronal | PhoneticFeature.Anterior | PhoneticFeature.Distributed,
      'alveolar': PhoneticFeature.Consonantal | PhoneticFeature.Coronal | PhoneticFeature.Anterior,
      'postalveolar': PhoneticFeature.Consonantal | PhoneticFeature.Coronal,
      'retroflex': PhoneticFeature.Consonantal | PhoneticFeature.Coronal,
      'palatal': PhoneticFeature.Consonantal | PhoneticFeature.Dorsal | PhoneticFeature.High,
      'velar': PhoneticFeature.Consonantal | PhoneticFeature.Dorsal | PhoneticFeature.High | PhoneticFeature.Back,
      'uvular': PhoneticFeature.Consonantal | PhoneticFeature.Dorsal | PhoneticFeature.Back,
      'pharyngeal': PhoneticFeature.Consonantal,
      'glottal': PhoneticFeature.Consonantal | PhoneticFeature.ConstrictedGlottis,
      'labio-velar': PhoneticFeature.Consonantal | PhoneticFeature.Labial | PhoneticFeature.Dorsal,
    },
    
    // NASALS: [+nasal, +sonorant, +consonantal, +voice]
    'nasal': {
      'bilabial': PhoneticFeature.Consonantal | PhoneticFeature.Sonorant | PhoneticFeature.Nasal | PhoneticFeature.Voice | PhoneticFeature.Labial | PhoneticFeature.Anterior,
      'labiodental': PhoneticFeature.Consonantal | PhoneticFeature.Sonorant | PhoneticFeature.Nasal | PhoneticFeature.Voice | PhoneticFeature.Labial | PhoneticFeature.Anterior,
      'dental': PhoneticFeature.Consonantal | PhoneticFeature.Sonorant | PhoneticFeature.Nasal | PhoneticFeature.Voice | PhoneticFeature.Coronal | PhoneticFeature.Anterior | PhoneticFeature.Distributed,
      'alveolar': PhoneticFeature.Consonantal | PhoneticFeature.Sonorant | PhoneticFeature.Nasal | PhoneticFeature.Voice | PhoneticFeature.Coronal | PhoneticFeature.Anterior,
      'retroflex': PhoneticFeature.Consonantal | PhoneticFeature.Sonorant | PhoneticFeature.Nasal | PhoneticFeature.Voice | PhoneticFeature.Coronal,
      'palatal': PhoneticFeature.Consonantal | PhoneticFeature.Sonorant | PhoneticFeature.Nasal | PhoneticFeature.Voice | PhoneticFeature.Dorsal | PhoneticFeature.High,
      'velar': PhoneticFeature.Consonantal | PhoneticFeature.Sonorant | PhoneticFeature.Nasal | PhoneticFeature.Voice | PhoneticFeature.Dorsal | PhoneticFeature.High | PhoneticFeature.Back,
      'uvular': PhoneticFeature.Consonantal | PhoneticFeature.Sonorant | PhoneticFeature.Nasal | PhoneticFeature.Voice | PhoneticFeature.Dorsal | PhoneticFeature.Back,
    },
    
    // FRICATIVES: [+continuant, -sonorant, +consonantal]
    'fricative': {
      'bilabial': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Labial | PhoneticFeature.Anterior,
      'labiodental': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Labial | PhoneticFeature.Anterior,
      'dental': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Coronal | PhoneticFeature.Anterior | PhoneticFeature.Distributed,
      'alveolar': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Coronal | PhoneticFeature.Anterior | PhoneticFeature.Strident,
      'postalveolar': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Coronal | PhoneticFeature.Strident,
      'retroflex': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Coronal,
      'palatal': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Dorsal | PhoneticFeature.High,
      'velar': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Dorsal | PhoneticFeature.High | PhoneticFeature.Back,
      'uvular': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Dorsal | PhoneticFeature.Back,
      'pharyngeal': PhoneticFeature.Consonantal | PhoneticFeature.Continuant,
      'glottal': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.SpreadGlottis,
    },
    
    // APPROXIMANTS: [+continuant, +sonorant, +consonantal, +voice]
    'approximant': {
      'bilabial': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Labial | PhoneticFeature.Anterior,
      'labiodental': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Labial | PhoneticFeature.Anterior,
      'alveolar': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Coronal | PhoneticFeature.Anterior,
      'retroflex': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Coronal,
      'palatal': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Dorsal | PhoneticFeature.High,
      'velar': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Dorsal | PhoneticFeature.High | PhoneticFeature.Back,
      'labio-velar': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Labial | PhoneticFeature.Dorsal,
    },
    
    // TRILLS: [+consonantal, +sonorant, +trill, +voice]
    'trill': {
      'bilabial': PhoneticFeature.Consonantal | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Trill | PhoneticFeature.Labial | PhoneticFeature.Anterior,
      'alveolar': PhoneticFeature.Consonantal | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Trill | PhoneticFeature.Coronal | PhoneticFeature.Anterior,
      'uvular': PhoneticFeature.Consonantal | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Trill | PhoneticFeature.Dorsal | PhoneticFeature.Back,
    },
    
    // TAP/FLAP: [+consonantal, +sonorant, +voice] (brief contact)
    'tap': {
      'alveolar': PhoneticFeature.Consonantal | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Coronal | PhoneticFeature.Anterior,
      'retroflex': PhoneticFeature.Consonantal | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Coronal,
    },
    'flap': {
      'labiodental': PhoneticFeature.Consonantal | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Labial | PhoneticFeature.Anterior,
      'alveolar': PhoneticFeature.Consonantal | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Coronal | PhoneticFeature.Anterior,
    },
    
    // LATERAL FRICATIVES: [+lateral, +continuant, +consonantal, -sonorant]
    'lateral fricative': {
      'alveolar': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Lateral | PhoneticFeature.Coronal | PhoneticFeature.Anterior,
    },
    
    // LATERAL APPROXIMANTS: [+lateral, +continuant, +sonorant, +consonantal, +voice]
    'lateral approximant': {
      'alveolar': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Lateral | PhoneticFeature.Coronal | PhoneticFeature.Anterior,
      'retroflex': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Lateral | PhoneticFeature.Coronal,
      'palatal': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Lateral | PhoneticFeature.Dorsal | PhoneticFeature.High,
      'velar': PhoneticFeature.Consonantal | PhoneticFeature.Continuant | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Lateral | PhoneticFeature.Dorsal | PhoneticFeature.High | PhoneticFeature.Back,
    },
  };

  /**
   * Feature mapping for vowels: height × backness → feature vector
   * Base: [-consonantal, +syllabic, +sonorant, +voice]
   * Never include place of articulation traits (Labial, Coronal, Dorsal, Anterior)
   */
  private static readonly VOWEL_BASE_FEATURES: Record<string, Record<string, number>> = {
    // CLOSE vowels: [+high, -low]
    'close': {
      'front': PhoneticFeature.Syllabic | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.High,
      'central': PhoneticFeature.Syllabic | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.High,
      'back': PhoneticFeature.Syllabic | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.High | PhoneticFeature.Back,
    },
    
    // NEAR-CLOSE vowels: [+high, -low] (slightly lower)
    'near-close': {
      'front': PhoneticFeature.Syllabic | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.High,
      'central': PhoneticFeature.Syllabic | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.High,
      'back': PhoneticFeature.Syllabic | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.High | PhoneticFeature.Back,
    },
    
    // CLOSE-MID vowels: [+high, -low]
    'close-mid': {
      'front': PhoneticFeature.Syllabic | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.High,
      'central': PhoneticFeature.Syllabic | PhoneticFeature.Sonorant | PhoneticFeature.Voice,
      'back': PhoneticFeature.Syllabic | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Back,
    },
    
    // MID vowels: neutral height
    'mid': {
      'central': PhoneticFeature.Syllabic | PhoneticFeature.Sonorant | PhoneticFeature.Voice,
    },
    
    // OPEN-MID vowels: [-high, -low]
    'open-mid': {
      'front': PhoneticFeature.Syllabic | PhoneticFeature.Sonorant | PhoneticFeature.Voice,
      'central': PhoneticFeature.Syllabic | PhoneticFeature.Sonorant | PhoneticFeature.Voice,
      'back': PhoneticFeature.Syllabic | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Back,
    },
    
    // NEAR-OPEN vowels: [+low, -high]
    'near-open': {
      'front': PhoneticFeature.Syllabic | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Low,
      'central': PhoneticFeature.Syllabic | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Low,
    },
    
    // OPEN vowels: [+low, -high]
    'open': {
      'front': PhoneticFeature.Syllabic | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Low,
      'central': PhoneticFeature.Syllabic | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Low,
      'back': PhoneticFeature.Syllabic | PhoneticFeature.Sonorant | PhoneticFeature.Voice | PhoneticFeature.Low | PhoneticFeature.Back,
    },
  };

  /**
   * Tone feature mappings
   * Maps tone strings to feature bits
   */
  private static readonly TONE_FEATURE_MODIFIERS: Record<string, number> = {
    'extra-high': PhoneticFeature.ToneHigh,
    'high': PhoneticFeature.ToneHigh,
    'mid': 0, // Neutral tone = no tone feature
    'low': PhoneticFeature.ToneLow,
    'extra-low': PhoneticFeature.ToneLow,
    'rising': PhoneticFeature.ToneRising,
    'falling': PhoneticFeature.ToneFalling,
    'high-falling': PhoneticFeature.ToneFalling,
    'low-rising': PhoneticFeature.ToneRising,
    'rising-falling': PhoneticFeature.ToneContour,
    'falling-rising': PhoneticFeature.ToneContour,
  };

  /**
   * Diacritic modifications to feature vectors
   * Maps diacritic strings to feature changes
   */
  private static readonly DIACRITIC_FEATURE_MODIFIERS: Record<string, { add?: number; remove?: number }> = {
    // Voicing
    'Voiceless': { add: PhoneticFeature.SpreadGlottis, remove: PhoneticFeature.Voice },
    'Voiced': { add: PhoneticFeature.Voice, remove: PhoneticFeature.SpreadGlottis },
    
    // Aspiration & Laryngeals
    'Aspirated': { add: PhoneticFeature.SpreadGlottis },
    'Glottalized': { add: PhoneticFeature.ConstrictedGlottis },
    'BreathyVoiced': { add: PhoneticFeature.Voice | PhoneticFeature.SlackVocalCords },
    'CreakyVoiced': { add: PhoneticFeature.Voice | PhoneticFeature.ConstrictedGlottis },
    
    // Nasalization
    'Nasalized': { add: PhoneticFeature.Nasal },
    
    // Secondary Articulations
    'Labialized': { add: PhoneticFeature.Labial | PhoneticFeature.Round },
    'Palatalized': { add: PhoneticFeature.Dorsal | PhoneticFeature.High },
    'Velarized': { add: PhoneticFeature.Dorsal | PhoneticFeature.Back },
    'Pharyngealized': { add: PhoneticFeature.Tense },
    
    // Roundness (vowels)
    'MoreRounded': { add: PhoneticFeature.Round },
    'LessRounded': { remove: PhoneticFeature.Round },
    
    // Stress
    'primary-stress': { add: PhoneticFeature.Stress },
    'secondary-stress': { add: PhoneticFeature.Stress },
    
    // Length
    'long': { add: PhoneticFeature.Long },
    'half-long': { add: PhoneticFeature.Long },
    'extra-short': { remove: PhoneticFeature.Long },
  };

  /**
   * Compute the phonetic feature vector for a phoneme instance
   * This should be called when creating or modifying a phoneme
   * 
   * @param instance The phoneme instance to compute features for
   * @returns 32-bit feature vector
   */
  static computeFeatureVector(instance: PhonemeInstance): number {
    let vector = 0;

    // Step 1: Get base features from manner and place (consonants) or height and backness (vowels)
    if (instance.type === 'consonant' && instance.manner && instance.place) {
      const mannerKey = instance.manner.toLowerCase();
      const placeKey = instance.place.toLowerCase();
      
      const mannerMap = this.CONSONANT_BASE_FEATURES[mannerKey];
      if (mannerMap) {
        vector = mannerMap[placeKey] || 0;
      }
    } else if (instance.type === 'vowel' && instance.height && instance.backness) {
      const heightKey = instance.height.toLowerCase();
      const backnessKey = instance.backness.toLowerCase();
      
      const heightMap = this.VOWEL_BASE_FEATURES[heightKey];
      if (heightMap) {
        vector = heightMap[backnessKey] || 0;
      }
    }

    // Step 2: Add voicing from phoneme name if present (for consonants)
    if (instance.type === 'consonant') {
      const phonemeName = instance.phoneme as string;
      if (phonemeName.toLowerCase().includes('voiced') && !phonemeName.toLowerCase().includes('voiceless')) {
        vector |= PhoneticFeature.Voice;
      } else if (phonemeName.toLowerCase().includes('voiceless')) {
        vector &= ~PhoneticFeature.Voice;
        vector |= PhoneticFeature.SpreadGlottis;
      }
    }

    // Step 3: Apply diacritic modifications
    if (instance.diacritics && instance.diacritics.length > 0) {
      for (const diacritic of instance.diacritics) {
        const modifier = this.DIACRITIC_FEATURE_MODIFIERS[diacritic];
        if (modifier) {
          if (modifier.add) vector |= modifier.add;
          if (modifier.remove) vector &= ~modifier.remove;
        }
      }
    }

    // Step 4: Add tone features if tone level is present (typically for vowels/syllables)
    // This would come from phoneme tonal information
    // For now, tone support is in the diacritics system

    return vector;
  }

  /**
   * Check if a phoneme has a specific feature
   */
  static hasFeature(vector: number, feature: PhoneticFeature): boolean {
    return (vector & feature) === feature;
  }

  /**
   * Check if a phoneme matches ALL required features
   */
  static matchesAllFeatures(vector: number, features: PhoneticFeature[]): boolean {
    return features.every(f => this.hasFeature(vector, f));
  }

  /**
   * Check if a phoneme matches ANY of the given features
   */
  static matchesAnyFeature(vector: number, features: PhoneticFeature[]): boolean {
    return features.some(f => this.hasFeature(vector, f));
  }

  /**
   * Get human-readable description of features
   * Returns array of feature names like ['+voice', '+coronal', '-continuant']
   */
  static describeFeatures(vector: number): string[] {
    const features: string[] = [];
    
    // Check each feature bit
    Object.entries(FEATURE_NAMES).forEach(([bitValue, name]) => {
      const featureBit = parseInt(bitValue);
      if (this.hasFeature(vector, featureBit)) {
        features.push(`+${name}`);
      }
    });

    return features;
  }

  /**
   * Find all phonemes in inventory matching a set of features (natural class)
   * 
   * @param inventory All phonemes to search
   * @param requiredFeatures Features that must all be present
   * @returns Matching phonemes
   */
  static findPhonemesWithFeatures(
    inventory: PhonemeInstance[], 
    requiredFeatures: PhoneticFeature[]
  ): PhonemeInstance[] {
    return inventory.filter(p => {
      const vector = p.features?.featureVector || 0;
      return this.matchesAllFeatures(vector, requiredFeatures);
    });
  }

  /**
   * Get or compute featureVector for a phoneme.
   * If the phoneme already has a featureVector, return it.
   * If not, compute it on-demand (for phonemes loaded from older JSON).
   * 
   * @param instance Phoneme to get features for
   * @returns 32-bit feature vector
   */
  static getOrComputeFeatureVector(instance: PhonemeInstance): number {
    // Return existing vector if available
    if (instance.features?.featureVector !== undefined) {
      return instance.features.featureVector;
    }
    // Compute on-demand if missing
    return this.computeFeatureVector(instance);
  }
}
