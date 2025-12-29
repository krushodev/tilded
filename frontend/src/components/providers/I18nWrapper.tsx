import { useTranslation } from 'react-i18next';
import { I18nProvider } from '@react-aria/i18n';
import { getCalendarLocale } from '@/i18n/languages';

interface I18nWrapperProps {
  children: React.ReactNode;
}

export const I18nWrapper = ({ children }: I18nWrapperProps) => {
  const { i18n } = useTranslation();

  // The component will automatically re-render when i18n.language changes
  // because useTranslation hook triggers re-renders on language changes
  return (
    <I18nProvider locale={getCalendarLocale(i18n.language)}>
      {children}
    </I18nProvider>
  );
};

