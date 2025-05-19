<template>
  <main
    class="max-w-7xl mx-auto px-4 py-10"
    role="main"
    aria-label="Contenido principal de GuaraníHost"
  >
    <!-- Hero Section -->
    <section
      class="text-center mb-20"
      aria-labelledby="hero-title"
    >
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
    </section>

    <!-- Propiedades destacadas -->
    <section
      aria-labelledby="homes-title"
      class="mb-16"
    >
      <h2 id="homes-title" class="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Propiedades destacadas
      </h2>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <article
          v-for="home in homes"
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

    <!-- Paquetes turísticos -->
    <section
      aria-labelledby="tours-title"
    >
      <h2 id="tours-title" class="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Paquetes turísticos
      </h2>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <article
          v-for="tour in tours"
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
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getProperties, type Property } from '@/services/propertyService'
import { getTours, type Tour } from '@/services/tourService'

const homes = ref<Property[]>([])
const tours = ref<Tour[]>([])
const fallbackImage = 'https://source.unsplash.com/random/400x250?house,paraguay'
const fallbackTour = 'https://source.unsplash.com/random/400x250?paraguay,tour'

onMounted(async () => {
  try {
    homes.value = await getProperties()
    tours.value = await getTours()
  } catch (error) {
    console.error('Error loading data:', error)
  }
})
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
