<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Details',
  },
  description: {
    type: String,
    default: '',
  },

  data: {
    type: Array,
    default: () => [],
  },
})

console.log('data', props.data)

defineEmits(['close'])
</script>

<template>
  <div
    v-if="show"
    class="fixed top-0 left-0 w-[100%] h-[100%] flex justify-center items-center z-50 bg-black/50"
  >
    <div class="bg-white rounded-xl shadow-lg w-1/2 p-6 relative">
      <button class="absolute top-2 right-2 text-gray-500 hover:text-black" @click="$emit('close')">
        ✕
      </button>

      <!-- Modal Content Handled Here -->
      <h3 class="text-xl font-semibold mb-4">{{ title }}</h3>
      <p class="text-gray-700">{{ description }}</p>
    </div>
  </div>
</template>
