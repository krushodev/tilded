import { useState } from 'react';
import { getLocalTimeZone, today, parseDate } from '@internationalized/date';
import { Calendar as HeroUICalendar } from '@heroui/react';
import { I18nProvider } from '@react-aria/i18n';
import { 
  SunIcon,
  ArrowRightIcon,
  HomeIcon,
  NoSymbolIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { getDateLocale, getCalendarLocale } from '@/i18n/languages';

interface DatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export const DatePicker = ({ value, onChange, theme = 'light' }: DatePickerProps) => {
  const { t, i18n } = useTranslation();
  const [showCalendar, setShowCalendar] = useState(false);
  const todayDate = today(getLocalTimeZone());
  const tomorrow = todayDate.add({ days: 1 });
  const nextWeek = todayDate.add({ days: 7 });
  const dayOfWeek = todayDate.dayOfWeek;
  const daysUntilWeekend = dayOfWeek === 0 ? 6 : 7 - dayOfWeek;
  const nextWeekend = todayDate.add({ days: daysUntilWeekend });

  const formatDate = (date: string | null) => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getDate()} ${d.toLocaleDateString(getDateLocale(i18n.language), { month: 'short' })}`;
  };

  const handleQuickSelect = (date: Date) => {
    onChange(date.toISOString().split('T')[0]);
  };

  const displayDate = formatDate(value);
  const isDark = theme === 'dark';

  return (
    <div className={`${isDark ? 'bg-bg-dark' : 'bg-white'} rounded-lg shadow-xl ${isDark ? 'border-silver/30' : 'border border-silver/30'} p-4 min-w-[320px]`}>
      {!showCalendar ? (
        <>
          <div className="space-y-2 mb-4">
            <button
              type="button"
              onClick={() => handleQuickSelect(tomorrow.toDate(getLocalTimeZone()))}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-silver/10 transition-colors ${isDark ? 'text-txt-light' : 'text-txt-dark'}`}
            >
              <div className="flex items-center gap-2">
                <SunIcon className="w-4 h-4 text-txt-muted" />
                <span className="text-sm">{t('date.tomorrow')}</span>
              </div>
              <span className="text-xs text-txt-muted">
                {tomorrow.toDate(getLocalTimeZone()).toLocaleDateString(getDateLocale(i18n.language), { weekday: 'short' })}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickSelect(nextWeek.toDate(getLocalTimeZone()))}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-silver/10 transition-colors ${isDark ? 'text-txt-light' : 'text-txt-dark'}`}
            >
              <div className="flex items-center gap-2">
                <ArrowRightIcon className="w-4 h-4 text-txt-muted" />
                <span className="text-sm">{t('date.nextWeek')}</span>
              </div>
              <span className="text-xs text-txt-muted">
                {nextWeek.toDate(getLocalTimeZone()).toLocaleDateString(getDateLocale(i18n.language), { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickSelect(nextWeekend.toDate(getLocalTimeZone()))}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-silver/10 transition-colors ${isDark ? 'text-txt-light' : 'text-txt-dark'}`}
            >
              <div className="flex items-center gap-2">
                <HomeIcon className="w-4 h-4 text-txt-muted" />
                <span className="text-sm">{t('date.nextWeekend')}</span>
              </div>
              <span className="text-xs text-txt-muted">
                {nextWeekend.toDate(getLocalTimeZone()).toLocaleDateString(getDateLocale(i18n.language), { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onChange(null)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-silver/10 transition-colors ${isDark ? 'text-txt-light' : 'text-txt-dark'}`}
            >
              <NoSymbolIcon className="w-4 h-4 text-txt-muted" />
              <span className="text-sm">{t('date.noDate')}</span>
            </button>
          </div>

          <div className={`border-t ${isDark ? 'border-silver/10' : 'border-silver/20'} pt-4`}>
            <button
              type="button"
              onClick={() => setShowCalendar(true)}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-silver/10 transition-colors ${isDark ? 'text-txt-light' : 'text-txt-dark'}`}
            >
              <CalendarIcon className="w-4 h-4 text-txt-muted" />
              <span className="text-sm">{t('date.selectDate')}</span>
            </button>
          </div>
        </>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setShowCalendar(false)}
            className="mb-3 text-sm text-primary hover:text-primary-hover transition-colors"
          >
            ← {t('common.back')}
          </button>
          <I18nProvider locale={getCalendarLocale(i18n.language)}>
            <HeroUICalendar
              value={value ? parseDate(value) : todayDate}
              onChange={(date) => {
                if (date) {
                  const jsDate = date.toDate(getLocalTimeZone());
                  onChange(jsDate.toISOString().split('T')[0]);
                  setShowCalendar(false);
                }
              }}
              classNames={{
                base: `w-full ${isDark ? 'bg-bg-dark' : 'bg-white'} p-0`,
                content: isDark ? "bg-bg-dark" : "bg-white",
                gridWrapper: isDark ? "bg-bg-dark" : "bg-white",
                grid: isDark ? "bg-bg-dark" : "bg-white",
                gridHeader: isDark ? "bg-bg-dark shadow-none" : "bg-white shadow-none",
                gridHeaderRow: isDark ? "bg-bg-dark" : "bg-white",
                gridHeaderCell: "text-txt-muted font-medium",
                gridBody: isDark ? "bg-bg-dark" : "bg-white",
                gridBodyRow: isDark ? "bg-bg-dark border-0" : "bg-white border-0",
                headerWrapper: isDark ? "bg-bg-dark pt-4 pb-2 px-4" : "bg-white pt-4 pb-2 px-4",
                header: isDark ? "bg-bg-dark" : "bg-white",
                title: isDark ? "text-txt-light font-semibold text-base" : "text-txt-dark font-semibold text-base",
                prevButton: isDark ? "text-txt-light hover:bg-silver/20 bg-silver/10 border border-silver/20" : "text-txt-dark hover:bg-silver/20 bg-silver/10 border border-silver/20",
                nextButton: isDark ? "text-txt-light hover:bg-silver/20 bg-silver/10 border border-silver/20" : "text-txt-dark hover:bg-silver/20 bg-silver/10 border border-silver/20",
                cell: isDark ? "bg-bg-dark" : "bg-white",
                cellButton: isDark ? "text-txt-light hover:bg-silver/20 data-[selected=true]:bg-primary data-[selected=true]:text-white data-[hover=true]:bg-silver/10 data-[disabled=true]:text-txt-muted data-[disabled=true]:opacity-50" : "text-txt-dark hover:bg-silver/20 data-[selected=true]:bg-primary data-[selected=true]:text-white data-[hover=true]:bg-silver/10 data-[disabled=true]:text-txt-muted data-[disabled=true]:opacity-50"
              }}
            />
          </I18nProvider>
        </div>
      )}
    </div>
  );
};

