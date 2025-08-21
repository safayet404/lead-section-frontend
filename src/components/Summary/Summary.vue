<script setup>
import api from '@/lib/api'
import { onMounted, ref } from 'vue'
import { Users, Check, Clock, BriefcaseConveyorBelt, Contact, Clock1 } from 'lucide-vue-next'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

import Chart from 'chart.js/auto'
import BarChart from './BarChart.vue'

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
const chartCanvas = ref(null) // bind to <canvas>
let chartInstance = null

const range = ref('week')

async function fetchBranchData() {
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

    console.log(weeklyTrend.value)

    if (weeklyTrend.value.length) {
      const ctx = chartCanvas.value.getContext('2d')
      if (chartInstance) {
        chartInstance.destroy()
      }
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: weeklyTrend.value.map((t) => t.period),
          datasets: [
            {
              label: 'Leads',
              data: weeklyTrend.value.map((t) => t.count),

              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              minBarLength: 50,

              barThickness: 120,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
            },
          },
        },
      })
    }
  } catch (e) {
    error.value = e?.message || 'Failed to load dashboard'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBranchData()
})

const headers = [
  { text: 'Name', value: 'user.name' },
  { text: 'Total Assigned Lead', value: 'total' },
  { text: 'Lead Contacted', value: 'contacted' },
  { text: 'Initial Pending Call', value: 'pendingCall' },
  { text: 'Converted to Student', value: 'converted' },
  { text: 'Follow Up Call Schedule', value: 'followup' },
]
</script>

<template>
  <h1 class="text-xl font-semibold">Branch Manager Report</h1>
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

  <div class="grid mb-5 grid-cols-4 gap-5">
    <div class="bg-[#5853E9] text-white flex gap-3 px-5 py-5 rounded-xl">
      <div class="my-auto">
        <Users />
      </div>
      <div>
        <p class="text-base">Assign Leads</p>
        <p class="font-semibold text-base">{{ summary.assigned }}</p>
      </div>
    </div>
    <div class="bg-[#0C9F70] text-white flex gap-3 px-5 py-5 rounded-xl">
      <div class="my-auto">
        <Contact />
      </div>
      <div>
        <p class="text-base">Contacted Leads</p>
        <p class="font-semibold text-base">{{ summary.contacted }}</p>
      </div>
    </div>
    <div class="bg-[#aa15af] text-white flex gap-3 px-5 py-5 rounded-xl">
      <div class="my-auto">
        <Clock />
      </div>
      <div>
        <p class="text-base">Pending Call Leads</p>
        <p class="font-semibold text-base">{{ summary.pendingCall }}</p>
      </div>
    </div>

    <div class="bg-[#DD7F09] text-white flex gap-3 px-5 py-5 rounded-xl">
      <div class="my-auto">
        <BriefcaseConveyorBelt />
      </div>

      <div>
        <p class="text-base">Converted Leads</p>
        <p class="font-semibold text-base">{{ summary.converted }}</p>
      </div>
    </div>
    <div class="bg-[#cc289b] text-white flex gap-3 px-5 py-5 rounded-xl">
      <div class="my-auto">
        <Clock />
      </div>
      <div>
        <p class="text-base">Conversion Rate</p>
        <p class="font-semibold text-base">{{ summary.conversionRate }} %</p>
      </div>
    </div>
  </div>

  <EasyDataTable
    :headers="headers"
    :items="perCounsellorRaw"
    :search-field="searchField"
    :search-value="searchValue"
    :theme-color="themeColor"
    buttons-pagination
    :loading="loading"
    alternating
    table-class-name="customize-table"
  >
  </EasyDataTable>

  <div class="mt-6 overflow-hidden">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<style scoped>
table th,
table td {
  text-align: left;
}
</style>
