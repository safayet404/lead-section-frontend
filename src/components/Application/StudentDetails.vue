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
        <div class="border border-gray-200 p-4 rounded-xl shadow-2xl">
          <h1>Please enter student details to process this application</h1>

          <div class="flex justify-between gap-4 mt-5">
            <div class="w-full">
              <label class="text-sm">Student Passport No.</label>
              <div>
                <input
                  class="border focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-1.5 rounded-lg"
                  placeholder="A093242"
                />
              </div>
            </div>
            <div class="w-full">
              <label class="text-sm">Date of Birth</label>
              <div>
                <input
                  type="date"
                  class="border focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-1.5 rounded-lg"
                  placeholder="A093242"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-between gap-4 mt-5">
            <div class="w-full">
              <label class="text-sm">Student First Name</label>
              <div>
                <input
                  class="border focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-1.5 rounded-lg"
                  placeholder="John"
                />
              </div>
            </div>
            <div class="w-full">
              <label class="text-sm">Student Last Name</label>
              <div>
                <input
                  class="border focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-1.5 rounded-lg"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-between gap-4 mt-5">
            <div class="w-full">
              <label class="text-sm">Student WhatsApp Number</label>
              <div>
                <input
                  class="border focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-1.5 rounded-lg"
                  placeholder="+123343232290"
                />
              </div>
            </div>
            <div class="w-full">
              <label class="text-sm">Counsellor Number</label>
              <div>
                <input
                  class="border focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-1.5 rounded-lg"
                  placeholder="+123343232290"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-between gap-4 mt-5">
            <div class="w-full">
              <label class="text-sm">Enter Student Email</label>
              <div>
                <input
                  type="email"
                  class="border focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-1.5 rounded-lg"
                  placeholder="student@example.com"
                />
              </div>
            </div>
            <div class="w-full">
              <label class="text-sm">Counsellor Email</label>
              <div>
                <input
                  type="email"
                  class="border focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-1.5 rounded-lg"
                  placeholder="counsellor@example.com"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-between gap-4 mt-5">
            <div class="w-full">
              <label>Student Address</label>
              <div>
                <input
                  class="border focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-1.5 rounded-lg"
                  placeholder="Baker Street"
                />
              </div>
            </div>
            <div class="w-full">
              <label class="text-sm">Student City</label>
              <div>
                <input
                  class="border focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-1.5 rounded-lg"
                  placeholder="London"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-between gap-4 mt-5">
            <div class="w-1/2">
              <label class="text-sm">Student Country</label>
              <div>
                <input
                  class="border focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-1.5 rounded-lg"
                  placeholder="Student Country"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-between mt-5 p-3 text-gray-500">
            <div class="space-y-2">
              <h1>Gender</h1>
              <div><input class="accent-[#7367F0]" type="radio" /> Male</div>
              <div><input class="accent-[#7367F0]" type="radio" /> Female</div>
            </div>
            <div class="space-y-2">
              <h1>Any Previous Visa Refusal</h1>
              <div><input class="accent-[#7367F0]" type="radio" /> Yes</div>
              <div><input class="accent-[#7367F0]" type="radio" /> No</div>
            </div>
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
