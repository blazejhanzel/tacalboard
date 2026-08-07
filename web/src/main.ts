import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'

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
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
