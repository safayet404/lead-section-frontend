<script setup>
import { ref, nextTick, onMounted } from 'vue'
import StudentCourseDetails from './Tabs/StudentCourseDetails.vue'
import UniversityDetails from './Tabs/UniversityDetails.vue'
import UploadDownload from './Tabs/UploadDownload.vue'
import Status from './Tabs/Status.vue'
import Comments from './Tabs/Comments.vue'
import UniversityCommunication from './Tabs/UniversityCommunication.vue'
import AoCommunication from './Tabs/AoCommunication.vue'
import CoCommunication from './Tabs/CoCommunication.vue'
import AssingAo from './Tabs/AssingAo.vue'
import AssignCo from './Tabs/AssignCo.vue'
import api from '@/lib/api'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  applicationId: {
    type: String,
  },
})

const activeTab = ref('student/course')
const tabContainer = ref(null)
const singleData = ref([])
const loading = ref(false)
console.log('app', props.applicationId)

const fetchApplicationDetails = async () => {
  loading.value = true
  try {
    const res = await api.get(`single-application/${props?.applicationId}`)
    singleData.value = res.data
    console.log('res', res.data)
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchApplicationDetails()
})

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
    <div class="bg-white rounded-xl shadow-lg w-11/12 h-11/12 flex flex-col">
      <div class="flex justify-between p-4 relative bg-[#7367F0] rounded-t-lg">
        <h1 class="text-lg text-white">Application Details</h1>
        <button class="absolute top-2 right-5 text-2xl text-white" @click="$emit('close')">
          ✕
        </button>
      </div>

      <div class="flex-grow max-h-full overflow-y-auto">
        <div class="border border-gray-100 rounded-2xl shadow-2xl p-4 w-11/12 h-auto mx-auto mt-5">
          <div class="flex border-b border-gray-200 items-center gap-2">
            <button @click="scrollTabs('left')" class="p-2 text-gray-500 hover:text-gray-900">
              &lt;
            </button>

            <div ref="tabContainer" class="flex overflow-x-auto gap-4 custom-scrollbar">
              <p
                v-for="t in tab"
                :key="t.name"
                @click="activeTab = t.name"
                :class="{
                  'whitespace-nowrap font-medium cursor-pointer px-4 py-2 transition-colors -mb-px': true,
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

          <Transition name="fade" mode="out-in">
            <div :key="activeTab">
              <StudentCourseDetails v-if="activeTab === 'student/course'" :data="singleData" />
              <UniversityDetails v-else-if="activeTab === 'university'" :data="singleData" />
              <UploadDownload v-else-if="activeTab === 'upload'" :data="singleData" />
              <Status v-else-if="activeTab === 'status'" :data="singleData" />
              <Comments v-else-if="activeTab === 'comments'" :data="singleData" />
              <UniversityCommunication
                v-else-if="activeTab === 'university-communication'"
                :data="singleData"
              />
              <AoCommunication v-else-if="activeTab === 'ao-communication'" />
              <CoCommunication v-else-if="activeTab === 'co-communication'" />
              <AssingAo v-else-if="activeTab === 'assign-ao'" />
              <AssignCo v-else-if="activeTab === 'assign-co'" />
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}
.custom-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
