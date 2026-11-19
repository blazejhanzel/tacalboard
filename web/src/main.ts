import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import { i18n } from './i18n'
import { useTheme } from '@/composables/useTheme.ts'
import { useSync } from '@/composables/useSync.ts'

import '@/assets/theme.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import App from './App.vue'
import router from './router'

registerSW({
  onNeedRefresh() {
    console.log('New content available')
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

const app = createApp(App)
app.use(router)
app.use(i18n)

const theme = useTheme()
theme.handleSystemThemeChange()

const sync = useSync()
sync.initializeSync()

app.mount('#app')
