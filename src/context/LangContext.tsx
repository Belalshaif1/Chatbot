import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../i18n/en';
import ar from '../i18n/ar';
import type { TranslationKeys } from '../i18n/en';

type Lang = 'en' | 'ar';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TranslationKeys;
  isRTL: boolean;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

const translations: Record<Lang, TranslationKeys> = { en, ar };

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('bc_lang') as Lang) || 'en';
  });

  const isRTL = lang === 'ar';

  // Apply RTL direction and lang to <html>
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }, [lang, isRTL]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('bc_lang', l);
  };

  const t = translations[lang];

  return (
    <LangContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
};
