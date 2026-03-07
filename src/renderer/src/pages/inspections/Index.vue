<script setup lang="ts">
import { useDatabase } from '@renderer/composables/useDatabase'
import { useInspectionDataTable } from './_composables/useInspectionDataTable'
import ConfirmDeleteDialog from '@renderer/components/form/actions/ConfirmDeleteDialog.vue'
import ConfirmBulkDialog from '@renderer/components/form/actions/ConfirmBulkDialog.vue'

const {
  search,
  selected,
  inspections,
  inspectionData,
  isDialogOpen,
  openAction,
  openManyAction,
  cancelAction,
  deleteAction,
  deleteManyAction
} = useInspectionDataTable()

const { companies, professionals, taxonomies } = useDatabase()

const tableHeaders = [
  { title: 'ID', key: 'id' },
  { title: 'Fecha', key: 'date' },
  { title: 'Empresa', key: 'company_id' },
  { title: 'Profesional', key: 'professional_id' },
  { title: 'Zona', key: 'area_id' },
  { title: 'Actividad', key: 'sector_id' },
  { title: 'Motivo', key: 'reason_id' },
  { title: 'ART', key: 'art' },
  { title: 'Horarios', key: 'work_schedule' },
  { title: 'Firma del cliente', key: 'signature_customer_path' },
  { title: 'Visita', key: 'total_visits_count' },
  { title: 'Nro. Insp.', key: 'total_inspections_count' },
  { title: 'Acciones', key: 'actions', align: 'end' as const, sortable: false }
]

function getCompany(id: number) {
  return companies.value.find((c) => c.id === id)?.fantasy_name ?? 'S/D'
}

function getProfessional(id: number) {
  return professionals.value.find((p) => p.id === id)?.fullname ?? 'S/D'
}

function getTaxonomy(id: number) {
  return taxonomies.value.find((t) => t.id === id)!.name
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card flat class="border border-opacity-10">
          <v-data-table
            v-model:search="search"
            v-model="selected"
            :headers="tableHeaders"
            :items="inspections"
            class="elevation-0"
            show-select
          >
            <template #top>
              <v-card
                flat
                class="bg-white pa-4 border-b border-medium-emphasis d-flex align-center"
              >
                <v-text-field
                  v-model="search"
                  density="compact"
                  label="Buscar"
                  prepend-inner-icon="mdi-magnify"
                  variant="solo-filled"
                  flat
                  hide-details
                  single-line
                  max-width="200"
                  class="mr-4"
                ></v-text-field>

                <v-spacer></v-spacer>

                <v-tooltip text="Agregar Inspección" location="bottom">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-plus"
                      size="small"
                      flat
                      class="border border-opacity-10"
                      @click="$router.push('/inspections/add')"
                    ></v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Eliminar seleccionadas" location="bottom">
                  <template #activator="{ props: tooltipProps }">
                    <v-btn
                      v-bind="tooltipProps"
                      icon="mdi-delete"
                      size="small"
                      flat
                      color="error"
                      class="ml-2"
                      :disabled="!selected || selected.length === 0"
                      @click="openManyAction"
                    ></v-btn>
                  </template>
                </v-tooltip>
              </v-card>
            </template>

            <template #item.date="{ item }">
              {{ formatDate(item.date) }}
            </template>

            <template #item.company_id="{ item }">
              {{ getCompany(item.company_id) }}
            </template>

            <template #item.professional_id="{ item }">
              {{ getProfessional(item.professional_id) }}
            </template>

            <template #item.area_id="{ item }">
              <v-chip size="small" color="indigo" class="text-uppercase">
                {{ getTaxonomy(item.area_id!) }}
              </v-chip>
            </template>

            <template #item.sector_id="{ item }">
              <v-chip size="small" color="teal" class="text-uppercase">
                {{ getTaxonomy(item.sector_id!) }}
              </v-chip>
            </template>

            <template #item.reason_id="{ item }">
              <v-chip size="small" color="orange" class="text-uppercase">
                {{ getTaxonomy(item.reason_id!) }}
              </v-chip>
            </template>

            <template #item.signature_customer_path="{ item }">
              <v-avatar v-if="item.signature_customer_path" size="40" rounded="0">
                <v-img :src="'app-data://' + item.signature_customer_path" contain />
              </v-avatar>
              <span v-else class="text-caption text-grey">Sin firma</span>
            </template>

            <template #item.actions="{ item }">
              <div class="d-flex ga-2 justify-end">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  color="medium-emphasis"
                  variant="text"
                  @click="$router.push('/inspections/edit/' + item.id)"
                ></v-btn>

                <v-btn
                  icon="mdi-delete"
                  size="small"
                  color="medium-emphasis"
                  variant="text"
                  @click="openAction(item)"
                ></v-btn>
              </div>
            </template>

            <template #no-data> No hay inspecciones disponibles. </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <ConfirmDeleteDialog
    v-if="inspectionData"
    v-model:is-dialog-open="isDialogOpen"
    label="Inspección"
    :item="inspectionData"
    @cancel="cancelAction"
    @confirm="deleteAction"
  />

  <ConfirmBulkDialog
    v-if="selected.length > 0"
    v-model:is-dialog-open="isDialogOpen"
    label="Inspección"
    :items="selected"
    @cancel="cancelAction"
    @confirm="deleteManyAction"
  />
</template>
