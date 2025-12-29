import { useEffect } from "react";
const THEMES = {
  dark: {
    primary: '#A78BFA',
    secondary: '#0B1019',
    accent: '#1D4ED8',
    background: '#0E1118',
    surface: '#151B26',
    elevated: '#1C2332',
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
    primary: '#704F34',
    secondary: '#EDE5D9',
    accent: '#C17A4F',
    background: '#FAF8F4',
    surface: '#F3EFEA',
    elevated: '#EBE5DE',
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
};

export const useTheme = (themeName: string, customTheme?: any) => {
  useEffect(() => {
    const theme =
      themeName === "custom" && customTheme
        ? customTheme
        : THEMES[themeName as keyof typeof THEMES] || THEMES.dark;
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--background", theme.background);
    root.style.setProperty("--surface", theme.surface);
    root.style.setProperty("--elevated", theme.elevated);
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
