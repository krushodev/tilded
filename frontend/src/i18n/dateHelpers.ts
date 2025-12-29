import { getDateLocale } from './languages';

export const formatDate = (date: Date | string | null, locale: string, options?: Intl.DateTimeFormatOptions): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const dateLocale = getDateLocale(locale);
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options
  };
  
  return dateObj.toLocaleDateString(dateLocale, defaultOptions);
};

export const formatDateTime = (date: Date | string | null, locale: string): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const dateLocale = getDateLocale(locale);
  
  return dateObj.toLocaleString(dateLocale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeDate = (date: Date | string | null, locale: string, t: (key: string) => string): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(dateObj);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return t('date.today');
  if (diffDays === 1) return t('date.tomorrow');
  if (diffDays === -1) return 'Yesterday';
  
  return formatDate(date, locale, { day: 'numeric', month: 'short' });
};

