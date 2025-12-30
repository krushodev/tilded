import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useUserStore } from '@/store/user.store';
import { useLocation, Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useToastContext } from '@/contexts/ToastContext';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import logo from '@/assets/revert-logo.jpg';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const login = useAuthStore(s => s.login);
  const { fetchCurrentUser } = useUserStore();
  const [, setLocation] = useLocation();
  const { showToast } = useToastContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, pass);
      await fetchCurrentUser();
      setLocation('/');
    } catch {
      showToast('error', t('auth.authError'), t('auth.invalidCredentials'));
    }
  };

  return (
    <div className="flex min-h-screen relative safe-area-inset-top safe-area-inset-bottom">
      {/* Language Selector - Fixed top right */}
      <div className="fixed top-4 right-4 z-[10000] w-40 sm:w-48 safe-area-inset-top">
        <LanguageSelector variant="standalone" />
      </div>

      {/* Columna izquierda - Blanca con logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-8 xl:p-12">
        <div className="max-w-md w-full">
          <img src={logo} alt="Tilded Logo" className="w-full h-auto" />
        </div>
      </div>

      {/* Columna derecha - Naranja con formulario */}
      <div className="flex-1 flex items-center justify-center bg-primary p-4 sm:p-6 md:p-8 min-h-screen safe-area-inset-bottom">
        <div className="w-full max-w-md">
          <div className="mb-6 sm:mb-8 text-center lg:hidden">
            <img src={logo} alt="Tilded Logo" className="h-12 sm:h-16 w-auto mx-auto mb-4 sm:mb-6" />
          </div>

          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('auth.welcomeBack')}</h1>
            <p className="text-sm sm:text-base text-white/80">{t('auth.loginToAccount')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <input
                  type="email"
                  placeholder={t('auth.email')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 sm:py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white text-base placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all touch-manipulation"
                  required
                  autoComplete="email"
                  inputMode="email"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder={t('auth.password')}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  className="w-full px-4 py-3.5 sm:py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white text-base placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all touch-manipulation"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-primary font-semibold py-3.5 sm:py-3 px-4 rounded-lg hover:bg-white/90 active:bg-white/80 transition-colors shadow-lg text-base touch-manipulation"
            >
              {t('auth.login')}
            </button>

            <div className="text-center text-white/80 pt-3 sm:pt-4 text-sm sm:text-base">
              {t('auth.noAccount')}{' '}
              <Link href="/register" className="text-white font-semibold hover:underline">
                {t('auth.registerHere')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
