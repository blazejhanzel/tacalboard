import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    locale: 'pl-PL', // TODO: Change to en-GB
    theme: 'system' as 'system' | 'light' | 'dark'
  }),

  persist: true
})