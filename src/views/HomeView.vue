<template>
  <main class="max-w-7xl mx-auto px-4 py-10" role="main" aria-label="Main content area for GuaraníHost">
    <!-- Hero Section with welcome and call to register -->
    <section class="text-center mb-12" aria-labelledby="hero-title">
      <h1 id="hero-title" class="text-4xl md:text-5xl font-bold text-primary mb-6">
        Bienvenido a <span class="text-indigo-600 dark:text-indigo-400">GuaraníHost</span>
      </h1>
      <p class="text-lg text-darkText dark:text-gray-300 mb-8">
        Descubre propiedades únicas y experiencias inolvidables en Paraguay.
      </p>
      <RouterLink
        to="/register"
        class="bg-primary hover:bg-hover text-white font-semibold py-3 px-6 rounded-full shadow-md transition"
        aria-label="Registrarse ahora en GuaraníHost"
      >
        ¡Comienza ahora!
      </RouterLink>

      <!-- Main filter form: date range and guest count -->
      <form
        class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left"
        aria-label="Buscador de disponibilidad"
        @submit.prevent="applyFilters"
      >
        <div>
          <label for="checkin" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Check-in</label>
          <input id="checkin" v-model="filters.checkIn" type="date" class="input" />
        </div>
        <div>
          <label for="checkout" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Check-out</label>
          <input id="checkout" v-model="filters.checkOut" type="date" class="input" />
        </div>
        <div>
          <label for="guests" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Húespedes</label>
          <input id="guests" v-model.number="filters.guests" type="number" min="1" placeholder="2" class="input" />
        </div>
        <div class="flex items-end">
          <button type="submit" class="w-full bg-primary hover:bg-hover text-white px-4 py-2 rounded-md">Buscar</button>
        </div>
      </form>

      <!-- Info about filtering logic -->
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        * El filtrado por fecha para paquetes turísticos está disponible tras realizar una reserva.
      </p>
    </section>

    <!-- Featured vacation homes -->
    <section aria-labelledby="homes-title" class="mb-16">
      <h2 id="homes-title" class="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Propiedades destacadas
      </h2>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <article
          v-for="home in filteredHomes"
          :key="home._id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          role="article"
          aria-label="Propiedad destacada"
        >
          <img
            :src="home.imageUrls?.[0] || fallbackImage"
            :alt="`Imagen de la propiedad ${home.title}`"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h3 class="font-semibold text-lg text-primary mb-1">{{ home.title }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              {{ home.city }} · ${{ home.pricePerNight }}/noche
            </p>
            <RouterLink
              to="/login"
              class="text-sm text-primary hover:underline mt-2 inline-block"
              aria-label="Ver más detalles de la propiedad"
            >
              Ver más
            </RouterLink>
          </div>
        </article>
      </div>
    </section>

    <!-- Featured tour packages -->
    <section aria-labelledby="tours-title">
      <h2 id="tours-title" class="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Paquetes turísticos
      </h2>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <article
          v-for="tour in filteredTours"
          :key="tour._id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          role="article"
          aria-label="Paquete turístico"
        >
          <img
            :src="tour.imageUrls?.[0] || fallbackTour"
            :alt="`Imagen del paquete turístico ${tour.title}`"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h3 class="font-semibold text-lg text-primary mb-1">{{ tour.title }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {{ tour.description || 'Tour especial por Paraguay' }}
            </p>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
              Desde ${{ tour.price }}
            </p>
            <RouterLink
              to="/login"
              class="text-sm text-primary hover:underline mt-2 inline-block"
              aria-label="Ver más detalles del tour"
            >
              Ver más
            </RouterLink>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getProperties, type Property } from '@/services/propertyService'
import { getTours, type Tour } from '@/services/tourService'

// State to hold loaded homes and tours
const homes = ref<Property[]>([])
const tours = ref<Tour[]>([])

// Placeholder images for empty cases
const fallbackImage = 'https://source.unsplash.com/random/400x250?house,paraguay'
const fallbackTour = 'https://source.unsplash.com/random/400x250?paraguay,tour'

// Filter state for check-in, check-out, and guests
const filters = ref({
  checkIn: '',
  checkOut: '',
  guests: 1,
})

// Filtered list of homes based on selected filters
const filteredHomes = computed(() => {
  return homes.value.filter((home) => {
    const checkIn = new Date(filters.value.checkIn)
    const checkOut = new Date(filters.value.checkOut)
    const homeCheckIn = new Date(home.checkIn)
    const homeCheckOut = new Date(home.checkOut)

    return (
      home.guests >= filters.value.guests &&
      (!filters.value.checkIn || homeCheckIn <= checkIn) &&
      (!filters.value.checkOut || homeCheckOut >= checkOut)
    )
  })
})

// Tours are not filtered by dates, only returned as-is
const filteredTours = computed(() => tours.value)

// Load properties and tours only if user is logged in
onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    console.warn('🔒 No token present, skipping protected data loading.')
    return
  }
  try {
    homes.value = await getProperties()
    tours.value = await getTours()
  } catch (error) {
    console.error('❌ Error loading data:', error)
  }
})

// Handler for filter form
function applyFilters() {
  console.log('Filters applied:', filters.value)
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
.input {
  @apply w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary;
}
</style>
