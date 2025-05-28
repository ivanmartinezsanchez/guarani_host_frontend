<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <!-- Header with avatar and name -->
    <div class="flex items-center gap-4 mb-8">
      <img
        :src="`https://api.dicebear.com/6.x/initials/svg?seed=${user?.firstName}%20${user?.lastName}`"
        alt="Avatar"
        class="w-14 h-14 rounded-full border-2 border-primary shadow"
      />
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
          Hola, {{ user?.firstName }} {{ user?.lastName }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Información Personal</p>
      </div>
    </div>

    <!-- Profile card -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-6 transition-shadow">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 dark:text-white">
        <div class="flex items-center gap-3">
          <MailIcon class="w-5 h-5 text-primary" />
          <span>{{ user?.email }}</span>
        </div>
        <div class="flex items-center gap-3">
          <PhoneIcon class="w-5 h-5 text-primary" />
          <span>{{ user?.phone || 'Not provided' }}</span>
        </div>
        <div class="flex items-center gap-3">
          <MapPinIcon class="w-5 h-5 text-primary" />
          <span>{{ user?.address || 'Not provided' }}</span>
        </div>
        <div class="flex items-center gap-3">
          <BadgeCheckIcon class="w-5 h-5 text-primary" />
          <span class="capitalize">{{ user?.role }}</span>
        </div>
      </div>

      <!-- Edit button -->
      <div class="flex justify-end">
        <RouterLink
          to="/profile/edit"
          class="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-hover transition"
        >
          <UserIcon class="w-5 h-5" />
          Editar Perfil
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * UserProfileView.vue
 * - Displays authenticated user's personal data
 * - Navigation to EditProfileView included
 */

import { useAuth } from '@/composables/useAuth'
import { Mail as MailIcon, Phone as PhoneIcon, MapPin as MapPinIcon, BadgeCheck as BadgeCheckIcon, User as UserIcon } from 'lucide-vue-next'

const { user } = useAuth()
</script>

<style scoped>
.bg-primary {
  background-color: #3F51B5;
}
.hover\:bg-hover:hover {
  background-color: #303F9F;
}
</style>
