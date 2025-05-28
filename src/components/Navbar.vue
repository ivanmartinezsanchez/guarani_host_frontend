<template>
  <nav
    class="sticky top-0 z-50 bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-md px-4 py-3 flex flex-wrap items-center justify-between"
    role="navigation"
    aria-label="Main navigation"
  >
    <!-- Logo -->
    <RouterLink to="/" class="flex items-center" aria-label="Go to Home">
      <img src="@/assets/logo.png" alt="GuaraníHost logo" class="h-10 md:h-14 w-auto" />
    </RouterLink>

    <!-- Mobile menu toggle -->
    <button
      @click="menuOpen = !menuOpen"
      class="sm:hidden"
      aria-label="Toggle navigation"
      :aria-expanded="menuOpen"
      aria-controls="navbar-menu"
    >
      <Menu class="w-6 h-6" aria-hidden="true" />
    </button>

    <!-- Navigation menu -->
    <ul
      id="navbar-menu"
      role="menubar"
      :class="[menuOpen ? 'flex' : 'hidden', 'w-full sm:flex sm:flex-row sm:items-center gap-4 mt-4 sm:mt-0 flex-col sm:w-auto']"
    >
      <!-- Link: Inicio (all users) -->
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

      <!-- Link: Nosotros (only for guest or user) -->
      <li role="none" v-if="!user || user.role === 'user'">
        <RouterLink
          role="menuitem"
          to="/about"
          class="block py-1 hover:underline"
          :class="{ 'font-bold underline text-primary': route.path === '/about' }"
        >
          Nosotros
        </RouterLink>
      </li>

      <!-- Guest links -->
      <template v-if="!user">
        <li role="none">
          <RouterLink
            role="menuitem"
            to="/login"
            class="block py-1 hover:underline"
            :class="{ 'font-bold underline text-primary': route.path === '/login' }"
          >
            Iniciar sesión
          </RouterLink>
        </li>
        <li role="none">
          <RouterLink
            role="menuitem"
            to="/register"
            class="block py-1 hover:underline"
            :class="{ 'font-bold underline text-primary': route.path === '/register' }"
          >
            Registro
          </RouterLink>
        </li>
      </template>

      <!-- Authenticated user -->
      <template v-else>
        <!-- Tours (only for 'user') -->
        <li role="none" v-if="user.role === 'user'">
          <RouterLink
            role="menuitem"
            to="/tours"
            class="block py-1 hover:underline"
            :class="{ 'font-bold underline text-primary': route.name === 'tour-detail' || route.path === '/tours' }"
          >
            Paquetes turísticos
          </RouterLink>
        </li>

        <!-- Dashboard (based on role) -->
        <li role="none" v-if="user.role === 'admin'">
          <RouterLink
            role="menuitem"
            to="/admin/dashboard"
            class="block py-1 hover:underline"
            :class="{ 'font-bold underline text-primary': route.name === 'admin-dashboard' }"
          >
            Dashboard
          </RouterLink>
        </li>
        <li role="none" v-else-if="user.role === 'host'">
          <RouterLink
            role="menuitem"
            to="/host/dashboard"
            class="block py-1 hover:underline"
            :class="{ 'font-bold underline text-primary': route.name === 'host-dashboard' }"
          >
            Dashboard
          </RouterLink>
        </li>
        <li role="none" v-else-if="user.role === 'user'">
          <RouterLink
            role="menuitem"
            to="/user/dashboard"
            class="block py-1 hover:underline"
            :class="{ 'font-bold underline text-primary': route.name === 'user-dashboard' }"
          >
            Dashboard
          </RouterLink>
        </li>

        <!-- Profile -->
        <li role="none">
          <RouterLink
            role="menuitem"
            to="/profile"
            class="block py-1 hover:underline"
            :class="{ 'font-bold underline text-primary': route.name === 'profile' }"
          >
            Perfil
          </RouterLink>
        </li>

        <!-- Logout -->
        <li role="none">
          <button
            @click="logout"
            class="block py-1 hover:underline"
            aria-label="Cerrar sesión"
          >
            Salir
          </button>
        </li>
      </template>

      <!-- Theme toggle -->
      <li role="none">
        <button @click="toggleTheme" class="ml-2" title="Cambiar tema" aria-label="Cambiar modo claro/oscuro">
          <Moon v-if="isDark" class="w-5 h-5" aria-hidden="true" />
          <Sun v-else class="w-5 h-5" aria-hidden="true" />
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
/**
 * GuaraníHost Navbar
 * - Role-based conditional rendering for guest, user, host, admin
 * - Responsive with dark/light mode support
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
