import { PhonemeType, PhoneticModification } from "../types";

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
    [PhonemeType.VoicelessUvularFricative]: { category: 'consonant', manner: 'fricative', place: 'uvular' },
    [PhonemeType.VoicedUvularFricative]: { category: 'consonant', manner: 'fricative', place: 'uvular' },
    [PhonemeType.VoicelessPharyngealFricative]: { category: 'consonant', manner: 'fricative', place: 'pharyngeal' },
    [PhonemeType.VoicedPharyngealFricative]: { category: 'consonant', manner: 'fricative', place: 'pharyngeal' },
    [PhonemeType.VoicelessGlottalFricative]: { category: 'consonant', manner: 'fricative', place: 'glottal' },
    [PhonemeType.VoicedGlottalFricative]: { category: 'consonant', manner: 'fricative', place: 'glottal' },
    // Approximants
    [PhonemeType.VoicedLabioDentalApproximant]: { category: 'consonant', manner: 'approximant', place: 'labiodental' },
    [PhonemeType.VoicedAlveolarApproximant]: { category: 'consonant', manner: 'approximant', place: 'alveolar' },
    [PhonemeType.VoicedRetroflexApproximant]: { category: 'consonant', manner: 'approximant', place: 'retroflex' },
    [PhonemeType.VoicedPalatalApproximant]: { category: 'consonant', manner: 'approximant', place: 'palatal' },
    [PhonemeType.VoicedLabioVelarApproximant]: { category: 'consonant', manner: 'approximant', place: 'labio-velar' },
    [PhonemeType.VoicedVelarApproximant]: { category: 'consonant', manner: 'approximant', place: 'velar' },
    // Trills, taps, flaps
    [PhonemeType.VoicedBilabialTrill]: { category: 'consonant', manner: 'trill', place: 'bilabial' },
    [PhonemeType.VoicedAlveolarTrill]: { category: 'consonant', manner: 'trill', place: 'alveolar' },
    [PhonemeType.VoicedUvularTrill]: { category: 'consonant', manner: 'trill', place: 'uvular' },
    [PhonemeType.Voicedlabiodentalflap]: { category: 'consonant', manner: 'flap', place: 'labiodental' },
    [PhonemeType.VoicedAlveolarTap]: { category: 'consonant', manner: 'tap', place: 'alveolar' },
    [PhonemeType.VoicedRetroflexTap]: { category: 'consonant', manner: 'tap', place: 'retroflex' },
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
    [PhonemeType.CloseFrontUnrounded]: { category: 'vowel', height: 'close', backness: 'front' },
    [PhonemeType.CloseFrontRounded]: { category: 'vowel', height: 'close', backness: 'front' },
    [PhonemeType.CloseCentralUnrounded]: { category: 'vowel', height: 'close', backness: 'central' },
    [PhonemeType.CloseCentralRounded]: { category: 'vowel', height: 'close', backness: 'central' },
    [PhonemeType.CloseBackUnrounded]: { category: 'vowel', height: 'close', backness: 'back' },
    [PhonemeType.CloseBackRounded]: { category: 'vowel', height: 'close', backness: 'back' },
    // Vowels (near-close)
    [PhonemeType.NearCloseFrontUnrounded]: { category: 'vowel', height: 'near-close', backness: 'front' },
    [PhonemeType.NearCloseFrontRounded]: { category: 'vowel', height: 'near-close', backness: 'front' },
    [PhonemeType.NearCloseBackRounded]: { category: 'vowel', height: 'near-close', backness: 'back' },
    // Vowels (close-mid)
    [PhonemeType.CloseMidFrontUnrounded]: { category: 'vowel', height: 'close-mid', backness: 'front' },
    [PhonemeType.CloseMidFrontRounded]: { category: 'vowel', height: 'close-mid', backness: 'front' },
    [PhonemeType.CloseMidCentralUnrounded]: { category: 'vowel', height: 'close-mid', backness: 'central' },
    [PhonemeType.CloseMidCentralRounded]: { category: 'vowel', height: 'close-mid', backness: 'central' },
    [PhonemeType.CloseMidBackUnrounded]: { category: 'vowel', height: 'close-mid', backness: 'back' },
    [PhonemeType.CloseMidBackRounded]: { category: 'vowel', height: 'close-mid', backness: 'back' },
    // Vowels (mid)
    [PhonemeType.MidCentral]: { category: 'vowel', height: 'mid', backness: 'central' },
    // Vowels (open-mid)
    [PhonemeType.OpenMidFrontUnrounded]: { category: 'vowel', height: 'open-mid', backness: 'front' },
    [PhonemeType.OpenMidFrontRounded]: { category: 'vowel', height: 'open-mid', backness: 'front' },
    [PhonemeType.OpenMidCentralUnrounded]: { category: 'vowel', height: 'open-mid', backness: 'central' },
    [PhonemeType.OpenMidCentralRounded]: { category: 'vowel', height: 'open-mid', backness: 'central' },
    [PhonemeType.OpenMidBackUnrounded]: { category: 'vowel', height: 'open-mid', backness: 'back' },
    [PhonemeType.OpenMidBackRounded]: { category: 'vowel', height: 'open-mid', backness: 'back' },
    // Vowels (near-open)
    [PhonemeType.NearOpenFrontUnrounded]: { category: 'vowel', height: 'near-open', backness: 'front' },
    [PhonemeType.NearOpenCentral]: { category: 'vowel', height: 'near-open', backness: 'central' },
    // Vowels (open)
    [PhonemeType.OpenFrontUnrounded]: { category: 'vowel', height: 'open', backness: 'front' },
    [PhonemeType.OpenFrontRounded]: { category: 'vowel', height: 'open', backness: 'front' },
    [PhonemeType.OpenBackUnrounded]: { category: 'vowel', height: 'open', backness: 'back' },
    [PhonemeType.OpenBackRounded]: { category: 'vowel', height: 'open', backness: 'back' },
    // Variant/doublon enum (C#)
    [PhonemeType.GlottalStop]: { category: 'consonant', manner: 'plosive', place: 'glottal' },
    [PhonemeType.LabiodentalApproximant]: { category: 'consonant', manner: 'approximant', place: 'labiodental' },
    [PhonemeType.AlveolarApproximant]: { category: 'consonant', manner: 'approximant', place: 'alveolar' },
    [PhonemeType.RetroflexApproximant]: { category: 'consonant', manner: 'approximant', place: 'retroflex' },
    [PhonemeType.PalatalApproximant]: { category: 'consonant', manner: 'approximant', place: 'palatal' },
    [PhonemeType.VelarApproximant]: { category: 'consonant', manner: 'approximant', place: 'velar' },
    [PhonemeType.BilabialTrill]: { category: 'consonant', manner: 'trill', place: 'bilabial' },
    [PhonemeType.AlveolarTrill]: { category: 'consonant', manner: 'trill', place: 'alveolar' },
    [PhonemeType.UvularTrill]: { category: 'consonant', manner: 'trill', place: 'uvular' },
    [PhonemeType.AlveolarTap]: { category: 'consonant', manner: 'tap', place: 'alveolar' },
    [PhonemeType.RetroflexTap]: { category: 'consonant', manner: 'tap', place: 'retroflex' },
    [PhonemeType.AlveolarLateralApproximant]: { category: 'consonant', manner: 'lateral approximant', place: 'alveolar' },
    [PhonemeType.RetroflexLateralApproximant]: { category: 'consonant', manner: 'lateral approximant', place: 'retroflex' },
    [PhonemeType.PalatalLateralApproximant]: { category: 'consonant', manner: 'lateral approximant', place: 'palatal' },
    [PhonemeType.VelarLateralApproximant]: { category: 'consonant', manner: 'lateral approximant', place: 'velar' },
    [PhonemeType.CloseFrontUnroundedVowel]: { category: 'vowel', height: 'close', backness: 'front' },
    [PhonemeType.CloseFrontRoundedVowel]: { category: 'vowel', height: 'close', backness: 'front' },
    [PhonemeType.CloseCentralUnroundedVowel]: { category: 'vowel', height: 'close', backness: 'central' },
    [PhonemeType.CloseCentralRoundedVowel]: { category: 'vowel', height: 'close', backness: 'central' },
    [PhonemeType.CloseBackUnroundedVowel]: { category: 'vowel', height: 'close', backness: 'back' },
    [PhonemeType.CloseBackRoundedVowel]: { category: 'vowel', height: 'close', backness: 'back' },
    [PhonemeType.NearCloseNearFrontUnroundedVowel]: { category: 'vowel', height: 'near-close', backness: 'front' },
    [PhonemeType.NearCloseNearFrontRoundedVowel]: { category: 'vowel', height: 'near-close', backness: 'front' },
    [PhonemeType.NearCloseNearBackRoundedVowel]: { category: 'vowel', height: 'near-close', backness: 'back' },
    [PhonemeType.CloseMidFrontUnroundedVowel]: { category: 'vowel', height: 'close-mid', backness: 'front' },
    [PhonemeType.CloseMidFrontRoundedVowel]: { category: 'vowel', height: 'close-mid', backness: 'front' },
    [PhonemeType.MidCentralVowel]: { category: 'vowel', height: 'mid', backness: 'central' },
    [PhonemeType.OpenMidFrontUnroundedVowel]: { category: 'vowel', height: 'open-mid', backness: 'front' },
    [PhonemeType.OpenMidFrontRoundedVowel]: { category: 'vowel', height: 'open-mid', backness: 'front' },
    [PhonemeType.OpenMidBackUnroundedVowel]: { category: 'vowel', height: 'open-mid', backness: 'back' },
    [PhonemeType.OpenMidBackRoundedVowel]: { category: 'vowel', height: 'open-mid', backness: 'back' },
    [PhonemeType.NearOpenFrontUnroundedVowel]: { category: 'vowel', height: 'near-open', backness: 'front' },
    [PhonemeType.OpenFrontUnroundedVowel]: { category: 'vowel', height: 'open', backness: 'front' },
    [PhonemeType.OpenBackUnroundedVowel]: { category: 'vowel', height: 'open', backness: 'back' },
    [PhonemeType.OpenBackRoundedVowel]: { category: 'vowel', height: 'open', backness: 'back' },
    // doublons supprimés, déjà définis plus haut
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
    [PhonemeType.VoicelessUvularFricative]: "χ",
    [PhonemeType.VoicedUvularFricative]: "ʁ",
    [PhonemeType.VoicelessPharyngealFricative]: "ħ",
    [PhonemeType.VoicedPharyngealFricative]: "ʕ",
    [PhonemeType.VoicelessGlottalFricative]: "h",
    [PhonemeType.VoicedGlottalFricative]: "ɦ",
    // [PhonemeType.VoicedLabioDentalApproximant]: "ʋ", // Duplicate, removed
    [PhonemeType.VoicedAlveolarApproximant]: "ɹ",
    [PhonemeType.VoicedRetroflexApproximant]: "ɻ",
    [PhonemeType.VoicedPalatalApproximant]: "j",
    // [PhonemeType.VoicedLabioVelarApproximant]: "w", // Duplicate, removed
    [PhonemeType.VoicedVelarApproximant]: "ɰ",
    [PhonemeType.VoicedBilabialTrill]: "ʙ",
    [PhonemeType.VoicedAlveolarTrill]: "r",
    [PhonemeType.VoicedUvularTrill]: "ʀ",
    [PhonemeType.Voicedlabiodentalflap]: "ⱱ",
    [PhonemeType.VoicedAlveolarTap]: "ɾ",
    [PhonemeType.VoicedRetroflexTap]: "ɽ",
    [PhonemeType.VoicelessAlveolarLateralFricative]: "ɬ",
    [PhonemeType.VoicedAlveolarLateralFricative]: "ɮ",
    [PhonemeType.VoicedAlveolarLateralApproximant]: "l",
    [PhonemeType.VoicedRetroflexLateralApproximant]: "ɭ",
    // [PhonemeType.VoicedPalatalLateralApproximant]: "ʎ", // Duplicate, removed
    // [PhonemeType.VoicedVelarLateralApproximant]: "ʟ", // Duplicate, removed
    [PhonemeType.CloseFrontUnrounded]: "i",
    [PhonemeType.CloseFrontRounded]: "y",
    [PhonemeType.CloseCentralUnrounded]: "ɨ",
    [PhonemeType.CloseCentralRounded]: "ʉ",
    [PhonemeType.CloseBackUnrounded]: "ɯ",
    [PhonemeType.CloseBackRounded]: "u",
    [PhonemeType.NearCloseFrontUnrounded]: "ɪ",
    [PhonemeType.NearCloseFrontRounded]: "ʏ",
    [PhonemeType.NearCloseBackRounded]: "ʊ",
    [PhonemeType.CloseMidFrontUnrounded]: "e",
    [PhonemeType.CloseMidFrontRounded]: "ø",
    [PhonemeType.MidCentral]: "ə",
    [PhonemeType.OpenMidFrontUnrounded]: "ɛ",
    [PhonemeType.OpenMidFrontRounded]: "œ",
    [PhonemeType.OpenMidBackUnrounded]: "ʌ",
    [PhonemeType.OpenMidBackRounded]: "ɔ",
    [PhonemeType.NearOpenFrontUnrounded]: "æ",
    [PhonemeType.OpenFrontUnrounded]: "a",
    [PhonemeType.OpenBackUnrounded]: "ɑ",
    [PhonemeType.OpenBackRounded]: "ɒ",
    // Ajout des variantes et doublons de l'enum (voir C#)
    [PhonemeType.GlottalStop]: "ʔ",
    [PhonemeType.LabiodentalApproximant]: "ʋ",
    [PhonemeType.AlveolarApproximant]: "ɹ",
    [PhonemeType.RetroflexApproximant]: "ɻ",
    [PhonemeType.PalatalApproximant]: "j",
    [PhonemeType.VelarApproximant]: "ɰ",
    [PhonemeType.BilabialTrill]: "ʙ",
    [PhonemeType.AlveolarTrill]: "r",
    [PhonemeType.UvularTrill]: "ʀ",
    [PhonemeType.AlveolarTap]: "ɾ",
    [PhonemeType.RetroflexTap]: "ɽ",
    [PhonemeType.AlveolarLateralApproximant]: "l",
    [PhonemeType.RetroflexLateralApproximant]: "ɭ",
    [PhonemeType.PalatalLateralApproximant]: "ʎ",
    [PhonemeType.VelarLateralApproximant]: "ʟ",
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
    [PhonemeType.OpenFrontRounded]: "ɶ",
    [PhonemeType.OpenMidCentralUnrounded]: "ɜ",
    [PhonemeType.OpenMidCentralRounded]: "ɞ",
    [PhonemeType.CloseMidCentralUnrounded]: "ɘ",
    [PhonemeType.CloseMidCentralRounded]: "ɵ",
    [PhonemeType.CloseMidBackUnrounded]: "ɤ",
    [PhonemeType.CloseMidBackRounded]: "o",
    [PhonemeType.NearOpenCentral]: "ɐ",
    // [PhonemeType.OpenFrontRounded]: "œ̃", // Duplicate, removed to fix TS1117
    [PhonemeType.VoicedLabioDentalApproximant]: "ʋ",
    [PhonemeType.VoicedLabioDentalFricative]: "v",
    [PhonemeType.VoicelessLabioDentalFricative]: "f",
    [PhonemeType.VoicedLabioDentalNasal]: "ɱ",
    [PhonemeType.VoicedLabioVelarApproximant]: "w",
    [PhonemeType.VoicedPalatalLateralApproximant]: "ʎ",
    [PhonemeType.VoicedVelarLateralApproximant]: "ʟ",
    [PhonemeType.VoicedPostAlveolarSibilantFricative]: "ʒ",
    [PhonemeType.VoicelessPostAlveolarSibilantFricative]: "ʃ",
    // [PhonemeType.Voicedlabiodentalflap]: "ⱱ", // Duplicate, removed
    // [PhonemeType.VoicelessGlottalPlosive]: "ʔ" // Duplicate, removed
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
    [PhonemeType.VoicelessUvularFricative]: 4,
    [PhonemeType.VoicedUvularFricative]: 4,
    [PhonemeType.VoicelessPharyngealFricative]: 5,
    [PhonemeType.VoicedPharyngealFricative]: 5,
    [PhonemeType.VoicelessGlottalFricative]: 1,
    [PhonemeType.VoicedGlottalFricative]: 3,
    // [PhonemeType.VoicedLabioDentalApproximant]: 3, // Duplicate, removed
    [PhonemeType.VoicedAlveolarApproximant]: 2,
    [PhonemeType.VoicedRetroflexApproximant]: 4,
    [PhonemeType.VoicedPalatalApproximant]: 1,
    // [PhonemeType.VoicedLabioVelarApproximant]: 1, // Duplicate, removed
    [PhonemeType.VoicedVelarApproximant]: 4,
    [PhonemeType.VoicedBilabialTrill]: 5,
    [PhonemeType.VoicedAlveolarTrill]: 2,
    [PhonemeType.VoicedUvularTrill]: 4,
    [PhonemeType.Voicedlabiodentalflap]: 5,
    [PhonemeType.VoicedAlveolarTap]: 2,
    [PhonemeType.VoicedRetroflexTap]: 5,
    [PhonemeType.VoicelessAlveolarLateralFricative]: 5,
    [PhonemeType.VoicedAlveolarLateralFricative]: 5,
    [PhonemeType.VoicedAlveolarLateralApproximant]: 1,
    [PhonemeType.VoicedRetroflexLateralApproximant]: 4,
    // [PhonemeType.VoicedPalatalLateralApproximant]: 5, // Duplicate, removed
    // [PhonemeType.VoicedVelarLateralApproximant]: 5, // Duplicate, removed
    [PhonemeType.CloseFrontUnrounded]: 1,
    [PhonemeType.CloseFrontRounded]: 2,
    [PhonemeType.CloseCentralUnrounded]: 4,
    [PhonemeType.CloseCentralRounded]: 5,
    [PhonemeType.CloseBackUnrounded]: 4,
    [PhonemeType.CloseBackRounded]: 1,
    [PhonemeType.NearCloseFrontUnrounded]: 1,
    [PhonemeType.NearCloseFrontRounded]: 3,
    [PhonemeType.NearCloseBackRounded]: 2,
    [PhonemeType.CloseMidFrontUnrounded]: 1,
    [PhonemeType.CloseMidFrontRounded]: 2,
    [PhonemeType.MidCentral]: 1,
    [PhonemeType.OpenMidFrontUnrounded]: 2,
    [PhonemeType.OpenMidFrontRounded]: 3,
    [PhonemeType.OpenMidBackUnrounded]: 3,
    [PhonemeType.OpenMidBackRounded]: 2,
    [PhonemeType.NearOpenFrontUnrounded]: 2,
    [PhonemeType.OpenFrontUnrounded]: 1,
    [PhonemeType.OpenBackUnrounded]: 1,
    [PhonemeType.OpenBackRounded]: 3,
    // Ajout des variantes et doublons de l'enum (voir C#)
    [PhonemeType.GlottalStop]: 3,
    [PhonemeType.LabiodentalApproximant]: 3,
    [PhonemeType.AlveolarApproximant]: 2,
    [PhonemeType.RetroflexApproximant]: 4,
    [PhonemeType.PalatalApproximant]: 1,
    [PhonemeType.VelarApproximant]: 4,
    [PhonemeType.BilabialTrill]: 5,
    [PhonemeType.AlveolarTrill]: 2,
    [PhonemeType.UvularTrill]: 4,
    [PhonemeType.AlveolarTap]: 2,
    [PhonemeType.RetroflexTap]: 5,
    [PhonemeType.AlveolarLateralApproximant]: 1,
    [PhonemeType.RetroflexLateralApproximant]: 4,
    [PhonemeType.PalatalLateralApproximant]: 5,
    [PhonemeType.VelarLateralApproximant]: 5,
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
    [PhonemeType.OpenFrontRounded]: 3,
    [PhonemeType.OpenMidCentralUnrounded]: 4,
    [PhonemeType.OpenMidCentralRounded]: 5,
    [PhonemeType.CloseMidCentralUnrounded]: 4,
    [PhonemeType.CloseMidCentralRounded]: 5,
    [PhonemeType.CloseMidBackUnrounded]: 4,
    [PhonemeType.CloseMidBackRounded]: 1,
    [PhonemeType.NearOpenCentral]: 2,
    // [PhonemeType.OpenFrontRounded]: 3, // Duplicate, removed to fix TS1117
    [PhonemeType.VoicedLabioDentalApproximant]: 3,
    [PhonemeType.VoicedLabioDentalFricative]: 1,
    [PhonemeType.VoicelessLabioDentalFricative]: 1,
    [PhonemeType.VoicedLabioDentalNasal]: 3,
    [PhonemeType.VoicedLabioVelarApproximant]: 1,
    [PhonemeType.VoicedPalatalLateralApproximant]: 5,
    [PhonemeType.VoicedVelarLateralApproximant]: 5,
    [PhonemeType.VoicedPostAlveolarSibilantFricative]: 2,
    [PhonemeType.VoicelessPostAlveolarSibilantFricative]: 2,
    // [PhonemeType.Voicedlabiodentalflap]: 5, // Duplicate, removed
    // [PhonemeType.VoicelessGlottalPlosive]: 3 // Duplicate, removed
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
}
