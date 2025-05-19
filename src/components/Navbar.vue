<template>
  <nav
    class="sticky top-0 z-50 bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-md px-4 py-3 flex flex-wrap items-center justify-between"
    role="navigation"
    aria-label="Main navigation"
  >
    <!-- Logo (links to home) -->
    <RouterLink to="/" class="flex items-center" aria-label="Ir a inicio">
      <img src="@/assets/logo.png" alt="GuaraníHost logo" class="h-12 md:h-16 w-auto" />
    </RouterLink>

    <!-- Mobile toggle button with accessibility attributes -->
    <button
      @click="menuOpen = !menuOpen"
      class="sm:hidden"
      aria-label="Toggle navigation menu"
      :aria-expanded="menuOpen"
      aria-controls="navbar-menu"
    >
      <Menu class="w-6 h-6" aria-hidden="true" />
    </button>

    <!-- Navigation menu -->
    <ul
      id="navbar-menu"
      role="menubar"
      :class="[
        'w-full sm:w-auto flex-col sm:flex-row sm:flex sm:items-center sm:gap-6 mt-4 sm:mt-0 transition-all duration-300 ease-in-out',
        menuOpen ? 'flex' : 'hidden'
      ]"
    >
      <!-- Public links -->
      <li role="none">
        <RouterLink
          role="menuitem"
          to="/"
          class="block py-1 hover:underline"
          :class="{ 'font-bold underline text-primary': route.path === '/' }"
        >
          Inicio
        </RouterLink>
      </li>
      <li role="none">
        <RouterLink
          role="menuitem"
          to="/about"
          class="block py-1 hover:underline"
          :class="{ 'font-bold underline text-primary': route.path === '/about' }"
        >
          Nosotros
        </RouterLink>
      </li>

      <!-- Authenticated / Unauthenticated -->
      <li v-if="!user" role="none">
        <RouterLink
          role="menuitem"
          to="/login"
          class="block py-1 hover:underline"
          :class="{ 'font-bold underline text-primary': route.path === '/login' }"
        >
          Login
        </RouterLink>
      </li>
      <li v-if="!user" role="none">
        <RouterLink
          role="menuitem"
          to="/register"
          class="block py-1 hover:underline"
          :class="{ 'font-bold underline text-primary': route.path === '/register' }"
        >
          Registro
        </RouterLink>
      </li>

      <li v-if="user" role="none">
        <RouterLink
          role="menuitem"
          :to="`/${user.role}/dashboard`"
          class="block py-1 hover:underline"
          :class="{ 'font-bold underline text-primary': route.path.includes('/dashboard') }"
        >
          Dashboard
        </RouterLink>
      </li>

      <li v-if="user" role="none">
        <button @click="logout" class="block py-1 hover:underline" aria-label="Cerrar sesión">
          Salir
        </button>
      </li>

      <!-- Theme toggle -->
      <li role="none">
        <button @click="toggleTheme" class="ml-2" title="Cambiar tema" aria-label="Toggle dark mode">
          <Moon v-if="isDark" class="w-5 h-5" aria-hidden="true" />
          <Sun v-else class="w-5 h-5" aria-hidden="true" />
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
/**
 * Accessible Navbar with responsive layout, authentication state,
 * route awareness, and theme toggle. Optimized for keyboard and screen readers.
 */
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'
import { Menu, Sun, Moon } from 'lucide-vue-next'

const menuOpen = ref(false)
const { user, logout } = useAuth()
const { isDark, toggleTheme } = useTheme()
const route = useRoute()
</script>

<style scoped>
.text-primary {
  color: #3F51B5;
}
</style>
