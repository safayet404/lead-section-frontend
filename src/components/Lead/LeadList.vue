<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/lib/api'
import EasyDataTable from 'vue3-easy-data-table'

// Table data
const leads = ref([])
const loading = ref(true)
const error = ref(null)

// Dropdown lists
const users = ref([])
const statuses = ref([])
const branches = ref([])
const leadHealthTypes = ref(['Good', 'Average', 'Poor']) // Example static
const leadTypes = ref([])
const events = ref([])

// Selected filters
const selectedUser = ref('')
const selectedLeadHealth = ref('')
const selectedAssignedStatus = ref('')
const selectedLeadStatus = ref('')
const selectedLeadType = ref('')
const selectedEvent = ref('')
const selectedCountry = ref('')
const selectedBranch = ref('')
const selectedDate = ref('')

// Search
const searchValue = ref('')
const searchField = 'name'

// Table headers
const headers = [
  { text: 'ID', value: 'id' },
  { text: 'Lead Country', value: 'interested_country' },
  { text: 'Current Status', value: 'status.name' },
  { text: 'Contact Information', value: 'contact_info' },
  { text: 'Assignment Details', value: 'assignment_details' },
  { text: 'Assigned Status', value: 'assigned_status' },
  { text: 'Date', value: 'created' },
  { text: 'Actions', value: 'id' },
]

const totalLeads = computed(() => leads.value.length)
const activeLeads = computed(
  () => leads.value.filter((l) => l.status?.name?.toLowerCase().includes('active')).length,
)
const pendingCalls = computed(
  () => leads.value.filter((l) => l.status?.name?.toLowerCase().includes('pending')).length,
)

// Fetch initial data
onMounted(async () => {
  try {
    const [leadRes, userRes, statusRes, branchRes, eventRes, typeRes] = await Promise.all([
      api.get('/lead-list'),
      api.get('/user-list'),
      api.get('/status-list'),
      api.get('/branch-list'),
      api.get('/event-list'),
      api.get('/type-list'),
    ])

    leads.value = leadRes?.data?.list || []
    users.value = userRes?.data?.list || []

    console.log('lead', leadRes?.data?.list)

    statuses.value = statusRes?.data?.list || []

    branches.value = branchRes?.data?.list || []

    events.value = eventRes?.data?.list || []
    leadTypes.value = typeRes?.data?.list || []
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

// Filter leads
const filteredLeads = computed(() => {
  return leads.value.filter((l) => {
    return (
      (!selectedUser.value || l.user?.id == selectedUser.value) &&
      (!selectedLeadHealth.value || l.lead_health_type === selectedLeadHealth.value) &&
      (!selectedAssignedStatus.value || l.assigned_status === selectedAssignedStatus.value) &&
      (!selectedLeadStatus.value || l.status?.id == selectedLeadStatus.value) &&
      (!selectedLeadType.value || l.type?.id == selectedLeadType.value) &&
      (!selectedEvent.value || l.event?.id == selectedEvent.value) &&
      (!selectedCountry.value || l.interested_country === selectedCountry.value) &&
      (!selectedBranch.value || l.user?.branch?.id == selectedBranch.value) &&
      (!selectedDate.value || l.assigned_date === selectedDate.value)
    )
  })
})
</script>

<template>
  <div class="p-4">
    <!-- Filter Form -->
    <div class="grid grid-cols-4 gap-4 bg-white p-4 rounded shadow">
      <select v-model="selectedUser" class="border p-2 text-black rounded">
        <option value="">Select User</option>
        <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }} - {{ u.email }}</option>
      </select>

      <select v-model="selectedLeadHealth" class="border p-2 rounded">
        <option value="">Select Health Type</option>
        <option v-for="h in leadHealthTypes" :key="h" :value="h">{{ h }}</option>
      </select>

      <select v-model="selectedAssignedStatus" class="border p-2 rounded">
        <option value="">Select Assigned Status</option>
        <option value="Assigned">Assigned</option>
        <option value="Unassigned">Unassigned</option>
      </select>

      <select v-model="selectedLeadStatus" class="border p-2 rounded">
        <option value="">Select Lead Status</option>
        <option v-for="s in statuses" :key="s.id" :value="s.id">{{ s.name }}</option>
      </select>

      <select v-model="selectedLeadType" class="border p-2 rounded">
        <option value="">Select Lead Type</option>
        <option v-for="t in leadTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
      </select>

      <select v-model="selectedEvent" class="border p-2 rounded">
        <option value="">Select Event</option>
        <option v-for="e in events" :key="e.id" :value="e.id">{{ e.name }}</option>
      </select>

      <input
        v-model="selectedCountry"
        placeholder="Select Application Country"
        class="border p-2 rounded"
      />

      <select v-model="selectedBranch" class="border p-2 rounded">
        <option value="">Select Branch</option>
        <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
      </select>

      <input type="date" v-model="selectedDate" class="border p-2 rounded" />
    </div>

    <!-- Stats -->

    <div class="flex gap-4 mt-4">
      <div class="bg-purple-500 text-white p-4 rounded flex-1 text-center">
        <div class="text-lg font-bold">Total Leads</div>
        <div class="text-2xl">{{ totalLeads }}</div>
      </div>
      <div class="bg-green-500 text-white p-4 rounded flex-1 text-center">
        <div class="text-lg font-bold">Active Leads</div>
        <div class="text-2xl">{{ activeLeads }}</div>
      </div>
      <div class="bg-yellow-500 text-white p-4 rounded flex-1 text-center">
        <div class="text-lg font-bold">Pending Calls</div>
        <div class="text-2xl">{{ pendingCalls }}</div>
      </div>
    </div>

    <!-- Table -->
    <div v-if="loading" class="mt-4">Loading...</div>
    <div v-else-if="error" class="text-red-500 mt-4">{{ error }}</div>
    <div v-else class="mt-4">
      <EasyDataTable
        :headers="headers"
        :items="filteredLeads"
        :search-field="searchField"
        :search-value="searchValue"
        buttons-pagination
        alternating
      >
        <template #item-contact_info="{ name, phone, email }">
          <div>
            <strong>{{ name }}</strong
            ><br />
            📞 {{ phone }}<br />
            ✉️ {{ email }}
          </div>
        </template>

        <template #item-assignment_details="{ user }">
          <div v-if="user" class="py-5">
            <strong>{{ user?.name }}</strong>
            ( {{ user?.email }} ) <br />
            <br />
            Branch Name: {{ user?.branch?.name }}
          </div>
        </template>

        <template #item-assigned_status="{ user }">
          <div v-if="user" class="py-5">
            <strong>Assigned</strong>
          </div>
          <div v-else class="py-5">
            <strong>Unassigned</strong>
          </div>
        </template>

        <template #item-created="{ created_at }">
          {{
            new Date(created_at).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
            })
          }}
        </template>
      </EasyDataTable>
    </div>
  </div>
</template>
