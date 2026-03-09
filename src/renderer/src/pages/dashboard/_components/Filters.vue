<script setup lang="ts">
import { reactive, computed } from 'vue'
import { startOfDay, subDays } from 'date-fns'
import { useDatabase } from '@renderer/composables/useDatabase'
import { useFilters } from '../_composables/useFilters'

const { taxonomies, companies, professionals } = useDatabase()
const { filters: syncFilters } = useFilters()

const filters = reactive({
  dateRange: {
    start: subDays(new Date(), 30),
    end: startOfDay(new Date())
  },
  area: null as number | null,
  sector: null as number | null,
  reason: null as number | null,
  company: null as number | null,
  professional: null as number | null
})

const areaSelect = computed(() => {
  return taxonomies.value
    .filter((t) => t.type === 'AREA')
    .map((t) => ({ title: t.name, value: t.id }))
})

const sectorSelect = computed(() => {
  return taxonomies.value
    .filter((t) => t.type === 'SECTOR')
    .map((t) => ({ title: t.name, value: t.id }))
})

const reasonSelect = computed(() => {
  return taxonomies.value
    .filter((t) => t.type === 'REASON')
    .map((t) => ({ title: t.name, value: t.id }))
})

const companySelect = computed(() => {
  return companies.value.map((c) => ({ title: c.fantasy_name, value: c.id }))
})

const professionalSelect = computed(() => {
  return professionals.value.map((p) => ({ title: p.fullname, value: p.id }))
})

function syncFiltersFn() {
  syncFilters.dateRange.start = filters.dateRange.start
  syncFilters.dateRange.end = filters.dateRange.end
  syncFilters.area = filters.area
  syncFilters.sector = filters.sector
  syncFilters.reason = filters.reason
  syncFilters.company = filters.company
  syncFilters.professional = filters.professional
}

function resetFiltersFn() {
  filters.dateRange.start = subDays(new Date(), 30)
  filters.dateRange.end = startOfDay(new Date())
  filters.area = null
  filters.sector = null
  filters.reason = null
  filters.company = null
  filters.professional = null

  syncFiltersFn()
}
</script>

<template>
  <v-menu flat :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn
        icon="mdi-filter"
        color="indigo-darken-3"
        variant="tonal"
        size="small"
        v-bind="props"
      ></v-btn>
    </template>
    <v-card flat class="pa-4 menu-inset border rounded elevation-0 mt-2 mr-2">
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-date-input
              v-model="filters.dateRange.start"
              prepend-icon=""
              persistent-placeholder
              label="Desde"
              variant="outlined"
              density="compact"
              hide-details
            ></v-date-input>
          </v-col>

          <v-col cols="6">
            <v-date-input
              v-model="filters.dateRange.end"
              prepend-icon=""
              persistent-placeholder
              label="Hasta"
              variant="outlined"
              density="compact"
              hide-details
            ></v-date-input>
          </v-col>

          <v-col cols="6">
            <v-select
              v-model="filters.area"
              label="Zona"
              variant="outlined"
              density="compact"
              :items="areaSelect"
              :selected-type="null"
              hide-details
            >
            </v-select>
          </v-col>

          <v-col cols="6">
            <v-select
              v-model="filters.sector"
              label="Rubro"
              variant="outlined"
              density="compact"
              :items="sectorSelect"
              :selected-type="null"
              hide-details
            >
            </v-select>
          </v-col>

          <v-col cols="6">
            <v-select
              v-model="filters.reason"
              label="Motivo"
              variant="outlined"
              density="compact"
              :items="reasonSelect"
              :selected-type="null"
              hide-details
            >
            </v-select>
          </v-col>

          <v-col cols="6">
            <v-select
              v-model="filters.company"
              label="Empresa"
              variant="outlined"
              density="compact"
              :items="companySelect"
              :selected-type="null"
              hide-details
            >
            </v-select>
          </v-col>

          <v-col cols="6">
            <v-select
              v-model="filters.professional"
              label="Profesional"
              variant="outlined"
              density="compact"
              :items="professionalSelect"
              :selected-type="null"
              hide-details
            >
            </v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="border-t d-flex justify-end align-center">
        <v-btn variant="flat" color="grey-lighten-3" @click="resetFiltersFn"> Cancelar </v-btn>
        <v-btn color="indigo-darken-3" variant="flat" @click="syncFiltersFn">
          Aplicar Filtros
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<style scoped>
.menu-inset {
  min-width: 350px;
}
</style>
