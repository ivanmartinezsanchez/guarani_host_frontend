<template>
  <Modal v-model="visible" @update:modelValue="emit('close')">
    <!-- Modal title -->
    <template #title>
      <div class="flex items-center gap-2 justify-center">
        <Home class="w-6 h-6 text-primary" aria-hidden="true" />
        <span class="text-lg font-semibold">
          {{ isEditMode ? 'Editar Propiedad' : 'Nueva Propiedad' }}
        </span>
      </div>
    </template>

    <!-- Property form -->
    <form @submit.prevent="handleSubmit" class="space-y-4 text-gray-800 dark:text-white">
      <FloatingInput v-model="form.title" id="title" label="Título" type="text" required />
      <FloatingTextArea v-model="form.description" id="description" label="Descripción" required />
      <FloatingInput v-model="form.address" id="address" label="Dirección" type="text" required />
      <FloatingInput v-model="form.city" id="city" label="Ciudad" type="text" required />
      <FloatingInput v-model="pricePerNightString" id="pricePerNight" label="Precio por noche (USD)" type="number" required />
      <FloatingInput v-model="guestsString" id="guests" label="Máx. personas" type="number" required />
      <FloatingInput v-model="checkInString" id="checkIn" label="Inicio de disponibilidad" type="date" required />
      <FloatingInput v-model="checkOutString" id="checkOut" label="Fin de disponibilidad" type="date" required />
      <FloatingInput v-model="amenitiesInput" id="amenities" label="Comodidades (separadas por coma)" type="text" />

      <!-- Upload Images -->
      <div>
        <label for="images" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Subir Imágenes
        </label>
        <input
          id="images"
          type="file"
          multiple
          accept="image/*"
          @change="handleImageSelection"
          class="w-full mt-1 text-sm bg-white rounded-md border file:bg-primary file:text-white file:px-4 file:py-2 file:rounded-md file:cursor-pointer dark:bg-gray-800 dark:text-gray-100"
        />
        <div class="grid grid-cols-3 gap-2 mt-2">
          <img
            v-for="(img, i) in previews"
            :key="i"
            :src="img"
            alt="Preview"
            class="w-full h-24 object-cover rounded-md shadow"
          />
        </div>
      </div>

      <!-- Estado de la Propiedad -->
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Estado de la Propiedad
        </label>
        <select
          v-model="form.status"
          id="status"
          required
          class="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 dark:text-white"
        >
          <option value="available">Disponible</option>
          <option value="booked">Reservado</option>
          <option value="confirmed">Confirmado</option>
          <option value="cancelled">Cancelado</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>

      <!-- Estado del Pago -->
      <div>
        <label for="paymentStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Estado del Pago
        </label>
        <select
          v-model="form.paymentStatus"
          id="paymentStatus"
          required
          class="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 dark:text-white"
        >
          <option value="pending">Pendiente</option>
          <option value="paid">Pagado</option>
          <option value="refunded">Reembolsado</option>
          <option value="failed">Fallido</option>
        </select>
      </div>

      <!-- Host ID (readonly) -->
      <FloatingInput
        v-if="form.host"
        v-model="form.host"
        id="host"
        label="ID del anfitrión"
        type="text"
        disabled
      />

      <!-- Action buttons -->
      <div class="flex justify-end items-center gap-3 mt-6">
        <!-- Cancel button -->
        <button
          type="button"
          @click="emit('close')"
          class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Cancelar
        </button>

        <!-- Submit button -->
        <button
          type="submit"
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-indigo-700 transition"
        >
          <SaveIcon class="w-5 h-5 !text-white" />
          {{ isEditMode ? 'Actualizar Propiedad' : 'Crear Propiedad' }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Home, SaveIcon } from 'lucide-vue-next'
import Modal from '@/components/ui/Modal.vue'
import FloatingInput from '@/components/ui/FloatingInput.vue'
import FloatingTextArea from '@/components/ui/FloatingTextArea.vue'
import type { Property } from '@/services/propertyService'
import { formatDateInput } from '@/utils/formDataHelpers'

const props = defineProps<{
  modelValue: boolean
  property?: Property
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: Property, files: File[]): void
}>()

const visible = ref(props.modelValue)
watch(() => props.modelValue, val => (visible.value = val))
watch(visible, val => { if (!val) emit('close') })

const isEditMode = computed(() => !!props.property)

const form = ref<Property>({
  _id: props.property?._id,
  title: props.property?.title || '',
  description: props.property?.description || '',
  address: props.property?.address || '',
  city: props.property?.city || '',
  pricePerNight: props.property?.pricePerNight || 0,
  checkIn: props.property?.checkIn || new Date().toISOString().slice(0, 10),
  checkOut: props.property?.checkOut || new Date().toISOString().slice(0, 10),
  guests: props.property?.guests || 1,
  amenities: props.property?.amenities || [],
  imageUrls: props.property?.imageUrls || [],
  paymentStatus: props.property?.paymentStatus || 'pending',
  paymentDetails: props.property?.paymentDetails || '',
  status: props.property?.status || 'available',
  host: props.property?.host || ''
})

const amenitiesInput = ref(form.value.amenities.join(', '))
const selectedFiles = ref<File[]>([])
const previews = ref<string[]>([...(props.property?.imageUrls || [])])

const pricePerNightString = computed({
  get: () => form.value.pricePerNight.toString(),
  set: val => form.value.pricePerNight = Number(val)
})

const guestsString = computed({
  get: () => form.value.guests.toString(),
  set: val => form.value.guests = Number(val)
})

const checkInString = computed({
  get: () => formatDateInput(form.value.checkIn),
  set: val => form.value.checkIn = val
})

const checkOutString = computed({
  get: () => formatDateInput(form.value.checkOut),
  set: val => form.value.checkOut = val
})

function handleImageSelection(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files) return
  selectedFiles.value = Array.from(target.files)
  previews.value = selectedFiles.value.map(file => URL.createObjectURL(file))
}

function handleSubmit() {
  form.value.amenities = amenitiesInput.value
    .split(',')
    .map(a => a.trim())
    .filter(Boolean)

  emit('submit', form.value, selectedFiles.value)
}
</script>
