import React, { useState } from 'react';
import { X, Moon, Sun, Cpu, Palette, Download, Upload, Check, Eye, EyeOff, HelpCircle, ExternalLink, ChevronLeft } from 'lucide-react';
import { useTranslation, languages } from '../i18n';
import { useUI } from '../ui/UIContext';
import { useSettings } from '../hooks/useSettings';
import { DEFAULT_CUSTOM } from '../constants';
import { isApiKeySet, getApiKey, setApiKey } from '../services/geminiService';

const SettingsModal: React.FC = () => {
  const ui = useUI();
  const { t, i18n } = useTranslation();
  const { settings, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'THEME'>('GENERAL');
  const [apiKey, setApiKeyLocal] = useState(getApiKey());
  const [showApiKey, setShowApiKey] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const hasApiKey = isApiKeySet();

  if (!ui.isOpen('settings')) return null;

  const setLanguage = (lang: string) => updateSettings({ ...settings, language: lang });

  const handleCustomUpdate = (key: keyof typeof DEFAULT_CUSTOM, val: string) => {
    const current = settings.customTheme || DEFAULT_CUSTOM;
    updateSettings({ ...settings, theme: 'custom', customTheme: { ...current, [key]: val } });
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
        updateSettings({ ...settings, theme: 'custom', customTheme: imported });
      } catch {
        alert('Invalid theme file');
      }
    };
    reader.readAsText(file);
  };

  const handleApiKeyChange = (val: string) => {
    setApiKeyLocal(val);
    setApiKey(val);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
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
                <input type="checkbox" checked={settings.enableAI} onChange={(e) => updateSettings({ ...settings, enableAI: e.target.checked })} className="w-5 h-5 rounded" />
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
              {/* Theme tab content */}
              {/* ...identique au précédent, avec handleCustomUpdate, export/import ... */}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t bg-slate-950 border-slate-800">
          <button onClick={() => ui.close('settings')} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded shadow-lg hover:bg-blue-700">OK</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
