<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps<{
  name: string
  type: string
  label: string
  placeholder?: string
  initialValue?: string
}>()

const { value, errorMessage } = useField(props.name, undefined, {
  initialValue: props.initialValue || undefined
})
</script>

<template>
  <v-text-field
    v-model="value"
    :label="label"
    :type="type"
    :placeholder="placeholder"
    persistent-placeholder
    :error-messages="errorMessage"
    variant="outlined"
  />
</template>
