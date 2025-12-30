// Centralisation de la liste métier des phonèmes (PhonemeModel)
import { PhonemeModel } from '../types';

export const PHONEME_MODELS: PhonemeModel[] = [
  // Plosives
  { id: 'p', symbol: 'p', name: 'Voiceless Bilabial Plosive', category: 'consonant', features: { place: 'bilabial', manner: 'plosive' } },
  { id: 'b', symbol: 'b', name: 'Voiced Bilabial Plosive', category: 'consonant', features: { place: 'bilabial', manner: 'plosive' } },
  { id: 't', symbol: 't', name: 'Voiceless Alveolar Plosive', category: 'consonant', features: { place: 'alveolar', manner: 'plosive' } },
  { id: 'd', symbol: 'd', name: 'Voiced Alveolar Plosive', category: 'consonant', features: { place: 'alveolar', manner: 'plosive' } },
  { id: 'k', symbol: 'k', name: 'Voiceless Velar Plosive', category: 'consonant', features: { place: 'velar', manner: 'plosive' } },
  { id: 'g', symbol: 'g', name: 'Voiced Velar Plosive', category: 'consonant', features: { place: 'velar', manner: 'plosive' } },
  { id: 'ʔ', symbol: 'ʔ', name: 'Glottal Stop', category: 'consonant', features: { place: 'glottal', manner: 'plosive' } },
  // Nasals
  { id: 'm', symbol: 'm', name: 'Bilabial Nasal', category: 'consonant', features: { place: 'bilabial', manner: 'nasal' } },
  { id: 'n', symbol: 'n', name: 'Alveolar Nasal', category: 'consonant', features: { place: 'alveolar', manner: 'nasal' } },
  { id: 'ɲ', symbol: 'ɲ', name: 'Palatal Nasal', category: 'consonant', features: { place: 'palatal', manner: 'nasal' } },
  { id: 'ŋ', symbol: 'ŋ', name: 'Velar Nasal', category: 'consonant', features: { place: 'velar', manner: 'nasal' } },
  // Fricatives
  { id: 'f', symbol: 'f', name: 'Voiceless Labiodental Fricative', category: 'consonant', features: { place: 'labiodental', manner: 'fricative' } },
  { id: 'v', symbol: 'v', name: 'Voiced Labiodental Fricative', category: 'consonant', features: { place: 'labiodental', manner: 'fricative' } },
  { id: 's', symbol: 's', name: 'Voiceless Alveolar Fricative', category: 'consonant', features: { place: 'alveolar', manner: 'fricative' } },
  { id: 'z', symbol: 'z', name: 'Voiced Alveolar Fricative', category: 'consonant', features: { place: 'alveolar', manner: 'fricative' } },
  { id: 'ʃ', symbol: 'ʃ', name: 'Voiceless Postalveolar Fricative', category: 'consonant', features: { place: 'postalveolar', manner: 'fricative' } },
  { id: 'ʒ', symbol: 'ʒ', name: 'Voiced Postalveolar Fricative', category: 'consonant', features: { place: 'postalveolar', manner: 'fricative' } },
  { id: 'x', symbol: 'x', name: 'Voiceless Velar Fricative', category: 'consonant', features: { place: 'velar', manner: 'fricative' } },
  { id: 'ɣ', symbol: 'ɣ', name: 'Voiced Velar Fricative', category: 'consonant', features: { place: 'velar', manner: 'fricative' } },
  { id: 'h', symbol: 'h', name: 'Voiceless Glottal Fricative', category: 'consonant', features: { place: 'glottal', manner: 'fricative' } },
  // Approximants
  { id: 'j', symbol: 'j', name: 'Palatal Approximant', category: 'consonant', features: { place: 'palatal', manner: 'approximant' } },
  { id: 'w', symbol: 'w', name: 'Velar Approximant', category: 'consonant', features: { place: 'velar', manner: 'approximant' } },
  // Laterals
  { id: 'l', symbol: 'l', name: 'Alveolar Lateral Approximant', category: 'consonant', features: { place: 'alveolar', manner: 'lateral-approximant' } },
  // Trills
  { id: 'r', symbol: 'r', name: 'Alveolar Trill', category: 'consonant', features: { place: 'alveolar', manner: 'trill' } },
  // Taps/flaps
  { id: 'ɾ', symbol: 'ɾ', name: 'Alveolar Tap', category: 'consonant', features: { place: 'alveolar', manner: 'tap' } },

  // Vowels (height/backness)
  { id: 'i', symbol: 'i', name: 'Close Front Unrounded Vowel', category: 'vowel', features: { height: 'close', backness: 'front' } },
  { id: 'y', symbol: 'y', name: 'Close Front Rounded Vowel', category: 'vowel', features: { height: 'close', backness: 'front' } },
  { id: 'ɨ', symbol: 'ɨ', name: 'Close Central Unrounded Vowel', category: 'vowel', features: { height: 'close', backness: 'central' } },
  { id: 'ʉ', symbol: 'ʉ', name: 'Close Central Rounded Vowel', category: 'vowel', features: { height: 'close', backness: 'central' } },
  { id: 'u', symbol: 'u', name: 'Close Back Rounded Vowel', category: 'vowel', features: { height: 'close', backness: 'back' } },
  { id: 'ɯ', symbol: 'ɯ', name: 'Close Back Unrounded Vowel', category: 'vowel', features: { height: 'close', backness: 'back' } },
  { id: 'e', symbol: 'e', name: 'Close-mid Front Unrounded Vowel', category: 'vowel', features: { height: 'close-mid', backness: 'front' } },
  { id: 'ø', symbol: 'ø', name: 'Close-mid Front Rounded Vowel', category: 'vowel', features: { height: 'close-mid', backness: 'front' } },
  { id: 'ə', symbol: 'ə', name: 'Mid Central Vowel', category: 'vowel', features: { height: 'mid', backness: 'central' } },
  { id: 'o', symbol: 'o', name: 'Close-mid Back Rounded Vowel', category: 'vowel', features: { height: 'close-mid', backness: 'back' } },
  { id: 'ɔ', symbol: 'ɔ', name: 'Open-mid Back Rounded Vowel', category: 'vowel', features: { height: 'open-mid', backness: 'back' } },
  { id: 'ɛ', symbol: 'ɛ', name: 'Open-mid Front Unrounded Vowel', category: 'vowel', features: { height: 'open-mid', backness: 'front' } },
  { id: 'æ', symbol: 'æ', name: 'Near-open Front Unrounded Vowel', category: 'vowel', features: { height: 'near-open', backness: 'front' } },
  { id: 'a', symbol: 'a', name: 'Open Front Unrounded Vowel', category: 'vowel', features: { height: 'open', backness: 'front' } },
  { id: 'ɑ', symbol: 'ɑ', name: 'Open Back Unrounded Vowel', category: 'vowel', features: { height: 'open', backness: 'back' } },
  { id: 'ɒ', symbol: 'ɒ', name: 'Open Back Rounded Vowel', category: 'vowel', features: { height: 'open', backness: 'back' } },
];
