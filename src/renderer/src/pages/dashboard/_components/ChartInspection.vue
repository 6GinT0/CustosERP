<script setup lang="ts">
import { computed } from 'vue'
import { useFilters } from '../_composables/useFilters'
import { format, eachDayOfInterval, subDays } from 'date-fns'

const { filters, inspectionsData } = useFilters()

const lineChartOptions = computed(() => ({
  chart: {
    type: 'line',
    toolbar: { show: false },
    theme: { mode: 'light', palette: 'palette1' },
    zoom: { enabled: false },
    animations: { enabled: true, easing: 'easeinout', speed: 800 }
  },
  colors: ['#3F51B5', '#01579B'],
  stroke: { curve: 'smooth', width: 4 },
  xaxis: {
    categories: eachDayOfInterval({ start: subDays(new Date(), 30), end: new Date() }).map((d) =>
      format(d, 'dd/MM')
    )
  },
  markers: { size: 4 },
  legend: { position: 'top' },
  grid: { borderColor: '#f1f1f1' }
}))

const series = computed(() => {
  const end = filters.dateRange.end
  const start = filters.dateRange.start
  const days = eachDayOfInterval({ start, end })

  const inspectionData = days.map((day) => {
    const formattedDay = format(day, 'yyyy-MM-dd')
    const match = inspectionsData.value.find((d) => d.date === formattedDay)
    return match ? match.count : 0
  })

  return [{ name: 'Inspecciones', data: inspectionData }]
})
</script>

<template>
  <v-card flat class="border rounded pa-4 h-100">
    <div class="d-flex justify-space-between align-center mb-6">
      <h3 class="text-h6 font-weight-bold text-uppercase">Evolución</h3>
    </div>
    <apexchart type="line" height="350" :options="lineChartOptions" :series="series"></apexchart>
  </v-card>
</template>
