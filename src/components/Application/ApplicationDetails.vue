<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
})

const activeTab = ref('student/course')
const tabContainer = ref(null)

const tab = [
  { name: 'student/course', label: 'Student/Course Details' },
  { name: 'university', label: 'University Detials' },
  { name: 'upload', label: 'Upload/Download' },
  { name: 'status', label: 'Status' },
  { name: 'comments', label: 'Comments' },
  { name: 'university-communication', label: 'University Communication' },
  { name: 'ao-communication', label: 'Communication with AO' },
  { name: 'assign-ao', label: 'Assign Application Officer' },
  { name: 'assign-co', label: 'Assign Compliance Officer' },
  { name: 'co-communication', label: 'Communication with CO' },
]

defineEmits(['close'])

const scrollTabs = (direction) => {
  if (tabContainer.value) {
    const scrollAmount = direction === 'left' ? -200 : 200
    tabContainer.value.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    })
  }
}
</script>

<template>
  <div
    v-if="show"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black/50"
  >
    <div class="bg-white rounded-xl shadow-lg w-11/12 h-11/12">
      <div class="flex justify-between p-4 relative bg-[#7367F0] rounded-t-lg">
        <h1 class="text-lg text-white">Application Details</h1>
        <button class="absolute top-2 right-5 text-2xl text-white" @click="$emit('close')">
          ✕
        </button>
      </div>

      <div class="border border-gray-100 rounded-2xl shadow-2xl p-4 w-11/12 mx-auto mt-5">
        <div class="flex border-b border-gray-200 items-center gap-2">
          <button @click="scrollTabs('left')" class="p-2 text-gray-500 hover:text-gray-900">
            &lt;
          </button>

          <div
            ref="tabContainer"
            class="flex overflow-x-auto overflow-y-hidden gap-4 custom-scrollbar"
          >
            <p
              v-for="t in tab"
              :key="t.name"
              @click="activeTab = t.name"
              :class="{
                'whitespace-nowrap cursor-pointer px-4 py-2 transition-colors -mb-px': true,
                'text-[#7367F0] border-b-2 border-[#7367F0]': activeTab === t.name,
                'text-gray-700 hover:bg-gray-200': activeTab !== t.name,
              }"
            >
              {{ t.label }}
            </p>
          </div>

          <button @click="scrollTabs('right')" class="p-2 text-gray-500 hover:text-gray-900">
            &gt;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Hide the default scrollbar for a cleaner look */
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}
.custom-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
