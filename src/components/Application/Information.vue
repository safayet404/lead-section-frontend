<script setup>
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
</script>

<template>
  <div class="container p-4">
    <div class="grid grid-cols-4">
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
      <div class="col-span-3"></div>
    </div>
  </div>
  <h1>This is Information - {{ props.country }}</h1>
</template>

<style scoped></style>
