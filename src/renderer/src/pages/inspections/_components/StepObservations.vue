<script setup lang="ts">
import { onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { observationsSchema } from '@renderer/schemas/inspection.schema'
import { toTypedSchema } from '@vee-validate/zod'
import AppTextarea from '@renderer/components/form/AppTextarea.vue'

const { validate, values, setValues } = useForm({
  validationSchema: toTypedSchema(observationsSchema)
})

const props = defineProps<{
  initialValues?: any
}>()

defineExpose({
  validateForm: async () => {
    const { valid, errors } = await validate()

    return { valid, errors }
  },
  exposeValues: () => values
})

onMounted(() => {
  if (props.initialValues) {
    setValues(props.initialValues)
  }
})
</script>

<template>
  <v-row class="pa-4">
    <v-col cols="12">
      <AppTextarea
        name="observations"
        label="Observaciones"
        persistent-placeholder
        placeholder="Observaciones"
      />
    </v-col>
    <v-col cols="12">
      <AppTextarea
        name="breach"
        label="Incumplimientos"
        persistent-placeholder
        placeholder="Incumplimientos"
      />
    </v-col>
  </v-row>
</template>
