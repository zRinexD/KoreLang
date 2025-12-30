import { PhonemeModel, Manner, Place, Height, Backness } from '../types';

/**
 * Retourne tous les phonèmes valides pour une case de la grille (consonne ou voyelle)
 * @param phonemes La liste centrale des phonèmes (PhonemeModel[])
 * @param row Manner (consonne) ou Height (voyelle)
 * @param col Place (consonne) ou Backness (voyelle)
 * @param isVowel true si voyelle, false si consonne
 */
export function getPhonemesForCell(
  phonemes: PhonemeModel[],
  row: Manner | Height,
  col: Place | Backness,
  isVowel: boolean
): PhonemeModel[] {
  if (!row || !col) return [];
  if (isVowel) {
    // Pour les voyelles, on filtre sur height et backness
    return phonemes.filter(
      p => p.category === 'vowel' &&
        p.features?.height === row &&
        p.features?.backness === col
    );
  } else {
    // Pour les consonnes, on filtre sur manner et place
    return phonemes.filter(
      p => p.category === 'consonant' &&
        p.features?.manner === row &&
        p.features?.place === col
    );
  }
}

/**
 * Indique si une case de la grille est possible (au moins un phonème existe)
 */
export function isCellPossible(
  phonemes: PhonemeModel[],
  row: Manner | Height,
  col: Place | Backness,
  isVowel: boolean
): boolean {
  return getPhonemesForCell(phonemes, row, col, isVowel).length > 0;
}