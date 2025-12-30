import React, { useState, useEffect } from 'react';
import { X, Moon, Sun, Cpu, Palette, Download, Upload, Check, Eye, EyeOff, HelpCircle, ExternalLink, ChevronLeft, ChevronDown } from 'lucide-react';
import { useTranslation, languages } from '../i18n';
import { useUI } from '../ui/UIContext';
import { AppSettings } from '../types';
import { DEFAULT_CUSTOM } from '../constants';
import { isApiKeySet, getApiKey } from '../services/geminiService';
import { useCommandExecutor } from '../state/commandStore';
import { Card, Section, CompactButton, ToggleButton, FormField, Modal } from './ui';

// Presets de thèmes pour copie dans custom
const THEME_PRESETS = {
  dark: {
    primary: "#A78BFA",
    secondary: "#0B1019",
    accent: "#1D4ED8",
    background: "#0E1118",
    surface: "#151B26",
    elevated: "#1C2332",
    inputField: "#1C2332",
    textPrimary: "#E5E9F2",
    textSecondary: "#A7B3C6",
    textTertiary: "#7B8499",
    border: "#242C3A",
    divider: "#1B2230",
    success: "#35C48D",
    warning: "#F0C35B",
    error: "#EE6D7A",
    info: "#6CB6FF",
    hover: "#3A4A66",
    disabled: "#3A3F4D",
  },
  cappuccino: {
    primary: "#0EA5A9",
    secondary: "#EDE5D9",
    accent: "#C17A4F",
    background: "#FAF8F4",
    surface: "#F3EFEA",
    elevated: "#EBE5DE",
    inputField: "#3A2A1F",
    textPrimary: "#2D1F15",
    textSecondary: "#5C4A3D",
    textTertiary: "#8B7765",
    border: "#D9CFC4",
    divider: "#E5DCC9",
    success: "#059669",
    warning: "#D97706",
    error: "#DC2626",
    info: "#0284C7",
    hover: "#E0D5C7",
    disabled: "#C4B5A0",
  },
  // Light (CLAIRE)
  'cottage-core': {
    primary: "#7C3AED",
    secondary: "#F0E8DC",
    accent: "#7BAA6F",
    background: "#FAF7F2",
    surface: "#F3EEE6",
    elevated: "#ECE6DE",
    inputField: "#2F2A22",
    textPrimary: "#2C2A26",
    textSecondary: "#60584F",
    textTertiary: "#9A9186",
    border: "#DCD4C8",
    divider: "#E6DFD5",
    success: "#2E8B57",
    warning: "#C0853F",
    error: "#C44949",
    info: "#3F82A8",
    hover: "#E9E3DA",
    disabled: "#C8C0B6",
  },
  'valinor': {
    primary: "#8A2BE2",
    secondary: "#EAF3FA",
    accent: "#9CCEF5",
    background: "#F7FBFF",
    surface: "#F0F7FD",
    elevated: "#E7F2FB",
    inputField: "#17212B",
    textPrimary: "#1E2A33",
    textSecondary: "#5A6C79",
    textTertiary: "#8A9AA6",
    border: "#D5E3F0",
    divider: "#E3EEF7",
    success: "#2EA36A",
    warning: "#D2993B",
    error: "#D14646",
    info: "#3BA1D6",
    hover: "#EAF3FA",
    disabled: "#C9DAE8",
  },
  // Dark (Obscure)
  'murasaki': {
    primary: "#22D3EE",
    secondary: "#1A1225",
    accent: "#8559F2",
    background: "#0C0813",
    surface: "#130E1D",
    elevated: "#1B1427",
    inputField: "#1B1427",
    textPrimary: "#F1E8FF",
    textSecondary: "#C3B1E6",
    textTertiary: "#9585B8",
    border: "#2E2242",
    divider: "#211833",
    success: "#34D399",
    warning: "#F59E0B",
    error: "#F87171",
    info: "#A48BFF",
    hover: "#241B32",
    disabled: "#3A2E50",
  },
  'fruity-loop': {
    primary: "#72E06C",
    secondary: "#1F2228",
    accent: "#FF7A00",
    background: "#121417",
    surface: "#191C21",
    elevated: "#20242A",
    inputField: "#20242A",
    textPrimary: "#F1F3F5",
    textSecondary: "#AEB4BC",
    textTertiary: "#868D96",
    border: "#2B2F36",
    divider: "#1D2026",
    success: "#72E06C",
    warning: "#F0B429",
    error: "#E64A4A",
    info: "#8AB7FF",
    hover: "#252A32",
    disabled: "#3A3F47",
  },
  // Colorful
  'tangerine': {
    primary: "#2563EB",
    secondary: "#FFF1E3",
    accent: "#FFB347",
    background: "#FFFBF7",
    surface: "#FFF3E8",
    elevated: "#FFE8D5",
    inputField: "#2B180C",
    textPrimary: "#2A1A0E",
    textSecondary: "#5C3E2A",
    textTertiary: "#8A6A52",
    border: "#E7D1C0",
    divider: "#F1DDCE",
    success: "#3FA65B",
    warning: "#D9822B",
    error: "#D75745",
    info: "#5FA7DE",
    hover: "#FFE7D0",
    disabled: "#CBB5A4",
  },
  'madoka': {
    primary: "#BFA6FF",
    secondary: "#FFEFF6",
    accent: "#FF85B3",
    background: "#FFF7FB",
    surface: "#FFEFF6",
    elevated: "#FFE6F1",
    inputField: "#2A1E29",
    textPrimary: "#3A2A36",
    textSecondary: "#6E586A",
    textTertiary: "#988497",
    border: "#F2D6E5",
    divider: "#F7DFEC",
    success: "#48C78E",
    warning: "#F0B557",
    error: "#E6757D",
    info: "#8AB9F7",
    hover: "#F7E8F0",
    disabled: "#DBC9D3",
  },
  
};

interface SettingsModalProps {
  settings: AppSettings;
  updateSettings: (settings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, updateSettings }) => {
  // All hooks must be called before any conditional return!
  const ui = useUI();
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

  // Only now, after all hooks, do the conditional return
  if (!ui.isOpen('settings')) return null;

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
    <Modal
      isOpen={ui.isOpen('settings')}
      onClose={() => ui.close('settings')}
      title={t('settings.preferences_title')}
      icon={<Palette size={20} />}
      maxWidth="max-w-lg"
    >
        {/* Tabs */}
        <div className="flex px-6 -mx-6 text-sm border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--elevated)' }}>
          <ToggleButton
            isActive={activeTab === 'GENERAL'}
            onClick={() => setActiveTab('GENERAL')}
            label={t('settings.tab_general')}
            position="first"
          />
          <ToggleButton
            isActive={activeTab === 'THEME'}
            onClick={() => setActiveTab('THEME')}
            label={t('settings.tab_visual')}
            position="last"
          />
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'GENERAL' ? (
            <>
              {/* AI toggle */}
              <div className="flex items-center justify-between p-4 border rounded-lg" style={{ backgroundColor: 'rgb(from var(--accent) r g b / 0.1)', borderColor: 'var(--accent)' }}>
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--text-primary)' }}><Cpu size={16} style={{ color: 'var(--accent)' }} /> {t('settings.cognitive_ai')}</div>
                  <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{t('settings.cognitive_ai_desc')}</p>
                </div>
                <input type="checkbox" checked={settings.enableAI} onChange={(e) => executeCommand('setAIEnabled', { aiEnabled: e.target.checked })} className="w-5 h-5 rounded" />
              </div>

              {/* API key */}
              <FormField label={t('settings.api_key')}>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    className="w-full px-3 py-2 pr-10 text-sm transition-colors border rounded outline-none focus:ring-1"
                    style={{ backgroundColor: 'var(--inputfield)', borderColor: 'var(--border)', color: 'var(--text-primary)', caretColor: 'var(--accent)' }}
                    placeholder={t('settings.api_key_ph')}
                  />
                  <CompactButton
                    onClick={() => setShowApiKey(!showApiKey)}
                    variant="ghost"
                    color="var(--text-secondary)"
                    icon={showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    label=""
                    className="absolute -translate-y-1/2 right-1.5 top-1/2"
                  />
                </div>
              </FormField>

              {/* Language */}
              <div>
                <label className="block mb-3 text-xs font-bold uppercase" style={{ color: 'var(--text-tertiary)' }}>{t('settings.language_label')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 rounded max-h-[200px] overflow-y-auto custom-scrollbar" style={{ backgroundColor: 'var(--elevated)' }}>
                  {languages.map(lang => (
                    <CompactButton
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      variant={i18n.language === lang.code ? 'solid' : 'ghost'}
                      color="var(--accent)"
                      icon={null}
                      label={lang.label}
                      className="justify-center text-[10px]"
                    />
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
                      color: 'var(--accent)'
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
                    <CompactButton
                      onClick={exportTheme}
                      variant="ghost"
                      color="var(--text-secondary)"
                      icon={<Download size={14} />}
                      label=""
                      className="p-1.5"
                    />
                    <label className="cursor-pointer">
                      <CompactButton
                        onClick={() => {}}
                        variant="ghost"
                        color="var(--text-secondary)"
                        icon={<Upload size={14} />}
                        label=""
                        className="p-1.5"
                      />
                      <input
                        type="file"
                        accept=".json"
                        onChange={importTheme}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                
                <div className="p-4 space-y-3 border rounded-lg" style={{ backgroundColor: 'rgb(from var(--background) r g b / 0.5)', borderColor: 'var(--border)' }}>
                  {[
                    { key: 'primary', label: t('settings.primary_color') || 'Couleur primaire' },
                    { key: 'secondary', label: t('settings.secondary_color') || 'Couleur secondaire' },
                    { key: 'accent', label: t('settings.accent_color') || 'Couleur d\'accent' },
                    { key: 'background', label: t('settings.background') || 'Arrière-plan principal' },
                    { key: 'surface', label: t('settings.surface') || 'Surface / Panneaux' },
                    { key: 'elevated', label: t('settings.elevated') || 'Élevé / En-têtes' },
                    { key: 'inputField', label: t('settings.inputfield') || 'Champ de saisie' },
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
                      <label className="flex-1 text-sm" style={{ color: 'var(--text-primary)' }}>{label}</label>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono min-w-[60px] text-right" style={{ color: 'var(--text-tertiary)' }}>
                          {settings.customTheme?.[key as keyof typeof DEFAULT_CUSTOM] || DEFAULT_CUSTOM[key as keyof typeof DEFAULT_CUSTOM]}
                        </span>
                        <div className="relative w-10 h-10 overflow-hidden transition-colors border-2 rounded hover:border-[var(--accent)]" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
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
    </Modal>
  );
};

export default SettingsModal;
