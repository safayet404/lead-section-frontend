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
const leadHealthTypes = ref(['Hot', 'Warm', 'Cold'])
const leadTypes = ref([])
const events = ref([])
const assignType = ref([])
const leadCountry = ref([])

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

// Status Modal

const showStatusModal = ref(false)
const selectedLeadForStatus = ref(null)
const newStatus = ref(null)

const openStatusModal = (lead) => {
  selectedLeadForStatus.value = lead
  newStatus.value = lead.status?.id
  showStatusModal.value = true
}

const closeStatusModal = () => {
  showStatusModal.value = false
  selectedLeadForStatus.value = null
  newStatus.value = null
}

const updateLeadStatus = async () => {
  if (!selectedLeadForStatus.value || !newStatus.value) return

  try {
    const payload = {
      id: selectedLeadForStatus.value.id,
      status_id: newStatus.value,
    }
    const response = await api.post('/lead-update', payload)

    if (response?.data?.status === 'success') {
      const leadIndex = leads.value.findIndex((l) => l.id === selectedLeadForStatus.value.id)
      if (leadIndex !== -1) {
        const updatedStatus = statuses.value.find((s) => s.id === newStatus.value)
        if (updatedStatus) {
          leads.value[leadIndex].status = updatedStatus
        }
      }
      closeStatusModal()
    } else {
      console.error('API Error:', response?.data?.message)
    }
  } catch (error) {
    console.error('Failed to update lead status:', err)
  }
}
// Search
const searchValue = ref('')
const searchField = ['id', 'name', 'email']

// Table headers
const headers = [
  { text: 'ID', value: 'id' },
  { text: 'Lead Country', value: 'lead_country.name' },
  { text: 'Current Status', value: 'status_details' },
  { text: 'Contact Information', value: 'contact_info' },
  { text: 'Assignment Details', value: 'assignment_details' },
  { text: 'Assigned Status', value: 'assign_type.name' },
  { text: 'Date', value: 'lead_date' },
  { text: 'Actions', value: 'id' },
]

const totalLeads = computed(() => leads.value.length)
const pendingCalls = computed(
  () => leads.value.filter((l) => l.status?.name?.toLowerCase().includes('pending')).length,
)

// Fetch initial data
onMounted(async () => {
  try {
    const [leadRes, userRes, statusRes, branchRes, eventRes, typeRes, assignRes, countryRes] =
      await Promise.all([
        api.get('/lead-list'),
        api.get('/user-list'),
        api.get('/status-list'),
        api.get('/branch-list'),
        api.get('/event-list'),
        api.get('/type-list'),
        api.get('/assign-list'),
        api.get('/country-list'),
      ])

    leads.value = leadRes?.data?.list || []
    users.value = userRes?.data?.list || []

    console.log('lead', leadRes?.data?.list)

    statuses.value = statusRes?.data?.list || []

    branches.value = branchRes?.data?.list || []

    events.value = eventRes?.data?.list || []
    leadTypes.value = typeRes?.data?.list || []
    assignType.value = assignRes?.data?.list || []
    leadCountry.value = countryRes?.data?.list || []
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
      (!selectedLeadHealth.value || l.status?.health_type === selectedLeadHealth.value) &&
      (!selectedAssignedStatus.value || l.assign_type?.id == selectedAssignedStatus.value) &&
      (!selectedLeadStatus.value || l.status?.id == selectedLeadStatus.value) &&
      (!selectedLeadType.value || l.type?.id == selectedLeadType.value) &&
      (!selectedEvent.value || l.event?.id == selectedEvent.value) &&
      (!selectedCountry.value || l.lead_country?.id == selectedCountry.value) &&
      (!selectedBranch.value || l.lead_branch?.id == selectedBranch.value) &&
      (!selectedDate.value || l.lead_date === selectedDate.value)
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
        <!-- <option value="Assigned">Assigned</option>
        <option value="Unassigned">Unassigned</option> -->

        <option v-for="a in assignType" :key="a" :value="a.id">{{ a.name }}</option>
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

      <select v-model="selectedCountry" class="border p-2 rounded">
        <option value="">Select Country</option>
        <option v-for="c in leadCountry" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>

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
        <div class="text-2xl">{{ totalLeads - pendingCalls }}</div>
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
      <input
        v-model="searchValue"
        type="text"
        placeholder="Search Leads..."
        class="border p-1 rounded mb-3"
      />
      <EasyDataTable
        :headers="headers"
        :items="filteredLeads"
        :search-field="searchField"
        :search-value="searchValue"
        buttons-pagination
        alternating
      >
        <template #item-status_details="{ status, id }">
          <div
            class="cursor-pointer"
            @click="openStatusModal(filteredLeads.find((l) => l.id === id))"
          >
            <strong
              class="rounded-2xl p-2"
              :style="{
                color: status?.color_code,
                border: `1px solid ${status?.color_code}`,
              }"
              >{{ status?.name }}</strong
            >
            <br />
          </div>
        </template>
        <template #item-contact_info="{ name, phone, email, lead_country, ielts_or_english_test }">
          <div>
            <strong>{{ name }}</strong
            ><br />
            📞 {{ phone }}<br />
            ✉️ {{ email }} <br />
            🌍 {{ lead_country?.name }} <br />
            📖 {{ ielts_or_english_test }}
          </div>
        </template>

        <template #item-assignment_details="{ user }">
          <div v-if="user" class="py-5">
            <strong>{{ user?.name }}</strong>
            ( {{ user?.email }} ) <br />
            <br />
            Branch Name: {{ user?.branch?.name }}
          </div>

          <div v-else>Not Assigned Yet</div>
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

    <Transition name="modal-fade">
      <div v-if="showStatusModal" class="modal-overlay">
        <div class="modal-container">
          <h3 class="text-xl font-bold mb-4">Change Lead Status</h3>
          <p class="mb-4">
            Changing status for: <strong>{{ selectedLeadForStatus?.name }}</strong>
          </p>

          <div class="mb-4">
            <label for="newStatus" class="block text-sm font-medium py-2 text-gray-700"
              >Select New Status</label
            >
            <select
              id="newStatus"
              v-model="newStatus"
              class="mt-1 block w-full border-gray-300 p-2 rounded-md shadow-sm border focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option v-for="s in statuses" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>

          <div class="flex justify-end gap-2">
            <button
              @click="closeStatusModal"
              class="bg-red-600 py-2 px-4 rounded-lg text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              @click="updateLeadStatus"
              class="bg-[#AD46FF] py-2 px-4 rounded-lg text-white cursor-pointer"
            >
              Update
            </button>
          </div>
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
