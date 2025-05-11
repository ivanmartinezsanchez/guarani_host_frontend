<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <!-- Título -->
    <div class="flex items-center gap-4 mb-8">
      <UserIcon class="w-10 h-10 text-primary" />
      <h1 class="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
        Bienvenido, {{ user?.firstName }} {{ user?.lastName }}
      </h1>
    </div>

    <!-- Card de perfil -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-5 transition-shadow">
      <div class="flex items-center gap-3 text-gray-800 dark:text-white">
        <MailIcon class="w-5 h-5 text-primary" />
        <span class="font-semibold">Correo electrónico:</span>
        <span>{{ user?.email }}</span>
      </div>

      <div class="flex items-center gap-3 text-gray-800 dark:text-white">
        <ShieldIcon class="w-5 h-5 text-primary" />
        <span class="font-semibold">Rol:</span>
        <span class="capitalize">{{ user?.role }}</span>
      </div>

      <div class="flex items-center gap-3 text-gray-800 dark:text-white">
        <span class="font-semibold">Dirección:</span>
        <span>{{ user?.address }}</span>
      </div>

      <div class="flex items-center gap-3 text-gray-800 dark:text-white">
        <span class="font-semibold">Teléfono:</span>
        <span>{{ user?.phone }}</span>
      </div>

      <!-- Botón -->
      <div class="pt-4 text-center sm:text-right">
        <button
          @click="goToEditProfile"
          class="bg-primary hover:bg-hover text-white font-semibold py-2 px-6 rounded-md transition-colors"
        >
          Editar perfil
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { UserIcon, MailIcon, ShieldIcon } from 'lucide-vue-next'

const { user } = useAuth()
const router = useRouter()

function goToEditProfile() {
  router.push('/profile/edit')
}
</script>
