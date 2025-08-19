<script setup>
import api from '@/lib/api'
import { computed, onMounted, ref } from 'vue'
import { createToaster } from '@meforma/vue-toaster'
const toast = createToaster()

const loading = ref(true)
const error = ref(null)

const showLeadModal = ref(false)
const selectedLeadType = ref('')
const selectedCountry = ref('')
const selectedEvent = ref('')
const selectedBranch = ref('')
const selectedAssignBranch = ref('')

const branches = ref([])
const events = ref([])
const countries = ref([])
const groupUser = ref([])
const assignInputs = ref({})

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
    totalAvailable.value = res.data?.total_leads_available
    console.log(res.data)
    console.log('user', res.data.users)
    console.log('group users', res.data.groupUser)

    totalAssigned.value = 0

    groupUser.value = res.data.groupUser

    if (totalAvailable.value === 0) {
      showLeadModal.value = true
    }
  } else {
    console.log('preview failed')
  }
}

const buildAssignments = () => {
  const assignments = []

  for (const [userId, count] of Object.entries(assignInputs.value)) {
    if (count && Number(count) > 0) {
      assignments.push({
        user_id: Number(userId),
        leads: Number(count),
      })
    }
  }

  return assignments
}

const submitAssignments = async () => {
  const assignments = buildAssignments()

  const payload = {
    lead_type: Number(selectedLeadType.value),
    lead_country: selectedCountry.value ? Number(selectedCountry.value) : null,
    lead_branch: Number(selectedBranch.value),
    event_id: selectedEvent.value ? Number(selectedEvent.value) : null,
    assign_branch: Number(selectedAssignBranch.value),
    assignments,
  }

  try {
    const res = await api.post('/lead-assign', payload)
    if (res.data.status === 'success') {
      toast.success('Leads assigned successfullyy')
    } else {
      toast.error('Assignment failed.')
    }
  } catch (error) {
    toast.error(error.message || 'Error while assigning leads.')
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

    <div v-if="totalAvailable">
      <div class="flex flex-wrap mt-10 gap-3 text-white text-xl">
        <div class="bg-[#7367F0] p-5 flex-1 rounded text-center">
          <p>Total Leads Available</p>
          <p>{{ totalAvailable }}</p>
        </div>
        <div class="bg-[#28C76F] p-5 flex-1 rounded text-center">
          <p>Total Leads Assigned</p>
          <p>{{ totalAssigned }}</p>
        </div>
        <div class="bg-[#00BAD1] p-5 flex-1 rounded text-center">
          <p>Remaining Leads</p>
          <p>{{ remainingLeads }}</p>
        </div>
      </div>

      <!-- User Table -->

      <button
        @click="submitAssignments"
        class="flex justify-end px-4 py-2 bg-[#7367f0] text-white rounded"
      >
        Save Assign Lead
      </button>

      <table class="w-full rounded-l-lg mt-10">
        <thead class="text-center">
          <tr>
            <th class="p-2">Branch</th>
            <th class="p-2">Name</th>
            <th class="p-2">Email</th>
            <th class="p-2">Current Lead</th>
            <th class="p-2">Assigned Number of Leads</th>
          </tr>
        </thead>

        <tbody class="text-center text-gray-600">
          <tr v-for="user in groupUser" :key="user.id" class="border-t border-gray-200">
            <td class="p-2">{{ user.branch_name }}</td>
            <td class="p-2">{{ user.name }}</td>
            <td class="p-2">{{ user.email }}</td>
            <td class="p-2">
              <div class="py-2">
                <button class="bg-red-600 text-white text-sm font-medium rounded px-2 py-1">
                  Total Lead : {{ user.current_total }}
                </button>
              </div>
              <div
                class="bg-[#EAE8FD] text-left flex justify-between p-2 rounded"
                v-for="country in user.by_country"
              >
                <button class="bg-[#7367F0] text-sm text-white rounded px-2 py-1">
                  {{ country.country_name }}
                </button>
                <button class="bg-[#28C76F] rounded-[50%] px-3 text-white">
                  {{ country.total }}
                </button>
              </div>
            </td>

            <td class="p-2">
              <input
                type="number"
                v-model="assignInputs[user.id]"
                min="0"
                placeholder="Enter the lead number"
                class="w-[80%] border border-gray-200 rounded p-1"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="showLeadModal"
      class="fixed top-0 left-0 w-[100%] h-[100%] flex justify-center items-center z-50 bg-black/50"
    >
      <div class="bg-white w-2/6 rounded-lg p-4 text-center">
        <img class="w-50 h-40 mx-auto mt-5" src="../../assets/warning.png" alt="warning" />
        <p class="font-semibold text-gray-600 text-4xl mt-5">Warning !</p>
        <p class="mt-5 text-xl">No unassiged leads found</p>
        <div>
          <button
            @click="showLeadModal = false"
            class="bg-[#7367f0] text-white px-5 py-2 rounded mt-5 text-xl"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
