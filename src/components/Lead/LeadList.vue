<script setup>
import api from '@/lib/api'
import { onMounted, ref } from 'vue'

import EasyDataTable from 'vue3-easy-data-table'
const leads = ref([])
const loading = ref(true)
const error = ref(null)

const searchValue = ref('')
const searchField = 'name'
const Header = [
  { text: 'ID', value: 'id' },

  { text: 'Current Status', value: 'status.name' },
  { text: 'Lead Country', value: 'interested_country' },
  { text: 'Contact Information', value: 'name' },
  { text: 'Managers Note', value: 'notes' },
  { text: 'Assignments Details', value: 'assignment_details' }, // ✅ custom slot
  { text: 'Assigned Status', value: 'assigned_status' },
  { text: 'Date', value: 'created_at' },
  { text: 'Actions', value: 'id' },
]

onMounted(async () => {
  try {
    const response = await api.get('/lead-list')

    console.log('leads', response?.data?.list)

    leads.value = response?.data?.list || []
  } catch (error) {
    error.value = error.message || 'Failed to load roles'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error" class="text-red-600">{{ error }}</div>
  <div v-else>
    <input
      v-model="searchValue"
      type="text"
      placeholder="Search roles..."
      class="form-control mb-3"
    />

    <EasyDataTable
      buttons-pagination
      alternating
      :headers="Header"
      :items="leads"
      :rows-per-page="10"
      :search-field="searchField"
      :search-value="searchValue"
    >
      <template #item-assignment_details="{ user }">
        <div v-if="user" class="py-5">
          <strong>{{ user?.name }}</strong>
          ( {{ user?.email }} ) <br />
          <br />
          Branch Name: {{ user?.branch?.name }}
        </div> </template
      ><template #item-assigned_status="{ user }">
        <div v-if="user" class="py-5">
          <strong>Assigned</strong>
        </div>
        <div v-else class="py-5">
          <strong>Unassigned</strong>
        </div>
      </template>

      <template #item-number="{ id }">
        <button @click="DeleteClick(id)" class="btn btn-danger btn-sm">Delete</button>
      </template>
    </EasyDataTable>
  </div>
</template>

<style scoped></style>
