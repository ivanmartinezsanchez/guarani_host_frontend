<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <!-- Header with avatar and name -->
    <div class="flex items-center gap-4 mb-8">
      <img
        src="https://api.dicebear.com/6.x/initials/svg?seed={{ user?.firstName }}%20{{ user?.lastName }}"
        alt="Avatar"
        class="w-14 h-14 rounded-full border-2 border-primary shadow"
      />
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
          Hola, {{ user?.firstName }} {{ user?.lastName }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Información personal</p>
      </div>
    </div>

    <!-- Profile card -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-6 transition-shadow">
      <div class="flex items-center gap-3 text-gray-800 dark:text-white">
        <MailIcon class="w-5 h-5 text-primary" />
        <span class="font-semibold">Correo Electrónico:</span>
        <span>{{ user?.email }}</span>
      </div>

      <div class="flex items-center gap-3 text-gray-800 dark:text-white">
        <ShieldIcon class="w-5 h-5 text-primary" />
        <span class="font-semibold">Rol:</span>
        <span class="capitalize">{{ user?.role }}</span>
      </div>

      <div class="flex items-center gap-3 text-gray-800 dark:text-white">
        <span class="font-semibold">Dirección:</span>
        <span>{{ user?.address || 'Not provided' }}</span>
      </div>

      <div class="flex items-center gap-3 text-gray-800 dark:text-white">
        <span class="font-semibold">Teléfono:</span>
        <span>{{ user?.phone || 'Not provided' }}</span>
      </div>

      <!-- Edit button -->
      <div class="pt-4 text-center sm:text-right">
        <button
          @click="goToEditProfile"
          class="bg-primary hover:bg-hover text-white font-semibold py-2 px-6 rounded-md transition-colors"
        >
          Editar Perfil
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import authentication and router hooks
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { UserIcon, MailIcon, ShieldIcon } from 'lucide-vue-next'

// Get user from auth composable
const { user } = useAuth()
const router = useRouter()

// Navigate to the profile edit route
function goToEditProfile() {
  router.push('/profile/edit')
}
</script>

<style scoped>
.text-primary {
  color: #3F51B5;
}
.bg-primary {
  background-color: #3F51B5;
}
.hover\:bg-hover:hover {
  background-color: #303F9F;
}
</style>
