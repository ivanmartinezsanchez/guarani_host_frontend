<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6">
    <!-- Page Header -->
    <header class="mb-8">
      <div class="flex items-center space-x-4 mb-2">
        <button
          @click="goBack"
          class="inline-flex items-center p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Go back to admin dashboard"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <div>          
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Paquetes Turísticos
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Administra los tours y paquetes disponibles
          </p>
        </div>
      </div>
    </header>

    <!-- Enhanced Filters Section -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
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
        <!-- Status Filter -->
        <div class="space-y-2">
          <label for="statusFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Estado del Tour
          </label>
          <select
            id="statusFilter"
            v-model="statusFilter"
            class="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Todos los Estados</option>
            <option value="available">Disponible</option>
            <option value="sold_out">Agotado</option>
            <option value="cancelled">Cancelado</option>
            <option value="upcoming">Próximamente</option>
          </select>
        </div>
        
        <!-- Payment Status Filter -->
        <div class="space-y-2">
          <label for="paymentStatusFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Estado de Pago
          </label>
          <select
            id="paymentStatusFilter"
            v-model="paymentStatusFilter"
            class="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Todos los Pagos</option>
            <option value="pending">Pendiente</option>
            <option value="paid">Pagado</option>
            <option value="failed">Fallido</option>
            <option value="refunded">Reembolsado</option>
          </select>
        </div>
        
        <!-- Price Range Min -->
        <div class="space-y-2">
          <label for="minPrice" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Precio Min.
          </label>
          <div class="relative">
            <DollarSignIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
          <label for="maxPrice" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Precio Máx.
          </label>
          <div class="relative">
            <DollarSignIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
      
      <!-- Search Filter -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div class="space-y-2">
          <label for="searchFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Buscar Tours
          </label>
          <div class="relative">
            <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="searchFilter"
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por título o descripción..."
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
    <!-- Tour Form - Always Visible -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
        <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <PlusIcon
            v-if="!editId"
            class="w-5 h-5 text-blue-600 dark:text-blue-400"
          />
          <EditIcon v-else class="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        {{ editId ? "Editar Paquete Turístico" : "Crear Nuevo Paquete Turístico" }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Basic Information Section -->
        <div class="space-y-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Información Básica
          </h3>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Tour Title -->
            <div class="lg:col-span-2 space-y-2">
              <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Título del Paquete Turístico <span class="text-red-500">*</span>
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
                placeholder="ej., Aventura en las Cataratas del Iguazú - 3 días"
              />
              <p
                v-if="formErrors.title"
                class="text-sm text-red-600 dark:text-red-400"
              >
                El título del paquete turístico es obligatorio
              </p>
            </div>

            <!-- Tour Description -->
            <div class="lg:col-span-2 space-y-2">
              <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                placeholder="Describe el paquete turístico, actividades incluidas, destinos, duración y aspectos destacados del tour..."
              ></textarea>
              <div class="flex justify-between items-center">
                <p
                  v-if="formErrors.description"
                  class="text-sm text-red-600 dark:text-red-400"
                >
                  La descripción debe tener al menos 100 caracteres
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ form.description?.length || 0 }}/100 caracteres mínimo
                </p>
              </div>
            </div>

            <!-- Price -->
            <div class="space-y-2">
              <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Precio del Tour (USD) <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <DollarSignIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="price"
                  v-model="form.price"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  :class="[
                    'w-full h-12 pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                    formErrors.price
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600',
                  ]"
                  placeholder="0.00"
                />
              </div>
              <p
                v-if="formErrors.price"
                class="text-sm text-red-600 dark:text-red-400"
              >
                El precio debe ser mayor que cero
              </p>
            </div>

            <!-- Tour Status -->
            <div class="space-y-2">
              <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Estado del Tour
              </label>
              <select
                id="status"
                v-model="form.status"
                class="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="available">Disponible</option>
                <option value="sold_out">Agotado</option>
                <option value="cancelled">Cancelado</option>
                <option value="upcoming">Próximamente</option>
              </select>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Solo los tours "Disponibles" serán visibles para los usuarios
              </p>
            </div>

            <!-- Payment Status -->
            <div class="space-y-2">
              <label for="paymentStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Estado de Pago
              </label>
              <select
                id="paymentStatus"
                v-model="form.paymentStatus"
                class="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="pending">Pendiente</option>
                <option value="paid">Pagado</option>
                <option value="failed">Fallido</option>
                <option value="refunded">Reembolsado</option>
              </select>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Estado actual del pago del paquete turístico
              </p>
            </div>

            <!-- Payment Details -->
            <div class="space-y-2">
              <label for="paymentDetails" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Detalles de Pago
              </label>
              <input
                id="paymentDetails"
                v-model="form.paymentDetails"
                type="text"
                class="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="ej., Transferencia bancaria, Tarjeta de crédito, etc."
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Información adicional sobre el método de pago (opcional)
              </p>
            </div>
          </div>
        </div>

        <!-- Image Upload Section -->
        <div class="space-y-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Imágenes del Tour <span class="text-red-500">*</span>
          </h3>

          <!-- Upload Area -->
          <div
            :class="[
              'border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors',
              formErrors.images 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/10' 
                : 'border-gray-300 dark:border-gray-600'
            ]"
          >
            <MapIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div class="space-y-2">
              <label for="images" class="cursor-pointer">
                <span class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div 
                v-for="(preview, index) in imagePreviews" 
                :key="`preview-${index}`"
                class="relative group border-2 rounded-lg overflow-hidden transition-all"
                :class="index === 0 ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' : 'border-gray-200 dark:border-gray-600'"
              >
                <!-- Main photo badge -->
                <div v-if="index === 0" class="absolute top-2 left-2 z-10">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white shadow-md">
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
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
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
                <div class="absolute bottom-1 right-1 p-1 bg-gray-700 bg-opacity-75 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoveIcon class="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
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
            {{ isSubmitting ? "Guardando..." : editId ? "Actualizar" : "Crear" }}
          </button>
        </div>
      </form>
    </div>
    <!-- Tours List -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
            <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <MapIcon class="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            Lista de Paquetes Turísticos
          </h2>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ filteredTours.length }} tour{{
              filteredTours.length !== 1 ? "s" : ""
            }}
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="p-12 text-center">
        <LoaderIcon class="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
        <p class="text-gray-600 dark:text-gray-300">Cargando paquetes turísticos...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredTours.length === 0" class="p-12 text-center">
        <div class="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <MapIcon class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No se encontraron paquetes turísticos
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          {{
            hasActiveFilters
              ? "No hay tours que coincidan con los filtros actuales."
              : "Comience creando su primer paquete turístico."
          }}
        </p>
      </div>

      <!-- Desktop Table -->
      <div v-else class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Paquete Turístico
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Precio
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Estado del Tour
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Estado de Pago
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Host
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="tour in filteredTours"
              :key="tour._id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <!-- Tour info with image -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <img
                      v-if="tour.imageUrls && tour.imageUrls[0]"
                      :src="tour.imageUrls[0]"
                      :alt="`Imagen principal de ${tour.title}`"
                      class="h-12 w-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                    />
                    <div
                      v-else
                      class="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-600 flex items-center justify-center border border-gray-200 dark:border-gray-600"
                    >
                      <MapIcon class="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ tour.title }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {{ tour.description?.substring(0, 60) }}...
                    </p>
                  </div>
                </div>
              </td>

              <!-- Price info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  ${{ tour.price?.toLocaleString() }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  por persona
                </div>
              </td>

              <!-- Tour Status badge -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getTourStatusBadge(tour.status)">
                  {{ getTourStatusLabel(tour.status) }}
                </span>
              </td>

              <!-- Payment Status badge -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getPaymentStatusBadge(tour.paymentStatus || 'pending')">
                  {{ getPaymentStatusLabel(tour.paymentStatus || 'pending') }}
                </span>
              </td>

              <!-- Host information -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{
                    typeof tour.host === "object"
                      ? `${tour.host.firstName} ${tour.host.lastName}`
                      : "ID: " + tour.host
                  }}
                </div>
                <div
                  v-if="typeof tour.host === 'object' && tour.host.email"
                  class="text-sm text-gray-500 dark:text-gray-400"
                >
                  {{ tour.host.email }}
                </div>
              </td>

              <!-- Action buttons -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="editTour(tour)"
                    class="inline-flex items-center p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :aria-label="`Editar tour ${tour.title}`"
                  >
                    <EditIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="handleDeleteTour(tour._id!)"
                    class="inline-flex items-center p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    :aria-label="`Eliminar tour ${tour.title}`"
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
          v-for="tour in filteredTours"
          :key="tour._id"
          class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-4">
              <img
                v-if="tour.imageUrls && tour.imageUrls[0]"
                :src="tour.imageUrls[0]"
                :alt="`Imagen principal de ${tour.title}`"
                class="h-12 w-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
              />
              <div
                v-else
                class="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-600 flex items-center justify-center border border-gray-200 dark:border-gray-600"
              >
                <MapIcon class="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ tour.title }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ tour.description?.substring(0, 80) }}...
                </p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                @click="editTour(tour)"
                class="inline-flex items-center p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                :aria-label="`Editar tour ${tour.title}`"
              >
                <EditIcon class="w-5 h-5" />
              </button>
              <button
                @click="handleDeleteTour(tour._id!)"
                class="inline-flex items-center p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                :aria-label="`Eliminar tour ${tour.title}`"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Precio:</span>
              <p class="text-sm text-gray-900 dark:text-white">
                ${{ tour.price }}/persona
              </p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Estado:</span>
              <span :class="getTourStatusBadge(tour.status)" class="mt-1">
                {{ getTourStatusLabel(tour.status) }}
              </span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Pago:</span>
              <span :class="getPaymentStatusBadge(tour.paymentStatus || 'pending')" class="mt-1">
                {{ getPaymentStatusLabel(tour.paymentStatus || 'pending') }}
              </span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Host:</span>
              <p class="text-sm text-gray-900 dark:text-white truncate">
                {{
                  typeof tour.host === "object"
                    ? `${tour.host.firstName} ${tour.host.lastName}`
                    : tour.host
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- Mobile Cards -->
      <div class="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="tour in filteredTours"
          :key="tour._id"
          class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-3">
              <img
                v-if="tour.imageUrls && tour.imageUrls[0]"
                :src="tour.imageUrls[0]"
                :alt="`Imagen principal de ${tour.title}`"
                class="h-10 w-10 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
              />
              <div
                v-else
                class="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-600 flex items-center justify-center border border-gray-200 dark:border-gray-600"
              >
                <MapIcon class="w-5 h-5 text-gray-400" />
              </div>
              <div class="flex-1">
                <h3 class="font-medium text-gray-900 dark:text-white text-sm">
                  {{ tour.title }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {{ tour.description?.substring(0, 60) }}...
                </p>
              </div>
            </div>
            <div class="flex space-x-1">
              <button
                @click="editTour(tour)"
                class="inline-flex items-center p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                :aria-label="`Editar tour ${tour.title}`"
              >
                <EditIcon class="w-4 h-4" />
              </button>
              <button
                @click="handleDeleteTour(tour._id!)"
                class="inline-flex items-center p-1.5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                :aria-label="`Eliminar tour ${tour.title}`"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Precio:</span>
              <span class="text-xs text-gray-900 dark:text-white">
                ${{ tour.price }}/persona
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Estado:</span>
              <span :class="getTourStatusBadge(tour.status)">
                {{ getTourStatusLabel(tour.status) }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Pago:</span>
              <span :class="getPaymentStatusBadge(tour.paymentStatus || 'pending')">
                {{ getPaymentStatusLabel(tour.paymentStatus || 'pending') }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Host:</span>
              <span class="text-xs text-gray-900 dark:text-white truncate max-w-32">
                {{
                  typeof tour.host === "object"
                    ? `${tour.host.firstName} ${tour.host.lastName}`
                    : tour.host
                }}
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
 * TourManagementView.vue
 * -----------------------
 * Tour package management interface for admins with comprehensive CRUD operations
 *
 * Features:
 * - Responsive design with mobile-first approach
 * - Native HTML inputs with Tailwind styling
 * - Image upload with previews and reordering
 * - Advanced filtering capabilities (status, payment, price, search)
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Dark mode support
 * - Clean, minimal code structure
 * - Export functionality (CSV and PDF)
 * - Tour status and payment status management
 */

import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import {
  getTours,
  createTour,
  updateTour,
  deleteTour,
  type Tour,
} from "@/services/tourService";
import { tourToFormData } from "@/utils/formDataHelpers";

// Import icons from Lucide Vue Next
import {
  ArrowLeft as ArrowLeftIcon,
  Plus as PlusIcon,
  X as XIcon,
  Edit as EditIcon,
  Map as MapIcon,
  Upload as UploadIcon,
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
  Search as SearchIcon,
} from "lucide-vue-next";

// ===== TYPES AND INTERFACES =====

/**
 * Tour status type definition
 */
type TourStatus = 'available' | 'sold_out' | 'cancelled' | 'upcoming';

/**
 * Payment status type definition
 */
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

/**
 * Form data structure for tour management
 */
interface TourForm {
  title: string;
  description: string;
  price: string;
  status: TourStatus;
  paymentStatus: PaymentStatus;
  paymentDetails: string;
}

// ===== ROUTER AND NAVIGATION =====

const router = useRouter();

/**
 * Navigate back to admin dashboard
 */
const goBack = (): void => {
  router.push("/admin/dashboard");
};

// ===== REACTIVE STATE =====

/** UI state management */
const editId = ref<string | null>(null);
const isLoading = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);

/** Search and filter state */
const searchQuery = ref<string>("");
const statusFilter = ref<string>("");
const paymentStatusFilter = ref<string>("");
const priceRange = ref<{
  min: number | null;
  max: number | null;
}>({
  min: null,
  max: null,
});

/** Tours data */
const allTours = ref<Tour[]>([]);

/** Image handling state */
const selectedImages = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);

/** Form validation errors */
const formErrors = ref<Record<string, string | boolean>>({});

/** 
 * Tour form data structure
 */
const form = ref<TourForm>({
  title: "",
  description: "",
  price: "",
  status: "available" as TourStatus,
  paymentStatus: "pending" as PaymentStatus,
  paymentDetails: "",
});

// ===== COMPUTED PROPERTIES =====

/**
 * Check if form is in editing mode
 */
const isEditing = computed(() => !!editId.value);

/**
 * Apply advanced filtering to tours
 * Supports search, status, payment status, and price range filters
 */
const filteredTours = computed<Tour[]>(() => {
  let filtered = allTours.value;

  // Search filter - searches title and description
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(
      (tour) =>
        tour.title.toLowerCase().includes(query) ||
        tour.description.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(
      (tour) => tour.status === statusFilter.value
    );
  }

  // Payment status filter
  if (paymentStatusFilter.value) {
    filtered = filtered.filter(
      (tour) => (tour.paymentStatus || 'pending') === paymentStatusFilter.value
    );
  }

  // Price range filter
  if (priceRange.value.min !== null && priceRange.value.min > 0) {
    filtered = filtered.filter(
      (tour) => tour.price >= priceRange.value.min!
    );
  }
  if (priceRange.value.max !== null && priceRange.value.max > 0) {
    filtered = filtered.filter(
      (tour) => tour.price <= priceRange.value.max!
    );
  }

  return filtered;
});

/**
 * Check if any filters are currently active
 */
const hasActiveFilters = computed<boolean>(() => {
  return !!(
    searchQuery.value.trim() ||
    statusFilter.value ||
    paymentStatusFilter.value ||
    priceRange.value.min ||
    priceRange.value.max
  );
});

// ===== LIFECYCLE HOOKS =====

/**
 * Initialize component on mount
 */
onMounted(async (): Promise<void> => {
  await loadTours();
});

// ===== DATA LOADING =====

/**
 * Load all tours from the backend
 * Handles errors gracefully with user feedback
 */
const loadTours = async (): Promise<void> => {
  try {
    isLoading.value = true;
    allTours.value = await getTours();
  } catch (error) {
    console.error("Error loading tours:", error);
    await Swal.fire({
      icon: "error",
      title: "Error de Carga",
      text: "No se pudieron cargar los paquetes turísticos. Intente nuevamente.",
      confirmButtonText: "OK",
    });
  } finally {
    isLoading.value = false;
  }
};

// ===== FILTER MANAGEMENT =====

/**
 * Clear all active filters and reset to default state
 */
const clearAllFilters = (): void => {
  searchQuery.value = "";
  statusFilter.value = "";
  paymentStatusFilter.value = "";
  priceRange.value = {
    min: null,
    max: null,
  };
};
// ===== FORM MANAGEMENT =====

/**
 * Reset form to initial state
 */
const resetForm = (): void => {
  form.value = {
    title: "",
    description: "",
    price: "",
    status: "available" as TourStatus,
    paymentStatus: "pending" as PaymentStatus,
    paymentDetails: "",
  };
  selectedImages.value = [];
  imagePreviews.value = [];
  editId.value = null;
  formErrors.value = {};
};

/**
 * Validate form fields before submission
 */
const validateForm = (): boolean => {
  const errors: Record<string, string | boolean> = {};
  let isValid = true;

  // Validate required text fields
  if (!form.value.title?.trim()) {
    errors.title = "El título es obligatorio";
    isValid = false;
  }

  if (!form.value.description?.trim()) {
    errors.description = "La descripción es obligatoria";
    isValid = false;
  } else if (form.value.description.trim().length < 100) {
    errors.description = "La descripción debe tener al menos 100 caracteres";
    isValid = false;
  }

  // Validate price
  const price = parseFloat(form.value.price);
  if (isNaN(price) || price <= 0) {
    errors.price = "El precio debe ser mayor que cero";
    isValid = false;
  }

  // Image validation
  if (!isEditing.value) {
    if (!selectedImages.value || selectedImages.value.length === 0) {
      errors.images = "Se requiere al menos una imagen para crear un nuevo tour";
      isValid = false;
    }
  } else {
    if (selectedImages.value && selectedImages.value.length > 10) {
      errors.images = "Máximo 10 imágenes permitidas";
      isValid = false;
    }
    
    const hasExistingImages = imagePreviews.value && imagePreviews.value.length > 0;
    const hasNewImages = selectedImages.value && selectedImages.value.length > 0;
    
    if (!hasExistingImages && !hasNewImages) {
      errors.images = "El tour debe tener al menos una imagen";
      isValid = false;
    }
  }

  formErrors.value = errors;
  
  console.log('🔍 Form validation:', isValid ? 'PASSED' : 'FAILED', errors);
  
  return isValid;
};

/**
 * Handle form submission (create or update)
 */
const handleSubmit = async (): Promise<void> => {
  console.log('🚀 Starting form submission...');
  console.log('🔍 Edit mode:', isEditing.value, 'Edit ID:', editId.value);
  
  if (!validateForm()) {
    console.log('❌ Validation failed');
    Swal.fire(
      "Error",
      "Por favor, complete todos los campos requeridos correctamente.",
      "warning"
    );
    return;
  }

  try {
    isSubmitting.value = true;
    
    // Prepare tour data for FormData conversion
    const tourData = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      price: parseFloat(form.value.price),
      status: form.value.status,
      paymentStatus: form.value.paymentStatus,
      paymentDetails: form.value.paymentDetails.trim(),
    };
    
    // Convert to FormData using helper function
    const formData = tourToFormData(tourData, selectedImages.value);

    let response;
    
    if (isEditing.value && editId.value) {
      console.log('🔄 UPDATING tour with ID:', editId.value);
      response = await updateTour(editId.value, formData);
      await Swal.fire(
        "Éxito",
        "Paquete turístico actualizado correctamente.",
        "success"
      );
    } else {
      console.log('➕ CREATING new tour');
      response = await createTour(formData);
      await Swal.fire("Éxito", "Paquete turístico creado correctamente.", "success");
    }

    console.log('✅ Tour saved successfully:', response);
    
    resetForm();
    await loadTours();
    
  } catch (error) {
    console.error("❌ Error saving tour:", error);

    let errorMessage = "No se pudo guardar el paquete turístico.";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as any).response;
      if (response?.data?.message) {
        errorMessage = response.data.message;
      }
      console.error('📋 Server error details:', response?.data);
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
 * Edit existing tour
 */
const editTour = (tour: Tour): void => {
  console.log('🔄 Editing tour:', tour.title);

  form.value = {
    title: tour.title,
    description: tour.description || "",
    price: tour.price.toString(),
    status: tour.status,
    paymentStatus: tour.paymentStatus || "pending",
    paymentDetails: tour.paymentDetails || "",
  };
  
  editId.value = tour._id || null;
  imagePreviews.value = tour.imageUrls || [];
  selectedImages.value = [];
  formErrors.value = {};

  // Smooth scroll to form
  document.querySelector("form")?.scrollIntoView({ behavior: "smooth" });
};

/**
 * Confirm and delete tour
 */
const handleDeleteTour = async (tourId: string): Promise<void> => {
  const tour = allTours.value.find(t => t._id === tourId);
  
  const result = await Swal.fire({
    title: "¿Eliminar Paquete Turístico?",
    html: `¿Estás seguro de que deseas eliminar <strong>"${tour?.title}"</strong>?<br><small class="text-gray-500">Esta acción no se puede deshacer. El tour será eliminado permanentemente.</small>`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      await deleteTour(tourId);
      await Swal.fire(
        "Eliminado",
        "Paquete turístico eliminado correctamente.",
        "success"
      );
      await loadTours();
    } catch (error) {
      console.error("Error deleting tour:", error);
      Swal.fire("Error", "No se pudo eliminar el paquete turístico.", "error");
    }
  }
};

// ===== IMAGE MANAGEMENT =====

/**
 * Handle image file selection and generate previews
 */
const handleImageUpload = (event: Event): void => {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  const fileArray = Array.from(files);

  // Validate file count (max 10 images)
  if (fileArray.length > 10) {
    Swal.fire({
      icon: "warning",
      title: "Demasiadas Imágenes",
      text: "Puede subir un máximo de 10 imágenes por tour.",
      confirmButtonText: "OK",
    });
    return;
  }

  // Validate file sizes (max 5MB per image)
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

  // Generate preview URLs
  fileArray.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        imagePreviews.value.push(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  });
  
  // Clear image validation error if files are selected
  if (formErrors.value.images) {
    delete formErrors.value.images;
  }
};

/**
 * Remove image from preview list
 */
const removeImagePreview = (index: number): void => {
  imagePreviews.value.splice(index, 1);
  selectedImages.value.splice(index, 1);
  
  console.log('🗑️ Image removed from index:', index);
};

/**
 * Move image to first position (make it main image)
 */
const moveToFirst = (index: number): void => {
  if (index === 0) return;
  
  // Move preview URL
  const preview = imagePreviews.value.splice(index, 1)[0];
  imagePreviews.value.unshift(preview);
  
  // Move file object
  const file = selectedImages.value.splice(index, 1)[0];
  selectedImages.value.unshift(file);
  
  console.log('⭐ Image moved to main position');
};

/**
 * Move image one position to the left
 */
const moveLeft = (index: number): void => {
  if (index === 0) return;
  
  // Swap preview URLs
  const temp = imagePreviews.value[index];
  imagePreviews.value[index] = imagePreviews.value[index - 1];
  imagePreviews.value[index - 1] = temp;
  
  // Swap file objects
  const tempFile = selectedImages.value[index];
  selectedImages.value[index] = selectedImages.value[index - 1];
  selectedImages.value[index - 1] = tempFile;
  
  console.log('⬅️ Image moved left');
};

/**
 * Move image one position to the right
 */
const moveRight = (index: number): void => {
  if (index === imagePreviews.value.length - 1) return;
  
  // Swap preview URLs
  const temp = imagePreviews.value[index];
  imagePreviews.value[index] = imagePreviews.value[index + 1];
  imagePreviews.value[index + 1] = temp;
  
  // Swap file objects
  const tempFile = selectedImages.value[index];
  selectedImages.value[index] = selectedImages.value[index + 1];
  selectedImages.value[index + 1] = tempFile;
  
  console.log('➡️ Image moved right');
};
// ===== UTILITY FUNCTIONS =====

/**
 * Get user-friendly tour status label in Spanish
 */
const getTourStatusLabel = (status: TourStatus): string => {
  const labels: Record<TourStatus, string> = {
    available: "Disponible",
    sold_out: "Agotado",
    cancelled: "Cancelado",
    upcoming: "Próximamente",
  };
  return labels[status] || status;
};

/**
 * Get CSS classes for tour status badges
 */
const getTourStatusBadge = (status: TourStatus): string => {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const colors: Record<TourStatus, string> = {
    available: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200",
    sold_out: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200",
    cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    upcoming: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
  };
  return `${base} ${colors[status] || colors.available}`;
};

/**
 * Get user-friendly payment status label in Spanish
 */
const getPaymentStatusLabel = (status: PaymentStatus): string => {
  const labels: Record<PaymentStatus, string> = {
    pending: "Pendiente",
    paid: "Pagado",
    failed: "Fallido",
    refunded: "Reembolsado",
  };
  return labels[status] || status;
};

/**
 * Get CSS classes for payment status badges
 */
const getPaymentStatusBadge = (status: PaymentStatus): string => {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const colors: Record<PaymentStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200",
    paid: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200",
    failed: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200",
    refunded: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200",
  };
  return `${base} ${colors[status] || colors.pending}`;
};

// ===== EXPORT FUNCTIONS =====

/**
 * Export filtered tours to CSV format
 */
const exportCSV = (): void => {
  const headers = ['Título', 'Precio', 'Estado del Tour', 'Estado de Pago', 'Host', 'Fecha Creación'];
  const csvContent = [
    headers.join(','),
    ...filteredTours.value.map(tour => [
      `"${tour.title}"`,
      tour.price,
      `"${getTourStatusLabel(tour.status)}"`,
      `"${getPaymentStatusLabel(tour.paymentStatus || 'pending')}"`,
      typeof tour.host === 'object' 
        ? `"${tour.host.firstName} ${tour.host.lastName}"` 
        : `"${tour.host}"`,
      tour.createdAt ? `"${new Date(tour.createdAt).toLocaleDateString()}"` : '""'
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `paquetes_turisticos_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export filtered tours to PDF format
 */
const exportPDF = (): void => {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Paquetes Turísticos - GuaraníHost</title>
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
          .stat-item {
            text-align: center;
          }
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
          .sold_out { background: #fee2e2; color: #991b1b; }
          .cancelled { background: #f3f4f6; color: #374151; }
          .upcoming { background: #dbeafe; color: #1e40af; }
          .pending { background: #fef3c7; color: #92400e; }
          .paid { background: #d1fae5; color: #065f46; }
          .failed { background: #fee2e2; color: #991b1b; }
          .refunded { background: #e9d5ff; color: #7c3aed; }
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
          <h1>Gestión de Paquetes Turísticos</h1>
          <p>GuaraníHost - Panel de Administración</p>
          <p>Generado el ${currentDate}</p>
        </div>
        
        <div class="stats">
          <div class="stat-item">
            <div class="stat-number">${filteredTours.value.length}</div>
            <div class="stat-label">Total Tours</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${filteredTours.value.filter(t => t.status === 'available').length}</div>
            <div class="stat-label">Disponibles</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${filteredTours.value.filter(t => t.paymentStatus === 'paid').length}</div>
            <div class="stat-label">Pagados</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">$${filteredTours.value.length > 0 ? Math.round(filteredTours.value.reduce((sum, t) => sum + t.price, 0) / filteredTours.value.length) : 0}</div>
            <div class="stat-label">Precio Promedio</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Precio</th>
              <th>Estado del Tour</th>
              <th>Estado de Pago</th>
              <th>Host</th>
              <th>Fecha Creación</th>
            </tr>
          </thead>
          <tbody>
            ${filteredTours.value.map(tour => `
              <tr>
                <td><strong>${tour.title}</strong></td>
                <td class="price">$${tour.price?.toLocaleString()}</td>
                <td><span class="status ${tour.status}">${getTourStatusLabel(tour.status)}</span></td>
                <td><span class="status ${tour.paymentStatus || 'pending'}">${getPaymentStatusLabel(tour.paymentStatus || 'pending')}</span></td>
                <td>${typeof tour.host === 'object' ? `${tour.host.firstName} ${tour.host.lastName}` : tour.host}</td>
                <td>${tour.createdAt ? new Date(tour.createdAt).toLocaleDateString() : 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p><strong>GuaraníHost - Gestión de Paquetes Turísticos</strong><br>
          Total de tours: ${filteredTours.value.length}</p>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
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
/**
 * Scoped styles for tour management
 */
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

/* Line clamp utilities for text truncation */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
    