<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-primary mb-6">Gestión de Propiedades</h1>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Lista de propiedades -->
      <section class="col-span-full">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 justify-between">
          <div class="flex items-center gap-2">
            <HomeIcon class="w-5 h-5" /> Lista de propiedades
          </div>
          <button @click="showForm = !showForm" class="text-white bg-primary hover:bg-hover px-3 py-1 rounded flex items-center gap-1">
            <PlusIcon class="w-5 h-5" /> Nueva propiedad
          </button>
        </h2>

        <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-md transition">
          <div class="flex flex-wrap justify-between items-center mb-4 gap-4">
            <h3 class="text-lg font-semibold">Filtrar</h3>
            <div class="flex items-center gap-2">
              <label for="filterType" class="text-sm font-medium">Selecciona:</label>
              <select
                id="filterType"
                v-model="selectedFilter"
                class="p-2 border rounded dark:bg-gray-900 dark:text-white"
              >
                <option value="">Todos</option>
                <option value="priceAsc">Precio: menor a mayor</option>
                <option value="priceDesc">Precio: mayor a menor</option>
                <option value="city">Por ciudad</option>
                <option value="availability">Por disponibilidad</option>
              </select>
            </div>
          </div>

          <table class="min-w-full table-auto text-sm">
            <thead>
              <tr class="text-left bg-gray-100 dark:bg-gray-700">
                <th class="px-4 py-2">Casa</th>
                <th class="px-4 py-2">Ciudad</th>
                <th class="px-4 py-2">Precio</th>
                <th class="px-4 py-2">Disponible</th>
                <th class="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(home, index) in filteredHomes"
                :key="home._id"
                class="border-b dark:border-gray-600"
              >
                <td class="px-4 py-2">{{ home.title }}</td>
                <td class="px-4 py-2">{{ home.city }}</td>
                <td class="px-4 py-2">${{ home.pricePerNight }}</td>
                <td class="px-4 py-2">{{ home.available ? 'Sí' : 'No' }}</td>
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

      <!-- Formulario -->
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
            <label class="flex items-center gap-2">
              <input v-model="form.available" type="checkbox" class="accent-primary" /> Disponible
            </label>
            <div>
              <label class="block text-sm font-medium mb-1">Imágenes (puedes seleccionar varias)</label>
              <input @change="handleFileUpload" type="file" multiple class="input bg-white dark:bg-gray-900 file:mr-4 file:py-2 file:px-4 file:border file:rounded file:border-gray-300 file:text-sm file:bg-primary file:text-white hover:file:bg-hover" />
              <div v-if="form.images?.length" class="flex flex-wrap mt-2 gap-2">
                <div v-for="(img, i) in form.images" :key="i" class="relative w-24 h-24">
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

    <div class="mt-10 text-center">
      <RouterLink to="/admin/dashboard" class="inline-flex items-center gap-2 text-primary underline hover:text-hover">
        <ArrowLeftIcon class="w-4 h-4" /> Ir al Dashboard
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { HomeIcon, PencilIcon, Trash2Icon, PlusIcon, ArrowLeftIcon, XIcon } from 'lucide-vue-next'
import Swal from 'sweetalert2'
import { RouterLink } from 'vue-router'
import { uploadImagesToCloudinary } from '@/services/cloudinaryService'
import { getHomes, createHome, updateHome, deleteHome, Home as HomeType } from '@/services/propertyService'

const showForm = ref(false)
const modalTitle = ref('Crear propiedad')
const editIndex = ref<number | null>(null)
const selectedFilter = ref('')
const homes = ref<HomeType[]>([])
const form = ref<HomeType>({
  title: '',
  city: '',
  address: '',
  pricePerNight: 0,
  available: true,
  images: []
})

onMounted(async () => {
  await fetchHomes()
})

async function fetchHomes() {
  try {
    homes.value = await getHomes()
  } catch (error) {
    console.error('Error al cargar propiedades:', error)
  }
}

const filteredHomes = computed(() => {
  let result = [...homes.value]
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
      result.sort((a, b) => Number(b.available) - Number(a.available))
      break
  }
  return result
})

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (files && files.length > 0) {
    const urls = await uploadImagesToCloudinary(Array.from(files))
    form.value.images = urls
  }
}

function removeImage(index: number) {
  form.value.images?.splice(index, 1)
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
      await deleteHome(home._id)
      await fetchHomes()
      Swal.fire('Eliminado', 'La propiedad ha sido eliminada', 'success')
    } catch (error) {
      console.error('Error al eliminar propiedad:', error)
    }
  }
}

async function handleFormSubmit() {
  try {
    if (editIndex.value === null) {
      await createHome(form.value)
      Swal.fire({ title: 'Éxito', text: 'Propiedad creada', icon: 'success', timer: 2000, showConfirmButton: false })
    } else {
      if (form.value._id) {
        await updateHome(form.value._id, form.value)
        Swal.fire({ title: 'Actualizado', text: 'Propiedad actualizada', icon: 'success', timer: 2000, showConfirmButton: false })
      }
    }
    await fetchHomes()
    cancelForm()
  } catch (error) {
    console.error('Error al guardar propiedad:', error)
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
    available: true,
    images: []
  }
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
