<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps<{
  name: string
  type: string
  label: string
}>()

const { value, errorMessage } = useField(props.name)
</script>

<template>
  <v-text-field
    v-model="value"
    :label="label"
    :type="type"
    :error-messages="errorMessage"
    variant="outlined"
  />
</template>
