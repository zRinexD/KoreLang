import React, { useState, useEffect } from 'react';
import { X, Moon, Sun, Cpu, Palette, Download, Upload, Check, Eye, EyeOff, HelpCircle, ExternalLink, ChevronLeft } from 'lucide-react';
import { useTranslation, languages } from '../i18n';
import { useUI } from '../ui/UIContext';
import { AppSettings } from '../types';
import { DEFAULT_CUSTOM } from '../constants';
import { isApiKeySet, getApiKey } from '../services/geminiService';
import { useCommandExecutor } from '../state/commandStore';

// Presets de thèmes pour copie dans custom
const THEME_PRESETS = {
  dark: {
    bgMain: "#121212",
    bgPanel: "#1e1e1e",
    text1: "#f1f5f9",
    text2: "#94a3b8",
    accent: "#3b82f6",
    bgHeader: "#0a0a0a",
  },
  cappuccino: {
    bgMain: "#f5f1ee",
    bgPanel: "#ede8e3",
    text1: "#3d3935",
    text2: "#8b7d75",
    accent: "#c17a4a",
    bgHeader: "#e8e3df",
  },
  "tokyo-night": {
    bgMain: "#1a1b26",
    bgPanel: "#24283b",
    text1: "#a9b1d6",
    text2: "#565f89",
    accent: "#7aa2f7",
    bgHeader: "#16161e",
  },
};

interface SettingsModalProps {
  settings: AppSettings;
  updateSettings: (settings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, updateSettings }) => {
  const ui = useUI();
  
  if (!ui.isOpen('settings')) return null;

  const { t, i18n } = useTranslation();
  const executeCommand = useCommandExecutor();
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'THEME'>('GENERAL');
  const [apiKey, setApiKeyLocal] = useState(getApiKey());
  const [showApiKey, setShowApiKey] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(settings.theme);
  const hasApiKey = isApiKeySet();

  useEffect(() => {
    setCurrentTheme(settings.theme);
  }, [settings.theme]);

  const setLanguage = (lang: string) => executeCommand('setLanguage', { language: lang });

  const handleCustomUpdate = (key: keyof typeof DEFAULT_CUSTOM, val: string) => {
    executeCommand('updateCustomTheme', { colorKey: key, colorValue: val });
  };

  const setTheme = (theme: 'dark' | 'cappuccino' | 'tokyo-night' | 'custom') => {
    setCurrentTheme(theme);
    // Copier les couleurs du preset dans customTheme pour permettre la dérivation
    const presetColors = THEME_PRESETS[theme as keyof typeof THEME_PRESETS];
    if (presetColors) {
      executeCommand('setTheme', { theme, customTheme: presetColors as any });
    } else {
      executeCommand('setTheme', { theme, customTheme: settings.customTheme as any });
    }
  };

  const exportTheme = () => {
    const theme = settings.customTheme || DEFAULT_CUSTOM;
    const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `cs-theme-custom.json`;
    a.click();
  };

  const importTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string);
        executeCommand('setTheme', { theme: 'custom', customTheme: imported as any });
      } catch {
        alert('Invalid theme file');
      }
    };
    reader.readAsText(file);
  };

  const handleApiKeyChange = (val: string) => {
    setApiKeyLocal(val);
    executeCommand('setApiKey', { apiKey: val });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800" style={{ backgroundColor: 'var(--bg-header)' }}>
          <h2 className="text-lg font-bold text-white">{t('settings.preferences_title')}</h2>
          <button onClick={() => ui.close('settings')} className="text-slate-500 hover:text-white"><X size={20} /></button>
        </div>

        {/* Tabs */}
        <div className="flex text-sm border-b border-slate-800 bg-slate-900">
          <button onClick={() => setActiveTab('GENERAL')} className={`px-6 py-2 font-bold ${activeTab === 'GENERAL' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500'}`}>{t('settings.tab_general')}</button>
          <button onClick={() => setActiveTab('THEME')} className={`px-6 py-2 font-bold ${activeTab === 'THEME' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500'}`}>{t('settings.tab_visual')}</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {activeTab === 'GENERAL' ? (
            <>
              {/* AI toggle */}
              <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-900/10 border-blue-900/30">
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-200"><Cpu size={16} className="text-purple-400" /> {t('settings.cognitive_ai')}</div>
                  <p className="text-[10px] text-slate-400">{t('settings.cognitive_ai_desc')}</p>
                </div>
                <input type="checkbox" checked={settings.enableAI} onChange={(e) => executeCommand('setAIEnabled', { aiEnabled: e.target.checked })} className="w-5 h-5 rounded" />
              </div>

              {/* API key */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">{t('settings.api_key')}</label>
                <div className="relative">
                  <input type={showApiKey ? 'text' : 'password'} value={apiKey} onChange={(e) => handleApiKeyChange(e.target.value)} className="w-full px-3 py-2 pr-10 text-sm transition-colors border rounded outline-none bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" placeholder={t('settings.api_key_ph')} />
                  <button onClick={() => setShowApiKey(!showApiKey)} className="absolute -translate-y-1/2 right-3 top-1/2 text-slate-500 hover:text-slate-300">
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block mb-3 text-xs font-bold uppercase text-slate-500">{t('settings.language_label')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950 p-2 rounded max-h-[200px] overflow-y-auto custom-scrollbar">
                  {languages.map(lang => (
                    <button key={lang.code} onClick={() => setLanguage(lang.code)} className={`py-1.5 px-2 text-[10px] font-medium rounded truncate transition-all ${i18n.language === lang.code ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-y-[-1px]' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'}`} title={lang.label}>{lang.label}</button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Theme presets */}
              <div>
                <label className="block mb-3 text-xs font-bold uppercase text-slate-500">{t('settings.theme_presets') || 'Préréglages globaux'}</label>
                <div className="grid grid-cols-3 gap-2">
                  {['dark', 'cappuccino', 'tokyo-night'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setTheme(preset as any)}
                      className={`py-2.5 px-3 text-xs font-bold rounded-lg transition-all uppercase ${
                        currentTheme === preset
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {preset.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom theme section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-400">
                    <Palette size={16} /> {t('settings.custom_theme') || 'Branding personnalisé'}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={exportTheme}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
                      title={t('settings.export_json') || 'Exporter le thème'}
                    >
                      <Download size={14} />
                    </button>
                    <label className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer" title={t('settings.import_json') || 'Importer un thème'}>
                      <Upload size={14} />
                      <input
                        type="file"
                        accept=".json"
                        onChange={importTheme}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                
                <div className="space-y-3 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  {[
                    { key: 'bgMain', label: t('settings.canvas_bg') || 'Arrière-plan du canvas' },
                    { key: 'bgPanel', label: t('settings.sec_panels') || 'Panneaux secondaires' },
                    { key: 'bgHeader', label: t('settings.header_bg') || 'En-têtes et barre de menu' },
                    { key: 'text1', label: t('settings.prim_text') || 'Texte principal' },
                    { key: 'text2', label: t('settings.sec_text') || 'Texte secondaire' },
                    { key: 'accent', label: t('settings.active_accent') || 'Accent actif' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between gap-4">
                      <label className="text-sm text-slate-300 flex-1">{label}</label>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 font-mono min-w-[60px] text-right">
                          {settings.customTheme?.[key as keyof typeof DEFAULT_CUSTOM] || DEFAULT_CUSTOM[key as keyof typeof DEFAULT_CUSTOM]}
                        </span>
                        <div className="relative w-10 h-10 rounded overflow-hidden border-2 border-slate-700 hover:border-blue-500 transition-colors">
                          <input
                            type="color"
                            value={settings.customTheme?.[key as keyof typeof DEFAULT_CUSTOM] || DEFAULT_CUSTOM[key as keyof typeof DEFAULT_CUSTOM]}
                            onChange={(e) => handleCustomUpdate(key as keyof typeof DEFAULT_CUSTOM, e.target.value)}
                            className="absolute cursor-pointer border-0 outline-none"
                            style={{ 
                              width: '200%', 
                              height: '200%', 
                              top: '-50%', 
                              left: '-50%',
                              padding: 0,
                              margin: 0
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {currentTheme === 'custom' && (
                  <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                    <Check size={10} /> {t('settings.active_theme') || 'Thème actif'}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-slate-800" style={{ backgroundColor: 'var(--bg-header)' }}>
          <button onClick={() => ui.close('settings')} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded shadow-lg hover:bg-blue-700">OK</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
