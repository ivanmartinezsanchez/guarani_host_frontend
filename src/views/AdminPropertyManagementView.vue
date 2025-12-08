<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6">
    <!-- Page Header -->
    <header class="mb-8">
      <div class="flex items-center space-x-4 mb-2">
        <button
          @click="goBack"
          class="inline-flex items-center p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Go back to dashboard"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <div>
          <h1
            class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
          >
            Gestión de Propiedades
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Administra las propiedades y su disponibilidad
          </p>
        </div>
      </div>
    </header>

    <!-- Filters Section -->
    <section
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Filtros
        </h2>
        <button
          v-if="hasActiveFilters"
          @click="clearAllFilters"
          class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline focus:outline-none"
        >
          Limpiar filtros
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- City Filter -->
        <div class="space-y-2">
          <label
            for="cityFilter"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Ciudad
          </label>
          <select
            id="cityFilter"
            v-model="cityFilter"
            class="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Todas las Ciudades</option>
            <option v-for="city in availableCities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </div>

        <!-- Status Filter (uses backend enum values) -->
        <div class="space-y-2">
          <label
            for="statusFilter"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Estado
          </label>
          <select
            id="statusFilter"
            v-model="statusFilter"
            class="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Todos los Estados</option>
            <option value="AVAILABLE">Disponible</option>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
            <option value="MAINTENANCE">Mantenimiento</option>
          </select>
        </div>

        <!-- Price Range Min -->
        <div class="space-y-2">
          <label
            for="minPrice"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Precio Min.
          </label>
          <div class="relative">
            <DollarSignIcon
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            />
            <input
              id="minPrice"
              v-model="priceRange.min"
              type="number"
              min="0"
              placeholder="0"
              class="w-full h-10 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <!-- Price Range Max -->
        <div class="space-y-2">
          <label
            for="maxPrice"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Precio Máx.
          </label>
          <div class="relative">
            <DollarSignIcon
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            />
            <input
              id="maxPrice"
              v-model="priceRange.max"
              type="number"
              min="0"
              placeholder="∞"
              class="w-full h-10 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Host Filter (admin only) -->
      <div
        v-if="user.role === 'admin'"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
      >
        <div class="space-y-2">
          <label
            for="hostFilter"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Anfitrión
          </label>
          <input
            id="hostFilter"
            v-model="hostFilter"
            type="text"
            placeholder="Filtrar por nombre o ID del anfitrión..."
            class="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
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

    <!-- Property Form (always visible) -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
    >
      <h2
        class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3"
      >
        <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <PlusIcon
            v-if="!editId"
            class="w-5 h-5 text-blue-600 dark:text-blue-400"
          />
          <EditIcon v-else class="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        {{ editId ? "Editar Propiedad" : "Crear Nueva Propiedad" }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Basic Information -->
        <div class="space-y-6">
          <h3
            class="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2"
          >
            Información Básica
          </h3>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Property Title -->
            <div class="lg:col-span-2 space-y-2">
              <label
                for="title"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Título de la Propiedad <span class="text-red-500">*</span>
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                :class="[
                  'w-full h-12 px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                  formErrors.title
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600',
                ]"
                placeholder="ej., Hermosa Casa Colonial en el Centro Histórico"
              />
              <p
                v-if="formErrors.title"
                class="text-sm text-red-600 dark:text-red-400"
              >
                El título de la propiedad es obligatorio
              </p>
            </div>

            <!-- Property Description -->
            <div class="lg:col-span-2 space-y-2">
              <label
                for="description"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Descripción <span class="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                v-model="form.description"
                required
                rows="4"
                :class="[
                  'w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none',
                  formErrors.description
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600',
                ]"
                placeholder="Describe la propiedad, sus características, comodidades y aspectos destacados de la ubicación..."
              ></textarea>
              <div class="flex justify-between items-center">
                <p
                  v-if="formErrors.description"
                  class="text-sm text-red-600 dark:text-red-400"
                >
                  La descripción debe tener al menos 50 caracteres
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ form.description?.length || 0 }}/50 caracteres mínimo
                </p>
              </div>
            </div>

            <!-- Address -->
            <div class="space-y-2">
              <label
                for="address"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Dirección <span class="text-red-500">*</span>
              </label>
              <input
                id="address"
                v-model="form.address"
                type="text"
                required
                :class="[
                  'w-full h-12 px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                  formErrors.address
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600',
                ]"
                placeholder="ej., Avenida España 123"
              />
              <p
                v-if="formErrors.address"
                class="text-sm text-red-600 dark:text-red-400"
              >
                La dirección es obligatoria
              </p>
            </div>

            <!-- City -->
            <div class="space-y-2">
              <label
                for="city"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Ciudad <span class="text-red-500">*</span>
              </label>
              <input
                id="city"
                v-model="form.city"
                type="text"
                required
                :class="[
                  'w-full h-12 px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                  formErrors.city
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600',
                ]"
                placeholder="ej., Asunción"
              />
              <p
                v-if="formErrors.city"
                class="text-sm text-red-600 dark:text-red-400"
              >
                La ciudad es obligatoria
              </p>
            </div>

            <!-- Price per Night -->
            <div class="space-y-2">
              <label
                for="pricePerNight"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Precio por Noche (USD) <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <DollarSignIcon
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                />
                <input
                  id="pricePerNight"
                  v-model="form.pricePerNight"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  :class="[
                    'w-full h-12 pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                    formErrors.pricePerNight
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600',
                  ]"
                  placeholder="0.00"
                />
              </div>
              <p
                v-if="formErrors.pricePerNight"
                class="text-sm text-red-600 dark:text-red-400"
              >
                El precio debe ser mayor que cero
              </p>
            </div>

            <!-- Maximum Guests -->
            <div class="space-y-2">
              <label
                for="maxGuests"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Huéspedes Máximos <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <UsersIcon
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                />
                <input
                  id="maxGuests"
                  v-model="form.maxGuests"
                  type="number"
                  min="1"
                  max="20"
                  required
                  :class="[
                    'w-full h-12 pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                    formErrors.maxGuests
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600',
                  ]"
                  placeholder="1"
                />
              </div>
              <p
                v-if="formErrors.maxGuests"
                class="text-sm text-red-600 dark:text-red-400"
              >
                El número de huéspedes debe estar entre 1 y 20
              </p>
            </div>

            <!-- Host Selection (Admin) / Hidden Host ID (Host) -->
            <div v-if="user.role === 'admin'" class="space-y-2">
              <label
                for="host"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Anfitrión <span class="text-red-500">*</span>
              </label>
              <select
                id="host"
                v-model="form.host"
                required
                :class="[
                  'w-full h-12 px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                  formErrors.host
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600',
                ]"
              >
                <option value="">Seleccionar anfitrión...</option>
                <option
                  v-for="host in availableHosts"
                  :key="host._id"
                  :value="host._id"
                >
                  {{ host.firstName }} {{ host.lastName }} ({{ host.email }})
                </option>
              </select>
              <p
                v-if="formErrors.host"
                class="text-sm text-red-600 dark:text-red-400"
              >
                Debe seleccionar un anfitrión
              </p>
            </div>

            <!-- Hidden host field for hosts -->
            <input v-else v-model="form.host" type="hidden" />

            <!-- Property Status (backend enum values) -->
            <div class="space-y-2">
              <label
                for="status"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Estado de la Propiedad
              </label>
              <select
                id="status"
                v-model="form.status"
                class="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="AVAILABLE">Disponible</option>
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
                <option value="MAINTENANCE">Mantenimiento</option>
              </select>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Solo las propiedades "Disponibles" serán visibles para los
                usuarios
              </p>
            </div>
          </div>
        </div>

        <!-- Amenities Section -->
        <div class="space-y-6">
          <h3
            class="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2"
          >
            Comodidades
          </h3>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="amenity in availableAmenities"
              :key="amenity.id"
              class="flex items-center space-x-3"
            >
              <input
                :id="`amenity-${amenity.id}`"
                v-model="form.amenities"
                :value="amenity.id"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label
                :for="`amenity-${amenity.id}`"
                class="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                <component
                  :is="amenity.icon"
                  class="w-4 h-4 mr-2 text-gray-500"
                />
                {{ amenity.label }}
              </label>
            </div>
          </div>
        </div>

        <!-- Image Upload Section -->
        <div class="space-y-6">
          <h3
            class="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2"
          >
            Imágenes de la Propiedad <span class="text-red-500">*</span>
          </h3>

          <!-- Upload Area -->
          <div
            :class="[
              'border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors',
              formErrors.images
                ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                : 'border-gray-300 dark:border-gray-600',
            ]"
          >
            <ImageIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div class="space-y-2">
              <label for="images" class="cursor-pointer">
                <span
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <UploadIcon class="w-4 h-4 mr-2" />
                  Seleccionar Imágenes
                </span>
                <input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  @change="handleImageUpload"
                  class="sr-only"
                />
              </label>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                o arrastra y suelta las imágenes aquí
              </p>
              <p class="text-xs text-gray-400">
                PNG, JPG, WebP hasta 5MB cada una (1-10 imágenes)
              </p>
            </div>
          </div>

          <!-- Error message for images -->
          <p
            v-if="formErrors.images"
            class="text-sm text-red-600 dark:text-red-400 flex items-center"
          >
            <AlertCircleIcon class="w-4 h-4 mr-1" />
            {{ formErrors.images }}
          </p>

          <!-- Image Previews -->
          <div v-if="imagePreviews.length > 0" class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Imágenes ({{ imagePreviews.length }}/10)
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Primera imagen es la foto principal
              </p>
            </div>

            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <div
                v-for="(preview, index) in imagePreviews"
                :key="`preview-${index}`"
                class="relative group border-2 rounded-lg overflow-hidden transition-all"
                :class="
                  index === 0
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                    : 'border-gray-200 dark:border-gray-600'
                "
              >
                <!-- Main photo badge -->
                <div v-if="index === 0" class="absolute top-2 left-2 z-10">
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white shadow-md"
                  >
                    <StarIcon class="w-3 h-3 mr-1" />
                    Principal
                  </span>
                </div>

                <!-- Image -->
                <img
                  :src="preview"
                  :alt="`Preview imagen ${index + 1}`"
                  class="w-full h-24 object-cover"
                />

                <!-- Control Buttons -->
                <div
                  class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <div class="flex space-x-1">
                    <!-- Move to first (main) -->
                    <button
                      v-if="index !== 0"
                      type="button"
                      @click="moveToFirst(index)"
                      class="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                      :aria-label="`Hacer imagen ${index + 1} la principal`"
                      title="Hacer principal"
                    >
                      <StarIcon class="w-4 h-4" />
                    </button>

                    <!-- Move left -->
                    <button
                      v-if="index > 0"
                      type="button"
                      @click="moveLeft(index)"
                      class="p-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-md"
                      :aria-label="`Mover imagen ${index + 1} a la izquierda`"
                      title="Mover izquierda"
                    >
                      <ChevronLeftIcon class="w-4 h-4" />
                    </button>

                    <!-- Move right -->
                    <button
                      v-if="index < imagePreviews.length - 1"
                      type="button"
                      @click="moveRight(index)"
                      class="p-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-md"
                      :aria-label="`Mover imagen ${index + 1} a la derecha`"
                      title="Mover derecha"
                    >
                      <ChevronRightIcon class="w-4 h-4" />
                    </button>

                    <!-- Remove button -->
                    <button
                      type="button"
                      @click="removeImagePreview(index)"
                      class="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md"
                      :aria-label="`Eliminar imagen ${index + 1}`"
                      title="Eliminar"
                    >
                      <XIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <!-- Drag handle indicator -->
                <div
                  class="absolute bottom-1 right-1 p-1 bg-gray-700 bg-opacity-75 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoveIcon class="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div
          class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
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
            {{
              isSubmitting ? "Guardando..." : editId ? "Actualizar" : "Crear"
            }}
          </button>
        </div>
      </form>
    </div>

    <!-- Properties List -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2
            class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3"
          >
            <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <HomeIcon class="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            Lista de Propiedades
          </h2>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ filteredProperties.length }} propiedad{{
              filteredProperties.length !== 1 ? "es" : ""
            }}
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="p-12 text-center">
        <LoaderIcon class="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
        <p class="text-gray-600 dark:text-gray-300">Cargando propiedades...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredProperties.length === 0" class="p-12 text-center">
        <div
          class="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4"
        >
          <HomeIcon class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No se encontraron propiedades
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          {{
            hasActiveFilters
              ? "No hay propiedades que coincidan con los filtros actuales."
              : "Comience creando su primera propiedad."
          }}
        </p>
      </div>

      <!-- Desktop Table -->
      <div v-else class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Propiedad
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Precio y Capacidad
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Anfitrión
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Comodidades
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="property in filteredProperties"
              :key="property._id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <!-- Property info with image -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <img
                      v-if="property.imageUrls && property.imageUrls[0]"
                      :src="property.imageUrls[0]"
                      :alt="`Imagen principal de ${property.title}`"
                      class="h-12 w-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                    />
                    <div
                      v-else
                      class="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-600 flex items-center justify-center border border-gray-200 dark:border-gray-600"
                    >
                      <ImageIcon class="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p
                      class="text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                      {{ property.title }}
                    </p>
                    <p
                      class="text-sm text-gray-500 dark:text-gray-400 truncate"
                    >
                      {{ property.address }}, {{ property.city }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Price and capacity info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  ${{ property.pricePerNight?.toLocaleString() }}/noche
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  <UsersIcon class="w-4 h-4 inline mr-1" />
                  {{ property.guests }} huéspedes máx.
                </div>
              </td>

              <!-- Status badge -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadge(property.status)">
                  {{ getStatusLabel(property.status) }}
                </span>
              </td>

              <!-- Host information -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{
                    typeof property.host === "object"
                      ? `${property.host.firstName} ${property.host.lastName}`
                      : "ID: " + property.host
                  }}
                </div>
                <div
                  v-if="typeof property.host === 'object'"
                  class="text-sm text-gray-500 dark:text-gray-400"
                >
                  {{ property.host.email }}
                </div>
              </td>

              <!-- Amenities preview -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1 max-w-32">
                  <span
                    v-for="amenityId in property.amenities?.slice(0, 3)"
                    :key="amenityId"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                  >
                    {{ getAmenityLabel(amenityId) }}
                  </span>
                  <span
                    v-if="property.amenities && property.amenities.length > 3"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    +{{ property.amenities.length - 3 }}
                  </span>
                </div>
              </td>

              <!-- Action buttons -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="editProperty(property)"
                    class="inline-flex items-center p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :aria-label="`Editar propiedad ${property.title}`"
                  >
                    <EditIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="handleDeleteProperty(property._id!)"
                    class="inline-flex items-center p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    :aria-label="`Eliminar propiedad ${property.title}`"
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
      <div
        class="hidden md:block lg:hidden divide-y divide-gray-200 dark:divide-gray-700"
      >
        <div
          v-for="property in filteredProperties"
          :key="property._id"
          class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duración-150"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-4">
              <img
                v-if="property.imageUrls && property.imageUrls[0]"
                :src="property.imageUrls[0]"
                :alt="`Imagen principal de ${property.title}`"
                class="h-12 w-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
              />
              <div
                v-else
                class="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-600 flex items-center justify-center border border-gray-200 dark:border-gray-600"
              >
                <ImageIcon class="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ property.title }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ property.address }}, {{ property.city }}
                </p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                @click="editProperty(property)"
                class="inline-flex items-center p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                :aria-label="`Editar propiedad ${property.title}`"
              >
                <EditIcon class="w-5 h-5" />
              </button>
              <button
                @click="handleDeleteProperty(property._id!)"
                class="inline-flex items-center p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                :aria-label="`Eliminar propiedad ${property.title}`"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >Precio:</span
              >
              <p class="text-sm text-gray-900 dark:text-white">
                ${{ property.pricePerNight }}/noche
              </p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >Capacidad:</span
              >
              <p class="text-sm text-gray-900 dark:text-white">
                {{ property.guests }} huéspedes
              </p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >Estado:</span
              >
              <span :class="getStatusBadge(property.status)" class="mt-1">
                {{ getStatusLabel(property.status) }}
              </span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >Anfitrión:</span
              >
              <p class="text-sm text-gray-900 dark:text-white truncate">
                {{
                  typeof property.host === "object"
                    ? `${property.host.firstName} ${property.host.lastName}`
                    : property.host
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="property in filteredProperties"
          :key="property._id"
          class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duración-150"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-3">
              <img
                v-if="property.imageUrls && property.imageUrls[0]"
                :src="property.imageUrls[0]"
                :alt="`Imagen principal de ${property.title}`"
                class="h-10 w-10 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
              />
              <div
                v-else
                class="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-600 flex items-center justify-center border border-gray-200 dark:border-gray-600"
              >
                <ImageIcon class="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">
                  {{ property.title }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ property.city }}
                </p>
              </div>
            </div>
            <div class="flex space-x-1">
              <button
                @click="editProperty(property)"
                class="inline-flex items-center p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                :aria-label="`Editar propiedad ${property.title}`"
              >
                <EditIcon class="w-4 h-4" />
              </button>
              <button
                @click="handleDeleteProperty(property._id!)"
                class="inline-flex items-center p-1.5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                :aria-label="`Eliminar propiedad ${property.title}`"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400"
                >Precio:</span
              >
              <span class="text-xs text-gray-900 dark:text-white">
                ${{ property.pricePerNight }}/noche
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400"
                >Capacidad:</span
              >
              <span class="text-xs text-gray-900 dark:text-white">
                {{ property.guests }} huéspedes
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400"
                >Estado:</span
              >
              <span :class="getStatusBadge(property.status)">
                {{ getStatusLabel(property.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * PropertyManagementView.vue
 * --------------------------
 * Admin/host interface to manage vacation homes:
 * - List, filter and export properties
 * - Create/edit properties with full form
 * - Image upload with previews and reordering
 * - Amenities and status management
 */

import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  type Property,
  type PropertyStatus,
} from "@/services/propertyService";
import { getAllUsers, type User } from "@/services/userService";

// Lucide icons
import {
  ArrowLeft as ArrowLeftIcon,
  Plus as PlusIcon,
  X as XIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Image as ImageIcon,
  Upload as UploadIcon,
  Home as HomeIcon,
  Users as UsersIcon,
  DollarSign as DollarSignIcon,
  Trash as TrashIcon,
  Star as StarIcon,
  Save as SaveIcon,
  Loader as LoaderIcon,
  Download as DownloadIcon,
  FileText as FileTextIcon,
  Move as MoveIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AlertCircle as AlertCircleIcon,
  Wifi,
  Car,
  Coffee,
  Tv,
  Waves,
  Dumbbell,
  UtensilsCrossed,
  WashingMachine,
  AirVent,
  Shield,
  TreePine,
  Thermometer,
  ParkingCircle,
  Baby,
  Cigarette,
  Dog,
  Accessibility,
} from "lucide-vue-next";

// ===== TYPES AND INTERFACES =====

/**
 * Amenity configuration used to render checkboxes
 */
interface Amenity {
  id: string;
  label: string;
  icon: any;
}

/**
 * Reactive form model that mirrors backend fields,
 * but uses strings for numeric fields so we can bind inputs easily.
 */
interface PropertyForm {
  title: string;
  description: string;
  address: string;
  city: string;
  pricePerNight: string;
  maxGuests: string; 
  host: string;
  status: PropertyStatus;
  amenities: string[];
}

// ===== ROUTER AND NAVIGATION =====

const router = useRouter();

/**
 * Navigate back to the proper dashboard depending on user role.
 */
const goBack = (): void => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.role === "admin") {
    router.push("/admin/dashboard");
  } else if (user.role === "host") {
    router.push("/host/dashboard");
  } else {
    router.push("/");
  }
};

// ===== REACTIVE STATE =====

/** Edit mode: stores current property ID when editing */
const editId = ref<string | null>(null);

/** Loading flags */
const isLoading = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);

/** Search & filter state */
const searchQuery = ref<string>("");
const statusFilter = ref<string>("");
const cityFilter = ref<string>("");
const hostFilter = ref<string>("");
const priceRange = ref<{
  min: number | null;
  max: number | null;
}>({
  min: null,
  max: null,
});

/** Backend data */
const allProperties = ref<Property[]>([]);
const availableHosts = ref<User[]>([]);

/** Image handling: files + preview URLs */
const selectedImages = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);

/** Form validation errors (field -> message) */
const formErrors = ref<Record<string, string | boolean>>({});

/** Current user information (decoded from localStorage) */
const user = JSON.parse(localStorage.getItem("user") || "{}");

/**
 * Base form state: this is reset when creating a new property
 * or when exiting edit mode.
 */
const form = ref<PropertyForm>({
  title: "",
  description: "",
  address: "",
  city: "",
  pricePerNight: "",
  maxGuests: "",
  host: user.role === "host" ? user._id : "",
  status: "AVAILABLE" as PropertyStatus,
  amenities: [],
});

// ===== AMENITIES CONFIGURATION =====

/**
 * Static list of amenities with icons and labels
 */
const availableAmenities = ref<Amenity[]>([
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "parking", label: "Estacionamiento", icon: Car },
  { id: "kitchen", label: "Cocina", icon: Coffee },
  { id: "tv", label: "TV", icon: Tv },
  { id: "pool", label: "Piscina", icon: Waves },
  { id: "gym", label: "Gimnasio", icon: Dumbbell },
  { id: "restaurant", label: "Restaurante", icon: UtensilsCrossed },
  { id: "laundry", label: "Lavandería", icon: WashingMachine },
  { id: "air_conditioning", label: "Aire Acondicionado", icon: AirVent },
  { id: "security", label: "Seguridad 24/7", icon: Shield },
  { id: "garden", label: "Jardín", icon: TreePine },
  { id: "heating", label: "Calefacción", icon: Thermometer },
  { id: "valet_parking", label: "Valet Parking", icon: ParkingCircle },
  { id: "baby_friendly", label: "Apto para Bebés", icon: Baby },
  { id: "smoking_allowed", label: "Permitido Fumar", icon: Cigarette },
  { id: "pet_friendly", label: "Acepta Mascotas", icon: Dog },
  { id: "accessible", label: "Accesible", icon: Accessibility },
]);

// ===== COMPUTED PROPERTIES =====

/** Returns true when we are editing an existing property */
const isEditing = computed(() => !!editId.value);

/**
 * Filter properties by role:
 * - Admin: sees all
 * - Host: only sees own properties
 */
const myProperties = computed<Property[]>(() => {
  let filtered = allProperties.value;

  if (user.role === "host") {
    filtered = filtered.filter((property) => {
      const propertyHostId =
        typeof property.host === "string" ? property.host : property.host?._id;
      return propertyHostId === user._id;
    });
  }

  return filtered;
});

/**
 * Main filtered list for the UI (search, status, city, price, host).
 */
const filteredProperties = computed<Property[]>(() => {
  let filtered = myProperties.value;

  // Text search: title, city, address
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(
      (property) =>
        property.title.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query)
    );
  }

  // City filter
  if (cityFilter.value) {
    filtered = filtered.filter(
      (property) =>
        property.city.toLowerCase() === cityFilter.value.toLowerCase()
    );
  }

  // Status filter (compares directly with backend enum)
  if (statusFilter.value) {
    filtered = filtered.filter(
      (property) => property.status === statusFilter.value
    );
  }

  // Price range filter
  if (priceRange.value.min !== null && priceRange.value.min > 0) {
    filtered = filtered.filter(
      (property) => property.pricePerNight >= priceRange.value.min!
    );
  }
  if (priceRange.value.max !== null && priceRange.value.max > 0) {
    filtered = filtered.filter(
      (property) => property.pricePerNight <= priceRange.value.max!
    );
  }

  // Host filter (admin only)
  if (hostFilter.value.trim() && user.role === "admin") {
    const hostQuery = hostFilter.value.toLowerCase().trim();
    filtered = filtered.filter((property) => {
      if (typeof property.host === "object") {
        const fullName =
          `${property.host.firstName} ${property.host.lastName}`.toLowerCase();
        return (
          fullName.includes(hostQuery) ||
          property.host.email.toLowerCase().includes(hostQuery) ||
          property.host._id.toLowerCase().includes(hostQuery)
        );
      } else {
        return property.host.toLowerCase().includes(hostQuery);
      }
    });
  }

  return filtered;
});

/**
 * List of unique cities for the city filter dropdown.
 */
const availableCities = computed<string[]>(() => {
  const cities = myProperties.value.map((property) => property.city);
  return [...new Set(cities)].sort();
});

/**
 * Returns true when at least one filter is active.
 */
const hasActiveFilters = computed<boolean>(() => {
  return !!(
    statusFilter.value ||
    cityFilter.value ||
    hostFilter.value ||
    priceRange.value.min ||
    priceRange.value.max
  );
});

// ===== LIFECYCLE =====

/**
 * Initial load: properties + available hosts (for admin).
 */
onMounted(async (): Promise<void> => {
  await Promise.all([loadProperties(), loadAvailableHosts()]);
});

// ===== DATA LOADING =====

/**
 * Fetch properties from backend API.
 */
const loadProperties = async (): Promise<void> => {
  try {
    isLoading.value = true;
    allProperties.value = await getProperties();
  } catch (error) {
    console.error("Error loading properties:", error);
    await Swal.fire({
      icon: "error",
      title: "Error de Carga",
      text: "No se pudieron cargar las propiedades. Intente nuevamente.",
      confirmButtonText: "OK",
    });
  } finally {
    isLoading.value = false;
  }
};

/**
 * Fetch host users (only when current user is admin).
 */
const loadAvailableHosts = async (): Promise<void> => {
  if (user.role !== "admin") return;

  try {
    const users = await getAllUsers();
    availableHosts.value = users.filter((user) => user.role === "host");
  } catch (error) {
    console.error("Error loading hosts:", error);
  }
};

// ===== FILTER MANAGEMENT =====

/**
 * Reset all filters to their default values.
 */
const clearAllFilters = (): void => {
  searchQuery.value = "";
  statusFilter.value = "";
  cityFilter.value = "";
  hostFilter.value = "";
  priceRange.value = {
    min: null,
    max: null,
  };
};

// ===== FORM MANAGEMENT =====

/**
 * Reset form and state back to initial values.
 * Used after successful submit or when user clicks "Cancelar".
 */
const resetForm = (): void => {
  form.value = {
    title: "",
    description: "",
    address: "",
    city: "",
    pricePerNight: "",
    maxGuests: "",
    host: user.role === "host" ? user._id : "",
    status: "AVAILABLE" as PropertyStatus,
    amenities: [],
  };
  selectedImages.value = [];
  imagePreviews.value = [];
  editId.value = null;
  formErrors.value = {};
};

/**
 * Basic synchronous validation for the property form.
 * Returns true when the form is valid and populates formErrors otherwise.
 */
const validateForm = (): boolean => {
  const errors: Record<string, string | boolean> = {};
  let isValid = true;

  // Required text fields
  if (!form.value.title?.trim()) {
    errors.title = "El título es obligatorio";
    isValid = false;
  }

  if (!form.value.description?.trim()) {
    errors.description = "La descripción es obligatoria";
    isValid = false;
  } else if (form.value.description.trim().length < 50) {
    errors.description = "La descripción debe tener al menos 50 caracteres";
    isValid = false;
  }

  if (!form.value.address?.trim()) {
    errors.address = "La dirección es obligatoria";
    isValid = false;
  }

  if (!form.value.city?.trim()) {
    errors.city = "La ciudad es obligatoria";
    isValid = false;
  }

  // Price validation
  const price = parseFloat(form.value.pricePerNight);
  if (isNaN(price) || price <= 0) {
    errors.pricePerNight = "El precio debe ser mayor que cero";
    isValid = false;
  }

  // Guests validation
  const guests = parseInt(form.value.maxGuests);
  if (isNaN(guests) || guests <= 0 || guests > 20) {
    errors.maxGuests = "El número de huéspedes debe estar entre 1 y 20";
    isValid = false;
  }

  // Host validation for admins
  if (user.role === "admin" && !form.value.host) {
    errors.host = "Debe seleccionar un anfitrión";
    isValid = false;
  }

  // Image validation: different rules for create vs edit
  if (!isEditing.value) {
    // New property: at least one image required
    if (!selectedImages.value || selectedImages.value.length === 0) {
      errors.images =
        "Se requiere al menos una imagen para crear una nueva propiedad";
      isValid = false;
    }
  } else {
    // Edit property: we allow updating without new images,
    // but there must be at least one image in total.
    if (selectedImages.value && selectedImages.value.length > 10) {
      errors.images = "Máximo 10 imágenes permitidas";
      isValid = false;
    }

    const hasExistingImages =
      imagePreviews.value && imagePreviews.value.length > 0;
    const hasNewImages =
      selectedImages.value && selectedImages.value.length > 0;

    if (!hasExistingImages && !hasNewImages) {
      errors.images = "La propiedad debe tener al menos una imagen";
      isValid = false;
    }
  }

  formErrors.value = errors;

  console.log("🔍 Form validation:", isValid ? "PASSED" : "FAILED", errors);
  console.log("📊 Validation context:", {
    isEditing: isEditing.value,
    editId: editId.value,
    existingImages: imagePreviews.value?.length || 0,
    newImages: selectedImages.value?.length || 0,
  });

  return isValid;
};

/**
 * Handle form submission for create/update.
 * Builds FormData payload that matches backend expectations exactly.
 */
const handleSubmit = async (): Promise<void> => {
  console.log("🚀 Starting form submission...");
  console.log("🔍 Edit mode:", isEditing.value, "Edit ID:", editId.value);

  if (!validateForm()) {
    console.log("❌ Validation failed");
    Swal.fire(
      "Error",
      "Por favor, complete todos los campos requeridos correctamente.",
      "warning"
    );
    return;
  }

  try {
    isSubmitting.value = true;

    const formData = new FormData();

    // Required fields

    formData.append("title", String(form.value.title ?? "").trim());
    formData.append("description", String(form.value.description ?? "").trim());
    formData.append("address", String(form.value.address ?? "").trim());
    formData.append("city", String(form.value.city ?? "").trim());
    formData.append(
      "pricePerNight",
      String(form.value.pricePerNight ?? "").trim()
    );

    // Backend expects "guests" instead of "maxGuests"
    formData.append("guests", String(form.value.maxGuests ?? "").trim());

    // Host depends on current user role
    if (user.role === "admin") {
      formData.append("host", form.value.host);
    } else {
      formData.append("host", user._id);
    }

    // Property status
    formData.append("status", form.value.status);

    // Amenities are sent as JSON string
    formData.append("amenities", JSON.stringify(form.value.amenities || []));

    // Images:
    // - On create: at least one image is required (validated above)
    // - On edit: only send if user selected new images
    if (selectedImages.value && selectedImages.value.length > 0) {
      console.log(`📸 Adding ${selectedImages.value.length} new images`);
      selectedImages.value.forEach((file) => {
        formData.append("images", file);
      });
    } else if (!isEditing.value) {
      console.log("❌ No images selected for new property");
      Swal.fire(
        "Error",
        "Se requiere al menos una imagen para crear una nueva propiedad.",
        "warning"
      );
      return;
    } else {
      console.log("📝 Updating property without new images");
    }

    // Debug logging
    console.log("📦 FormData contents:");
    const formDataEntries: [string, FormDataEntryValue][] = [];
    formData.forEach((value, key) => {
      formDataEntries.push([key, value]);
    });
    formDataEntries.forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });

    let response;

    // Create vs Update logic
    if (isEditing.value && editId.value) {
      console.log("🔄 UPDATING property with ID:", editId.value);
      response = await updateProperty(editId.value, formData);
      await Swal.fire(
        "Éxito",
        "Propiedad actualizada correctamente.",
        "success"
      );
    } else {
      console.log("➕ CREATING new property");
      response = await createProperty(formData);
      await Swal.fire("Éxito", "Propiedad creada correctamente.", "success");
    }

    console.log("✅ Property saved successfully:", response);

    resetForm();
    await loadProperties();
  } catch (error) {
    console.error("❌ Error saving property:", error);

    let errorMessage = "No se pudo guardar la propiedad.";

    // Attempt to extract a backend error message if present
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === "object" && "response" in error) {
      const response = (error as any).response;
      if (response?.data?.message) {
        errorMessage = response.data.message;
      }

      console.error("📋 Server error details:", response?.data);
    }

    Swal.fire({
      title: "Error",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "OK",
    });
  } finally {
    isSubmitting.value = false;
  }
};

/**
 * Edit existing property:
 * - Maps backend "Property" into frontend "PropertyForm"
 * - Sets editId
 * - Loads existing images into previews
 */
const editProperty = (property: Property): void => {
  try {
    console.log("🔄 Editing property:", property.title);
    console.log("📝 Property data:", property);

    // Precio seguro -> siempre String, sin usar .toString() directamente
    const safePrice =
      typeof property.pricePerNight === "number" &&
      !Number.isNaN(property.pricePerNight)
        ? String(property.pricePerNight)
        : "";

    // Huéspedes seguros
    const safeGuests =
      typeof property.guests === "number" && !Number.isNaN(property.guests)
        ? String(property.guests)
        : "1";

    // Host id seguro (puede venir como string, objeto o incluso undefined)
    const hostId =
      typeof property.host === "string"
        ? property.host
        : property.host?._id ?? "";

    form.value = {
      title: property.title ?? "",
      description: property.description ?? "",
      address: property.address ?? "",
      city: property.city ?? "",
      pricePerNight: safePrice,
      maxGuests: safeGuests,
      host: hostId,
      status: property.status,
      amenities: property.amenities ?? [],
    };

    editId.value = property._id ?? null;
    console.log("🆔 Edit ID set:", editId.value);

    // Imágenes existentes -> solo URLs, sin tocar File[]
    imagePreviews.value = Array.isArray(property.imageUrls)
      ? property.imageUrls
      : [];

    // Al entrar en edición, aún no hay nuevas imágenes seleccionadas
    selectedImages.value = [];
    formErrors.value = {};

    console.log("📋 Form updated:", form.value);

    // Scroll al formulario
    document.querySelector("form")?.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("❌ Error in editProperty:", error, property);
    Swal.fire(
      "Error",
      "No se pudieron cargar los datos de la propiedad para edición.",
      "error"
    );
  }
};


/**
 * Delete handler with confirmation dialog.
 */
const handleDeleteProperty = async (propertyId: string): Promise<void> => {
  const result = await Swal.fire({
    title: "¿Eliminar Propiedad?",
    text: "Esta acción no se puede deshacer. La propiedad será eliminada permanentemente.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      await deleteProperty(propertyId);
      await Swal.fire(
        "Eliminada",
        "Propiedad eliminada correctamente.",
        "success"
      );
      await loadProperties();
    } catch (error) {
      console.error("Error deleting property:", error);
      Swal.fire("Error", "No se pudo eliminar la propiedad.", "error");
    }
  }
};

// ===== IMAGE MANAGEMENT =====

/**
 * Handle file input change, validate and generate preview URLs.
 */
const handleImageUpload = (event: Event): void => {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  const fileArray = Array.from(files);

  // Max 10 images
  if (fileArray.length > 10) {
    Swal.fire({
      icon: "warning",
      title: "Demasiadas Imágenes",
      text: "Puede subir un máximo de 10 imágenes por propiedad.",
      confirmButtonText: "OK",
    });
    return;
  }

  // Max 5MB per image
  const oversizedFiles = fileArray.filter(
    (file) => file.size > 5 * 1024 * 1024
  );
  if (oversizedFiles.length > 0) {
    Swal.fire({
      icon: "warning",
      title: "Archivos Muy Grandes",
      text: "Algunas imágenes exceden 5MB. Seleccione imágenes más pequeñas.",
      confirmButtonText: "OK",
    });
    return;
  }

  selectedImages.value = fileArray;
  imagePreviews.value = [];

  // Generate previews with FileReader
  fileArray.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        imagePreviews.value.push(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  });

  // Clear previous image error if any
  if (formErrors.value.images) {
    delete formErrors.value.images;
  }
};

/**
 * Remove a single image by index from previews + selected files.
 */
const removeImagePreview = (index: number): void => {
  imagePreviews.value.splice(index, 1);
  selectedImages.value.splice(index, 1);

  console.log("🗑️ Image removed from index:", index);
};

/**
 * Move image to first position (makes it the main photo).
 */
const moveToFirst = (index: number): void => {
  if (index === 0) return;

  const preview = imagePreviews.value.splice(index, 1)[0];
  imagePreviews.value.unshift(preview);

  const file = selectedImages.value.splice(index, 1)[0];
  selectedImages.value.unshift(file);

  console.log("⭐ Image moved to main position");
};

/**
 * Move image one step to the left.
 */
const moveLeft = (index: number): void => {
  if (index === 0) return;

  const temp = imagePreviews.value[index];
  imagePreviews.value[index] = imagePreviews.value[index - 1];
  imagePreviews.value[index - 1] = temp;

  const tempFile = selectedImages.value[index];
  selectedImages.value[index] = selectedImages.value[index - 1];
  selectedImages.value[index - 1] = tempFile;

  console.log("⬅️ Image moved left");
};

/**
 * Move image one step to the right.
 */
const moveRight = (index: number): void => {
  if (index === imagePreviews.value.length - 1) return;

  const temp = imagePreviews.value[index];
  imagePreviews.value[index] = imagePreviews.value[index + 1];
  imagePreviews.value[index + 1] = temp;

  const tempFile = selectedImages.value[index];
  selectedImages.value[index] = selectedImages.value[index + 1];
  selectedImages.value[index + 1] = tempFile;

  console.log("➡️ Image moved right");
};

/**
 * Drag over handler (in case drag & drop reordering is added later).
 */
const handleDragOver = (event: DragEvent): void => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
};

// ===== UTILITY FUNCTIONS =====

/**
 * Map backend status enum to localized Spanish label.
 */
const getStatusLabel = (status: PropertyStatus): string => {
  const labels: Record<PropertyStatus, string> = {
    available: "Disponible",
    booked: "Reservado",
    confirmed: "Confirmado",
    cancelled: "Cancelado",
    inactive: "Inactivo",
  };

  return labels[status] ?? status;
};

const getStatusBadge = (status: PropertyStatus): string => {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const colors: Record<PropertyStatus, string> = {
    available:
      "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200",
    booked:
      "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
    confirmed:
      "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200",
    cancelled:
      "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200",
    inactive:
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  };

  return `${base} ${colors[status] ?? colors.available}`;
};

/**
 * Given an amenity ID, return its label (fallbacks to ID if unknown).
 */
const getAmenityLabel = (amenityId: string): string => {
  const amenity = availableAmenities.value.find((a) => a.id === amenityId);
  return amenity?.label || amenityId;
};

// ===== EXPORT FUNCTIONS =====

/**
 * Export current filtered properties to CSV.
 */
const exportCSV = (): void => {
  const headers = [
    "Título",
    "Ciudad",
    "Dirección",
    "Precio",
    "Capacidad",
    "Estado",
    "Anfitrión",
  ];
  const csvContent = [
    headers.join(","),
    ...filteredProperties.value.map((property) =>
      [
        `"${property.title}"`,
        `"${property.city}"`,
        `"${property.address}"`,
        property.pricePerNight,
        property.guests,
        `"${getStatusLabel(property.status)}"`,
        typeof property.host === "object"
          ? `"${property.host.firstName} ${property.host.lastName}"`
          : `"${property.host}"`,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `propiedades_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export current filtered properties to a printable HTML page (PDF via browser).
 */
const exportPDF = (): void => {
  const htmlContent = `
    <html>
      <head>
        <title>Lista de Propiedades</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f8f9fa; font-weight: 600; }
          .badge { padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 500; }
          .available { background-color: #d1fae5; color: #065f46; }
          .active { background-color: #d1fae5; color: #065f46; }
          .inactive { background-color: #fee2e2; color: #991b1b; }
          .maintenance { background-color: #fef3c7; color: #92400e; }
          tr:nth-child(even) { background-color: #f9fafb; }
        </style>
      </head>
      <body>
        <h1>Lista de Propiedades</h1>
        <p style="text-align: center; color: #6b7280; margin-bottom: 20px;">
          Generado el ${new Date().toLocaleDateString()} - Total: ${
    filteredProperties.value.length
  } propiedades
        </p>
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Ciudad</th>
              <th>Dirección</th>
              <th>Precio/Noche</th>
              <th>Capacidad</th>
              <th>Estado</th>
              <th>Anfitrión</th>
            </tr>
          </thead>
          <tbody>
            ${filteredProperties.value
              .map(
                (property) => `
              <tr>
                <td>${property.title}</td>
                <td>${property.city}</td>
                <td>${property.address}</td>
                <td>$${property.pricePerNight}</td>
                <td>${property.guests} huéspedes</td>
                <td><span class="badge ${property.status.toLowerCase()}">${getStatusLabel(
                  property.status
                )}</span></td>
                <td>${
                  typeof property.host === "object"
                    ? `${property.host.firstName} ${property.host.lastName}`
                    : property.host
                }</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
};
</script>

<style scoped>
.cursor-move:hover {
  cursor: move;
}

.cursor-move:active {
  cursor: grabbing;
}

/* Smooth transitions for drag & drop */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Drag feedback styles */
[draggable="true"]:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

[draggable="true"]:active {
  transform: scale(0.98);
}
</style>
