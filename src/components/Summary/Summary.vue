<script setup>
import api from '@/lib/api'
import { onMounted, ref } from 'vue'
import { Users, Check, Clock, Contact, Clock1 } from 'lucide-vue-next'

const summary = ref({
  assigned: 0,
  contacted: 0,
  converted: 0,
  followUps: 0,
  conversionRate: 0,
})

const perCounsellorRaw = ref([])
const loading = ref(false)
const error = ref(null)
const weeklyTrend = ref([])

const range = ref('week')

async function fetchBranchData(params) {
  loading.value = true
  error.value = null

  try {
    const payload = {
      range: range.value,
    }
    const res = await api.get('/summary', payload)
    summary.value = res.data.summary
    perCounsellorRaw.value = res.data?.perCounsellor ?? []
    weeklyTrend.value = res.data?.trend ?? []

    console.log(summary.value)
    console.log(weeklyTrend.value)
    console.log(perCounsellorRaw.value)
  } catch (e) {
    error.value = e?.message || 'Failed to load dashboard'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBranchData()
})
</script>

<template>
  <div>
    <select
      v-model="range"
      @change="fetchBranchData"
      class="border px-3 py-2 rounded-lg w-2/6 mb-4 border-gray-300 mt-5"
    >
      <option value="week">Weekly Report</option>
      <option value="month">Monthly Report</option>
      <option value="year">Yearly Report</option>
      <option value="all">All Report</option>
    </select>
  </div>

  <div class="grid grid-cols-4 gap-5">
    <div class="bg-[#5853E9] text-white flex gap-3 px-5 py-2 rounded-xl">
      <div class="my-auto">
        <Users />
      </div>
      <div>
        <p class="text-base">Assign Leads</p>
        <p class="font-semibold text-base">{{ summary.assigned }}</p>
      </div>
    </div>
    <div class="bg-[#0C9F70] text-white flex gap-3 px-5 py-2 rounded-xl">
      <div class="my-auto">
        <Check />
      </div>
      <div>
        <p class="text-base">Contacted Leads</p>
        <p class="font-semibold text-base">{{ summary.contacted }}</p>
      </div>
    </div>
    <div class="bg-[#aa15af] text-white flex gap-3 px-5 py-2 rounded-xl">
      <div class="my-auto">
        <Clock />
      </div>
      <div>
        <p class="text-base">Pending Call Leads</p>
        <p class="font-semibold text-base">{{ summary.pendingCall }}</p>
      </div>
    </div>

    <div class="bg-[#DD7F09] text-white flex gap-3 px-5 py-2 rounded-xl">
      <div class="my-auto">
        <Clock />
      </div>

      <div>
        <p class="text-base">Converted Leads</p>
        <p class="font-semibold text-base">{{ summary.converted }}</p>
      </div>
    </div>
    <div class="bg-[#cc289b] text-white flex gap-3 px-5 py-2 rounded-xl">
      <div class="my-auto">
        <Clock />
      </div>
      <div>
        <p class="text-base">Conversion Rate</p>
        <p class="font-semibold text-base">{{ summary.conversionRate }} %</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
