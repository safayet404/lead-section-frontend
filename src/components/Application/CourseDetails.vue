<script setup>
const props = defineProps({
  country: Object,
  passportCountry: Object,
  intake: Object,
  courseType: Object,
  university: Object,
  course: Object,
})
</script>

<template>
  <ul class="space-y-6">
    <li><span class="font-semibold"> University Name : </span> {{ props.university.name }}</li>
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
</template>

<style scoped></style>
