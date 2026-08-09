import { ref, onMounted } from 'vue'

const currentTheme = ref(localStorage.getItem('orion_theme') || 'dark')

export function useTheme() {
  const applyTheme = (theme) => {
    currentTheme.value = theme
    localStorage.setItem('orion_theme', theme)

    const root = document.documentElement
    root.classList.remove('theme-dark', 'theme-light', 'dark')

    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (systemDark) {
        root.classList.add('dark', 'theme-dark')
        root.setAttribute('data-theme', 'dark')
      } else {
        root.classList.add('theme-light')
        root.setAttribute('data-theme', 'light')
      }
    } else if (theme === 'light') {
      root.classList.add('theme-light')
      root.setAttribute('data-theme', 'light')
    } else {
      // Default: Dark Solarpunk
      root.classList.add('dark', 'theme-dark')
      root.setAttribute('data-theme', 'dark')
    }
  }

  const setTheme = (theme) => {
    applyTheme(theme)
  }

  onMounted(() => {
    applyTheme(currentTheme.value)
  })

  return {
    currentTheme,
    setTheme,
    applyTheme
  }
}
