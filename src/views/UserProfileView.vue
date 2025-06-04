<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Header with avatar and name -->
    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
      <div class="relative">
        <img
          :src="`https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName}%20${user?.lastName}&backgroundColor=3F51B5&textColor=ffffff`"
          alt="Avatar del usuario"
          class="w-20 h-20 rounded-full border-4 border-primary shadow-lg"
        />
        <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
      </div>
      
      <div class="text-center sm:text-left flex-1">
        <h1 class="text-3xl font-bold tracking-tight text-darkText dark:text-white mb-1">
          {{ user?.firstName }} {{ user?.lastName }}
        </h1>
        <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
            <UserCheckIcon class="w-3 h-3 mr-1" />
            {{ user?.role }}
          </span>
          <span class="text-sm text-lightText dark:text-gray-400">
            Miembro desde {{ formatJoinDate() }}
          </span>
        </div>
        <p class="text-lightText dark:text-gray-400">
          Gestiona tu información personal y preferencias
        </p>
      </div>
    </div>

    <!-- Profile sections -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main profile info -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-darkText dark:text-white">
              Información Personal
            </h2>
            <RouterLink
              to="/profile/edit"
              class="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <EditIcon class="w-4 h-4" />
              Editar
            </RouterLink>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Contact Info -->
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MailIcon class="w-5 h-5 text-primary" />
                </div>
                <div class="flex-1">
                  <p class="text-xs font-medium text-lightText dark:text-gray-400 uppercase tracking-wide">
                    Email
                  </p>
                  <p class="text-darkText dark:text-white font-medium">
                    {{ user?.email }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <PhoneIcon class="w-5 h-5 text-primary" />
                </div>
                <div class="flex-1">
                  <p class="text-xs font-medium text-lightText dark:text-gray-400 uppercase tracking-wide">
                    Teléfono
                  </p>
                  <p class="text-darkText dark:text-white font-medium">
                    {{ user?.phone || 'No especificado' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Location & Status -->
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPinIcon class="w-5 h-5 text-primary" />
                </div>
                <div class="flex-1">
                  <p class="text-xs font-medium text-lightText dark:text-gray-400 uppercase tracking-wide">
                    Dirección
                  </p>
                  <p class="text-darkText dark:text-white font-medium">
                    {{ user?.address || 'No especificada' }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon class="w-5 h-5 text-primary" />
                </div>
                <div class="flex-1">
                  <p class="text-xs font-medium text-lightText dark:text-gray-400 uppercase tracking-wide">
                    Estado de Cuenta
                  </p>
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p class="text-darkText dark:text-white font-medium capitalize">
                      {{ user?.accountStatus || 'Activa' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar with quick actions -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-darkText dark:text-white mb-4">
            Acciones Rápidas
          </h3>
          <div class="space-y-3">
            <RouterLink
              :to="getRoleDashboard()"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                <HomeIcon class="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p class="text-sm font-medium text-darkText dark:text-white">
                  {{ getRoleDashboardTitle() }}
                </p>
                <p class="text-xs text-lightText dark:text-gray-400">
                  Panel principal
                </p>
              </div>
            </RouterLink>
          </div>
        </div>

        <!-- Account Security -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-darkText dark:text-white mb-4">
            Seguridad
          </h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-secondary dark:bg-gray-700 rounded-lg">
              <div class="flex items-center gap-3">
                <LockIcon class="w-4 h-4 text-lightText" />
                <span class="text-sm text-darkText dark:text-white">
                  Contraseña
                </span>
              </div>
              <RouterLink 
                to="/profile/change-password"
                class="text-xs text-primary hover:text-primary-dark font-medium transition-colors"
              >
                Cambiar
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { 
  Mail as MailIcon, 
  Phone as PhoneIcon, 
  MapPin as MapPinIcon, 
  ShieldCheck as ShieldCheckIcon,
  UserCheck as UserCheckIcon,
  Edit as EditIcon,
  Home as HomeIcon,
  Lock as LockIcon
} from 'lucide-vue-next'

const { user } = useAuth()

// Format join date (you might want to add this field to your user model)
const formatJoinDate = (): string => {
  // Since we don't have a createdAt field, we'll use a placeholder
  // In a real app, you'd format the user's registration date
  return new Date().getFullYear().toString()
}

// Get role-specific dashboard route
const getRoleDashboard = (): string => {
  switch (user.value?.role) {
    case 'admin':
      return '/admin/dashboard'
    case 'host':
      return '/host/dashboard'
    case 'user':
      return '/user/dashboard'
    default:
      return '/'
  }
}

// Get role-specific dashboard title
const getRoleDashboardTitle = (): string => {
  switch (user.value?.role) {
    case 'admin':
      return 'Panel Admin'
    case 'host':
      return 'Panel Host'
    case 'user':
      return 'Mi Dashboard'
    default:
      return 'Dashboard'
  }
}
</script>

<style scoped>
.bg-primary {
  background-color: #3F51B5;
}

.text-primary {
  color: #3F51B5;
}

.bg-primary-dark,
.hover\:bg-primary-dark:hover {
  background-color: #303F9F;
}

.bg-primary\/10 {
  background-color: rgb(63 81 181 / 0.1);
}
</style>