<script setup lang="ts">
import { computed } from 'vue'
import { useFilters } from '../_composables/useFilters'

const { compliancePerItemData } = useFilters()

const chartColors = computed(() => {
  return compliancePerItemData.value.map((item) => {
    if (item.percentage >= 80) return '#4caf50'
    if (item.percentage >= 50) return '#ff9800'
    return '#f44336'
  })
})

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '50%',
      borderRadius: 4,
      distributed: true
    }
  },
  colors: chartColors.value,
  dataLabels: {
    enabled: true,
    formatter: (val: number) => val + '%'
  },
  legend: { show: false },
  xaxis: {
    categories: compliancePerItemData.value.map((item) => {
      const val = item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name

      return val.toUpperCase()
    }),
    labels: {
      style: { fontSize: '11px' }
    }
  },
  yaxis: {
    max: 100,
    labels: {
      formatter: (val: number) => val + '%'
    }
  },
  tooltip: {
    y: {
      formatter: (val: number) => val + '%'
    }
  }
}))

const series = computed(() => {
  return [
    {
      name: 'Cumplimiento',
      data: compliancePerItemData.value.map((item) => item.percentage)
    }
  ]
})
</script>

<template>
  <v-card flat class="border rounded pa-4 h-100">
    <div class="d-flex justify-space-between align-center mb-6">
      <h3 class="text-h6 font-weight-bold text-uppercase">Cumplimiento por Ítem</h3>
    </div>
    <apexchart type="bar" height="400" :options="chartOptions" :series="series"></apexchart>
  </v-card>
</template>
