<script setup lang="ts">
import { computed } from 'vue'
import { TAXONOMY_METADATA, type TaxonomySlug } from '@/constants/taxonomies'

const props = defineProps<{
  action: 'create' | 'edit'
  type?: TaxonomySlug
  item: any
}>()

const isOpen = defineModel<boolean>('isDialogOpen')
const emits = defineEmits(['cancel', 'confirm'])

const title = computed(() => {
  const { label, gender } = props.type
    ? TAXONOMY_METADATA[props.type]
    : { label: 'Registro', gender: 'm' }

  if (props.action === 'create') {
    return gender === 'f' ? `Nueva ${label}` : `Nuevo ${label}`
  }

  return `Editar ${label}`
})

const actionText = computed(() => (props.action === 'create' ? 'Guardar' : 'Actualizar'))
</script>

<template>
  <v-dialog v-model="isOpen" max-width="500px">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>
        <slot name="form" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" @click="$emit('cancel')">Cancelar</v-btn>
        <v-btn color="indigo-darken-3" variant="flat" @click="$emit('confirm')">
          {{ actionText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
