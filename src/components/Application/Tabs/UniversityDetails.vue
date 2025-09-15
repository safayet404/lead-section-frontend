<script setup>
const props = defineProps({
  data: Object,
})
</script>

<template>
  <div class="p-10 mx-auto">
    <div class="border rounded border-gray-200 bg-[#F0F7FF]">
      <div class="flex border-b border-gray-300">
        <p class="w-32 font-semibold text-gray-700 bg-[#E1F0FF] p-4">Country</p>
        <p class="p-4 text-gray-600">{{ props.data.country.name }}</p>
      </div>

      <div class="flex border-b border-gray-300">
        <p class="w-32 font-semibold text-gray-700 bg-[#E1F0FF] p-4">Intake</p>
        <p class="p-4 text-gray-600">{{ props.data.intake.name }}</p>
      </div>

      <div class="flex border-b border-gray-300">
        <p class="w-32 font-semibold text-gray-700 bg-[#E1F0FF] p-4">Course Type</p>
        <p class="p-4 text-gray-600">{{ props.data.course_type.name }}</p>
      </div>

      <div class="flex border-b border-gray-300">
        <p class="w-32 font-semibold text-gray-700 bg-[#E1F0FF] p-4">University</p>
        <p class="p-4 text-gray-600">{{ props.data.university.name }}</p>
      </div>
      <div class="flex">
        <p class="w-32 font-semibold text-gray-700 bg-[#E1F0FF] p-4">Course</p>
        <p class="p-4 text-gray-600">{{ props.data.course.name }}</p>
      </div>
    </div>
  </div>
</template>
