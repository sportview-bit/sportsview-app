// src/context/LanguageContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { translations, type Language } from '../i18n/translations';

const LanguageContext = createContext<{ lang: Language; setLang: (l: Language) => void; t: (key: string) => string }>({
  lang: 'sw',
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default language is Kiswahili, per product requirement.
  const [lang, setLangState] = useState<Language>(() => (localStorage.getItem('svtz_lang') as Language) || 'sw');

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('svtz_lang', l);
  };

  const t = (key: string) => translations[lang][key] ?? key;

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
