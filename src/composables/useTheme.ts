import { ref, computed, onMounted, watchEffect } from 'vue'

/**
 * Theme management composable
 * Handles light/dark mode toggle with localStorage persistence and system preference detection
 */

// Supported theme types
export type Theme = 'light' | 'dark' | 'system'

// Reactive theme state
const currentTheme = ref<Theme>('system')
const isDark = ref(false)

/**
 * Get system preference for dark mode
 * @returns Boolean indicating if system prefers dark mode
 */
const getSystemPreference = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Apply theme to document element
 * Updates the HTML class and CSS color scheme
 * @param theme - Theme to apply ('light', 'dark', or 'system')
 */
const applyTheme = (theme: Theme) => {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  
  // Remove existing theme classes
  root.classList.remove('light', 'dark')
  
  // Determine if should be dark mode
  let shouldBeDark = false
  
  switch (theme) {
    case 'dark':
      shouldBeDark = true
      break
    case 'light':
      shouldBeDark = false
      break
    case 'system':
      shouldBeDark = getSystemPreference()
      break
  }
  
  // Apply theme class and update reactive state
  root.classList.add(shouldBeDark ? 'dark' : 'light')
  isDark.value = shouldBeDark
  
  // Update CSS color scheme for better browser integration
  root.style.colorScheme = shouldBeDark ? 'dark' : 'light'
}

/**
 * Load theme from localStorage or use system preference
 * Initializes theme on app startup
 */
const loadTheme = () => {
  if (typeof window === 'undefined') return
  
  const savedTheme = localStorage.getItem('theme') as Theme
  if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
    currentTheme.value = savedTheme
  } else {
    currentTheme.value = 'system'
  }
  
  applyTheme(currentTheme.value)
}

/**
 * Save theme to localStorage
 * @param theme - Theme to save
 */
const saveTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('theme', theme)
}

/**
 * Set theme and persist to localStorage
 * @param theme - Theme to set
 */
const setTheme = (theme: Theme) => {
  currentTheme.value = theme
  saveTheme(theme)
  applyTheme(theme)
}

/**
 * Toggle between light and dark mode (skips system mode)
 * Used for simple toggle buttons
 */
const toggleTheme = () => {
  // If currently on system mode, determine what to toggle to
  if (currentTheme.value === 'system') {
    const newTheme = isDark.value ? 'light' : 'dark'
    setTheme(newTheme)
  } else {
    // Simple toggle between light and dark
    const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }
}

/**
 * Theme icon for current state
 */
const themeIcon = computed(() => {
  switch (currentTheme.value) {
    case 'light':
      return 'sun'
    case 'dark':
      return 'moon'
    case 'system':
      return isDark.value ? 'moon' : 'sun'
    default:
      return 'sun'
  }
})

/**
 * Theme label for current state
 */
const themeLabel = computed(() => {
  switch (currentTheme.value) {
    case 'light':
      return 'Light Mode'
    case 'dark':
      return 'Dark Mode'
    case 'system':
      return `System (${isDark.value ? 'Dark' : 'Light'})`
    default:
      return 'Light Mode'
  }
})

/**
 * Listen for system preference changes
 * Updates theme when system preference changes (only if using system theme)
 */
const setupSystemListener = () => {
  if (typeof window === 'undefined') return
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  const handleChange = () => {
    if (currentTheme.value === 'system') {
      applyTheme('system')
    }
  }
  
  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange)
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleChange)
  }
  
  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', handleChange)
    } else {
      mediaQuery.removeListener(handleChange)
    }
  }
}

/**
 * Initialize theme system
 * Should be called once on app startup
 */
const initTheme = () => {
  loadTheme()
  const cleanup = setupSystemListener()
  return cleanup
}

/**
 * Watch for theme changes and apply them
 */
watchEffect(() => {
  if (typeof document !== 'undefined') {
    applyTheme(currentTheme.value)
  }
})

/**
 * Initialize on mount for compatibility with existing code
 */
onMounted(() => {
  initTheme()
})

/**
 * Composable hook for theme management
 * @returns Object with theme state and controls
 */
export const useTheme = () => {
  return {
    // State (reactive)
    currentTheme: computed(() => currentTheme.value),
    isDark: computed(() => isDark.value),
    
    // Computed properties
    themeIcon,
    themeLabel,
    
    // Methods
    setTheme,
    toggleTheme,
    initTheme,
    
    // Utilities
    getSystemPreference
  }
}