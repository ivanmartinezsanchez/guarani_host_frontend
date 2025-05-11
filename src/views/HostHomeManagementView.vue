<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-primary text-center mb-8">My Properties</h1>

    <!-- Properties List -->
    <section class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Published Properties</h2>
        <button @click="showForm = !showForm" class="bg-primary hover:bg-hover text-white px-4 py-2 rounded">
          {{ showForm ? 'Close' : 'New Property' }}
        </button>
      </div>

      <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-md overflow-x-auto">
        <table class="min-w-full table-auto text-sm">
          <thead>
            <tr class="text-left bg-gray-100 dark:bg-gray-700">
              <th class="px-4 py-2">Title</th>
              <th class="px-4 py-2">City</th>
              <th class="px-4 py-2">Price</th>
              <th class="px-4 py-2">Available</th>
              <th class="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="home in myProperties" :key="home._id" class="border-b dark:border-gray-600">
              <td class="px-4 py-2">{{ home.title }}</td>
              <td class="px-4 py-2">{{ home.city }}</td>
              <td class="px-4 py-2">${{ home.pricePerNight }}</td>
              <td class="px-4 py-2">{{ home.available ? 'Yes' : 'No' }}</td>
              <td class="px-4 py-2 flex gap-2">
                <button @click="editProperty(home)" class="text-blue-500 hover:text-blue-700">Edit</button>
                <button @click="handleDeleteProperty(home._id!)" class="text-red-500 hover:text-red-700">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Property Form -->
    <section v-if="showForm" class="bg-white dark:bg-gray-800 p-6 rounded shadow-md">
      <h2 class="text-xl font-semibold mb-4">{{ editId ? 'Edit' : 'New' }} Property</h2>
      <form @submit.prevent="submitForm" class="space-y-4">
        <input v-model="form.title" type="text" placeholder="Title" class="input" required />
        <input v-model="form.city" type="text" placeholder="City" class="input" required />
        <input v-model="form.address" type="text" placeholder="Address" class="input" required />
        <input v-model.number="form.pricePerNight" type="number" placeholder="Price per night" class="input" required />
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="form.available" class="accent-primary" /> Available
        </label>
        <div class="flex justify-end gap-2">
          <button type="button" @click="resetForm" class="text-gray-500">Cancel</button>
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

// Initial form state
const form = ref<Property>({
  title: '',
  city: '',
  address: '',
  pricePerNight: 0,
  available: true,
  owner: user._id,
  images: []
})

// Filter properties that belong to the logged-in host
const myProperties = computed(() =>
  allHomes.value.filter(home => home.owner === user._id)
)

// Fetch all homes on mount
onMounted(async () => {
  allHomes.value = await getProperties()
})

/**
 * Submit form to create or update a property
 */
async function submitForm() {
  if (!editId.value) {
    await createProperty(form.value)
  } else {
    await updateProperty(editId.value, form.value)
  }
  await refresh()
  resetForm()
}

/**
 * Set form state to edit existing property
 */
function editProperty(home: Property) {
  form.value = { ...home }
  editId.value = home._id || null
  showForm.value = true
}

/**
 * Delete property by ID
 */
async function handleDeleteProperty(id: string) {
  if (confirm('Are you sure you want to delete this property?')) {
    await deleteProperty(id)
    await refresh()
  }
}

/**
 * Reset the form to default values
 */
function resetForm() {
  showForm.value = false
  editId.value = null
  form.value = {
    title: '',
    city: '',
    address: '',
    pricePerNight: 0,
    available: true,
    owner: user._id,
    images: []
  }
}

/**
 * Refresh the homes list
 */
async function refresh() {
  allHomes.value = await getProperties()
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
