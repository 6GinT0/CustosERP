<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFilters } from '../_composables/useFilters'

const { distributionData } = useFilters()

const pieTab = ref('zona')

const pieOptions = (title: string, labels: string[]) => ({
  chart: { type: 'donut' },
  labels: labels,
  title: { text: title, align: 'center', style: { fontSize: '14px', fontWeight: 'bold' } },
  legend: { position: 'bottom' },
  dataLabels: { enabled: true, formatter: (val: number) => `${val.toFixed(0)}%` },
  plotOptions: { pie: { donut: { size: '65%' } } }
})

const areaPie = computed(() => {
  const d = distributionData.value.areas
  return {
    series: d.map((x) => x.count),
    options: pieOptions(
      'Distribución por Zona',
      d.map((x) => x.name.toUpperCase())
    )
  }
})

const sectorPie = computed(() => {
  const d = distributionData.value.sectors
  return {
    series: d.map((x) => x.count),
    options: pieOptions(
      'Distribución por Rubro',
      d.map((x) => x.name.toUpperCase())
    )
  }
})

const reasonPie = computed(() => {
  const d = distributionData.value.reasons
  return {
    series: d.map((x) => x.count),
    options: pieOptions(
      'Distribución por Motivo',
      d.map((x) => x.name.toUpperCase())
    )
  }
})
</script>

<template>
  <v-card flat class="border rounded pa-4 h-100">
    <v-tabs
      v-model="pieTab"
      density="comfortable"
      color="primary"
      grow
      slider-color="primary"
      class="mb-4"
    >
      <v-tab value="zona">Zona</v-tab>
      <v-tab value="rubro">Rubro</v-tab>
      <v-tab value="motivo">Motivo</v-tab>
    </v-tabs>

    <v-window v-model="pieTab">
      <v-window-item value="zona">
        <apexchart
          type="donut"
          height="350"
          :options="areaPie.options"
          :series="areaPie.series"
        ></apexchart>
      </v-window-item>
      <v-window-item value="rubro">
        <apexchart
          type="donut"
          height="350"
          :options="sectorPie.options"
          :series="sectorPie.series"
        ></apexchart>
      </v-window-item>
      <v-window-item value="motivo">
        <apexchart
          type="donut"
          height="350"
          :options="reasonPie.options"
          :series="reasonPie.series"
        ></apexchart>
      </v-window-item>
    </v-window>
  </v-card>
</template>
