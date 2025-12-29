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
  // Add a dummy consonant (for demo)
  const handleAddConsonant = () => {
    // Pick the first consonant model as a demo
    const model = PHONEME_MODELS.find(p => p.category === 'consonant') || PHONEME_MODELS[0];
    if (!model) return;
    const manner = typeof model.features?.manner === 'string' ? model.features.manner : '';
    const place = typeof model.features?.place === 'string' ? model.features.place : '';
    const newInstance: PhonemeInstance = {
      id: 'dummy-c-' + (phonology.consonants.length + 1),
      phoneme: model,
      type: 'consonant',
      manner,
      place,
      diacritics: [],
      features: {},
    };
    setData({ ...phonology, consonants: [...phonology.consonants, newInstance] });
  };
  // Add a dummy vowel (for demo)
  const handleAddVowel = () => {
    // Pick the first vowel model as a demo
    const model = PHONEME_MODELS.find(p => p.category === 'vowel') || PHONEME_MODELS[0];
    if (!model) return;
    const height = typeof model.features?.height === 'string' ? model.features.height : '';
    const backness = typeof model.features?.backness === 'string' ? model.features.backness : '';
    const newInstance: PhonemeInstance = {
      id: 'dummy-v-' + (phonology.vowels.length + 1),
      phoneme: model,
      type: 'vowel',
      height,
      backness,
      diacritics: [],
      features: {},
    };
    setData({ ...phonology, vowels: [...phonology.vowels, newInstance] });
  };
  return (
    <div style={{ padding: 32 }}>
      <h2>Phonology Inventory</h2>
      <div>Consonants: {phonology.consonants.length}</div>
      <div>Vowels: {phonology.vowels.length}</div>
      <button onClick={handleAddConsonant} style={{ marginTop: 16, padding: 8, marginRight: 8 }}>Add Dummy Consonant</button>
      <button onClick={handleAddVowel} style={{ marginTop: 16, padding: 8 }}>Add Dummy Vowel</button>
    </div>
  );
};

export default PhonologyEditor;