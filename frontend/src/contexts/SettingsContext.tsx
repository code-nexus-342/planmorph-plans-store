"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  currency: string;
  
  // Account Settings
  email_notifications: boolean;
  marketing_emails: boolean;
  push_notifications: boolean;
  
  // Privacy Settings
  profile_visibility: 'public' | 'private' | 'friends';
  show_activity: boolean;
  show_purchases: boolean;
  
  // Download Settings
  auto_download: boolean;
  download_quality: 'standard' | 'high' | 'premium';
  download_format: 'pdf' | 'dwg' | 'both';
  
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showOnlineStatus: boolean;
    allowDirectMessages: boolean;
  };
}

const defaultSettings: UserSettings = {
  theme: 'light',
  language: 'en',
  timezone: 'UTC',
  currency: 'USD',
  
  // Account Settings
  email_notifications: true,
  marketing_emails: false,
  push_notifications: true,
  
  // Privacy Settings
  profile_visibility: 'public',
  show_activity: true,
  show_purchases: false,
  
  // Download Settings
  auto_download: false,
  download_quality: 'standard',
  download_format: 'pdf',
  
  notifications: {
    email: true,
    push: true,
    marketing: false,
  },
  privacy: {
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowDirectMessages: true,
  },
};

interface SettingsContextType {
  settings: UserSettings;
  updateSetting: (key: keyof UserSettings, value: any) => void;
  updateNestedSetting: (section: keyof Pick<UserSettings, 'notifications' | 'privacy'>, key: string, value: any) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('user_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    if (isLoading) return;

    const applyTheme = (theme: string) => {
      const root = document.documentElement;
      const body = document.body;
      
      // Remove existing theme classes
      root.classList.remove('light', 'dark');
      body.classList.remove('light', 'dark');
      
      if (theme === 'auto') {
        // Use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const appliedTheme = prefersDark ? 'dark' : 'light';
        root.classList.add(appliedTheme);
        body.classList.add(appliedTheme);
        root.setAttribute('data-theme', appliedTheme);
      } else {
        root.classList.add(theme);
        body.classList.add(theme);
        root.setAttribute('data-theme', theme);
      }
    };

    applyTheme(settings.theme);

    // Listen for system theme changes when auto is selected
    if (settings.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme(settings.theme);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme, isLoading]);

  // Apply language changes
  useEffect(() => {
    if (isLoading) return;
    document.documentElement.lang = settings.language;
  }, [settings.language, isLoading]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoading) return;
    try {
      localStorage.setItem('user_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [settings, isLoading]);

  const updateSetting = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNestedSetting = (section: keyof Pick<UserSettings, 'notifications' | 'privacy'>, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('user_settings');
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSetting,
      updateNestedSetting,
      resetSettings,
      isLoading
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// Currency formatter utility
export function formatCurrency(amount: number, currency: string = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error) {
    // Fallback to USD if currency is invalid
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
}

// Time formatter utility
export function formatTime(date: Date, timezone: string = 'UTC') {
  try {
    return date.toLocaleString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  } catch (error) {
    // Fallback to UTC if timezone is invalid
    return date.toLocaleString('en-US', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  }
}

// Date formatter utility
export function formatDate(date: Date, timezone: string = 'UTC') {
  try {
    return date.toLocaleDateString('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    // Fallback to UTC if timezone is invalid
    return date.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
