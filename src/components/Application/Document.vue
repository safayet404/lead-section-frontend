<script setup>
import { ref } from 'vue'
import CourseDetails from './CourseDetails.vue'

const props = defineProps({
  country: Object,
  passportCountry: Object,
  intake: Object,
  courseType: Object,
  university: Object,
  course: Object,
})

const emit = defineEmits(['back'])

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
</script>

<template>
  <div class="container p-4 mx-auto">
    <div class="grid grid-cols-4 gap-5 items-start">
      <div class="col-span-1 p-3 border border-gray-200 shadow-2xl rounded-xl">
        <CourseDetails
          :country="props.country"
          :university="props.university"
          :course="props.course"
          :intake="props.intake"
          :courseType="props.courseType"
        />
      </div>
      <div class="col-span-3 p-4">
        <div class="shadow-2xl p-4 rounded-xl mt-5 border border-gray-200">
          <h1>Please Upload only color scan copy files for new student</h1>

          <div
            class="mt-5 p-2 m-3 rounded-lg bg-[#F1F0EF] text-center cursor-pointer"
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

          <input type="file" class="hidden" multiple ref="fileInput" @change="handleFileChange" />
        </div>
        <div class="flex justify-between mt-5 m-1">
          <button @click="emit('back')" class="px-7 py-2 rounded text-white bg-gray-500">
            Back
          </button>
          <button
            @click="emit('next')"
            class="px-7 py-2 rounded bg-purple-600 text-white font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
