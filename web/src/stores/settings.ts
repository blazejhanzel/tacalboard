import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    locale: 'pl-PL', // TODO: Change to en-GB
    theme: 'light' as 'light' | 'dark'
  }),

  persist: true
})