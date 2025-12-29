import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeAltIcon, CheckIcon } from '@heroicons/react/24/outline';
import { SUPPORTED_LANGUAGES } from '@/i18n/languages';
import { useUserStore } from '@/store/user.store';

interface LanguageSelectorProps {
  className?: string;
  isCollapsed?: boolean;
  variant?: 'sidebar' | 'standalone';
}

export const LanguageSelector = ({ 
  className = '', 
  isCollapsed = false,
  variant = 'sidebar'
}: LanguageSelectorProps) => {
  const { i18n } = useTranslation();
  const { currentUser, updateCurrentUser } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = async (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
    
    // Guardar el idioma en el usuario si está autenticado
    if (currentUser) {
      try {
        await updateCurrentUser({ language: langCode });
      } catch (error) {
        console.error('Error al guardar idioma:', error);
      }
    }
    
    setIsOpen(false);
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    // Add event listener with a small delay to avoid immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside, true);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [isOpen]);

  // Standalone variant for login/register pages
  if (variant === 'standalone') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all ${className}`}
        >
          <GlobeAltIcon className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium truncate">{currentLanguage.nativeName}</span>
        </button>
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[99999] min-w-full py-1 max-h-[400px] overflow-y-auto">
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLanguageChange(lang.code);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 transition-colors flex items-center justify-between ${
                  i18n.language === lang.code ? 'text-primary bg-primary/5' : 'text-gray-700'
                }`}
              >
                <span className="font-medium">{lang.nativeName}</span>
                {i18n.language === lang.code && <CheckIcon className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Collapsed sidebar variant
  if (isCollapsed) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-center px-3 py-2 rounded-lg text-sm text-txt-muted hover:bg-silver/10 hover:text-txt-light transition-colors ${className}`}
          title={currentLanguage.nativeName}
        >
          <GlobeAltIcon className="w-5 h-5" />
        </button>
        {isOpen && (
          <div className="absolute left-full ml-2 bottom-0 bg-bg-dark border border-silver/30 rounded-lg shadow-lg z-[9999] min-w-[200px] py-1 max-h-[400px] overflow-y-auto">
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-silver/10 transition-colors flex items-center justify-between ${
                  i18n.language === lang.code ? 'text-primary' : 'text-txt-light'
                }`}
              >
                <span>{lang.nativeName}</span>
                {i18n.language === lang.code && <CheckIcon className="w-4 h-4" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Regular sidebar variant
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-txt-muted hover:bg-silver/10 hover:text-txt-light transition-colors ${className}`}
      >
        <GlobeAltIcon className="w-5 h-5 flex-shrink-0" />
        <span className="truncate">{currentLanguage.nativeName}</span>
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-bg-dark border border-silver/30 rounded-lg shadow-lg z-[9999] min-w-full py-1 max-h-[400px] overflow-y-auto">
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-silver/10 transition-colors flex items-center justify-between ${
                i18n.language === lang.code ? 'text-primary' : 'text-txt-light'
              }`}
            >
              <span>{lang.nativeName}</span>
              {i18n.language === lang.code && <CheckIcon className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

