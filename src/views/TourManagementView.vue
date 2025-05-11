<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Page Title -->
    <h1 class="text-3xl font-bold text-primary mb-6 text-center">Gestión de Paquetes Turísticos</h1>

    <!-- Filter + Create Button -->
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
      <div class="flex items-center gap-2">
        <MapPinnedIcon class="w-6 h-6 text-primary" />
        <h2 class="text-xl font-semibold">Lista de Tours</h2>
      </div>
      <div class="flex gap-2 items-center">
        <select v-model="sortOption" class="input text-sm max-w-xs">
          <option value="">Todos</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
          <option value="title">Destino (A-Z)</option>
          <option value="available">Disponibles</option>
        </select>
        <button
          @click="openModal"
          class="bg-primary hover:bg-hover text-white px-4 py-2 rounded flex items-center gap-1"
        >
          <PlusIcon class="w-5 h-5" /> Nuevo Tour
        </button>
      </div>
    </div>

    <!-- Tours Table -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
      <table class="min-w-full table-auto text-sm">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-2 text-left">Destino</th>
            <th class="px-4 py-2 text-left">Descripción</th>
            <th class="px-4 py-2 text-left">Precio</th>
            <th class="px-4 py-2 text-left">Disponible</th>
            <th class="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tour in filteredTours"
            :key="tour._id"
            class="border-b dark:border-gray-600"
          >
            <td class="px-4 py-2">{{ tour.title }}</td>
            <td class="px-4 py-2">{{ tour.description }}</td>
            <td class="px-4 py-2">${{ tour.price }}</td>
            <td class="px-4 py-2">{{ tour.status === "available" ? "Sí" : "No" }}</td>
            <td class="px-4 py-2 flex gap-2">
              <button @click="editTour(tour)" class="text-blue-500 hover:text-blue-700">
                <PencilIcon class="w-5 h-5" />
              </button>
              <button @click="confirmDelete(tour._id)" class="text-red-500 hover:text-red-700">
                <Trash2Icon class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <TourPackageModal
      v-if="showModal"
      :tour="selectedTour"
      @saved="handleSave"
      @close="showModal = false"
    />

    <!-- Back to dashboard -->
    <div class="text-center mt-10">
      <RouterLink to="/admin/dashboard" class="inline-flex items-center gap-2 text-primary underline hover:text-hover">
        <ArrowLeftIcon class="w-4 h-4" /> Ir al Dashboard
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Swal from 'sweetalert2'
import {
  MapPinnedIcon,
  PencilIcon,
  Trash2Icon,
  PlusIcon,
  ArrowLeftIcon
} from 'lucide-vue-next'

import TourPackageModal from '@/components/admin/TourPackageModal.vue'
import { getTours, deleteTour, type Tour } from '@/services/tourService'

/**
 * State
 */
const tours = ref<Tour[]>([])
const sortOption = ref('')
const showModal = ref(false)

const selectedTour = ref<Partial<Tour>>({
  title: '',
  description: '',
  price: 0,
  status: 'available',
  imageUrls: []
})

/**
 * Fetch data on mount
 */
onMounted(async () => {
  await fetchTours()
})

/**
 * Fetch tours from backend
 */
async function fetchTours() {
  try {
    tours.value = await getTours()
  } catch (err) {
    console.error('Error al cargar tours:', err)
  }
}

/**
 * Computed filtered list
 */
const filteredTours = computed(() => {
  let result = [...tours.value]
  switch (sortOption.value) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'title':
      result.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'available':
      result = result.filter(t => t.status === "available")
      break
  }
  return result
})

/**
 * Open modal for new tour
 */
function openModal() {
  selectedTour.value = {
    title: '',
    description: '',
    price: 0,
    status: 'available',
    imageUrls: []
  }
  showModal.value = true
}

/**
 * Load tour into modal for editing
 */
function editTour(tour: Tour) {
  selectedTour.value = { ...tour }
  showModal.value = true
}

/**
 * Confirm and delete a tour
 */
async function confirmDelete(id?: string) {
  if (!id) return
  const result = await Swal.fire({
    title: '¿Eliminar paquete?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3F51B5',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar'
  })
  if (result.isConfirmed) {
    await deleteTour(id)
    await fetchTours()
    Swal.fire('Eliminado', 'El paquete ha sido eliminado', 'success')
  }
}

/**
 * Handle save callback from modal
 */
async function handleSave() {
  await fetchTours()
  showModal.value = false
}
</script>

<style scoped>
.input {
  @apply w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white;
}
.bg-primary {
  background-color: #3F51B5;
}
.text-primary {
  color: #3F51B5;
}
.hover\:bg-hover:hover {
  background-color: #303F9F;
}
</style>
