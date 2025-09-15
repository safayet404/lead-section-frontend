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

let activeTab = ref('academic')

let tab = [
  { name: 'academic', label: 'Academic Requirement' },
  { name: 'english', label: 'English Requirement' },
]

const emit = defineEmits(['back'])
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
        <div class="border border-gray-200 rounded-xl shadow-2xl">
          <button
            v-for="t in tab"
            :key="t.name"
            @click="activeTab = t.name"
            :class="[
              'm-3 border-b cursor-pointer ',
              activeTab === t.name ? 'border-b-2 border-purple-700 font-medium' : '',
            ]"
          >
            {{ t.label }}
          </button>
          <div class="m-3" v-if="activeTab == 'academic'">
            {{ props.course.academic_requirement }}
          </div>
          <div class="m-3" v-else>
            {{ props.course.english_requirement }}
          </div>
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
