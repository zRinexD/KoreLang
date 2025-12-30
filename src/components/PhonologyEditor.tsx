import React, { useState } from 'react';
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
  const getConsonantPhonemes = (manner: string, place: string) =>
    phonology.consonants.filter(p => p.manner === manner && p.place === place);

  // Utility: get phonemes for a vowel cell
  const getVowelPhonemes = (height: string, backness: string) =>
    phonology.vowels.filter(p => p.height === height && p.backness === backness);

  // Remove a phoneme instance
  const handleRemove = (instance: PhonemeInstance, isVowel: boolean) => {
    if (isVowel) {
      setData({ ...phonology, vowels: phonology.vowels.filter(p => p.id !== instance.id) });
    } else {
      setData({ ...phonology, consonants: phonology.consonants.filter(p => p.id !== instance.id) });
    }
  };

  // Add a phoneme instance to the grid
  const handleAddPhoneme = (phonemeInstance: PhonemeInstance, row: string, col: string, isVowel: boolean) => {
    if (isVowel) {
      setData({ ...phonology, vowels: [...phonology.vowels, phonemeInstance] });
    } else {
      setData({ ...phonology, consonants: [...phonology.consonants, phonemeInstance] });
    }
  };

  // Render a phoneme instance (symbol)
  const renderPhoneme = (p: PhonemeInstance) => <span>{p.phoneme.symbol}</span>;

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
          />
        </div>
      </div>
    </div>
  );
};

export default PhonologyEditor;