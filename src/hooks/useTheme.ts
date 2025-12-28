import { useEffect } from "react";
const THEMES = {
  dark: {
    bgMain: "#121212",
    bgPanel: "#1e1e1e",
    text1: "#f1f5f9",
    text2: "#94a3b8",
    textInfo: "10px",
    accent: "#3b82f6",
  },
  cappuccino: {
    bgMain: "#f5f1ee",
    bgPanel: "#ede8e3",
    text1: "#3d3935",
    text2: "#8b7d75",
    textInfo: "10px",
    accent: "#c17a4a",
  },
  "tokyo-night": {
    bgMain: "#1a1b26",
    bgPanel: "#24283b",
    text1: "#a9b1d6",
    text2: "#565f89",
    textInfo: "10px",
    accent: "#7aa2f7",
  },
};

export const useTheme = (themeName: string, customTheme?: any) => {
  useEffect(() => {
    const theme =
      themeName === "custom" && customTheme
        ? customTheme
        : THEMES[themeName as keyof typeof THEMES] || THEMES.dark;
    const root = document.documentElement;
    root.style.setProperty("--bg-main", theme.bgMain);
    root.style.setProperty("--bg-panel", theme.bgPanel);
    root.style.setProperty("--text-1", theme.text1);
    root.style.setProperty("--text-2", theme.text2);
    root.style.setProperty("--text-info", theme.textInfo || "10px");
    root.style.setProperty("--accent", theme.accent);
    
    // Compute interactive state colors based on theme
    // For dark themes: use bgPanel for hover/focus
    // For light themes: use bgPanel as well (slightly darker/lighter than bgMain)
    root.style.setProperty("--bg-hover", theme.bgPanel);
    
    // Selected/active state uses accent color
    root.style.setProperty("--bg-active", theme.accent);
    
    // Border color: use text2 with opacity for a subtle border
    root.style.setProperty("--border-color", theme.text2);
    
    // Header background (similar to bgPanel for consistency)
    root.style.setProperty("--bg-header", theme.bgPanel);
  }, [themeName, customTheme]);
};
