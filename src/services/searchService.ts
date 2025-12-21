
import { LexiconEntry } from "../types";

export interface SearchConfig {
  query: string;
  filters: {
    pos: string | 'ALL';
  };
  fields: {
    word: boolean;
    definition: boolean;
    etymology: boolean;
    ipa: boolean;
  };
}

export interface SearchResult extends LexiconEntry {
  relevanceScore: number;
  matchType: 'EXACT' | 'START' | 'PARTIAL' | 'DEFINITION' | 'RELATED';
}

/**
 * A lightweight, in-memory weighted search engine.
 * Optimized for datasets < 50,000 items.
 */
export const searchLexicon = (
  entries: LexiconEntry[],
  config: SearchConfig
): SearchResult[] => {
  const { query, filters, fields } = config;
  
  // 1. Fast Exit
  if (!query.trim() && filters.pos === 'ALL') {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  // 2. Filter & Score Loop
  // We do this in a single pass for performance (O(n))
  const results: SearchResult[] = [];

  for (const entry of entries) {
    // A. Strict Filters (The "Facet" Layer)
    if (filters.pos !== 'ALL' && entry.pos !== filters.pos) {
      continue;
    }

    // If no text query, but filter matched, return it with base score
    if (!normalizedQuery) {
      results.push({ ...entry, relevanceScore: 1, matchType: 'PARTIAL' });
      continue;
    }

    let score = 0;
    let bestMatch: SearchResult['matchType'] = 'RELATED';

    const word = entry.word.toLowerCase();
    const def = entry.definition.toLowerCase();
    const etym = entry.etymology?.toLowerCase() || '';
    const ipa = entry.ipa.toLowerCase();

    // B. Weighted Scoring Algorithm
    
    // Priority 1: The Word itself (Highest Weight)
    if (fields.word) {
      if (word === normalizedQuery) {
        score += 100;
        bestMatch = 'EXACT';
      } else if (word.startsWith(normalizedQuery)) {
        score += 50;
        bestMatch = 'START';
      } else if (word.includes(normalizedQuery)) {
        score += 20;
        bestMatch = 'PARTIAL';
      }
    }

    // Priority 2: IPA (Medium Weight)
    if (fields.ipa && ipa.includes(normalizedQuery)) {
      score += 15;
    }

    // Priority 3: Definition (Context Weight)
    if (fields.definition && def.includes(normalizedQuery)) {
      score += 10;
      if (score < 20) bestMatch = 'DEFINITION'; // Only set if word didn't match
    }

    // Priority 4: Etymology (Metadata Weight)
    if (fields.etymology && etym.includes(normalizedQuery)) {
      score += 5;
    }

    // C. Thresholding
    if (score > 0) {
      results.push({
        ...entry,
        relevanceScore: score,
        matchType: bestMatch
      });
    }
  }

  // 3. Sorting (Relevance Ranking)
  // Sort by Score DESC, then Alphabetical ASC
  return results.sort((a, b) => {
    if (a.relevanceScore !== b.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    return a.word.localeCompare(b.word);
  });
};
