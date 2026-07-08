'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type FontSize = 'normal' | 'large' | 'xlarge';

interface SettingsContextType {
  fontSize: FontSize;
  highContrast: boolean;
  locale: string;
  setFontSize: (size: FontSize) => void;
  setHighContrast: (val: boolean) => void;
  setLocale: (lang: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [locale, setLocale] = useState('en');

  // Load preferences from localStorage on client side
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fan_font_size') as FontSize;
    const savedContrast = localStorage.getItem('fan_high_contrast') === 'true';
    const savedLocale = localStorage.getItem('fan_locale') || 'en';

    if (savedFontSize) setFontSize(savedFontSize);
    setHighContrast(savedContrast);
    if (savedLocale) setLocale(savedLocale);
  }, []);

  const updateFontSize = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem('fan_font_size', size);
  };

  const updateHighContrast = (val: boolean) => {
    setHighContrast(val);
    localStorage.setItem('fan_high_contrast', String(val));
  };

  const updateLocale = (lang: string) => {
    setLocale(lang);
    localStorage.setItem('fan_locale', lang);
  };

  return (
    <SettingsContext.Provider value={{
      fontSize,
      highContrast,
      locale,
      setFontSize: updateFontSize,
      setHighContrast: updateHighContrast,
      setLocale: updateLocale
    }}>
      <div className={`
        min-h-screen flex flex-col
        ${highContrast ? 'contrast-high bg-black text-white border-white' : 'bg-slate-950 text-slate-100'}
        ${fontSize === 'large' ? 'text-lg' : fontSize === 'xlarge' ? 'text-xl' : 'text-sm'}
      `}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
