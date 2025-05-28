<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Page title -->
    <h1 class="text-3xl font-bold text-primary mb-6 text-center">Gestión de Propiedades</h1>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Property list section -->
      <section class="col-span-full">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 justify-between">
          <div class="flex items-center gap-2">
            <HomeIcon class="w-5 h-5" /> Lista de propiedades
          </div>
          <button @click="showForm = !showForm" class="text-white bg-primary hover:bg-hover px-3 py-1 rounded flex items-center gap-1">
            <PlusIcon class="w-5 h-5" /> Agregar 
          </button>
        </h2>

        <!-- Filters and Table -->
        <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-md transition">
          <div class="flex flex-wrap justify-between items-center mb-4 gap-4">
            <h3 class="text-lg font-semibold">Filtrar</h3>
            <div class="flex items-center gap-2">
              <label for="filterType" class="text-sm font-medium">Selecciona:</label>
              <select id="filterType" v-model="selectedFilter" class="input">
                <option value="">Todos</option>
                <option value="priceAsc">Precio: menor a mayor</option>
                <option value="priceDesc">Precio: mayor a menor</option>
                <option value="city">Por ciudad</option>
                <option value="availability">Por disponibilidad</option>
              </select>
            </div>
          </div>

          <!-- Properties Table -->
          <table class="min-w-full table-auto text-sm">
            <thead>
              <tr class="text-left bg-gray-100 dark:bg-gray-700">
                <th class="px-4 py-2">Casa</th>
                <th class="px-4 py-2">Ciudad</th>
                <th class="px-4 py-2">Precio</th>
                <th class="px-4 py-2">Estado</th>
                <th class="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(home, index) in filteredHomes" :key="home._id" class="border-b dark:border-gray-600">
                <td class="px-4 py-2">{{ home.title }}</td>
                <td class="px-4 py-2">{{ home.city }}</td>
                <td class="px-4 py-2">${{ home.pricePerNight }}</td>
                <td class="px-4 py-2 capitalize">{{ home.status }}</td>
                <td class="px-4 py-2 flex gap-3">
                  <button @click="editHome(index)" class="text-blue-500 hover:text-blue-700">
                    <PencilIcon class="w-5 h-5" />
                  </button>
                  <button @click="confirmDelete(index)" class="text-red-500 hover:text-red-700">
                    <Trash2Icon class="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Form section -->
      <section v-if="showForm">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <HomeIcon class="w-5 h-5" /> {{ modalTitle }}
        </h2>

        <div class="bg-white dark:bg-gray-800 p-6 rounded shadow-md">
          <form @submit.prevent="handleFormSubmit" class="space-y-4">
            <input v-model="form.title" type="text" placeholder="Casa" class="input" required />
            <input v-model="form.city" type="text" placeholder="Ciudad" class="input" required />
            <input v-model="form.address" type="text" placeholder="Dirección" class="input" required />
            <input v-model.number="form.pricePerNight" type="number" placeholder="Precio por noche" class="input" required />
            <input v-model="form.status" type="text" placeholder="Estado" class="input" required />
            <div>
              <label class="block text-sm font-medium mb-1">Imágenes</label>
              <input @change="handleFileUpload" type="file" multiple class="input bg-white dark:bg-gray-900 file:mr-4 file:py-2 file:px-4 file:border file:rounded file:border-gray-300 file:text-sm file:bg-primary file:text-white hover:file:bg-hover" />
              <div v-if="form.imageUrls?.length" class="flex flex-wrap mt-2 gap-2">
                <div v-for="(img, i) in form.imageUrls" :key="i" class="relative w-24 h-24">
                  <img :src="img" alt="Imagen subida" class="object-cover w-full h-full rounded" />
                  <button @click.prevent="removeImage(i)" class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 text-xs">
                    <XIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-4">
              <button type="button" @click="cancelForm" class="px-4 py-2 rounded border text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition">Cancelar</button>
              <button type="submit" class="bg-primary text-white px-6 py-2 rounded hover:bg-hover transition">
                {{ modalTitle === 'Crear propiedad' ? 'Crear' : 'Actualizar' }} propiedad
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>

    <!-- Return to dashboard -->
    <div class="mt-10 text-center">
      <RouterLink to="/admin/dashboard" class="inline-flex items-center gap-2 text-primary underline hover:text-hover">
        <ArrowLeftIcon class="w-4 h-4" /> Ir al Panel de Control
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { HomeIcon, PencilIcon, Trash2Icon, PlusIcon, ArrowLeftIcon, XIcon } from 'lucide-vue-next'
import Swal from 'sweetalert2'
import { RouterLink } from 'vue-router'
import { getProperties, createProperty, updateProperty, deleteProperty, type Property } from '@/services/propertyService'

const showForm = ref(false)
const modalTitle = ref('Crear propiedad')
const editIndex = ref<number | null>(null)
const selectedFilter = ref('')
const properties = ref<Property[]>([])
const selectedImages = ref<File[]>([])
const form = ref<Partial<Property>>({
  title: '',
  city: '',
  address: '',
  pricePerNight: 0,
  status: 'available',
  imageUrls: []
})

onMounted(async () => {
  await fetchProperties()
})

async function fetchProperties() {
  try {
    properties.value = await getProperties()
  } catch (error) {
    console.error('Error al cargar propiedades:', error)
  }
}

const filteredHomes = computed(() => {
  let result = [...properties.value]
  switch (selectedFilter.value) {
    case 'priceAsc':
      result.sort((a, b) => a.pricePerNight - b.pricePerNight)
      break
    case 'priceDesc':
      result.sort((a, b) => b.pricePerNight - a.pricePerNight)
      break
    case 'city':
      result.sort((a, b) => a.city.localeCompare(b.city))
      break
    case 'availability':
      result.sort((a, b) => a.status.localeCompare(b.status))
      break
  }
  return result
})

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (files) {
    selectedImages.value = Array.from(files)
  }
}

function removeImage(index: number) {
  form.value.imageUrls?.splice(index, 1)
}

function editHome(index: number) {
  const home = filteredHomes.value[index]
  form.value = { ...home }
  modalTitle.value = 'Editar propiedad'
  showForm.value = true
  editIndex.value = index
}

async function confirmDelete(index: number) {
  const home = filteredHomes.value[index]
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3F51B5',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar'
  })
  if (result.isConfirmed && home._id) {
    try {
      await deleteProperty(home._id)
      await fetchProperties()
      Swal.fire('Eliminado', 'La propiedad ha sido eliminada', 'success')
    } catch (error) {
      console.error('Error al eliminar propiedad:', error)
    }
  }
}

async function handleFormSubmit() {
  try {
    const formData = new FormData()
    formData.append('title', form.value.title || '')
    formData.append('city', form.value.city || '')
    formData.append('address', form.value.address || '')
    formData.append('pricePerNight', String(form.value.pricePerNight || 0))
    formData.append('status', form.value.status || 'available')

    selectedImages.value.forEach(file => {
      formData.append('images', file)
    })

    if (editIndex.value === null) {
      await createProperty(formData)
      Swal.fire('Éxito', 'Propiedad creada correctamente', 'success')
    } else if (form.value._id) {
      await updateProperty(form.value._id, formData)
      Swal.fire('Actualizado', 'Propiedad actualizada correctamente', 'success')
    }

    await fetchProperties()
    cancelForm()
  } catch (error) {
    console.error('Error al guardar propiedad:', error)
    Swal.fire('Error', 'No se pudo guardar la propiedad', 'error')
  }
}

function cancelForm() {
  showForm.value = false
  modalTitle.value = 'Crear propiedad'
  form.value = {
    title: '',
    city: '',
    address: '',
    pricePerNight: 0,
    status: 'available',
    imageUrls: []
  }
  selectedImages.value = []
  editIndex.value = null
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
