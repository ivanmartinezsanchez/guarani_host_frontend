<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Header -->
    <h1 class="text-3xl font-bold text-primary mb-6 text-center">My Tour Packages</h1>

    <!-- Tour List Section -->
    <section class="mb-10">
      <div class="flex justify-between items-center flex-wrap gap-4 mb-4">
        <h2 class="text-xl font-semibold">Published Packages</h2>
        <button @click="toggleForm" class="bg-primary hover:bg-hover text-white px-4 py-2 rounded transition">
          {{ showForm ? 'Close Form' : 'New Package' }}
        </button>
      </div>

      <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md overflow-x-auto">
        <table class="min-w-full table-auto text-sm">
          <thead class="bg-gray-100 dark:bg-gray-700 text-left">
            <tr>
              <th class="px-4 py-2">Title</th>
              <th class="px-4 py-2">Description</th>
              <th class="px-4 py-2">Price</th>
              <th class="px-4 py-2">Status</th>
              <th class="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="tour in myTours"
              :key="tour._id"
              class="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <td class="px-4 py-2">{{ tour.title }}</td>
              <td class="px-4 py-2">{{ tour.description }}</td>
              <td class="px-4 py-2">${{ tour.price }}</td>
              <td class="px-4 py-2 capitalize">{{ tour.status }}</td>
              <td class="px-4 py-2 flex gap-2">
                <button @click="editTour(tour)" class="text-blue-500 hover:text-blue-700">Edit</button>
                <button @click="confirmDelete(tour._id!)" class="text-red-500 hover:text-red-700">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Tour Form Section -->
    <section v-if="showForm" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 class="text-xl font-semibold mb-4">{{ editId ? 'Edit' : 'New' }} Package</h2>
      <form @submit.prevent="submitForm" class="space-y-4">
        <input v-model="form.title" type="text" placeholder="Title" class="input" required />
        <textarea v-model="form.description" placeholder="Description" class="input" rows="3" required />
        <input v-model.number="form.price" type="number" placeholder="Price" class="input" required />
        <select v-model="form.status" class="input" required>
          <option value="available">Available</option>
          <option value="upcoming">Upcoming</option>
          <option value="sold out">Sold Out</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <div class="flex justify-end gap-3">
          <button type="button" @click="resetForm" class="text-gray-600 dark:text-white hover:underline">Cancel</button>
          <button type="submit" class="bg-primary hover:bg-hover text-white px-6 py-2 rounded transition">
            {{ editId ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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

// Default form
const form = ref<Partial<Tour>>({
  title: '',
  description: '',
  price: 0,
  status: 'available',
  imageUrls: [],
  host: user._id
})

// Filtered by host
const myTours = computed(() => allTours.value.filter(t => t.host === user._id))

// Load on mount
onMounted(async () => {
  await refreshTours()
})

// Load from backend
async function refreshTours() {
  allTours.value = await getTours()
}

// Toggle form
function toggleForm() {
  showForm.value = !showForm.value
  if (!showForm.value) resetForm()
}

// Submit tour
async function submitForm() {
  const data: Tour = {
    title: form.value.title ?? '',
    description: form.value.description ?? '',
    price: form.value.price ?? 0,
    status: form.value.status ?? 'available',
    imageUrls: form.value.imageUrls ?? [],
    host: user._id,
    paymentStatus: 'pending'
  }

  try {
    if (!editId.value) {
      await createTour(data)
      Swal.fire('Created', 'Tour created successfully', 'success')
    } else {
      await updateTour(editId.value, data)
      Swal.fire('Updated', 'Tour updated successfully', 'success')
    }
    await refreshTours()
    resetForm()
  } catch (error) {
    console.error('❌ Tour error:', error)
    Swal.fire('Error', 'Something went wrong', 'error')
  }
}

// Edit
function editTour(tour: Tour) {
  form.value = { ...tour }
  editId.value = tour._id ?? null
  showForm.value = true
}

// Delete
async function confirmDelete(id: string) {
  const result = await Swal.fire({
    title: 'Delete this tour?',
    text: 'This action cannot be undone',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3F51B5',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete'
  })

  if (result.isConfirmed) {
    await deleteTour(id)
    await refreshTours()
    Swal.fire('Deleted', 'Tour deleted successfully', 'success')
  }
}

// Reset form
function resetForm() {
  showForm.value = false
  editId.value = null
  form.value = {
    title: '',
    description: '',
    price: 0,
    status: 'available',
    imageUrls: [],
    host: user._id
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
