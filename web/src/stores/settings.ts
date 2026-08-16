import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    locale: 'pl-PL', // TODO: Change to en-GB
    theme: 'system' as 'system' | 'light' | 'dark',
    serverUrl: 'http://127.0.0.1:8080'
  }),

  persist: true
})