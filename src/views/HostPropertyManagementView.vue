<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Header -->
    <h1 class="text-3xl font-bold text-primary text-center mb-8">Mis Propiedades</h1>

    <!-- Property List Section -->
    <section class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Propiedades Publicadas</h2>
        <button @click="toggleForm" class="bg-primary hover:bg-hover text-white px-4 py-2 rounded">
          {{ showForm ? 'Close' : 'New Property' }}
        </button>
      </div>

      <!-- Properties Table -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-md overflow-x-auto">
        <table class="min-w-full table-auto text-sm">
          <thead class="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-2 text-left">Título</th>
              <th class="px-4 py-2 text-left">Ciudad</th>
              <th class="px-4 py-2 text-left">Precio</th>
              <th class="px-4 py-2 text-left">Disponibilidad</th>
              <th class="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="home in myProperties" :key="home._id" class="border-b dark:border-gray-600">
              <td class="px-4 py-2">{{ home.title }}</td>
              <td class="px-4 py-2">{{ home.city }}</td>
              <td class="px-4 py-2">${{ home.pricePerNight }}</td>
              <td class="px-4 py-2">{{ home.status === 'available' ? 'Yes' : 'No' }}</td>
              <td class="px-4 py-2 flex gap-2">
                <button @click="editProperty(home)" class="text-blue-500 hover:text-blue-700">Editar</button>
                <button @click="handleDeleteProperty(home._id!)" class="text-red-500 hover:text-red-700">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Property Form Section -->
    <section v-if="showForm" class="bg-white dark:bg-gray-800 p-6 rounded shadow-md">
      <h2 class="text-xl font-semibold mb-4">{{ editId ? 'Edit' : 'New' }} Property</h2>
      <form @submit.prevent="submitForm" class="space-y-4">
        <input v-model="form.title" type="text" placeholder="Título" class="input" required />
        <input v-model="form.city" type="text" placeholder="Ciudad" class="input" required />
        <input v-model="form.address" type="text" placeholder="Dirección" class="input" required />
        <input v-model.number="form.pricePerNight" type="number" placeholder="Precio por Noche" class="input" required />
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="form.status" true-value="available" false-value="inactive" class="accent-primary" />
          Disponible
        </label>
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
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  type Property
} from '@/services/propertyService'

const showForm = ref(false)
const editId = ref<string | null>(null)
const allHomes = ref<Property[]>([])

const user = JSON.parse(localStorage.getItem('user') || '{}')

// Initial form values
const form = ref<Partial<Property>>({
  title: '',
  description: '',
  address: '',
  city: '',
  pricePerNight: 0,
  checkIn: new Date(),
  checkOut: new Date(),
  guests: 1,
  amenities: [],
  status: 'available',
  paymentStatus: 'pending',
  host: user._id,
  imageUrls: []
})

// Get host's properties only
const myProperties = computed(() =>
  allHomes.value.filter(home => home.host === user._id)
)

// Fetch data on mount
onMounted(refresh)

/**
 * Toggle the visibility of the property form
 */
function toggleForm() {
  showForm.value = !showForm.value
  if (!showForm.value) resetForm()
}

/**
 * Refresh the list of properties
 */
async function refresh() {
  allHomes.value = await getProperties()
}

/**
 * Submit form: create or update property
 */
async function submitForm() {
  if (!editId.value) {
    await createProperty(form.value as Property)
    Swal.fire('Created', 'Property created successfully', 'success')
  } else {
    await updateProperty(editId.value, form.value as Property)
    Swal.fire('Updated', 'Property updated successfully', 'success')
  }
  await refresh()
  resetForm()
}

/**
 * Load property into form to edit
 */
function editProperty(home: Property) {
  form.value = { ...home }
  editId.value = home._id || null
  showForm.value = true
}

/**
 * Delete property with confirmation
 */
async function handleDeleteProperty(id: string) {
  const result = await Swal.fire({
    title: 'Delete this property?',
    text: 'This action cannot be undone',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3F51B5',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete'
  })

  if (result.isConfirmed) {
    await deleteProperty(id)
    await refresh()
    Swal.fire('Deleted', 'Property deleted successfully', 'success')
  }
}

/**
 * Reset form to initial state
 */
function resetForm() {
  showForm.value = false
  editId.value = null
  form.value = {
  title: '',
  description: '',
  address: '',
  city: '',
  pricePerNight: 0,
  checkIn: new Date(),
  checkOut: new Date(),
  guests: 1,
  amenities: [],
  status: 'available',
  paymentStatus: 'pending',
  host: user._id,
  imageUrls: []
}
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
