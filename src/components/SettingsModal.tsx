
import React, { useState } from 'react';
import { X, Moon, Sun, CloudMoon, Cpu, CloudSun, Palette, Download, Upload, Check, Eye, EyeOff, HelpCircle, ExternalLink, ChevronLeft } from 'lucide-react';
import { AppSettings, CustomTheme } from '../types';
import { useTranslation, languages, LanguageCode } from '../i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
}

import { isApiKeySet, getApiKey, setApiKey } from '../services/geminiService';

const DEFAULT_CUSTOM: CustomTheme = {
  bgMain: '#0f172a',
  bgPanel: '#1e293b',
  text1: '#f8fafc',
  text2: '#94a3b8',
  accent: '#3b82f6'
};

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const setLanguage = (lang: string) => onUpdateSettings({ ...settings, language: lang });
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'THEME'>('GENERAL');
  const [apiKey, setApiKeyLocal] = useState(getApiKey());
  const [showApiKey, setShowApiKey] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const hasApiKey = isApiKeySet();

  if (!isOpen) return null;


  const handleCustomUpdate = (key: keyof CustomTheme, val: string) => {
    const current = settings.customTheme || DEFAULT_CUSTOM;
    onUpdateSettings({ ...settings, theme: 'custom', customTheme: { ...current, [key]: val } });
  };

  const exportTheme = () => {
    const theme = settings.customTheme || DEFAULT_CUSTOM;
    const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cs-theme-custom.json`;
    a.click();
  };

  const importTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target?.result as string);
          onUpdateSettings({ ...settings, theme: 'custom', customTheme: imported });
        } catch (err) { alert('Invalid theme file'); }
      };
      reader.readAsText(file);
    }
  };

  const handleApiKeyChange = (val: string) => {
    setApiKeyLocal(val);
    setApiKey(val);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">{t('settings.preferences_title')}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20} /></button>
        </div>

        <div className="flex border-b border-slate-800 bg-slate-900 text-sm">
          <button onClick={() => setActiveTab('GENERAL')} className={`px-6 py-2 font-bold ${activeTab === 'GENERAL' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500'}`}>{t('settings.tab_general')}</button>
          <button onClick={() => setActiveTab('THEME')} className={`px-6 py-2 font-bold ${activeTab === 'THEME' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500'}`}>{t('settings.tab_visual')}</button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {activeTab === 'GENERAL' ? (
            <>
              <div className="bg-blue-900/10 border border-blue-900/30 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-200 font-bold text-sm"><Cpu size={16} className="text-purple-400" /> {t('settings.cognitive_ai')}</div>
                  <p className="text-[10px] text-slate-400">{t('settings.cognitive_ai_desc')}</p>
                </div>
                <input type="checkbox" checked={settings.enableAI} onChange={(e) => onUpdateSettings({ ...settings, enableAI: e.target.checked })} className="w-5 h-5 rounded" />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  {t('settings.api_key')}
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 pr-10 focus:border-blue-500 outline-none transition-colors"
                    placeholder={t('settings.api_key_ph')}
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {!apiKey && (
                  <p className="text-[10px] text-amber-500 flex items-center gap-1 font-bold">
                    <Check size={10} className="rotate-45" /> {t('settings.api_key_required')}
                  </p>
                )}
                <button
                  onClick={() => setShowHelp(true)}
                  className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold transition-all hover:translate-x-1"
                >
                  <HelpCircle size={10} /> {t('settings.api_key_help')}
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">{t('settings.language_label')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950 p-2 rounded max-h-[200px] overflow-y-auto custom-scrollbar">
                  {languages.map(lang => (
                    <button key={lang.code} onClick={() => setLanguage(lang.code)} className={`py-1.5 px-2 text-[10px] font-medium rounded truncate transition-all ${language === lang.code ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-y-[-1px]' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'}`} title={lang.label}>{lang.label}</button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">{t('settings.global_presets')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {['dark', 'light', 'tokyo-night'].map(tName => (
                    <button key={tName} onClick={() => onUpdateSettings({ ...settings, theme: tName as any })} className={`p-2 text-[10px] font-bold uppercase rounded border ${settings.theme === tName ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>{tName.replace('-', ' ')}</button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm"><Palette size={16} /> {t('settings.custom_branding')}</div>
                  <div className="flex gap-2">
                    <button onClick={exportTheme} className="p-1 hover:bg-slate-800 rounded text-slate-400" title={t('settings.export_json')}><Download size={14} /></button>
                    <label className="p-1 hover:bg-slate-800 rounded text-slate-400 cursor-pointer" title={t('settings.import_json')}><Upload size={14} /><input type="file" onChange={importTheme} className="hidden" accept=".json" /></label>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { k: 'bgMain', l: t('settings.canvas_bg') },
                    { k: 'bgPanel', l: t('settings.sec_panels') },
                    { k: 'text1', l: t('settings.prim_text') },
                    { k: 'accent', l: t('settings.active_accent') }
                  ].map(item => (
                    <div key={item.k} className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">{item.l}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-500">{(settings.customTheme as any)?.[item.k] || (DEFAULT_CUSTOM as any)[item.k]}</span>
                        <input type="color" value={(settings.customTheme as any)?.[item.k] || (DEFAULT_CUSTOM as any)[item.k]} onChange={(e) => handleCustomUpdate(item.k as any, e.target.value)} className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer" />
                      </div>
                    </div>
                  ))}
                </div>
                {settings.theme === 'custom' && <div className="mt-4 text-center text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1"><Check size={10} /> {t('settings.active_theme')}</div>}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold shadow-lg shadow-blue-900/20">{t('settings.finalize')}</button>
        </div>

        {showHelp && (
          <div className="absolute inset-0 z-[110] bg-slate-900 animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex items-center gap-4 p-4 border-b border-slate-800 bg-slate-950">
              <button onClick={() => setShowHelp(false)} className="text-slate-500 hover:text-white flex items-center gap-1 text-xs font-bold">
                <ChevronLeft size={16} /> {t('settings.help_back')}
              </button>
              <h3 className="text-sm font-bold text-white">{t('settings.help_title')}</h3>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-300">
              <p className="text-xs text-slate-400 italic">{t('settings.help_subtitle')}</p>

              <div className="space-y-4">
                {[
                  { step: 1, text: t('settings.help_step_1'), link: "https://aistudio.google.com/" },
                  { step: 2, text: t('settings.help_step_2') },
                  { step: 3, text: t('settings.help_step_3') },
                  { step: 4, text: t('settings.help_step_4') },
                  { step: 5, text: t('settings.help_step_5') }
                ].map(s => (
                  <div key={s.step} className="flex gap-4 items-start">
                    <span className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-[10px] font-bold text-blue-400 shrink-0">
                      {s.step}
                    </span>
                    <div className="space-y-1">
                      <p className="leading-tight">{s.text}</p>
                      {s.link && (
                        <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-[10px] flex items-center gap-1">
                          <ExternalLink size={10} /> {t('settings.open_ai_studio')}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-emerald-900/10 border border-emerald-900/30 rounded-lg">
                <p className="text-[10px] text-emerald-400 font-bold mb-1 uppercase tracking-wider flex items-center gap-1">
                  <Check size={10} /> {t('settings.help_is_free')}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('settings.help_free_desc')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
