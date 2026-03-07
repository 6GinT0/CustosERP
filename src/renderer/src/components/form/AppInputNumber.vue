<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps<{
  name: string
  label: string
  initialValue?: number
}>()

const { value, errorMessage } = useField(props.name, undefined, {
  initialValue: props.initialValue || undefined
})
</script>

<template>
  <v-number-input
    v-model="value"
    :label="label"
    :error-messages="errorMessage"
    variant="outlined"
  />
</template>
