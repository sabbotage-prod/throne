import { useState, useEffect, useCallback } from 'react';
import en from '../i18n/en.json';
import fr from '../i18n/fr.json';
import es from '../i18n/es.json';

const translations = { en, fr, es };

const STORAGE_KEY = 'throne-language';

// Detect browser language
const detectLanguage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && translations[stored]) return stored;
  
  const browserLang = navigator.language.slice(0, 2);
  if (translations[browserLang]) return browserLang;
  
  return 'en';
};

export const useTranslation = () => {
  const [language, setLanguageState] = useState(detectLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang) => {
    if (translations[lang]) {
      setLanguageState(lang);
    }
  }, []);

  // Get nested translation value
  const t = useCallback((key, replacements = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation missing: ${key}`);
      return key;
    }
    
    // Replace placeholders like {count}
    return value.replace(/{(\w+)}/g, (_, k) => replacements[k] ?? `{${k}}`);
  }, [language]);

  return {
    t,
    language,
    setLanguage,
    languages: [
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'es', name: 'Español', flag: '🇪🇸' }
    ]
  };
};

export default useTranslation;
