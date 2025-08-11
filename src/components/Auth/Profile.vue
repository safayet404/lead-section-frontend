<script setup>
import api from '@/lib/api'
import { onMounted, ref } from 'vue'

const profile = ref([])
const loading = ref(true)
const error = ref(null)

async function logout() {
  try {
    const response = await api.post('/logout')

    if (response.data.status === 'success') {
      window.location.href = '/login'
    }
  } catch (error) {
    console.error('Login failed:', response.data.message)
  }
}

onMounted(async () => {
  try {
    const response = await api.get('/profile')

    profile.value = response?.data?.data || []

    console.log('values', response.data.data)
  } catch (error) {
    error.value = error.message || 'Failed to load profile data'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container px-4 text-xl">
    <div>
      <div v-if="loading">Loading...</div>
      <div v-else-if="error" class="text-red-600">{{ error }}</div>
      <div v-else>
        <h1>Name : {{ profile?.name }}</h1>
        <h1>Email : {{ profile?.email }}</h1>
        <h1>Role : {{ profile?.role?.name }}</h1>
        <h1>Mobile : {{ profile?.mobile }}</h1>
      </div>
    </div>

    <div>
      <button
        @click="logout"
        type="button"
        class="border px-9 py-2 mt-5 rounded-lg bg-red-700 text-white cursor-pointer text-lg"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<style scoped></style>
