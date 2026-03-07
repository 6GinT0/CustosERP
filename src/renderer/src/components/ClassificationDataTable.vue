<script setup lang="ts">
const props = defineProps<{
  headers: any[]
  items: any[]
  filterKeys: string[]
  isLoading: boolean
}>()

const search = defineModel('search', { type: String })
const selected = defineModel('selected', { type: Array })

const emits = defineEmits(['create', 'edit', 'remove', 'removeMany'])
</script>

<template>
  <v-card flat class="border border-opacity-10">
    <v-data-table
      v-model:search="search"
      v-model="selected"
      :filter-keys="filterKeys"
      :headers="headers"
      :items="items"
      :loading="isLoading"
      loading-text="Cargando taxonomías..."
      class="elevation-0"
      show-select
    >
      <template #top>
        <v-card flat class="bg-white pa-4 border-b border-medium-emphasis d-flex align-center">
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

          <v-tooltip text="Agregar Taxonomía" location="bottom">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-plus"
                size="small"
                flat
                class="border border-opacity-10"
                @click="$emit('create')"
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
                @click="$emit('removeMany', selected)"
              ></v-btn>
            </template>
          </v-tooltip>
        </v-card>
      </template>
      <template v-for="(_, name) in $slots as any" #[name]="slotProps: any">
        <slot :name="name" v-bind="slotProps" />
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-btn
            icon="mdi-pencil"
            size="small"
            color="medium-emphasis"
            variant="text"
            @click="$emit('edit', item)"
          ></v-btn>

          <v-btn
            icon="mdi-delete"
            size="small"
            color="medium-emphasis"
            variant="text"
            @click="$emit('remove', item)"
          ></v-btn>
        </div>
      </template>

      <template #no-data> No hay taxonomías disponibles. </template>
    </v-data-table>
  </v-card>
</template>
