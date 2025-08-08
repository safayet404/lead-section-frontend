<script setup>
import api from '@/lib/api'
import { onMounted, ref } from 'vue'

const roles = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await api.get('/role-list')
    roles.value = response?.data?.list
    console.log('checkl', response.data)
  } catch (error) {
    error.value = error.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <ul v-else>
      <li v-for="role in roles" :key="role.id">
        {{ role.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
