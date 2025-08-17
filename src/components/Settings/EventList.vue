<script setup>
import api from '@/lib/api'
import { onMounted, ref, Transition } from 'vue'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import { createToaster } from '@meforma/vue-toaster'
const toast = createToaster()
const events = ref([])
const loading = ref(true)
const error = ref(null)
const searchValue = ref('')
const searchField = ['id', 'name']

const Header = [
  { text: 'ID', value: 'id' },
  { text: 'Name', value: 'name' },
  { text: 'Action', value: 'number' },
]

const fetchEvents = async () => {
  loading.value = true
  try {
    const response = await api.get('/event-list')
    events.value = response?.data?.list || []
  } catch (err) {
    error.value = err.message || 'Failed to load events'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchEvents()
})

// Create Event Modal
const showModal = ref(false)

const eventName = ref('')
const statusMessage = ref('')

const editingEvent = ref(null)
const modalTitle = ref('Add New Event')

const openCreateModal = () => {
  resetModalState()
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetModalState()
}

const opeEditModal = (event) => {
  editingEvent.value = { ...event }
  eventName.value = editingEvent.value.name
  modalTitle.value = 'Edit Event'
  showModal.value = true
}

const resetModalState = () => {
  eventName.value = ''
  editingEvent.value = null
  modalTitle.value = 'Add New Event'
}

const handleEventSubmission = async () => {
  if (!eventName.value.trim()) {
    statusMessage.value = 'Event name can not be empty'
    return
  }

  try {
    let response

    if (editingEvent.value) {
      const payload = {
        id: editingEvent.value.id,
        name: eventName.value,
      }
      response = await api.put('/event-update', payload)
    } else {
      response = await api.post('/create-event', { name: eventName.value })
    }

    if (response.data.status === 'success') {
      eventName.value = ''
      showModal.value = false
      toast.success('Operation success')
      await fetchEvents()
    } else {
      statusMessage.value = 'Failed to create event.'
      toast.error(statusMessage)
      console.error(response.data.message)
    }
  } catch (error) {
    statusMessage.value = 'An error occurred. Please try again.'
    console.error('There was an error creating the event:', error)
    if (error.response && error.response.status === 422) {
      console.error('Validation errors:', error.response.data.errors)
    }
  }
}
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <div class="flex justify-between">
      <div>
        <input
          v-model="searchValue"
          type="text"
          placeholder="Search Events..."
          class="border p-1 rounded mb-3"
        />
      </div>
      <div>
        <button
          @click="openCreateModal"
          class="bg-purple-700 cursor-pointer rounded-lg font-semibold text-white py-2 px-5"
        >
          Add New Event
        </button>
      </div>
    </div>

    <EasyDataTable
      buttons-pagination
      alternating
      :headers="Header"
      :items="events"
      :rows-per-page="10"
      :search-field="searchField"
      :search-value="searchValue"
    >
      <template #item-number="{ id, name }">
        <button
          @click="opeEditModal({ id, name })"
          class="bg-red-700 my-2 px-4 py-2 rounded-lg text-white font-bold"
        >
          Edit
        </button>
      </template>
    </EasyDataTable>

    <Transition name="modal-fade">
      <div
        v-if="showModal"
        class="fixed top-0 left-0 w-[100%] h-[100%] flex justify-center items-center z-50 bg-black/50"
      >
        <div class="bg-white rounded p-4 w-[500px] shadow-2xl relative">
          <h1 class="font-semibold">{{ modalTitle }}</h1>
          <button
            @click="closeModal"
            class="absolute font-bold text-lg cursor-pointer top-2 text-red-700 right-3"
          >
            X
          </button>

          <form @submit.prevent="handleEventSubmission">
            <input
              v-model="eventName"
              class="mt-5 border w-full rounded p-2 border-gray-500"
              placeholder="Enter Event Name"
            />

            <div class="flex justify-end gap-2 mt-5">
              <button
                type="submit"
                class="bg-[#AD46FF] py-2 px-4 rounded-lg text-white cursor-pointer"
              >
                {{ editingEvent ? 'Save Changes' : 'Add' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: all 0.3s ease-in-out;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
