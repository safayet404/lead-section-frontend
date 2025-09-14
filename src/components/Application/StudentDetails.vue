<script setup>
import { ref } from 'vue'
import CourseDetails from './CourseDetails.vue'
import api from '@/lib/api'
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
  country: Object,
  passportCountry: Object,
  intake: Object,
  courseType: Object,
  university: Object,
  course: Object,
  files: Array,
})

console.log('files from step 3', props.files)

const student = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  passport_number: '',
  passport_country: props.passportCountry?.name || '',
  address: '',
  city: '',
  gender: 'male',
  visa_refusal: 'no',
  counsellor_phone: '',
  counsellor_email: '',
})

async function createApplication() {
  try {
    // const payload = {
    //   first_name: student.value.first_name,
    //   last_name: student.value.last_name,
    //   email: student.value.email,
    //   phone: student.value.phone,
    //   date_of_birth: student.value.date_of_birth,
    //   passport_number: student.value.passport_number,
    //   passport_country: student.value.passport_country,
    //   address: student.value.address,
    //   city: student.value.city,
    //   gender: student.value.gender,
    //   visa_refusal: student.value.visa_refusal,

    //   country_id: props.country.id,
    //   intake_id: props.intake.id,
    //   course_type_id: props.courseType.id,
    //   university_id: props.university.id,
    //   course_id: props.course.id,
    //   application_status_id: 1,
    //   counsellor_phone: student.value.counsellor_phone,
    //   counsellor_email: student.value.counsellor_email,
    // }

    const formData = new FormData()

    // append student details
    Object.entries(student.value).forEach(([key, value]) => {
      formData.append(key, value)
    })

    // append props data (ids)
    formData.append('country_id', props.country.id)
    formData.append('intake_id', props.intake.id)
    formData.append('course_type_id', props.courseType.id)
    formData.append('university_id', props.university.id)
    formData.append('course_id', props.course.id)
    formData.append('application_status_id', 1)

    // append files
    if (props.files && props.files.length > 0) {
      props.files.forEach((file, index) => {
        formData.append('files[]', file)
      })
    }

    const res = await api.post('/student-application', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    // const res = await api.post('/student-application', payload)

    console.log(res.data)

    if (res.data.status == 'success') {
      alert('✅ Application created successfully!')
      student.value = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        passport_number: '',
        passport_country: props.passportCountry?.name || '',
        address: '',
        city: '',
        gender: 'male',
        visa_refusal: 'no',
        counsellor_phone: '',
        counsellor_email: '',
      }

      router.push('/')
    }
  } catch (error) {
    console.log(error)
    alert('❌ Something went wrong')
  }
}

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

          <div class="flex justify-between gap-4 mt-5 space-y-2">
            <div class="w-full">
              <label class="text-sm">Student Passport No.</label>
              <div>
                <input
                  v-model="student.passport_number"
                  class="border text-sm focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-2.5 rounded-lg"
                  placeholder="A093242"
                />
              </div>
            </div>
            <div class="w-full">
              <label class="text-sm">Date of Birth</label>
              <div>
                <input
                  v-model="student.date_of_birth"
                  type="date"
                  class="border text-sm focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-2.5 rounded-lg"
                  placeholder="A093242"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-between gap-4 mt-5 space-y-2">
            <div class="w-full">
              <label class="text-sm">Student First Name</label>
              <div>
                <input
                  v-model="student.first_name"
                  class="border text-sm focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-2.5 rounded-lg"
                  placeholder="John"
                />
              </div>
            </div>
            <div class="w-full">
              <label class="text-sm">Student Last Name</label>
              <div>
                <input
                  v-model="student.last_name"
                  class="border text-sm focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-2.5 rounded-lg"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-between gap-4 mt-5 space-y-2">
            <div class="w-full">
              <label class="text-sm">Student WhatsApp Number</label>
              <div>
                <input
                  v-model="student.phone"
                  class="border text-sm focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-2.5 rounded-lg"
                  placeholder="+123343232290"
                />
              </div>
            </div>
            <div class="w-full">
              <label class="text-sm">Counsellor Number</label>
              <div>
                <input
                  v-model="student.counsellor_phone"
                  class="border text-sm focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-2.5 rounded-lg"
                  placeholder="+123343232290"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-between gap-4 mt-5 space-y-2">
            <div class="w-full">
              <label class="text-sm">Enter Student Email</label>
              <div>
                <input
                  v-model="student.email"
                  type="email"
                  class="border text-sm focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-2.5 rounded-lg"
                  placeholder="student@example.com"
                />
              </div>
            </div>
            <div class="w-full">
              <label class="text-sm">Counsellor Email</label>
              <div>
                <input
                  type="email"
                  v-model="student.counsellor_email"
                  class="border text-sm focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-2.5 rounded-lg"
                  placeholder="counsellor@example.com"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-between gap-4 mt-5 space-y-2">
            <div class="w-full">
              <label class="text-sm">Student Address</label>
              <div>
                <input
                  v-model="student.address"
                  class="border text-sm focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-2.5 rounded-lg"
                  placeholder="Baker Street"
                />
              </div>
            </div>
            <div class="w-full">
              <label class="text-sm">Student City</label>
              <div>
                <input
                  v-model="student.city"
                  class="border text-sm focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-2.5 rounded-lg"
                  placeholder="London"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-between gap-4 mt-5 space-y-2">
            <div class="w-1/2">
              <label class="text-sm">Student Country</label>
              <div>
                <input
                  class="border text-sm focus:outline-none focus:border-purple-700 w-full border-gray-300 mt-1 p-2.5 rounded-lg"
                  placeholder="Student Country"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-between mt-5 p-3 text-gray-500">
            <div class="space-y-2">
              <h1>Gender</h1>
              <div>
                <input
                  class="accent-[#7367F0]"
                  value="male"
                  v-model="student.gender"
                  type="radio"
                />
                Male
              </div>
              <div>
                <input
                  class="accent-[#7367F0]"
                  value="female"
                  v-model="student.gender"
                  type="radio"
                />
                Female
              </div>
            </div>
            <div class="space-y-2">
              <h1>Any Previous Visa Refusal</h1>
              <div>
                <input
                  class="accent-[#7367F0]"
                  value="yes"
                  v-model="student.visa_refusal"
                  type="radio"
                />
                Yes
              </div>
              <div>
                <input
                  class="accent-[#7367F0]"
                  value="no"
                  v-model="student.visa_refusal"
                  type="radio"
                />
                No
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between mt-5 m-1">
          <button @click="emit('back')" class="px-7 py-2 rounded text-white bg-gray-500">
            Back
          </button>
          <button
            @click="createApplication"
            class="px-7 py-2 rounded bg-purple-600 text-white font-medium"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
