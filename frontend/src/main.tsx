import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider } from '@heroui/react'
import { I18nextProvider } from 'react-i18next'
import './index.css'
import i18n from '@/i18n/config'
import { I18nWrapper } from '@/components/providers/I18nWrapper'
import App from '@/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <I18nWrapper>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
      </I18nWrapper>
    </I18nextProvider>
  </StrictMode>,
)
