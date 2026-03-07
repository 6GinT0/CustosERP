<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  item?: any
}>()

const isOpen = defineModel<boolean>('isDialogOpen')
const emits = defineEmits(['cancel', 'confirm'])

const title = computed(() => {
  if (props.item) {
    return `Editar ${props.label}`
  }

  return `Nuevo ${props.label}`
})

const actionText = computed(() => (props.item ? 'Actualizar' : 'Guardar'))
</script>

<template>
  <v-dialog v-model="isOpen" max-width="500px">
    <form @submit.prevent="$emit('confirm')">
      <v-card class="pa-4 rounded-lg">
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-subtitle>LLene los campos del formulario.</v-card-subtitle>
        <v-card-text>
          <slot name="form" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn type="button" variant="flat" color="grey-lighten-2" @click="$emit('cancel')">
            Cancelar
          </v-btn>
          <v-btn type="submit" color="indigo-darken-3" variant="flat" @click="$emit('confirm')">
            {{ actionText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </form>
  </v-dialog>
</template>
