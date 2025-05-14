<template>
  <!-- Hero Section -->
  <section class="px-4 py-20 text-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-4xl md:text-5xl font-bold mb-8 text-primary tracking-tight leading-tight">
        Bienvenido a <span class="text-indigo-600 dark:text-indigo-400">GuaraníHost</span>
      </h2>

      <p class="text-lg md:text-xl text-darkText dark:text-white leading-relaxed mb-10">
        Descubre propiedades únicas y paquetes turísticos auténticos en Paraguay.<br class="hidden md:inline" />
        Regístrate y empieza a explorar nuevas aventuras.
      </p>

      <RouterLink
        to="/register"
        class="bg-primary hover:bg-hover text-white font-semibold py-3 px-8 rounded-full shadow-md transition duration-300 ease-in-out"
      >
        ¡Comienza ahora!
      </RouterLink>
    </div>
  </section>

  <!-- Propiedades destacadas -->
  <section class="bg-white dark:bg-gray-800 py-16 px-4 transition-colors duration-300">
    <div class="max-w-7xl mx-auto">
      <h3 class="text-2xl font-bold text-center mb-10 text-gray-800 dark:text-white">
        Explora alojamientos destacados
      </h3>

      <!-- Swiper móvil -->
      <div class="sm:hidden">
        <Swiper :slides-per-view="1.1" :space-between="12">
          <SwiperSlide
            v-for="home in homes"
            :key="home._id"
            class="bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden shadow"
          >
            <img
              :src="home.images?.[0] || 'https://source.unsplash.com/random/400x250?house,paraguay'"
              alt="Imagen del alojamiento"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <h4 class="font-semibold text-lg text-primary mb-1">{{ home.title }}</h4>
              <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {{ home.city }} · ${{ home.pricePerNight }}/noche
              </p>
              <RouterLink to="/login" class="text-sm text-primary hover:underline">Ver más</RouterLink>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Grid escritorio -->
      <div class="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="home in homes"
          :key="home._id"
          class="bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
        >
          <img
            :src="home.images?.[0] || 'https://source.unsplash.com/random/400x250?house,paraguay'"
            alt="Imagen del alojamiento"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h4 class="font-semibold text-lg text-primary mb-1">{{ home.title }}</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
              {{ home.city }} · ${{ home.pricePerNight }}/noche
            </p>
            <RouterLink to="/login" class="text-sm text-primary hover:underline">Ver más</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Paquetes turísticos -->
  <section class="bg-gray-50 dark:bg-gray-900 py-16 px-4 transition-colors duration-300">
    <div class="max-w-7xl mx-auto">
      <h3 class="text-2xl font-bold text-center mb-10 text-gray-800 dark:text-white">
        Descubre nuestros paquetes turísticos
      </h3>

      <!-- Swiper móvil -->
      <div class="sm:hidden">
        <Swiper :slides-per-view="1.1" :space-between="12">
          <SwiperSlide
            v-for="tour in tours"
            :key="tour._id"
            class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow"
          >
            <img
              :src="tour.images?.[0] || 'https://source.unsplash.com/random/400x250?paraguay,tour'"
              alt="Imagen del tour"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <h4 class="font-semibold text-lg text-primary mb-1">{{ tour.title }}</h4>
              <p class="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                {{ tour.description || 'Tour especial por Paraguay' }}
              </p>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Desde ${{ tour.price }}
              </p>
              <RouterLink to="/login" class="text-sm text-primary hover:underline">Ver más</RouterLink>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Grid escritorio -->
      <div class="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="tour in tours"
          :key="tour._id"
          class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
        >
          <img
            :src="tour.images?.[0] || 'https://source.unsplash.com/random/400x250?paraguay,tour'"
            alt="Imagen del tour"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h4 class="font-semibold text-lg text-primary mb-1">{{ tour.title }}</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
              {{ tour.description || 'Tour especial por Paraguay' }}
            </p>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Desde ${{ tour.price }}
            </p>
            <RouterLink to="/login" class="text-sm text-primary hover:underline">Ver más</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getProperties, type Property } from '@/services/propertyService'
import { getTours, type Tour } from '@/services/tourService'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const properties = ref<Property[]>([])
const tours = ref<Tour[]>([])

onMounted(async () => {
  try {
    properties.value = await getProperties()
    tours.value = await getTours()
  } catch (error) {
    console.error('Error al cargar datos:', error)
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

