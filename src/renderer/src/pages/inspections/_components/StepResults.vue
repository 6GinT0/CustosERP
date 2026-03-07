<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useDatabase } from '@renderer/composables/useDatabase'
import { useForm } from 'vee-validate'
import { inspectionResultSchema } from '@renderer/schemas/inspection.schema'
import { toTypedSchema } from '@vee-validate/zod'

const { categoryItems } = useDatabase()
const resultsRef = ref(
  categoryItems.value.map((el) => ({
    category_item_id: el.id,
    name: el.name,
    apply: true,
    compliance: false,
    status: 'No OK'
  }))
)

const props = defineProps<{
  initialValues?: any
}>()

const { validate, values, setValues } = useForm({
  validationSchema: toTypedSchema(inspectionResultSchema)
})

function setStatus(idx: number) {
  if (!resultsRef.value[idx].apply) {
    resultsRef.value[idx].status = 'N/A'
    resultsRef.value[idx].compliance = false

    return
  }

  resultsRef.value[idx].status = resultsRef.value[idx].compliance ? 'OK' : 'No OK'
}

defineExpose({
  validateForm: async () => {
    const { valid, errors } = await validate()

    return { valid, errors }
  },
  exposeValues: () => values
})

watch(
  resultsRef,
  () => {
    setValues({
      results: resultsRef.value.map((el) => ({
        category_item_id: el.category_item_id,
        status: el.status as 'N/A' | 'No OK' | 'OK'
      }))
    })
  },
  { deep: true, immediate: true }
)

onMounted(() => {
  if (props.initialValues) {
    setValues(props.initialValues)

    const results = props.initialValues.results

    results.forEach((result: { category_item_id: any; status: any }) => {
      const index = resultsRef.value.findIndex(
        (el) => el.category_item_id === result.category_item_id
      )

      if (index !== -1) {
        resultsRef.value[index].status = result.status
        resultsRef.value[index].apply = result.status !== 'N/A'
        resultsRef.value[index].compliance = result.status === 'OK'
      }
    })

    setValues({
      results: resultsRef.value.map((el) => ({
        category_item_id: el.category_item_id,
        status: el.status as 'N/A' | 'No OK' | 'OK'
      }))
    })
  }
})
</script>

<template>
  <v-row class="pa-4">
    <v-col cols="12">
      <v-table class="w-100">
        <thead>
          <tr>
            <th>Item</th>
            <th>Aplica</th>
            <th>Cumplimiento</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in resultsRef" :key="index">
            <td class="text-uppercase">{{ item.name }}</td>
            <td>
              <v-checkbox v-model="item.apply" @update:model-value="setStatus(index)"></v-checkbox>
            </td>
            <td>
              <v-checkbox
                v-model="item.compliance"
                :disabled="!item.apply"
                @update:model-value="setStatus(index)"
              ></v-checkbox>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
    <v-col cols="12">
      <input type="hidden" name="results" />
    </v-col>
  </v-row>
</template>
