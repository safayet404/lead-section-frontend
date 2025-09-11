<script setup>
import logo from '@/assets/sg-logo.png'
import api from '@/lib/api'
import { createToaster } from '@meforma/vue-toaster'
import { ref } from 'vue'
const toast = createToaster()

const countries = [
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', code: '+880' },
  { code: 'US', name: 'United States', flag: '🇺🇸', code: '+1' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', code: '+44' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', code: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', code: '+1' },
]

const form = ref({
  full_name: '',
  email: '',
  country_of_residence: '',
  whatsapp_number: '',
  country_to_apply: '',
  intake: '',
  course_type: '',
  university: '',
  course: '',
})

const resetForm = () => {
  // reset text fields
  form.value = {
    full_name: '',
    email: '',
    country_of_residence: '',
    whatsapp_number: '',
    country_to_apply: '',
    intake: '',
    course_type: '',
    university: '',
    course: '',
  }
  // reset files
  selectedFiles.value = []
  if (fileInput.value) fileInput.value.value = null
}

const fileInput = ref(null)
const selectedFiles = ref([])

const openFilePicker = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileChange = (event) => {
  selectedFiles.value = Array.from(event.target.files)
}

const submitApplication = async () => {
  try {
    const formData = new FormData()

    // append form fields
    Object.keys(form.value).forEach((key) => {
      formData.append(key, form.value[key])
    })

    // append files
    selectedFiles.value.forEach((file) => {
      formData.append('files[]', file)
    })

    const res = await api.post('/express-application', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (res.status == 201) {
      alert('✅ Application submitted successfully!')
      resetForm()
    }

    console.log(res.data)
  } catch (error) {
    console.error(error.response?.data || error.message)
    alert('❌ Failed to submit application')
  }
}
</script>

<template>
  <section
    class="w-full min-h-screen mx-auto"
    style="
      background-image:
        repeating-linear-gradient(0deg, transparent, transparent 98px, #eeedf9 100px),
        repeating-linear-gradient(90deg, transparent, transparent 98px, #eeedf9 100px);
      background-color: #f1f4f8;
    "
  >
    <div class="max-w-5xl rounded-2xl p-10 mx-auto">
      <div>
        <!-- Header -->
        <div class="mx-auto bg-[#7F41EF] rounded-t-xl overflow-hidden text-center relative">
          <div
            class="absolute inset-0 opacity-10"
            style="
              background-image: radial-gradient(circle, white 1px, transparent 1px);
              background-size: 20px 20px;
            "
          ></div>

          <div class="relative z-10">
            <img :src="logo" class="w-md mx-auto mt-5" alt="logo" />
            <h1 class="text-white text-2xl font-bold mb-4">Express Application</h1>
            <p class="text-white mb-4 text-base">
              Complete your application to get started with your academic journey
            </p>
          </div>
        </div>

        <!-- Form -->
        <form class="bg-white p-5" @submit.prevent="submitApplication">
          <!-- Personal Info -->
          <div class="rounded-lg border p-4 border-gray-300">
            <h1 class="text-xl border-b border-gray-300 font-medium pb-2">Personal Information</h1>

            <div class="mt-5">
              <label class="block text-sm mb-2">Full Name</label>
              <input
                v-model="form.full_name"
                class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                placeholder="Enter your full name here"
              />
            </div>

            <div class="flex justify-between gap-4">
              <div class="mt-5 w-full">
                <label class="block text-sm mb-2">Email Address</label>
                <input
                  v-model="form.email"
                  class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                  placeholder="your-mail@example.com"
                />
              </div>

              <div class="mt-5 w-full">
                <label class="block text-sm mb-2">Country of Residence</label>
                <input
                  v-model="form.country_of_residence"
                  class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                  list="country-list"
                  placeholder="Select the country"
                />
                <datalist id="country-list">
                  <option v-for="c in countries" :key="c.code" :value="c.name">
                    {{ c.name }}
                  </option>
                </datalist>
              </div>
            </div>

            <div class="mt-5 w-full">
              <label class="block text-sm mb-2">WhatsApp Number</label>
              <div class="flex gap-3">
                <select
                  class="border w-28 rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                >
                  <option v-for="c in countries" :key="c.code">{{ c.flag }} {{ c.code }}</option>
                </select>
                <input
                  v-model="form.whatsapp_number"
                  class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                  placeholder="Enter your valid WhatsApp number"
                />
              </div>
            </div>
          </div>

          <!-- Academic Preference -->
          <div class="rounded-lg border p-4 border-gray-300 mt-5">
            <h1 class="text-xl border-b border-gray-300 font-medium pb-2">Academic Preference</h1>

            <div class="flex justify-between gap-4">
              <div class="mt-5 w-1/2">
                <label class="block text-sm mb-2">Country to Apply</label>
                <input
                  v-model="form.country_to_apply"
                  class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                  placeholder="Enter the destination country"
                />
              </div>

              <div class="mt-5 w-1/2">
                <label class="block text-sm mb-2">Intake Period</label>
                <input
                  v-model="form.intake"
                  class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                  placeholder="Enter intake period (e.g. Fall 2025, Spring 2026)"
                />
              </div>
            </div>

            <div class="flex justify-between gap-4">
              <div class="mt-5 w-full">
                <label class="block text-sm mb-2">Course Type</label>
                <input
                  v-model="form.course_type"
                  class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                  placeholder="Enter course type"
                />
              </div>

              <div class="mt-5 w-full">
                <label class="block text-sm mb-2">University</label>
                <input
                  v-model="form.university"
                  class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                  placeholder="Enter the university name"
                />
              </div>
            </div>

            <div class="mt-5 w-full">
              <label class="block text-sm mb-2">Course Name</label>
              <input
                v-model="form.course"
                class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                placeholder="Enter the course name"
              />
            </div>
          </div>

          <!-- Required Documents -->
          <div class="rounded-lg border p-4 mt-5 border-gray-300">
            <h1 class="text-xl border-b border-gray-300 font-medium pb-2">Required Documents</h1>

            <div class="p-4 rounded-lg bg-[#D6F4F7] mt-5">
              <ul class="list-disc ml-3 text-[#00BAD0] space-y-4">
                <li>
                  <span class="font-semibold"> Passport Copy:</span> Clear scan of your passport's
                  main identification page
                </li>
                <li>
                  <span class="font-semibold"> Academic Transcripts:</span> Official transcripts
                  from all previous educational institutions
                </li>
                <li>
                  <span class="font-semibold"> English Proficiency:</span> IELTS, TOEFL, PTE, or
                  equivalent test results
                </li>
              </ul>
            </div>

            <div class="mt-5 border-2 border-dashed">
              <div
                class="mt-5 p-10 m-5 border border-dashed text-center cursor-pointer"
                @click="openFilePicker"
              >
                <div v-if="selectedFiles.length > 0">
                  <p class="text-sm font-medium text-gray-700 mb-2">Selected Files:</p>
                  <ul class="text-gray-600">
                    <li v-for="file in selectedFiles" :key="file.name" class="text-sm truncate">
                      {{ file.name }}
                    </li>
                  </ul>
                </div>
                <div v-else class="flex flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-4-4v-1a4 4 0 018 0v1a4 4 0 01-4 4zM13 19a4 4 0 01-4-4v-1a4 4 0 018 0v1a4 4 0 01-4 4zM13 13a4 4 0 01-4-4v-1a4 4 0 018 0v1a4 4 0 01-4 4z"
                    />
                  </svg>
                  <span class="text-gray-500 mt-2">Choose files to upload</span>
                </div>
              </div>

              <input
                type="file"
                class="hidden"
                multiple
                ref="fileInput"
                @change="handleFileChange"
              />
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 mx-auto justify-center mt-5">
            <button
              type="submit"
              class="bg-purple-700 text-white px-5 py-3 rounded-lg font-semibold"
            >
              Submit Application
            </button>
            <button
              type="reset"
              class="border border-purple-700 text-purple-700 px-5 py-3 rounded-lg font-semibold"
            >
              Reset Form
            </button>
          </div>
          <p class="text-center mt-4">
            By submitting this form, you agree to our terms of service and privacy policy.
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
