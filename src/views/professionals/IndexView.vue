<script setup lang="ts">
import { useProfessionalDataTable } from '@/composables/useProfessionalDataTable'
import TaxonomyConfirmDialog from '@/components/taxonomies/TaxonomyConfirmDialog.vue'
import TaxonomyConfirmBulkDialog from '@/components/taxonomies/TaxonomyConfirmBulkDialog.vue'
import { convertFileSrc } from '@tauri-apps/api/core'

const {
  search,
  selected,
  professionals,
  professionalData,
  isDialogOpen,
  openAction,
  openManyAction,
  cancelAction,
  deleteAction,
  deleteManyAction,
} = useProfessionalDataTable()

const tableHeaders = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre Completo', key: 'fullName' },
  { title: 'Matrícula', key: 'tuitionNumber' },
  { title: 'Firma', key: 'signaturePath', sortable: false },
  { title: 'Acciones', key: 'actions', align: 'end' as const, sortable: false },
]
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card flat class="border border-opacity-10">
          <v-data-table
            v-model:search="search"
            v-model="selected"
            :filter-keys="['fullName', 'tuitionNumber']"
            :headers="tableHeaders"
            :items="professionals"
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

                <v-tooltip text="Agregar Profesional" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-plus"
                      size="small"
                      flat
                      class="border border-opacity-10"
                      @click="$router.push('/professionals/add')"
                    ></v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Eliminar seleccionados" location="bottom">
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

            <template v-slot:item.signaturePath="{ item }">
              <v-avatar v-if="item.signaturePath" size="40" rounded="0">
                <v-img :src="convertFileSrc(item.signaturePath)" contain />
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
                  @click="$router.push('/professionals/edit/' + item.id)"
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

            <template v-slot:no-data> No hay profesionales disponibles. </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <TaxonomyConfirmDialog
    label="Profesional"
    v-if="professionalData"
    :item="professionalData"
    v-model:is-dialog-open="isDialogOpen"
    @cancel="cancelAction"
    @confirm="deleteAction"
  />

  <TaxonomyConfirmBulkDialog
    label="Profesional"
    v-if="selected.length > 0"
    :items="selected"
    v-model:is-dialog-open="isDialogOpen"
    @cancel="cancelAction"
    @confirm="deleteManyAction"
  />
</template>
