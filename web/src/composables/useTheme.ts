import { watch } from 'vue'
import { theme } from './useAppStates'

export function useTheme() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  function handleSystemThemeChange() {
    const themeToSet =
      theme.state.value === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : theme.state.value

    document.documentElement.setAttribute('data-bs-theme', themeToSet)
    document.documentElement.setAttribute('data-custom-theme', themeToSet)
  }

  watch(theme.state, handleSystemThemeChange, { immediate: true })

  mediaQuery.addEventListener('change', () => {
    if (theme.state.value === 'system') {
      handleSystemThemeChange()
    }
  })

  return {
    handleSystemThemeChange,
  }
}
