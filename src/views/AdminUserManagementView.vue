<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6">
    <!-- Page Header -->
    <header class="mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center">
        Panel de Gestión de Usuarios
      </h1>
    </header>

    <!-- Enhanced Filters Section -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Filtros
        </h2>
        <button
          v-if="filterRole || filterStatus"
          @click="clearFilters"
          class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline focus:outline-none"
        >
          Limpiar filtros
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Role Filter -->
        <div class="space-y-2">
          <label for="filterRole" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Filtrar por Rol
          </label>
          <select
            id="filterRole"
            v-model="filterRole"
            class="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="">Todos los Roles</option>
            <option value="admin">Administrador</option>
            <option value="host">Anfitrión</option>
            <option value="user">Usuario</option>
          </select>
        </div>
        
        <!-- Status Filter -->
        <div class="space-y-2">
          <label for="filterStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Filtrar por Estado
          </label>
          <select
            id="filterStatus"
            v-model="filterStatus"
            class="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="">Todos los Estados</option>
            <option value="active">Activo</option>
            <option value="pending_verification">Pendiente</option>
            <option value="suspended">Suspendido</option>
            <option value="deleted">Eliminado</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Export Buttons -->
    <div class="flex flex-col sm:flex-row justify-end gap-3 mb-6">
              <button 
        @click="exportCSV" 
        class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        <DownloadIcon class="w-4 h-4" />
        Exportar CSV
      </button>
      <button 
        @click="exportPDF" 
        class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        <FileTextIcon class="w-4 h-4" />
        Exportar PDF
      </button>
    </div>

    <!-- User Form -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
        <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <UserPlusIcon v-if="!isEditing" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <EditIcon v-else class="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        {{ isEditing ? 'Editar Usuario' : 'Crear Usuario' }}
      </h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- First Name -->
          <div class="space-y-2">
            <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre <span class="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              :class="[
                'w-full h-12 px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                formErrors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="Ingrese el nombre"
            />
            <p v-if="formErrors.firstName" class="text-sm text-red-600 dark:text-red-400">
              El nombre es obligatorio
            </p>
          </div>

          <!-- Last Name -->
          <div class="space-y-2">
            <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Apellido <span class="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              :class="[
                'w-full h-12 px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                formErrors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="Ingrese el apellido"
            />
            <p v-if="formErrors.lastName" class="text-sm text-red-600 dark:text-red-400">
              El apellido es obligatorio
            </p>
          </div>

          <!-- Email -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Correo Electrónico <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              :disabled="isEditing"
              :class="[
                'w-full h-12 px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
                isEditing && 'opacity-50 cursor-not-allowed'
              ]"
              placeholder="correo@ejemplo.com"
            />
            <p v-if="formErrors.email" class="text-sm text-red-600 dark:text-red-400">
              Ingrese un correo electrónico válido
            </p>
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contraseña <span v-if="!isEditing" class="text-red-500">*</span>
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              :required="!isEditing"
              :class="[
                'w-full h-12 px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                formErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              ]"
              :placeholder="isEditing ? 'Dejar en blanco para mantener actual' : 'Ingrese la contraseña'"
            />
            <p v-if="formErrors.password" class="text-sm text-red-600 dark:text-red-400">
              La contraseña es obligatoria
            </p>
          </div>

          <!-- Phone -->
          <div class="space-y-2">
            <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Teléfono <span class="text-red-500">*</span>
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              required
              :class="[
                'w-full h-12 px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                formErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="+595 21 123 456"
            />
            <p v-if="formErrors.phone" class="text-sm text-red-600 dark:text-red-400">
              El teléfono es obligatorio
            </p>
          </div>

          <!-- Address -->
          <div class="space-y-2">
            <label for="address" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Dirección <span class="text-red-500">*</span>
            </label>
            <input
              id="address"
              v-model="form.address"
              type="text"
              required
              :class="[
                'w-full h-12 px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                formErrors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="Av. Mariscal López 123"
            />
            <p v-if="formErrors.address" class="text-sm text-red-600 dark:text-red-400">
              La dirección es obligatoria
            </p>
          </div>

          <!-- Role -->
          <div class="space-y-2">
            <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Rol <span class="text-red-500">*</span>
            </label>
            <select
              id="role"
              v-model="form.role"
              required
              :class="[
                'w-full h-12 px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                formErrors.role ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              ]"
            >
              <option value="">Seleccionar rol...</option>
              <option value="admin">Administrador</option>
              <option value="host">Anfitrión</option>
              <option value="user">Usuario</option>
            </select>
            <p v-if="formErrors.role" class="text-sm text-red-600 dark:text-red-400">
              Debe seleccionar un rol
            </p>
          </div>

          <!-- Status -->
          <div class="space-y-2">
            <label for="accountStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Estado <span class="text-red-500">*</span>
            </label>
            <select
              id="accountStatus"
              v-model="form.accountStatus"
              required
              :class="[
                'w-full h-12 px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                formErrors.accountStatus ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              ]"
            >
              <option value="">Seleccionar estado...</option>
              <option value="active">Activo</option>
              <option value="pending_verification">Pendiente</option>
              <option value="suspended">Suspendido</option>
              <option value="deleted">Eliminado</option>
            </select>
            <p v-if="formErrors.accountStatus" class="text-sm text-red-600 dark:text-red-400">
              Debe seleccionar un estado
            </p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button 
            type="button" 
            @click="resetForm" 
            class="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors inline-flex items-center justify-center gap-2"
          >
            <XIcon class="w-4 h-4" />
            Cancelar
          </button>
          <button 
            type="submit" 
            class="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            :disabled="isSubmitting"
          >
            <LoaderIcon v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            <SaveIcon v-else class="w-4 h-4" />
            {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Users List -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
            <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <UsersIcon class="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            Lista de Usuarios
          </h2>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ filteredUsers.length }} usuario{{ filteredUsers.length !== 1 ? 's' : '' }}
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="p-12 text-center">
        <LoaderIcon class="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
        <p class="text-gray-600 dark:text-gray-400">Cargando usuarios...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredUsers.length === 0" class="p-12 text-center">
        <div class="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <UsersIcon class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No se encontraron usuarios
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          {{ (filterRole || filterStatus) ? 'No hay usuarios que coincidan con los filtros actuales.' : 'Comience creando su primer usuario.' }}
        </p>
      </div>

      <!-- Desktop Table -->
      <div v-else class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Usuario
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contacto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rol
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="user in filteredUsers" 
              :key="user._id" 
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <!-- User info with avatar -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <span class="text-sm font-medium text-white">
                        {{ getInitials(user.firstName, user.lastName) }}
                      </span>
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ user.firstName }} {{ user.lastName }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {{ user.email }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Contact info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ user.phone }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-32">{{ user.address }}</div>
              </td>

              <!-- Role badge -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getRoleBadge(user.role)">
                  {{ getRoleLabel(user.role) }}
                </span>
              </td>

              <!-- Status badge -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadge(user.accountStatus)">
                  {{ getStatusLabel(user.accountStatus) }}
                </span>
              </td>

              <!-- Action buttons -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex justify-end space-x-2">
                  <button 
                    @click="editUser(user)" 
                    class="inline-flex items-center p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :aria-label="`Edit user ${user.firstName} ${user.lastName}`"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button 
                    @click="confirmDelete(user._id, `${user.firstName} ${user.lastName}`)" 
                    class="inline-flex items-center p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    :aria-label="`Delete user ${user.firstName} ${user.lastName}`"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tablet View -->
      <div class="hidden md:block lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
        <div 
          v-for="user in filteredUsers" 
          :key="user._id" 
          class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-4">
              <div class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span class="text-lg font-medium text-white">
                  {{ getInitials(user.firstName, user.lastName) }}
                </span>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ user.firstName }} {{ user.lastName }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="editUser(user)" 
                class="inline-flex items-center p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                :aria-label="`Edit user ${user.firstName} ${user.lastName}`"
              >
                <PencilIcon class="w-5 h-5" />
              </button>
              <button 
                @click="confirmDelete(user._id, `${user.firstName} ${user.lastName}`)" 
                class="inline-flex items-center p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                :aria-label="`Delete user ${user.firstName} ${user.lastName}`"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Teléfono:</span>
              <p class="text-sm text-gray-900 dark:text-white">{{ user.phone }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Dirección:</span>
              <p class="text-sm text-gray-900 dark:text-white truncate">{{ user.address }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Rol:</span>
              <span :class="getRoleBadge(user.role)" class="mt-1">{{ getRoleLabel(user.role) }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Estado:</span>
              <span :class="getStatusBadge(user.accountStatus)" class="mt-1">{{ getStatusLabel(user.accountStatus) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        <div 
          v-for="user in filteredUsers" 
          :key="user._id" 
          class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span class="text-sm font-medium text-white">
                  {{ getInitials(user.firstName, user.lastName) }}
                </span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">
                  {{ user.firstName }} {{ user.lastName }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</p>
              </div>
            </div>
            <div class="flex space-x-1">
              <button 
                @click="editUser(user)" 
                class="inline-flex items-center p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                :aria-label="`Edit user ${user.firstName} ${user.lastName}`"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              <button 
                @click="confirmDelete(user._id, `${user.firstName} ${user.lastName}`)" 
                class="inline-flex items-center p-1.5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                :aria-label="`Delete user ${user.firstName} ${user.lastName}`"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Teléfono:</span>
              <span class="text-xs text-gray-900 dark:text-white">{{ user.phone }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Dirección:</span>
              <span class="text-xs text-gray-900 dark:text-white truncate max-w-32">{{ user.address }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Rol:</span>
              <span :class="getRoleBadge(user.role)">{{ getRoleLabel(user.role) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Estado:</span>
              <span :class="getStatusBadge(user.accountStatus)">{{ getStatusLabel(user.accountStatus) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * UserManagementView.vue
 * ----------------------
 * Enhanced user management interface with improved UX/UI
 * 
 * Features:
 * - Responsive design with mobile-first approach
 * - Improved filter section with consistent spacing
 * - Enhanced visual hierarchy and spacing
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Dark mode support
 * - Clean form design with proper spacing
 * - Improved button styling and interactions
 * - Better empty states and loading indicators
 */

import { ref, computed, onMounted, watch } from 'vue'
import { 
  PencilIcon, 
  TrashIcon, 
  DownloadIcon, 
  FileTextIcon,
  UserPlusIcon, 
  EditIcon, 
  XIcon, 
  SaveIcon, 
  LoaderIcon, 
  UsersIcon 
} from 'lucide-vue-next'
import Swal from 'sweetalert2'
import { User, getAllUsers, createUser, updateUserById, deleteUser } from '@/services/userService'
import FloatingInput from '@/components/ui/FloatingInput.vue'
import FloatingSelect from '@/components/ui/FloatingSelect.vue'

// ===== REACTIVE DATA =====
const users = ref<User[]>([])
const form = ref<Partial<User>>({})
const formErrors = ref<Record<string, boolean>>({})
const isLoading = ref(false)
const isSubmitting = ref(false)
const filterRole = ref('')
const filterStatus = ref('')

// ===== COMPUTED PROPERTIES =====

/**
 * Check if form is in editing mode
 */
const isEditing = computed(() => !!form.value._id)

/**
 * Filter users based on selected criteria
 */
const filteredUsers = computed(() => {
  // Ensure users.value is always an array
  const userList = Array.isArray(users.value) ? users.value : []
  
  return userList.filter(user => {
    const roleMatch = filterRole.value ? user.role === filterRole.value : true
    const statusMatch = filterStatus.value ? user.accountStatus === filterStatus.value : true
    return roleMatch && statusMatch
  })
})

// ===== OPTIONS =====
const roleOptions = [
  { value: '', label: 'Todos los Roles' },
  { value: 'admin', label: 'Administrador' },
  { value: 'host', label: 'Anfitrión' },
  { value: 'user', label: 'Usuario' }
]

const roleOptionsForm = [
  { value: 'admin', label: 'Administrador' },
  { value: 'host', label: 'Anfitrión' },
  { value: 'user', label: 'Usuario' }
]

const statusOptions = [
  { value: '', label: 'Todos los Estados' },
  { value: 'active', label: 'Activo' },
  { value: 'pending_verification', label: 'Pendiente' },
  { value: 'suspended', label: 'Suspendido' },
  { value: 'deleted', label: 'Eliminado' }
]

const statusOptionsForm = [
  { value: 'active', label: 'Activo' },
  { value: 'pending_verification', label: 'Pendiente' },
  { value: 'suspended', label: 'Suspendido' },
  { value: 'deleted', label: 'Eliminado' }
]

// ===== UTILITY FUNCTIONS =====

/**
 * Get user initials for avatar
 */
const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

/**
 * Get role label in English
 */
const getRoleLabel = (role: string): string => {
  const labels = {
    admin: 'Administrator',
    host: 'Host',
    user: 'User'
  }
  return labels[role as keyof typeof labels] || role
}

/**
 * Get status label in English
 */
const getStatusLabel = (status: string): string => {
  const labels = {
    active: 'Active',
    pending_verification: 'Pending',
    suspended: 'Suspended',
    deleted: 'Deleted'
  }
  return labels[status as keyof typeof labels] || status
}

/**
 * Get CSS classes for role badges
 */
const getRoleBadge = (role: string): string => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  const colors = {
    admin: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200',
    host: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
    user: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
  return `${base} ${colors[role as keyof typeof colors] || colors.user}`
}

/**
 * Get CSS classes for status badges
 */
const getStatusBadge = (status: string): string => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  const colors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
    pending_verification: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
    suspended: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
    deleted: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
  return `${base} ${colors[status as keyof typeof colors] || colors.active}`
}

/**
 * Clear all active filters
 */
const clearFilters = (): void => {
  filterRole.value = ''
  filterStatus.value = ''
}

// ===== FORM VALIDATION =====

/**
 * Validate form fields
 */
const validateForm = (): boolean => {
  formErrors.value = {}
  let isValid = true

  const requiredFields = ['firstName', 'lastName', 'email', 'role', 'phone', 'address', 'accountStatus']
  
  requiredFields.forEach(field => {
    if (!form.value[field as keyof User]) {
      formErrors.value[field] = true
      isValid = false
    }
  })

  if (!isEditing.value && !form.value.password) {
    formErrors.value.password = true
    isValid = false
  }

  if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    formErrors.value.email = true
    isValid = false
  }

  return isValid
}

// ===== CRUD OPERATIONS =====

/**
 * Load all users from API
 */
const loadUsers = async (): Promise<void> => {
  try {
    isLoading.value = true
    users.value = await getAllUsers()
  } catch (error) {
    console.error('Error loading users:', error)
    users.value = []
    
    let errorMessage = 'Could not load users.'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'OK'
    })
  } finally {
    isLoading.value = false
  }
}

/**
 * Handle form submission (create or update)
 */
const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    Swal.fire('Error', 'Please complete all required fields.', 'warning')
    return
  }

  try {
    isSubmitting.value = true

    if (isEditing.value) {
      await updateUserById(form.value._id!, form.value as User)
      await Swal.fire('Success', 'User updated successfully.', 'success')
    } else {
      // For creating users, ensure we have the right data structure
      const userData = {
        firstName: form.value.firstName!,
        lastName: form.value.lastName!,
        email: form.value.email!,
        password: form.value.password!,
        role: form.value.role! as 'admin' | 'host' | 'user',
        phone: form.value.phone!,
        address: form.value.address!,
        // Use active as default for new users if not specified
        accountStatus: form.value.accountStatus as 'active' | 'suspended' | 'deleted' | 'pending_verification' || 'active'
      }
      
      console.log('Frontend sending userData:', JSON.stringify(userData, null, 2))
      
      await createUser(userData)
      await Swal.fire('Success', 'User created successfully.', 'success')
    }

    resetForm()
    // Force reload users list
    await loadUsers()
  } catch (error) {
    console.error('Error saving user:', error)
    
    let errorMessage = 'Could not save user.'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'OK'
    })
  } finally {
    isSubmitting.value = false
  }
}

/**
 * Edit existing user
 */
const editUser = (user: User): void => {
  form.value = { ...user }
  formErrors.value = {}
  document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })
}

/**
 * Confirm and delete user
 */
const confirmDelete = async (userId: string, userName: string): Promise<void> => {
  const result = await Swal.fire({
    title: 'Delete User?',
    text: `${userName} will be deleted. This action cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      await deleteUser(userId)
      await Swal.fire('Deleted', 'User deleted successfully.', 'success')
      // Force reload users list
      await loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      Swal.fire('Error', 'Could not delete user.', 'error')
    }
  }
}

/**
 * Reset form to initial state
 */
const resetForm = (): void => {
  form.value = {}
  formErrors.value = {}
}

// ===== EXPORT FUNCTIONS =====

/**
 * Export users to CSV
 */
const exportCSV = (): void => {
  const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Address', 'Role', 'Status']
  const csvContent = [
    headers.join(','),
    ...filteredUsers.value.map(user => [
      user.firstName,
      user.lastName,
      user.email,
      user.phone,
      user.address,
      getRoleLabel(user.role),
      getStatusLabel(user.accountStatus)
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export users to PDF
 */
const exportPDF = (): void => {
  // Create HTML content for PDF
  const htmlContent = `
    <html>
      <head>
        <title>Users List</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f8f9fa; font-weight: 600; }
          .badge { padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 500; }
          .admin { background-color: #e9d5ff; color: #7c3aed; }
          .host { background-color: #dbeafe; color: #3b82f6; }
          .user { background-color: #f3f4f6; color: #374151; }
          .active { background-color: #d1fae5; color: #065f46; }
          .pending { background-color: #fef3c7; color: #92400e; }
          .suspended { background-color: #fee2e2; color: #991b1b; }
          .deleted { background-color: #f3f4f6; color: #374151; }
          tr:nth-child(even) { background-color: #f9fafb; }
          tr:hover { background-color: #f3f4f6; }
        </style>
      </head>
      <body>
        <h1>Users List</h1>
        <p style="text-align: center; color: #6b7280; margin-bottom: 20px;">
          Generated on ${new Date().toLocaleDateString()} - Total: ${filteredUsers.value.length} users
        </p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredUsers.value.map(user => `
              <tr>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.address}</td>
                <td><span class="badge ${user.role}">${getRoleLabel(user.role)}</span></td>
                <td><span class="badge ${user.accountStatus}">${getStatusLabel(user.accountStatus)}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `

  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }
}

// ===== LIFECYCLE =====
onMounted(async () => {
  await loadUsers()
  
  // Reactivity for filters - reload when filters change
  watch([filterRole, filterStatus], () => {
    console.log('Filters changed:', { role: filterRole.value, status: filterStatus.value })
  })
})
</script>