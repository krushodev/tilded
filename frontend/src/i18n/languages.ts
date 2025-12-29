export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' }
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

export const getLanguageName = (code: string): string => {
  const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
  return lang?.nativeName || code;
};

export const getDateLocale = (languageCode: string): string => {
  const localeMap: Record<string, string> = {
    en: 'en-US',
    es: 'es-ES',
    zh: 'zh-CN',
    hi: 'hi-IN',
    ar: 'ar-SA',
    pt: 'pt-BR',
    fr: 'fr-FR',
    de: 'de-DE',
    ja: 'ja-JP',
    ru: 'ru-RU'
  };
  return localeMap[languageCode] || 'en-US';
};

// Alias para usar con el calendario de React Aria/HeroUI
export const getCalendarLocale = getDateLocale;

