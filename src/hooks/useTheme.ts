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
    primary: '#CC9B7A',
    secondary: '#191918',
    accent: '#D97757',
    background: '#F4F1ED',
    surface: '#FFFFFF',
    elevated: '#FFFFFF',
    textPrimary: '#191918',
    textSecondary: '#5C5C5A',
    textTertiary: '#8E8E8C',
    border: '#E6E3DE',
    divider: '#D4CFC7',
    success: '#2D9F7C',
    warning: '#E89C3F',
    error: '#D14343',
    info: '#5B8DBE',
    hover: '#B88762',
    disabled: '#BFBBB5',
    textInfo: "A warm and cozy light theme inspired by a perfect cup of cappuccino.",
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
