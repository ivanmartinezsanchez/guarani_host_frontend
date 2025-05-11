<template>
  <nav
    class="sticky top-0 z-50 bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-md px-4 py-3 rounded-b-lg flex flex-wrap items-center justify-between"
  >
    <h1 class="text-lg font-semibold text-primary">GuaraníHost</h1>

    <!-- Botón toggle móvil -->
    <button
      @click="menuOpen = !menuOpen"
      class="sm:hidden"
      :aria-expanded="menuOpen ? 'true' : 'false'"
      aria-controls="navbar-menu"
    >
      <Menu class="w-6 h-6" />
    </button>

    <!-- Menú -->
    <ul
      id="navbar-menu"
      :class="[
        'w-full sm:w-auto flex-col sm:flex-row sm:flex sm:items-center sm:space-x-6 mt-4 sm:mt-0 transition-all duration-300 ease-in-out',
        menuOpen ? 'flex' : 'hidden'
      ]"
    >
      <li>
        <RouterLink
          to="/"
          class="block py-1 hover:underline"
          :class="{ 'font-bold underline text-primary': route.path === '/' }"
        >Inicio</RouterLink>
      </li>
      <li>
        <RouterLink
          to="/about"
          class="block py-1 hover:underline"
          :class="{ 'font-bold underline text-primary': route.path === '/about' }"
        >Nosotros</RouterLink>
      </li>

      <li v-if="!user">
        <RouterLink
          to="/login"
          class="block py-1 hover:underline"
          :class="{ 'font-bold underline text-primary': route.path === '/login' }"
        >Login</RouterLink>
      </li>
      <li v-if="!user">
        <RouterLink
          to="/register"
          class="block py-1 hover:underline"
          :class="{ 'font-bold underline text-primary': route.path === '/register' }"
        >Registro</RouterLink>
      </li>

      <li v-if="user">
        <RouterLink
          :to="`/${user.role}/dashboard`"
          class="block py-1 hover:underline"
          :class="{ 'font-bold underline text-primary': route.path.includes('/dashboard') }"
        >Dashboard</RouterLink>
      </li>

      <li v-if="user">
        <button @click="logout" class="block py-1 hover:underline">Salir</button>
      </li>

      <!-- Tema -->
      <li>
        <button @click="toggleTheme" class="ml-2" title="Cambiar tema">
          <Moon v-if="isDark" class="w-5 h-5" />
          <Sun v-else class="w-5 h-5" />
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
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
