import { PhonemeType, Manner, Place, Height, Backness } from '../types';
import { PhonemeDataService } from './PhonemeDataService';


/**
 * Retourne tous les phonèmes valides pour une case de la grille (consonne ou voyelle),
 * en se basant uniquement sur l'enum PhonemeType et le mapping meta.
 */
export function getPhonemesForCell(
  row: Manner | Height,
  col: Place | Backness,
  isVowel: boolean
): PhonemeType[] {
  if (!row || !col) return [];
  const allPhonemes = Object.values(PhonemeType);
  if (isVowel) {
    return allPhonemes.filter((pt) => {
      const meta = PhonemeDataService.getMeta(pt);
      return meta?.category === 'vowel' && meta.height === row && meta.backness === col;
    });
  } else {
    return allPhonemes.filter((pt) => {
      const meta = PhonemeDataService.getMeta(pt);
      return meta?.category === 'consonant' && meta.manner === row && meta.place === col;
    });
  }
}

/**
 * Retourne toutes les cases valides de la grille pour la projection dynamique (enum + meta uniquement)
 */
export function getValidGridCells(isVowel: boolean): Array<{ row: Manner | Height, col: Place | Backness }> {
  const rows = isVowel ? Object.values(Height) : Object.values(Manner);
  const cols = isVowel ? Object.values(Backness) : Object.values(Place);
  const cells: Array<{ row: Manner | Height, col: Place | Backness }> = [];
  for (const row of rows) {
    for (const col of cols) {
      if (isCellPossible(row, col, isVowel)) {
        cells.push({ row, col });
      }
    }
  }
  return cells;
}

/**
 * Indique si une case de la grille est possible (au moins un phonème existe)
 */
export function isCellPossible(
  row: Manner | Height,
  col: Place | Backness,
  isVowel: boolean
): boolean {
  return getPhonemesForCell(row, col, isVowel).length > 0;
}