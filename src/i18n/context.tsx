import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { I18nextProvider, useTranslation as useI18nextTranslation } from 'react-i18next';
import i18n, { LanguageCode, LanguageInfo, SUPPORTED_LANGUAGES, resources } from './config';

export type { LanguageCode, LanguageInfo };
export { SUPPORTED_LANGUAGES };

export interface I18nContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  changeLanguage: (lang: LanguageCode) => Promise<void>;
  supportedLanguages: LanguageInfo[];
  currentLanguageInfo: LanguageInfo;
  t: (key: string, options?: Record<string, any>) => string;
  tNs: (namespace: string, key: string, options?: Record<string, any>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => {
    const active = (i18n.language || 'en').slice(0, 2) as LanguageCode;
    return ['en', 'hi', 'te'].includes(active) ? active : 'en';
  });

  const changeLanguage = async (lang: LanguageCode) => {
    await i18n.changeLanguage(lang);
    setCurrentLang(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('kaushal_lang', lang);
    }
  };

  useEffect(() => {
    const handleLangChange = (lng: string) => {
      const code = lng.slice(0, 2) as LanguageCode;
      if (['en', 'hi', 'te'].includes(code)) {
        setCurrentLang(code);
      }
    };
    i18n.on('languageChanged', handleLangChange);
    return () => {
      i18n.off('languageChanged', handleLangChange);
    };
  }, []);

  const currentLanguageInfo = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLang) ||
      SUPPORTED_LANGUAGES[0]
    );
  }, [currentLang]);

  const value: I18nContextType = useMemo(
    () => ({
      language: currentLang,
      setLanguage: changeLanguage,
      changeLanguage,
      supportedLanguages: SUPPORTED_LANGUAGES,
      currentLanguageInfo,
      t: (key: string, options?: Record<string, any>) => {
        return i18n.t(key, options);
      },
      tNs: (namespace: string, key: string, options?: Record<string, any>) => {
        return i18n.t(`${namespace}:${key}`, options);
      },
    }),
    [currentLang, currentLanguageInfo]
  );

  return (
    <I18nextProvider i18n={i18n}>
      <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
    </I18nextProvider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Also export standard useTranslation hook from react-i18next
export { useI18nextTranslation as useTranslation };
