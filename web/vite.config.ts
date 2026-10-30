import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'node:fs'

// Version info
const packageJson = JSON.parse(readFileSync('../package.json', 'utf-8'))
const version = packageJson.version
const channel = process.env.BUILD_CHANNEL ?? 'dev'
const buildNumber = process.env.BUILD_NUMBER
const gitSha = process.env.GIT_SHA?.slice(0, 7)
const __APP_VERSION__ = buildNumber && gitSha
  ? `${version}-${channel}.${buildNumber}+${'g' + gitSha}`
  : `${version}-${channel}+${gitSha ? 'g' + gitSha : 'local'}`

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        navigateFallbackDenylist: [
          /^\/api(?:\/|$)/,
          /^\/docs(?:\/|$)/,
        ]
      },
      manifest: {
        name: 'Tacalboard',
        short_name: 'Tacalboard',
        description: 'A self-hosted personal organizer with notes, tasks and calendar.',
        theme_color: '#dce0e8',
        background_color: '#eff1f5',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(__APP_VERSION__)
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080/',
        changeOrigin: true
      }
    }
  }
})
