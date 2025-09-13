import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useApplicationStore = defineStore('application', () => {
  const countryId = ref(null)
  const passportCountryId = ref(null)
  const intakeId = ref(null)
  const courseTypeId = ref(null)
  const universityId = ref(null)
  const courseId = ref(null)

  const step = ref(1)

  const errors = ref({
    countryId: '',
    passportCountryId: '',
    intakeId: '',
    courseTypeId: '',
    universityId: '',
    courseId: '',
  })

  // Computed to get the selected object if needed
  const selectedCountry = ref(null)
  const selectedPassportCountry = ref(null)
  const selectedIntake = ref(null)
  const selectedCourseType = ref(null)
  const selectedUniversity = ref(null)
  const selectedCourse = ref(null)

  const validateStep1 = () => {
    errors.value = {
      countryId: countryId.value ? '' : 'Please select a country',
      passportCountryId: passportCountryId.value ? '' : 'Please select your passport country',
      intakeId: intakeId.value ? '' : 'Please select an intake',
      courseTypeId: courseTypeId.value ? '' : 'Please select a course type',
      universityId: universityId.value ? '' : 'Please select a university',
      courseId: courseId.value ? '' : 'Please select a course',
    }
    return Object.values(errors.value).every((v) => v === '')
  }

  return {
    countryId,
    passportCountryId,
    intakeId,
    courseTypeId,
    universityId,
    courseId,
    step,
    errors,
    validateStep1,
    selectedCountry,
    selectedPassportCountry,
    selectedIntake,
    selectedCourseType,
    selectedUniversity,
    selectedCourse,
  }
})
