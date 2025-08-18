<script setup>
import api from '@/lib/api'
import { onMounted, ref } from 'vue'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import { createToaster } from '@meforma/vue-toaster'
const toast = createToaster()
const data = ref([])
const loading = ref(true)
const error = ref(null)
const searchValue = ref('')
const searchField = ['id', 'name']

const Header = [
  { text: ' ID', value: 'id' },
  { text: 'Name', value: 'name' },
  { text: 'Color Code', value: 'color_details' },
  { text: 'Lead Health Type', value: 'health_details' },
  { text: 'Action', value: 'number' },
]

const fetchData = async () => {
  loading.value = true
  try {
    const response = await api.get('/status-list')
    data.value = response?.data?.list || []
  } catch (err) {
    error.value = err.message || 'Failed to load events'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

// Create Modal
const showModal = ref(false)

const entityName = ref('')
const colorCode = ref('')
const healthType = ref('')
const statusMessage = ref('')

const entityEditing = ref(null)
const modalTitle = ref('Add New Status')

const openCreateModal = () => {
  resetModalState()
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetModalState()
}

const opeEditModal = (entity) => {
  entityEditing.value = { ...entity }
  entityName.value = entityEditing.value.name
  colorCode.value = entityEditing.value.color_code
  healthType.value = entityEditing.value.health_type
  modalTitle.value = 'Edit Status'
  showModal.value = true
}

const resetModalState = () => {
  entityName.value = ''
  entityEditing.value = null
  modalTitle.value = 'Add New Status'
}

const handleEntitySubmission = async () => {
  if (!entityName.value.trim()) {
    statusMessage.value = 'Status name can not be empty'
    return
  }

  try {
    let response

    if (entityEditing.value) {
      const payload = {
        id: entityEditing.value.id,
        name: entityName.value,
        color_code: colorCode.value,
        health_type: healthType.value,
      }
      response = await api.post('/status-update', payload)
    } else {
      const payload = {
        name: entityName.value,
        color_code: colorCode.value,
        health_type: healthType.value,
      }
      response = await api.post('/create-status', payload)
    }

    if (response.data.status === 'success') {
      entityName.value = ''
      colorCode.value = ''
      showModal.value = false
      toast.success('Operation success')
      await fetchData()
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
          Add New Status
        </button>
      </div>
    </div>

    <EasyDataTable
      buttons-pagination
      alternating
      :headers="Header"
      :items="data"
      :rows-per-page="10"
      :search-field="searchField"
      :search-value="searchValue"
    >
      <template #item-color_details="{ color_code }">
        <div class="flex gap-2">
          <input class="h-10 w-10 rounded-xl" type="color" :value="color_code" />
          <strong class="my-auto">{{ color_code }}</strong>
        </div>
      </template>
      <template #item-health_details="{ health_type }">
        <div class="flex gap-2">
          <p
            class="px-2 font-semibold py-1 text-base rounded-lg"
            :style="{
              color: health_type === 'Hot' ? 'red' : health_type === 'Warm' ? 'orange' : '#00BAD0',
              backgroundColor:
                health_type === 'Hot' ? '#FFE2E3' : health_type === 'Warm' ? '#FFEFE1' : '#D6F4F7',
            }"
          >
            {{ health_type }}
          </p>
        </div>
      </template>

      <template #item-number="{ id, name, color_code, health_type }">
        <button
          @click="opeEditModal({ id, name, color_code, health_type })"
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

          <form @submit.prevent="handleEntitySubmission">
            <input
              v-model="entityName"
              class="mt-5 border w-full rounded p-2 border-gray-500"
              placeholder="Enter the status name"
            />

            <input
              v-model="colorCode"
              class="mt-5 border w-full rounded p-2 border-gray-500"
              placeholder="Enter the color code"
            />

            <input
              v-model="healthType"
              class="mt-5 border w-full rounded p-2 border-gray-500"
              placeholder="Enter the health type"
            />

            <div class="flex justify-end gap-2 mt-5">
              <button
                type="submit"
                class="bg-[#AD46FF] py-2 px-4 rounded-lg text-white cursor-pointer"
              >
                {{ entityEditing ? 'Save Changes' : 'Add' }}
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
