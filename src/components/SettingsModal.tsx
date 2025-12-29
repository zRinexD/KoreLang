import React, { useState, useEffect } from 'react';
import { X, Moon, Sun, Cpu, Palette, Download, Upload, Check, Eye, EyeOff, HelpCircle, ExternalLink, ChevronLeft, ChevronDown } from 'lucide-react';
import { useTranslation, languages } from '../i18n';
import { useUI } from '../ui/UIContext';
import { AppSettings } from '../types';
import { DEFAULT_CUSTOM } from '../constants';
import { isApiKeySet, getApiKey } from '../services/geminiService';
import { useCommandExecutor } from '../state/commandStore';
import { Card, Section, CompactButton } from './ui';

// Presets de thèmes pour copie dans custom
const THEME_PRESETS = {
  dark: {
    primary: "#2563EB",
    secondary: "#0A0A0A",
    accent: "#1D4ED8",
    background: "#121212",
    surface: "#1E1E1E",
    elevated: "#262626",
    textPrimary: "#FFFFFF",
    textSecondary: "#A3A3A3",
    textTertiary: "#525252",
    border: "#404040",
    divider: "#262626",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
    hover: "#2563EB",
    active: "#1D4ED8",
    disabled: "#404040",
  },
  cappuccino: {
    primary: "#CC9B7A",
    secondary: "#191918",
    accent: "#D97757",
    background: "#F4F1ED",
    surface: "#FFFFFF",
    elevated: "#FFFFFF",
    textPrimary: "#191918",
    textSecondary: "#5C5C5A",
    textTertiary: "#8E8E8C",
    border: "#E6E3DE",
    divider: "#D4CFC7",
    success: "#2D9F7C",
    warning: "#E89C3F",
    error: "#D14343",
    info: "#5B8DBE",
    hover: "#B88762",
    active: "#A67756",
    disabled: "#BFBBB5",
  },
  quenya: {
    primary: "#8B4513",
    secondary: "#2C3E50",
    accent: "#8B4513",
    background: "#F5EDE1",
    surface: "#FFFBF5",
    elevated: "#F5EDE1",
    textPrimary: "#2C3E50",
    textSecondary: "#7D6B5A",
    textTertiary: "#7B5E3B",
    border: "#D4AF37",
    divider: "#C9A227",
    success: "#2E7D32",
    warning: "#D4AF37",
    error: "#C62828",
    info: "#8B4513",
    hover: "#654321",
    active: "#5A3A1A",
    disabled: "#C9B8A2",
  },
  "tokyo-night": {
    primary: "#BB9AF7",
    secondary: "#16161E",
    accent: "#7AA2F7",
    background: "#1A1B26",
    surface: "#24283B",
    elevated: "#2F3347",
    textPrimary: "#A9B1D6",
    textSecondary: "#565F89",
    textTertiary: "#414868",
    border: "#414868",
    divider: "#2A2E3F",
    success: "#73DACA",
    warning: "#FF9E64",
    error: "#F7768E",
    info: "#7AA2F7",
    hover: "#89B4FA",
    active: "#6891E6",
    disabled: "#3B4261",
  },
  neon: {
    primary: "#FF006E",
    secondary: "#2D3561",
    accent: "#FF006E",
    background: "#0A0E27",
    surface: "#131736",
    elevated: "#1B2148",
    textPrimary: "#E0E7FF",
    textSecondary: "#94A3D8",
    textTertiary: "#6B729D",
    border: "#2D3561",
    divider: "#1B2148",
    success: "#00F5D4",
    warning: "#FFBE0B",
    error: "#FF006E",
    info: "#8338EC",
    hover: "#D60058",
    active: "#B3004A",
    disabled: "#4B5078",
  },
  edgerunner: {
    primary: "#FCEE0A",
    secondary: "#0C0D14",
    accent: "#FCEE0A",
    background: "#0C0D14",
    surface: "#16171F",
    elevated: "#1F202B",
    textPrimary: "#FCEE0A",
    textSecondary: "#9CA3AF",
    textTertiary: "#6B7280",
    border: "#3A3B47",
    divider: "#23242F",
    success: "#00FF9F",
    warning: "#FF9500",
    error: "#FF003C",
    info: "#00D9FF",
    hover: "#FFFF33",
    active: "#E6D900",
    disabled: "#2D2F3A",
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
  const [currentTheme, setCurrentTheme] = useState<string>(settings.theme);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const hasApiKey = isApiKeySet();

  useEffect(() => {
    setCurrentTheme(settings.theme);
  }, [settings.theme]);

  const setLanguage = (lang: string) => executeCommand('setLanguage', { language: lang });

  const handleCustomUpdate = (key: keyof typeof DEFAULT_CUSTOM, val: string) => {
    executeCommand('updateCustomTheme', { colorKey: key, colorValue: val });
  };

  const setTheme = (theme: keyof typeof THEME_PRESETS | 'custom') => {
    setCurrentTheme(theme);
    setIsDropdownOpen(false);
    // Copier les couleurs du preset dans customTheme pour permettre la dérivation
    const presetColors = THEME_PRESETS[theme as keyof typeof THEME_PRESETS];
    if (presetColors) {
      executeCommand('setTheme', { theme: theme as any, customTheme: presetColors as any });
    } else {
      executeCommand('setTheme', { theme: theme as any, customTheme: settings.customTheme as any });
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
      <div className="w-full max-w-lg rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ backgroundColor: 'var(--secondary)', borderColor: 'var(--border)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{t('settings.preferences_title')}</h2>
          <button onClick={() => ui.close('settings')} className="transition-colors" style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
        </div>

        {/* Tabs */}
        <div className="flex text-sm border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)' }}>
          <button onClick={() => setActiveTab('GENERAL')} className="px-6 py-2 font-bold border-b-2 transition-colors" style={{ color: activeTab === 'GENERAL' ? 'var(--accent)' : 'var(--text-tertiary)', borderColor: activeTab === 'GENERAL' ? 'var(--accent)' : 'transparent' }}>{t('settings.tab_general')}</button>
          <button onClick={() => setActiveTab('THEME')} className="px-6 py-2 font-bold border-b-2 transition-colors" style={{ color: activeTab === 'THEME' ? 'var(--accent)' : 'var(--text-tertiary)', borderColor: activeTab === 'THEME' ? 'var(--accent)' : 'transparent' }}>{t('settings.tab_visual')}</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {activeTab === 'GENERAL' ? (
            <>
              {/* AI toggle */}
              <div className="flex items-center justify-between p-4 border rounded-lg" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.1)', borderColor: 'var(--accent)' }}>
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--text-primary)' }}><Cpu size={16} style={{ color: 'var(--accent)' }} /> {t('settings.cognitive_ai')}</div>
                  <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{t('settings.cognitive_ai_desc')}</p>
                </div>
                <input type="checkbox" checked={settings.enableAI} onChange={(e) => executeCommand('setAIEnabled', { aiEnabled: e.target.checked })} className="w-5 h-5 rounded" />
              </div>

              {/* API key */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold uppercase" style={{ color: 'var(--text-tertiary)' }}>{t('settings.api_key')}</label>
                <div className="relative">
                  <input type={showApiKey ? 'text' : 'password'} value={apiKey} onChange={(e) => handleApiKeyChange(e.target.value)} className="w-full px-3 py-2 pr-10 text-sm transition-colors border rounded outline-none focus:ring-1" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)', caretColor: 'var(--accent)' }} placeholder={t('settings.api_key_ph')} />
                  <button onClick={() => setShowApiKey(!showApiKey)} className="absolute -translate-y-1/2 right-3 top-1/2 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block mb-3 text-xs font-bold uppercase" style={{ color: 'var(--text-tertiary)' }}>{t('settings.language_label')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 rounded max-h-[200px] overflow-y-auto custom-scrollbar" style={{ backgroundColor: 'var(--elevated)' }}>
                  {languages.map(lang => (
                    <button key={lang.code} onClick={() => setLanguage(lang.code)} className="py-1.5 px-2 text-[10px] font-medium rounded truncate transition-all" style={i18n.language === lang.code ? { backgroundColor: 'var(--accent)', color: 'var(--text-primary)' } : { color: 'var(--text-tertiary)' }} title={lang.label}>{lang.label}</button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Theme selector dropdown */}
              <div className="relative space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-500">{t('settings.theme_select') || 'Thème actif'}</label>
                
                {/* Dropdown button */}
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-stretch w-full overflow-hidden text-sm font-medium text-left transition-all rounded cursor-pointer"
                  style={{
                    border: '1px solid var(--border)'
                  }}
                >
                  <span
                    className="flex items-center flex-1 px-4 py-2"
                    style={{
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {currentTheme.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                  <span
                    className="flex items-center justify-center px-3"
                    style={{
                      backgroundColor: 'var(--hover)',
                      color: 'var(--primary)'
                    }}
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </span>
                </div>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div
                    className="absolute left-0 right-0 z-50 mt-1 overflow-y-auto rounded shadow-lg top-full max-h-64 custom-scrollbar"
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {/* Theme options */}
                    {Object.keys(THEME_PRESETS).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setTheme(theme as any)}
                        className="w-full px-4 py-2.5 text-sm text-left transition-colors flex items-center"
                        style={{
                          backgroundColor: currentTheme === theme ? 'var(--hover)' : 'transparent',
                          color: currentTheme === theme ? 'var(--text-primary)' : 'var(--text-secondary)'
                        }}
                        onMouseEnter={(e) => {
                          if (currentTheme !== theme) {
                            e.currentTarget.style.backgroundColor = 'var(--elevated)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentTheme !== theme) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {currentTheme === theme && <Check size={16} className="mr-2" />}
                        <span style={{ marginLeft: currentTheme === theme ? 0 : '24px' }}>
                          {theme.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                        </span>
                      </button>
                    ))}
                    {/* Custom option */}
                    <button
                      onClick={() => setTheme('custom')}
                      className="w-full px-4 py-2.5 text-sm text-left transition-colors flex items-center border-t"
                      style={{
                        backgroundColor: currentTheme === 'custom' ? 'var(--hover)' : 'transparent',
                        color: currentTheme === 'custom' ? 'var(--text-primary)' : 'var(--text-secondary)',
                        borderColor: 'var(--divider)'
                      }}
                      onMouseEnter={(e) => {
                        if (currentTheme !== 'custom') {
                          e.currentTarget.style.backgroundColor = 'var(--elevated)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentTheme !== 'custom') {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {currentTheme === 'custom' && <Check size={16} className="mr-2" />}
                      <span style={{ marginLeft: currentTheme === 'custom' ? 0 : '24px' }}>
                        Custom
                      </span>
                    </button>
                  </div>
                )}
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
                
                <div className="p-4 space-y-3 border rounded-lg bg-slate-900/50 border-slate-800">
                  {[
                    { key: 'primary', label: t('settings.primary_color') || 'Couleur primaire' },
                    { key: 'secondary', label: t('settings.secondary_color') || 'Couleur secondaire' },
                    { key: 'accent', label: t('settings.accent_color') || 'Couleur d\'accent' },
                    { key: 'background', label: t('settings.background') || 'Arrière-plan principal' },
                    { key: 'surface', label: t('settings.surface') || 'Surface / Panneaux' },
                    { key: 'elevated', label: t('settings.elevated') || 'Élevé / En-têtes' },
                    { key: 'textPrimary', label: t('settings.text_primary') || 'Texte principal' },
                    { key: 'textSecondary', label: t('settings.text_secondary') || 'Texte secondaire' },
                    { key: 'textTertiary', label: t('settings.text_tertiary') || 'Texte tertiaire' },
                    { key: 'border', label: t('settings.border') || 'Bordures' },
                    { key: 'divider', label: t('settings.divider') || 'Séparateurs' },
                    { key: 'success', label: t('settings.success') || 'Succès' },
                    { key: 'warning', label: t('settings.warning') || 'Avertissement' },
                    { key: 'error', label: t('settings.error') || 'Erreur' },
                    { key: 'info', label: t('settings.info') || 'Information' },
                    { key: 'hover', label: t('settings.hover') || 'Survol' },
                    { key: 'active', label: t('settings.active') || 'Actif' },
                    { key: 'disabled', label: t('settings.disabled') || 'Désactivé' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between gap-4">
                      <label className="flex-1 text-sm text-slate-300">{label}</label>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 font-mono min-w-[60px] text-right">
                          {settings.customTheme?.[key as keyof typeof DEFAULT_CUSTOM] || DEFAULT_CUSTOM[key as keyof typeof DEFAULT_CUSTOM]}
                        </span>
                        <div className="relative w-10 h-10 overflow-hidden transition-colors border-2 rounded border-slate-700 hover:border-blue-500">
                          <input
                            type="color"
                            value={settings.customTheme?.[key as keyof typeof DEFAULT_CUSTOM] || DEFAULT_CUSTOM[key as keyof typeof DEFAULT_CUSTOM]}
                            onChange={(e) => handleCustomUpdate(key as keyof typeof DEFAULT_CUSTOM, e.target.value)}
                            className="absolute border-0 outline-none cursor-pointer"
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
        <div className="flex justify-end p-4 border-t" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <CompactButton
            onClick={() => ui.close('settings')}
            variant="solid"
            color="var(--accent)"
            icon={<Check size={14} />}
            label="OK"
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
