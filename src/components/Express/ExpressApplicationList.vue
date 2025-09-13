<script setup>
import api from '@/lib/api'
import { onMounted, ref } from 'vue'

const data = ref([])

onMounted(async () => {
  try {
    const res = await api.get('/express-list')
    console.log('express data', res.data)
    data.value = res.data?.list || []
    console.log('f', data.value)
  } catch (error) {
    console.log(error)
  }
})

const Header = [
  { text: ' ID', value: 'id' },
  { text: 'Student Details', value: 'details' },
  { text: 'University', value: 'univeristy_course' },
  { text: 'Status', value: 'status' },

  { text: 'Date', value: 'date' },
  { text: 'Action', value: 'number' },
]
</script>

<template>
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
    <template #item-details="{ full_name, email }">
      <div>
        <strong>{{ full_name }}</strong
        ><br />
        <span class="text-sm text-gray-500">{{ email }}</span>
      </div>
    </template>
    <template #item-univeristy_course="{ university, course, intake }">
      <div>
        <strong>{{ university }}</strong
        ><br />
        <span class="text-sm text-gray-500">{{ course }} - {{ intake }}</span>
      </div>
    </template>

    <template #item-date="{ created_at }">
      <div>
        <span class="text-[#FFA90C] text-sm">{{
          new Date(created_at).toLocaleDateString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
        }}</span>
      </div>
    </template>

    <template #item-number="{ id, name, email, password, role_id, branch_id, parent_id, mobile }">
      <button
        @click="opeEditModal({ id, name, email, password, role_id, branch_id, parent_id, mobile })"
        class="bg-red-700 my-2 px-4 py-2 rounded-lg text-white font-bold"
      >
        Edit
      </button>
    </template>
  </EasyDataTable>
</template>

<style scoped></style>
