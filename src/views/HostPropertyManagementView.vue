<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6">
    <!-- Page Header -->
    <header class="mb-8">
      <div class="flex items-center space-x-4 mb-2">
        <button
          @click="goBack"
          class="inline-flex items-center p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Go back to host dashboard"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Mis Propiedades
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Administra tus propiedades y su disponibilidad
          </p>
        </div>
      </div>
    </header>

    <!-- Filters -->
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

        <!-- Status Filter -->
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
            <option value="available">Disponible</option>
            <option value="booked">Reservado</option>
            <option value="confirmed">Confirmado</option>
            <option value="cancelled">Cancelado</option>
            <option value="inactive">Inactivo</option>
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

    <!-- Property Form -->
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
          <EditIcon
            v-else
            class="w-5 h-5 text-blue-600 dark:text-blue-400"
          />
        </div>
        {{ editId ? "Editar Mi Propiedad" : "Crear Nueva Propiedad" }}
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
            <!-- Title -->
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

            <!-- Description -->
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

            <!-- Price -->
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

            <!-- Guests -->
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

            <!-- Status -->
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
                <option value="available">Disponible</option>
                <option value="booked">Reservado</option>
                <option value="confirmed">Confirmado</option>
                <option value="cancelled">Cancelado</option>
                <option value="inactive">Inactivo</option>
              </select>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Solo las propiedades "Disponibles" serán visibles para los
                usuarios
              </p>
            </div>
          </div>
        </div>

        <!-- Amenities -->
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

        <!-- Images -->
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

          <!-- Image Error -->
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
                <!-- Main badge -->
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

                <!-- Controls -->
                <div
                  class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <div class="flex space-x-1">
                    <!-- Main -->
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

                    <!-- Left -->
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

                    <!-- Right -->
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

                    <!-- Remove -->
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

                <!-- Drag indicator (visual only) -->
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
            {{ isSubmitting ? "Guardando..." : editId ? "Actualizar" : "Crear" }}
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
            Mis Propiedades
          </h2>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ filteredProperties.length }} propiedad{{
              filteredProperties.length !== 1 ? "es" : ""
            }}
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="p-12 text-center">
        <LoaderIcon class="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
        <p class="text-gray-600 dark:text-gray-300">
          Cargando propiedades...
        </p>
      </div>

      <!-- Empty -->
      <div
        v-else-if="filteredProperties.length === 0"
        class="p-12 text-center"
      >
        <div
          class="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4"
        >
          <HomeIcon class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No tienes propiedades registradas
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          {{
            hasActiveFilters
              ? "No hay propiedades que coincidan con los filtros actuales."
              : "Comienza registrando tu primera propiedad."
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
              <!-- Main info -->
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

              <!-- Price & guests -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  ${{ property.pricePerNight?.toLocaleString() }}/noche
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  <UsersIcon class="w-4 h-4 inline mr-1" />
                  {{ property.guests }} huéspedes máx.
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadge(property.status)">
                  {{ getStatusLabel(property.status) }}
                </span>
              </td>

              <!-- Amenities -->
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
                    v-if="
                      property.amenities && property.amenities.length > 3
                    "
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    +{{ property.amenities.length - 3 }}
                  </span>
                </div>
              </td>

              <!-- Actions -->
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

      <!-- Tablet List -->
      <div
        class="hidden md:block lg:hidden divide-y divide-gray-200 dark:divide-gray-700"
      >
        <div
          v-for="property in filteredProperties"
          :key="property._id"
          class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
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
              <span
                class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >Precio:</span
              >
              <p class="text-sm text-gray-900 dark:text-white">
                ${{ property.pricePerNight }}/noche
              </p>
            </div>
            <div>
              <span
                class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >Capacidad:</span
              >
              <p class="text-sm text-gray-900 dark:text-white">
                {{ property.guests }} huéspedes
              </p>
            </div>
            <div>
              <span
                class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >Estado:</span
              >
              <span :class="getStatusBadge(property.status)" class="mt-1">
                {{ getStatusLabel(property.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="property in filteredProperties"
          :key="property._id"
          class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
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
              <span
                class="text-xs font-medium text-gray-500 dark:text-gray-400"
                >Precio:</span
              >
              <span class="text-xs text-gray-900 dark:text-white">
                ${{ property.pricePerNight }}/noche
              </span>
            </div>
            <div class="flex justify-between">
              <span
                class="text-xs font-medium text-gray-500 dark:text-gray-400"
                >Capacidad:</span
              >
              <span class="text-xs text-gray-900 dark:text-white">
                {{ property.guests }} huéspedes
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span
                class="text-xs font-medium text-gray-500 dark:text-gray-400"
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
 * HostPropertyManagementView.vue
 * Host-only property management screen with filters, CRUD and export.
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

import {
  ArrowLeft as ArrowLeftIcon,
  Plus as PlusIcon,
  X as XIcon,
  Edit as EditIcon,
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

/** Amenity configuration used in the form and list */
interface Amenity {
  id: string;
  label: string;
  icon: any;
}

/** Reactive form model for creating/updating a property */
interface PropertyForm {
  title: string;
  description: string;
  address: string;
  city: string;
  pricePerNight: string;
  maxGuests: string;
  status: PropertyStatus;
  amenities: string[];
}

const router = useRouter();

/** Navigate back to host dashboard */
const goBack = (): void => {
  router.push("/host/dashboard");
};

/** UI state */
const editId = ref<string | null>(null);
const isLoading = ref(false);
const isSubmitting = ref(false);

/** Filter state */
const statusFilter = ref<PropertyStatus | "">("");
const cityFilter = ref<string>("");
const priceRange = ref<{ min: number | null; max: number | null }>({
  min: null,
  max: null,
});

/** Properties loaded from API */
const allProperties = ref<Property[]>([]);

/** Image upload state */
const selectedImages = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);

/** Form validation errors */
const formErrors = ref<Record<string, string | boolean>>({});

/** Current logged user (host) */
const user = JSON.parse(localStorage.getItem("user") || "{}");

/** Main form model */
const form = ref<PropertyForm>({
  title: "",
  description: "",
  address: "",
  city: "",
  pricePerNight: "",
  maxGuests: "",
  status: "available",
  amenities: [],
});

/** Static amenity list displayed as checkboxes */
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

/** True when editing an existing property */
const isEditing = computed(() => !!editId.value);

/**
 * Host properties (host-only view)
 * ---------------------------------------------------------
 * For this HostPropertyManagementView the backend already
 * returns only the properties that belong to the logged host.
 * So we simply expose allProperties as hostProperties.
 */
const hostProperties = computed<Property[]>(() => {
  return allProperties.value;
});

/**
 * Final list of properties after applying UI filters
 * ---------------------------------------------------------
 * Filters: city, status (case-insensitive), price min/max.
 * All filters operate on top of hostProperties.
 */
const filteredProperties = computed<Property[]>(() => {
  let filtered = hostProperties.value;

  /** City filter (case-insensitive comparison) */
  if (cityFilter.value) {
    filtered = filtered.filter(
      (property) =>
        property.city.toLowerCase() === cityFilter.value.toLowerCase()
    );
  }

  /**
   * Status filter
   * -----------------------------------------------------
   * We normalize both values to lowercase to avoid issues
   * if the backend ever changes the case of the status.
   */
  if (statusFilter.value) {
    filtered = filtered.filter(
      (property) =>
        property.status?.toLowerCase() === statusFilter.value.toLowerCase()
    );
  }

  /** Minimum price filter */
  if (priceRange.value.min !== null && priceRange.value.min > 0) {
    filtered = filtered.filter(
      (property) => property.pricePerNight >= priceRange.value.min!
    );
  }

  /** Maximum price filter */
  if (priceRange.value.max !== null && priceRange.value.max > 0) {
    filtered = filtered.filter(
      (property) => property.pricePerNight <= priceRange.value.max!
    );
  }

  return filtered;
});


/** Unique list of cities for the filter dropdown */
const availableCities = computed<string[]>(() => {
  const cities = hostProperties.value.map((property) => property.city);
  return [...new Set(cities)].sort();
});

/** True when any filter is active */
const hasActiveFilters = computed<boolean>(() => {
  return !!(
    statusFilter.value ||
    cityFilter.value ||
    priceRange.value.min ||
    priceRange.value.max
  );
});

/** Load properties on mount */
onMounted(async () => {
  await loadProperties();
});

/** Fetch all properties for this user (admin or host) */
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

/** Reset all filters */
const clearAllFilters = (): void => {
  statusFilter.value = "";
  cityFilter.value = "";
  priceRange.value = { min: null, max: null };
};

/** Reset the form and image state */
const resetForm = (): void => {
  form.value = {
    title: "",
    description: "",
    address: "",
    city: "",
    pricePerNight: "",
    maxGuests: "",
    status: "available",
    amenities: [],
  };
  selectedImages.value = [];
  imagePreviews.value = [];
  editId.value = null;
  formErrors.value = {};
};

/** Validate all form fields before submit */
const validateForm = (): boolean => {
  const errors: Record<string, string | boolean> = {};
  let isValid = true;

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

  const price = parseFloat(form.value.pricePerNight);
  if (isNaN(price) || price <= 0) {
    errors.pricePerNight = "El precio debe ser mayor que cero";
    isValid = false;
  }

  const guests = parseInt(form.value.maxGuests);
  if (isNaN(guests) || guests <= 0 || guests > 20) {
    errors.maxGuests = "El número de huéspedes debe estar entre 1 y 20";
    isValid = false;
  }

  if (!isEditing.value) {
    if (!selectedImages.value || selectedImages.value.length === 0) {
      errors.images =
        "Se requiere al menos una imagen para crear una nueva propiedad";
      isValid = false;
    }
  } else {
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
  return isValid;
};

/** Create or update a property using the form data */
const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
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
    formData.append("title", form.value.title.trim());
    formData.append("description", form.value.description.trim());
    formData.append("address", form.value.address.trim());
    formData.append("city", form.value.city.trim());
    formData.append("pricePerNight", form.value.pricePerNight.toString());
    formData.append("guests", form.value.maxGuests.toString());
    formData.append("status", form.value.status);
    formData.append(
      "amenities",
      JSON.stringify(form.value.amenities || [])
    );

    if (selectedImages.value && selectedImages.value.length > 0) {
      selectedImages.value.forEach((file) => {
        formData.append("images", file);
      });
    } else if (!isEditing.value) {
      Swal.fire(
        "Error",
        "Se requiere al menos una imagen para crear una nueva propiedad.",
        "warning"
      );
      return;
    }

    let response;

    if (isEditing.value && editId.value) {
      response = await updateProperty(editId.value, formData);
      await Swal.fire(
        "Éxito",
        "Propiedad actualizada correctamente.",
        "success"
      );
    } else {
      response = await createProperty(formData);
      await Swal.fire("Éxito", "Propiedad creada correctamente.", "success");
    }

    console.log("Property saved:", response);
    resetForm();
    await loadProperties();
  } catch (error: any) {
    console.error("Error saving property:", error);

    let errorMessage = "No se pudo guardar la propiedad.";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === "object" && "response" in error) {
      const response = (error as any).response;
      if (response?.data?.message) {
        errorMessage = response.data.message;
      }
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

/** Fill the form with an existing property to edit */
const editProperty = (property: Property): void => {
  form.value = {
    title: property.title,
    description: property.description || "",
    address: property.address,
    city: property.city,
    pricePerNight: property.pricePerNight.toString(),
    maxGuests: property.guests.toString(),
    status: property.status,
    amenities: property.amenities || [],
  };

  editId.value = property._id || null;
  imagePreviews.value = property.imageUrls || [];
  selectedImages.value = [];
  formErrors.value = {};

  document.querySelector("form")?.scrollIntoView({ behavior: "smooth" });
};

/** Ask confirmation and delete a property */
const handleDeleteProperty = async (propertyId: string): Promise<void> => {
  const property = hostProperties.value.find((p) => p._id === propertyId);

  const result = await Swal.fire({
    title: "¿Eliminar Propiedad?",
    html: `¿Estás seguro de que deseas eliminar <strong>"${
      property?.title
    }"</strong>?<br><small class="text-gray-500">Esta acción no se puede deshacer.</small>`,
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

/** Handle image input and generate previews */
const handleImageUpload = (event: Event): void => {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  const fileArray = Array.from(files);

  if (fileArray.length > 10) {
    Swal.fire({
      icon: "warning",
      title: "Demasiadas Imágenes",
      text: "Puede subir un máximo de 10 imágenes por propiedad.",
      confirmButtonText: "OK",
    });
    return;
  }

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

  fileArray.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        imagePreviews.value.push(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  });

  if (formErrors.value.images) {
    delete formErrors.value.images;
  }
};

/** Remove one preview image */
const removeImagePreview = (index: number): void => {
  imagePreviews.value.splice(index, 1);
  selectedImages.value.splice(index, 1);
};

/** Move image to first position (main) */
const moveToFirst = (index: number): void => {
  if (index === 0) return;

  const preview = imagePreviews.value.splice(index, 1)[0];
  imagePreviews.value.unshift(preview);

  const file = selectedImages.value.splice(index, 1)[0];
  selectedImages.value.unshift(file);
};

/** Move image one position to the left */
const moveLeft = (index: number): void => {
  if (index === 0) return;

  const tempPreview = imagePreviews.value[index];
  imagePreviews.value[index] = imagePreviews.value[index - 1];
  imagePreviews.value[index - 1] = tempPreview;

  const tempFile = selectedImages.value[index];
  selectedImages.value[index] = selectedImages.value[index - 1];
  selectedImages.value[index - 1] = tempFile;
};

/** Move image one position to the right */
const moveRight = (index: number): void => {
  if (index === imagePreviews.value.length - 1) return;

  const tempPreview = imagePreviews.value[index];
  imagePreviews.value[index] = imagePreviews.value[index + 1];
  imagePreviews.value[index + 1] = tempPreview;

  const tempFile = selectedImages.value[index];
  selectedImages.value[index] = selectedImages.value[index + 1];
  selectedImages.value[index + 1] = tempFile;
};

/** Map status to Spanish label */
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

/** Map status to Tailwind badge classes */
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

/** Resolve amenity label from its ID */
const getAmenityLabel = (amenityId: string): string => {
  const amenity = availableAmenities.value.find((a) => a.id === amenityId);
  return amenity?.label || amenityId;
};

/** Export current filtered list as CSV */
const exportCSV = (): void => {
  const headers = [
    "Título",
    "Ciudad",
    "Dirección",
    "Precio",
    "Capacidad",
    "Estado",
    "Fecha Creación",
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
        property.createdAt
          ? `"${new Date(property.createdAt).toLocaleDateString()}"`
          : '""',
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `mis_propiedades_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/** Open a printable PDF-like page in a new window */
const exportPDF = (): void => {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const userName = user ? `${user.firstName} ${user.lastName}` : "Host";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Mis Propiedades - ${userName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 40px 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #4f46e5;
            font-size: 28px;
            margin-bottom: 10px;
          }
          .stats {
            display: flex;
            justify-content: space-around;
            margin-bottom: 30px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
          }
          .stat-item { text-align: center; }
          .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #4f46e5;
          }
          .stat-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          th, td {
            border: 1px solid #e5e7eb;
            padding: 12px 8px;
            text-align: left;
            font-size: 11px;
          }
          th {
            background: #f3f4f6;
            font-weight: 600;
            color: #374151;
            text-transform: uppercase;
            font-size: 10px;
          }
          tr:nth-child(even) { background: #f9fafb; }
          .status {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 500;
            text-align: center;
          }
          .available { background: #d1fae5; color: #065f46; }
          .booked { background: #dbeafe; color: #1e40af; }
          .confirmed { background: #e9d5ff; color: #7c3aed; }
          .cancelled { background: #fee2e2; color: #991b1b; }
          .inactive { background: #f3f4f6; color: #374151; }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 11px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          .price { font-weight: 600; color: #059669; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Mis Propiedades</h1>
          <p>Anfitrión: ${userName}</p>
          <p>Generado el ${currentDate}</p>
        </div>

        <div class="stats">
          <div class="stat-item">
            <div class="stat-number">${filteredProperties.value.length}</div>
            <div class="stat-label">Total Propiedades</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${
              filteredProperties.value.filter(
                (p) => p.status === "available"
              ).length
            }</div>
            <div class="stat-label">Disponibles</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${
              filteredProperties.value.filter(
                (p) => p.status === "booked" || p.status === "confirmed"
              ).length
            }</div>
            <div class="stat-label">Reservadas</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">$${filteredProperties.value.length > 0
              ? Math.round(
                  filteredProperties.value.reduce(
                    (sum, p) => sum + p.pricePerNight,
                    0
                  ) / filteredProperties.value.length
                )
              : 0}</div>
            <div class="stat-label">Precio Promedio</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Ciudad</th>
              <th>Dirección</th>
              <th>Precio/Noche</th>
              <th>Capacidad</th>
              <th>Estado</th>
              <th>Fecha Creación</th>
            </tr>
          </thead>
          <tbody>
            ${filteredProperties.value
              .map(
                (property) => `
              <tr>
                <td><strong>${property.title}</strong></td>
                <td>${property.city}</td>
                <td>${property.address}</td>
                <td class="price">$${property.pricePerNight?.toLocaleString()}</td>
                <td>${property.guests} huéspedes</td>
                <td><span class="status ${property.status}">${getStatusLabel(
                  property.status
                )}</span></td>
                <td>${
                  property.createdAt
                    ? new Date(property.createdAt).toLocaleDateString()
                    : "N/A"
                }</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          <p><strong>GuaraníHost - Portal del Anfitrión</strong><br>
          Total de propiedades: ${filteredProperties.value.length}</p>
        </div>
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
    }, 500);
  }
};
</script>

<style scoped>
/* Extra visual feedback for drag-like interactions */
.cursor-move:hover {
  cursor: move;
}

.cursor-move:active {
  cursor: grabbing;
}

/* Generic smooth transition helper */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Optional hover effect for draggable items */
[draggable="true"]:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

[draggable="true"]:active {
  transform: scale(0.98);
}
</style>
