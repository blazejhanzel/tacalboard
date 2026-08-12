import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    locale: 'pl-PL', // TODO: change to en-US
    theme: 'light'
  })
})