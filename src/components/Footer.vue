<template>
  <footer
    class="bg-background dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
    role="contentinfo"
    aria-label="Pie de página"
  >
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Brand Section -->
        <div class="lg:col-span-1">
          <div class="flex items-center space-x-2 mb-4">
            <img src="@/assets/logo.png" alt="GuaraníHost logo" class="h-8 w-auto" />
            <h2 class="text-xl font-bold text-darkText dark:text-white">GuaraníHost</h2>
          </div>
          <p class="text-lightText dark:text-gray-400 leading-relaxed mb-4">
            Descubre Paraguay auténtico. Alojamientos únicos y experiencias locales 
            con la hospitalidad guaraní.
          </p>
          <div class="flex items-center space-x-4">
            <a 
              href="#" 
              aria-label="Síguenos en Facebook"
              class="text-lightText dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FacebookIcon class="w-5 h-5" />
            </a>
            <a 
              href="#" 
              aria-label="Síguenos en Instagram"
              class="text-lightText dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <InstagramIcon class="w-5 h-5" />
            </a>
            <a 
              href="#" 
              aria-label="Síguenos en TikTok"
              class="text-lightText dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <MusicIcon class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Navigation Links -->
        <div>
          <h3 class="font-semibold text-darkText dark:text-white mb-4">Navegación</h3>
          <ul class="space-y-2">
            <li>
              <RouterLink 
                to="/" 
                class="text-lightText dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                Inicio
              </RouterLink>
            </li>
            <li>
              <RouterLink 
                to="/about" 
                class="text-lightText dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                Nosotros
              </RouterLink>
            </li>
            <li v-if="!user">
              <RouterLink 
                to="/login" 
                class="text-lightText dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                Iniciar sesión
              </RouterLink>
            </li>
            <li v-if="!user">
              <RouterLink 
                to="/register" 
                class="text-lightText dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                Registrarse
              </RouterLink>
            </li>
            <li v-if="user">
              <RouterLink 
                to="/profile" 
                class="text-lightText dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                Mi Perfil
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Support & Help -->
        <div>
          <h3 class="font-semibold text-darkText dark:text-white mb-4">Soporte</h3>
          <ul class="space-y-2">
            <li>
              <RouterLink 
                to="/contact" 
                class="text-lightText dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                Contacto
              </RouterLink>
            </li>
            <li>
              <RouterLink 
                to="/help" 
                class="text-lightText dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                Centro de ayuda
              </RouterLink>
            </li>
            <li>
              <RouterLink 
                to="/terms" 
                class="text-lightText dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                Términos de uso
              </RouterLink>
            </li>
            <li>
              <RouterLink 
                to="/privacy" 
                class="text-lightText dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                Política de privacidad
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="font-semibold text-darkText dark:text-white mb-4">Contacto</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <MailIcon class="w-4 h-4 text-lightText dark:text-gray-400" />
              <a 
                href="mailto:contacto@guaranihost.com"
                class="text-lightText dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                contacto@guaranihost.com
              </a>
            </div>
            <div class="flex items-center space-x-2">
              <PhoneIcon class="w-4 h-4 text-lightText dark:text-gray-400" />
              <a 
                href="tel:+595981123456"
                class="text-lightText dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                +595 981 123 456
              </a>
            </div>
            <div class="flex items-center space-x-2">
              <MapPinIcon class="w-4 h-4 text-lightText dark:text-gray-400" />
              <span class="text-lightText dark:text-gray-400">
                Asunción, Paraguay
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p class="text-sm text-lightText dark:text-gray-400">
            &copy; {{ currentYear }} GuaraníHost. Todos los derechos reservados.
          </p>
          <div class="flex items-center space-x-4 text-sm">
            <RouterLink 
              to="/terms" 
              class="text-lightText dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Términos
            </RouterLink>
            <RouterLink 
              to="/privacy" 
              class="text-lightText dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Privacidad
            </RouterLink>
            <span class="text-lightText dark:text-gray-400">•</span>
            <span class="text-lightText dark:text-gray-400">Hecho en Paraguay 🇵🇾</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { 
  FacebookIcon, 
  InstagramIcon, 
  MusicIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon
} from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'

// Get current user
const { user } = useAuth()

// Current year for copyright
const currentYear = computed(() => new Date().getFullYear())
</script>