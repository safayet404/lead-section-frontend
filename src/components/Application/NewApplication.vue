<script setup>
import api from '@/lib/api'
import { onMounted, ref, watch } from 'vue'
import Information from './Information.vue'
import Document from './Document.vue'
import { useApplicationStore } from '@/stores/application'
import StudentDetails from './StudentDetails.vue'

const appStore = useApplicationStore()

const countreis = ref([])
const intakes = ref([])
const universities = ref([])
const courseTypes = ref([])
const courses = ref([])
const channelPartner = ref([])

const selectedCountry = ref('')
const selectedPassportCountry = ref('')
const selectedIntake = ref('')
const selectedUniversity = ref('')
const selectedCourseType = ref('')
const selectedCourse = ref('')
const selectedChannelPartner = ref('')

// Validation errors
const errors = ref({
  country: '',
  passportCountry: '',
  intake: '',
  courseType: '',
  university: '',
  course: '',
})

const loading = ref({
  contries: false,
  passportCountry: false,
  intakes: false,
  universities: false,
  courseTypes: false,
  courses: false,
  channelPartner: false,
})

const fetchCountries = async () => {
  loading.value.contries = true
  try {
    countreis.value = (await api.get('/countries')).data
  } catch (error) {
    console.log(error)
  } finally {
    loading.value.contries = false
  }
}
const fetchIntakes = async (countryId) => {
  loading.value.intakes = true
  try {
    intakes.value = (await api.get(`/intakes/${countryId}`)).data
  } catch (error) {
    console.log(error)
  } finally {
    loading.value.intakes = false
  }
}
const fetchCourseTypes = async (countryId, intakeId) => {
  loading.value.courseTypes = true
  try {
    courseTypes.value = (await api.get(`/course-types/${countryId}/${intakeId}`)).data
  } catch (error) {
    console.log(error)
  } finally {
    loading.value.courseTypes = false
  }
}
const fetchUniversities = async (countryId, intakeId, courseTypeId) => {
  loading.value.universities = true
  try {
    universities.value = (
      await api.get(`/universities/${countryId}/${intakeId}/${courseTypeId}`)
    ).data
  } catch (error) {
    console.log(error)
  } finally {
    loading.value.universities = false
  }
}
const fetchCourses = async (countryId, intakeId, universityId, courseTypeId) => {
  loading.value.courses = true
  try {
    courses.value = (
      await api.get(`/courses/${countryId}/${intakeId}/${universityId}/${courseTypeId}`)
    ).data
  } catch (error) {
    console.log(error)
  } finally {
    loading.value.courses = false
  }
}
const fetchChannelParatner = async () => {
  loading.value.channelPartner = true
  try {
    channelPartner.value = (await api.get('/all-channel')).data
  } catch (error) {
    console.log(error)
  } finally {
    loading.value.channelPartner = false
  }
}

watch(selectedCountry, (val) => {
  selectedIntake.value =
    selectedUniversity.value =
    selectedCourseType.value =
    selectedCourse.value =
      ''
  intakes.value = universities.value = courseTypes.value = courses.value = []
  errors.value.country = '' // reset error
  if (val) fetchIntakes(val.id)
})
watch(selectedIntake, (val) => {
  selectedCourseType.value = selectedUniversity.value = selectedCourse.value = ''
  courseTypes.value = universities.value = courses.value = []
  errors.value.intake = '' // reset error
  if (val && selectedCountry.value) fetchCourseTypes(selectedCountry.value.id, val.id)
})
watch(selectedCourseType, (val) => {
  selectedUniversity.value = selectedCourse.value = ''
  universities.value = courses.value = []
  errors.value.courseType = '' // reset error
  if (val && selectedCountry.value && selectedIntake.value)
    fetchUniversities(selectedCountry.value.id, selectedIntake.value.id, val.id)
})
watch(selectedUniversity, (val) => {
  selectedCourse.value = ''
  courses.value = []
  errors.value.university = '' // reset error
  if (val && selectedCountry.value && selectedIntake.value && selectedCourseType.value)
    fetchCourses(
      selectedCountry.value.id,
      selectedIntake.value.id,
      val.id,
      selectedCourseType.value.id,
    )
})
watch(selectedCourse, () => {
  errors.value.course = '' // reset error
})

onMounted(() => {
  fetchCountries()
  fetchChannelParatner()
})

const files = ref([])

const step = ref(1)

const validateForm = () => {
  errors.value = {
    country: selectedCountry.value ? '' : 'Please select a country',
    passportCountry: selectedPassportCountry.value ? '' : 'Please select your residence country',
    intake: selectedIntake.value ? '' : 'Please select an intake',
    courseType: selectedCourseType.value ? '' : 'Please select a course type',
    university: selectedUniversity.value ? '' : 'Please select a university',
    course: selectedCourse.value ? '' : 'Please select a course',
  }

  return Object.values(errors.value).every((v) => v === '')
}
const handleNext = () => {
  if (validateForm()) {
    step.value = 2
  }
}
</script>

<template>
  <div v-if="step === 1">
    <div class="container mx-auto p-4 rounded-2xl border border-gray-100 mt-10 shadow-2xl">
      <h1 class="text-lg">New Application</h1>

      <!-- Country -->
      <div class="flex justify-between gap-8 mt-10">
        <div class="w-full">
          <label>Country to Apply</label>
          <select
            class="border w-full rounded p-1.5 border-gray-300 focus:outline-none mt-1 focus:border-purple-700"
            v-model="selectedCountry"
          >
            <option value="">Select Country</option>
            <option v-for="c in countreis" :key="c.id" :value="c">{{ c.name }}</option>
          </select>
          <p v-if="errors.country" class="text-red-500 text-sm mt-1">{{ errors.country }}</p>
        </div>

        <div class="w-full">
          <label>Country of Student Passport</label>
          <select
            v-model="selectedPassportCountry"
            class="border w-full rounded p-1.5 border-gray-300 focus:outline-none mt-1 focus:border-purple-700"
          >
            <option value="">Select Country</option>
            <option v-for="c in countreis" :key="c.id" :value="c">{{ c.name }}</option>
          </select>
          <p v-if="errors.passportCountry" class="text-red-500 text-sm mt-1">
            {{ errors.passportCountry }}
          </p>
        </div>
      </div>

      <!-- Intake + Course Type -->
      <div class="flex justify-between gap-8 mt-10">
        <div class="w-full">
          <label>Intake</label>
          <select
            class="border w-full rounded p-1.5 border-gray-300 focus:outline-none mt-1 focus:border-purple-700"
            v-model="selectedIntake"
          >
            <option value="">Select Intake</option>
            <option v-for="c in intakes" :key="c.id" :value="c">{{ c.name }}</option>
          </select>
          <p v-if="errors.intake" class="text-red-500 text-sm mt-1">{{ errors.intake }}</p>
        </div>

        <div class="w-full">
          <label>Course Type</label>
          <select
            class="border w-full rounded p-1.5 border-gray-300 focus:outline-none mt-1 focus:border-purple-700"
            v-model="selectedCourseType"
          >
            <option value="">Select Course Type</option>
            <option v-for="c in courseTypes" :key="c.id" :value="c">{{ c.name }}</option>
          </select>
          <p v-if="errors.courseType" class="text-red-500 text-sm mt-1">{{ errors.courseType }}</p>
        </div>
      </div>

      <!-- University + Course -->
      <div class="flex justify-between gap-8 mt-10">
        <div class="w-full">
          <label>University</label>
          <select
            class="border w-full rounded p-1.5 border-gray-300 focus:outline-none mt-1 focus:border-purple-700"
            v-model="selectedUniversity"
          >
            <option value="">Select University</option>
            <option v-for="c in universities" :key="c.id" :value="c">{{ c.name }}</option>
          </select>
          <p v-if="errors.university" class="text-red-500 text-sm mt-1">{{ errors.university }}</p>
        </div>

        <div class="w-full">
          <label>Course</label>
          <select
            class="border w-full rounded p-1.5 border-gray-300 focus:outline-none mt-1 focus:border-purple-700"
            v-model="selectedCourse"
          >
            <option value="">Select Course</option>
            <option v-for="c in courses" :key="c.id" :value="c">{{ c.name }}</option>
          </select>
          <p v-if="errors.course" class="text-red-500 text-sm mt-1">{{ errors.course }}</p>
        </div>
      </div>

      <div class="mt-10">
        <label>Channel Partner</label>
        <div>
          <select
            v-model="selectedChannelPartner"
            class="border w-md border-gray-300 p-1.5 mt-1 rounded focus:outline-none focus:border-purple-700"
          >
            <option value="">Select Channel Partner</option>
            <option v-for="c in channelPartner" :value="c" :key="c.id">{{ c.name }}</option>
          </select>
        </div>
      </div>

      <!-- Next Button -->
      <div class="flex justify-end">
        <button
          class="px-4 py-2 bg-purple-700 rounded mt-5 text-white font-medium"
          @click="handleNext"
        >
          Next
        </button>
      </div>
    </div>
  </div>
  <div v-else-if="step === 2">
    <Information
      :country="selectedCountry"
      :passportCountry="selectedPassportCountry"
      :intake="selectedIntake"
      :course-type="selectedCourseType"
      :university="selectedUniversity"
      :course="selectedCourse"
      @back="step = 1"
      @next="step = 3"
    />
  </div>

  <Document
    v-else-if="step === 3"
    :country="selectedCountry"
    :passportCountry="selectedPassportCountry"
    :intake="selectedIntake"
    :course-type="selectedCourseType"
    :university="selectedUniversity"
    :course="selectedCourse"
    @back="step = 2"
    @next="step = 4"
    @update:files="files = $event"
  />

  <StudentDetails
    v-else-if="step === 4"
    :country="selectedCountry"
    :passportCountry="selectedPassportCountry"
    :intake="selectedIntake"
    :course-type="selectedCourseType"
    :university="selectedUniversity"
    :course="selectedCourse"
    :files="files"
    :channelPartner="selectedChannelPartner"
    @back="step = 3"
    @next="step = 5"
  />
</template>
