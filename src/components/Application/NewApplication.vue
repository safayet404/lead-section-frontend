<script setup>
import api from '@/lib/api'
import { onMounted, ref, watch } from 'vue'

const countreis = ref([])
const intakes = ref([])
const universities = ref([])
const courseTypes = ref([])
const courses = ref([])

const selectedCountry = ref('')
const selectedIntake = ref('')
const selectedUniversity = ref('')
const selectedCourseType = ref('')
const selectedCourse = ref('')

const loading = ref({
  contries: false,
  intakes: false,
  universities: false,
  courseTypes: false,
  courses: false,
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

watch(selectedCountry, (val) => {
  selectedIntake.value =
    selectedUniversity.value =
    selectedCourseType.value =
    selectedCourse.value =
      ''
  intakes.value = universities.value = courseTypes.value = courses.value = []
  if (val) fetchIntakes(val)
})

// After selecting intake → fetch Course Types
watch(selectedIntake, (val) => {
  selectedCourseType.value = selectedUniversity.value = selectedCourse.value = ''
  courseTypes.value = universities.value = courses.value = []
  if (val && selectedCountry.value) fetchCourseTypes(selectedCountry.value, val)
})

// After selecting course type → fetch Universities
watch(selectedCourseType, (val) => {
  selectedUniversity.value = selectedCourse.value = ''
  universities.value = courses.value = []
  if (val && selectedCountry.value && selectedIntake.value)
    fetchUniversities(selectedCountry.value, selectedIntake.value, val)
})

// After selecting university → fetch Courses
watch(selectedUniversity, (val) => {
  selectedCourse.value = ''
  courses.value = []
  if (val && selectedCountry.value && selectedIntake.value && selectedCourseType.value)
    fetchCourses(selectedCountry.value, selectedIntake.value, val, selectedCourseType.value)
})

onMounted(() => {
  fetchCountries()
})
</script>

<template>
  <div class="container mx-auto p-4 rounded-2xl border border-gray-100 mt-10 shadow-2xl">
    <h1 class="text-lg">New Application</h1>

    <div class="flex justify-between gap-8 mt-10">
      <div class="w-full">
        <label>Country to Apply</label>
        <div>
          <select
            class="border w-full rounded p-1.5 border-gray-300 focus:outline-none mt-1 focus:border-purple-700"
            v-model="selectedCountry"
          >
            <option value="">Select Country</option>
            <option v-for="c in countreis" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
      </div>

      <div class="w-full">
        <label>Country of Student Passport</label>
        <div>
          <select
            class="border w-full rounded p-1.5 border-gray-300 focus:outline-none mt-1 focus:border-purple-700"
          >
            <option value="">Select Country</option>
            <option v-for="c in countreis" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="flex justify-between gap-8 mt-10">
      <div class="w-full">
        <label>Intake</label>
        <div>
          <select
            class="border w-full rounded p-1.5 border-gray-300 focus:outline-none mt-1 focus:border-purple-700"
            v-model="selectedIntake"
          >
            <option value="">Select Intake</option>
            <option v-for="c in intakes" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
      </div>

      <div class="w-full">
        <label>Course Type</label>
        <div>
          <select
            class="border w-full rounded p-1.5 border-gray-300 focus:outline-none mt-1 focus:border-purple-700"
            v-model="selectedCourseType"
          >
            <option value="">Select Course Type</option>
            <option v-for="c in courseTypes" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="flex justify-between gap-8 mt-10">
      <div class="w-full">
        <label>Univesity</label>
        <div>
          <select
            class="border w-full rounded p-1.5 border-gray-300 focus:outline-none mt-1 focus:border-purple-700"
            v-model="selectedUniversity"
          >
            <option value="">Select Course Type</option>
            <option v-for="c in universities" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
      </div>

      <div class="w-full">
        <label>Course</label>
        <div>
          <select
            class="border w-full rounded p-1.5 border-gray-300 focus:outline-none mt-1 focus:border-purple-700"
            v-model="selectedCourse"
          >
            <option value="">Select Course</option>
            <option v-for="c in courses" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
