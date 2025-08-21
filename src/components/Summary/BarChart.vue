<script>
import { defineComponent, watch, ref, onMounted } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default defineComponent({
  name: 'BarChart',
  props: {
    chartData: { type: Object, required: true },
    chartOptions: { type: Object, default: () => ({}) },
  },
  setup(props) {
    const chartRef = ref(null)

    // Watch for changes and update chart manually
    watch(
      () => props.chartData,
      (newData) => {
        if (chartRef.value) {
          chartRef.value.chartInstance.data = newData
          chartRef.value.chartInstance.update()
        }
      },
      { deep: true, immediate: true },
    )

    return { chartRef }
  },
  render() {
    return h(Bar, { ref: 'chartRef', chartData: this.chartData, chartOptions: this.chartOptions })
  },
})
</script>

<template>
  <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
</template>
