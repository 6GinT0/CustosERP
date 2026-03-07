<script setup lang="ts">
import { useCompanyDataTable } from './_composables/useCompanyDataTable'
import ConfirmDeleteDialog from '@renderer/components/form/actions/ConfirmDeleteDialog.vue'
import ConfirmBulkDialog from '@renderer/components/form/actions/ConfirmBulkDialog.vue'

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
  deleteManyAction
} = useCompanyDataTable()

const tableHeaders = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'fantasy_name' },
  { title: 'CUIT', key: 'cuit' },
  { title: 'Razón Social', key: 'social_reason' },
  { title: 'Número Social', key: 'social_number' },
  { title: 'Dirección', key: 'address' },
  { title: 'Teléfono', key: 'phone' },
  { title: 'Contacto', key: 'contact_name' },
  { title: 'Acciones', key: 'actions', align: 'end' as const, sortable: false }
]
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card flat class="border border-opacity-10">
          <v-data-table
            v-model:search="search"
            v-model="selected"
            :filter-keys="[
              'fantasy_name',
              'cuit',
              'social_reason',
              'social_number',
              'address',
              'phone',
              'contact_name'
            ]"
            :headers="tableHeaders"
            :items="companies"
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

                <v-tooltip text="Agregar Empresa" location="bottom">
                  <template #activator="{ props }">
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

            <template #item.address="{ item }">
              <v-btn
                color="primary"
                icon="mdi-map-marker"
                size="small"
                variant="tonal"
                :href="
                  'https://www.google.com/maps/search/?api=1&query=' +
                  item.latitude +
                  ',' +
                  item.longitude
                "
                target="_blank"
                rel="noopener noreferrer"
              />
            </template>

            <template #item.actions="{ item }">
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

            <template #no-data> No hay empresas disponibles. </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <ConfirmDeleteDialog
    v-if="companyData"
    v-model:is-dialog-open="isDialogOpen"
    label="Empresa"
    :item="companyData"
    @cancel="cancelAction"
    @confirm="deleteAction"
  />

  <ConfirmBulkDialog
    v-if="selected.length > 0"
    v-model:is-dialog-open="isDialogOpen"
    label="Empresa"
    :items="selected"
    @cancel="cancelAction"
    @confirm="deleteManyAction"
  />
</template>
