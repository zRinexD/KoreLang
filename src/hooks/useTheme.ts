import { useEffect } from "react";
const THEMES = {
  dark: {
    primary: '#2563EB',
    secondary: '#0A0A0A',
    accent: '#1D4ED8',
    background: '#121212',
    surface: '#1E1E1E',
    elevated: '#262626',
    textPrimary: '#FFFFFF',
    textSecondary: '#A3A3A3',
    textTertiary: '#525252',
    border: '#404040',
    divider: '#262626',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    hover: '#2563EB',
    active: '#1D4ED8',
    disabled: '#404040',
    textInfo: "A minimalistic dark theme perfect for focused work in low-light environments.",
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
    active: '#A67756',
    disabled: '#BFBBB5',
    textInfo: "A warm and cozy light theme inspired by a perfect cup of cappuccino.",
  },
  quenya: {
    primary: '#8B4513',
    secondary: '#2C3E50',
    accent: '#8B4513',
    background: '#F5EDE1',
    surface: '#FFFBF5',
    elevated: '#F5EDE1',
    textPrimary: '#2C3E50',
    textSecondary: '#7D6B5A',
    textTertiary: '#7B5E3B',
    border: '#D4AF37',
    divider: '#C9A227',
    success: '#2E7D32',
    warning: '#D4AF37',
    error: '#C62828',
    info: '#8B4513',
    hover: '#654321',
    active: '#5A3A1A',
    disabled: '#C9B8A2',
    textInfo: "Inspired by elegant Elven parchments with warm gold accents.",
  },
  "tokyo-night": {
    primary: '#BB9AF7',
    secondary: '#16161E',
    accent: '#7AA2F7',
    background: '#1A1B26',
    surface: '#24283B',
    elevated: '#2F3347',
    textPrimary: '#A9B1D6',
    textSecondary: '#565F89',
    textTertiary: '#414868',
    border: '#414868',
    divider: '#2A2E3F',
    success: '#73DACA',
    warning: '#FF9E64',
    error: '#F7768E',
    info: '#7AA2F7',
    hover: '#89B4FA',
    active: '#6891E6',
    disabled: '#3B4261',
    textInfo: "Inspired by the neon lights of Tokyo's night skyline, combining deep blues with vibrant accents.",
  },
  neon: {
    primary: '#FF006E',
    secondary: '#2D3561',
    accent: '#FF006E',
    background: '#0A0E27',
    surface: '#131736',
    elevated: '#1B2148',
    textPrimary: '#E0E7FF',
    textSecondary: '#94A3D8',
    textTertiary: '#6B729D',
    border: '#2D3561',
    divider: '#1B2148',
    success: '#00F5D4',
    warning: '#FFBE0B',
    error: '#FF006E',
    info: '#8338EC',
    hover: '#D60058',
    active: '#B3004A',
    disabled: '#4B5078',
    textInfo: "A bold cyberpunk neon palette with high-contrast glows.",
  },
  edgerunner: {
    primary: '#FCEE0A',
    secondary: '#0C0D14',
    accent: '#FCEE0A',
    background: '#0C0D14',
    surface: '#16171F',
    elevated: '#1F202B',
    textPrimary: '#FCEE0A',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    border: '#3A3B47',
    divider: '#23242F',
    success: '#00FF9F',
    warning: '#FF9500',
    error: '#FF003C',
    info: '#00D9FF',
    hover: '#FFFF33',
    active: '#E6D900',
    disabled: '#2D2F3A',
    textInfo: "Night City chrome palette with electric yellow accents and cool neon status colors.",
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
    root.style.setProperty("--active", theme.active);
    root.style.setProperty("--disabled", theme.disabled);
  }, [themeName, customTheme]);
};
