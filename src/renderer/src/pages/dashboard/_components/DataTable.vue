<script setup lang="ts">
import { exportInspectionToPdf, isExportingPdf } from '@renderer/composables/usePdfExport'
import { useMessages } from '@renderer/composables/useMessages'

const tableHeaders = [
  { title: 'Fecha', key: 'date' },
  { title: 'Empresa', key: 'company' },
  { title: 'Visita', key: 'visitNumber', align: 'center' as const },
  { title: 'Insp.', key: 'inspectionNumber', align: 'center' as const },
  { title: 'Cumplimiento', key: 'compliance', align: 'center' as const },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' as const }
]

defineProps<{
  items: any[]
}>()

const messages = useMessages()

async function handleExportPdf(item: any) {
  const result = await exportInspectionToPdf(item.id)
  if (result.success) {
    messages.addMessageToQueue('PDF guardado en descargas', 'success')
  } else {
    messages.addMessageToQueue(result.error || 'Error al exportar PDF', 'error')
  }
}
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

      <template #item.actions="{ item }">
        <v-menu>
          <template #activator="{ props }">
            <v-btn
              icon="mdi-dots-vertical"
              size="small"
              color="medium-emphasis"
              variant="text"
              v-bind="props"
            ></v-btn>
          </template>
          <v-list density="compact" nav>
            <v-list-subheader>Exportar</v-list-subheader>
            <v-list-item
              prepend-icon="mdi-file-pdf-box"
              title="Exportar a PDF"
              :loading="isExportingPdf"
              @click="handleExportPdf(item)"
            ></v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
  </v-card>
</template>
