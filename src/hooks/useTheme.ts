import { useEffect } from "react";
const THEMES = {
  dark: {
    primary: '#A78BFA',
    secondary: '#0B1019',
    accent: '#1D4ED8',
    background: '#0E1118',
    surface: '#151B26',
    elevated: '#1C2332',
    inputField: '#1C2332',
    textPrimary: '#E5E9F2',
    textSecondary: '#A7B3C6',
    textTertiary: '#7B8499',
    border: '#242C3A',
    divider: '#1B2230',
    success: '#35C48D',
    warning: '#F0C35B',
    error: '#EE6D7A',
    info: '#6CB6FF',
    hover: '#3A4A66',
    disabled: '#3A3F4D',
    textInfo: "Dark theme tuned for soft contrast, clear hierarchy, and comfortable reading.",
  },
  cappuccino: {
    primary: '#0EA5A9',
    secondary: '#EDE5D9',
    accent: '#C17A4F',
    background: '#FAF8F4',
    surface: '#F3EFEA',
    elevated: '#EBE5DE',
    inputField: '#3A2A1F',
    textPrimary: '#2D1F15',
    textSecondary: '#5C4A3D',
    textTertiary: '#8B7765',
    border: '#D9CFC4',
    divider: '#E5DCC9',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0284C7',
    hover: '#E0D5C7',
    disabled: '#C4B5A0',
    textInfo: "A warm cream theme with excellent contrast for readability.",
  },
  // Light (CLAIRE)
  'cottage-core': {
    primary: '#7C3AED',
    secondary: '#F0E8DC',
    accent: '#7BAA6F',
    background: '#FAF7F2',
    surface: '#F3EEE6',
    elevated: '#ECE6DE',
    inputField: '#2F2A22',
    textPrimary: '#2C2A26',
    textSecondary: '#60584F',
    textTertiary: '#9A9186',
    border: '#DCD4C8',
    divider: '#E6DFD5',
    success: '#2E8B57',
    warning: '#C0853F',
    error: '#C44949',
    info: '#3F82A8',
    hover: '#E9E3DA',
    disabled: '#C8C0B6',
    textInfo: 'Warm natural palette evoking cottage comfort.'
  },
  'valinor': {
    primary: '#8A2BE2',
    secondary: '#EAF3FA',
    accent: '#9CCEF5',
    background: '#F7FBFF',
    surface: '#F0F7FD',
    elevated: '#E7F2FB',
    inputField: '#17212B',
    textPrimary: '#1E2A33',
    textSecondary: '#5A6C79',
    textTertiary: '#8A9AA6',
    border: '#D5E3F0',
    divider: '#E3EEF7',
    success: '#2EA36A',
    warning: '#D2993B',
    error: '#D14646',
    info: '#3BA1D6',
    hover: '#EAF3FA',
    disabled: '#C9DAE8',
    textInfo: 'Icy clarity with crisp contrast.'
  },
  // Dark (Obscure)
  'murasaki': {
    primary: '#22D3EE',
    secondary: '#1A1225',
    accent: '#8559F2',
    background: '#0C0813',
    surface: '#130E1D',
    elevated: '#1B1427',
    inputField: '#1B1427',
    textPrimary: '#F1E8FF',
    textSecondary: '#C3B1E6',
    textTertiary: '#9585B8',
    border: '#2E2242',
    divider: '#211833',
    success: '#34D399',
    warning: '#F59E0B',
    error: '#F87171',
    info: '#A48BFF',
    hover: '#241B32',
    disabled: '#3A2E50',
    textInfo: 'Violet-black with layered purples, no blue tones.'
  },
  'fruity-loop': {
    primary: '#72E06C',
    secondary: '#1F2228',
    accent: '#FF7A00',
    background: '#121417',
    surface: '#191C21',
    elevated: '#20242A',
    inputField: '#20242A',
    textPrimary: '#F1F3F5',
    textSecondary: '#AEB4BC',
    textTertiary: '#868D96',
    border: '#2B2F36',
    divider: '#1D2026',
    success: '#72E06C',
    warning: '#F0B429',
    error: '#E64A4A',
    info: '#8AB7FF',
    hover: '#252A32',
    disabled: '#3A3F47',
    textInfo: 'Dark gray FL Studio-inspired chrome with citrus/green accents.'
  },
  // Colorful
  
  'madoka': {
    primary: '#BFA6FF',
    secondary: '#FFEFF6',
    accent: '#FF85B3',
    background: '#FFF7FB',
    surface: '#FFEFF6',
    elevated: '#FFE6F1',
    inputField: '#2A1E29',
    textPrimary: '#3A2A36',
    textSecondary: '#6E586A',
    textTertiary: '#988497',
    border: '#F2D6E5',
    divider: '#F7DFEC',
    success: '#48C78E',
    warning: '#F0B557',
    error: '#E6757D',
    info: '#8AB9F7',
    hover: '#F7E8F0',
    disabled: '#DBC9D3',
    textInfo: 'Pastel candy with strong legibility.'
  },
  'tangerine': {
    primary: '#2563EB',
    secondary: '#FFF1E3',
    accent: '#FFB347',
    background: '#FFFBF7',
    surface: '#FFF3E8',
    elevated: '#FFE8D5',
    inputField: '#2B180C',
    textPrimary: '#2A1A0E',
    textSecondary: '#5C3E2A',
    textTertiary: '#8A6A52',
    border: '#E7D1C0',
    divider: '#F1DDCE',
    success: '#3FA65B',
    warning: '#D9822B',
    error: '#D75745',
    info: '#5FA7DE',
    hover: '#FFE7D0',
    disabled: '#CBB5A4',
    textInfo: 'Light autumn oranges with high contrast.',
  },
};
export const useTheme = (themeName: string, customTheme?: any) => {
  useEffect(() => {
    const normalized = themeName === 'kawaii' ? 'madoka' : themeName;
    const theme =
      normalized === "custom" && customTheme
        ? customTheme
        : THEMES[normalized as keyof typeof THEMES] || THEMES.dark;
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--background", theme.background);
    root.style.setProperty("--surface", theme.surface);
    root.style.setProperty("--elevated", theme.elevated);
    if ((theme as any).inputField) {
      root.style.setProperty("--inputfield", (theme as any).inputField);
    }
    root.style.setProperty("--text-primary", theme.textPrimary);
    root.style.setProperty("--text-secondary", theme.textSecondary);
    root.style.setProperty("--text-tertiary", theme.textTertiary);
    root.style.setProperty("--border", theme.border);
    root.style.setProperty("--divider", theme.divider);
    root.style.setProperty("--success", theme.success);
    root.style.setProperty("--warning", theme.warning);
    root.style.setProperty("--error", theme.error);
    root.style.setProperty("--info", theme.info);
    root.style.setProperty("--hover", theme.hover);
    root.style.setProperty("--disabled", theme.disabled);
  }, [themeName, customTheme]);
};
