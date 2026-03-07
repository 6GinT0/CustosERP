<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps<{
  name: string
  label: string
  placeholder?: string
}>()

const { value, errorMessage } = useField(props.name, undefined, {
  initialValue: new Date()
})
</script>

<template>
  <v-date-input
    v-model="value"
    :label="label"
    :placeholder="placeholder"
    prepend-icon=""
    prepend-inner-icon="$calendar"
    persistent-placeholder
    :error-messages="errorMessage"
    variant="outlined"
  ></v-date-input>
</template>
