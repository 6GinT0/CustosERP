<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps<{
  name: string
  label: string
  placeholder?: string
}>()

const { value, errorMessage } = useField(props.name)
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
    clearable
  ></v-date-input>
</template>
