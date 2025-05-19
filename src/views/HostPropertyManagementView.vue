<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Header -->
    <h1 class="text-3xl font-bold text-primary text-center mb-8">Mis Propiedades</h1>

    <!-- Property List Section (Cards Responsive) -->
    <section class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Propiedades Publicadas</h2>
        <button @click="toggleForm" class="bg-primary hover:bg-hover text-white px-4 py-2 rounded">
          {{ showForm ? 'Close' : 'New Property' }}
        </button>
      </div>

      <!-- Grid of Cards instead of Table -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="home in myProperties"
          :key="home._id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col justify-between"
          role="region"
          aria-label="Property card"
        >
          <div>
            <h3 class="text-lg font-semibold text-primary">{{ home.title }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ home.city }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">${{ home.pricePerNight }} / noche</p>
            <p class="text-sm">Disponibilidad: <span class="font-medium">{{ home.status === 'available' ? 'Sí' : 'No' }}</span></p>
          </div>
          <div class="flex justify-end mt-4 gap-2">
            <button
              @click="editProperty(home)"
              class="text-blue-600 hover:underline"
              aria-label="Editar propiedad"
            >Editar</button>
            <button
              @click="handleDeleteProperty(home._id!)"
              class="text-red-600 hover:underline"
              aria-label="Eliminar propiedad"
            >Eliminar</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Property Form Section -->
    <section v-if="showForm" class="bg-white dark:bg-gray-800 p-6 rounded shadow-md">
      <h2 class="text-xl font-semibold mb-4">{{ editId ? 'Edit' : 'New' }} Property</h2>
      <form @submit.prevent="submitForm" class="space-y-4">
        <label for="title" class="block text-sm font-medium">Título</label>
        <input id="title" v-model="form.title" type="text" class="input" required />

        <label for="city" class="block text-sm font-medium">Ciudad</label>
        <input id="city" v-model="form.city" type="text" class="input" required />

        <label for="address" class="block text-sm font-medium">Dirección</label>
        <input id="address" v-model="form.address" type="text" class="input" required />

        <label for="price" class="block text-sm font-medium">Precio por noche</label>
        <input id="price" v-model.number="form.pricePerNight" type="number" class="input" required />

        <label for="images" class="block text-sm font-medium">Imágenes</label>
        <input id="images" type="file" multiple accept="image/*" @change="handleImageUpload" class="input" aria-label="Seleccionar imágenes" />

        <label class="flex items-center gap-2">
          <input
            type="checkbox"
            v-model="form.status"
            true-value="available"
            false-value="inactive"
            class="accent-primary"
          />
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
import { propertyToFormData } from '@/utils/propertyToFormData' // asegúrate de tener este helper

const showForm = ref(false)
const editId = ref<string | null>(null)
const allHomes = ref<Property[]>([])
const selectedImages = ref<File[]>([])

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
 * Handle form submission for create/update
 */
async function submitForm() {
  const formData = propertyToFormData(form.value, selectedImages.value)

  if (!editId.value) {
    await createProperty(formData)
    Swal.fire('Created', 'Property created successfully', 'success')
  } else {
    await updateProperty(editId.value, formData)
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
 * Handle image input (multiple files)
 */
function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    selectedImages.value = Array.from(target.files)
  }
}

/**
 * Reset form to initial state
 */
function resetForm() {
  showForm.value = false
  editId.value = null
  selectedImages.value = []
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
