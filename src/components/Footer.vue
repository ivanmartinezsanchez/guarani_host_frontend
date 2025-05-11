<template>
    <footer class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm border-t border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <h2 class="font-semibold text-gray-900 dark:text-white mb-2">GuaraníHost</h2>
          <p>Descubre alojamientos y experiencias únicas en Paraguay. Inspirado en la hospitalidad guaraní.</p>
        </div>
  
        <div>
          <h3 class="font-semibold mb-2 text-gray-900 dark:text-white">Navegación</h3>
          <ul class="space-y-1">
            <li><RouterLink to="/" class="hover:underline">Inicio</RouterLink></li>
            <li><RouterLink to="/about" class="hover:underline">Nosotros</RouterLink></li>
            <li><RouterLink to="/login" class="hover:underline">Iniciar sesión</RouterLink></li>
            <li><RouterLink to="/register" class="hover:underline">Registrarse</RouterLink></li>
          </ul>
        </div>
  
        <div>
          <h3 class="font-semibold mb-2 text-gray-900 dark:text-white">Contacto</h3>
          <ul class="space-y-1">
            <li>Email: contacto@guaranihost.com</li>
            <li>Teléfono: +595 981 123 456</li>
            <li>Asunción, Paraguay</li>
          </ul>
        </div>
  
        <div>
            <h3 class="font-semibold mb-2 text-gray-900 dark:text-white">Síguenos</h3>
<ul class="flex space-x-4 items-center">
  <li>
    <a href="#" aria-label="Facebook" class="hover:text-primary transition" target="_blank" rel="noopener">
      <Facebook class="w-5 h-5" />
    </a>
  </li>
  <li>
    <a href="#" aria-label="Instagram" class="hover:text-primary transition" target="_blank" rel="noopener">
      <Instagram class="w-5 h-5" />
    </a>
  </li>
  <li>
    <a href="#" aria-label="TikTok" class="hover:text-primary transition" target="_blank" rel="noopener">
      <Music class="w-5 h-5" /> <!-- Representa TikTok -->
    </a>
  </li>
</ul>
        </div>
      </div>
  
      <div class="border-t border-gray-200 dark:border-gray-700 mt-6 py-4 text-center text-xs">
        &copy; 2025 GuaraníHost. Todos los derechos reservados.
      </div>
    </footer>
  </template>
  
  <script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import { Facebook, Instagram, Music } from 'lucide-vue-next'

  </script>
  
  <style scoped>
  .text-primary {
    color: #3F51B5;
  }
  </style>
  