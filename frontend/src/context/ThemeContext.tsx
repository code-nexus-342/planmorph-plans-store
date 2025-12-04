import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  isCompact: boolean;
}

const defaultSettings: ThemeSettings = {
  primaryColor: '#00E0C6', // Neon Cyan
  accentColor: '#FF0080', // Electric Pink
  backgroundColor: '#050505', // Deepest Black
  isCompact: false,
};

interface ThemeContextType {
  settings: ThemeSettings;
  updateTheme: (newSettings: Partial<ThemeSettings>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const savedSettings = localStorage.getItem('planmorph-theme-settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : '0 0 0';
  };

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Apply colors as CSS variables (converted to RGB channels)
    root.style.setProperty('--color-primary', hexToRgb(settings.primaryColor));
    root.style.setProperty('--color-accent', hexToRgb(settings.accentColor));
    root.style.setProperty('--color-background', hexToRgb(settings.backgroundColor));
    
    // Apply layout settings
    if (settings.isCompact) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
    
    // Save to local storage
    localStorage.setItem('planmorph-theme-settings', JSON.stringify(settings));
  }, [settings]);

  const updateTheme = (newSettings: Partial<ThemeSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetTheme = () => {
    setSettings(defaultSettings);
  };

  return (
    <ThemeContext.Provider value={{ settings, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
