<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const props = defineProps({
  weeklyTrendData: {
    type: Array,
    required: true,
  },
})

// Use a computed property to transform the prop data into the format Chart.js expects
const chartData = computed(() => {
  return {
    labels: props.weeklyTrendData.map((item) => item.date),
    datasets: [
      {
        label: 'Leads Assigned',
        backgroundColor: '#42b983',
        borderColor: '#42b983',
        data: props.weeklyTrendData.map((item) => item.count),
        tension: 0.3,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}
</script>
