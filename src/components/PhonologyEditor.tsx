import React, { useState, useCallback } from 'react';
import { Wand2, RefreshCw, Volume2, Info, LayoutGrid, EyeOff, ShieldAlert, Plus, Trash2, X, Check, Eye, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { generatePhonology, isApiKeySet } from '../services/geminiService';
import { PhonologyConfig, PhonemeInstance, PhonemeModel } from '../types';

import { useTranslation } from '../i18n';
import { Card, Section, ViewLayout, FormField, ActionButton, CompactButton, Modal, SearchInput, StatBadge, CIcon, VIcon } from './ui';
import PhonemeGrid from './PhonemeGrid';
import { PHONEME_MODELS } from '../services/phonemeService';


interface PhonologyEditorProps {
  phonology: PhonologyConfig;
  setData: (data: PhonologyConfig) => void;
  setPendingPhonology?: (pending: any) => void;
  enableAI?: boolean;
}

const PhonologyEditor: React.FC<PhonologyEditorProps> = (props) => {





  const { phonology, setData } = props;
  // Utility: get phonemes for a consonant cell
  const getConsonantPhonemes = useCallback((manner: string, place: string) =>
    phonology.consonants.filter(p => p.manner === manner && p.place === place), [phonology.consonants]);

  // Utility: get phonemes for a vowel cell
  const getVowelPhonemes = useCallback((height: string, backness: string) =>
    phonology.vowels.filter(p => p.height === height && p.backness === backness), [phonology.vowels]);

  // Remove a phoneme instance
  const handleRemove = (instance: PhonemeInstance, isVowel: boolean) => {
    if (isVowel) {
      setData({ ...phonology, vowels: phonology.vowels.filter(p => p.id !== instance.id) });
    } else {
      setData({ ...phonology, consonants: phonology.consonants.filter(p => p.id !== instance.id) });
    }
  };

  // Add a phoneme instance to the grid
  const handleAddPhoneme = (phoneme: PhonemeModel, row: string, col: string, isVowel: boolean) => {
    if (isVowel) {
      const newInstance: PhonemeInstance = {
        id: `${phoneme.id}-v-${row}-${col}-${Date.now()}`,
        phoneme,
        type: 'vowel',
        height: row,
        backness: col,
        diacritics: [],
        features: {},
      };
      setData({ ...phonology, vowels: [...phonology.vowels, newInstance] });
    } else {
      const newInstance: PhonemeInstance = {
        id: `${phoneme.id}-c-${row}-${col}-${Date.now()}`,
        phoneme,
        type: 'consonant',
        manner: row,
        place: col,
        diacritics: [],
        features: {},
      };
      setData({ ...phonology, consonants: [...phonology.consonants, newInstance] });
    }
  };

  // Replace a phoneme instance
  const handleReplacePhoneme = (instance: PhonemeInstance, newModel: PhonemeModel) => {
    const isVowel = instance.type === 'vowel';
    if (isVowel) {
      const updatedVowels = phonology.vowels.map(p => {
        if (p.id === instance.id) {
          return { ...p, phoneme: newModel };
        }
        return p;
      });
      setData({ ...phonology, vowels: updatedVowels });
    } else {
      const updatedConsonants = phonology.consonants.map(p => {
        if (p.id === instance.id) {
          return { ...p, phoneme: newModel };
        }
        return p;
      });
      setData({ ...phonology, consonants: updatedConsonants });
    }
  };

  // Render a phoneme instance (symbol)
  const renderPhoneme = (p: PhonemeInstance) => (
    <span title={p.phoneme.name} className="cursor-help">
      {p.phoneme.symbol}
    </span>
  );

  return (
    <div style={{ padding: 32 }}>
      <h2>Phonology Inventory</h2>
      <div style={{ display: 'flex', gap: 32 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 16, marginRight: 8 }}>Consonants</span>
            {/* Add button for consonants (opens modal via grid) */}
          </div>
          <PhonemeGrid
            title="Consonant Grid"
            icon={<span>C</span>}
            isVowels={false}
            getPhonemes={getConsonantPhonemes}
            onRemove={p => handleRemove(p, false)}
            renderPhoneme={renderPhoneme}
            phonemeModels={PHONEME_MODELS.filter(p => p.category === 'consonant')}
            onAddPhoneme={handleAddPhoneme}
            onReplacePhoneme={handleReplacePhoneme}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 16, marginRight: 8 }}>Vowels</span>
            {/* Add button for vowels (opens modal via grid) */}
          </div>
          <PhonemeGrid
            title="Vowel Grid"
            icon={<span>V</span>}
            isVowels={true}
            getPhonemes={getVowelPhonemes}
            onRemove={p => handleRemove(p, true)}
            renderPhoneme={renderPhoneme}
            phonemeModels={PHONEME_MODELS.filter(p => p.category === 'vowel')}
            onAddPhoneme={handleAddPhoneme}
            onReplacePhoneme={handleReplacePhoneme}
          />
        </div>
      </div>
    </div>
  );
};

export default PhonologyEditor;