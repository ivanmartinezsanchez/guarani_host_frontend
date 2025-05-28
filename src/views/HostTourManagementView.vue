<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Page Title -->
    <h1 class="text-3xl font-bold text-primary text-center mb-8">
      Mis Paquetes Turísticos
    </h1>

    <!-- Tour List Section -->
    <section class="mb-10">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Tours Publicados</h2>
        <button
          @click="toggleForm"
          class="bg-primary hover:bg-hover text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <PlusIcon class="w-5 h-5" />
          {{ showForm ? "Cerrar" : "Nuevo Tour" }}
        </button>
      </div>

      <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-md overflow-x-auto">
        <table class="min-w-full table-auto text-sm">
          <thead class="bg-gray-100 dark:bg-gray-700">
            <tr class="text-left">
              <th class="px-4 py-2">Destino</th>
              <th class="px-4 py-2">Precio</th>
              <th class="px-4 py-2">EStado</th>
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
                <button @click="editTour(tour)" class="text-blue-500 hover:text-blue-700">
                  Editar
                </button>
                <button @click="handleDeleteTour(tour._id!)" class="text-red-500 hover:text-red-700">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Back to dashboard link -->
        <div class="text-center mt-10">
          <RouterLink
            to="/host/dashboard"
            class="inline-flex items-center gap-2 text-primary underline hover:text-hover"
          >
            <ArrowLeftIcon class="w-4 h-4" /> Volver al Dashboard
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Form Section -->
    <section v-if="showForm" class="bg-white dark:bg-gray-800 p-6 rounded shadow-md">
      <h2 class="text-xl font-semibold mb-4">
        {{ editId ? "Editar" : "Nuevo" }} Paquete Turístico
      </h2>
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
        <input type="file" accept="image/*" multiple @change="handleImageUpload" class="input" />
        <div class="flex justify-end gap-2">
          <button type="button" @click="resetForm" class="text-gray-500">Cancel</button>
          <button type="submit" class="bg-primary hover:bg-hover text-white px-4 py-2 rounded">
            {{ editId ? "Update" : "Create" }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import Swal from "sweetalert2"
import {
  getTours,
  createTour,
  updateTour,
  deleteTour,
  type Tour,
} from "@/services/tourService"
import { ArrowLeftIcon, PlusIcon } from "lucide-vue-next"

// Modal visibility and edit tracking
const showForm = ref(false)
const editId = ref<string | null>(null)

// All tours and uploaded images
const allTours = ref<Tour[]>([])
const selectedImages = ref<File[]>([])

// Authenticated host
const user = JSON.parse(localStorage.getItem("user") || "{}")

// Reactive form object
const form = ref<Partial<Tour>>({
  title: "",
  description: "",
  price: 0,
  status: "available",
  host: user._id,
  imageUrls: [],
})

// Filtered list of tours by current host
const myTours = computed(() =>
  allTours.value.filter(tour => tour.host === user._id)
)

// Initial data load
onMounted(async () => {
  await refresh()
})

/**
 * Handles form submission to create or update a tour
 */
async function submitForm() {
  try {
    const data = { ...form.value, host: user._id }

    if (!editId.value) {
      await createTour(data, selectedImages.value)
      Swal.fire("Creado", "Tour creado con éxito", "success")
    } else {
      await updateTour(editId.value, data as Tour)
      Swal.fire("Updated", "Tour actualizado con éxito", "success")
    }

    await refresh()
    resetForm()
  } catch (err) {
    console.error("❌ Error al enviar formulario:", err)
    Swal.fire("Error", "No se puedo crear o actulaizar el tour", "error")
  }
}

/**
 * Loads a tour into the form for editing
 */
function editTour(tour: Tour) {
  form.value = { ...tour }
  editId.value = tour._id || null
  showForm.value = true
}

/**
 * Handles deletion of a tour after confirmation
 */
async function handleDeleteTour(id: string) {
  const result = await Swal.fire({
    title: "Eliminar este paquete turístico?",
    text: "Esgta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3F51B5",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminarlo",
  })

  if (result.isConfirmed) {
    await deleteTour(id)
    await refresh()
    Swal.fire("Eliminado", "Paquete turístico eliminado con éxito", "success")
  }
}

/**
 * Resets the form fields and modal state
 */
function resetForm() {
  form.value = {
    title: "",
    description: "",
    price: 0,
    status: "available",
    host: user._id,
    imageUrls: [],
  }
  selectedImages.value = []
  editId.value = null
  showForm.value = false
}

/**
 * Captures uploaded images from the file input
 */
function handleImageUpload(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    selectedImages.value = Array.from(files)
  }
}

/**
 * Loads all tours from backend
 */
async function refresh() {
  allTours.value = await getTours()
}

/**
 * Toggles form visibility and resets if closing
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
  background-color: #3f51b5;
}
.text-primary {
  color: #3f51b5;
}
.hover\:bg-hover:hover {
  background-color: #303f9f;
}
</style>
