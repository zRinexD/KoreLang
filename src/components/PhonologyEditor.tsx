import { PhonemeDataService } from '../services/PhonemeDataService';
import React, { useState } from 'react';
import { Wand2, RefreshCw, Volume2, Info, LayoutGrid, EyeOff, ShieldAlert, Plus, Trash2, X, Check, Eye, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { generatePhonology, isApiKeySet } from '../services/geminiService';
import { PhonologyConfig, PhonemeInstance, PhonemeModel } from '../types';

import { useTranslation } from '../i18n';
import { Card, Section, ViewLayout, ViewHeader, FormField, ActionButton, CompactButton, Modal, SearchInput, StatBadge, CIcon, VIcon } from './ui';
import PhonemeGrid from './PhonemeGrid';



interface PhonologyEditorProps {
  phonology: PhonologyConfig;
  setData: (data: PhonologyConfig) => void;
  setPendingPhonology?: (pending: any) => void;
  enableAI?: boolean;
}

const PhonologyEditor: React.FC<PhonologyEditorProps> = (props) => {





  const { phonology, setData } = props;
  // Utility: get phonemes for a consonant cell
  const getConsonantPhonemes = React.useCallback(
    (manner: string, place: string) =>
      phonology.consonants.filter(p => p.manner === manner && p.place === place),
    [phonology.consonants]
  );

  // Utility: get phonemes for a vowel cell
  const getVowelPhonemes = React.useCallback(
    (height: string, backness: string) =>
      phonology.vowels.filter(p => p.height === height && p.backness === backness),
    [phonology.vowels]
  );

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
  const renderPhoneme = (p: PhonemeInstance) => <span>{PhonemeDataService.getIPA(p.phoneme)}</span>;

  return (
    <ViewLayout
      icon={Volume2}
      title="Phonology"
      subtitle="Manage your phoneme inventory and grid."
    >
      <div className="flex gap-8 p-8">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="font-semibold text-base mr-2">Consonants</span>
            {/* Add button for consonants (opens modal via grid) */}
          </div>
          <PhonemeGrid
            title="Consonant Grid"
            icon={<span>C</span>}
            isVowels={false}
            getPhonemes={getConsonantPhonemes}
            onRemove={p => handleRemove(p, false)}
            renderPhoneme={renderPhoneme}
            onAddPhoneme={handleAddPhoneme}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="font-semibold text-base mr-2">Vowels</span>
            {/* Add button for vowels (opens modal via grid) */}
          </div>
          <PhonemeGrid
            title="Vowel Grid"
            icon={<span>V</span>}
            isVowels={true}
            getPhonemes={getVowelPhonemes}
            onRemove={p => handleRemove(p, true)}
            renderPhoneme={renderPhoneme}
            onAddPhoneme={handleAddPhoneme}
          />
        </div>
      </div>
    </ViewLayout>
  );
};

export default PhonologyEditor;