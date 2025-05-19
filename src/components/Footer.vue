<template>
  <footer
    class="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm border-t border-gray-200 dark:border-gray-700"
    role="contentinfo"
    aria-label="Pie de página"
  >
    <!-- Main grid -->
    <div class="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      <!-- Branding -->
      <div>
        <h2 class="font-semibold text-gray-900 dark:text-white text-lg mb-2">GuaraníHost</h2>
        <p class="leading-relaxed">
          Descubre alojamientos y experiencias únicas en Paraguay. Inspirado en la hospitalidad guaraní.
        </p>
      </div>

      <!-- Navigation -->
      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Navegación</h3>
        <ul class="space-y-1" role="list">
          <li><RouterLink to="/" class="hover:underline">Inicio</RouterLink></li>
          <li><RouterLink to="/about" class="hover:underline">Nosotros</RouterLink></li>
          <li><RouterLink to="/login" class="hover:underline">Iniciar sesión</RouterLink></li>
          <li><RouterLink to="/register" class="hover:underline">Registrarse</RouterLink></li>
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Contacto</h3>
        <ul class="space-y-1" role="list">
          <li><span>Email:</span> contacto@guaranihost.com</li>
          <li><span>Teléfono:</span> +595 981 123 456</li>
          <li>Asunción, Paraguay</li>
        </ul>
      </div>

      <!-- Social media -->
      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Síguenos</h3>
        <ul class="flex space-x-4 items-center" role="list">
          <li>
            <a href="#" aria-label="Facebook" class="hover:text-primary transition" target="_blank" rel="noopener">
              <Facebook class="w-6 h-6" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a href="#" aria-label="Instagram" class="hover:text-primary transition" target="_blank" rel="noopener">
              <Instagram class="w-6 h-6" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a href="#" aria-label="TikTok" class="hover:text-primary transition" target="_blank" rel="noopener">
              <Music class="w-6 h-6" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom line -->
    <div class="border-t border-gray-200 dark:border-gray-700 py-4 text-center text-xs">
      &copy; 2025 GuaraníHost. Todos los derechos reservados.
    </div>
  </footer>
</template>

<script setup lang="ts">
/**
 * Footer component with accessible structure, responsive grid layout,
 * dark/light theme support, and social links.
 */
import { RouterLink } from 'vue-router'
import { Facebook, Instagram, Music } from 'lucide-vue-next'
</script>

<style scoped>
.text-primary {
  color: #3F51B5;
}
</style>
