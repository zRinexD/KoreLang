import { useState, useEffect, useCallback } from 'react';
import { AppSettings, CustomTheme } from '../types';
import { DEFAULT_CUSTOM } from '../constants';

const SETTINGS_STORAGE_KEY = 'conlang_studio_settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      theme: 'dark',
      autoSave: true,
      showLineNumbers: true,
      enableAI: true,
      language: 'en',
      customTheme: DEFAULT_CUSTOM,
    };
  });

  // Persister dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
  }, []);

  return { settings, updateSettings };
};
