import { ref, watchEffect, onMounted } from 'vue'

const isDark = ref(false)

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  // Detectar tema almacenado o preferencia del sistema
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      isDark.value = true
    } else if (savedTheme === 'light') {
      isDark.value = false
    } else {
      // Si no hay preferencia guardada, usar la del sistema
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  })

  watchEffect(() => {
    const root = document.documentElement
    if (isDark.value) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  })

  return { isDark, toggleTheme }
}
