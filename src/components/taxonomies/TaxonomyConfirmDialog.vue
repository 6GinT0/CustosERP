<script setup lang="ts">
import type { Taxonomy } from '@/types/Taxonomy'

type Props = {
  label: string
  action: 'remove' | 'removeMany' | string
  item: Taxonomy | null
  items: number[]
}

defineProps<Props>()

const isOpen = defineModel<boolean>('isDialogOpen')
const emits = defineEmits(['cancel', 'confirm'])
</script>

<template>
  <v-dialog v-model="isOpen" max-width="450px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="d-flex align-center ga-2 pt-6 px-6">
        <v-icon color="error" icon="mdi-alert-circle-outline"></v-icon>
        <span class="text-h6 font-weight-bold">
          Eliminar {{ action === 'removeMany' ? 'registros' : label }}
        </span>
      </v-card-title>

      <v-card-text class="pt-4 px-6 text-body-1">
        <template v-if="action === 'removeMany'">
          ¿Estás seguro de que deseas eliminar los
          <span class="font-weight-bold text-error">{{ items.length }}</span> registros
          seleccionados?
        </template>
        <template v-else>
          ¿Estás seguro de que deseas eliminar este registro?
          <div v-if="item?.name" class="mt-2 pa-3 bg-grey-lighten-4 rounded font-weight-medium">
            {{ item.name }}
          </div>
        </template>
        <p class="text-caption text-medium-emphasis mt-4">
          Esta acción es permanente y no se puede deshacer.
        </p>
      </v-card-text>

      <v-card-actions class="pa-6 pt-2">
        <v-spacer />
        <v-btn variant="text" @click="emits('cancel')"> Cancelar </v-btn>
        <v-btn color="error" variant="flat" @click="emits('confirm')"> Eliminar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
