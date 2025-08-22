<script setup>
import api from '@/lib/api'
import { computed, onMounted, ref, watch } from 'vue'
import { createToaster } from '@meforma/vue-toaster'
const toast = createToaster()

const loading = ref(true)
const error = ref(null)

const showLeadModal = ref(false)
const selectedLeadType = ref('')
const selectedCountry = ref('')
const selectedEvent = ref('')
const selectedBranch = ref('')
const selectedFile = ref(null)
const branches = ref([])
const events = ref([])
const countries = ref([])

onMounted(async () => {
  try {
    const [branchRes, eventRes, countryRes] = await Promise.all([
      api.get('/branch-list'),
      api.get('/event-list'),
      api.get('/country-list'),
    ])

    branches.value = branchRes?.data?.list || []

    events.value = eventRes?.data?.list || []

    countries.value = countryRes?.data?.list || []
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

const handleFileChange = (e) => {
  selectedFile.value = e.target.files[0]
}

const uploadLeads = async () => {
  if (!selectedFile.value) {
    toast.error('Please Select a file')
  }

  if (!selectedLeadType.value || !selectedBranch.value) {
    toast.error('Please select required fields')
    return
  }

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('lead_type', Number(selectedLeadType.value))
    formData.append('lead_branch', Number(selectedBranch.value))

    if (selectedCountry.value) formData.append('lead_country', Number(selectedCountry.value))
    if (selectedEvent.value) formData.append('event_id', Number(selectedEvent.value))

    const response = await api.post('/upload-lead', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (response.data.status === 'success') {
      toast.success('Leads Upload Operation Success')
      selectedLeadType.value = ''
      selectedCountry.value = ''
      selectedEvent.value = ''
      selectedBranch.value = ''
      selectedFile.value = null
    } else {
      toast.error(res.data.message || 'Something went wrong')
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message)
  }
}
</script>

<template>
  <div class="p-7 border border-gray-200 rounded-lg shadow-2xl">
    <p class="text-lg text-gray-600 font-semibold">Select Lead Location</p>

    <div>
      <select
        class="border border-gray-200 py-2 mt-5 outline-none focus:border-[#7367F0] rounded-lg text-black w-3/12 px-2"
        v-model="selectedLeadType"
      >
        <option value="">Select Lead Type</option>

        <option value="1">Social</option>
        <option value="2">Event</option>
      </select>
    </div>

    <div v-if="selectedLeadType === '2'" class="flex gap-5">
      <select
        v-model="selectedEvent"
        class="border border-gray-200 py-2 mt-5 outline-none focus:border-[#7367F0] rounded-lg text-black w-3/12 px-2"
      >
        <option value="">Select Event</option>
        <option v-for="e in events" :key="e.id" :value="e.id">{{ e.name }}</option>
      </select>

      <select
        v-model="selectedBranch"
        class="border border-gray-200 py-2 mt-5 outline-none focus:border-[#7367F0] rounded-lg text-black w-3/12 px-2"
      >
        <option value="">Select Branch</option>
        <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
      </select>
    </div>
    <div v-if="selectedLeadType === '1'" class="flex gap-5">
      <select
        v-model="selectedCountry"
        class="border border-gray-200 py-2 mt-5 outline-none focus:border-[#7367F0] rounded-lg text-black w-3/12 px-2"
      >
        <option value="">Select Lead Country</option>
        <option v-for="c in countries" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>

      <select
        v-model="selectedBranch"
        class="border border-gray-200 py-2 mt-5 outline-none focus:border-[#7367F0] rounded-lg text-black w-3/12 px-2"
      >
        <option value="">Select Branch</option>
        <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
      </select>
    </div>

    <div v-if="selectedLeadType && selectedBranch && (selectedCountry || selectedEvent)">
      <input
        @change="handleFileChange"
        class="w-2/6 border border-gray-300 mt-5 p-2 rounded-lg"
        type="file"
      />
    </div>

    <div class="flex justify-center">
      <button
        @click="uploadLeads"
        class="mt-5 items-center cursor-pointer px-5 py-2 bg-[#7367f0] rounded block text-white"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<style scoped></style>
