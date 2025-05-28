<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6">
    <!-- Header with filter and new property button -->
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <div class="flex flex-wrap gap-2 w-full sm:w-auto">
        <!-- Filter section -->
        <select
          v-model="filters.city"
          class="rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 transition-colors"
        >
          <option value="">Todas las Ciudades</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>

        <select
          v-model="filters.status"
          class="rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 transition-colors"
        >
          <option value="">Todos los Estados</option>
          <option value="available">Disponible</option>
          <option value="booked">Reservado</option>
          <option value="cancelled">Cancelado</option>
          <option value="confirmed">Confirmado</option>
          <option value="inactive">Inactivo</option>
        </select>

        <select
          v-model="filters.price"
          class="rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 transition-colors"
        >
          <option value="">Todos los Precios</option>
          <option value="asc">Precios: Más Bajo a Más Alto</option>
          <option value="desc">Precios: Más Alto a Más Bajo</option>
        </select>
      </div>

      <!-- Create button -->
      <button
        class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        @click="openForm"
      >
        <span class="text-lg">＋</span>
        <span class="text-sm">Nueva Propiedad</span>
      </button>
    </div>

    <!-- Responsive grid of properties -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-label="List of properties"
    >
      <div
        v-for="property in filteredProperties"
        :key="property._id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col"
        tabindex="0"
        role="group"
        aria-label="Property card"
      >
        <img
          :src="property.imageUrls[0]"
          alt="Property image"
          class="w-full h-40 object-cover rounded-md mb-3"
        />
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white truncate">
          {{ property.title }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">
          {{ property.city }} • ${{ property.pricePerNight }} / noche
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 capitalize">
          Estado: {{ property.status }}
        </p>
        <div class="flex justify-between mt-auto pt-3">
          <button
            @click="editProperty(property)"
            class="text-sm text-blue-600 hover:underline focus:outline-none"
          >
            Editar
          </button>
          <button
            @click="confirmDelete(property._id!)"
            class="text-sm text-red-600 hover:underline focus:outline-none"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Property Form Modal -->
    <PropertyFormModal
      v-if="showForm"
      v-model="showForm"
      :property="isEditing ? properties.find(p => p._id === editId) : undefined"
      @submit="saveProperty"
    />

    <!-- Back to dashboard link -->
<div class="flex justify-end mt-10">
  <RouterLink
    to="/host/dashboard"
    class="inline-flex items-center gap-2 text-sm font-medium text-primary dark:text-indigo-300 hover:underline transition"
    aria-label="Back to Dashboard"
  >
    <ArrowLeftIcon class="w-4 h-4" />
    Volver al Dashboard
  </RouterLink>
</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import PropertyFormModal from '@/components/admin/PropertyFormModal.vue'
import {
  type Property,
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty
} from '@/services/propertyService'
import { propertyToFormData } from '@/utils/formDataHelpers'
import { useAuth } from '@/composables/useAuth'
import { ArrowLeftRightIcon } from 'lucide-vue-next'

const { user } = useAuth()

const properties = ref<Property[]>([])
const showForm = ref(false)
const isEditing = ref(false)
const editId = ref<string | null>(null)
const filters = ref({ city: '', status: '', price: '' })

const cities = computed(() => {
  const allCities = properties.value.map(p => p.city)
  return Array.from(new Set(allCities))
})

const filteredProperties = computed(() => {
  let filtered = [...properties.value]

  if (filters.value.city) {
    filtered = filtered.filter(p => p.city === filters.value.city)
  }

  if (filters.value.status) {
    filtered = filtered.filter(p => p.status === filters.value.status)
  }

  if (filters.value.price === 'asc') {
    filtered.sort((a, b) => a.pricePerNight - b.pricePerNight)
  } else if (filters.value.price === 'desc') {
    filtered.sort((a, b) => b.pricePerNight - a.pricePerNight)
  }

  return filtered
})

onMounted(fetchProperties)

async function fetchProperties() {
  if (!user.value?._id) return
  try {
    const all = await getProperties()
    properties.value = all.filter(p => p.host === user.value!._id)
  } catch (err) {
    console.error(err)
    Swal.fire('Error', 'No se pudo cargar la propiedad.', 'error')
  }
}

function openForm() {
  showForm.value = true
  isEditing.value = false
  editId.value = null
}

function editProperty(p: Property) {
  showForm.value = true
  isEditing.value = true
  editId.value = p._id ?? null
}

async function saveProperty(data: Property, images: File[]) {
  if (!user.value?._id) return

  const finalData = {
    ...data,
    host: user.value._id
  }

  const formData = propertyToFormData(finalData, images)

  try {
    if (isEditing.value && editId.value) {
      await updateProperty(editId.value, formData)
      Swal.fire('¡Actualizado!', 'Propiedad actualizada con éxito.', 'success')
    } else {
      await createProperty(formData)
      Swal.fire('¡Creado!', 'Propiedad creada con éxito.', 'success')
    }
    showForm.value = false
    await fetchProperties()
  } catch (err) {
    console.error(err)
    Swal.fire('Error', 'No se pudo guardar la propiedad.', 'error')
  }
}

async function confirmDelete(id: string) {
  const result = await Swal.fire({
    title: '¿Eliminar la propiedad?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, ¡eliminarlo!'
  })

  if (result.isConfirmed) {
    try {
      await deleteProperty(id)
      await fetchProperties()
      Swal.fire('¡Eliminado!', 'La propiedad se eliminó con éxito.', 'success')
    } catch (err) {
      console.error(err)
      Swal.fire('Error', 'No se pudo eliminar la propiedad.', 'error')
    }
  }
}
</script>
