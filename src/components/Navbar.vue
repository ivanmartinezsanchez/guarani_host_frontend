<template>
  <nav
    class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
    role="navigation"
    aria-label="Main navigation"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <!-- Logo -->
      <RouterLink 
        to="/" 
        class="flex items-center space-x-2 text-primary font-bold text-xl"
        aria-label="GuaraníHost - Go to home"
      >
        <img src="@/assets/logo.png" alt="GuaraníHost logo" class="h-8 w-auto" />
        <span>GuaraníHost</span>
      </RouterLink>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-8">
        <!-- Public Links -->
        <RouterLink
          to="/"
          class="text-darkText dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium"
          :class="{ 'text-primary': route.path === '/' }"
        >
          Inicio
        </RouterLink>

        <!-- Role-based Links -->
        <template v-if="!user">
          <!-- Guest links -->
          <RouterLink
            to="/about"
            class="text-darkText dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium"
            :class="{ 'text-primary': route.path === '/about' }"
          >
            Nosotros
          </RouterLink>
        </template>

        <template v-else>
          <!-- User-specific links -->
          <RouterLink
            v-if="user.role === 'user'"
            to="/tours"
            class="text-darkText dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium"
            :class="{ 'text-primary': route.path.includes('/tour') }"
          >
            Tours
          </RouterLink>

          <!-- Admin links -->
          <RouterLink
            v-if="user.role === 'admin'"
            to="/admin/dashboard"
            class="text-darkText dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium"
            :class="{ 'text-primary': route.path.includes('/admin') }"
          >
            Admin Panel
          </RouterLink>

          <!-- Host links -->
          <RouterLink
            v-if="user.role === 'host'"
            to="/host/dashboard"
            class="text-darkText dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium"
            :class="{ 'text-primary': route.path.includes('/host') }"
          >
            Panel Host
          </RouterLink>

          <!-- User dashboard -->
          <RouterLink
            v-if="user.role === 'user'"
            to="/user/dashboard"
            class="text-darkText dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium"
            :class="{ 'text-primary': route.path.includes('/user') }"
          >
            Mi Cuenta
          </RouterLink>
        </template>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center space-x-4">
        <!-- Theme Toggle Button -->
        <button 
          @click="toggleTheme" 
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          :aria-label="themeLabel"
          :title="themeLabel"
        >
          <SunIcon v-if="themeIcon === 'sun'" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <MoonIcon v-else class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        <!-- User Menu / Auth Buttons -->
        <div v-if="!user" class="hidden md:flex items-center space-x-3">
          <RouterLink
            to="/login"
            class="text-darkText dark:text-white hover:text-primary transition-colors font-medium"
          >
            Iniciar sesión
          </RouterLink>
          <RouterLink
            to="/register"
            class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Registrarse
          </RouterLink>
        </div>

        <!-- User Dropdown -->
        <div v-else class="relative" data-user-menu>
          <button
            @click.stop="toggleUserMenu"
            class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :aria-label="`User menu - ${getUserFullName()}`"
            :aria-expanded="userMenuOpen"
          >
            <div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
              {{ getUserInitials() }}
            </div>
            <ChevronDownIcon 
              class="w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform"
              :class="{ 'rotate-180': userMenuOpen }"
            />
          </button>

          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="userMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
              @click.stop
            >
              <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p class="font-semibold text-darkText dark:text-white">{{ getUserFullName() }}</p>
                <p class="text-sm text-lightText dark:text-gray-400">{{ user.email }}</p>
              </div>
              
              <RouterLink
                to="/profile"
                class="flex items-center px-4 py-2 text-darkText dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                @click="closeUserMenu"
              >
                <UserIcon class="w-4 h-4 mr-2" />
                Mi Perfil
              </RouterLink>
              
              <RouterLink
                v-if="user.role === 'admin'"
                to="/admin/dashboard"
                class="flex items-center px-4 py-2 text-darkText dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                @click="closeUserMenu"
              >
                <SettingsIcon class="w-4 h-4 mr-2" />
                Dashboard Admin
              </RouterLink>
              
              <RouterLink
                v-if="user.role === 'host'"
                to="/host/dashboard"
                class="flex items-center px-4 py-2 text-darkText dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                @click="closeUserMenu"
              >
                <HomeIcon class="w-4 h-4 mr-2" />
                Panel Host
              </RouterLink>
              
              <hr class="my-1 border-gray-200 dark:border-gray-600">
              
              <button
                @click="handleLogout"
                class="flex items-center w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOutIcon class="w-4 h-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </Transition>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click.stop="toggleMobileMenu"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
          :aria-expanded="mobileMenuOpen"
          data-mobile-menu
        >
          <XIcon v-if="mobileMenuOpen" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <MenuIcon v-else class="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4"
        data-mobile-menu
      >
        <div class="space-y-3">
          <!-- Public Links -->
          <RouterLink
            to="/"
            class="block text-darkText dark:text-white hover:text-primary transition-colors font-medium"
            :class="{ 'text-primary': route.path === '/' }"
            @click="closeMobileMenu"
          >
            Inicio
          </RouterLink>

          <!-- Auth/Role-based Links -->
          <template v-if="!user">
            <RouterLink
              to="/about"
              class="block text-darkText dark:text-white hover:text-primary transition-colors font-medium"
              @click="closeMobileMenu"
            >
              Nosotros
            </RouterLink>
            <RouterLink
              to="/login"
              class="block text-darkText dark:text-white hover:text-primary transition-colors font-medium"
              @click="closeMobileMenu"
            >
              Iniciar sesión
            </RouterLink>
            <RouterLink
              to="/register"
              class="block bg-primary text-white px-4 py-2 rounded-lg font-medium text-center"
              @click="closeMobileMenu"
            >
              Registrarse
            </RouterLink>
          </template>

          <template v-else>
            <!-- User Info -->
            <div class="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p class="font-semibold text-darkText dark:text-white">{{ getUserFullName() }}</p>
              <p class="text-sm text-lightText dark:text-gray-400 capitalize">{{ user.role }}</p>
            </div>

            <!-- Role-specific Links -->
            <RouterLink
              v-if="user.role === 'user'"
              to="/tours"
              class="block text-darkText dark:text-white hover:text-primary transition-colors font-medium"
              @click="closeMobileMenu"
            >
              Tours
            </RouterLink>

            <RouterLink
              v-if="user.role === 'admin'"
              to="/admin/dashboard"
              class="block text-darkText dark:text-white hover:text-primary transition-colors font-medium"
              @click="closeMobileMenu"
            >
              Admin Panel
            </RouterLink>

            <RouterLink
              v-if="user.role === 'host'"
              to="/host/dashboard"
              class="block text-darkText dark:text-white hover:text-primary transition-colors font-medium"
              @click="closeMobileMenu"
            >
              Panel Host
            </RouterLink>

            <RouterLink
              to="/profile"
              class="block text-darkText dark:text-white hover:text-primary transition-colors font-medium"
              @click="closeMobileMenu"
            >
              Mi Perfil
            </RouterLink>

            <button
              @click="handleLogout"
              class="block w-full text-left text-red-600 dark:text-red-400 hover:text-red-700 transition-colors font-medium"
            >
              Cerrar Sesión
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  MenuIcon, 
  XIcon, 
  SunIcon, 
  MoonIcon,
  ChevronDownIcon,
  UserIcon,
  SettingsIcon,
  HomeIcon,
  LogOutIcon
} from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'

/**
 * NavBar Component
 * 
 * Main navigation component providing:
 * - Theme switching using useTheme composable
 * - User authentication state management
 * - Role-based navigation links
 * - Responsive mobile menu
 * - Accessibility features
 */

// ===== COMPOSITION API IMPORTS =====
const route = useRoute()
const router = useRouter()
const { user, logout } = useAuth()

// ===== THEME MANAGEMENT =====
// Use the theme composable instead of local state
const { isDark, toggleTheme, themeIcon, themeLabel } = useTheme()

// ===== LOCAL UI STATE =====
/** UI state for mobile menu visibility */
const mobileMenuOpen = ref(false)

/** UI state for user dropdown menu visibility */
const userMenuOpen = ref(false)

// ===== MENU CONTROL METHODS =====

/**
 * Toggle user dropdown menu visibility
 * Closes mobile menu if user menu is opened
 */
const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
  // Close mobile menu if opening user menu
  if (userMenuOpen.value) {
    mobileMenuOpen.value = false
  }
}

/**
 * Close user dropdown menu
 */
const closeUserMenu = () => {
  userMenuOpen.value = false
}

/**
 * Toggle mobile navigation menu visibility
 * Closes user menu if mobile menu is opened
 */
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  // Close user menu if opening mobile menu
  if (mobileMenuOpen.value) {
    userMenuOpen.value = false
  }
}

/**
 * Close mobile navigation menu
 */
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// ===== USER UTILITY METHODS =====

/**
 * Get user's full name for display
 * @returns Formatted full name string or empty string if no user
 */
const getUserFullName = (): string => {
  if (!user.value) return ''
  return `${user.value.firstName} ${user.value.lastName}`.trim()
}

/**
 * Get user's initials for avatar display
 * @returns User initials in uppercase or empty string if no user
 */
const getUserInitials = (): string => {
  if (!user.value) return ''
  const first = user.value.firstName?.[0] || ''
  const last = user.value.lastName?.[0] || ''
  return (first + last).toUpperCase()
}

// ===== AUTHENTICATION METHODS =====

/**
 * Handle user logout process
 * Closes all menus and redirects to login page
 */
const handleLogout = async () => {
  try {
    await logout()
    userMenuOpen.value = false
    mobileMenuOpen.value = false
    router.push('/login')
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

// ===== EVENT HANDLERS =====

/**
 * Handle clicks outside of menus to close them
 * Improves user experience by closing menus when clicking elsewhere
 * @param event - Click event from document
 */
const handleOutsideClick = (event: Event) => {
  const target = event.target as HTMLElement
  
  // Close user menu if clicking outside of it
  if (userMenuOpen.value && !target.closest('[data-user-menu]')) {
    userMenuOpen.value = false
  }
  
  // Close mobile menu if clicking outside of it
  if (mobileMenuOpen.value && !target.closest('[data-mobile-menu]')) {
    mobileMenuOpen.value = false
  }
}

/**
 * Handle escape key press to close all open menus
 * Provides keyboard accessibility for menu dismissal
 * @param event - Keyboard event
 */
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    userMenuOpen.value = false
    mobileMenuOpen.value = false
  }
}

// ===== LIFECYCLE HOOKS =====

/**
 * Initialize component on mount
 * Sets up event listeners for menu management
 * Theme is handled by the useTheme composable
 */
onMounted(() => {
  // Add global event listeners for menu management
  document.addEventListener('click', handleOutsideClick)
  document.addEventListener('keydown', handleEscapeKey)
})

/**
 * Cleanup on component unmount
 * Removes event listeners to prevent memory leaks
 */
onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>

<style scoped>
/**
 * Component-specific styles
 * 
 * Note: Most styling is handled by Tailwind CSS classes in the template.
 * This section is available for any component-specific custom styles.
 */

/* Smooth transitions for theme changes */
nav {
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

/* Enhanced focus styles for better accessibility */
button:focus,
a:focus {
  outline: 2px solid theme('colors.primary');
  outline-offset: 2px;
}
</style>