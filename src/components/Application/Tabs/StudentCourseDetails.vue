<script setup>
const props = defineProps({
  data: Object,
})
</script>

<template>
  <div class="p-10">
    <div class="grid grid-cols-2 gap-y-4">
      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Application ID</p>
        <span class="text-gray-600">{{ props.data.id }}</span>
      </div>
      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Date Added</p>
        <span class="text-gray-600">{{ props.data.created_at }}</span>
      </div>

      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Student ID</p>
        <span class="text-gray-600">{{ props.data.student_id }}</span>
      </div>
      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Student Passport No.</p>
        <span class="text-gray-600">{{ props.data.student.passport_number }}</span>
      </div>

      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Student Name</p>
        <span class="text-gray-600"
          >{{ props.data.student.first_name }} {{ props.data.student.last_name }}</span
        >
      </div>
      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Student Date of Birth</p>
        <span class="text-gray-600">{{ props.data.student.date_of_birth }}</span>
      </div>

      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Student E-Mail</p>
        <span class="text-gray-600">{{ props.data.student.email }}</span>
      </div>
      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Student Phone No.</p>
        <span class="text-gray-600">{{ props.data.student.phone }}</span>
      </div>

      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Student Address</p>
        <span class="text-gray-600">{{ props.data.student.address }}</span>
      </div>
      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Student City & Country</p>
        <span class="text-gray-600">{{ props.data.student.city }}</span>
      </div>

      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Communication E-Mail ID</p>
        <span class="text-gray-600">{{ props.data.counsellor_email }}</span>
      </div>
      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Communication Phone No.</p>
        <span class="text-gray-600">{{ props.data.counsellor_phone }}</span>
      </div>

      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">University Name</p>
        <span class="text-gray-600">{{ props.data.university.name }}</span>
      </div>
      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Intake Name</p>
        <span class="text-gray-600">{{ props.data.intake.name }}</span>
      </div>

      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Course Name</p>
        <span class="text-gray-600">{{ props.data.course.name }}</span>
      </div>
      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Compliance Officer</p>
        <span class="text-gray-600">{{ props.data.id }}</span>
      </div>

      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Application Officer</p>
        <span class="text-gray-600">{{ props.data.id }}</span>
      </div>
      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Application Control Officer</p>
        <span class="text-gray-600">{{ props.data.id }}</span>
      </div>

      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Channel Partner</p>
        <span class="text-gray-600"
          >{{ props.data.channel_partner.name }} <br />
          {{ props.data.channel_partner.email }}</span
        >
      </div>
      <div class="flex items-center gap-20 border-b border-gray-300 py-3">
        <p class="w-60 font-medium text-gray-700">Application age</p>
        <span class="text-gray-600">{{ props.data.id }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* No specific styles needed here as Tailwind handles it */
</style>
