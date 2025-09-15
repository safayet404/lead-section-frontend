<script setup>
import api from '@/lib/api'
import { onMounted, ref } from 'vue'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import { createToaster } from '@meforma/vue-toaster'
import ApplicationDetails from './ApplicationDetails.vue'
const toast = createToaster()
import { Eye } from 'lucide-vue-next'

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

const isModalOpen = ref(false)
const applicationId = ref('')
const modalDescription = ref('')
function openModal(id) {
  isModalOpen.value = true
  applicationId.value = id
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
          placeholder="Search Here..."
          class="border p-1 rounded mb-3"
        />
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
          @click="openModal(id)"
          class="bg-red-700 cursor-help my-2 px-2 rounded text-white font-bold"
        >
          <Eye />
        </button>
      </template>
    </EasyDataTable>

    <ApplicationDetails
      :show="isModalOpen"
      :applicationId="applicationId"
      :title="modalTitle"
      :description="modalDescription"
      :data="data"
      @close="isModalOpen = false"
    />
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
