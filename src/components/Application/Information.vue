<script setup>
import { ref } from 'vue'

const props = defineProps({
  country: {
    type: [String, Number],
    required: true,
  },
  intake: {
    type: [String, Number],
    required: true,
  },
  courseType: {
    type: [String, Number],
    required: true,
  },
  university: {
    type: [String, Number],
    required: true,
  },
  course: {
    type: [String, Number],
    required: true,
  },
})

let activeTab = ref('academic')

let tab = [
  { name: 'academic', label: 'Academic Requirement' },
  { name: 'english', label: 'English Requirement' },
]
</script>

<template>
  <div class="container p-4 mx-auto">
    <div class="grid grid-cols-4 gap-5 items-start">
      <div class="col-span-1 p-3 border border-gray-200 shadow-2xl rounded-xl">
        <ul class="space-y-6">
          <li>
            <span class="font-semibold"> University Name : </span> {{ props.university.name }}
          </li>
          <li><span class="font-semibold"> Course Name : </span> {{ props.course.name }}</li>
          <li><span class="font-semibold"> Intake : </span> {{ props.intake.name }}</li>
          <li><span class="font-semibold"> Tution Fee : </span> {{ props.course.tution_fee }}</li>
          <li>
            <span class="font-semibold"> Course Duration : </span>
            {{ props.course.course_duration }}
          </li>
          <li><span class="font-semibold"> Course Label : </span> {{ props.courseType.name }}</li>
          <li><span class="font-semibold"> Country : </span> {{ props.country.name }}</li>
        </ul>
      </div>
      <div class="col-span-3 p-4">
        <div class="border border-gray-200 rounded-xl shadow-2xl">
          <button
            v-for="t in tab"
            :key="t.name"
            @click="activeTab = t.name"
            :class="[
              'm-3 cursor-pointer ',
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
          <button class="px-7 py-2 rounded text-white bg-gray-500">Back</button>
          <button class="px-7 py-2 rounded bg-purple-600 text-white font-medium">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
