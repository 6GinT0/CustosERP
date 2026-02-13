<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps<{
  name: string
  label: string
}>()

const { value, errorMessage } = useField(props.name)
</script>

<template>
  <v-textarea v-model="value" :label="label" :error-messages="errorMessage" variant="outlined" />
</template>
