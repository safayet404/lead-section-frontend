<script setup>
import logo from '@/assets/sg-logo.png'
import { ref } from 'vue'

const countries = [
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', code: '+880' },
  { code: 'US', name: 'United States', flag: '🇺🇸', code: '+1' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', code: '+44' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', code: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', code: '+1' },
]

const phoneCodes = [
  { code: '+880', country: 'BD', flag: '🇧🇩' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+1', country: 'CA', flag: '🇨🇦' },
]

const fileInput = ref(null)

// A reactive variable to store the selected files
const selectedFiles = ref([])

// Method to programmatically trigger a click on the hidden file input
const openFilePicker = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// Method to handle the change event when files are selected
const handleFileChange = (event) => {
  // Get the selected files from the event object
  selectedFiles.value = Array.from(event.target.files)
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
        <div class="mx-auto bg-[#7F41EF] rounded-t-xl overflow-hidden text-center relative">
          <!-- Box/Grid pattern overlay -->
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

        <form class="bg-white p-5">
          <!-- Personal Info -->
          <div class="rounded-lg border p-4 border-gray-300">
            <h1 class="text-xl border-b border-gray-300 font-medium pb-2">Personal Information</h1>

            <div class="mt-5">
              <label class="block text-sm mb-2">Full Name</label>
              <div>
                <input
                  class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                  placeholder="Enter you full name here"
                />
              </div>
            </div>

            <div class="flex justify-between gap-4">
              <div class="mt-5 w-full">
                <label class="block text-sm mb-2">Email Address</label>
                <div>
                  <input
                    class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                    placeholder="your-mail@example.com"
                  />
                </div>
              </div>

              <div class="mt-5 w-full">
                <label class="block text-sm mb-2">Country of Residence</label>
                <div>
                  <input
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
            </div>

            <div class="mt-5 w-full">
              <label class="block text-sm mb-2">WhatsApp Number</label>
              <div>
                <div class="flex gap-3">
                  <select
                    class="border w-28 rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                  >
                    <option v-for="c in countries">{{ c.flag }} {{ c.code }}</option>
                  </select>
                  <input
                    class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                    placeholder="Enter your valid whatsapp number"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- Academic Field -->
          <div class="rounded-lg border p-4 border-gray-300 mt-5">
            <h1 class="text-xl border-b border-gray-300 font-medium pb-2">Academic Preference</h1>

            <div class="flex justify-between gap-4">
              <div class="mt-5 w-1/2">
                <label class="block text-sm mb-2">Country to Apply</label>
                <div>
                  <input
                    class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                    placeholder="Enter the destination country"
                  />
                </div>
              </div>

              <div class="mt-5 w-1/2">
                <label class="block text-sm mb-2">Intake Period</label>
                <div>
                  <input
                    class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                    placeholder="Enter intake period(e.g. Fall 2025,Spring 2026)"
                  />
                </div>
              </div>
            </div>

            <div class="flex justify-between gap-4">
              <div class="mt-5 w-full">
                <label class="block text-sm mb-2">Course Type</label>
                <div>
                  <input
                    class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                    placeholder="Select the country"
                  />
                </div>
              </div>

              <div class="mt-5 w-full">
                <label class="block text-sm mb-2">University</label>
                <div>
                  <input
                    class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                    placeholder="Enter the university name"
                  />
                </div>
              </div>
            </div>

            <div class="mt-5 w-full">
              <label class="block text-sm mb-2">Course Name</label>
              <div>
                <input
                  class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                  placeholder="Enter the course name"
                />
              </div>
            </div>
          </div>
          <!-- Documents -->

          <div class="rounded-lg border p-4 mt-5 border-gray-300">
            <h1 class="text-xl border-b border-gray-300 font-medium pb-2">Required Documents</h1>

            <div class="p-4 rounded-lg bg-[#D6F4F7] mt-5">
              <ul class="list-disc ml-3 text-[#00BAD0] space-y-4">
                <li>
                  <span class="font-semibold"> Passport Copy :</span> Clear scan of your passport's
                  main identification page
                </li>
                <li>
                  <span class="font-semibold"> Academic Transcripts :</span>Official transcripts
                  from all previous educational institutions
                </li>
                <li>
                  <span class="font-semibold">English Proficiency :</span> IELTS, TOEFL, PTE, or
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

          <div class="flex gap-3 mx-auto justify-center mt-5">
            <button class="bg-purple-700 text-white px-5 py-3 rounded-lg font-semibold">
              Submit Application
            </button>
            <button
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
