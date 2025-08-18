<script setup>
import api from '@/lib/api'
import { computed, onMounted, ref } from 'vue'
import { createToaster } from '@meforma/vue-toaster'
const toast = createToaster()

const loading = ref(true)
const error = ref(null)

const selectedLeadType = ref('')
const selectedCountry = ref('')
const selectedEvent = ref('')
const selectedBranch = ref('')
const selectedAssignBranch = ref('')

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

const totalAvailable = ref(0)
const totalAssigned = ref(0)
const remainingLeads = computed(() => Math.max(0, totalAvailable.value - totalAssigned.value))
const fetchAssignableLead = async () => {
  const payload = {
    lead_type: Number(selectedLeadType.value),
    lead_country: selectedCountry.value ? Number(selectedCountry.value) : null,
    lead_branch: Number(selectedBranch.value),
    event_id: selectedEvent.value ? Number(selectedEvent.value) : null,
    assign_branch: Number(selectedAssignBranch.value),
  }

  const res = await api.post('/lead-preview', payload)

  if (res.data.status === 'success') {
    console.log('data', res.data)

    console.log('lead', res.data.status)
    console.log('lead', res.data?.remaining_leads)
    totalAvailable.value = res.data?.total_leads_available

    totalAssigned.value = 0
  } else {
    console.log('preview failed')
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

    <div v-if="selectedLeadType && selectedBranch && (selectedEvent || selectedCountry)">
      <hr class="text-gray-300 mt-10 mb-10" />
      <p class="text-lg text-gray-600 font-semibold">
        Assign Leads to Counsellors(To complete this step, select a branch)
      </p>
      <div>
        <select
          v-model="selectedAssignBranch"
          class="border border-gray-200 py-2 mt-5 outline-none focus:border-[#7367F0] rounded-lg text-black w-3/12 px-2"
        >
          <option value="">Select Branch</option>
          <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
      </div>
    </div>

    <div v-if="selectedAssignBranch" class="flex justify-center">
      <button
        @click="fetchAssignableLead"
        class="mt-5 items-center cursor-pointer px-5 py-2 bg-[#7367f0] rounded block text-white"
      >
        Continue
      </button>
    </div>

    <div>
      <p>{{ totalAvailable }}</p>
      <p>{{ remainingLeads }}</p>
    </div>
  </div>
</template>

<style scoped></style>
