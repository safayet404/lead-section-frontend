<script setup>
import api from '@/lib/api'
import { reactive, ref } from 'vue'

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({})
const processing = ref(false)

async function submit() {
  processing.value = true
  errors.email = ''
  errors.password = ''

  try {
    const response = await api.post('/login', form)
    if (response.data.status === 'success') {
      window.location.href = '/'
    } else {
      console.error('Login failed:', response.data.message)
    }
  } catch (error) {
    console.error('Login error:', error)
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors)
    }
  } finally {
    form.password = ''
    processing.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
        <form @submit.prevent="submit">
          <h4 class="text-2xl font-bold text-gray-800">SIGN IN</h4>
          <br />

          <!-- Email -->
          <input
            id="email"
            v-model="form.email"
            placeholder="User Email"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#675DD8] focus:border-[#675DD8]"
            type="email"
          />
          <div v-if="errors.email" class="text-red-500 text-sm mt-1">
            {{ errors.email }}
          </div>

          <br />

          <!-- Password -->
          <input
            id="password"
            v-model="form.password"
            placeholder="User Password"
            class="w-full px-4 py-2 mt-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#675DD8] focus:border-[#675DD8]"
            type="password"
          />
          <div v-if="errors.password" class="text-red-500 text-sm mt-1">
            {{ errors.password }}
          </div>

          <br />

          <!-- Submit -->
          <button
            type="submit"
            class="w-full bg-[#675DD8] mt-5 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
            :disabled="processing"
          >
            {{ processing ? 'Logging in...' : 'Next' }}
          </button>

          <hr class="my-6 border-gray-300" />

          <!-- Links -->
          <div class="flex justify-end space-x-4 text-sm">
            <a class="text-green-600 hover:underline" href="/registration"> Sign Up </a>
            <span>|</span>
            <a class="text-green-600 hover:underline" href="/send-otp-page"> Forget Password </a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.4s ease-in-out;
}
</style>
