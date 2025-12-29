import { createCalendar } from '@internationalized/date';

// Mapeo de códigos de idioma a locales del calendario
export const getCalendarLocale = (languageCode: string): string => {
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

// Crear un calendario con el idioma apropiado
export const createLocalizedCalendar = (locale: string) => {
  return createCalendar(new Intl.Locale(locale));
};

