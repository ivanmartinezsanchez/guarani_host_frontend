<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Page Title -->
    <h1 class="text-3xl font-bold text-primary text-center mb-8">Mis Paquetes Turísticos</h1>

    <!-- Tour List -->
    <section class="mb-10">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Tours publicados</h2>
        <button @click="toggleForm" class="bg-primary hover:bg-hover text-white px-4 py-2 rounded">
          {{ showForm ? 'Close' : 'New Package' }}
        </button>
      </div>

      <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-md overflow-x-auto">
        <table class="min-w-full table-auto text-sm">
          <thead class="bg-gray-100 dark:bg-gray-700">
            <tr class="text-left">
              <th class="px-4 py-2">Destino</th>
              <th class="px-4 py-2">Precio</th>
              <th class="px-4 py-2">Status</th>
              <th class="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="tour in myTours"
              :key="tour._id"
              class="border-b dark:border-gray-600"
            >
              <td class="px-4 py-2">{{ tour.title }}</td>
              <td class="px-4 py-2">${{ tour.price }}</td>
              <td class="px-4 py-2 capitalize">{{ tour.status }}</td>
              <td class="px-4 py-2 flex gap-2">
                <button @click="editTour(tour)" class="text-blue-500 hover:text-blue-700">Edit</button>
                <button @click="handleDeleteTour(tour._id!)" class="text-red-500 hover:text-red-700">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Form Section -->
    <section v-if="showForm" class="bg-white dark:bg-gray-800 p-6 rounded shadow-md">
      <h2 class="text-xl font-semibold mb-4">{{ editId ? 'Edit' : 'New' }} Package</h2>
      <form @submit.prevent="submitForm" class="space-y-4">
        <input v-model="form.title" type="text" placeholder="Destino" class="input" required />
        <input v-model.number="form.price" type="number" placeholder="Precio" class="input" required />
        <textarea v-model="form.description" placeholder="Descripción" class="input" rows="3" required />
        <select v-model="form.status" class="input">
          <option value="available">Disponible</option>
          <option value="upcoming">Próximamente</option>
          <option value="cancelled">Cancelado</option>
          <option value="sold out">Agotado</option>
        </select>
        <div class="flex justify-end gap-2">
          <button type="button" @click="resetForm" class="text-gray-500">Cancelar</button>
          <button type="submit" class="bg-primary hover:bg-hover text-white px-4 py-2 rounded">
            {{ editId ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Swal from 'sweetalert2'
import {
  getTours,
  createTour,
  updateTour,
  deleteTour,
  type Tour
} from '@/services/tourService'

const showForm = ref(false)
const editId = ref<string | null>(null)
const allTours = ref<Tour[]>([])

const user = JSON.parse(localStorage.getItem('user') || '{}')

// Default form state
const form = ref<Partial<Tour>>({
  title: '',
  description: '',
  price: 0,
  status: 'available',
  host: user._id,
  imageUrls: []
})

// Filter tours for current host
const myTours = computed(() =>
  allTours.value.filter(t => t.host === user._id)
)

// Load tours on mount
onMounted(async () => {
  allTours.value = await getTours()
})

/**
 * Create or update tour
 */
async function submitForm() {
  const data = {
    ...form.value,
    host: user._id,
    imageUrls: form.value.imageUrls || [],
  }

  if (!editId.value) {
    await createTour(data as Tour)
    Swal.fire('Created', 'Tour created successfully', 'success')
  } else {
    await updateTour(editId.value, data as Tour)
    Swal.fire('Updated', 'Tour updated successfully', 'success')
  }

  await refresh()
  resetForm()
}

/**
 * Set form values to edit a tour
 */
function editTour(tour: Tour) {
  form.value = { ...tour }
  editId.value = tour._id || null
  showForm.value = true
}

/**
 * Confirm and delete a tour
 */
async function handleDeleteTour(id: string) {
  const result = await Swal.fire({
    title: 'Delete this package?',
    text: 'This action cannot be undone',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3F51B5',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it'
  })

  if (result.isConfirmed) {
    await deleteTour(id)
    await refresh()
    Swal.fire('Deleted', 'Package deleted successfully', 'success')
  }
}

/**
 * Reset form to default state
 */
function resetForm() {
  form.value = {
    title: '',
    description: '',
    price: 0,
    status: 'available',
    host: user._id,
    imageUrls: []
  }
  editId.value = null
  showForm.value = false
}

/**
 * Reload tours from API
 */
async function refresh() {
  allTours.value = await getTours()
}

/**
 * Toggle the form visibility
 */
function toggleForm() {
  showForm.value = !showForm.value
  if (!showForm.value) resetForm()
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

