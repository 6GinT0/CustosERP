<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps<{
  name: string
  label: string
  options: {
    title: string
    value: any
  }[]
  selectedType: any
}>()

const { value, errorMessage, handleChange, handleBlur } = useField(props.name, (value) => !!value, {
  initialValue: props.selectedType
})
</script>

<template>
  <v-select
    v-model="value"
    :label="label"
    :items="options"
    variant="outlined"
    :error-messages="errorMessage"
    class="text-uppercase"
    @change="handleChange"
    @blur="handleBlur"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}" />
    </template>
  </v-select>
</template>
