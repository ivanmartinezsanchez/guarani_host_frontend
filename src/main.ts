import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import './assets/main.css'

// Import theme composable to handle dark/light mode
import { useTheme } from '@/composables/useTheme'

/**
 * Initialize theme before creating the app
 * Ensures proper dark/light class application and avoids FOUC (Flash of Unstyled Content)
 */
useTheme().initTheme()

// Create Vue application
const app = createApp(App)

// Register router
app.use(router)

// Mount the app to the DOM
app.mount('#app')
