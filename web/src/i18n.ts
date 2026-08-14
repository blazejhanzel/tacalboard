import { createI18n } from 'vue-i18n'

import enGB from '@/locales/en-GB'
import plPL from '@/locales/pl-PL'

export const i18n = createI18n({
  legacy: false,

  locale: 'pl-PL',
  fallbackLocale: 'en-GB',

  messages: {
    'en-GB': enGB,
    'pl-PL': plPL
  }
})