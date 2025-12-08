<template>
  <main
    class="min-h-screen bg-background dark:bg-gray-900"
    aria-labelledby="tours-page-title"
  >
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <!-- Header -->
      <header class="mb-8 sm:mb-10">
        <p
          class="text-xs font-semibold tracking-wide uppercase text-primary/80 mb-2"
        >
          Experiencias locales
        </p>
        <h1
          id="tours-page-title"
          class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
        >
          Tours y experiencias en Paraguay
        </h1>
        <p class="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl">
          Descubre actividades guiadas por anfitriones locales: city tours, rutas
          naturales, experiencias culturales y más.
        </p>
      </header>

      <!-- Filtros simples -->
      <section
        class="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
        aria-label="Filtros de búsqueda de tours"
      >
        <form
          class="grid grid-cols-1 md:grid-cols-4 gap-4"
          @submit.prevent="applyFilters"
        >
          <!-- Buscar -->
          <div>
            <label
              for="search"
              class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Buscar
            </label>
            <input
              id="search"
              v-model="search"
              type="text"
              placeholder="Ciudad, nombre, descripción..."
              class="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <!-- Precio mínimo -->
          <div>
            <label
              for="minPrice"
              class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Precio mínimo (USD)
            </label>
            <input
              id="minPrice"
              v-model.number="minPrice"
              type="number"
              min="0"
              class="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <!-- Precio máximo -->
          <div>
            <label
              for="maxPrice"
              class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Precio máximo (USD)
            </label>
            <input
              id="maxPrice"
              v-model.number="maxPrice"
              type="number"
              min="0"
              class="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <!-- Ordenar -->
          <div>
            <label
              for="sortBy"
              class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Ordenar por
            </label>
            <select
              id="sortBy"
              v-model="sortBy"
              class="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="newest">Más recientes</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>

          <!-- Botón aplicar (full width en mobile) -->
          <div class="md:col-span-4 flex justify-end mt-1">
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60"
              :disabled="loading"
            >
              <span v-if="!loading">Aplicar filtros</span>
              <span v-else>Aplicando...</span>
            </button>
          </div>
        </form>
      </section>

      <!-- Estados: cargando / error / vacío -->
      <section aria-live="polite">
        <!-- Loading -->
        <div
          v-if="loading"
          class="flex flex-col items-center justify-center py-16 text-gray-600 dark:text-gray-300"
        >
          <div
            class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"
            aria-hidden="true"
          ></div>
          <p>Cargando experiencias locales...</p>
        </div>

        <!-- Error -->
        <div
          v-else-if="error"
          class="max-w-md mx-auto text-center py-16"
          role="alert"
        >
          <p class="text-red-600 dark:text-red-400 font-medium mb-2">
            Ocurrió un problema al cargar las experiencias.
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {{ error }}
          </p>
          <button
            type="button"
            @click="loadTours"
            class="inline-flex items-center px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            Reintentar
          </button>
        </div>

        <!-- Sin resultados -->
        <div
          v-else-if="filteredTours.length === 0"
          class="max-w-md mx-auto text-center py-16"
        >
          <p class="text-4xl mb-4" aria-hidden="true">🗺️</p>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No encontramos experiencias con esos criterios
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Prueba ajustando los filtros o limpiándolos para ver todas las
            experiencias disponibles.
          </p>
          <button
            type="button"
            @click="resetFilters"
            class="inline-flex items-center px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            Limpiar filtros
          </button>
        </div>

        <!-- Grid de tours -->
        <section
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-label="Lista de tours disponibles"
          role="list"
        >
          <article
            v-for="tour in filteredTours"
            :key="tour._id"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full"
            role="listitem"
          >
            <!-- Imagen principal -->
            <div class="relative h-48">
              <img
                v-if="tour.imageUrls?.length"
                :src="tour.imageUrls[0]"
                :alt="`Imagen de ${tour.title}`"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-3xl"
                aria-hidden="true"
              >
                🗺️
              </div>

              <!-- Badge estado -->
              <span
                class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="statusBadgeClass(tour.status)"
              >
                {{ statusLabel(tour.status) }}
              </span>
            </div>

            <!-- Contenido -->
            <div class="flex-1 flex flex-col p-4 sm:p-5">
              <header class="mb-3">
                <h2
                  class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2"
                >
                  {{ tour.title }}
                </h2>
                <p
                  v-if="tour.location"
                  class="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"
                >
                  <span aria-hidden="true">📍</span>
                  <span>{{ tour.location }}</span>
                </p>
              </header>

              <p
                class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3"
              >
                {{ tour.description }}
              </p>

              <!-- Info resumida -->
              <dl class="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300 mb-4">
                <div>
                  <dt class="text-gray-500 dark:text-gray-400">
                    Desde
                  </dt>
                  <dd class="font-semibold text-primary">
                    {{ formatPrice(tour.price) }}
                  </dd>
                </div>
                <div v-if="tour.duration">
                  <dt class="text-gray-500 dark:text-gray-400">
                    Duración
                  </dt>
                  <dd>
                    {{ tour.duration }}
                    {{ tour.duration === 1 ? 'día' : 'días' }}
                  </dd>
                </div>
                <div v-if="tour.maxCapacity">
                  <dt class="text-gray-500 dark:text-gray-400">
                    Capacidad
                  </dt>
                  <dd>
                    Hasta {{ tour.maxCapacity }} personas
                  </dd>
                </div>
                <div v-if="tour.averageRating">
                  <dt class="text-gray-500 dark:text-gray-400">
                    Valoración
                  </dt>
                  <dd class="flex items-center gap-1">
                    <span class="text-yellow-500" aria-hidden="true">★</span>
                    <span>{{ tour.averageRating.toFixed(1) }}</span>
                    <span class="text-[11px] text-gray-400">
                      ({{ tour.totalReviews }} reseñas)
                    </span>
                  </dd>
                </div>
              </dl>

              <!-- Host / Guía -->
              <div
                class="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold"
                    :aria-label="`Guía: ${tour.host.firstName} ${tour.host.lastName}`"
                  >
                    {{ tour.hostInitials || hostInitials(tour) }}
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-300">
                    Guía:
                    <span class="font-medium">
                      {{ tour.host.firstName }} {{ tour.host.lastName }}
                    </span>
                  </p>
                </div>

                <RouterLink
                  :to="{ name: 'tour-detail', params: { id: tour._id } }"
                  class="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                  :aria-label="`Ver detalles del tour ${tour.title}`"
                >
                  Ver detalles
                </RouterLink>
              </div>
            </div>
          </article>
        </section>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  getPublicTours,
  type PublicTour,
} from '@/services/publicTourService'

const tours = ref<PublicTour[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// filtros UI
const search = ref('')
const minPrice = ref<number | null>(null)
const maxPrice = ref<number | null>(null)
const sortBy = ref<'newest' | 'price-asc' | 'price-desc'>('newest')

/**
 * Carga tours desde la API pública
 */
const loadTours = async () => {
  try {
    loading.value = true
    error.value = null

    // Mínimo pasamos limit; el resto de filtros de backend los puedes ir añadiendo
    const res = await getPublicTours({
      limit: 50,
      sortBy: sortBy.value === 'newest' ? 'newest' : 'price',
      sortOrder:
        sortBy.value === 'price-desc'
          ? 'desc'
          : 'asc',
      minPrice: minPrice.value ?? undefined,
      maxPrice: maxPrice.value ?? undefined,
    })

    tours.value = res.tours
  } catch (err: any) {
    console.error('❌ Error loading tours:', err)
    error.value =
      err?.message || 'No se pudieron cargar las experiencias'
  } finally {
    loading.value = false
  }
}

/**
 * Aplica filtros (recarga desde backend y filtra en frontend por texto)
 */
const applyFilters = async () => {
  await loadTours()
}

/**
 * Limpia todos los filtros
 */
const resetFilters = async () => {
  search.value = ''
  minPrice.value = null
  maxPrice.value = null
  sortBy.value = 'newest'
  await loadTours()
}

/**
 * Filtro final en frontend por texto
 */
const filteredTours = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return tours.value

  return tours.value.filter((tour) => {
    const title = tour.title?.toLowerCase() || ''
    const desc = tour.description?.toLowerCase() || ''
    const loc = tour.location?.toLowerCase() || ''
    return (
      title.includes(term) ||
      desc.includes(term) ||
      loc.includes(term)
    )
  })
})

/**
 * Formatea precio
 */
const formatPrice = (price: number) => {
  const n =
    typeof price === 'number' ? price : Number(price)
  if (!Number.isFinite(n)) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

/**
 * Clase para badge de estado
 */
const statusBadgeClass = (status: PublicTour['status']) => {
  const base =
    'text-[11px] px-2 py-0.5 rounded-full bg-opacity-90'
  switch (status) {
    case 'available':
      return base + ' bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'sold_out':
      return base + ' bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'upcoming':
      return base + ' bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'cancelled':
    default:
      return base + ' bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

/**
 * Etiqueta legible para estado
 */
const statusLabel = (status: PublicTour['status']) => {
  switch (status) {
    case 'available':
      return 'Disponible'
    case 'sold_out':
      return 'Agotado'
    case 'upcoming':
      return 'Próximamente'
    case 'cancelled':
    default:
      return 'Cancelado'
  }
}

/**
 * Initials si no vienen calculadas
 */
const hostInitials = (tour: PublicTour) => {
  const f = tour.host?.firstName?.[0] || ''
  const l = tour.host?.lastName?.[0] || ''
  return (f + l) || 'GH'
}

/**
 * Imagen fallback
 */
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src =
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80'
}

onMounted(() => {
  loadTours()
})
</script>

<style scoped>
.bg-background {
  background-color: #f5f5f5;
}

/* Si ya tienes estas clases en global, esto sobra, pero no molesta */
.text-primary {
  color: #3f51b5;
}
.bg-primary {
  background-color: #3f51b5;
}
.bg-primary-dark {
  background-color: #303f9f;
}
.text-primary\/80 {
  color: rgba(63, 81, 181, 0.8);
}

/* multi-line clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
