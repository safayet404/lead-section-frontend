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
const searchField = ['id', 'student.email']

const Header = [
  { text: ' ID', value: 'id' },
  { text: 'Ageing', value: 'ageing' },
  { text: 'Status', value: 'application_status.name' },
  { text: 'Student Details', value: 'student-details' },
  { text: 'University/Course Details', value: 'university-details' },
  { text: 'Application Officer', value: 'ageing' },
  { text: 'Application Control Officer', value: 'ageing' },
  { text: 'Channel Partner/Created By', value: 'created-by' },
  { text: 'Date Added', value: 'created_at' },
  { text: 'Action', value: 'number' },
]

const fetchData = async () => {
  loading.value = true
  try {
    const response = await api.get('/all-application')
    data.value = response?.data || []

    console.log('application data', data.value)
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
const statusMessage = ref('')

const entityEditing = ref(null)
const modalTitle = ref('Add New Country')

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
  modalTitle.value = 'Edit Country'
  showModal.value = true
}

const resetModalState = () => {
  entityName.value = ''
  entityEditing.value = null
  modalTitle.value = 'Add New Branch'
}

const handleEntitySubmission = async () => {
  if (!entityName.value.trim()) {
    statusMessage.value = 'Branch name can not be empty'
    return
  }

  try {
    let response

    if (entityEditing.value) {
      const payload = {
        id: entityEditing.value.id,
        name: entityName.value,
      }
      response = await api.put('/branch-update', payload)
    } else {
      response = await api.post('/create-branch', { name: entityName.value })
    }

    if (response.data.status === 'success') {
      entityName.value = ''
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
          Add New Branch
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
      table-class-name="customize-table"
    >
      <template #item-student-details="{ student }">
        <div>
          <p>{{ student.first_name }} {{ student.last_name }}</p>
          <p>{{ student.email }}</p>
        </div>
      </template>
      <template #item-university-details="{ university, course, intake }">
        <div class="py-2">
          <p>{{ university.name }}</p>
          <p>{{ course.name }}</p>
          <p>{{ intake.name }}</p>
        </div>
      </template>
      <template #item-created-by="{ user, channel_partner }">
        <p v-if="channel_partner">
          {{ channel_partner.email }} <br />
          {{ channel_partner.name }}
        </p>
        <p v-else>
          {{ user.name }} <br />
          {{ user.email }}
        </p>
      </template>

      <template #item-created_at="{ created_at }">
        <div class="py-2">
          <span class="text-[#FFA90C] text-sm">{{
            new Date(created_at).toLocaleDateString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
          }}</span>
        </div>
      </template>
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

          <form @submit.prevent="handleEntitySubmission">
            <input
              v-model="entityName"
              class="mt-5 border w-full rounded p-2 border-gray-500"
              placeholder="Enter the value"
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

.customize-table {
  --easy-table-header-background-color: #8176f1;
  --easy-table-header-font-color: #fff;
  --easy-table-header-height: 70px;
  --easy-table-header-font-size: 15px;
  --easy-table-body: 15px;

  --easy-table-scrollbar-track-color: #2d3a4f;
  --easy-table-scrollbar-color: #2d3a4f;
  --easy-table-scrollbar-thumb-color: #4c5d7a;
  --easy-table-scrollbar-corner-color: #2d3a4f;
}
</style>
