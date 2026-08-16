import { watch, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'

export function useTheme() {
  const settings = useSettingsStore()

  const mediaQuery = window.matchMedia(
    '(prefers-color-scheme: dark)'
  )

  function handleSystemThemeChange() {
    const theme =
      settings.theme === 'system'
        ? (mediaQuery.matches ? 'dark' : 'light')
        : settings.theme

    document.documentElement.setAttribute('data-bs-theme', theme)
    document.documentElement.setAttribute('data-custom-theme', theme)
  }

  watch(
    () => settings.theme,
    () => {
      handleSystemThemeChange()
    }
  )

  mediaQuery.addEventListener('change', () => {
    if (settings.theme === 'system') {
      handleSystemThemeChange()
    }
  })

  return {
    handleSystemThemeChange
  }
}