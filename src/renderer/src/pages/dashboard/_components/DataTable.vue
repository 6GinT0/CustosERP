<script setup lang="ts">
const tableHeaders = [
  { title: 'Fecha', key: 'date' },
  { title: 'Empresa', key: 'company' },
  { title: 'Visita', key: 'visitNumber', align: 'center' as const },
  { title: 'Insp.', key: 'inspectionNumber', align: 'center' as const },
  { title: 'Cumplimiento', key: 'compliance', align: 'center' as const }
]

defineProps<{
  items: any[]
}>()
</script>

<template>
  <v-card flat class="border rounded pa-4 h-100">
    <div class="d-flex justify-space-between align-center mb-6">
      <h3 class="text-h6 font-weight-bold text-uppercase">Últimas Inspecciones</h3>
      <v-btn variant="text" color="primary" size="small" to="/inspections"> Ver Historial </v-btn>
    </div>
    <v-data-table
      :headers="tableHeaders"
      :items="items"
      density="comfortable"
      hide-default-footer
      class="bg-transparent"
    >
      <template #item.compliance="{ item }">
        <v-chip
          :color="
            Number(item.compliance.replace('%', '')) > 80
              ? 'success'
              : Number(item.compliance.replace('%', '')) > 50
                ? 'warning'
                : 'error'
          "
          size="small"
          variant="flat"
          class="font-weight-bold"
        >
          {{ item.compliance }}
        </v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>
