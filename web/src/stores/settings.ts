import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    locale: 'en-US', // TODO: change to en-US
    theme: 'light'
  })
})