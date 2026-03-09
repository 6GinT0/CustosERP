<script setup lang="ts">
import { useFilters } from './_composables/useFilters'
import Filters from './_components/Filters.vue'
import Card from './_components/Card.vue'
import ChartInspection from './_components/ChartInspection.vue'
import ChartDistribution from './_components/ChartDistribution.vue'
import ChartHeatmapCompliance from './_components/ChartHeatmapCompliance.vue'
import DataTable from './_components/DataTable.vue'

const {
  mostFrequentReason,
  totalInspections,
  totalVisits,
  compliancePercentage,
  recentInspections
} = useFilters()
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col class="d-flex justify-end ga-4">
        <Filters />
        <v-divider inset vertical></v-divider>
        <v-btn
          variant="flat"
          color="indigo-darken-3"
          size="small"
          to="/inspections/add"
          icon="mdi-plus"
        ></v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <Card
          title="Total Visitas"
          :resume="totalVisits"
          icon="mdi-account-group"
          color="indigo-darken-3"
          border="blue"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <Card
          title="Total Inspecciones"
          :resume="totalInspections"
          icon="mdi-file-document-check"
          color="green-lighten-3"
          border="green"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <Card
          title="Motivo más frecuente"
          :resume="mostFrequentReason || 'N/A'"
          icon="mdi-alert-decagram"
          color="orange-lighten-3"
          border="orange"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <Card
          title="% Cumplimiento"
          :resume="`${compliancePercentage}%`"
          icon="mdi-percent"
          color="teal-lighten-3"
          border="teal"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8">
        <ChartInspection />
      </v-col>
      <v-col cols="12" md="4">
        <ChartDistribution />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <ChartHeatmapCompliance />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <DataTable :items="recentInspections" />
      </v-col>
    </v-row>
  </v-container>
</template>
