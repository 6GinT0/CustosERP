<script setup lang="ts">
defineProps<{
  label: string
  item: any | null
}>()

const isOpen = defineModel<boolean>('isDialogOpen')
const emits = defineEmits(['cancel', 'confirm'])
</script>

<template>
  <v-dialog v-model="isOpen" max-width="450px" persistent>
    <v-card class="pa-4 rounded-lg">
      <v-card-title class="d-flex align-center ga-2 pt-6 px-6">
        <v-icon color="error" icon="mdi-alert-circle-outline"></v-icon>
        <span class="text-h6 font-weight-bold"> Eliminar {{ label }} </span>
      </v-card-title>

      <v-card-text class="pt-4 px-6 text-body-1">
        ¿Estás seguro de que deseas eliminar este registro?
        <div
          v-if="item?.name"
          class="mt-2 pa-3 bg-grey-lighten-4 rounded font-weight-medium text-uppercase"
        >
          {{ item.name }}
        </div>
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
