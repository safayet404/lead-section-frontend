<script setup>
import api from '@/lib/api'
import { onMounted, ref, computed } from 'vue'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

const roles = ref([])
const loading = ref(true)
const error = ref(null)

const searchValue = ref('')
const searchField = 'name'

const Header = [
  { text: 'ID', value: 'id' },
  { text: 'Role Name', value: 'name' },
  { text: 'Total User in this role', value: 'users_count' },
  { text: 'Actions', value: 'number' },
]

onMounted(async () => {
  try {
    const response = await api.get('/role-list')

    roles.value = response?.data?.list || []
    console.log(response.data.list)
  } catch (err) {
    error.value = err.message || 'Failed to load roles'
  } finally {
    loading.value = false
  }
})

const Item = computed(() =>
  filteredRoles.value.map((role, index) => ({
    ...role,
    number: role.id,
    rowNumber: index + 1,
  })),
)

const DeleteClick = async (id) => {
  if (!confirm('Are you sure you want to delete this role?')) return

  try {
    await api.delete(`/role-delete/${id}`)
    roles.value = roles.value.filter((role) => role.id !== id)
    alert('Role deleted successfully')
  } catch (err) {
    alert('Failed to delete role')
  }
}
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-danger">{{ error }}</div>
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
        :items="roles"
        :rows-per-page="10"
        :search-field="searchField"
        :search-value="searchValue"
        table-class-name="customize-table"
      >
        <template #item-number="{ id }">
          <button @click="DeleteClick(id)" class="btn btn-danger btn-sm">Delete</button>
        </template>
      </EasyDataTable>
    </div>
  </div>
</template>

<style scoped>
.form-control {
  max-width: 300px;
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
