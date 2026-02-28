<script setup lang="ts">
import { useCompanyDataTable } from '@/composables/useCompanyDataTable'
import TaxonomyConfirmDialog from '@/components/taxonomies/TaxonomyConfirmDialog.vue'
import TaxonomyConfirmBulkDialog from '@/components/taxonomies/TaxonomyConfirmBulkDialog.vue'
import { openUrl } from '@tauri-apps/plugin-opener'

const {
  search,
  selected,
  companies,
  companyData,
  isDialogOpen,
  openAction,
  openManyAction,
  cancelAction,
  deleteAction,
  deleteManyAction,
} = useCompanyDataTable()

const tableHeaders = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'fantasyName' },
  { title: 'CUIT', key: 'cuit' },
  { title: 'Razón Social', key: 'socialReason' },
  { title: 'Número Social', key: 'socialNumber' },
  { title: 'Dirección', key: 'address' },
  { title: 'Teléfono', key: 'phone' },
  { title: 'Contacto', key: 'contactName' },
  { title: 'Visitas', key: 'totalVisitsCount' },
  { title: 'Inspecciones', key: 'totalInspectionsCount' },
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
            :filter-keys="[
              'fantasyName',
              'cuit',
              'socialReason',
              'socialNumber',
              'address',
              'phone',
              'contactName',
              'totalVisitsCount',
              'totalInspectionsCount',
            ]"
            :headers="tableHeaders"
            :items="companies"
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

                <v-tooltip text="Agregar Empresa" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-plus"
                      size="small"
                      flat
                      class="border border-opacity-10"
                      @click="$router.push('/companies/add')"
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

            <template v-slot:item.address="{ item }">
              <v-btn
                color="primary"
                size="small"
                variant="tonal"
                @click="
                  openUrl(
                    'https://www.google.com/maps/search/?api=1&query=' +
                      item.latitude +
                      ',' +
                      item.longitude,
                  )
                "
              >
                Abrir en Google Maps
              </v-btn>
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="d-flex ga-2 justify-end">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  color="medium-emphasis"
                  variant="text"
                  @click="$router.push('/companies/edit/' + item.id)"
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

            <template v-slot:no-data> No hay empresas disponibles. </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <TaxonomyConfirmDialog
    label="Empresa"
    v-if="companyData"
    :item="companyData"
    v-model:is-dialog-open="isDialogOpen"
    @cancel="cancelAction"
    @confirm="deleteAction"
  />

  <TaxonomyConfirmBulkDialog
    label="Empresa"
    v-if="selected.length > 0"
    :items="selected"
    v-model:is-dialog-open="isDialogOpen"
    @cancel="cancelAction"
    @confirm="deleteManyAction"
  />
</template>
