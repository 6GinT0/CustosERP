<script setup lang="ts">
import { useInspectionDataTable } from '@/composables/useInspectionDataTable'
import TaxonomyConfirmDialog from '@/components/taxonomies/TaxonomyConfirmDialog.vue'
import TaxonomyConfirmBulkDialog from '@/components/taxonomies/TaxonomyConfirmBulkDialog.vue'
import { useDatabase } from '@/composables/useDatabase'
import { convertFileSrc } from '@tauri-apps/api/core'

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
  deleteManyAction,
} = useInspectionDataTable()

const { companies, professionals, taxonomies } = useDatabase()

const tableHeaders = [
  { title: 'ID', key: 'id' },
  { title: 'Fecha', key: 'date' },
  { title: 'Empresa', key: 'companyId' },
  { title: 'Profesional', key: 'professionalId' },
  { title: 'Zona', key: 'areaId' },
  { title: 'Actividad', key: 'sectorId' },
  { title: 'Motivo', key: 'reasonId' },
  { title: 'ART', key: 'art' },
  { title: 'Horarios', key: 'workSchedule' },
  { title: 'Firma del cliente', key: 'signatureCustomerPath' },
  { title: 'Acciones', key: 'actions', align: 'end' as const, sortable: false },
]

function getCompany(id: number) {
  return companies.value.find((c) => c.id === id)?.fantasyName ?? 'S/D'
}

function getProfessional(id: number) {
  return professionals.value.find((p) => p.id === id)?.fullName ?? 'S/D'
}

function getTaxonomy(id: number) {
  return taxonomies.value.find((t) => t.id === id)!.name
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}
</script>

<template>
  <v-container>
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
            <template v-slot:top>
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
                  <template v-slot:activator="{ props }">
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
                  <template v-slot:activator="{ props: tooltipProps }">
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

            <template v-slot:item.date="{ item }">
              {{ formatDate(item.date) }}
            </template>

            <template v-slot:item.companyId="{ item }">
              {{ getCompany(item.companyId) }}
            </template>

            <template v-slot:item.professionalId="{ item }">
              {{ getProfessional(item.professionalId) }}
            </template>

            <template v-slot:item.areaId="{ item }">
              <v-chip size="small" color="indigo">
                {{ getTaxonomy(item.areaId!) }}
              </v-chip>
            </template>

            <template v-slot:item.sectorId="{ item }">
              <v-chip size="small" color="teal">
                {{ getTaxonomy(item.sectorId!) }}
              </v-chip>
            </template>

            <template v-slot:item.reasonId="{ item }">
              <v-chip size="small" color="orange">
                {{ getTaxonomy(item.reasonId!) }}
              </v-chip>
            </template>

            <template v-slot:item.signatureCustomerPath="{ item }">
              <v-avatar v-if="item.signatureCustomerPath" size="40" rounded="0">
                <v-img :src="convertFileSrc(item.signatureCustomerPath)" contain />
              </v-avatar>
              <span v-else class="text-caption text-grey">Sin firma</span>
            </template>

            <template v-slot:item.actions="{ item }">
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

            <template v-slot:no-data> No hay inspecciones disponibles. </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <TaxonomyConfirmDialog
    label="Inspección"
    v-if="inspectionData"
    :item="inspectionData"
    v-model:is-dialog-open="isDialogOpen"
    @cancel="cancelAction"
    @confirm="deleteAction"
  />

  <TaxonomyConfirmBulkDialog
    label="Inspección"
    v-if="selected.length > 0"
    :items="selected"
    v-model:is-dialog-open="isDialogOpen"
    @cancel="cancelAction"
    @confirm="deleteManyAction"
  />
</template>
