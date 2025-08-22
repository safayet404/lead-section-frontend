<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/lib/api'
import EasyDataTable from 'vue3-easy-data-table'
import { globalState } from '@/stores/globalState'
import { createToaster } from '@meforma/vue-toaster'
import { Users, Check, Clock, User, Clock1 } from 'lucide-vue-next'

const toast = createToaster()
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

const themeColor = '#8176F1'
// Search
const searchValue = ref('')
const searchField = ['id', 'name', 'email']

// Table headers
const headers = [
  { text: 'ID', value: 'id' },
  { text: 'Aging', value: 'aging' },
  { text: 'Lead Country', value: 'lead_country.name' },
  { text: 'Current Status', value: 'status_details', width: 250 },
  { text: 'Contact Information', value: 'contact_info' },
  { text: 'Assignment Details', value: 'assignment_details', width: 200 },
  { text: 'Manager Note', value: 'note_details', width: 300 },
  { text: 'Assigned Status', value: 'assign_type.name' },
  { text: 'Date', value: 'lead_date' },
  { text: 'Actions', value: 'number' },
]

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

const totalLeads = computed(() => filteredLeads.value.length)
const pendingCalls = computed(
  () => filteredLeads.value.filter((l) => l.status?.name?.toLowerCase().includes('pending')).length,
)
const leadsWithAging = computed(() => {
  const today = new Date()
  return filteredLeads.value.map((lead) => {
    const createdAt = new Date(lead.created_at)
    const diffTime = Math.abs(today - createdAt)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return {
      ...lead,
      aging: diffDays,
      is_new: lead.assigned_at
        ? new Date(lead.assigned_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        : false,
    }
  })
})

const userId = globalState.userId

const noteModal = ref(false)
const note = ref('')
const selectedLeadNote = ref(null)
const selectedUserNote = ref(null)

const openNoteModal = (note) => {
  selectedLeadNote.value = note.id
  selectedUserNote.value = userId
  noteModal.value = true
}

const closeModal = () => {
  noteModal.value = false
  selectedLeadNote.value = null
  selectedUserNote.value = null
  note.value = null
}

const addManagerNote = async () => {
  try {
    const payload = {
      user_id: selectedUserNote.value,
      lead_id: selectedLeadNote.value,
      note: note.value,
    }
    let response = await api.post('/create-note', payload)
    if (response.data.status === 'success') {
      toast.success('Manager Note Added')
      closeModal()

      const leadRes = await api.get('/lead-list')
      leads.value = leadRes?.data?.list || []
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="p-4">
    <!-- Filter Form -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white p-4 rounded shadow"
    >
      <select v-model="selectedUser" class="border border-gray-300 p-2 text-black rounded">
        <option value="">Select User</option>
        <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }} - {{ u.email }}</option>
      </select>

      <select v-model="selectedLeadHealth" class="border border-gray-300 p-2 rounded w-full">
        <option value="">Select Health Type</option>
        <option v-for="h in leadHealthTypes" :key="h" :value="h">{{ h }}</option>
      </select>

      <select v-model="selectedAssignedStatus" class="border border-gray-300 p-2 rounded">
        <option value="">Select Assigned Status</option>
        <option v-for="a in assignType" :key="a" :value="a.id">{{ a.name }}</option>
      </select>

      <select v-model="selectedLeadStatus" class="border border-gray-300 p-2 rounded">
        <option value="">Select Lead Status</option>
        <option v-for="s in statuses" :key="s.id" :value="s.id">{{ s.name }}</option>
      </select>

      <select v-model="selectedLeadType" class="border border-gray-300 p-2 rounded">
        <option value="">Select Lead Type</option>
        <option v-for="t in leadTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
      </select>

      <select v-model="selectedEvent" class="border border-gray-300 p-2 rounded">
        <option value="">Select Event</option>
        <option v-for="e in events" :key="e.id" :value="e.id">{{ e.name }}</option>
      </select>

      <select v-model="selectedCountry" class="border border-gray-300 p-2 rounded">
        <option value="">Select Country</option>
        <option v-for="c in leadCountry" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>

      <select v-model="selectedBranch" class="border border-gray-300 p-2 rounded">
        <option value="">Select Branch</option>
        <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
      </select>

      <input type="date" v-model="selectedDate" class="border border-gray-300 p-2 rounded" />
    </div>

    <!-- Table -->
    <div v-if="loading" class="mt-4">Loading...</div>
    <div v-else-if="error" class="text-red-500 mt-4">{{ error }}</div>
    <div v-else class="mt-4">
      <div class="flex mt-10 justify-between">
        <div class="my-auto">
          <input
            v-model="searchValue"
            type="text"
            placeholder="Search Leads..."
            class="border border-gray-300 p-1 rounded mb-3"
          />
        </div>

        <div class="flex flex-wrap gap-4 mb-4">
          <div class="bg-[#5853E9] text-white flex gap-3 px-5 py-2 rounded-xl">
            <div class="my-auto">
              <Users />
            </div>
            <div>
              <p class="text-base">Total Leads</p>
              <p class="font-semibold text-base">{{ totalLeads }}</p>
            </div>
          </div>
          <div class="bg-[#0C9F70] text-white flex gap-3 px-5 py-2 rounded-xl">
            <div class="my-auto">
              <Check />
            </div>
            <div>
              <p class="text-base">Active Leads</p>
              <p class="font-semibold text-base">{{ totalLeads - pendingCalls }}</p>
            </div>
          </div>
          <div class="bg-[#DD7F09] text-white flex gap-3 px-5 py-2 rounded-xl">
            <div class="my-auto">
              <Clock />
            </div>
            <div>
              <p class="text-base">Pending Leads</p>
              <p class="font-semibold text-base">{{ pendingCalls }}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <EasyDataTable
          :headers="headers"
          :items="leadsWithAging"
          :search-field="searchField"
          :search-value="searchValue"
          :theme-color="themeColor"
          buttons-pagination
          :loading="loading"
          alternating
          table-class-name="customize-table"
        >
          <template #loading>
            <img
              src="https://i.pinimg.com/originals/94/fd/2b/94fd2bf50097ade743220761f41693d5.gif"
              style="width: 100px; height: 80px"
            />
          </template>
          <template #item-status_details="{ status, id, is_new }">
            <div
              class="cursor-pointer flex gap-2 items-start"
              @click="openStatusModal(filteredLeads.find((l) => l.id === id))"
            >
              <strong
                class="rounded-2xl text-[10px] p-1"
                :style="{
                  color: status?.color_code,
                  border: `1px solid ${status?.color_code}`,
                }"
              >
                {{ status?.name }}
              </strong>

              <div v-if="is_new">
                <img class="w-7 h-7" alt="new" src="../../assets/new4.png" />
              </div>
              <br />
            </div>
          </template>
          <template
            #item-contact_info="{ name, phone, email, lead_country, ielts_or_english_test }"
          >
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

          <template #item-note_details="{ note }">
            <ul v-for="n in note" class="py-1">
              <li class="list-disc">
                <span class="font-semibold text-gray-600 text-sm"> {{ n.note }}</span> (
                <span class="text-[#0D81CF] text-sm"> {{ n.user?.name }}</span> ,
                <span class="text-[#FFA90C] text-sm">{{
                  new Date(n.created_at).toLocaleDateString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                }}</span>
                )
              </li>
            </ul>
          </template>
          <template #item-number="{ id }">
            <button
              @click="openNoteModal({ id })"
              class="px-3 py-2 cursor-pointer rounded-lg bg-purple-700 text-white font-semibold"
            >
              Add Note
            </button>
          </template>
        </EasyDataTable>
      </div>
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

    <Transition name="modal-fade">
      <div
        v-if="noteModal"
        class="fixed top-0 left-0 w-[100%] h-[100%] flex justify-center items-center z-50 bg-black/50"
      >
        <div class="bg-white rounded p-4 w-[500px] shadow-2xl relative">
          <h1 class="font-semibold">Manager Note Add</h1>
          <button
            @click="closeModal"
            class="absolute font-bold text-lg cursor-pointer top-2 text-red-700 right-3"
          >
            X
          </button>

          <form @submit.prevent="addManagerNote">
            <textarea
              v-model="note"
              class="mt-5 border w-full rounded p-2 h-32 border-gray-500"
              placeholder="Enter the note"
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
